// Require validateDate from your utils
const { validateDate } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Dates (should return true)
const validDates = [
  "2023-01-01",
  "2000-12-31",
  "1999-07-04",
  "2024-02-29", // Leap year
  new Date().toISOString().slice(0, 10) // today's date in correct format
];

// ❌ Invalid Format / Type / Date Values
const invalidDates = [
  null,
  undefined,
  "",
  12345,
  {},
  "2023/01/01",      // wrong separator
  "01-01-2023",      // wrong order
  "2023-1-1",        // missing zero-padding
  "2023-13-01",      // invalid month
  "2023-00-10",      // invalid month
  "2023-02-30",      // invalid day
  "2023-04-31",      // April only has 30 days
  "2023-11-31",      // November has 30 days
  "2023-06-00",      // invalid day
  "2023-06-99",      // day out of range
  "abcd-ef-gh",      // completely invalid string
  "2023-02-29"       // not a leap year
];

// ❌ Blacklist Injection Strings
const blacklistDates = [
  "2023-01-01<",
  "2023-01-01>",
  "2023-01-01;",
  "<script>alert('x')</script>",
  "2023;01;01",
  "2023-0<1-01"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateDate(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateDate(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Dates", validDates, true);
runTests("Invalid Format/Value", invalidDates, false);
runTests("Blacklisted Inputs", blacklistDates, false);
