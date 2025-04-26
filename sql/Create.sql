-- Create The DB
Create Database OFS;

-- Use The Created DB
Use OFS;

-- Address Table
Create Table Address(
	Address varchar(255) primary key
);

-- Employee Table That Stores Employee Related Information
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

-- Customer Table Stores Customer Information
Create Table Customer(
	CustomerID varchar(255) primary key, 
    JoinDate date not null
);

-- User Table Stores User Information
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

-- Inventory Table Stores Item Data
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

-- Stores The Items In Customer Shopping Cart
Create Table ShoppingCart(
	CustomerID varchar(255) ,
    ItemID varchar(255) ,
    OrderQuantity int not null,
    Foreign Key(CustomerID) References Customer(CustomerID) on delete cascade,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade,
    Primary Key(CustomerID,ItemID)
);

-- Stores The Robot Data
Create Table Robot(
	RobotID varchar(255) primary key,
    CurrentLoad double not null,
    RobotStatus enum('En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired') not null,
    Maintanence Date not null,
    EstimatedDelivery DATETIME
);

-- Stores The Transaction Data Of Each Purchase
CREATE TABLE Transactions (
    CustomerID varchar(255) NOT NULL,
    TransactionID varchar(255) PRIMARY KEY,
    StripeTransactionID varchar(255) UNIQUE, 
    TransactionCost DOUBLE NOT NULL,
    TransactionWeight DOUBLE NOT NULL,
    TransactionAddress varchar(255),
    TransactionStatus ENUM('In progress', 'Complete', 'Pending Delivery', 'Delivering', 'Fulfilled') NOT NULL,
    TransactionDate DATETIME NOT NULL,
    TransactionTime DATETIME,
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

-- Stores The Customers Custom Addresses
Create Table CustomerAddress(
	Address varchar(255) ,
    CustomerID varchar(255) ,
    Name varchar(255) not null,
	Foreign Key(Address) References Address(Address) on delete cascade,
    Foreign Key(CustomerID) References Customer(CustomerID) on delete cascade,
    Primary Key(CustomerID,Address)
);

-- Stores Low Stock Items
Create Table LowStockLog(
	ItemID varchar(255) primary key,
    EventDate Datetime not null,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade
);

-- Stores Faulty Robot Data
Create Table FaultyRobots(
	RobotID varchar(255) primary key,
    EventDate Datetime not null,
    Cause varchar(255) not null,
    Foreign Key(RobotID) References Robot(RobotID) on delete cascade
);

-- Featured Items On Home Page
Create Table FeaturedItems( 
    ItemID varchar(255) primary key,
    EventDate Datetime not null,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade
);

-- Items Near Expiration
Create Table NearExpiration( 
    ItemID varchar(255) primary key,
    EventDate Datetime not null,
    Foreign Key(ItemID) References Inventory(ItemID) on delete cascade
);

-- Copy Of Inventory Items At Time Of Purchase. There Are Multiple Unique Entries For Each Transaction
CREATE TABLE TransactionItems (

    TransactionID VARCHAR(255),
    ItemID VARCHAR(255),
    ProductName VARCHAR(255),
    Quantity INT NOT NULL,
    PriceAtPurchase DOUBLE NOT NULL,
    ImageLink VARCHAR(255),
    PRIMARY KEY (TransactionID, ItemID),
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID) On Delete Cascade

);



-- Constraints

Alter Table Employee
Add Constraint CheckEmployeeHourly Check (EmployeeHourly >= 0);

Alter Table Inventory 
Add Constraint CheckInventoryQuantity Check (Quantity >= 0);

Alter Table Inventory 
Add Constraint CheckInventoryCost Check (Cost  >= 0);

Alter Table Inventory 
Add Constraint CheckInventorySupplierCost Check (SupplierCost  >= 0);

Alter Table Inventory 
Add Constraint CheckInventoryWeight Check (Weight  >= 0);

Alter Table ShoppingCart
Add Constraint CheckCartQuantity Check (OrderQuantity >= 0);

Alter Table Robot
Add Constraint CheckRobotWeight Check (CurrentLoad<=200 and Currentload >= 0);

Alter Table Transactions 
Add Constraint CheckTransactionCost Check (TransactionCost>=0);

Alter Table Transactions 
Add Constraint CheckTransactionWeight Check (TransactionWeight >= 0);

ALTER TABLE TransactionItems 
ADD CONSTRAINT check_TransactionQuantity CHECK (Quantity >= 0);

