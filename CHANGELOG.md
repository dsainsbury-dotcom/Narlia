# Narlia's World - Changelog

This changelog records significant product/data/reliability changes. Git commit history remains the detailed audit trail.

## 2026-08-29

- Processed `export (10).gpx` into the lifetime dataset.
- Latest genuine GPX timestamp advanced to 29 Aug 2026 13:37:56 UTC.
- Updated Recent 7-day and All Time infographic data.
- Fixed All Time infographic map overlap so the Leaflet map remains inside its own column and does not cover the Current Story panel.
- Bumped cache version for the layout fix.
- Validation and GitHub Pages deployment succeeded after correcting the validator's expected cache ID.
- Added conversation-loss safeguards and project handover documentation:
  - `PROJECT_STATE.md`
  - `AI_CONTEXT.md`
  - `DECISIONS.md`
  - `ARCHITECTURE.md`
  - `RECOVERY.md`
  - `CHANGELOG.md`
  - `KNOWN_ISSUES.md`
  - `ROADMAP.md`

## 2026-08-28

- Processed `export (9).gpx` as an overlapping incremental export.
- Latest data advanced to 28 Aug 2026.
- GPX overlay, cache versioning, validation and stable backup flow confirmed.

## 2026-08-27

- Established V2 reliability safeguards.
- Created pre-V2 safety branch: `backup/stable-20260827-before-v2`.
- Added automatic validation and stable backup/recovery mechanisms.
- Corrected date-binding approach so the application uses actual GPX timestamps rather than upload/publish dates.

## August 2026 - earlier development

- Established Narlia's World interactive dashboard and GitHub Pages deployment.
- Added Lifetime Story, Last 30 Days, Daily Explorer, Records and Trends views.
- Added Hotspot Investigations.
- Added Journey photo timeline for Narlia, Dante and Amara.
- Switched media handling to photo-only mode.
- Added Recent 7-day infographic.
- Added matching All Time infographic toggle.
- Established satellite maps and Tractive-style activity heatmap calibration.
- Introduced cache-busting/versioned launchers to reduce stale-browser problems.
- Established incremental overlapping GPX processing with timestamp deduplication.
