# minus20: HTML ports of the plugin pieces - session transcript

Transcript of the minus20 part of a Claude Code session on 13–14 October 2026. Earlier in the same session, Tome, Word Perhect, Adelaide, A House Is Not A Home, Now Here / Nowhere and Pig's Tails were worked on; those parts are in their repositories' `_sessions` folders. Tool calls are shown as one-line notes, grouped where there were many; their output is omitted. Message times weren't recorded, so only the date is given. Claude's longer replies are shortened where they repeat what the summary records.

---

## User - 2026-10-13

Can you take a look in repos/minus20/projects at the dcr and swf files and let me know if any of them can be ported to HTML

## Claude

> *Bash: Survey minus20 projects and list DCR/SWF files*

There are 34 SWFs and 12 DCRs across about 25 artists. I'll profile them properly.

> *Bash: Find duplicates and read DCR headers*

> *Bash: Dump every unique SWF to XML; profile every SWF's features*

> *Bash: Export ActionScript and list the APIs each uses; check external dependencies and Eric Deis's script*

> *Bash: Look at the folders around the scripted and Director pieces; read Eric Deis's pages and artist statement*

Eric Deis's entry is self-contained: its `XMLSocket` sends quietly did nothing, even in 2001.

> *Bash: Find the latest ProjectorRays release*

## User (sent while Claude was working) - 2026-10-13

All the submissions are in this folder - I'm only interested in the files directly in the folder - not the ones in sub-folders.

## Claude

Understood: only the files directly in `projects/`: four SWFs and three DCRs, plus the source `minus20kj.fla`.

> *Bash: List top-level SWF, DCR and FLA files*

> *Bash: Check build tools and read the top-level pages; fetch ProjectorRays source; download the Boost headers; stub the sound module and build ProjectorRays*

> *Bash: Decompile the three Director movies; read the Lingo scripts and cast members; read the Director chunks and extract the H-BOMB text*

All three Director pieces are simple: `_down` makes 182 sprites fall and wrap with random colours; `H-BOMB WORDS` shows the next character of a 7,960-character text each frame; `SLIDERXXX` is a slider whose track moves twice as far as its handle the other way.

> *Bash: Render SWF frames; dump bspace016's button code; combine frames into one contact sheet; export GOODVIBRATIONS's sound*

Yes: all seven files directly in `projects/` can be ported to HTML, and none of them is hard. *(Then a table of the four Flash and three Director pieces, what each is and the effort, a suggested order, and a note that videos could be made of the Flash ones.)*

## User - 2026-10-13

Yes please - videos for the flash files may be useful - I'll take a look. The others should have the html files which embedded them ported to the HTML versions, but with minimal changes to preserve the look and feel of the site. I've switched to a html-port branch so ready for you to start your magic. Please record the transcript and summary in _sessions as usual.

## Claude

I'm reading your message as videos of the Flash files, and the Director files ported into the pages that embedded them. If you meant the Flash pages to be ported too, I can do that afterwards.

> *Bash: Read the six pages that embed the pieces; print each movie's configuration chunk*

> *Write: a Director score reader; Bash: decode _down's first frame, dump the start of each score chunk*

## User (sent while Claude was working) - 2026-10-14

Yes, please port the flash files - IO'll take a look at the videos and decide which I want to keep

## Claude

Understood: I'll port all seven pages, and still make the Flash videos so you can compare.

> *Bash: Decode _down's first frame; print raw D8 sprite records*

> *Bash: Fetch ScummVM Director sources; read the D7 sprite reader, main channels, tempo logic, blend and ink handling, subtract-pin ink and the Mac palette*

From the score: `_down` asks for 303 frames a second (tempo 246, cue point 303). Its sprites have **trails** on, so they paint stripes; the thin ones are blended at 70%, the wide ones at 80%, and a grey bar in subtract-pin ink follows them, darkening what it passes. `H-BOMB WORDS` shows field "b", Charcoal Bold 300 pt, #FFFFCC, at 3 frames a second. The slider's stage colour is #CC9999, its page's colour.

> *Bash: List each movie's cast members; decode the H-BOMB and slider scores; read ScummVM's bitmap header and BITD decoder; read H-BOMB text styles, field data and font map*

> *Bash: Dump the ActionScript of the four Flash pieces; read the rest of bspace016's scripts*

`bspace016` is a generative tiling: every 12 frames each grid sets a random tile and then the 8 around it so their edges join; its buttons recolour, rescale and switch the tiles' set.

> *Write: _scripts/director.py; Bash: extract the Mac palette from ScummVM; run the extraction (fixing the font map offsets and writing data.js as ASCII); check the slider bitmaps*

> *Write: port/down/down.js, port/hbombwords/hbombwords.js, port/slider/slider.js; Bash: swap the plugin in _down.html, hbombwords.html and slider.html*

> *Bash: Test the three Director ports in Chrome*

All three work: `_down` paints its stripes; `H-BOMB WORDS` showed " 1. GETTING " in four seconds; dragging the slider's handle 150 pixels moved the track 300 the other way.

> *Bash: Export Flash frames as SVG and find the sound's frame*

> *Write: _scripts/flashframes.py and port/flashframes.js; Bash: build frames, look at button rendering, share definitions across frames (1.4 MB → 84 KB), export the sound as WAV, swap the plugin in goodvibrations.html and minus20kj.html, test them*

minus20kj steps a frame a second; GOODVIBRATIONS advances 10 frames in 4.35 seconds, stops and plays on its buttons.

> *Bash: Dump bspace016's structure; list its clip and frame scripts; look at FFDec's SVG of its first frame; read the starting colour transforms; export the tile sprite's frames*

> *Write: _scripts/bspace.py; Bash: build and fix the drawing (nested definitions, empty first frame, instance names)*

> *Write: port/bspace016/bspace016.js; Bash: swap the plugin in betweenspace016.html and test it*

The pattern grows (41 tiles after half a second, 138 after 8.5) and each button does what its script says, in its own half only.

> *Bash: Render the Flash frames for the videos; assemble the three frame videos; record bspace016 frame by frame at 18 fps and assemble its video*

> *Write: projects/port/README.md; Bash: keep the original scripts in the port folders; rerun all tests*

> *Write: _sessions/2026-10-13-summary.md and _sessions/2026-10-13-transcript.md*

All seven pieces are ported in their pages, the four Flash videos are in `projects/video/`, and the summary and transcript are in `minus20/_sessions/`.
