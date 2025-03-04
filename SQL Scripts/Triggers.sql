DELIMITER $$

CREATE TRIGGER LowStock
AFTER UPDATE ON Inventory
FOR EACH ROW
BEGIN
    IF NEW.Quantity < 5 THEN
        INSERT INTO lowstocklog (ItemID, EventDate)
        VALUES (NEW.ItemID, NOW());
    END IF;
END$$

DELIMITER ;
