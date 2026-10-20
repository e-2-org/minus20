/*
 * 7960 characters arranged in a dangerous order, ported from H-BOMB WORDS.dcr (Director 8)
 *
 * The movie is one frame, 720 x 480, black, at 3 frames a second. Field "a", never on stage,
 * holds the 7960 characters; each frame, the next one is put into field "b" (Charcoal Bold,
 * 300 points, #FFFFCC), so it shows one at a time, over and over. The page stretched the
 * stage to fill the window (swStretchStyle=fill). The Lingo (BehaviorScript 3) is ported in
 * exitFrame(); the text and the fields are in data.js, extracted by _scripts/director.py.
 */
(function () {
    const movie = window.MOVIE;
    const W = movie.config.width;
    const H = movie.config.height;
    const FPS = movie.tempo[0][0] === 246 ? movie.tempo[0][1] : 15;
    const a = movie.members[2].text;
    const b = movie.members[1];
    const sprite = movie.sprites[0];
    const run = b.runs[0];

    const stage = document.getElementById('hbombwords');
    stage.style.width = W + 'px';
    stage.style.height = H + 'px';
    const field = document.createElement('div');
    Object.assign(field.style, {
        position: 'absolute',
        left: sprite.x + 'px',
        top: sprite.y + 'px',
        width: sprite.width + 'px',
        textAlign: ['left', 'center', 'right'][b.field.align] || 'left',
        whiteSpace: 'pre',
        /* Charcoal was the Mac OS 8 and 9 system font; heavy sans serifs stand in for it elsewhere */
        font: `${run.bold ? 'bold' : 'normal'} ${run.size}px Charcoal, "Arial Black", "Helvetica Neue", Arial, sans-serif`,
        lineHeight: 'normal',
        color: `rgb(${run.colour.join(',')})`,
    });
    stage.appendChild(field);

    /* fill the window, stretching the stage, as swStretchStyle=fill did */
    function fit() {
        stage.style.transform = `scale(${innerWidth / W}, ${innerHeight / H})`;
    }
    addEventListener('resize', fit);
    fit();

    /* on beginSprite */
    let gcount = 0;
    field.textContent = b.text;

    /* on exitFrame: go(the frame) keeps it on this frame */
    function exitFrame() {
        gcount++;
        if (gcount <= a.length) {
            field.textContent = a[gcount - 1];
        } else {
            gcount = 0;
        }
    }
    setInterval(exitFrame, 1000 / FPS);
})();
