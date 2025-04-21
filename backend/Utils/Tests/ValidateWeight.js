// Require validateWeight from your utils
const { validateWeight } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Weights (should return true)
const validWeights = [
  0.5,
  1,
  20
];

// ❌ Invalid Format / Type / Weight Values
const invalidWeights = [
  null,
  "",
  "5",
  -1,
  0
];

// ❌ Blacklist Injection Strings
const blacklistWeights = [
  "<5>",
  "1.5;",
  "3<script>",
  "<script>alert('x')</script>",
  "10kg<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateWeight(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateWeight(${JSON.stringify(input)}) = ${result}`);
  });
}

runTests("Valid Weights", validWeights, true);
runTests("Invalid Format/Value", invalidWeights, false);
runTests("Blacklisted Inputs", blacklistWeights, false);
