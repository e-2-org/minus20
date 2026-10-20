"""
Turns a Flash movie's frames, exported as SVG by JPEXS FFDec, into a port for the browser

    java -jar ffdec-cli.jar -format frame:svg -export frame frames/ movie.swf
    python3 _scripts/flashframes.py frames/ docs/projects/port/minus20kj port/minus20kj

For movies which only play frames (and a few buttons), each frame is drawn exactly as Flash
laid it out. The frames go into frames.js (window.FRAMES, one SVG group's markup each, for
port/flashframes.js to show at the movie's rate). The definitions they use (shapes, texts,
glyphs, buttons), repeated by FFDec in every frame, are written once, named by their content.
Bitmaps, which FFDec embeds in every frame they appear in, are written once each as files.
Graphics keep their character id (data-char), so the player can find buttons.

The third argument is the folder as the page sees it, for the bitmaps' links.
"""
import base64
import hashlib
import json
import os
import re
import sys


def frame_number(name):
    return int(re.match(r'\d+', name).group())


def split_defs(defs):
    """FFDec writes each definition at four spaces' indent: one string each"""
    items, current = [], None
    for line in defs.split('\n'):
        if re.match(r'    <(?!/)', line):
            current = [line]
            items.append(current)
        elif current is not None and line.strip():
            current.append(line)
    return ['\n'.join(i) for i in items]


def main(src, out, href):
    os.makedirs(out, exist_ok=True)
    names = sorted((n for n in os.listdir(src) if n.endswith('.svg')), key=frame_number)
    frames, images, shared, styles = [], {}, {}, []
    width = height = None
    ref = re.compile(r'(xlink:href="#|url\(#)([^")]+)')
    for name in names:
        with open(os.path.join(src, name), encoding='utf-8') as file:
            svg = file.read()
        if width is None:
            width = float(re.search(r'width="([\d.]+)px"', svg).group(1))
            height = float(re.search(r'height="([\d.]+)px"', svg).group(1))

        # bitmaps: once each, as files
        def bitmap(m):
            kind, data = m.group(1).lower(), base64.b64decode(m.group(2))
            ext = {'jpeg': 'jpg', 'jpg': 'jpg', 'png': 'png', 'gif': 'gif'}.get(kind, 'png')
            key = hashlib.sha1(data).hexdigest()[:12]
            if key not in images:
                images[key] = f'image-{len(images) + 1}.{ext}'
                with open(os.path.join(out, images[key]), 'wb') as file:
                    file.write(data)
            return f'xlink:href="{href}/{images[key]}"'
        svg = re.sub(r'xlink:href="data:image/(\w+);base64,([^"]+)"', bitmap, svg)

        display = re.search(r'<svg[^>]*>\s*(<g.*?\n  </g>)', svg, re.S).group(1)
        defs = re.search(r'<defs>(.*)</defs>', svg, re.S)
        local = {}
        for item in split_defs(defs.group(1) if defs else ''):
            m = re.match(r'\s*<\w+ id="([^"]+)"', item)
            if m:
                local[m.group(1)] = item
            elif item not in styles:
                styles.append(item)

        # the same definition in another frame gets the same id: named by its content, once what
        # it refers to is named
        canon = {}
        while len(canon) < len(local):
            progress = False
            for lid, item in local.items():
                if lid in canon:
                    continue
                refs = {r for _, r in ref.findall(item)} - {lid}
                if all(r in canon or r not in local for r in refs):
                    body = ref.sub(lambda m: m.group(1) + canon.get(m.group(2), m.group(2)), item)
                    body = body.replace(f'id="{lid}"', 'id="@"', 1)
                    cid = 'd' + hashlib.sha1(body.encode()).hexdigest()[:10]
                    canon[lid] = cid
                    shared.setdefault(cid, body.replace('id="@"', f'id="{cid}"', 1))
                    progress = True
            if not progress:
                raise ValueError(f'{name}: definitions refer to each other in a loop')
        display = ref.sub(lambda m: m.group(1) + canon.get(m.group(2), m.group(2)), display)
        frames.append(display)

    def tidy(markup):
        markup = re.sub(r'xlink:href=', 'href=', markup)
        markup = re.sub(r'ffdec:characterId="(\d+)"', r'data-char="\1"', markup)
        markup = re.sub(r'\s*ffdec:[\w-]+="[^"]*"', '', markup)
        return re.sub(r'>\s+<', '><', markup).strip()
    frames = [tidy(f) for f in frames]
    defs = tidy(''.join(shared.values()) + ''.join(styles))
    with open(os.path.join(out, 'frames.js'), 'w', encoding='utf-8') as file:
        file.write(f'/* {len(frames)} frames, exported by FFDec and gathered by _scripts/flashframes.py */\n')
        file.write(f'window.FRAMES = {{ width: {width:g}, height: {height:g},\n'
                   f'defs: {json.dumps(defs)},\nframes: {json.dumps(frames)} }};\n')
    print(f'{len(frames)} frames, {width:g} x {height:g}, {len(shared)} definitions, {len(images)} bitmaps, '
          f'frames.js {os.path.getsize(os.path.join(out, "frames.js")) // 1024} KB')


if __name__ == '__main__':
    main(*sys.argv[1:4])
