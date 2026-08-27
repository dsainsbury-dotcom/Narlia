# Narlia's World V2 backup and restore system

## What is protected

The live site is protected by Git history plus named stable backups.

A pre-V2 safety branch was created before the backup system was installed:

`backup/stable-20260827-before-v2`

That branch points to the known working commit immediately before V2 backup tooling was added.

## Automatic stable backups

`.github/workflows/v2-runtime-guard.yml` runs whenever live runtime files change on `main`.

It checks the launcher and JavaScript syntax. If validation passes it creates an immutable Git tag named like:

`stable-20260827-193015-abc12345`

That tag is a complete snapshot of the repository at that validated commit. Tags do not alter the live website and do not trigger another Pages deployment.

`.github/workflows/create-stable-backup.yml` can also create a backup manually and also listens for the existing `Validate infographic release` workflow.

## Restore without force-pushing main

`.github/workflows/restore-stable-backup.yml` restores the live runtime from a selected `stable-*` tag by making a normal new commit on `main`.

It deliberately leaves the V2 backup/restore infrastructure in place while restoring the site runtime, so recovery tooling is not lost during a rollback.

To restore in GitHub:

1. Open Actions.
2. Select `Restore stable backup`.
3. Click `Run workflow`.
4. Enter the exact `stable-*` tag.
5. Type `RESTORE` in the confirmation box.
6. Run the workflow.
7. Wait for GitHub Pages deployment to finish, then check the live site.

## What gets restored

The runtime restore includes the launchers, dashboard source/payload files, data files, GPX overlays, infographic scripts, Journey/photo data and profile logo. If present, `assets`, `media` and `images` directories are restored too.

It does not roll back GitHub workflow files, documentation or the restore tooling itself.

## Normal GPX/photo update procedure

1. A stable backup from the last validated build already exists.
2. Apply the new GPX/photo/note update.
3. Validate the runtime.
4. GitHub Pages deploys the changed site.
5. The V2 runtime guard creates a new `stable-*` snapshot for the validated build.

If the new site is wrong, restore the previous `stable-*` tag instead of trying to repair the live version blindly.

## Date rule

All displayed latest/end dates must come from the latest timestamp actually present in the merged GPX data. Upload date, publish date and today's date must never be substituted for the latest GPX timestamp.
