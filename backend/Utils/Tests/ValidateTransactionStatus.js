// Require validateTransactionStatus from your utils
const { validateTransactionStatus } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Statuses (should return true)
const validStatuses = [
  "In progress",
  "Complete",
  "Pending Delivery"
];

// ❌ Invalid Format / Type / Status Values
const invalidStatuses = [
  null,
  "",
  "complete", // wrong casing
  "Cancelled",
  12345
];

// ❌ Blacklist Injection Strings
const blacklistStatuses = [
  "In progress<",
  "Complete>",
  "Failed;",
  "<script>alert('x')</script>",
  "Delivering<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateTransactionStatus(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateTransactionStatus(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Statuses", validStatuses, true);
runTests("Invalid Format/Value", invalidStatuses, false);
runTests("Blacklisted Inputs", blacklistStatuses, false);
