//Import the database connection pool
const pool = require("../Database Pool/DBConnections");

//Call back for category name queries
const categoryQuery = (req, res) => {
  //Get the name of the category
  let { name } = req.params;

  //Replace the delimiters with spaces
  name = name.replace(/-/g, " ");

  //Check if value is in set
  if (!searchCategoryFormat(name)) {
    res.status(400).json({ error: "bad request format" });
    return;
  }

  //Get the items that match the category. This is catered toward customer
  pool.query(
    "SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE category = ?",
    [name],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    }
  );
};

//Call back for product name queries
const productQueryName = (req, res) => {
  //Get the name of the product
  let { name } = req.params;
  //Replace delimitters with spaces
  name = name.replace(/-/g, " ");

  //Makes sure input is proper
  if (!searchProductNameFormat(name)) {
    res.status(400).json({ error: "bad request format" });
    return;
  }

  //Queries for items that have the name in it
  pool.query(
    "SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ProductName like ?",
    ["%" + name + "%"],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    }
  );
};

//Call back for category name queries
const categoryQueryEmployee = (req, res) => {
  //Get category name
  let { name } = req.params;

  //Replace delimitters with spaces
  name = name.replace(/-/g, " ");

  //Validate the input
  if (!searchCategoryFormat(name)) {
    res.status(400).json({ error: "bad request format" });
    return;
  }

  //Get all information about items in category
  pool.query(
    "SELECT * FROM inventory WHERE category = ?",
    [name],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    }
  );
};

//Call back for product name queries
const productQueryNameEmployee = (req, res) => {
  //Get product name
  let { name } = req.params;

  //Replace delimitters with spaces
  name = name.replace(/-/g, " ");

  //Make sure that the input is sanitized
  if (!searchProductNameFormat(name)) {
    res.status(400).json({ error: "bad request format" });
    return;
  }

  //Get all information about items with name in it
  pool.query(
    "SELECT * FROM inventory WHERE ProductName like ?",
    ["%" + name + "%"],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    }
  );
};

//Call back for product id queries
const productQueryID = (req, res) => {
  //Get item id
  let { itemid } = req.params;

  //Query for items with that ID
  pool.query(
    "SELECT * FROM inventory WHERE ItemID = ?",
    [itemid],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    }
  );
};

//Call back for product id queries
const productCustomerQueryID = (req, res) => {
  //Get item id
  let { itemid } = req.params;

  //Query for items with that ID
  pool.query(
    "SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ItemID = ?",
    [itemid],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    }
  );
};

//Insert product into inventory
const productInsert = (req, res) => {
  //Items description to insert
  const {
    Quantity,
    Distributor,
    Weight,
    ProductName,
    Category,
    SupplierCost,
    Cost,
    Expiration,
    StorageRequirement,
    ImageLink,
    Description,
  } = req.body;

  //Make sure all the entries are up to code
  if (
    !insertFormat(
      Quantity,
      Distributor,
      Weight,
      ProductName,
      Category,
      SupplierCost,
      Cost,
      Expiration,
      StorageRequirement,
      ImageLink,
      Description
    )
  ) {
    res.status(400).json({ error: "bad request format" });
    return;
  }

  //Unique ID
  let InventoryID = uuidv4(); // Generates a cryptographically safe unique customer ID'

  //Insert into the inventory
  pool.query(
    "INSERT IGNORE INTO inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, StorageRequirement, LastModification, ImageLink, Cost, Description) Values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      InventoryID,
      Number(Quantity),
      Distributor,
      Number(Weight),
      ProductName,
      Category,
      Number(SupplierCost),
      new Date(Expiration),
      StorageRequirement,
      new Date(),
      ImageLink,
      Number(Cost),
      Description,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json({ success: true });
    }
  );
};

