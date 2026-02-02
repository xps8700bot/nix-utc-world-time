/* global globalThis */

// Small, testable utilities used by the Convert Time feature.
//
// This file is loaded in the popup (non-module). We also keep it runnable under
// Node for lightweight unit tests.

(function (root) {
  function parseDateTimeInput(input, _sourceTimezone = null) {
    if (!input || !input.trim()) return null;

    const inputLower = input.toLowerCase().trim();

    // Handle relative time expressions
    if (inputLower === "now") {
      return new Date();
    }

    if (inputLower === "1h ago" || inputLower === "1 hour ago") {
      return new Date(Date.now() - 60 * 60 * 1000);
    }

    if (inputLower === "tomorrow noon" || inputLower === "tomorrow 12pm") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);
      return tomorrow;
    }

    // Try parsing with Date constructor first (handles many formats)
    let parsedDate = new Date(input);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    // Try various date/time formats
    const formats = [
      // ISO formats
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
      /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
      /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/,

      // US formats
      /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}) (AM|PM)/i,
      /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})/,

      // Other common formats
      /(\w{3}) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2}) (AM|PM)/i,
      /(\d{1,2}) (\w{3}) (\d{4}) (\d{1,2}):(\d{2})/,
    ];

    // If Date(input) fails, try specific formats (ISO-like only for now).
    for (const format of formats) {
      const match = input.match(format);
      if (match) {
        // Only handle ISO-like formats here; other formats are typically handled
        // by Date(input) on most platforms.
        if (format.source.includes("T") || format.source.includes(" ")) {
          const year = parseInt(match[1]);
          const month = parseInt(match[2]) - 1; // JS months are 0-based
          const day = parseInt(match[3]);
          const hour = parseInt(match[4]);
          const minute = parseInt(match[5]);
          const second = match[6] ? parseInt(match[6]) : 0;

          parsedDate = new Date(year, month, day, hour, minute, second);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
          }
        }
      }
    }

    return null;
  }

  root.TimeUtils = root.TimeUtils || {};
  root.TimeUtils.parseDateTimeInput = parseDateTimeInput;
})(typeof window !== "undefined" ? window : globalThis);
