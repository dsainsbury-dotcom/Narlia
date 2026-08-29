# Narlia's World - AI Context

Purpose: make the project safe to continue from a completely new AI/chat session without relying on old conversation history.

## First rule

Do not guess the current state from memory. Read the repository and current GitHub Actions first. Treat GitHub as the authoritative project record.

## User intent

The user wants a long-term cat GPS/story application that can be maintained incrementally. The normal interaction should be simple: upload a GPX or photo and the system/process should continue from the established state without repeated clarification.

## Non-negotiable data rules

- GPX files will normally overlap.
- Deduplicate overlapping fixes by timestamp before recalculation.
- Never double-count overlap.
- Apply GPS-noise filtering before calculating distance, territory, speed or activity metrics.
- Remove impossible jumps/teleports and obvious stationary jitter.
- Avoid drawing straight routes across long recording gaps.
- Preserve genuine exploration.
- Accuracy is more important than displaying every raw point.
- Latest/end date everywhere comes from the latest timestamp in the merged GPX data.
- Never substitute upload date, publish date or current date for the GPX data date.

## Standard GPX workflow

Automatically on a new GPX upload:

1. Merge with lifetime data.
2. Deduplicate overlap.
3. Filter GPS noise.
4. Recalculate lifetime statistics.
5. Rebuild Recent 7-day infographic.
6. Rebuild All Time infographic.
7. Update Lifetime Story and other affected pages.
8. Bind all latest/end dates to latest merged GPX timestamp.
9. Bump cache/build version.
10. Validate.
11. Publish.
12. Confirm Pages deployment succeeded.

Do not claim completion before validation and deployment are actually successful.

## Visual/design rules

- Preserve the current dashboard layout and navigation unless the user explicitly requests a redesign.
- Preserve the existing infographic visual master: dark telemetry dashboard, left summary, large central satellite/heatmap, right insight/story column, bottom analytics/record cards.
- Recent infographic = rolling latest 7 days.
- All Time infographic = full cleaned lifetime dataset.
- Heatmap should resemble the preferred Tractive balance: meaningful red core for frequent/high dwell, orange/yellow strong use, green lighter use, without one oversized red blob.
- Satellite maps remain the default.
- Map containers must stay within their own layout columns and never cover story/text panels.
- Cache busting is mandatory after live changes.

## Media rules

- User uploads photos only, not videos.
- Do not add video workflows.
- Keep uploaded photo quality high and avoid needless recompression/grain.
- Journey entries should preserve date/age/comment context.

## Cat identity rules

- Narlia tracker: `IAJVTCCE`.
- Dante and Amara are part of the story/Journey and will later receive their own GPX streams.
- Keep per-cat GPS datasets separate unless a combined household view is deliberately created.

## Safety/recovery rules

Before risky structural work, identify the latest stable backup/tag/branch.

Current known recovery anchor:
- `backup/stable-20260827-before-v2`

The repository contains validation and stable-backup workflows. Preserve them. If a change fails validation, fix it before declaring the release stable. If a live release breaks badly, restore from the most recent verified stable tag/backup rather than trying random live edits.

## New chat handover protocol

Read these before editing:

`PROJECT_STATE.md`
`AI_CONTEXT.md`
`DECISIONS.md`
`ARCHITECTURE.md`
`RECOVERY.md`
`CHANGELOG.md`
`KNOWN_ISSUES.md`
`ROADMAP.md`
`SITE_UPDATE_RULES.md`
`BACKUP_SYSTEM.md`

Then inspect:
- `index.html`
- `launch-20260825.html`
- current `gpx-live-data*.js`
- `infographic-toggle.js`
- `live-bindings.js`
- `.github/workflows/`
- recent Actions runs
- latest stable tag/backup

## Communication rule

Be concise. If work can be carried out directly, do it. Do not repeatedly describe a plan instead of implementing it. If blocked, state the exact blocker and what remains undone.