ALTER TABLE TransactionItems 
ADD CONSTRAINT check_TransactionPrice CHECK (PriceAtPurchase >= 0);

-- Indexes 

CREATE INDEX user_customer
ON Users (CustomerID);

CREATE INDEX user_employee
ON Users (EmployeeID);

CREATE INDEX inventory_category
ON Inventory (Category);

CREATE INDEX robot_status
ON Robot (RobotStatus);

CREATE INDEX transactions_address
ON Transactions (TransactionAddress);

CREATE INDEX transactions_status
ON Transactions (TransactionStatus);

CREATE INDEX transactions_robot
ON Transactions (RobotID);

CREATE INDEX transactions_customer
ON Transactions (CustomerID);

CREATE INDEX customer_address
ON CustomerAddress (Address);

CREATE INDEX transactionitems_itemid
ON TransactionItems (ItemID);

-- Insert The Default Store Address
INSERT INTO Address (Address) VALUES
('272 E Santa Clara St, San Jose, CA 95112');

-- Insert Sample Robots 
INSERT INTO Robot (RobotID, CurrentLoad, RobotStatus, Maintanence, EstimatedDelivery) VALUES
('Robot One', 0,  'Free', '2025-05-29', NULL),
('Robot Two', 0,  'Free', '2025-05-29', NULL),
('Robot Three', 0,  'Free', '2025-05-29', NULL);

-- Insert Fresh Produce
INSERT INTO Inventory VALUES 
('d2f24db5-70f2-4e7d-9a96-4a387a858a1e', 120, 'SunFresh Farms', 0.25, 'Green Apple', 'Fresh Produce', 0.30, '2025-05-15', 0.50, 'Cool', '2025-04-18', 'appleGreen.jpg', 'Crisp and tart green apples perfect for snacking.'),
('fa5c3cb8-abc2-4e30-9504-bc5e15315b6d', 200, 'Tropic Harvest', 0.22, 'Banana', 'Fresh Produce', 0.18, '2025-04-25', 0.40, 'Room Temperature', '2025-04-18', 'bannana.jpg', 'Sweet ripe bananas, ideal for smoothies or snacks.'),
('63106d30-4efb-4300-8a26-2a346580a979', 75, 'BerryBest Co.', 0.05, 'Blueberry', 'Fresh Produce', 0.40, '2025-04-22', 0.75, 'Refrigerated', '2025-04-18', 'blueberry.jpg', 'Fresh blueberries picked at peak ripeness.'),
('afc62d64-3ed1-4487-a71b-3f2e658dc16f', 80, 'BerryBest Co.', 0.05, 'Blueberry', 'Fresh Produce', 0.40, '2025-04-22', 0.75, 'Refrigerated', '2025-04-18', 'blueberryTwo.jpg', 'Another batch of sweet fresh blueberries.'),
('8f05f5d0-bc0e-4be3-b1cd-f82c9893e7aa', 90, 'VeggiePro Ltd.', 0.30, 'Carrot', 'Fresh Produce', 0.20, '2025-05-01', 0.45, 'Cool', '2025-04-18', 'carrot.jpg', 'Crunchy orange carrots full of nutrients.'),
('c891defe-6f09-4a79-9083-30820d2170f4', 85, 'VeggiePro Ltd.', 0.30, 'Carrot', 'Fresh Produce', 0.20, '2025-05-01', 0.45, 'Cool', '2025-04-18', 'carrotTwo.jpg', 'Second harvest of fresh carrots.'),
('f71d4ae3-2914-407f-9645-b2f2c3b72e5c', 150, 'GrapeVine Distributors', 0.15, 'Grapes', 'Fresh Produce', 0.35, '2025-04-27', 0.60, 'Refrigerated', '2025-04-18', 'grapes.jpg', 'Seedless grapes—juicy and sweet.'),
('15db8d64-62aa-4a69-8262-60aa9434352e', 100, 'LeafyGood Greens', 0.20, 'Lettuce', 'Fresh Produce', 0.25, '2025-04-20', 0.50, 'Cool', '2025-04-18', 'lettuce.jpg', 'Crisp romaine lettuce for fresh salads.'),
('59ff0a4a-1a15-4961-8a9e-89b062f60a7d', 60, 'Tropic Harvest', 0.50, 'Mango', 'Fresh Produce', 0.60, '2025-04-28', 1.00, 'Room Temperature', '2025-04-18', 'mango.jpg', 'Juicy tropical mangoes, great for desserts.'),
('ae98a92d-9bdf-43a5-8e8e-b1a3eb3a3c8c', 130, 'Citrus Express', 0.28, 'Orange', 'Fresh Produce', 0.32, '2025-05-05', 0.55, 'Cool', '2025-04-18', 'orange.jpg', 'Vitamin C-packed oranges with sweet flavor.'),
('76eafcbc-b56e-4be4-9f8e-8a8057c02e35', 50, 'Tropic Harvest', 1.00, 'Pineapple', 'Fresh Produce', 1.00, '2025-05-10', 2.00, 'Room Temperature', '2025-04-18', 'pineapple.jpg', 'Tropical pineapple, sweet and tangy.'),
('fd71cecf-204e-4a61-95cd-e7d23df9243e', 95, 'BerryBest Co.', 0.06, 'Strawberry', 'Fresh Produce', 0.35, '2025-04-23', 0.70, 'Refrigerated', '2025-04-18', 'strawberry.jpg', 'Sweet and juicy strawberries.'),
('85d1b51e-4ae9-4f99-a33c-25b369e2e981', 100, 'BerryBest Co.', 0.06, 'Strawberry', 'Fresh Produce', 0.35, '2025-04-23', 0.70, 'Refrigerated', '2025-04-18', 'strawberryTwo.jpg', 'Second batch of strawberries, just as sweet.'),
('27b15cfc-d4de-49ae-8cc7-24f51e2ff52d', 45, 'MelonCo Inc.', 1.50, 'Watermelon', 'Fresh Produce', 2.00, '2025-05-12', 3.50, 'Cool', '2025-04-18', 'watermelon.jpg', 'Refreshing watermelon, perfect for warm days.');

