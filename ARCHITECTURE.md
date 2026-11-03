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

## Our Cats profiles (1 November 2026)

- `cat-profiles-data.js` stores Narlia, Dante and Amara identities and confirmed metadata.
- `cat-profiles.js` adds the Our Cats overview and separate Dante and Amara profile pages without changing the approved Narlia telemetry layout.
- Dante and Amara were born 23 July 2026 and joined the household 29 October 2026. Their last reported weights are 1.7 kg and 1.6 kg respectively; measurement dates are unknown, so no growth trend is inferred.
- Only Narlia has GPS data (tracker IAJVTCCE). No kitten GPS points are included in her totals.
- Future dated weight measurements should be added per cat, preserving history. Use separate tracker identities if Dante or Amara start GPS tracking.

## Kitten portraits and Kitten Watch (1 November 2026)

- `media/amara-portrait-20261101.webp` and `media/dante-portrait-20261101.webp` are cropped, web-optimised versions of the user's supplied photographs. The first grey/lilac kitten is provisionally Amara, the second warmer brown kitten provisionally Dante, consistent with known coat descriptions; confirm the assignment when possible.
- The Our Cats overview and each kitten's profile show their own portrait and sex (Amara female, Dante male).
- `cat-profiles-data.js` holds the current Kitten Watch YouTube watch URL and the page embeds its validated video ID with the privacy-enhanced YouTube player. A Private YouTube stream may not be playable to visitors outside the owner account; change visibility only with Darren’s approval.
- Growth tracking remains separate from the third-party kitten weight app. One undated weight per kitten is recorded without implying a growth trend. Add dated weights from confirmed measurements.
- The approved Narlia GPS dashboard and data scripts remain unchanged by this kitten-only update. Both launchers share a cache-busting build ID.

## Auto Photos album and dated kitten weights (1 November 2026)

- Auto Photos album `Dante and Amara`, id `wE4DN-4klDuEIpI6RXJWC`, contained 12 photos on 1 November 2026. This is the intended source for future kitten galleries.
- Several older album images include multiple littermates. Do not assign older red/orange-collar kittens to Dante or Amara without user confirmation. Images clearly depicting both confirmed kittens should be added to both profiles.
- Current kitten galleries are separate per kitten and include each supplied portrait plus the existing verified shared photo with mum from 25 August 2026. The `gallery` arrays in `cat-profiles-data.js` can be expanded as new images are approved.
- Both kitten weights were taken on Tuesday 27 October 2026 at second vaccinations: Dante 1.70 kg; Amara 1.60 kg. They are dated observations, not proof of a growth trend.
- Auto Photos album images are not live-linked to the static GitHub Pages site. Future photo additions require fetching and publishing approved images. Do not claim unattended automatic updates without an actual scheduled workflow.

### Confirmed kitten collar identification

- User confirmed 1 November 2026: Dante wore **red** collar before coming home, and now wears **blue**.
- Amara wore **orange** collar before coming home, and now wears **pink**.
- When sorting the Auto Photos album, use these dated collar mappings; pictures with other kittens still require verification.

### Auto Photos gallery release (1 November 2026)

- Dante gallery: 10 photos, including confirmed red-collar solo pictures, shared photos of Dante and Amara, one home portrait and an earlier shared photo with mum.
- Amara gallery: 9 photos, including confirmed orange-collar solo pictures, shared photos of Dante and Amara, one home portrait and an earlier shared photo with mum.
- Ten Auto Photos images were imported as stable webp files under `media/auto-<image_id>.webp`, avoiding expiring Auto CDN URLs. Original Auto image IDs and capture dates are saved in each gallery entry for deduplication.
- Group shots with other littermates are described as such. Images with no reliable identification were not added.
- A visible `View N photos` button scrolls to each profile's gallery.

### Narlia's photo profile (1 November 2026)

- The Our Cats overview now shows a photo for Narlia, and its `View Narlia` button opens her own photo profile (`#narlia-profile`). A separate button opens the existing GPS infographic, preserving every established GPS dashboard tab and control.
- First photo candidate: Auto Photos image `jiFhNlNijjb99NaVi5GFm`, taken 13 September 2026, showing an adult grey tabby with white paws on a window perch. User identified Narlia as the tabby; this is the only clear real tabby photo found in the current synced library search. Confirmation can be requested if needed.
- Imported as stable `media/auto-jiFhNlNijjb99NaVi5GFm.webp` and referenced in `cat-profiles-data.js` with original Auto image ID for future deduplication. Narlia's original approved dashboard avatar is unchanged.
