// Require validateRobotLoad from your utils
const { validateRobotLoad } = require('../Formatting'); // Adjust path if needed

// ✅ Valid RobotLoads (should return true)
const validRobotLoads = [
  0,
  5,
  100
];

// ❌ Invalid Format / Type / RobotLoad Values
const invalidRobotLoads = [
  null,
  "",
  "5",
  -1,
  {},
  []
];

// ❌ Blacklist Injection Strings
const blacklistRobotLoads = [
  "<10>",
  "50;",
  "5<script>",
  "<script>alert('x')</script>",
  "load<script>bad</script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateRobotLoad(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateRobotLoad(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid RobotLoads", validRobotLoads, true);
runTests("Invalid Format/Value", invalidRobotLoads, false);
runTests("Blacklisted Inputs", blacklistRobotLoads, false);