-- Insert Dairy And Eggs
INSERT INTO Inventory VALUES 
('3e4c9fc9-1af1-4c3f-9953-7e4c2597bc21', 150, 'Golden Farm Co.', 0.05, 'Eggs', 'Dairy and Eggs', 0.12, '2025-04-30', 0.30, 'Refrigerated', '2025-04-18', 'eggs.jpg', 'Farm-fresh eggs, rich in protein and flavor.'),
('ae4f6a9e-8f8d-4626-bfcf-8f9aa81a0b9a', 80, 'SweetChill', 0.50, 'Ice Cream', 'Dairy and Eggs', 1.00, '2025-08-15', 2.50, 'Frozen', '2025-04-18', 'icecream.jpg', 'Creamy vanilla ice cream, perfect for desserts.'),
('90b4d5c6-3b83-4741-9329-c1f987861e01', 60, 'Butter Bliss Co.', 0.25, 'Butter', 'Dairy and Eggs', 0.90, '2025-05-10', 1.75, 'Refrigerated', '2025-04-18', 'butterTwo.jpg', 'Rich creamy butter, ideal for baking or spreading.'),
('f47d5e28-c755-40a3-91cb-baa0dfe8a623', 100, 'Yogurto Dairy', 0.20, 'Yogurt', 'Dairy and Eggs', 0.45, '2025-04-25', 1.00, 'Refrigerated', '2025-04-18', 'yogurt.jpg', 'Plain yogurt with live cultures.'),
('b654a09f-6631-4ef3-8572-20950f267c1a', 95, 'Yogurto Dairy', 0.20, 'Yogurt', 'Dairy and Eggs', 0.45, '2025-04-25', 1.00, 'Refrigerated', '2025-04-18', 'yogurtTwo.jpg', 'Extra batch of plain yogurt with probiotics.'),
('c2017f6c-8fc3-4f2d-bdc1-49ce1d973b9c', 85, 'Cheesy Delights', 0.40, 'Cheese', 'Dairy and Eggs', 1.20, '2025-06-01', 2.50, 'Refrigerated', '2025-04-18', 'cheese.jpg', 'Sharp cheddar cheese with bold flavor.'),
('7f169d49-6290-4d89-89f3-bf7a2c5eae1c', 90, 'Cheesy Delights', 0.40, 'Cheese', 'Dairy and Eggs', 1.20, '2025-06-01', 2.50, 'Refrigerated', '2025-04-18', 'cheeseTwo.jpg', 'Mild cheddar for sandwiches or snacking.'),
('20b27d25-84dc-4d4d-b39d-6a808b344d5e', 80, 'Cheesy Delights', 0.40, 'Cheese', 'Dairy and Eggs', 1.20, '2025-06-01', 2.50, 'Refrigerated', '2025-04-18', 'cheeseThree.jpg', 'Third batch of smooth, creamy cheese.'),
('a3504351-0cc4-44e8-8d80-b19d7b8c19fc', 70, 'DairyFresh Ltd.', 1.00, 'Milk', 'Dairy and Eggs', 0.85, '2025-04-22', 1.50, 'Refrigerated', '2025-04-18', 'milkTwo.jpg', 'Fresh whole milk from grass-fed cows.'),
('ea6e47b8-85ff-4964-b038-4c7a0f4044f7', 65, 'DairyFresh Ltd.', 1.00, 'Milk', 'Dairy and Eggs', 0.85, '2025-04-22', 1.50, 'Refrigerated', '2025-04-18', 'milkThree.jpg', 'Additional lot of organic fresh milk.');

