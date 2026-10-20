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

---

# minus20: slider fix, a slimmer site and going public - session transcript

Transcript of the minus20 part of a Claude Code session on 20 October 2026. Earlier in the same session, identifier-service-docs, identifier-service and eprints-atmire-export were worked on; they aren't part of minus20. As above, tool calls are one-line notes, their output is omitted, only the date is given, and Claude's longer replies are shortened where they repeat the summary. The entrants' contact details found in the old repository's history are not reproduced.

---

## User - 2026-10-20

I've been testing repos/minus20 and the port of slider.html has the scrollbar as in the original, but in the original the handle could only mover within the bar - in the port it can move outside the bar and over the plus and minus symbols - can you fix it?

## Claude

> *Bash: Read slider.js, the original Lingo and data.js; look at the track and handle bitmaps*

The port uses the movie's limits exactly: `integer(W / 3.886)` and `integer(W / 1.345)`. Those only fit the seven screen widths the bitmaps were drawn for (640–1152). Any other window width uses the nearest bitmap while the limits keep scaling with the window, so on a 1400-pixel window the handle runs 180 pixels onto the − and +.

> *Bash: Measure the bar's end borders in each track bitmap; check limits worked out from them against the Lingo's at the seven widths*

Limits from the bitmaps match the Lingo's at all seven widths, to within a pixel.

> *Edit: slider.js (a table of the bar's inside edges per bitmap, and limits() worked out from them)*

> *Bash: Drag the handle past both ends at ten window widths, with the new and the old slider.js*

The handle now stops at the bar's ends at every width. Before, it overran by up to 561 pixels on wide windows and stopped up to 240 short on narrow ones.

## User - 2026-10-20

Would converting the images to SVG make it work the same on any screen size?

## Claude

Not on its own: what breaks at other sizes is the limits, not the image format. The choice is between seven fixed sizes (the original, which the fix keeps working at any width) and scaling with the window. Scaling could be done by stretching the PNGs, at the cost of an uneven stipple; SVG would mean redrawing the artwork. Recommended keeping the seven bitmaps.

## User - 2026-10-20

OK - I didn't realise the artist made it this way - keep the bitmaps

## Claude

> *Write: a memory to keep original artwork in e-2-org ports*

## User - 2026-10-20

Can you change the build directory (docs) sp it conly contains the files referenced on the site? It looks like it contains all the submissions for the minus20K commission which are in the root of the main branch

## Claude

> *Bash: Survey docs/; write a crawler that follows every reference from index.html, in pages, scripts, stylesheets and strings inside the Flash and Director files*

Only 89 of 1,031 files are reachable.

> *Bash: Group unreached files by folder; check for absolute links to minus20.e-2.org; compare unreached files with the originals at the root*

909 unreached files are identical copies of originals at the root. 31 exist only in `docs/`: the decompiled scripts, the ports README and the videos.

> *Bash: Remove the 909 copies from docs/; move the 31 port-only files to _port/*

> *Bash: Load all 31 pages in Chrome, served at /minus20/, and record failed requests*

No failed requests and no script errors.

> *Bash: Update README.md, _port/README.md and the example commands in _scripts/; check where the home page's refresh goes*

`docs/` is down to 91 files (952 KB). The home page's refresh still sends visitors to the old server at minus20.e-2.org.

## User - 2026-10-20

Can you get rid of the ga.js script in /docs and tidy up the html a bit - they can keep quirks mode and the table layout, justremove anything no longer supported and make tags lowercase. Yes, make it all so it works in pages - I'd like to make this one live/public now I've checked through it.

## Claude

> *Bash: Commit the slider fix and the docs/ clean-up separately*

> *Bash: Record each page's rendering mode and take screenshots; read the pages; find obsolete elements, attributes and plugin notices; check external links; find Wayback Machine captures*

Found, besides the analytics: a Gostats hit counter in `timeascolor.html`, IE-only scrollbar styles, `<meta contents=…>` (no such attribute), plugin "Viewing requirements" notices, and three dead or hijacked links. `timeascolor` sets colours without a `#`, which only works in quirks mode, so doctypes stay as they are.

> *Write: a tidy script (removals, link fixes, and lowercasing tag and attribute names outside scripts, styles and attribute values); Bash: run it and review the diff*

> *Bash: Compare rendering modes and screenshots before and after; reload every page; test the home page's refresh*

Modes are unchanged; pages are pixel-identical apart from the removed notices and `timeascolor`'s time-based colour, which still works. The home page now refreshes to `artists_projects.html` on the same site.

> *Bash: Commit the tidy; check what making the repository public would expose*

The history includes the entrants' submission emails with their contact details, so Claude stopped before making it public, and asked how to go ahead.

## User - 2026-10-20 (answer to Claude's question)

Can you copy the docs folder along with the original nine projects ONLY and other original files which were used on the website into the root of minus20_new. I'll archive the current minus20 repository and delete the remote, then replace it with the new folder

## Claude

> *Bash: Crawl the original site at the root for the files it used; scan everything to be copied for email and postal addresses*

The original site used 66 files, including the six `.swf`/`.dcr` files its pages embedded. `minus20kj.swf` and `minus20kj.fla` weren't used by any page, so they're left out.

> *Bash: Copy docs/, README.md, _scripts/, _port/, _sessions/ and the 66 originals into minus20_new; update the READMEs; scan all 195 files, including binaries, for personal data*

No email or postal addresses. The new folder has no git history yet.

## User - 2026-10-20

That works great!

## User - 2026-10-20

I've already done this - it's live!

## Claude

> *Bash: Check the live pages respond*

The pages load at https://e-2-org.github.io/minus20/, with the slider fix.

## User - 2026-10-20

Whi9ch is awesome by the way

## User - 2026-10-20

One small change - can you rename the artists_projects_<name>.html files to <name>.html and put them in an "artists" folder, and update all the links

## Claude

> *Bash: Find the new repository's checkout; create the artists-folder branch*

> *Write: a script that rewrites every value resolving to a file in docs/ for its page's new location, then moves the pages with git mv; Bash: run it and review the diff*

> *Edit: popup.js (preload the rollover image relative to itself, so it works from artists/)*

> *Bash: Recrawl the site; load every page; compare screenshots of the moved pages with before*

Every page loads cleanly, and the moved pages are pixel-identical to before. Committed on `artists-folder`. The old URLs will return 404 once published.

## User - 2026-10-20

That's much tidier - yes please - update the _sessions files before you push though

## Claude

> *Write: this session's summary and transcript in _sessions/*
