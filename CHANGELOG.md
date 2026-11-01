## 1 November 2026 - Auto Photos galleries populated

- Imported ten confirmed Auto Photos pictures as permanent GitHub media assets.
- Dante profile now lists 10 photos and Amara 9, with shared photos appearing in both.
- Added prominent 'View photos' buttons and a count above each gallery.
- Retained Narlia's GPS and dashboard controls unchanged.

## 1 November 2026 - Confirmed collar identities

- Dante: red collar before adoption, blue collar now. Amara: orange collar before adoption, pink collar now. Saved identity mappings for future Auto Photos sorting.

## 1 November 2026 - Dated kitten weights and photo galleries

- Confirmed Auto Photos album `Dante and Amara` (12 photos at inspection), with older littermate images pending identity confirmation.
- Dated Dante's 1.70 kg and Amara's 1.60 kg weigh-ins to Tuesday 27 October 2026 (second vaccinations).
- Added separate photo gallery sections for each kitten with their own portraits and a verified shared picture with mum, included in both galleries.
- Left Narlia's GPS dashboard, infographic buttons and GPX data scripts unchanged; synchronized both launchers.

## 1 November 2026 - Kitten portraits and Kitten Watch

- Added the user's actual Amara and Dante photographs as web-optimised portrait assets, provisionally assigned using known coat colours and collars.
- Added the confirmed sexes from the supplied growth-tracker screenshots (Amara female, Dante male).
- Added a Kitten Watch tab and a placeholder page. It will load the YouTube stream when a valid link is provided; no live stream is currently connected.
- Preserved the third-party growth tracker as the source for kitten weigh-ins, with the last reported 1.6 kg and 1.7 kg readings still undated.
- Checked Narlia's existing GPX data scripts, mode buttons, live bindings and all six dashboard sections remained wired; this release does not change Narlia's GPS data.

## 1 November 2026 - GPX refresh and Dante/Amara pages

- Merged Narlia's 19 October to 1 November GPX export, deduplicating timestamps and excluding two isolated implausible GPS spikes.
- Refreshed lifetime, last-30-day, daily, records, trends and rolling 7-day infographic data through 1 November 2026.
- Added Our Cats navigation and separate Dante and Amara pages, confirmed birth/arrival dates and last-reported undated weights.
- Preserved Narlia's tracker identity, approved infographic and existing Journey content.

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