-- Insert Into Meat And Seafood
INSERT INTO Inventory (
	ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost,
	Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description
) VALUES
('b3c1f0e8-9e43-40b2-9318-7f0f8a3c141a', 45, 'OceanFresh Ltd.', 0.67, 'Clams', 'Meat and Seafood', 2.50,
'2025-05-10', 4.00, 'Deep Frozen', '2025-04-18', 'clams.JPG', 'Freshly harvested Atlantic clams'),

('21a7d06d-c45d-49b8-b4a5-8a27c9f9d91e', 30, 'Crustacean Co.', 1.10, 'Lobster', 'Meat and Seafood', 8.00,
 '2025-04-28', 12.00, 'Cryogenic', '2025-04-18', 'lobster.JPG', 'Wild-caught Maine lobster'),

('b19d8919-fd3a-4137-b04a-c04fdad9f5a4', 50, 'SeaHarvest Inc.', 0.53, 'Crab', 'Meat and Seafood', 3.25,
 '2025-05-05', 5.75, 'Frozen', '2025-04-18', 'crab.JPG', 'Snow crab meat, shelled'),

('a2c9b5ec-f1b4-4a26-a504-6a74797b69e0', 20, 'ShrimpShack', 0.54, 'Shrimp Pack 2', 'Meat and Seafood', 3.10,
 '2025-04-25', 4.99, 'Frozen', '2025-04-18', 'shrimpTwo.JPG', 'Peeled and deveined shrimp'),

('19a1878c-7be3-4d7e-a6e7-89cd10998be0', 40, 'Pacific Bluefish', 0.83, 'Tuna', 'Meat and Seafood', 6.00,
 '2025-04-30', 9.25, 'Refrigerated', '2025-04-18', 'tuna.JPG', 'Yellowfin tuna steaks'),

('47e83cd1-943e-44d3-b9b6-9bcdac2d1706', 25, 'Atlantic Cuts', 1.54, 'Salmon Pack 2', 'Meat and Seafood', 5.00,
 '2025-04-26', 7.50, 'Frozen', '2025-04-18', 'salmonTwo.JPG', 'Wild-caught Atlantic salmon'),

('4a5cf262-78e1-45ec-8e29-cd39662a7a42', 10, 'Barnyard Brothers', 0.01, 'Goat Sample', 'Meat and Seafood', 0.25,
 '2025-04-20', 0.50, 'Refrigerated', '2025-04-18', 'goat.JPG', 'Testing sample of goat meat'),

('0a48c8f9-e022-4328-9287-c0cf22d1d96d', 15, 'WildGame Meats', 2.18, 'Venison', 'Meat and Seafood', 9.25,
 '2025-05-15', 13.50, 'Frozen', '2025-04-18', 'venison.JPG', 'Premium venison loin cuts'),

('7102d3f3-8c6f-41f2-aac6-4a05907e0ea1', 60, 'Porkify LLC', 1.10, 'Bacon', 'Meat and Seafood', 2.75,
 '2025-04-24', 4.00, 'Refrigerated', '2025-04-18', 'bacon.JPG', 'Applewood smoked bacon'),

('a9a13255-f0c5-4ff8-9481-f2e75c8cdcbc', 35, 'Shepherd Supply', 0.71, 'Lamb', 'Meat and Seafood', 6.25,
 '2025-05-08', 9.00, 'Frozen', '2025-04-18', 'lamb.JPG', 'Grass-fed lamb leg portion');

-- Insert Into Bakery And Bread
INSERT INTO Inventory (
	ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost,
	Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description
) VALUES
('fe028ef6-d14d-4b13-94d4-2f87f1c9f53e', 25, 'Danish Delights Co.', 1.05, 'Danish', 'Bakery and Bread', 2.75,
 '2025-04-23', 4.25, 'Room Temperature', '2025-04-18', 'danish.JPG', 'Buttery danish with fruit filling'),

