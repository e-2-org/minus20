# minus20: HTML ports of the plugin pieces, session summary

13–14 October 2026, working with Claude Code on the `html-port` branch. The same session also worked on Tome, Word Perhect, Adelaide, A House Is Not A Home, Now Here / Nowhere and Pig's Tails (see those repositories). The minus20 part of the conversation is in [transcript.md](transcript.md).

## Aim

Pete asked which of the Flash (`.swf`) and Shockwave (`.dcr`) files directly in `projects/` could be ported to HTML (not those in the artists' sub-folders). The answer was all seven. He then asked for:

- videos of the Flash files, for him to judge
- ports of all seven into the pages that embedded them, with minimal changes, to keep the site's look and feel

## The pieces

| File | Page | What it is |
| --- | --- | --- |
| `_down.dcr` (Director 8) | `_down.html` | 300×700, black, tempo 303 (as fast as it would go). 182 sprites of one filled-rectangle shape, all with **trails**: 30 columns 10 wide (80% blend) and 151 thin ones (70% blend, random widths 2–5) fall 2 pixels a frame from the top together, each changing colour at a random height (from the Mac system palette), followed by a 313×2 grey bar in **subtract pin** ink that darkens what it passes. So it paints a slowly layering field of stripes. |
| `H-BOMB WORDS.dcr` (Director 8) | `hbombwords.html` ("7960 characters arranged in a dangerous order") | 720×480, black, 3 frames a second, stretched to the window. Field "a" holds 7,960 characters of instructions for making an atomic bomb ("1. GETTING THE INGREDIENTS…"); each frame, the next one is put into field "b": one character at a time, in Charcoal Bold 300 pt, #FFFFCC. About 44 minutes per loop. |
| `SLIDERXXX.DCR` (Director 6) | `slider.html` | A mock scroll bar on #CC9999: track and handle bitmaps at seven sizes, chosen from the screen width; dragging the handle moves the track twice as far the other way, revealing its − and + ends. |
| `GOODVIBRATIONS.swf` (Flash 3) | `goodvibrations.html` | 25 full-frame colour swatches with their hex codes and a running timecode, at 2.296875 frames a second, with a 9-second sound from frame 1; stop ("o") and play ("▷") buttons. |
| `minus_20kJ_version2.swf` (Flash 4) | `minus20kj.html` | 69 frames at 1 a second: a food photo and its energy ("cherry tomato 5 kJ") with "powers this computer for N seconds" counting down: tomato, peanut, celery. `minus20kj.swf` is the same at 12 frames a second (no page uses it). |
| `bspace016.swf` (Flash 5, also in `Paul Allitt/`) | `betweenspace016.html` | Two halves, each a white ground, a red band and three groups of tiles. Each group is a 6×10 grid of 72-pixel tiles (shown at 75%) with 32 frames of soft quarter circles, their edges coded 1–4. Every 12 frames (18 a second) a grid sets a random tile and then the 8 around it so the edges join: black "clouds" grow by themselves. Six invisible buttons per half recolour the band, ground and tiles (in turn or at random), scale the tile groups and switch the tile sets ("t"/"n"). |

Duplicates: `minus_20kJ_version2.swf` is the same file as Ellie Harrison's `minus 20kJ version2.swf`, and `bspace016.swf` as Paul Allitt's.

## How they were read

- **Flash:** JPEXS FFDec 26.3.0 (downloaded to a scratch folder): XML dumps, ActionScript, frames and sprites as SVG and PNG, sound as WAV.
- **Director:** ProjectorRays 0.2.0, built from source in a scratch folder (Boost headers downloaded; its MP3 sound decoding, which needs mpg123, stubbed out), unprotected the Afterburner `.dcr` files and decompiled the Lingo. Its .dir output was then read by a new script, `_scripts/director.py`:
  - the memory map, `KEY*`, `CAS*` and `CASt`
  - the score (`VWSC`): D6+ frames are deltas; six main channels; sprite records as in ScummVM's `readSpriteDataD7`, with blend % = (255 − byte) × 100 / 255 and the ink byte's 0x40 meaning trails
  - the tempo: 246 means "cue point frames a second"
  - `STXT` text and style runs, `Fmap` font names, `CLUT` palettes and `BITD` bitmaps (PackBits rows)
  - the layouts and ink rules were checked against ScummVM's Director engine source

## What was built (all uncommitted on `html-port`)

- **Pages:** each page keeps its markup, title and colours; only its `<object>`/`<embed>` is replaced, and the dead Google Analytics snippet is removed.
- **`projects/port/down/`:** `data.js` and `down.js`, a canvas painted pixel by pixel (copy ink at the sprite's blend; subtract pin), at 303 frames a second, with the Lingo ported line for line. The 300×700 stage is centred in the window, as the unstretched Shockwave movie was.
- **`projects/port/hbombwords/`:** the stage as a 720×480 element scaled non-uniformly to fill the window (`swStretchStyle=fill`). Charcoal falls back to "Arial Black" and other heavy sans serifs where it isn't installed.
- **`projects/port/slider/`:** the 14 bitmaps as PNG, decoded through the movie's Netscape palette; the drag ported from `sliderScript`. The window's size stands in for the screen's (`deskTopRectList`), and is re-read on resize.
- **`projects/port/goodvibrations/` and `minus20kj/`:** `frames.js` from `_scripts/flashframes.py`, played by `projects/port/flashframes.js`:
  - each FFDec frame SVG's definitions are shared, by content, and each bitmap is written once (minus20kj: 1.4 MB → 84 KB)
  - the player shows frames at the movie's rate, plays event sounds and wires buttons by character id
- **`projects/port/bspace016/`:** `stage.js` from `_scripts/bspace.py` and `bspace016.js`:
  - the builder inlines FFDec's first-frame SVG, so each clip copy can change, and points the 360 tiles at the tile clip's 32 frames
  - the script ports the `enterFrame` tiling and all six buttons per half; colour transforms are SVG `feColorMatrix` filters
- **Original scripts:** each port folder keeps the decompiled Lingo (`lingo/`) or ActionScript (`actionscript/`).
- **`projects/port/README.md`:** the ports and how to rebuild them.
- **`projects/video/`** (all 1920×1080, 60 fps, each frame held for its original time):
  - `goodvibrations.mp4` (10.9 s, with sound), `minus20kj.mp4` (69 s) and `minus20kj-12fps.mp4` (5.75 s): FFDec frames
  - `betweenspace016.mp4` (45 s): the port, untouched, recorded a frame at a time at 18 fps under Playwright's clock, since FFDec doesn't run its scripts
- **`_scripts/`:** `director.py`, `macpalette.json` (from ScummVM), `flashframes.py`, `bspace.py`.

## Checks

These were run in Chrome (Playwright):

- **`_down`:** the stripes paint, change colour part-way and darken under the bar.
- **`H-BOMB WORDS`:** " 1. GETTING " appeared over 4 s, at 3 characters a second, filling the window.
- **`slider`:** a 150-pixel drag moved the handle 150 and the track −300.
- **`minus20kj`:** 5 frames in 5 s.
- **`GOODVIBRATIONS`:** 10 frames in 4.35 s; stop held the frame and play resumed.
- **`bspace016`:**
  - 41 tiles set after 0.5 s and 138 after 8.5 s (of 360)
  - buttons 17–22 changed the tile colours, the band (to #FFCC00), random tints, scales (e.g. 1.28, 0.99, 0.77) and the tile set (180 tiles to "n")
  - only the half clicked changed
- **Errors:** none on any page, apart from Chrome's favicon request on the test server.
- **Videos:** durations exactly match frames ÷ rate.

## Not certain, or not done

- **`_down`'s speed:** 303 frames a second was the movie's request; real Shockwave on a 2001 computer probably managed less, so the original may have fallen more slowly.
- **Off-range frames:** `bspace016`'s "t"/"n" button moves tiles by ±16 frames. Where that falls outside 1–32 the port clamps it, which empties a tile at frame 1; whether Flash did the same isn't certain.
- **Charcoal:** not a web font, so the fallback is a similar heavy sans serif.
- **Sound:** browsers only play sound after a click or key press, so `GOODVIBRATIONS` may be silent until the visitor clicks.
- **Kept:** the `.swf`/`.dcr` files.

---

# minus20: slider fix, a slimmer site and going public, session summary

20 October 2026, working with Claude Code. The same session also worked on repositories that aren't part of minus20 (identifier-service-docs, identifier-service and eprints-atmire-export). The minus20 part of the conversation is in [transcript.md](transcript.md).

## What was done

1. **Slider handle limits.** In the port of `SLIDERXXX.DCR`, the handle could be dragged over the − and + ends of the bar. The movie limited the handle with `integer(W / 3.886)` and `integer(W / 1.345)`, which only fit the seven screen widths (640–1152) its bitmaps were drawn for; a browser window is usually some other width.
   - `slider.js` now works the limits out from the bar's inside edges in each track bitmap (measured from the PNGs). Because the track moves twice as far as the handle the other way, the handle meets a bar end a third of the way to it.
   - At the seven widths these give the movie's limits, to within a pixel.
   - Pete asked whether SVG would help. It wouldn't change the limits problem, and the artist drew seven bitmap sizes by hand, so the bitmaps are kept.
2. **`docs/` only holds what the site uses.** It had been a copy of the whole original site, including the open submissions (`xstuff/`, `submissions/` and the artists' folders in `projects/`).
   - A crawler followed every reference from `index.html` (attributes, scripts, stylesheets, and strings inside the Flash and Director files).
   - 909 unreferenced files, all identical to the originals at the root, were removed: 1,031 files (16 MB) became 91 (952 KB).
   - The decompiled Lingo and ActionScript, the ports' README and the Flash videos, which were only in `docs/`, moved to `_port/`.
3. **HTML tidy.**
   - Removed the Google Analytics snippets, `timeascolor`'s Gostats hit counter (blocked on HTTPS anyway), the IE-only scrollbar colours, and the "Viewing requirements" notices for Shockwave, Flash and old browsers.
   - Corrected `<meta contents=…>` to `content`.
   - The home page's refresh now goes to `artists_projects.html` on this site, not to the old server at minus20.e-2.org.
   - Dead or hijacked links (Arts Council London, Illuminations, unfolded.ch) go through the Wayback Machine.
   - Tag and attribute names are lowercase. Doctypes are unchanged, so every page keeps its rendering mode: `timeascolor` needs quirks mode, because it sets colours without a `#`.
4. **A new repository without personal data.** Making the old repository public would have published its whole history, which includes the entrants' submission emails with their contact details. Instead, Claude built `minus20_new` from scratch:
   - `docs/`, `README.md`, `_scripts/`, `_port/` and `_sessions/`
   - the 66 original files the original site used (its pages, images and the nine artworks, with the six `.swf`/`.dcr` files its pages embedded), found by crawling the original site
   - not the open submissions, the unlinked pages, `minus20kj.swf` or `minus20kj.fla`
   - a scan of all 195 files, including inside the binaries, found no email or postal addresses

   Pete archived the old repository, replaced it with this one, and published it: https://e-2-org.github.io/minus20/
5. **Artist pages moved.** `artists_projects_<name>.html` became `artists/<name>.html` (on the `artists-folder` branch). Every reference in the pages was rewritten for the new locations, and `popup.js` now preloads its rollover image relative to itself, so it works from `artists/`.

## Checks

All in headless Chrome, with the site served at `/minus20/` as on GitHub Pages:

- **Slider:** dragging the handle past both ends at ten window widths (390–1920). Before, it overran the bar by up to 561 px or stopped up to 240 px short; after, it stops at the bar's ends everywhere. At 800 and 1024 it overlaps the end border by 1–2 px, as the original's limits do.
- **Every page** loaded (the random pages several times, with all rollovers triggered): no failed requests and no script errors, after each change.
- **Screenshots before and after the tidy:** pages are pixel-identical, except the seven where a notice was removed (only that line changed) and `timeascolor`, whose colour is the time. Rendering modes are unchanged.
- **After the move to `artists/`:** the moved pages, `artists_projects.html`, `about.html` and `index.html` are pixel-identical to before, and the crawl still reaches every file but `.nojekyll` and `favicon.ico`.

## Not certain, or not done

- **Old URLs:** `artists_projects_<name>.html` now return 404. GitHub Pages can't redirect; small redirect pages could be added at the old names.
- **favicon.ico:** kept in `docs/` though no page links to it.
- **The old repository's history** (with the submissions) is archived, not public.
