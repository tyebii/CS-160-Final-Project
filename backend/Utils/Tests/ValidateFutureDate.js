// Require validateFutureDate from your utils
const { validateFutureDate } = require('../Formatting'); // Adjust path if needed

// ✅ Future Dates (should return true)
const validDates = [
  "2030-01-01",
  "2026-12-31"
];

// ❌ Invalid / Past Dates (should return false)
const invalidDates = [
  null,
  "2023-01-01",
  "not-a-date",
  "04-21-2024",
  "2024-01-01<script>"
];

// ❌ Blacklist Injection Strings
const blacklistDates = [
  "2025-01-01<",
  "2025-01-01>",
  "2025-01-01;",
  "<script>alert('hax')</script>",
  "2030<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateFutureDate(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateFutureDate(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid Future Dates", validDates, true);
runTests("Invalid or Past Dates", invalidDates, false);
runTests("Blacklisted Inputs", blacklistDates, false);