('3c0e6e1b-13e0-4646-b2db-320206e26f91', 40, 'FreshLoaf Distributors', 1.45, 'Bread Pack 2', 'Bakery and Bread', 1.80,
 '2025-04-21', 3.25, 'Cool', '2025-04-18', 'breadTwo.JPG', 'Soft multigrain bread loaves'),

('654ea8b3-87c2-4b07-9c35-c557f52e007c', 38, 'FreshLoaf Distributors', 0.92, 'Bread Pack 3', 'Bakery and Bread', 1.60,
 '2025-04-21', 2.90, 'Cool', '2025-04-18', 'breadThree.JPG', 'Classic white sandwich bread'),

('7d420da2-635c-48cd-8ff9-8c5cb679ad6c', 20, 'Pie & Co.', 1.49, 'Pie', 'Bakery and Bread', 3.90,
 '2025-04-24', 5.50, 'Room Temperature', '2025-04-18', 'pie.JPG', 'Homestyle apple pie'),

('38c6eac0-0d69-43db-b6db-55d2cdb48e14', 50, 'SweetTreats Inc.', 1.33, 'Cookie', 'Bakery and Bread', 1.25,
 '2025-04-26', 2.25, 'Room Temperature', '2025-04-18', 'cookie.JPG', 'Chocolate chip cookies'),

('cf2d8e2c-85ea-4147-a1d4-e7a8a0be38cc', 45, 'Muffin Magic', 0.63, 'Muffin', 'Bakery and Bread', 1.00,
 '2025-04-22', 1.99, 'Room Temperature', '2025-04-18', 'muffin.JPG', 'Blueberry breakfast muffin'),

('4ae50e68-f17f-4c29-8a8a-c6dbce45ec8f', 35, 'Baker’s Basket', 3.18, 'Scone', 'Bakery and Bread', 2.90,
 '2025-04-23', 4.50, 'Cool', '2025-04-18', 'scone.JPG', 'British-style butter scones'),

('0c1a91e1-f148-4c11-8121-4371c03a56d3', 28, 'Cheesecake Central', 1.05, 'Cheesecake', 'Bakery and Bread', 4.25,
 '2025-04-27', 6.75, 'Refrigerated', '2025-04-18', 'cheesecake.JPG', 'New York-style cheesecake'),

('5b8ab365-bd98-4e31-88a2-d39607c9c0a7', 22, 'French Pastry Supply', 1.76, 'Croissant', 'Bakery and Bread', 2.25,
 '2025-04-21', 3.95, 'Room Temperature', '2025-04-18', 'croissant.JPG', 'Flaky buttery croissants'),

('ac5a3d77-1c0e-429e-bc3b-0cb4ea84fc27', 30, 'ChocoCraft Ltd.', 0.66, 'Chocolate Cake', 'Bakery and Bread', 3.25,
 '2025-04-25', 5.50, 'Refrigerated', '2025-04-18', 'chocolatecake.JPG', 'Rich double-layer chocolate cake');

-- Insert Into Pantry Staples
INSERT INTO Inventory (
	ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost,
	Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description
) VALUES
('50230ec7-12b3-4dbb-8ec9-9d113191e474', 100, 'PantryPro Supplies', 5.80, 'Beans', 'Pantry Staples', 2.50,
 '2026-04-18', 4.00, 'Dry', '2025-04-18', 'beans.JPG', 'Dried mixed beans for cooking'),

('1ac4f144-9967-4702-99e1-34a1a00c4b28', 90, 'PantryPro Supplies', 1.32, 'Black Beans', 'Pantry Staples', 1.75,
 '2026-04-18', 3.20, 'Dry', '2025-04-18', 'blackbeans.JPG', 'Organic black beans'),

('af57e96d-5566-4765-b733-4fbb7861c401', 60, 'CafeBasics Inc.', 0.56, 'Coffee', 'Pantry Staples', 3.10,
 '2025-10-01', 5.50, 'Dry', '2025-04-18', 'coffee.JPG', 'Instant ground coffee'),

('af9b7aa1-9c3a-4f6b-9bfc-7dc4cd40e4b7', 50, 'CafeBasics Inc.', 0.62, 'Coffee Beans', 'Pantry Staples', 4.25,
 '2026-01-12', 6.75, 'Dry', '2025-04-18', 'coffeeBeans.JPG', 'Whole roasted arabica beans'),

