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

INSERT INTO Address (Address, City, Zip, Street, State) VALUES
('addr001', 'San Francisco', '94105', '123 Market St', 'CA'),
('addr002', 'Los Angeles', '90001', '456 Sunset Blvd', 'CA'),
('addr003', 'San Diego', '92101', '789 Harbor Dr', 'CA');

INSERT INTO CreditCard (CardNumber, CardHolderFirst, CardHolderLast, SecurityCode) VALUES
('4111111111111111', 'John', 'Doe', '123'),
('5555555555554444', 'Jane', 'Smith', '456'),
('378282246310005', 'Alice', 'Johnson', '789');

INSERT INTO Inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, Cost, StorageRequirement, LastModification, ImageLink, Description) VALUES
('item001', 50, 'FreshFarm', 2.5, 'Apples', 'Fresh Produce', 1.00, '2025-05-10', 2.50, 'Room Temperature', '2025-03-15', 'apple.jpg', 'Red delicious apples.'),
('item002', 20, 'DairyBest', 1.0, 'Milk', 'Dairy and Eggs', 2.00, '2025-04-20', 4.00, 'Refrigerated', '2025-03-15', 'milk.jpg', 'Organic whole milk.'),
('item003', 10, 'SeafoodSupply', 5.0, 'Salmon', 'Meat and Seafood', 7.50, '2025-03-25', 15.00, 'Frozen', '2025-03-15', 'salmon.jpg', 'Fresh')

INSERT INTO ShoppingCart (CustomerID, ItemID, OrderQuantity) VALUES
('cust001', 'item001', 3),
('cust002', 'item002', 2),
('cust003', 'item003', 1);

INSERT INTO Robot (RobotID, CurrentLoad, RobotAddress, RobotStatus, Maintanence, Speed, BatteryLife, EstimatedDelivery) VALUES
('robot001', 5.0, 'addr001', 'En Route', '2025-03-01', 10.0, 80.0, 15.0),
('robot002', 2.0, 'addr002', 'Charging', '2025-03-05', 8.5, 50.0, NULL),
('robot003', 0.0, 'addr003', 'Free', '2025-02-28', 9.0, 100.0, NULL);

INSERT INTO Transactions (CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate, RobotID) VALUES
('cust001', 'txn001', 7.50, 2.5, 'addr001', 'Complete', '2025-03-10', 'robot001'),
('cust002', 'txn002', 8.00, 1.0, 'addr002', 'In progress', '2025-03-12', 'robot002'),
('cust003', 'txn003', 15.00, 5.0, 'addr003', 'Failed', '2025-03-09', 'robot003');

INSERT INTO CustomerCreditCards (CustomerID, CardNumber) VALUES
('cust001', '4111111111111111'),
('cust002', '5555555555554444'),
('cust003', '378282246310005');

INSERT INTO CustomerAddress (Address, CustomerID) VALUES
('addr001', 'cust001'),
('addr002', 'cust002'),
('addr003', 'cust003');
