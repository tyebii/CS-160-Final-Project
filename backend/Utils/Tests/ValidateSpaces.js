// Require validateSpaces from your utils
const { validateSpaces } = require('../Formatting'); // Adjust the path if necessary

// ✅ Valid Inputs (should return true)
const validSpaces = [
  "hello world",           // space between words
  " space at the end ",    // space at the end
  "  leading space",       // space at the start
  "text with    multiple spaces", // multiple spaces between words
];

// ❌ Invalid Inputs (should return false)
const invalidSpaces = [
  "helloworld",            // no spaces
  "noSpacesHere",          // no spaces
  "|",                  // only spaces (doesn't count as containing a space, it's just blank)
  "",                      // empty string
  "123456",                // no spaces, numeric string
  "abc123",                // no spaces, alphanumeric string
];

// ❌ Blacklist Injection Strings (testing for spaces mixed with blacklist characters)
const blacklistSpaces = [
  "hello< world",  // space + less than symbol
  "world>hel lo",   // space + greater than symbol
  "my; name",      // space + semicolon
  "abc 123; xyz",  // space + semicolon
  "abc<def> ghi",  // space + less than and greater than symbols
];

// Helper function to run test cases
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateSpaces(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateSpaces(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run all test groups
runTests("✅ Valid Inputs (Contain Spaces)", validSpaces, true);
runTests("❌ Invalid Inputs (No Spaces)", invalidSpaces, false);
runTests("❌ Blacklisted Inputs (Spaces with Blacklist Characters)", blacklistSpaces, true);
