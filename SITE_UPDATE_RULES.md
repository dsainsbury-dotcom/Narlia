# Cat Dashboard update rules

Any new cat-related input triggers a site update and publish. This includes GPX files, photos, written notes, milestones, birthdays/events, identity confirmations, corrections and other story information.

- GPX: treat every new upload as an overlapping export. Deduplicate by exact timestamp before any GPS cleaning, smoothing, distance, territory, speed, heatmap, hotspot, daily, lifetime, or infographic calculation. Existing timestamps must never be counted twice; only genuinely new timestamps are added to the lifetime history. After deduplication, apply the agreed GPS-noise filtering, rebuild Narlia's current GPS analytics/infographic/tabs, and publish.
- Photos: process for web use, add to Journey by real date/age, preserve uncertain identity until confirmed, and publish.
- Notes/text: add or update the relevant Journey story or metadata and publish.
- Video uploads are not used in the site. Journey is photo-and-story only.
- Identification: Narlia is tabby; Amara is lilac; Dante develops warmer brown/chocolate colouring. Make a first-pass guess on new kitten photos, but do not permanently assign an uncertain image without confirmation.
- Journey can include the cats and their cat daddies Darren and Jason.
- A media failure must never take down the GPS dashboard.
- Every cat-related entry triggers a rebuild/update/publish of the site, even when the entry is only a note or correction.
- Never say updated/published/done until the GitHub write is successful and the resulting repository/public site has been checked.

- Kitten weights: keep each cat's measurements separate; never invent a weighing date or calculate a trend from a single undated value. Record the date when supplied, preserve past readings and update the relevant profile page.
- Dante and Amara profiles: birth date 23 July 2026, joined 29 October 2026. Update `cat-profiles-data.js` when confirmed details change.

- The kitten profile portraits are provisionally assigned from coat colour/collar: grey/lilac/pink-collar image to Amara, warmer brown/blue-collar image to Dante. Seek confirmation if any ambiguity arises.
- Kitten Watch: do not claim a live camera or insert a fabricated YouTube URL. When supplied, configure `kittenWatch.youtubeUrl` in `cat-profiles-data.js`; use an actual YouTube video/live ID and confirm embedding works.
- Keep the Narlia GPS dashboard scripts, infographic modes, map controls, and daily/records/trends data bindings intact during kitten-only changes. Do not reinitialise or reset GPS data.

- Photo albums: source is Auto Photos album `Dante and Amara` (`wE4DN-4klDuEIpI6RXJWC`). Place photos of a single confirmed kitten in that kitten's gallery; place shared photos in both galleries. Ask for identification if unclear, particularly for red/orange collars in older litter photos. Do not publish pictures of other kittens as Dante/Amara.
- Update weightDate and weights[] with the measurement date, never the screenshot upload date. Baseline: both measured 2026-10-27 at their second jabs.
- New Auto Photos uploads do not automatically appear on GitHub Pages; only promise regular checks/updates when a real scheduled workflow has been configured.

- User-confirmed identity key: Dante red collar in breeder-era photos, blue collar after adoption; Amara orange collar before adoption, pink collar after adoption. Do not infer that all cats in group photos are one of the two kittens.

- For future Auto album updates, deduplicate using each gallery item's `autoId`. Fetch photo bytes and publish stable assets in `media/` rather than embedding expiring Auto Photos signed URLs. Put shared confirmed Dante+Amara pictures in both galleries, and update the photo counts.
