// Require validateStorageRequirement from your utils
const { validateStorageRequirement } = require('../Formatting'); // Adjust path if needed

// ✅ Valid StorageTypes (should return true)
const validStorageTypes = [
  "Frozen",
  "Room Temperature",
  "UV-Protected",
  "Hazardous"
];

// ❌ Invalid Format / Type / Storage Values
const invalidStorageTypes = [
  null,
  "",
  "frozen",
  "cold",
  123
];

// ❌ Blacklist Injection Strings
const blacklistStorageTypes = [
  "Frozen<",
  "Room Temperature;",
  "Dry>",
  "<script>alert('x')</script>",
  "Refrigerated<script>"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateStorageRequirement(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateStorageRequirement(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid StorageTypes", validStorageTypes, true);
runTests("Invalid Format/Value", invalidStorageTypes, false);
runTests("Blacklisted Inputs", blacklistStorageTypes, false);
