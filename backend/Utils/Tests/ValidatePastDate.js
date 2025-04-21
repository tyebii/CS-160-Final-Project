// Require validatePastDate from your utils
const { validatePastDate } = require('../Formatting'); // Adjust path if needed

// ✅ Past Dates (should return true)
const validDates = [
  "2000-01-01",
  "2023-12-31"
];

// ❌ Invalid / Future Dates (should return false)
const invalidDates = [
  null,
  "not-a-date",
  "2026-01-01",
  "01-01-2000",
  "2024-04-21<script>"
];

// ❌ Blacklist Injection Strings
const blacklistDates = [
  "2023-01-01<",
  "2023-01-01>",
  "2023-01-01;",
  "<script>alert('past')</script>",
  "2000<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validatePastDate(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validatePastDate(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid Past Dates", validDates, true);
runTests("Invalid or Future Dates", invalidDates, false);
runTests("Blacklisted Inputs", blacklistDates, false);
