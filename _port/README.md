# HTML ports of the plugin pieces

The seven Flash and Shockwave (Director) pieces in `projects/` are ported to run without plugins. The ports are in `docs/projects/port/`, which is published; this folder has the original scripts they were ported from and videos of the Flash pieces, which aren't. Each page in `docs/projects/` that embedded one (`_down.html`, `hbombwords.html`, `slider.html`, `goodvibrations.html`, `minus20kj.html`, `betweenspace016.html`) is unchanged apart from its `<object>`, which now loads the port, and the removal of the old Google Analytics snippet. The original `.swf` and `.dcr` files are kept.

| Page | Original | Port (in `docs/projects/port/`) |
| --- | --- | --- |
| `_down.html` | `_down.dcr` (Director 8) | `down/`: a canvas. 182 sprites with trails fall 2 pixels a frame, painting stripes at 80% and 70% blend, followed by a grey bar in subtract-pin ink, at the movie's tempo (303 frames a second). |
| `hbombwords.html` | `H-BOMB WORDS.dcr` (Director 8) | `hbombwords/`: the 7960 characters of field "a", one at a time, 3 a second, in field "b" (Charcoal Bold, 300 points, #FFFFCC on black), the stage stretched to the window. |
| `slider.html` | `SLIDERXXX.DCR` (Director 6) | `slider/`: the track and handle bitmaps (seven sizes, chosen by the width of the window), and the drag: the track moves twice as far the other way. |
| `goodvibrations.html` | `GOODVIBRATIONS.swf` (Flash 3) | `goodvibrations/`: the 25 frames at 2.296875 a second, the sound from frame 1, and the play and stop buttons. |
| `minus20kj.html` | `minus_20kJ_version2.swf` (Flash 4) | `minus20kj/`: the 69 frames at 1 a second. |
| `betweenspace016.html` | `bspace016.swf` (Flash 5) | `bspace016/`: the drawing, and the ActionScript ported: the tiles' growing pattern and the six buttons in each half. |

`flashframes.js` plays the frame-based Flash pieces.

## How they are made

The Lingo and ActionScript are ported by hand, in each port's script. The decompiled originals are here, in `slider/lingo/`, `down/lingo/`, `hbombwords/lingo/` and `bspace016/actionscript/`. The drawings, text, bitmaps, palettes and sprites come from the original files, by the scripts in `_scripts/`:

- **Director:** ProjectorRays (https://github.com/ProjectorRays/ProjectorRays) unprotects each `.dcr` and decompiles its Lingo. Then `_scripts/director.py` writes the port's `data.js` (stage, tempo, sprites, cast members, text, palettes) and its bitmaps as PNG. `_scripts/macpalette.json` is the Mac system palette, from ScummVM.

  ```sh
  projectorrays decompile "H-BOMB WORDS.dcr" -o out --dump-scripts
  python3 _scripts/director.py "out/H-BOMB WORDS.dir" docs/projects/port/hbombwords
  ```

- **Frame-based Flash:** JPEXS FFDec (https://github.com/jindrapetrik/jpexs-decompiler) exports the frames as SVG, and `_scripts/flashframes.py` gathers them into `frames.js`, writing each bitmap once.

  ```sh
  java -jar ffdec-cli.jar -format frame:svg -export frame frames/ GOODVIBRATIONS.swf
  python3 _scripts/flashframes.py frames/ docs/projects/port/goodvibrations port/goodvibrations
  java -jar ffdec-cli.jar -format sound:wav -export sound sound/ GOODVIBRATIONS.swf
  ```

- **betweenspace016:** FFDec exports the first frame and the tile clip's 32 frames, and `_scripts/bspace.py` builds `stage.js`.

  ```sh
  java -jar ffdec-cli.jar -select 1 -format frame:svg -export frame frame/ bspace016.swf
  java -jar ffdec-cli.jar -selectid 14 -format sprite:svg -export sprite tiles/ bspace016.swf
  python3 _scripts/bspace.py frame/1.svg tiles/DefineSprite_14 docs/projects/port/bspace016
  ```

## Videos

`video/` has a recording of each Flash piece, 1920 × 1080 at 60 frames a second, each frame held for its original time:

- `goodvibrations.mp4`, `minus20kj.mp4` and `minus20kj-12fps.mp4` (the other version, `minus20kj.swf`, which no page used and isn't in this repository): every frame rendered from the movie by FFDec, joined by ffmpeg.
- `betweenspace016.mp4`: its pattern is drawn by its scripts, which FFDec doesn't run, so these are 45 seconds of the port, untouched, recorded a frame at a time at 18 frames a second.
