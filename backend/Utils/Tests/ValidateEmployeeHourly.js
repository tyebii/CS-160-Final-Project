// Require validateEmployeeHourly from your utils
const { validateEmployeeHourly } = require('../Formatting'); // Adjust path if needed

// ✅ Valid HourlyWages (should return true)
const validHourlyWages = [
  0,
  15,
  40.5
];

// ❌ Invalid Format / Type / Hourly Values
const invalidHourlyWages = [
  null,
  "",
  -5,
  "20",
  {},
  []
];

// ❌ Blacklist Injection Strings
const blacklistHourlyWages = [
  "20<",
  "30;",
  "40<script>",
  "<script>alert('wage')</script>",
  "100<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateEmployeeHourly(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateEmployeeHourly(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid Hourly Wages", validHourlyWages, true);
runTests("Invalid Format/Value", invalidHourlyWages, false);
runTests("Blacklisted Inputs", blacklistHourlyWages, false);