('b6b36954-f61e-41b4-a274-3b1774aeab61', 52, 'CafeBasics Inc.', 0.83, 'Coffee Beans Pack 2', 'Pantry Staples', 4.00,
 '2026-01-12', 6.25, 'Dry', '2025-04-18', 'coffeebeansTwo.JPG', 'Dark roast coffee beans'),

('92b73a7d-6814-4c69-9a9f-e3a1b7c2e3f2', 75, 'BakersBulk Goods', 1.54, 'Flour', 'Pantry Staples', 2.10,
 '2025-12-30', 3.50, 'Dry', '2025-04-18', 'flour.JPG', 'All-purpose wheat flour'),

('9cf633e0-9d96-47fc-bf66-f84891111902', 85, 'OatHarvest Ltd.', 1.59, 'Oats', 'Pantry Staples', 1.95,
 '2025-11-18', 3.10, 'Dry', '2025-04-18', 'oats.JPG', 'Rolled oats for breakfast and baking'),

('7c49d3f7-c905-4f2b-831d-d86cd6639f31', 120, 'PastaTime Suppliers', 0.75, 'Pasta', 'Pantry Staples', 1.30,
 '2026-03-10', 2.50, 'Dry', '2025-04-18', 'pasta.JPG', 'Dry spaghetti pasta'),

('35bff248-68b6-4c62-9d51-0887b7eb845e', 110, 'PastaTime Suppliers', 0.29, 'Pasta Pack 2', 'Pantry Staples', 1.10,
 '2026-03-10', 2.20, 'Dry', '2025-04-18', 'pastaTwo.JPG', 'Macaroni-style pasta'),

('efde2609-5d6e-47c2-b14e-fc234c49a138', 130, 'GrainMasters', 1.60, 'Rice', 'Pantry Staples', 2.40,
 '2026-05-01', 4.00, 'Dry', '2025-04-18', 'rice.JPG', 'White long grain rice'),

('296265b5-15ac-4ecf-87c5-07db27939cf6', 100, 'GrainMasters', 1.16, 'Rice Pack 2', 'Pantry Staples', 2.10,
 '2026-05-01', 3.60, 'Dry', '2025-04-18', 'riceTwo.JPG', 'Short grain rice for sticky dishes'),

('0aa8006f-f57a-46c5-a99c-273cf3ff16cc', 95, 'SoyHarvest USA', 2.73, 'Soybeans', 'Pantry Staples', 2.95,
 '2025-12-15', 4.80, 'Dry', '2025-04-18', 'soybeans.JPG', 'Raw soybeans for cooking'),

('c3ddfc6d-626c-406f-9377-c96a04e90e5a', 105, 'SweetCo Ltd.', 0.60, 'Sugar', 'Pantry Staples', 1.50,
 '2026-01-20', 2.75, 'Dry', '2025-04-18', 'sugar.JPG', 'Granulated white sugar'),

('e15a6df4-d4bc-4740-9b71-90678d183e91', 65, 'GrainMasters', 1.83, 'Wild Rice', 'Pantry Staples', 3.75,
 '2026-03-18', 6.25, 'Dry', '2025-04-18', 'wildRice.JPG', 'Nutty-flavored wild rice blend');

-- Insert Into Snacks And Sweets
INSERT INTO Inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description) 
VALUES
('f52d7758-b065-41b5-9594-f2578f315d28', 100, 'SnackCo', 0.45, 'Candy', 'Snacks and Sweets', 1.50, '2025-07-01', 2.50, 'Room Temperature', '2025-04-18', 'candy.jpg', 'Delicious candy in various flavors'),
('d4e456cd-1f56-4bb6-bfcd-b8c3f85f11a9', 150, 'ChipMasters', 0.20, 'Chips', 'Snacks and Sweets', 1.00, '2025-06-15', 1.80, 'Room Temperature', '2025-04-18', 'chips.jpg', 'Crispy and crunchy potato chips'),
('a6d987d9-dcb4-423b-a241-44f23311e0da', 80, 'SnackTime', 0.35, 'Drumsticks', 'Snacks and Sweets', 2.00, '2025-08-10', 3.00, 'Room Temperature', '2025-04-18', 'drumsticks.jpg', 'Savory chicken drumsticks with spice coating'),
('6c54796a-66cd-43ad-8189-0e67bb1f1dbf', 120, 'SweetBites', 0.50, 'FunCookies', 'Snacks and Sweets', 1.80, '2025-07-30', 2.40, 'Room Temperature', '2025-04-18', 'funcookies.jpg', 'Fun-shaped cookies with chocolate chips'),
('f13c754d-9c4f-48db-b477-cd3a56a2ed5b', 200, 'SnackVille', 0.45, 'Goldfish', 'Snacks and Sweets', 1.10, '2025-05-25', 2.00, 'Room Temperature', '2025-04-18', 'goldfish.jpg', 'Tasty goldfish crackers for snacking'),
('8d1eecb4-97f2-47e2-928d-6c5b2019a042', 180, 'NutHouse', 0.40, 'Nuts', 'Snacks and Sweets', 1.80, '2025-09-10', 2.60, 'Room Temperature', '2025-04-18', 'nuts.jpg', 'Mixed nuts for a healthy snack'),
('d7db2716-b2f2-4d90-bd29-40e7670c0e7e', 140, 'PretzelWorld', 0.30, 'Pretzel', 'Snacks and Sweets', 1.50, '2025-06-01', 2.50, 'Room Temperature', '2025-04-18', 'pretzel.jpg', 'Soft pretzels with salt and butter coating');

