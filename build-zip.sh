#!/usr/bin/env bash
set -euo pipefail

# Build script for NIX UTC & World Time Chrome Extension
# Creates a versioned zip in ./dist/ based on manifest.json.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "Building Chrome extension package..."

VERSION="$(python3 -c 'import json; print(json.load(open("manifest.json"))["version"])')"
OUT_DIR="$ROOT_DIR/dist"
OUT_FILE="$OUT_DIR/nix-utc-world-time-v${VERSION}.zip"

mkdir -p "$OUT_DIR"
rm -f "$OUT_FILE"

python3 - << 'PY'
import json
import zipfile
from pathlib import Path

root = Path.cwd()
manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
version = manifest['version']
out_dir = root / 'dist'
out_dir.mkdir(exist_ok=True)
out_file = out_dir / f'nix-utc-world-time-v{version}.zip'

files = [
    'manifest.json',
    'background.js',
    'popup.html',
    'popup.js',
    'timeUtils.js',
    'timezoneDatabase.js',
    'icons/icon16.png',
    'icons/icon48.png',
    'icons/icon128.png',
    'icons/icons8-copy-24.png',
    'icons/icons8-trash-24.png',
]

# Include all locale message files.
locale_files = sorted((root / '_locales').glob('*/messages.json'))
for p in locale_files:
    files.append(str(p.relative_to(root)))

with zipfile.ZipFile(out_file, 'w', zipfile.ZIP_DEFLATED) as zf:
    for file in files:
        p = root / file
        if not p.exists():
            raise SystemExit(f"Missing file: {file}")
        zf.write(p, arcname=file)
        print(f"Added: {file}")

print(f"\n✅ Successfully created {out_file}")
PY

ls -lh "$OUT_FILE"
