# Narlia's World - Project State

Last reviewed: 30 Aug 2026

This file is the first source of truth for continuing development in a new ChatGPT conversation.

## Current live project

Repository: `dsainsbury-dotcom/Narlia`
Primary cat currently tracked by GPS: Narlia
Tracker ID: `IAJVTCCE`
Live site: GitHub Pages from the `main` branch.

## Current data state

- Lifetime history starts on 11 Aug 2026.
- Latest processed GPX upload: `export (10).gpx`.
- Latest genuine GPX timestamp in the merged data is 29 Aug 2026 13:37:56 UTC.
- All displayed latest/end dates must be derived from the latest timestamp actually present in the merged GPX data. Never use upload date, publish date, current date or a hard-coded date.
- GPX exports overlap by design. Overlapping timestamped fixes must be deduplicated before statistics are recalculated.

## Standard GPX update workflow

On every new GPX upload, do this without waiting for a second instruction:

1. Merge it with the existing lifetime dataset.
2. Remove overlapping timestamped points so nothing is duplicated.
3. Apply the agreed GPS-noise filtering rules.
4. Recalculate lifetime statistics.
5. Regenerate the rolling 7-day infographic.
6. Regenerate the All Time infographic.
7. Update Lifetime Story and all other affected views.
8. Set every displayed latest/end date from the newest timestamp in the merged GPX data.
9. Bump the launcher cache/build version.
10. Run validation.
11. Publish to GitHub Pages.
12. Verify deployment succeeded before reporting completion.

## Current dashboard views

- Infographic with `Recent (7 Days)` and `All Time` modes.
- Journey photo timeline.
- Lifetime Story.
- Last 30 Days.
- Daily Explorer.
- Records.
- Trends.
- Hotspot Investigations remains implemented in code but is intentionally hidden from navigation for now.

## Deferred feature: Hotspot Investigations

- Do not delete the hotspot analysis capability.
- Keep it hidden until the lifetime dataset is mature enough for recurring-place analysis to be genuinely meaningful rather than over-interpreting a short history.
- Reassess bringing it back once there is roughly 2-3 months of good cleaned GPS history, or earlier if repeated non-home locations become clearly established across many tracked days.
- When restored, it should focus on useful recurring-place behaviour such as repeated locations, visit frequency, timing patterns and dwell evidence, using only cleaned GPS data.

## Visual rules

- Preserve the existing dashboard design and navigation unless explicitly asked to redesign.
- Keep the dark telemetry-style infographic design.
- Keep satellite maps and the established Tractive-style activity heatmap calibration.
- Recent infographic is always the latest rolling 7-day window ending on the latest GPX date.
- All Time infographic uses the full cleaned lifetime dataset.
- Do not allow Leaflet/map elements to overflow into adjacent text panels.

## Journey/media rules

- Photo uploads only. Do not introduce video support.
- Preserve original uploaded photo quality where practical.
- New photos can be added to Journey with title, date/age and comments.
- Existing Dante eating material is represented as a still image, not video.

## Current safeguard state

- Git history preserves every committed release.
- Automatic validation workflow exists.
- Automatic stable-backup workflow exists.
- A pre-V2 backup branch exists: `backup/stable-20260827-before-v2`.
- Stable backup tags are created after successful validation.
- Restore tooling/workflow is present in the repository.
- Cache-busting is required on every live change.

## Future cats

Dante and Amara are already part of the Journey/story side of the project. When their own tracker GPX data starts arriving, each tracker must have its own identity and cleaned lifetime dataset. Do not mix cats' GPS points or statistics unless a combined household view is explicitly intended.

## New chat recovery

In a fresh conversation, read in this order:

1. `PROJECT_STATE.md`
2. `AI_CONTEXT.md`
3. `DECISIONS.md`
4. `ARCHITECTURE.md`
5. `RECOVERY.md`
6. `CHANGELOG.md`
7. `KNOWN_ISSUES.md`
8. `ROADMAP.md`
9. `SITE_UPDATE_RULES.md`
10. `BACKUP_SYSTEM.md`

Then inspect the current `main` branch, latest stable tag, launchers, GPX overlay files and recent GitHub Actions before making changes.
