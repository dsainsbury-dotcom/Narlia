# Narlia's World - Recovery Guide

Use this if a chat reaches its limit, a new AI session starts, a deployment breaks, or project context is uncertain.

## A. New chat / lost conversation context

Do not start editing immediately.

Read these repository files in order:

1. `PROJECT_STATE.md`
2. `AI_CONTEXT.md`
3. `DECISIONS.md`
4. `ARCHITECTURE.md`
5. `CHANGELOG.md`
6. `KNOWN_ISSUES.md`
7. `ROADMAP.md`
8. `SITE_UPDATE_RULES.md`
9. `BACKUP_SYSTEM.md`

Then inspect the `main` branch and determine:

- latest commit
- current launcher build/cache ID
- newest dated GPX overlay
- latest GPX filename recorded in code
- latest genuine GPX timestamp
- most recent successful validation run
- most recent successful GitHub Pages deployment
- latest stable backup/tag

Only then continue development.

## B. Live site is broken

1. Do not make multiple speculative edits.
2. Identify the commit that introduced the break.
3. Check the latest successful validation and stable backup/tag.
4. If the fault is obvious and small, fix it and validate.
5. If the site is materially broken or the cause is uncertain, restore the previous verified stable release using the repository restore tooling/workflow documented in `BACKUP_SYSTEM.md`.
6. Verify GitHub Pages deployment before declaring recovery complete.

Known deep recovery anchor:

`backup/stable-20260827-before-v2`

This branch predates the V2 safeguard work and can be used if the safeguard layer itself becomes damaged.

## C. GPX update looks wrong

Check in this order:

1. Confirm the uploaded GPX actually contains the expected newest timestamp.
2. Confirm overlap was deduplicated by timestamp.
3. Confirm the new overlay is loaded by both launchers.
4. Confirm the latest/end date is derived from merged GPX timestamps, not the upload date.
5. Confirm the cache/build ID was bumped.
6. Confirm daily and lifetime statistics were recalculated.
7. Confirm validation and Pages deployment succeeded.

Do not force a date simply because the GPX was uploaded on that date.

## D. Browser shows stale data

1. Confirm both launchers use the same current build/cache ID.
2. Confirm live scripts are referenced with that cache version.
3. Confirm Pages deployment completed successfully.
4. Refresh/reopen after deployment.

Do not work around stale caching by hard-coding incorrect data.

## E. Journey/photo issue

- Preserve the original uploaded image where possible.
- Photo-only mode is intentional.
- Do not restore video handling.
- If an image path is broken, verify the asset exists in the repository and the Journey entry references the exact path/case.
- Avoid destructive recompression that introduces grain/noise.

## F. Infographic layout issue

Map panels must remain constrained to their own column. Check CSS grid/flex sizing, `min-width: 0`, width constraints and overflow before changing map data or GPX logic.

## G. Safeguards themselves are broken

If validation/backup workflows are damaged:

1. Compare with the latest stable tag.
2. Compare with `backup/stable-20260827-before-v2` if necessary.
3. Restore safeguard files first.
4. Do not make unrelated dashboard changes until recovery protection is working again.

## Completion standard

A recovery/update is not complete until:

- repository content is correct
- validation succeeds
- backup/stable mechanism succeeds where applicable
- GitHub Pages deployment succeeds
- the live app is expected to load the new cache build
