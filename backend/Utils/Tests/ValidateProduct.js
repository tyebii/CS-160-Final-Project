// Require validateProduct from your utils
const { validateProduct } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Products (should return true)
const validProducts = [
  "Apples",
  "WholeWheatBread",
  "FrozenFish123"
];

// ❌ Invalid Format / Type / Product Values
const invalidProducts = [
  null,
  "",
  "   ",
  "ThisProductNameIsWayTooLong".repeat(20),
  "Ap ples"
];

// ❌ Blacklist Injection Strings
const blacklistProducts = [
  "Apples<",
  "Bread>",
  "Item;",
  "<script>alert('x')</script>",
  "Apple<script>Pie</script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateProduct(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateProduct(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Products", validProducts, true);
runTests("Invalid Format/Value", invalidProducts, false);
runTests("Blacklisted Inputs", blacklistProducts, false);
