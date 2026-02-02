const assert = require("assert");

// Load the browser-targeted util into Node.
require("../timeUtils.js");

const { parseDateTimeInput } = globalThis.TimeUtils;

function approxMs(a, b, toleranceMs = 1500) {
  return Math.abs(a - b) <= toleranceMs;
}

// now
{
  const before = Date.now();
  const d = parseDateTimeInput("now");
  const after = Date.now();
  assert(d instanceof Date);
  assert(approxMs(d.getTime(), (before + after) / 2));
}

// 1h ago
{
  const d = parseDateTimeInput("1h ago");
  assert(d instanceof Date);
  assert(approxMs(Date.now() - d.getTime(), 60 * 60 * 1000, 3000));
}

// tomorrow noon
{
  const d = parseDateTimeInput("tomorrow noon");
  assert(d instanceof Date);
  assert.strictEqual(d.getHours(), 12);
  assert.strictEqual(d.getMinutes(), 0);
}

// ISO-like
{
  const d = parseDateTimeInput("2024-08-04 15:30");
  assert(d instanceof Date);
  assert.strictEqual(d.getFullYear(), 2024);
  assert.strictEqual(d.getMonth(), 7);
  assert.strictEqual(d.getDate(), 4);
  assert.strictEqual(d.getHours(), 15);
  assert.strictEqual(d.getMinutes(), 30);
}

// invalid
{
  const d = parseDateTimeInput("not a date");
  assert.strictEqual(d, null);
}

console.log("timeUtils tests: OK");