-- Insert Into Beverages
INSERT INTO Inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description) 
VALUES
('b13b9271-a02f-4909-b967-b10d4b472b72', 100, 'BrewMasters', 0.75, 'Beer', 'Beverages', 3.00, '2025-12-01', 5.00, 'Room Temperature', '2025-04-18', 'beer.jpg', 'Craft beer with a smooth finish'),
('a14f6267-b68c-496d-94ad-f8c5ec6b29fd', 150, 'GinCraft', 0.50, 'Gin', 'Beverages', 5.00, '2025-11-15', 8.00, 'Room Temperature', '2025-04-18', 'gin.jpg', 'Premium gin with botanicals and a crisp taste'),
('d98c375a-bbdf-4328-9df4-04042062e3a0', 120, 'WineCellar', 0.60, 'Wine', 'Beverages', 6.00, '2025-10-10', 10.00, 'Room Temperature', '2025-04-18', 'wine.jpg', 'Red wine with rich, smooth flavors'),
('e0f7c1be-455e-4f53-b707-b7f9b4d1b213', 180, 'WineCraft', 0.55, 'Wine Two', 'Beverages', 6.50, '2025-10-15', 9.00, 'Room Temperature', '2025-04-18', 'wineTwo.jpg', 'A refined white wine with floral notes');

-- Insert Frozen Foods
INSERT INTO Inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description) 
VALUES
('b59d0b13-d2b1-4e0a-b4a3-7c1d2227f4d1', 100, 'FrozenDelights', 0.45, 'Acai', 'Frozen Foods', 2.00, '2025-06-01', 4.00, 'Frozen', '2025-04-18', 'acai.jpg', 'Frozen acai berry puree, perfect for smoothies'),
('a07b28c6-b621-40bb-ae3e-126c0e93a727', 120, 'SeafoodFresh', 0.70, 'Frozen Cod', 'Frozen Foods', 3.00, '2025-08-15', 5.50, 'Frozen', '2025-04-18', 'frozencod.jpg', 'High-quality frozen cod fillets'),
('7c327f0a-f1de-4e3f-9adf-e53a5a631c82', 150, 'SeafoodPlus', 0.40, 'Frozen Shrimp', 'Frozen Foods', 4.00, '2025-07-01', 6.00, 'Frozen', '2025-04-18', 'frozenshrimp.jpg', 'Delicious frozen shrimp, easy to cook'),
('e84c3d57-4c12-4e1f-9298-28376b3584a5', 80, 'SweetTreats', 0.30, 'Gelato', 'Frozen Foods', 2.50, '2025-09-30', 4.50, 'Frozen', '2025-04-18', 'gelato.jpg', 'Rich, creamy frozen gelato in assorted flavors'),
('c2d93ff1-d2b9-4df4-8366-577f3d61fe5e', 90, 'PizzaWorld', 1.00, 'Pizza', 'Frozen Foods', 5.00, '2025-12-10', 8.00, 'Frozen', '2025-04-18', 'pizza.jpg', 'Frozen pizza with delicious toppings');

