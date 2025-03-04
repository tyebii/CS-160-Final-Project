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
