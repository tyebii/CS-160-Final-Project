// Require validateQuantity from your utils
const { validateQuantity } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Quantities (should return true)
const validQuantities = [
  1,
  10,
  100
];

// ❌ Invalid Format / Type / Quantity Values
const invalidQuantities = [
  null,
  "10",
  0,
  -5,
  1.5
];

// ❌ Blacklist Injection Strings
const blacklistQuantities = [
  "<10>",
  "5;",
  "3<script>",
  "<script>alert('x')</script>",
  "10; DROP TABLE"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateQuantity(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateQuantity(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Quantities", validQuantities, true);
runTests("Invalid Format/Value", invalidQuantities, false);
runTests("Blacklisted Inputs", blacklistQuantities, false);