//update product in inventory
const productUpdate = (req, res) => {
  //Updated product
  const {
    ItemID,
    Quantity,
    Distributor,
    Weight,
    ProductName,
    Category,
    SupplierCost,
    Cost,
    Expiration,
    StorageRequirement,
    ImageLink,
    Description,
  } = req.body;

  //Check the format
  if (
    !insertFormat(
      Quantity,
      Distributor,
      Weight,
      ProductName,
      Category,
      SupplierCost,
      Cost,
      Expiration,
      StorageRequirement,
      ImageLink,
      Description
    )
  ) {
    res.status(400).json({ error: "bad request format" });
    return;
  }

  //Update the DB
  pool.query(
    "update inventory set Quantity = ?, Distributor = ?, Weight = ?, ProductName = ?, Category = ?, SupplierCost = ?, Expiration = ?, StorageRequirement = ?, LastModification = curdate(), ImageLink = ?, Cost = ?, Description = ? where ItemID = ?",
    [
      Number(Quantity),
      Distributor,
      Number(Weight),
      ProductName,
      Category,
      Number(SupplierCost),
      new Date(Expiration),
      StorageRequirement,
      ImageLink,
      Number(Cost),
      Description,
      ItemID,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json({ success: true });
    }
  );
};

//delete product
const deleteProduct = (req, res) => {
  //Get the itemid
  let { itemid } = req.params;

  //Format the ID
  if (!searchProductIDFormat(itemid)) {
    res.status(400).json({ error: "bad request format" });
    return;
  }

  //Delete from the inventory
  pool.query(
    "delete from inventory where ItemID = ?",
    [itemid],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json({ success: true });
    }
  );
};

//Low Stock Search
const lowStockSearch = (req, res) => {
  //Get the lowstock
  pool.query("select * from lowstocklog", (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    //modified by Austin to get count of low stock objects combined with original functionality
    res.status(200).json({
      count: results.length,
      lowStockItems: results,
    });
  });
};

//Input Validation
const insertFormat = (
  Quantity,
  Distributor,
  Weight,
  ProductName,
  Category,
  SupplierCost,
  Cost,
  Expiration,
  StorageRequirement,
  ImageLink,
  Description
) => {
  if (
    !(
      Distributor &&
      ProductName &&
      Category &&
      Expiration &&
      StorageRequirement &&
      ImageLink &&
      Description
    )
  ) {
    return false;
  }

  if (
    isNaN(Quantity) ||
    isNaN(Weight) ||
    isNaN(SupplierCost) ||
    isNaN(Cost) ||
    Cost < 0 ||
    Quantity < 0 ||
    Weight < 0 ||
    SupplierCost < 0
  ) {
    return false;
  }

  if (
    Distributor.trim() == "" ||
    ProductName.trim() == "" ||
    ImageLink.trim() == "" ||
    Description.trim() == ""
  ) {
    return false;
  }

  const categoryEnum = [
    "Fresh Produce",
    "Dairy and Eggs",
    "Meat and Seafood",
    "Frozen Foods",
    "Bakery and Bread",
    "Pantry Staples",
    "Beverages",
    "Snacks and Sweets",
    "Health and Wellness",
  ];
  const categorySet = new Set(categoryEnum);

  if (!categorySet.has(Category)) {
    return false;
  }

  const storageEnum = ["Frozen", "Room Temperature", "Warm", "Hot"];
  const storageSet = new Set(storageEnum);

  if (!storageSet.has(StorageRequirement)) {
    return false;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(Expiration)) {
    return false;
  }

  const expirationDate = new Date(Expiration);

  if (isNaN(expirationDate.getTime())) {
    return false;
  }
  return true;
};

//Format for product queries
const searchProductNameFormat = (productName) => {
  return productName && productName.trim() != "";
};

//Formatting for Category Queries
const searchCategoryFormat = (categoryName) => {
  const categoryEnum = [
    "Fresh Produce",
    "Dairy and Eggs",
    "Meat and Seafood",
    "Frozen Foods",
    "Bakery and Bread",
    "Pantry Staples",
    "Beverages",
    "Snacks and Sweets",
    "Health and Wellness",
  ];
  const categorySet = new Set(categoryEnum);
  return categorySet.has(categoryName);
};

//Exporting the methods
module.exports = {
  productQueryID,
  productQueryNameEmployee,
  productQueryName,
  categoryQuery,
  categoryQueryEmployee,
  productInsert,
  productUpdate,
  deleteProduct,
  lowStockSearch,
  productCustomerQueryID,
};
