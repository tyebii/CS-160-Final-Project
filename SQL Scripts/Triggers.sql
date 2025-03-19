DELIMITER $$

CREATE TRIGGER LowStockUpdate
AFTER UPDATE ON Inventory
FOR EACH ROW
BEGIN
    IF NEW.Quantity < 5 THEN
        IF NOT EXISTS (SELECT 1 FROM lowstocklog WHERE ItemID = NEW.ItemID) THEN
            INSERT INTO lowstocklog (ItemID, EventDate)
            VALUES (NEW.ItemID, NOW());
        END IF;
    ELSEIF NEW.Quantity > 5 THEN
        DELETE FROM lowstocklog
        WHERE ItemID = NEW.ItemID;
    END IF;
END$$

CREATE TRIGGER FaultyRobotUpdate
AFTER UPDATE ON robot
FOR EACH ROW
BEGIN
    IF NEW.BatteryLife < 10 THEN
        IF NOT EXISTS (SELECT 1 FROM faultyrobots WHERE RobotID = NEW.RobotID AND Cause = 'Low Battery') THEN
            INSERT INTO faultyrobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Low Battery');
        END IF;
    ELSEIF NEW.RobotStatus = 'Broken' THEN
        IF NOT EXISTS (SELECT 1 FROM faultyrobots WHERE RobotID = NEW.RobotID AND Cause = 'Broken') THEN
            INSERT INTO faultyrobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Broken');
        END IF;
    ELSEIF NEW.RobotStatus = 'Maintenance' THEN
        IF NOT EXISTS (SELECT 1 FROM faultyrobots WHERE RobotID = NEW.RobotID AND Cause = 'Needs Maintenance') THEN
            INSERT INTO faultyrobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Needs Maintenance');
        END IF;
    ELSEIF NEW.BatteryLife >= 10 AND NEW.RobotStatus != 'Broken' AND NEW.RobotStatus != 'Maintenance' THEN
        DELETE FROM faultyrobots
        WHERE RobotID = NEW.RobotID;
    END IF;
END$$

CREATE TRIGGER LowStockInsert
AFTER INSERT ON Inventory
FOR EACH ROW
BEGIN
    IF NEW.Quantity < 5 THEN
        IF NOT EXISTS (SELECT 1 FROM lowstocklog WHERE ItemID = NEW.ItemID) THEN
            INSERT INTO lowstocklog (ItemID, EventDate)
            VALUES (NEW.ItemID, NOW());
        END IF;
    ELSEIF NEW.Quantity > 5 THEN
        DELETE FROM lowstocklog
        WHERE ItemID = NEW.ItemID;
    END IF;
END$$

CREATE TRIGGER FaultyRobotInsert
AFTER INSERT ON robot
FOR EACH ROW
BEGIN
    IF NEW.BatteryLife < 10 THEN
        IF NOT EXISTS (SELECT 1 FROM faultyrobots WHERE RobotID = NEW.RobotID AND Cause = 'Low Battery') THEN
            INSERT INTO faultyrobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Low Battery');
        END IF;
    ELSEIF NEW.RobotStatus = 'Broken' THEN
        IF NOT EXISTS (SELECT 1 FROM faultyrobots WHERE RobotID = NEW.RobotID AND Cause = 'Broken') THEN
            INSERT INTO faultyrobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Broken');
        END IF;
    ELSEIF NEW.RobotStatus = 'Maintenance' THEN
        IF NOT EXISTS (SELECT 1 FROM faultyrobots WHERE RobotID = NEW.RobotID AND Cause = 'Needs Maintenance') THEN
            INSERT INTO faultyrobots (RobotID, EventDate, Cause)
            VALUES (NEW.RobotID, NOW(), 'Needs Maintenance');
        END IF;
    ELSEIF NEW.BatteryLife >= 10 AND NEW.RobotStatus != 'Broken' AND NEW.RobotStatus != 'Maintenance' THEN
        DELETE FROM faultyrobots
        WHERE RobotID = NEW.RobotID;
    END IF;
END$$


DELIMITER ;

