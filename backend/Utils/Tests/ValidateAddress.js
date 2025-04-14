// Require validateAddress from your utils
const { validateAddress } = require('../Formatting'); // Adjust path if needed

// ✅ Valid Addresses (should return true)
const validAddresses = [
  "1234 Main St, San Jose, California 95123",
  "5678 Oak Drive, San Jose, California 95008",
  "789 Pine Ave, San Jose, California 95020-1234", // With extended ZIP code
  "456 Maple Lane, San Jose, California 95130",    // Correct ZIP format
  "1234 Elm St., San Jose, California 95014",      // Period after street name
  "1001 Willow Blvd, San Jose, California 95122",  // Correct format
];

// ❌ Invalid Format / Type / Address Values
const invalidAddresses = [
  null,
  undefined,
  "",
  12345,
  {},
  "San Jose, California 95000",             // Missing street address
  "1234 Main St, California 95000",          // Missing 'San Jose' and 'California'
  "Main St, San Jose, California 95000",     // Missing street number
  "1234 Main St., San Jose, CA 95000",       // Incorrect state abbreviation
  "1234 Main St, San Jose, California 1234", // Invalid ZIP code
  "1234 Main St., San Jose, California 95123-123", // Invalid extended ZIP
  "1234 1st Ave San Jose, California 95123",  // Missing comma after street name
  "123 Main Street, SJ, California 95123",   // Invalid city abbreviation
  "12 34 Main St, San Jose, California 95123", // Invalid street number
  "abcd Main St, San Jose, California 95123", // Invalid street number
];

// ❌ Blacklist Injection Strings
const blacklistAddresses = [
  "1234 Main St, San Jose, California 95123<",
  "1234 Main St, San Jose, California 95123>",
  "1234 Main St, San Jose, California 95123;",
  "<script>alert('x')</script>",
  "1234 Main St, San Jose, California 95123<script>",
  "1234 <script>St</script>, San Jose, California 95123"
];

// Helper to run tests
function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  cases.forEach(input => {
    const result = validateAddress(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateAddress(${JSON.stringify(input)}) = ${result}`);
  });
}

// Run test groups
runTests("Valid Addresses", validAddresses, true);
runTests("Invalid Format/Value", invalidAddresses, false);
runTests("Blacklisted Inputs", blacklistAddresses, false);
