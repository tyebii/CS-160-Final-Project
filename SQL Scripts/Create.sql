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


INSERT INTO Employee (EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) VALUES
('emp001', '2022-03-15', 'Employed', '1990-05-12', 'Logistics', 25.00, NULL),
('emp002', '2023-07-20', 'Employed', '1985-08-22', 'HR', 30.00, 'emp001'),
('emp003', '2021-01-05', 'Employed', '1992-11-10', 'Management', 40.00, NULL);


INSERT INTO Customer (CustomerID, JoinDate) VALUES
('cust001', '2023-06-01'),
('cust002', '2023-07-10'),
('cust003', '2023-08-15');

INSERT INTO Users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES
('user001', 'hashed_password_1', 'John', 'Doe', '123-456-7890', NULL, 'cust001'),
('user002', 'hashed_password_2', 'Jane', 'Smith', '987-654-3210', NULL, 'cust002'),
('user003', 'hashed_password_3', 'Alice', 'Johnson', '555-123-4567', 'emp001', NULL),
('user004', 'hashed_password_4', 'Bob', 'Brown', '555-987-6543', 'emp002', NULL),
('manager001', 'hashed_password_5', 'Charlie', 'Davis', '111-222-3333', 'emp003', NULL);

INSERT INTO Address (Address, City, Zip, State) VALUES
('272 E Santa Clara St', 'San Jose', '95113', 'CA'),
('123 Market St', 'San Francisco', '94105', 'CA'),
('456 Sunset Blvd', 'Los Angeles', '90001', 'CA'),
('789 Harbor Dr', 'San Diego', '92101', 'CA');

INSERT INTO Inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description) VALUES
('item001', 50, 'FreshFarm', 2.5, 'Apples', 'Fresh Produce', 1.00, '2025-05-10', 2.50, 'Room Temperature', '2025-03-15', 'apple.jpg', 'Red delicious apples.'),
('item002', 20, 'DairyBest', 1.0, 'Milk', 'Dairy and Eggs', 2.00, '2025-04-20', 4.00, 'Refrigerated', '2025-03-15', 'milk.jpg', 'Organic whole milk.'),
('item003', 10, 'SeafoodSupply', 5.0, 'Salmon', 'Meat and Seafood', 7.50, '2025-03-25', 15.00, 'Frozen', '2025-03-15', 'salmon.jpg', 'Fresh'),
('item004', 30, 'BakeryDelight', 0.5, 'Bread', 'Bakery and Bread', 1.50, '2025-04-15', 3.00, 'Room Temperature', '2025-03-15', 'bread.jpg', 'Freshly baked whole wheat bread.'),
('item005', 15, 'PantryKing', 1.2, 'Rice', 'Pantry Staples', 3.00, '2026-02-01', 6.00, 'Room Temperature', '2025-03-15', 'rice.jpg', 'Premium jasmine rice.'),
('item006', 40, 'BeverageWorld', 1.0, 'Orange Juice', 'Beverages', 2.50, '2025-06-10', 5.00, 'Refrigerated', '2025-03-15', 'orange_juice.jpg', '100% pure orange juice.'),
('item007', 25, 'SnackMasters', 0.3, 'Chocolate Bar', 'Snacks and Sweets', 1.20, '2025-12-20', 2.50, 'Room Temperature', '2025-03-15', 'chocolate.jpg', 'Dark chocolate with almonds.'),
('item008', 12, 'SeafoodSupply', 6.0, 'Shrimp', 'Meat and Seafood', 8.00, '2025-04-05', 16.00, 'Frozen', '2025-03-15', 'shrimp.jpg', 'Fresh frozen shrimp.'),
('item009', 18, 'DairyBest', 0.2, 'Butter', 'Dairy and Eggs', 2.30, '2025-07-12', 4.50, 'Refrigerated', '2025-03-15', 'butter.jpg', 'Salted butter sticks.'),
('item010', 50, 'FreshFarm', 1.5, 'Bananas', 'Fresh Produce', 0.80, '2025-03-28', 1.50, 'Room Temperature', '2025-03-15', 'bananas.jpg', 'Ripe yellow bananas.'),
('item011', 20, 'FrozenDelights', 1.2, 'Ice Cream', 'Frozen Foods', 3.50, '2025-09-30', 7.00, 'Frozen', '2025-03-15', 'ice_cream.jpg', 'Vanilla bean ice cream.'),
('item012', 22, 'HealthSupply', 0.6, 'Vitamin C Tablets', 'Health and Wellness', 5.00, '2027-01-15', 10.00, 'Room Temperature', '2025-03-15', 'vitamin_c.jpg', '1000mg Vitamin C tablets.'),
('item013', 35, 'PantryKing', 0.8, 'Pasta', 'Pantry Staples', 2.00, '2026-03-01', 4.00, 'Room Temperature', '2025-03-15', 'pasta.jpg', 'Italian-made spaghetti pasta.');


INSERT INTO ShoppingCart (CustomerID, ItemID, OrderQuantity) VALUES
('cust001', 'item001', 3),
('cust002', 'item002', 2),
('cust003', 'item003', 1);

INSERT INTO Robot (RobotID, CurrentLoad, RobotStatus, Maintanence, Speed, BatteryLife, EstimatedDelivery) VALUES
('robot001', 5.0,  'En Route', '2025-03-01', 10.0, 80.0, 15.0),
('robot002', 2.0,  'Charging', '2025-03-05', 8.5, 50.0, NULL),
('robot003', 0.0,  'Free', '2025-02-28', 9.0, 100.0, NULL);

INSERT INTO Transactions (
    CustomerID, TransactionID, StripeTransactionID, TransactionCost, TransactionWeight, 
    TransactionAddress, TransactionStatus, TransactionDate, RobotID, 
    PaymentMethod, ChargeStatus, ReceiptURL, Currency, AmountPaid
) VALUES
('cust001', 'txn001', 'stripe_txn_001', 7.50, 2.5, '123 Market St', 'Complete', '2025-03-10', 'robot001', 'card', 'succeeded', 'https://stripe.com/receipt/txn001', 'USD', 7.50),
('cust001', 'txn002', 'stripe_txn_002', 8.00, 1.0, '123 Market St', 'In progress', '2025-03-12', 'robot001', 'card', 'pending', NULL, 'USD', NULL),
('cust001', 'txn003', 'stripe_txn_003', 15.00, 5.0, '123 Market St', 'Failed', '2025-03-09', 'robot001', 'bank_transfer', 'failed', NULL, 'USD', 0.00),
('cust001', 'txn004', 'stripe_txn_004', 20.50, 3.2, '123 Market St', 'Out For Delivery', '2025-03-15', 'robot001', 'card', 'succeeded', 'https://stripe.com/receipt/txn004', 'EUR', 20.50),
('cust001', 'txn005', 'stripe_txn_005', 12.75, 2.0, '123 Market St', 'Complete', '2025-03-11', 'robot001', 'paypal', 'succeeded', 'https://stripe.com/receipt/txn005', 'USD', 12.75);



INSERT INTO CustomerAddress (Address, CustomerID, Name) VALUES
('123 Market St', 'cust001', 'Cool'),
('456 Sunset Blvd', 'cust002', 'Coolio'),
('789 Harbor Dr', 'cust003', 'Cools');

INSERT INTO FeaturedItems (ItemID) VALUES
('item001'),
('item002'),
('item003'),
('item004');