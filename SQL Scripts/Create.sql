Create Database OFS;

Use OFS;

Create Table Employee(
	EmployeeID varchar(255) primary key,
    EmployeeHireDate date Not Null,
    EmployeeStatus Enum('Employed', 'Absence', 'Fired') Not Null,
    EmployeeBirthDate date not null,
    EmployeeDepartment varchar(255) not null,
    EmployeeHourly double not null, 
    SupervisorID varchar(255),
    Foreign Key(SupervisorID) References Employee(EmployeeID) on delete cascade
);

Create Table Customer(
	CustomerID varchar(255) primary key, 
    JoinDate date not null
);

CREATE TABLE Users(
	UserID varchar(255) Primary Key,
    Password varchar(255) Not null,
	UserNameFirst varchar(255) Not Null,
    UserNameLast varchar(255) Not Null,
    UserPhoneNumber varchar(20) Not Null,
    EmployeeID varchar(255),
    CustomerID varchar(255),
    Foreign Key(EmployeeID) References Employee(EmployeeID) on delete cascade,
    Foreign Key(CustomerID) References Customer(CustomerID) on delete cascade
);

Create Table Address(
	Address varchar(255) primary key
);
    
Create Table Inventory(
	ItemID varchar(255) primary key,
    Quantity int not null, 
    Distributor varchar(255) not null, 
    Weight double not null, 
    ProductName varchar(255) not null, 
    Category enum('Fresh Produce', 'Dairy and Eggs', 'Meat and Seafood', 'Frozen Foods', 'Bakery and Bread', 'Pantry Staples', 'Beverages', 'Snacks and Sweets', 'Health and Wellness') not null,
	SupplierCost double not null,
    Expiration date not null,
    Cost double not null,
    StorageRequirement ENUM('Frozen','Deep Frozen','Cryogenic','Refrigerated','Cool','Room Temperature','Ambient','Warm','Hot','Dry','Moist','Airtight','Dark Storage','UV-Protected','Flammable','Hazardous','Perishable','Non-Perishable') not null,
    LastModification date not null,
    ImageLink varchar(255) not null,
    Description varchar(255) not null
);

Create Table ShoppingCart(
	CustomerID varchar(255) ,
    ItemID varchar(255) ,
    OrderQuantity int not null,
    Foreign Key(CustomerID) References Customer(CustomerID) on delete cascade,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade,
    Primary Key(CustomerID,ItemID)
);

Create Table Robot(
	RobotID varchar(255) primary key,
    CurrentLoad double not null,
    RobotStatus enum('En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired') not null,
    Maintanence Date not null,
	Speed double not null,
    BatteryLife double not null,
    EstimatedDelivery double
);

CREATE INDEX robot_status
ON Robot (RobotStatus);

CREATE TABLE Transactions (
    CustomerID varchar(255) NOT NULL,
    TransactionID varchar(255) PRIMARY KEY,
    StripeTransactionID varchar(255) UNIQUE, 
    TransactionCost DOUBLE NOT NULL,
    TransactionWeight DOUBLE NOT NULL,
    TransactionAddress varchar(255),
    TransactionStatus ENUM('In progress', 'Complete', 'Failed', 'Out For Delivery') NOT NULL,
    TransactionDate DATETIME NOT NULL,
    RobotID varchar(255),
    PaymentMethod VARCHAR(50),
    ChargeStatus ENUM('succeeded', 'pending', 'failed'),
    ReceiptURL TEXT,
    Currency VARCHAR(10),
    AmountPaid DOUBLE,
    FOREIGN KEY (TransactionAddress) REFERENCES Address(Address) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    FOREIGN KEY (RobotID) REFERENCES Robot(RobotID)
);

CREATE INDEX transactions_address
ON Transactions (TransactionAddress);

CREATE INDEX transactions_status
ON Transactions (TransactionStatus);

Create Table CustomerAddress(
	Address varchar(255) ,
    CustomerID varchar(255) ,
    Name varchar(255) not null,
	Foreign Key(Address) References Address(Address) on delete cascade,
    Foreign Key(CustomerID) References Customer(CustomerID) on delete cascade,
    Primary Key(CustomerID,Address)
);

