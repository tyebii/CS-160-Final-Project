// Require validatePhoneNumber from your utils
const { validatePhoneNumber } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Phone Numbers (should return true)
const validPhoneNumbers = [
  "1-408-555-1234",
  "1-800-222-9876"
];

// ❌ Invalid Format / Type / Phone Number Values
const invalidPhoneNumbers = [
  null,
  "",
  "408-555-1234",
  "1 408 555 1234",
  "1-408-555-123"
];

// ❌ Blacklist Injection Strings
const blacklistPhoneNumbers = [
  "1-408-555-1234<",
  "1-408-555-1234;",
  "1-408-555-1234>",
  "<script>",
  "1-800<script>-1234"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validatePhoneNumber(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validatePhoneNumber(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Phone Numbers", validPhoneNumbers, true);
runTests("Invalid Format/Value", invalidPhoneNumbers, false);
runTests("Blacklisted Inputs", blacklistPhoneNumbers, false);
