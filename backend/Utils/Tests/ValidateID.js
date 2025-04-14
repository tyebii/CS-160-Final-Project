// Require the validateID function
const { validateID } = require('../Formatting'); 

// ✅ Valid UUIDs (should return true)
const validIDs = [
  "550e8400-e29b-41d4-a716-446655440000",
  "123e4567-e89b-12d3-a456-426614174000",
  "ffffffff-ffff-ffff-ffff-ffffffffffff",
  "00000000-0000-0000-0000-000000000001",
  "abcDEF12-3456-7890-abCD-ef1234567890"
];

const invalidIDs = [
  null,
  undefined,
  "",
  "abc",
  "a".repeat(256),
  12345,
  {},
  ["550e8400-e29b-41d4-a716-446655440000"]
];

// ❌ Invalid Format UUIDs
const formatFailures = [
  "550e8400e29b41d4a716446655440000",
  "550e8400-e29b-41d4-a716",
  "this-is-not-a-uuid",
  "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
  "g1234567-e89b-12d3-a456-426614174000",
  "12345678-1234-1234-1234-1234567890gh"
];

const blacklistedIDs = [
  "550e8400-e29b-41d4-a716-446655440000;",  
  "550e8400-e29b-41d4-a716-446655440000<",  
  "550e8400-e29b-41d4-a716-446655440000>",  
  "<script>",                               
  ";;;;;",                               
  "550e8400-e29b-41d4-<716>-446655440000",  
];

// Helper function to run the test cases
function runTests(label, ids, expected) {
  console.log(`\n${label}`);
  ids.forEach(id => {
    const result = validateID(id);
    const pass = result === expected ? "✅" : "❌";
    console.log(`${pass} validateID(${JSON.stringify(id)}) = ${result}`);
  });
}

// Run all tests
runTests("Valid UUIDs", validIDs, true);
runTests("Invalid - Type/Length", invalidIDs, false);
runTests("Invalid - Bad Format", formatFailures, false);
runTests("Invalid - Blacklisted", blacklistedIDs, false);
