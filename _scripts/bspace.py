"""
Builds the drawing of betweenspace016 (projects/bspace016.swf, Paul Allitt) for its HTML port

    java -jar ffdec-cli.jar -select 1 -format frame:svg -export frame frame/ bspace016.swf
    java -jar ffdec-cli.jar -selectid 14 -format sprite:svg -export sprite tiles/ bspace016.swf
    python3 _scripts/bspace.py frame/1.svg tiles/DefineSprite_14 docs/projects/port/bspace016

FFDec draws the first frame with its clips (sprites and buttons) as <use> of shared
definitions. Here every clip is copied in place instead, so that each copy can change on
its own, as the movie's clips did: their instance names become data-name, and their ids are
made unique. The 60 tiles of each tile grid (mc1 ... mc60) become a <use> of one of the tile
clip's 32 frames, which port/bspace016/bspace016.js changes as the movie's scripts did.
Writes stage.js: window.STAGE = { width, height, svg }.
"""
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

SVG = 'http://www.w3.org/2000/svg'
XLINK = 'http://www.w3.org/1999/xlink'
FFDEC = 'https://www.free-decompiler.com/flash'
ET.register_namespace('', SVG)
ET.register_namespace('xlink', XLINK)
ET.register_namespace('ffdec', FFDEC)
HREF = f'{{{XLINK}}}href'
CHAR = f'{{{FFDEC}}}characterId'


def q(tag):
    return f'{{{SVG}}}{tag}'


def main(frame_svg, tiles_dir, out):
    root = ET.parse(frame_svg).getroot()
    defs = {el.get('id'): el for el in root.find(q('defs')).iter() if el.get('id')}
    counter = [0]

    def inline(el):
        """replace <use> of sprites and buttons with copies of them, recursively"""
        for parent in list(el.iter()):
            for i, child in enumerate(list(parent)):
                if child.tag != q('use'):
                    continue
                target = child.get(HREF, '')[1:]
                if not (target.startswith('sprite') or target.startswith('button')):
                    continue
                counter[0] += 1
                g = ET.Element(q('g'))
                if child.get('transform'):
                    g.set('transform', child.get('transform'))
                if child.get('id'):
                    g.set('data-name', child.get('id').lower())
                if child.get(CHAR):
                    g.set('data-char', child.get(CHAR))
                # an empty frame (the tiles' first) has no definition
                source = defs.get(target, ET.Element(q('g')))
                copy = ET.fromstring(ET.tostring(source))
                # ids inside the copy (clip paths) are unique to it
                prefix = f'c{counter[0]}-'
                # (not the <use>s' ids: those are instance names, which become data-name)
                ids = [e.get('id') for e in copy.iter() if e.get('id') and e is not copy and e.tag != q('use')]
                for e in copy.iter():
                    if e is not copy and e.get('id') in ids:
                        e.set('id', prefix + e.get('id'))
                    for attr in ('clip-path', 'mask', 'fill'):
                        v = e.get(attr)
                        if v and v.startswith('url(#') and v[5:-1] in ids:
                            e.set(attr, f'url(#{prefix}{v[5:-1]})')
                for c in list(copy):
                    g.append(c)
                if copy.get('class'):
                    g.set('class', copy.get('class'))
                parent[i] = g
                inline(g)

    main_group = root.find(q('g'))
    inline(main_group)

    # the tiles: mc1 ... mc60 show one of the tile clip's frames
    for g in main_group.iter(q('g')):
        name = g.get('data-name') or ''
        if re.fullmatch(r'mc\d+', name):
            for c in list(g):
                g.remove(c)
            use = ET.SubElement(g, q('use'))
            use.set('href', '#tile-1')
            use.set('class', 'tile')

    # the tile clip's frames, each with its own ids
    tile_defs = []
    for n in range(1, 33):
        t = ET.parse(os.path.join(tiles_dir, f'{n}.svg')).getroot()
        body = ET.tostring(t.find(q('g')), encoding='unicode')
        tdefs = t.find(q('defs'))
        extra = ''.join(ET.tostring(d, encoding='unicode') for d in tdefs) if tdefs is not None else ''
        markup = f'<g id="tile-{n}">{body}</g>{extra}'
        markup = re.sub(r'id="(shape|gradient)(\d+)"', rf'id="t{n}-\1\2"', markup)
        markup = re.sub(r'(href="#|url\(#)(shape|gradient)(\d+)', rf'\1t{n}-\2\3', markup)
        tile_defs.append(markup)

    # what is left of FFDec's definitions: the shapes and gradients the copies use
    shared = [ET.tostring(d, encoding='unicode') for k, d in defs.items()
              if k and not (k.startswith('sprite') or k.startswith('button'))]
    styles = [ET.tostring(d, encoding='unicode') for d in root.find(q('defs')) if d.tag == q('style')]
    svg = ET.tostring(main_group, encoding='unicode')
    markup = f'<defs>{"".join(shared)}{"".join(tile_defs)}{"".join(styles)}</defs>{svg}'
    markup = re.sub(r'xmlns(:\w+)?="[^"]*"', '', markup)
    markup = re.sub(r'xlink:href=', 'href=', markup)
    markup = re.sub(r'\s*ffdec:[\w-]+="[^"]*"', '', markup)
    markup = re.sub(r'<ns\d+:', '<', markup).replace('</ns0:', '</')
    markup = re.sub(r'>\s+<', '><', markup)
    width = float(root.get('width').rstrip('px'))
    height = float(root.get('height').rstrip('px'))
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, 'stage.js'), 'w', encoding='utf-8') as file:
        file.write('/* the drawing of bspace016.swf, from FFDec, built by _scripts/bspace.py */\n')
        file.write(f'window.STAGE = {{ width: {width:g}, height: {height:g}, svg: {json.dumps(markup)} }};\n')
    print(f'stage.js {os.path.getsize(os.path.join(out, "stage.js")) // 1024} KB, {counter[0]} clips copied')


if __name__ == '__main__':
    main(*sys.argv[1:4])
