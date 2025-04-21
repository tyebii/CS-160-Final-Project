// Require validateAddress from your utils
const { validateAddress } = require('../Formatting');

// ✅ Valid Addresses (should return true)
const validAddresses = [
  "1234 Main St, San Jose, California 95123",
  "5678 Oak Drive, San Jose, California 95008",
  "789 Pine Ave, San Jose, California 95020-1234",
  "456 Maple Lane, San Jose, California 95130",
  "1234 Elm St., San Jose, California 95014",
  "1001 Willow Blvd, San Jose, California 95122",
];

// ❌ Invalid Format / Type / Address Values
const invalidAddresses = [
  null,
  undefined,
  "",
  12345,
  {},
  "San Jose, California 95000",
  "1234 Main St, California 95000",
  "Main St, San Jose, California 95000",
  "1234 Main St., San Jose, CA 95000",
  "1234 Main St, San Jose, California 1234",
  "1234 Main St., San Jose, California 95123-123",
  "1234 1st Ave San Jose, California 95123",
  "123 Main Street, SJ, California 95123",
  "12 34 Main St, San Jose, California 95123",
  "abcd Main St, San Jose, California 95123",
];

// ❌ Blacklist Injection Strings
const blacklistAddresses = [
  "1234 Main St, San Jose, California 95123<",
  "1234 Main St, San Jose, California 95123>",
  "1234 Main St, San Jose, California 95123;",
  "<script>alert('x')</script>",
  "1234 Main St, San Jose, California 95123<script>",
  "1234 <script>St</script>, San Jose, California 95123",
];

// Helper to run tests
async function runTests(label, cases, expected) {
  console.log(`\n${label}`);
  for (const input of cases) {
    const result = await validateAddress(input);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateAddress(${JSON.stringify(input)}) = ${result}`);
  }
}


// Run test groups
(async () => {
  await runTests("Valid Addresses", validAddresses, true);
  await runTests("Invalid Format/Value", invalidAddresses, false);
  await runTests("Blacklisted Inputs", blacklistAddresses, false);
})();

