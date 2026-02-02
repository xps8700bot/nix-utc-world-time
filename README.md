# NIX UTC & World Time (Chrome Extension)

A Manifest V3 Chrome extension that shows **UTC**, **local time**, and a **custom list of time zones** in a Nixie/glow styled popup. It also includes a **Convert Time** tool to convert an input time from a source timezone into all displayed timezones.

## Install (developer / unpacked)

1. Open Chrome/Chromium and go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder (the repo root)

## Build a ZIP

```bash
./build-zip.sh
```

This will create a versioned zip file under `./dist/`.

## Notes

- Timezone data is bundled in `timezoneDatabase.js` (large file).
- The popup is rendered by `popup.html` + `popup.js`.
