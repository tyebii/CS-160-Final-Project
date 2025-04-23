// Import the necessary utility
const { validateName } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Names (should return true)
const validNames = [
  "John",                   // Typical name
  "A",                      // Single character name (valid)
  "Max",                    // Valid short name
  "LongNameLongNameLongName", // Longer name
  "Name with spaces",       // Name with spaces
  "O'Conner",               // Name with apostrophe
  "Mary-Jane",              // Name with hyphen
  "Alice. Bob",             // Name with period
  "Jane123",                // Name with numbers (valid)
  "Anne-Marie",             // Name with hyphen
];

// ❌ Invalid Names (should return false)
const invalidNames = [
  null,                     // Null input
  undefined,                // Undefined input
  "",                       // Empty string
  "J",                      // Name too short
  "A".repeat(256),          // Name too long
  12345,                    // Numeric input
  {},                       // Object input
  [],                       // Array input
  "name<>",                 // Name with blacklist characters
];

// ❌ Blacklist Injection Strings
const blacklistNames = [
  "John<",
  "Jane>",
  "John;",
  "<script>alert('x')</script>",  // Script injection
  "Jane;Doe",                  // Blacklist characters in the name
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateName(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateName(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Names", validNames, true);
runTests("Invalid Names", invalidNames, false);
runTests("Blacklisted Inputs", blacklistNames, false);
