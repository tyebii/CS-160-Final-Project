// Require validateRobotStatus from your utils
const { validateRobotStatus } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Statuses (should return true)
const validStatuses = [
  "En Route",
  "Broken",
  "Charging",
  "Free",
  "Retired",
  "Maintenance"
];

// ❌ Invalid Format / Type / Status Values
const invalidStatuses = [
  null,
  "",
  "en route",
  "Offline",
  123,
  true
];

// ❌ Blacklist Injection Strings
const blacklistStatuses = [
  "Broken<",
  "Charging;",
  "Free>",
  "<script>alert('x')</script>",
  "Retired<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateRobotStatus(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateRobotStatus(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid Robot Statuses", validStatuses, true);
runTests("Invalid Format/Value", invalidStatuses, false);
runTests("Blacklisted Inputs", blacklistStatuses, false);
