/*
 * betweenspace016 (Paul Allitt), ported from bspace016.swf (Flash 5)
 *
 * Two halves, side by side, each with a ground, a band (back) and three groups of tiles
 * (leftClouds, midClouds, rightClouds, black at first), and six buttons. Each tile group is a
 * grid of 60 tiles (6 x 10), each showing one of 32 frames: soft quarter circles whose edges
 * are coded 1 to 4 (frameName). Starting empty, every 12 frames (at 18 a second) a grid sets a
 * random tile and then the 8 around it so that their edges join: the pattern grows by itself.
 * The buttons recolour the ground, the band and the tiles, scale the tile groups, and switch
 * the tiles between their two sets ("t" and "n"). The ActionScript is ported below, as it was;
 * the drawing (stage.js) is from FFDec, built by _scripts/bspace.py.
 */
(function () {
    const FPS = 18;
    const NS = 'http://www.w3.org/2000/svg';
    const { width, height, svg: markup } = window.STAGE;
    const holder = document.getElementById('bspace016');
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.display = 'block';
    svg.innerHTML = markup;
    holder.appendChild(svg);
    const filters = svg.querySelector('defs');

    /* Flash's random(n): 0 to n - 1 */
    const random = n => Math.floor(Math.random() * n);

    /* colour transforms (Color.setRGB, Color.setTransform), as colour matrix filters */
    let filterCount = 0;
    function setColour(el, { rm = 1, gm = 1, bm = 1, ra = 0, ga = 0, ba = 0 }) {
        if (!el.colourFilter) {
            const f = document.createElementNS(NS, 'filter');
            f.id = 'colour' + ++filterCount;
            f.setAttribute('color-interpolation-filters', 'sRGB');
            f.setAttribute('x', '-10%');
            f.setAttribute('y', '-10%');
            f.setAttribute('width', '120%');
            f.setAttribute('height', '120%');
            f.innerHTML = '<feColorMatrix type="matrix"/>';
            filters.appendChild(f);
            el.setAttribute('filter', `url(#${f.id})`);
            el.colourFilter = f.firstChild;
        }
        el.colourFilter.setAttribute('values',
            `${rm} 0 0 0 ${ra / 255} 0 ${gm} 0 0 ${ga / 255} 0 0 ${bm} 0 ${ba / 255} 0 0 0 1 0`);
    }
    const setRGB = (el, rgb) => setColour(el, { rm: 0, gm: 0, bm: 0, ra: rgb >> 16 & 255, ga: rgb >> 8 & 255, ba: rgb & 255 });
    /* setTransform({ra, rb, ga, gb, ba, bb}): multipliers as percentages, offsets */
    const setTransform = (el, t) => setColour(el, {
        rm: t.ra / 100, gm: t.ga / 100, bm: t.ba / 100, ra: +t.rb, ga: +t.gb, ba: +t.bb,
    });
    const randomTransform = () => ({ ra: random(200), rb: '0', ga: random(200), gb: '0', ba: random(200), bb: '0', aa: '100', ab: '0' });

    /* the tiles' frames: their labels, and each frame's edges (top, right, bottom, left) */
    const LABELS = ['1111', '1132', '3113', '3134', '2311', '2332', '4313', '4334',
        '1221', '1242', '3223', '3244', '2421', '2442', '4423', '4444'];
    const frameOfLabel = {};
    LABELS.forEach((l, i) => { frameOfLabel['t' + l] = i + 1; frameOfLabel['n' + l] = i + 17; });
    const frameName = [1,1,1,1,1,1,3,2,3,1,1,3,3,1,3,4,2,3,1,1,2,3,3,2,4,3,1,3,4,3,3,4,1,2,2,1,1,2,4,2,3,2,2,3,3,2,4,4,2,4,2,1,2,4,4,2,4,4,2,3,4,4,4,4,1,1,1,1,1,1,3,2,3,1,1,3,3,1,3,4,2,3,1,1,2,3,3,2,4,3,1,3,4,3,3,4,1,2,2,1,1,2,4,2,3,2,2,3,3,2,4,4,2,4,2,1,2,4,4,2,4,4,2,3,4,4,4,4];

    /* a clip whose only named ancestor (if any) is the given one */
    const named = (scope, name) => [...scope.querySelectorAll(`[data-name="${name}"]`)]
        .find(el => !el.parentElement.closest('[data-name]') || el.parentElement.closest('[data-name]') === scope);

    /* a tile grid (the clip midClouds inside each tile group) */
    function Grid(clip) {
        const tiles = [];
        for (let i = 1; i <= 60; i++) {
            const use = clip.querySelector(`[data-name="mc${i}"] use`);
            tiles[i] = { use, frame: 1 };
        }
        const grid = {
            /* onClipEvent(load) */
            count: 4, tilesWide: 6, tilesHigh: 10, framA: 't', framN: 0, tiles,
            currentframe: i => tiles[i] ? tiles[i].frame : NaN,
            gotoAndStop(i, frame) {
                const tile = tiles[i];
                if (!tile) return;
                const n = typeof frame === 'string' ? frameOfLabel[frame.toLowerCase()] : Math.min(Math.max(Math.floor(frame), 1), 32);
                if (!n) return; /* a label that isn't there: Flash does nothing */
                tile.frame = n;
                tile.use.setAttribute('href', '#tile-' + n);
            },
            /* onClipEvent(enterFrame) */
            enterFrame() {
                const W = grid.tilesWide;
                const edge = (i, k) => frameName[(grid.currentframe(i) - 1) * 4 + k];
                const label = digits => grid.framA + digits;
                grid.count += 1;
                if (grid.count % 12 !== 1) return;
                const Num1 = Math.floor(Math.random() * ((W - 4) * (grid.tilesHigh - 4)));
                const centre = Num1 + Math.floor(Num1 / (W - 4)) * 4 + (W * 2 + 3);
                grid.gotoAndStop(centre, Math.floor(Math.random() * 16) + 1 + grid.framN);
                /* above and below: the edges of the tiles above and below them */
                for (const tileNum of [centre - W, centre + W]) {
                    const A = edge(tileNum - W, 2), C = edge(tileNum + W, 0);
                    const row = { 1: ['1111', '1221', '1132', '1242'], 2: ['2311', '2421', '2332', '2442'],
                        3: ['3113', '3223', '3134', '3244'] }[A] || ['4313', '4423', '4334', '4444'];
                    grid.gotoAndStop(tileNum, label(row[[1, 2, 3].indexOf(C) === -1 ? 3 : C - 1]));
                }
                /* right and left: the edges of the tiles beside them */
                for (const tileNum of [centre + 1, centre - 1]) {
                    const B = edge(tileNum + 1, 3), D = edge(tileNum - 1, 1);
                    const row = { 1: ['1111', '1132', '3113', '3134'], 2: ['1221', '1242', '3223', '3244'],
                        3: ['2311', '2332', '4313', '4334'] }[B] || ['2421', '2442', '4423', '4444'];
                    grid.gotoAndStop(tileNum, label(row[[1, 2, 3].indexOf(D) === -1 ? 3 : D - 1]));
                }
                /* the corners: all four edges, if there is such a tile */
                for (const tileNum of [centre - W - 1, centre - W + 1, centre + W - 1, centre + W + 1]) {
                    grid.gotoAndStop(tileNum, label('' + edge(tileNum - W, 2) + edge(tileNum + 1, 3) + edge(tileNum + W, 0) + edge(tileNum - 1, 1)));
                }
            },
        };
        return grid;
    }

    /* the two halves: each its own timeline, with its own variables */
    const halves = [...svg.querySelectorAll('[data-char="23"], [data-char="24"]')];
    const grids = [];
    halves.forEach(half => {
        const ground = named(half, 'ground');
        const back = named(half, 'back');
        const clouds = { leftClouds: named(half, 'leftclouds'), midClouds: named(half, 'midclouds'), rightClouds: named(half, 'rightclouds') };
        const grid = {};
        for (const [key, group] of Object.entries(clouds)) {
            grid[key] = Grid(named(group, 'midclouds'));
            grids.push(grid[key]);
            group.baseTransform = group.getAttribute('transform') || '';
        }
        /* the colours they were placed with */
        setRGB(ground, 0xffffff);
        setRGB(back, 0xff0022);
        Object.values(clouds).forEach(c => setRGB(c, 0x000000));

        /* _xscale and _yscale: about the group's own origin */
        const setScale = (group, s) => {
            const m = group.baseTransform.match(/matrix\(([^)]*)\)/);
            const [, , , , e, f] = m ? m[1].split(/[ ,]+/).map(Number) : [1, 0, 0, 1, 0, 0];
            group.setAttribute('transform', `matrix(${s / 100} 0 0 ${s / 100} ${e} ${f})`);
        };
        const v = { butCloud: 0, butBack: 0, butGround: 0, butScale: 0 };
        const shift = (key, by, keepWithin) => {
            for (let i = 1; i < 61; i++) {
                const f = grid[key].currentframe(i);
                grid[key].gotoAndStop(i, keepWithin ? keepWithin(f) : f + by);
            }
        };
        const setSet = (key, a) => { grid[key].framA = a; grid[key].framN = a === 'n' ? 16 : 0; };
        const actions = {
            /* the tiles' colours, in turn */
            17() {
                v.butCloud += 1;
                const sets = [[0, 0, 0], [16711714, 3381657, 16763904], [3381657, 16763904, 10066227],
                    [16763904, 10066227, 16711714], [10066227, 16711714, 3381657], [16777215, 16777215, 16777215]];
                const [mid, left, right] = sets[v.butCloud % 6];
                setRGB(clouds.midClouds, mid); setRGB(clouds.leftClouds, left); setRGB(clouds.rightClouds, right);
            },
            /* the band's colour, in turn, on a white ground */
            18() {
                v.butBack += 1;
                setRGB(back, [16711714, 16763904, 10066227, 3381657][v.butBack % 4]);
                setRGB(ground, 16777215);
            },
            /* the tiles, tinted at random */
            19() {
                setTransform(clouds.midClouds, randomTransform());
                setTransform(clouds.leftClouds, randomTransform());
                setTransform(clouds.rightClouds, randomTransform());
            },
            /* the ground and the band, tinted at random */
            20() {
                v.butGround += 1;
                if (v.butGround % 4 === 0) setRGB(ground, 16777215);
                else setTransform(ground, randomTransform());
                setTransform(back, randomTransform());
            },
            /* the tile groups, scaled at random (every fourth time, back to 100%) */
            21() {
                v.butScale += 1;
                for (const c of Object.values(clouds)) setScale(c, v.butScale % 4 === 0 ? 100 : random(80) + 60);
            },
            /* the tiles' set: "t", "n", or one or the other for each group (this button shares butGround with 20) */
            22() {
                v.butGround += 1;
                if (v.butGround % 3 === 0) {
                    for (const key of Object.keys(clouds)) { setSet(key, 't'); shift(key, -16); }
                } else if (v.butGround % 3 === 1) {
                    for (const key of Object.keys(clouds)) { setSet(key, 'n'); shift(key, 16); }
                } else {
                    const ranN = random(2);
                    const pick = (key, n) => {
                        setSet(key, n ? 't' : 'n');
                        shift(key, 0, f => n ? (f - 1) % 16 + 1 : (f - 1) % 16 + 17);
                    };
                    pick('leftClouds', ranN);
                    pick('midClouds', random(2));
                    pick('rightClouds', ranN === 0 ? 1 : 0);
                }
            },
        };
        /* Flash buttons act on release */
        for (const [char, action] of Object.entries(actions)) {
            half.querySelectorAll(`[data-char="${char}"]`).forEach(b => {
                b.style.cursor = 'pointer';
                b.addEventListener('click', action);
            });
        }
    });

    /* 18 frames a second: each grid's enterFrame */
    const step = 1000 / FPS;
    let next = performance.now() + step;
    function tick(now) {
        while (now >= next) {
            grids.forEach(g => g.enterFrame());
            next += step;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();
