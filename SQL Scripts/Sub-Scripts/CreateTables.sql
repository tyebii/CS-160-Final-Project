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
	Address varchar(255) primary key,
    City varchar(255) not null,
    Zip char(5) not null,
    Street varchar(255) not null,
    State varchar(255) not null
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
    StorageRequirement enum('Frozen', 'Room Temperature', 'Warm', 'Hot','Refrigerated') not null,
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
    RobotAddress varchar(255) not null,
    RobotStatus enum('En Route', 'Broken', 'Maintenance', 'Charging', 'Free') not null,
    Maintanence Date not null,
	Speed double not null,
    BatteryLife double not null,
    EstimatedDelivery double,
	Foreign Key(RobotAddress) References Address(Address) on delete cascade
);

Create Table Transactions(
	CustomerID varchar(255),
    TransactionID varchar(255),
    TransactionCost double not null,
	TransactionWeight double not null,
    TransactionAddress varchar(255),
    TransactionStatus enum('In progress', 'Complete', 'Failed') not null,
    TransactionDate date not null,
    RobotID varchar(255),
    Foreign Key(TransactionAddress) References Address(Address) on delete cascade,
    Foreign Key(CustomerID) References Customer(CustomerID) on delete cascade,
    Foreign Key(RobotID) References Robot(RobotID),
    Primary Key(CustomerID, TransactionID)
);

Create Table CustomerAddress(
	Address varchar(255) ,
    CustomerID varchar(255) ,
	Foreign Key(Address) References Address(Address) on delete cascade,
    Foreign Key(CustomerID) References Customer(CustomerID) on delete cascade,
    Primary Key(Address,CustomerID)
);

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
)