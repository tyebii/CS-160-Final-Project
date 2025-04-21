// Require validatePassword from your utils
const { validatePassword } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Passwords (should return true)
const validPasswords = [
  "Password123!",
  "Strong@Pass1",
  "HelloWorld1!"
];

// ❌ Invalid Format / Type / Password Values
const invalidPasswords = [
  null,
  "",
  "short1!",
  "NOLOWERCASE1!",
  "nouppercase1!",
  "NoSpecialChar1",
  "With space 1!"
];

// ❌ Blacklist Injection Strings
const blacklistPasswords = [
  "badPass<",
  "12345678;",
  "Script<script>",
  "Hacker>",
  "1234<script>test</script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validatePassword(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validatePassword(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Passwords", validPasswords, true);
runTests("Invalid Format/Value", invalidPasswords, false);
runTests("Blacklisted Inputs", blacklistPasswords, false);