-- Insert Health And Wellness
INSERT INTO Inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description) 
VALUES
('b23d8d9d-070f-46fc-85e0-4f0b402f49f7', 100, 'HealthCorp', 0.50, 'Fish Oil', 'Health and Wellness', 5.00, '2025-12-01', 8.00, 'Room Temperature', '2025-04-18', 'fishoil.jpg', 'Fish oil supplement for heart and joint health'),
('8e7dbed8-9e18-4d9f-b575-f5678237503b', 150, 'JuicyHealth', 0.60, 'Healthy Juice', 'Health and Wellness', 3.50, '2025-07-15', 5.50, 'Room Temperature', '2025-04-18', 'healthyjuice.jpg', 'Fresh and organic healthy juice blend'),
('f5e3e3d7-d8fe-4ad7-b464-eeb82b8e2e9a', 120, 'WellnessInc', 0.40, 'Vitamin C', 'Health and Wellness', 2.00, '2025-09-01', 3.00, 'Room Temperature', '2025-04-18', 'vitaminc.jpg', 'Vitamin C supplement for immunity support');

-- Insert Into Featured
INSERT INTO FeaturedItems (ItemID, EventDate) VALUES

('d2f24db5-70f2-4e7d-9a96-4a387a858a1e', '2025-04-18'),  
('59ff0a4a-1a15-4961-8a9e-89b062f60a7d', '2025-04-18'), 

('3e4c9fc9-1af1-4c3f-9953-7e4c2597bc21', '2025-04-18'), 
('c2017f6c-8fc3-4f2d-bdc1-49ce1d973b9c', '2025-04-18'),  

('19a1878c-7be3-4d7e-a6e7-89cd10998be0', '2025-04-18'),  
('7102d3f3-8c6f-41f2-aac6-4a05907e0ea1', '2025-04-18'),  

('5b8ab365-bd98-4e31-88a2-d39607c9c0a7', '2025-04-18'),  
('0c1a91e1-f148-4c11-8121-4371c03a56d3', '2025-04-18'),  

('af57e96d-5566-4765-b733-4fbb7861c401', '2025-04-18'),  
('efde2609-5d6e-47c2-b14e-fc234c49a138', '2025-04-18');   

-- Insert Customer Account
INSERT INTO Customer(CustomerID, JoinDate) VALUES 
('29bde254-1295-4faa-9c63-c5a721173f9f', '2025-04-18');

-- Insert Employee And Manager Account
INSERT INTO Employee (EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) VALUES
('41919578-dc21-41db-9988-64af08b72656', '2025-03-20', 'Employed', '1985-09-10', 'Marketing', 30, NULL ),
('4cedc688-2ef6-424c-9e14-c72cd3f45b29', '2025-04-03', 'Employed', '2025-04-02', 'Meat', 10, '41919578-dc21-41db-9988-64af08b72656');

-- Customer, Manager, And Employee Account
INSERT INTO Users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES
  ('manageraccount', '$2b$10$EnkK1LIZkFwfvH7j1exJ2OMt.sUUqPYZbr2GGK5DpLR.ryLdirWUa', 'Jane', 'Smith', '1-987-654-3210', '41919578-dc21-41db-9988-64af08b72656', NULL),
  ('customeraccount', '$2b$10$nCJXHSEss9weo1YWzK6hv.1VI3ua2Ee7SOkdiAkDUrBexEoo4YImW', 'customer', 'account', '1-408-499-0857', NULL, '29bde254-1295-4faa-9c63-c5a721173f9f'),
  ('employeeaccount', '$2b$10$qshO7B9Lge.sVLTF3XHwpePyloSIi1fbe7clrwSGzzh9YTQhDkxdi', 'Jane', 'Smither', '1-987-654-3212', '4cedc688-2ef6-424c-9e14-c72cd3f45b29', NULL);

-- Insert The Items That Are Near Expiration Into The Near Expiration Table
INSERT INTO NearExpiration(ItemID, EventDate)
SELECT ItemID, Now()
FROM Inventory
WHERE DATEDIFF(Expiration, CURDATE()) <= 3
AND ItemID NOT IN (SELECT ItemID FROM NearExpiration);

-- Insert The Items That Are Low Stock Into The Lowstock Table
INSERT INTO LowStockLog (ItemID, EventDate)
SELECT ItemID, NOW() FROM Inventory WHERE Quantity < 5;

-- Insert Faulty Robots Into The Faulty Robots Table
INSERT INTO FaultyRobots (RobotID, EventDate, Cause)
SELECT 
    RobotID,
    NOW(),
    CASE 
        WHEN RobotStatus = 'Broken' THEN 'Broken'
        WHEN RobotStatus = 'Maintenance' THEN 'Needs Maintenance'
    END
FROM Robot
WHERE RobotStatus IN ('Broken', 'Maintenance')
AND RobotID NOT IN (SELECT RobotID FROM FaultyRobots);