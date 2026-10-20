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
