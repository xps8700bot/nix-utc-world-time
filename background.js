// Background service worker (MV3)
//
// Keep a lightweight `utcTime` value in storage so the popup can render UTC
// without doing extra work. The popup handles timezone conversions itself.

chrome.alarms.create("updateTime", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateTime") updateUtcTime();
});

function updateUtcTime() {
  chrome.storage.local.set({ utcTime: new Date().toISOString() });
}

chrome.runtime.onInstalled.addListener(() => {
  updateUtcTime();
});
