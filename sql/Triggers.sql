Use OFS;

-- Triggers For Logging Tables

DELIMITER $$

-- Log low stock after update
CREATE TRIGGER LowStockUpdate
AFTER UPDATE ON Inventory
FOR EACH ROW
BEGIN
    IF NEW.Quantity < 5 THEN
        IF NOT EXISTS (SELECT 1 FROM LowStockLog WHERE ItemID = NEW.ItemID) THEN
            INSERT INTO LowStockLog (ItemID, EventDate)
            VALUES (NEW.ItemID, NOW());
        END IF;
    ELSE
        DELETE FROM LowStockLog WHERE ItemID = NEW.ItemID;
    END IF;
END$$

-- Log low stock after insert
CREATE TRIGGER LowStockInsert
AFTER INSERT ON Inventory
FOR EACH ROW
BEGIN
    IF NEW.Quantity < 5 THEN
        IF NOT EXISTS (SELECT 1 FROM LowStockLog WHERE ItemID = NEW.ItemID) THEN
            INSERT INTO LowStockLog (ItemID, EventDate)
            VALUES (NEW.ItemID, NOW());
        END IF;
    END IF;
END$$

-- Remove Items That Are Within Three Day Expiration Window After Update
CREATE TRIGGER RemoveFromNearExpiration
AFTER UPDATE ON Inventory
FOR EACH ROW
BEGIN
    IF DATEDIFF(NEW.Expiration, CURDATE()) > 3 THEN
        DELETE FROM NearExpiration
        WHERE ItemID = NEW.ItemID;
    END IF;
END$$

-- Track Faulty Robots After Update
CREATE TRIGGER FaultyRobotUpdate
AFTER UPDATE ON Robot
FOR EACH ROW
BEGIN
    IF NEW.RobotStatus = 'Broken' THEN
        INSERT INTO FaultyRobots (RobotID, EventDate, Cause)
        VALUES (NEW.RobotID, NOW(), 'Broken')
        ON DUPLICATE KEY UPDATE EventDate = NOW(), Cause = 'Broken';

    ELSEIF NEW.RobotStatus = 'Maintenance' THEN
        INSERT INTO FaultyRobots (RobotID, EventDate, Cause)
        VALUES (NEW.RobotID, NOW(), 'Needs Maintenance')
        ON DUPLICATE KEY UPDATE EventDate = NOW(), Cause = 'Needs Maintenance';

    ELSE
        DELETE FROM FaultyRobots WHERE RobotID = NEW.RobotID;
    END IF;
END$$

-- Make Sure The Quantity Doesn't Go Negative
CREATE TRIGGER Inventory_Quantity_NonNegative 
BEFORE UPDATE ON Inventory
FOR EACH ROW
BEGIN
    IF NEW.Quantity < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quantity cannot be negative';
    END IF;
END$$

-- Track Faulty Robots After Insert
CREATE TRIGGER FaultyRobotInsert
AFTER INSERT ON Robot
FOR EACH ROW
BEGIN
    IF NEW.RobotStatus = 'Broken' THEN
        IF NOT EXISTS (
            SELECT 1 FROM FaultyRobots 
            WHERE RobotID = NEW.RobotID AND Cause = 'Broken'
        ) THEN
            INSERT INTO FaultyRobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Broken');
        END IF;

    ELSEIF NEW.RobotStatus = 'Maintenance' THEN
        IF NOT EXISTS (
            SELECT 1 FROM FaultyRobots 
            WHERE RobotID = NEW.RobotID AND Cause = 'Needs Maintenance'
        ) THEN
            INSERT INTO FaultyRobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Needs Maintenance');
        END IF;

    ELSE
        DELETE FROM FaultyRobots WHERE RobotID = NEW.RobotID;
    END IF;
END$$

-- Turn On The Event Scheduler
SET GLOBAL event_scheduler = ON;

-- Delete Expired Transactions If Stripe Failed Webhook Post
CREATE EVENT IF NOT EXISTS delete_expired_transactions
ON SCHEDULE EVERY 20 MINUTE
DO
BEGIN

    UPDATE Inventory
    JOIN TransactionItems ON Inventory.ItemID = TransactionItems.ItemID
    JOIN Transactions ON TransactionItems.TransactionID = Transactions.TransactionID
    SET Inventory.Quantity = Inventory.Quantity + TransactionItems.Quantity
    WHERE (Transactions.TransactionStatus = 'In Progress')
      AND Transactions.TransactionDate < NOW() - INTERVAL 45 MINUTE;

    DELETE FROM Transactions
    WHERE TransactionStatus = 'In Progress'
      AND TransactionDate < NOW() - INTERVAL 45 MINUTE;

    DELETE FROM ShoppingCart
    WHERE CustomerID NOT IN (
        SELECT CustomerID FROM Transactions
    );

END$$

-- Every Day Check For Expired Items
CREATE EVENT IF NOT EXISTS NearExpiration
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    INSERT INTO NearExpiration(ItemID)
    SELECT ItemID
    FROM Inventory
    WHERE DATEDIFF(Expiration, CURDATE()) <= 3
    AND ItemID NOT IN (SELECT ItemID FROM NearExpiration);
END$$

-- Every Five Minutes Make Sure That The Robot Optmistically Finishes Delivery
CREATE EVENT IF NOT EXISTS failed_robots
ON SCHEDULE EVERY 5 MINUTE
DO
BEGIN

    UPDATE Transactions
    SET TransactionStatus = 'Fulfilled'
    WHERE TransactionStatus = 'Delivering'
      AND RobotID IN (
          SELECT RobotID 
          FROM Robot 
          WHERE EstimatedDelivery IS NOT NULL
            AND EstimatedDelivery <= NOW()
      );

    UPDATE Robot
    SET 
        RobotStatus = 'Free',
        EstimatedDelivery = NULL,
        CurrentLoad = 0
    WHERE EstimatedDelivery IS NOT NULL
      AND EstimatedDelivery <= NOW();

END$$

DELIMITER ;