// Require validateCategory from your utils
const { validateCategory } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Categories (should return true)
const validCategories = [
  "Fresh Produce",
  "Frozen Foods",
  "Health and Wellness"
];

// ❌ Invalid Format / Type / Category Values
const invalidCategories = [
  null,
  "",
  "fresh produce",
  "Snacks",
  "Unknown Category"
];

// ❌ Blacklist Injection Strings
const blacklistCategories = [
  "Fresh Produce<",
  "Pantry Staples;",
  "Beverages>",
  "<script>alert('x')</script>",
  "Snacks<script>Sweet</script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateCategory(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateCategory(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Categories", validCategories, true);
runTests("Invalid Format/Value", invalidCategories, false);
runTests("Blacklisted Inputs", blacklistCategories, false);
