/*
 * _down, ported from _down.dcr (Director 8) to a canvas
 *
 * The movie is one frame, 300 x 700, black, at a tempo of 303 frames a second: as fast as it
 * would go. 182 sprites of one shape (a filled rectangle) with trails on, so they are never
 * erased: 30 columns 10 wide (80% blend) and 151 thin ones (70% blend) fall 2 pixels a frame,
 * painting stripes, and a grey bar (ink subtract pin) falls with them, darkening what it
 * passes. The Lingo (BehaviorScript 2, MovieScript 3) is ported line for line in exitFrame().
 * The sprites and colours are in data.js, extracted by _scripts/director.py.
 */
(function () {
    const movie = window.MOVIE;
    const W = movie.config.width;
    const H = movie.config.height;
    const FPS = movie.tempo[0][0] === 246 ? movie.tempo[0][1] : 60;
    const palette = movie.macPalette;

    const canvas = document.getElementById('down');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(W, H);
    const px = image.data;
    /* the stage is black */
    for (let i = 3; i < px.length; i += 4) px[i] = 255;

    const random = n => 1 + Math.floor(Math.random() * n);
    const sprites = movie.sprites.map(s => ({
        locV: s.y,
        locH: s.x,
        width: s.width,
        height: s.height,
        ink: s.ink,
        blend: s.blend / 100,
        colour: s.foreRGB || palette[s.fore],
    }));
    const sprite = n => sprites[n - 1];
    const setFore = (s, index) => { s.colour = palette[index % 256]; };

    /* MovieScript 3: on startMovie */
    let neu = 2 * random(350);
    let neu2 = 4 * random(160);

    /* draw each sprite where it is now, over what is there (trails) */
    function draw() {
        for (const s of sprites) {
            const x0 = Math.max(0, s.locH), x1 = Math.min(W, s.locH + s.width);
            const y0 = Math.max(0, s.locV), y1 = Math.min(H, s.locV + s.height);
            const [r, g, b] = s.colour;
            for (let y = y0; y < y1; y++) {
                for (let x = x0; x < x1; x++) {
                    const i = (y * W + x) * 4;
                    if (s.ink === 35) {
                        /* subtract pin: take the colour away, stopping at 0 */
                        px[i] = Math.max(px[i] - r, 0);
                        px[i + 1] = Math.max(px[i + 1] - g, 0);
                        px[i + 2] = Math.max(px[i + 2] - b, 0);
                    } else {
                        /* copy, at the sprite's blend */
                        const a = s.blend;
                        px[i] = r * a + px[i] * (1 - a);
                        px[i + 1] = g * a + px[i + 1] * (1 - a);
                        px[i + 2] = b * a + px[i + 2] * (1 - a);
                    }
                }
            }
        }
    }

    /* BehaviorScript 2: on exitFrame */
    function exitFrame() {
        for (let n = 31; n <= 181; n++) {
            const s = sprite(n);
            if (s.locV > 700) {
                s.locV = -6;
                setFore(s, random(256));
                s.width = random(4) + 1;
                neu = 2 * random(350);
            } else {
                s.locV += 2;
            }
            if (s.locV === neu) setFore(s, random(256));
        }
        for (let n = 1; n <= 30; n++) {
            const s = sprite(n);
            if (s.locV > 700) {
                s.locV = -6;
                setFore(s, random(256));
                neu2 = 4 * random(160);
            } else {
                s.locV += 2;
            }
            if (s.locV === neu2) setFore(s, random(256));
        }
        const bar = sprite(182);
        if (bar.locV > 700) bar.locV = -20;
        else bar.locV += 2;
    }

    /* as many frames as the tempo asks for, however often the browser draws */
    let last = performance.now();
    let owed = 0;
    function tick(now) {
        owed = Math.min(owed + (now - last) * FPS / 1000, 30);
        last = now;
        while (owed >= 1) {
            draw();
            exitFrame();
            owed--;
        }
        ctx.putImageData(image, 0, 0);
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();
