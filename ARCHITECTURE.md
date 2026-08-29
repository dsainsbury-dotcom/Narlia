# Narlia's World - Architecture

## Purpose

A static GitHub Pages application that combines a long-term cat GPS history with telemetry-style visual summaries and a Journey photo timeline.

## Runtime structure

The live app is launched through `index.html` and `launch-20260825.html`. These loader pages fetch the compressed dashboard payload and inject the live JavaScript overlays/controllers.

Key runtime files include:

- `dashboard-part1.b64`
- `dashboard-part2.b64`
- `dashboard-source.html`
- `index.html`
- `launch-20260825.html`
- `gpx-live-data.js`
- dated `gpx-live-data-YYYYMMDD.js` incremental overlays
- `infographic-toggle.js`
- `live-bindings.js`
- `journey-patch.js`
- `dante-photo-data.js`
- `profile-logo.js`

## Data model

The app uses a shared runtime `DATA` object. Incremental GPX overlays merge timestamped points into `DATA.full_timestamped_points`.

Fundamental rule: timestamp is the deduplication key for overlapping GPX exports.

After merge, affected daily records and lifetime aggregates are recalculated. Derived values include:

- daily distance
- max distance from home
- fixes per day
- lifetime total distance
- lifetime max range
- tracked days
- Recent 7-day window
- records and trend inputs

## Date model

The authoritative end/latest date is derived from the newest timestamp in the merged GPX dataset.

Never derive it from:

- file upload date
- Git commit date
- Pages deployment date
- current date

All UI components should read the same value to avoid contradictory dates.

## GPS processing

Raw fixes must be treated as measurements rather than unquestioned ground truth.

Filtering goals:

- remove impossible jumps/teleports
- remove obvious short stationary GPS wander
- avoid connecting long gaps as continuous travel
- preserve genuine movement/exploration
- prevent noise from inflating distance/range/activity

The current incremental overlays use time-gap segmentation for route drawing and daily calculations. Future refactors must preserve the established filtering behaviour unless intentionally improving it with tested results.

## Infographics

`infographic-toggle.js` provides two modes using the same visual design:

### Recent (7 Days)

Rolling seven-calendar-day window ending on the newest GPX date.

### All Time

Uses the complete cleaned lifetime history.

Both use:

- telemetry-style summary cards
- satellite map
- Tractive-style heat/activity representation
- current/record insight areas

The central map must be constrained to its grid column and must never overlap the right story/insight column.

## Journey

Journey is a photo-based timeline for Narlia, Dante and Amara.

Media policy is photo-only. Do not reintroduce video handling.

## Multi-cat future architecture

Each tracker should have:

- cat identity
- tracker ID
- independent raw/merged point history
- independent filtering/statistics
- independent Recent/All Time views where applicable

Combined household views may aggregate only when explicitly designed to do so.

Current known tracker mapping:

- Narlia: `IAJVTCCE`

## Deployment

GitHub Pages deploys from the repository. Cache/build IDs in the launchers are intentionally changed after live changes so browsers request fresh resources.

## Validation and recovery

Repository workflows validate runtime wiring and JavaScript syntax. Stable backup automation creates recoverable release points after successful validation. A manual recovery workflow/script is documented in `BACKUP_SYSTEM.md` and `RECOVERY.md`.

## Refactoring principle

Do not rewrite the whole app during routine updates. Keep data updates isolated from presentation changes. Structural refactors should begin from a known stable tag/branch and should be validated before replacing production.
