// Require validateRegularID from your utils
const { validateRegularID } = require('../Formatting'); // Adjust path if needed

// ✅ Valid IDs (should return true)
const validIDs = [
  "user123",
  "employee456",
  "manager789"
];

// ❌ Invalid Format / Type / ID Values
const invalidIDs = [
  null,
  "",
  "a",
  "id with spaces",
  "id;"
];

// ❌ Blacklist Injection Strings
const blacklistIDs = [
  "id<",
  "id>;",
  "id<script>",
  "<script>alert('hax')</script>",
  "admin<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateRegularID(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateRegularID(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid IDs", validIDs, true);
runTests("Invalid Format/Value", invalidIDs, false);
runTests("Blacklisted Inputs", blacklistIDs, false);
