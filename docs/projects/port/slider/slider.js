/*
 * slider, ported from SLIDERXXX.DCR (Director 6)
 *
 * A mock scroll bar: a track (sprite 1) and a handle (sprite 2), each drawn at seven sizes for
 * screen widths from 640 to 1152, chosen from the width of the screen and centred on it.
 * Dragging the handle moves the track twice as far the other way. The Lingo (MovieScript 1:
 * prepareMovie and sliderScript) is ported below; the bitmaps are PNGs and their sizes are in
 * data.js, both extracted by _scripts/director.py. The movie used the screen's size (the
 * deskTopRectList); here it is the window's, which the page fills.
 */
(function () {
    const movie = window.MOVIE;
    const base = document.currentScript.src.replace(/[^/]*$/, '');
    const stage = document.getElementById('slider');
    const member = name => Object.values(movie.members).find(m => m.name === name);
    const byNumber = n => movie.members[n];

    function sprite(n) {
        const img = document.createElement('img');
        img.alt = '';
        img.draggable = false;
        Object.assign(img.style, { position: 'absolute', userSelect: 'none' });
        stage.appendChild(img);
        return {
            img, locH: 0, locV: 0, member: null,
            set(m) {
                this.member = m;
                img.src = base + m.file;
                img.width = m.width;
                img.height = m.height;
                this.place();
            },
            /* the location is the member's registration point */
            place() {
                img.style.left = (this.locH - this.member.regX) + 'px';
                img.style.top = (this.locV - this.member.regY) + 'px';
            },
        };
    }
    const track = sprite(1);
    const handle = sprite(2);

    /* the inside edges of the bar's end borders in each track bitmap, between the - and + */
    const BAR = {
        track1000: [98, 1095], track1125: [98, 1212], track1250: [107, 1354], track1300: [108, 1403],
        track1400: [111, 1498], track1600: [160, 1750], track1800: [163, 1946],
    };

    /*
     * How far the handle can go. The movie used integer(W / 3.886) and integer(W / 1.345), which
     * keep the handle on the bar only at the seven screen widths the bitmaps were drawn for. A
     * window can be any width, so the limits come from the bitmaps instead: the track moves twice
     * as far as the handle, the other way, so the handle meets a bar end a third of the way to
     * it. At the seven widths these give the movie's limits, to within a pixel.
     */
    function limits() {
        const [left, right] = BAR[track.member.name];
        const trackLeft = 3 * M - track.member.regX;
        const h = handle.member;
        return [
            Math.floor((trackLeft + left + h.regX) / 3),
            Math.floor((trackLeft + right - (h.width - h.regX)) / 3),
        ];
    }

    let W, D, M;

    /* on prepareMovie */
    function prepareMovie() {
        W = stage.clientWidth;
        D = stage.clientHeight;
        M = W / 2;
        if ([640, 720, 800, 832, 896, 1024, 1152].includes(W)) {
            track.set(member('track' + Math.round(1.5625 * W)));
            handle.set(member('slider' + Math.round(1.5625 * W)));
        } else {
            if (W <= 720) { track.set(byNumber(5)); handle.set(byNumber(12)); }
            if (W > 720 && W <= 896) { track.set(byNumber(8)); handle.set(byNumber(15)); }
            if (W > 896) { track.set(byNumber(10)); handle.set(byNumber(17)); }
        }
        track.locH = handle.locH = Math.trunc(W / 2);
        track.locV = handle.locV = Math.trunc(D / 2);
        track.place();
        handle.place();
    }

    /* on mouseDown (the handle's cast scripts) -> sliderScript */
    handle.img.addEventListener('pointerdown', e => {
        e.preventDefault();
        const rect = stage.getBoundingClientRect();
        const mouse = ev => [ev.clientX - rect.left, ev.clientY - rect.top];
        const x = mouse(e)[0] - (handle.locH - handle.member.regX);
        const wM = handle.member.width;
        const hM = handle.member.height;
        const [min, max] = limits();
        const move = ev => {
            const [mouseH, mouseV] = mouse(ev);
            handle.locH = mouseH - x + wM / 2;
            if (handle.locH < min) handle.locH = min;
            if (handle.locH > max) handle.locH = max;
            /* too far above or below the bar: let go */
            if (mouseV < D / 2 - hM || mouseV > D / 2 + hM) return up();
            const z = handle.locH;
            track.locH = M + 2 * (M - z);
            handle.place();
            track.place();
        };
        const up = () => {
            removeEventListener('pointermove', move);
            removeEventListener('pointerup', up);
            removeEventListener('pointercancel', up);
        };
        addEventListener('pointermove', move);
        addEventListener('pointerup', up);
        addEventListener('pointercancel', up);
    });

    prepareMovie();
    /* the movie read the screen's size once; a window can change, so it is read again */
    addEventListener('resize', prepareMovie);
})();
