// Require validateEmployeeStatus from your utils
const { validateEmployeeStatus } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Statuses (should return true)
const validStatuses = [
  "Employed",
  "Absence",
  "Fired"
];

// ❌ Invalid Format / Type / Status Values
const invalidStatuses = [
  null,
  "",
  "Working",
  "Laid off",
  123
];

// ❌ Blacklist Injection Strings
const blacklistStatuses = [
  "Fired<",
  "Absence;",
  "Employed>",
  "<script>alert('hack')</script>",
  "Absent<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateEmployeeStatus(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateEmployeeStatus(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid Employee Statuses", validStatuses, true);
runTests("Invalid Format/Value", invalidStatuses, false);
runTests("Blacklisted Inputs", blacklistStatuses, false);
