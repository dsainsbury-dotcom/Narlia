#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-}"
if [[ -z "$TAG" ]]; then
  echo "Usage: scripts/restore-runtime.sh <stable-tag>"
  exit 2
fi

if ! git rev-parse "$TAG^{commit}" >/dev/null 2>&1; then
  echo "Backup tag not found: $TAG"
  exit 3
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git archive "$TAG" | tar -x -C "$TMP"

# Runtime files that make up the live dashboard. Infrastructure, workflows,
# documentation and backup tooling are deliberately NOT rolled back.
patterns=(
  "index.html"
  "launch-*.html"
  "dashboard-source.html"
  "dashboard*.b64"
  "dashchunk*.txt"
  "data*.js"
  "gpx-live-data*.js"
  "infographic*.js"
  "journey*.js"
  "*-photo-data.js"
  "profile-logo.js"
)

for pattern in "${patterns[@]}"; do
  shopt -s nullglob
  current=( $pattern )
  for f in "${current[@]}"; do rm -f -- "$f"; done
  restored=( "$TMP"/$pattern )
  for src in "${restored[@]}"; do
    [[ -f "$src" ]] && cp -p "$src" "$(basename "$src")"
  done
  shopt -u nullglob
done

for dir in assets media images; do
  if [[ -d "$TMP/$dir" ]]; then
    rm -rf "$dir"
    cp -a "$TMP/$dir" "$dir"
  fi
done

node --check gpx-live-data.js 2>/dev/null || true
for f in gpx-live-data*.js infographic*.js journey*.js *-photo-data.js profile-logo.js; do
  [[ -f "$f" ]] && node --check "$f"
done

if [[ ! -s index.html ]]; then
  echo "Restore failed: index.html missing or empty"
  exit 4
fi

echo "Runtime restored from $TAG"