CREATE INDEX customer_address
ON CustomerAddress (Address);

Create Table LowStockLog(
	ItemID varchar(255) primary key,
    EventDate date not null,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade
);

Create Table FaultyRobots(
	RobotID varchar(255) primary key,
    EventDate date not null,
    Cause varchar(255) not null,
    Foreign Key(RobotID) References robot(RobotID) on delete cascade
);

Create Table FeaturedItems( 
    ItemID varchar(255) primary key,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade
);

Create Table NearExpiration( 
    ItemID varchar(255) primary key,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade
);

Alter Table robot
Add Constraint CheckRobotWeight Check (CurrentLoad<=200 and Currentload >= 0);

Alter Table robot 
Add Constraint CheckRobotBattery Check (BatteryLife >= 0 and BatteryLife <=100);

Alter Table transactions 
Add Constraint CheckTransactionCost Check (TransactionCost>=0);

Alter Table transactions 
Add Constraint CheckTransactionWeight Check (TransactionWeight >= 0);

Alter Table inventory 
Add Constraint CheckInventoryQuantity Check (Quantity >= 0);

Alter Table inventory 
Add Constraint CheckInventoryCost Check (SupplierCost  >= 0);

Alter Table shoppingcart
Add Constraint CheckCartQuantity Check (OrderQuantity >= 0);

Alter Table employee
Add Constraint CheckEmployeeHourly Check (EmployeeHourly >= 0);

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

DELIMITER $$

CREATE EVENT NearExpiration
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    INSERT IGNORE INTO NearExpiration(ItemID)
    SELECT ItemID
    FROM Inventory
    WHERE DATEDIFF(Expiration, CURDATE()) <= 3;
END;

DELIMITER ;

DELIMITER $$

CREATE EVENT IF NOT EXISTS delete_expired_transactions
ON SCHEDULE EVERY 20 MINUTE
DO
BEGIN

    UPDATE Inventory
    JOIN ShoppingCart ON Inventory.ItemID = ShoppingCart.ItemID
    JOIN Transactions ON ShoppingCart.CustomerID = Transactions.CustomerID
    SET Inventory.Quantity = Inventory.Quantity + ShoppingCart.OrderQuantity
    WHERE Transactions.TransactionStatus = 'In Progress';

    DELETE FROM Transactions
    WHERE TransactionStatus NOT IN ('Complete', 'Out For Delivery')
      AND TransactionDate < NOW() - INTERVAL 35 MINUTE;

END $$

DELIMITER ;

INSERT INTO Address (Address) VALUES
('272 E Santa Clara St, San Jose, CA 95112');

INSERT INTO Robot (RobotID, CurrentLoad, RobotStatus, Maintanence, Speed, BatteryLife, EstimatedDelivery) VALUES
('robot001', 5.0,  'En Route', '2025-03-01', 10.0, 80.0, 15.0),
('robot002', 2.0,  'Charging', '2025-03-05', 8.5, 50.0, NULL),
('robot003', 0.0,  'Free', '2025-02-28', 9.0, 100.0, NULL);

INSERT INTO Employee (EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) VALUES
('41919578-dc21-41db-9988-64af08b72656', '2025-03-20', 'Employed', '1985-09-10', 'Marketing', 30, NULL ),
('4cedc688-2ef6-424c-9e14-c72cd3f45b29', '2025-04-03', 'Employed', '2025-04-02', 'Meat', 10, '41919578-dc21-41db-9988-64af08b72656');

INSERT INTO Users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES
('manageraccount', '$2b$10$EnkK1LIZkFwfvH7j1exJ2OMt.sUUqPYZbr2GGK5DpLR.ryLdirWUa', 'Jane', 'Smith', '1-987-654-3210', '41919578-dc21-41db-9988-64af08b72656', NULL),
('employeeaccount', '$2b$10$qshO7B9Lge.sVLTF3XHwpePyloSIi1fbe7clrwSGzzh9YTQhDkxdi', 'Jane', 'Smither', '1-987-654-3212', '4cedc688-2ef6-424c-9e14-c72cd3f45b29', NULL);