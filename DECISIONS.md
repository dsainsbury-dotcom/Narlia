# Narlia's World - Decisions Log

This file records deliberate project decisions so a future chat or developer does not accidentally undo them.

## D001 - GitHub is the project source of truth

Decision: important operational knowledge must live in the repository, not only in chat memory.

Reason: conversations can reach limits or lose context. The repo must be sufficient to resume safely.

## D002 - GPX exports overlap

Decision: every new GPX export is treated as incremental/overlapping input and merged by timestamp deduplication.

Reason: Tractive exports overlap by design. Appending blindly inflates distance, fixes and activity statistics.

## D003 - Latest date comes from GPX data

Decision: every displayed latest/end date must come from the newest actual timestamp in the merged GPX dataset.

Reason: upload/publish dates can be newer than the tracking data and caused inconsistent dates previously.

## D004 - GPS noise must not inflate statistics

Decision: remove impossible jumps, teleports, obvious stationary wander and inappropriate long-gap straight lines before calculating movement metrics.

Reason: accuracy matters more than retaining every raw point.

## D005 - Recent infographic is rolling 7 days

Decision: the Recent infographic always covers the latest 7-day window ending on the newest GPX date.

Reason: it provides a clean weekly snapshot without replacing lifetime history.

## D006 - All Time infographic uses full lifetime data

Decision: the All Time view mirrors the visual style of Recent but uses the complete cleaned dataset.

Reason: user wants both recent context and lifetime perspective without switching to a different design language.

## D007 - Preserve the infographic visual master

Decision: keep the dark telemetry layout, left stats column, central satellite/heatmap, right insight/story panel and supporting analytics.

Reason: this design is an explicitly approved baseline.

## D008 - Tractive-style heatmap calibration

Decision: tune activity heatmaps so frequent/high-dwell locations form a meaningful red core, strong use is orange/yellow and lighter use is green, avoiding a single oversized red blob.

Reason: this gives a more useful visual balance and matches the preferred Tractive reference.

## D009 - Photos only

Decision: Journey/media uploads are photos only. Do not build or reintroduce video support.

Reason: removing video simplified reliability and the user explicitly chose photo-only uploads.

## D010 - Cache bust on every live change

Decision: launcher/cache build IDs must change whenever live JS/data/layout changes.

Reason: browsers, especially desktop Safari/Chrome-style caching scenarios, previously served stale versions after refresh.

## D011 - Validate before declaring success

Decision: never say a release is complete until JavaScript/release validation and GitHub Pages deployment succeed.

Reason: previous false-positive completion created avoidable confusion and risk.

## D012 - Backups are part of the release process

Decision: preserve stable release tags/backups and keep a known recovery point before risky changes.

Reason: a broken live change should be reversible quickly without reconstructing the project from chat history.

## D013 - Per-cat GPS histories remain separate

Decision: Narlia, Dante and Amara must have separate tracker identities and GPS histories when multiple trackers are active.

Reason: combined statistics would be meaningless unless a combined household view is intentionally requested.

## D014 - No fence analysis until reliable boundaries exist

Decision: do not present Safe Fence/geofence analysis until accurate boundary coordinates or equivalent reliable data are available.

Reason: inferred fence behaviour would look authoritative while being based on uncertain geometry.

## D015 - Preserve working design during GPX updates

Decision: routine GPX updates update data and derived outputs, not the application's layout/design.

Reason: data refreshes should be low risk and should not create unrelated UI regressions.
