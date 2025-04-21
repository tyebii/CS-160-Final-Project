// Require validateDateTime from your utils
const { validateDateTime } = require('../Formatting'); // Adjust path if needed

// ✅ Valid DateTimes (should return true)
const validDateTimes = [
  "2024-04-20T12:30",
  "2023-12-01T23:59:59"
];

// ❌ Invalid Format / Type / DateTime Values
const invalidDateTimes = [
  null,
  "",
  "2024-04-20 12:30",
  "2024-04-20T25:00",
  "2026-01-01T00:00:00" // Future datetime
];

// ❌ Blacklist Injection Strings
const blacklistDateTimes = [
  "2024-01-01T14:00<",
  "2024-01-01T14:00:00;",
  "2024-01-01T12:00<script>",
  "<script>alert('bad')</script>",
  "2024-04-20T12:00<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateDateTime(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateDateTime(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid DateTimes", validDateTimes, true);
runTests("Invalid Format/Value", invalidDateTimes, false);
runTests("Blacklisted Inputs", blacklistDateTimes, false);
