// Require validateBlacklist from your utils
const { validateBlacklist } = require('../Formatting'); // Adjust path if needed

// ✅ Clean Strings (should return false)
const validInputs = [
  "HelloWorld",
  "SafeString123",
  "This_is_safe"
];

// ❌ Blacklisted Strings (should return true)
const blacklistInputs = [
  "<script>",
  "data>wrong",
  "value<",
  "semi;colon",
  "danger<script>alert('bad')</script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateBlacklist(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateBlacklist(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Inputs (No Blacklist)", validInputs, false);
runTests("Blacklisted Inputs", blacklistInputs, true);
