DELIMITER $$

CREATE TRIGGER LowStock
AFTER UPDATE ON Inventory
FOR EACH ROW
BEGIN
    IF NEW.Quantity < 5 THEN
        INSERT INTO lowstocklog (ItemID, EventDate)
        VALUES (NEW.ItemID, NOW());
	ELSEIF NEW.Quantity > 5 THEN
        DELETE FROM lowstocklog
		WHERE ItemID = NEW.ItemID;
    END IF;
END$$


CREATE TRIGGER FaultyRobot
AFTER UPDATE ON robot
FOR EACH ROW
BEGIN
    IF NEW.BatteryLife < 10 THEN
        INSERT INTO faultyrobots (RobotID, EventDate, Cause)
        VALUES (NEW.RobotID, NOW(), 'Low Battery');
    ELSEIF NEW.RobotStatus = 'Broken' THEN
        INSERT INTO faultyrobots (RobotID, EventDate, Cause)
        VALUES (NEW.RobotID, NOW(), 'Broken');
    ELSEIF NEW.RobotStatus = 'Maintenance' THEN
        INSERT INTO faultyrobots (RobotID, EventDate, Cause)
        VALUES (NEW.RobotID, NOW(), 'Needs Maintenance');
	ELSEIF NEW.BatteryLife >= 10 and NEW.RobotStatus != 'Broken' and  NEW.RobotStatus != 'Maintenance' THEN
        DELETE FROM faultyrobots
		WHERE RobotID = NEW.RobotID;
    END IF;
END$$


DELIMITER ;

