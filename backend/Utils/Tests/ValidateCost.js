// Require validateCost from your utils
const { validateCost } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Costs (should return true)
const validCosts = [
  0.01,
  5,
  99.99
];

// ❌ Invalid Format / Type / Cost Values
const invalidCosts = [
  null,
  "",
  "5",
  -5,
  0
];

// ❌ Blacklist Injection Strings
const blacklistCosts = [
  "<10.5>",
  "20;",
  "1.99<script>",
  "<script>alert('x')</script>",
  "12.99; DROP TABLE"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateCost(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateCost(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid Costs", validCosts, true);
runTests("Invalid Format/Value", invalidCosts, false);
runTests("Blacklisted Inputs", blacklistCosts, false);
