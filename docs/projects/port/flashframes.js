/*
 * Plays a Flash movie's frames, as exported by _scripts/flashframes.py (window.FRAMES), in place
 * of the plugin: in an element filling the area the movie had, scaled to fit it as the plugin did
 * (SHOWALL), at the movie's own frame rate, looping.
 *
 *   flashFrames(element, { fps, background,
 *       sounds: { frame: url },             event sounds, started on that frame
 *       buttons: { characterId: action } }) action(movie): movie.play(), movie.stop()
 */
window.flashFrames = function (element, options) {
    const { width, height, defs, frames } = window.FRAMES;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.display = 'block';
    if (options.background) svg.style.background = options.background;
    svg.innerHTML = `<defs>${defs}</defs>` + frames.map(f => `<g style="display:none">${f}</g>`).join('');
    element.appendChild(svg);
    const groups = [...svg.children].slice(1);

    const sounds = {};
    for (const [frame, url] of Object.entries(options.sounds || {})) {
        sounds[frame] = new Audio(url);
    }

    const movie = {
        frame: 0,
        playing: true,
        show(n) {
            if (this.frame) groups[this.frame - 1].style.display = 'none';
            this.frame = n;
            groups[n - 1].style.display = '';
            const sound = sounds[n];
            if (sound) {
                /* browsers only play sound once the visitor has clicked or pressed a key */
                sound.currentTime = 0;
                sound.play().catch(() => {});
            }
        },
        play() { this.playing = true; },
        stop() { this.playing = false; },
    };

    /* buttons act on release, as in Flash */
    for (const [char, action] of Object.entries(options.buttons || {})) {
        svg.querySelectorAll(`[data-char="${char}"]`).forEach(el => {
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => action(movie));
        });
    }

    movie.show(1);
    const step = 1000 / options.fps;
    let next = performance.now() + step;
    function tick(now) {
        while (now >= next) {
            if (movie.playing) movie.show(movie.frame % frames.length + 1);
            next += step;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return movie;
};
