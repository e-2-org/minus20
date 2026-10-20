"""
Extracts what the HTML ports need from the Shockwave (Director) movies in projects/

The .dcr files are compressed ("Afterburner"); ProjectorRays
(https://github.com/ProjectorRays/ProjectorRays) unprotects them into ordinary
Director files (.dir), which this script reads:

    projectorrays decompile "H-BOMB WORDS.dcr" -o out --dump-scripts
    python3 _scripts/director.py out/"H-BOMB WORDS.dir" docs/projects/port/hbombwords

It writes data.js (window.MOVIE: the stage, the tempo, the sprites of the first
frame, the cast members, with their text, shapes and palettes) and each bitmap
as a PNG. The Lingo scripts, which ProjectorRays decompiles, are ported by hand.

The file layouts follow ScummVM's Director engine (engines/director/), and the
Mac system palette is from its graphics-data.h.
"""
import json
import os
import struct
import sys
import zlib

# the Mac system palette (index 0 is white, 255 black), from ScummVM's graphics-data.h
MAC_PALETTE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'macpalette.json')


class DirFile:
    """the chunks of a Director file (RIFX big-endian, XFIR little-endian), found through its memory map"""

    def __init__(self, path):
        self.d = d = open(path, 'rb').read()
        self.be = d[:4] == b'RIFX'
        self.E = E = '>' if self.be else '<'
        mmap_off = struct.unpack(E + 'I', d[24:28])[0]
        hdr_len, entry_len, _, used = struct.unpack(E + 'HHii', d[mmap_off + 8:mmap_off + 20])
        self.chunks = []
        for k in range(used):
            p = mmap_off + 8 + hdr_len + k * entry_len
            ln, off = struct.unpack(E + 'Ii', d[p + 4:p + 12])
            self.chunks.append((self.fourcc(d[p:p + 4]), off, ln))

    def fourcc(self, b):
        return (b if self.be else b[::-1]).decode('latin-1')

    def get(self, index):
        tag, off, ln = self.chunks[index]
        return self.d[off + 8:off + 8 + ln]

    def first(self, tag):
        return next((self.get(i) for i, c in enumerate(self.chunks) if c[0] == tag), None)

    def children(self):
        """KEY*: cast chunk index -> {fourcc: chunk index} of the chunks belonging to it (BITD, STXT, CLUT...)"""
        body = self.first('KEY*')
        _, _, _, used = struct.unpack(self.E + 'HHii', body[:12])
        out = {}
        for i in range(used):
            p = 12 + i * 12
            section, owner = struct.unpack(self.E + 'ii', body[p:p + 8])
            out.setdefault(owner, {})[self.fourcc(body[p + 8:p + 12])] = section
        return out


def config(f):
    """the stage's size, from DRCF/VWCF (always big-endian); the tempo is in the score"""
    c = f.first('DRCF') or f.first('VWCF')
    top, left, bottom, right = struct.unpack('>hhhh', c[4:12])
    return {'width': right - left, 'height': bottom - top}


def cast_members(f):
    """member number -> {type, name, data (the type's own fields), chunk}"""
    cas = f.first('CAS*')
    ids = struct.unpack('>%di' % (len(cas) // 4), cas)
    out = {}
    for num, idx in enumerate(ids, 1):
        if idx <= 0 or f.chunks[idx][0] != 'CASt':
            continue
        body = f.get(idx)
        typ, info_len, data_len = struct.unpack('>III', body[:12])
        info = body[12:12 + info_len]
        name = ''
        if len(info) >= 20:
            data_off = struct.unpack('>I', info[:4])[0]
            n = struct.unpack('>H', info[data_off:data_off + 2])[0]
            offs = struct.unpack('>%dI' % (n + 1), info[data_off + 2:data_off + 2 + 4 * (n + 1)])
            start = data_off + 2 + 4 * (n + 1)
            if n > 1:
                raw = info[start + offs[1]:start + offs[2]]
                name = raw[1:1 + raw[0]].decode('mac_roman', 'replace') if raw else ''
        out[num] = {'type': typ, 'name': name, 'data': body[12 + info_len:12 + info_len + data_len], 'chunk': idx}
    return out


def score(f):
    """the frames of the score (VWSC, D6+): each frame's main channels and sprite channels, as bytes"""
    data = f.first('VWSC')
    entry_count = struct.unpack('>i', data[12:16])[0]
    offsets = struct.unpack('>%di' % (entry_count + 1), data[24:24 + 4 * (entry_count + 1)])
    base = 24 + 4 * (entry_count + 1)
    fs = data[base + offsets[0]:base + offsets[1]]
    _, hdr, nframes, _, rec, nchan = struct.unpack('>IIIHHH', fs[:18])
    main = 6 * rec
    buf = bytearray(main + rec * nchan)
    frames, q = [], hdr
    while q < len(fs) and (not nframes or len(frames) < nframes):
        end = q + struct.unpack('>H', fs[q:q + 2])[0]
        q += 2
        while q < end:
            clen, coff = struct.unpack('>HH', fs[q:q + 4])
            buf[coff:coff + clen] = fs[q + 4:q + 4 + clen]
            q += 4 + clen
        frames.append(bytes(buf))
    return rec, nchan, frames


def tempo(frame, rec):
    """the tempo channel: (tempo, cue point); 246 means cue point frames a second (D6+)"""
    t = frame[rec:2 * rec]
    return t[6], struct.unpack('>h', t[4:6])[0]


def sprites(frame, rec, nchan):
    """the sprite channels in use (D6+ layout, as ScummVM's readSpriteDataD7)"""
    out = []
    for c in range(nchan):
        r = frame[6 * rec + c * rec:6 * rec + (c + 1) * rec]
        if not any(r[:20]):
            continue
        typ, ink, fore, back, castlib, member, _, y, x, h, w, colorcode, blend, thickness, _ = \
            struct.unpack('>BBBBhHIhhhhBBBB', r[:24])
        s = {'channel': c + 1, 'type': typ, 'ink': ink & 0x3f, 'trails': bool(ink & 0x40), 'stretch': bool(ink & 0x80),
             'member': member, 'x': x, 'y': y, 'width': w, 'height': h,
             'fore': fore, 'back': back, 'blend': round((255 - blend) * 100 / 255), 'thickness': thickness}
        if len(r) >= 28:
            if colorcode & 0x10:
                s['foreRGB'] = [fore, r[24], r[26]]
            if colorcode & 0x20:
                s['backRGB'] = [back, r[25], r[27]]
        out.append(s)
    return out


def fonts(f):
    """Fmap: font id -> name"""
    d = f.first('Fmap')
    if not d:
        return {}
    map_len, names_len = struct.unpack('>II', d[:8])
    body, names = d[8:8 + map_len], d[8 + map_len:8 + map_len + names_len]
    count = struct.unpack('>I', body[8:12])[0]
    out = {}
    for i in range(count):
        entry = body[28 + i * 8:36 + i * 8]
        name_off, platform, font_id = struct.unpack('>IHH', entry)
        n = struct.unpack('>I', names[name_off:name_off + 4])[0]
        out[font_id] = names[name_off + 4:name_off + 4 + n].decode('mac_roman')
    return out


def text(f, chunk, font_names):
    """STXT: the text and its runs of style"""
    body = f.get(chunk)
    off, tl, dl = struct.unpack('>III', body[:12])
    runs_data = body[off + tl:off + tl + dl]
    runs = []
    for i in range(struct.unpack('>H', runs_data[:2])[0]):
        start, height, ascent, font, style, _, size, r, g, b = struct.unpack('>IHHHBBHHHH', runs_data[2 + i * 20:22 + i * 20])
        runs.append({'start': start, 'font': font_names.get(font, font), 'bold': bool(style & 1), 'italic': bool(style & 2),
                     'underline': bool(style & 4), 'size': size, 'lineHeight': height, 'ascent': ascent, 'colour': [r >> 8, g >> 8, b >> 8]})
    return {'text': body[off:off + tl].decode('mac_roman').replace('\r', '\n'), 'runs': runs}


def palette(f, chunk):
    """CLUT: 256 colours of 16-bit red, green, blue"""
    d = f.get(chunk)
    return [[d[i * 6], d[i * 6 + 2], d[i * 6 + 4]] for i in range(len(d) // 6)]


def bitmap(f, member, chunk):
    """a bitmap member: its header (D4-D6) and its pixels, unpacked from BITD (PackBits rows)"""
    d = member['data']
    pitch = struct.unpack('>H', d[:2])[0] & 0x0fff
    top, left, bottom, right = struct.unpack('>hhhh', d[2:10])
    reg_y, reg_x = struct.unpack('>hh', d[18:22])
    bpp = d[23] if len(d) > 23 else 1
    clut = struct.unpack('>h', d[26:28])[0] if len(d) >= 28 else 0
    w, h = right - left, bottom - top
    src = f.get(chunk)
    if len(src) == pitch * h:
        pixels = bytearray(src)
    else:
        pixels, i = bytearray(), 0
        while i < len(src):
            n = src[i]
            i += 1
            if n & 0x80:
                pixels += bytes([src[i]]) * (((n ^ 0xff) & 0xff) + 2)
                i += 1
            else:
                pixels += src[i:i + n + 1]
                i += n + 1
    pixels += bytes(max(0, pitch * h - len(pixels)))
    return {'width': w, 'height': h, 'pitch': pitch, 'bitsPerPixel': bpp, 'clut': clut,
            'regX': reg_x - left, 'regY': reg_y - top, 'pixels': bytes(pixels)}


def write_png(path, w, h, rgb_rows):
    raw = b''.join(b'\0' + row for row in rgb_rows)
    chunk = lambda tag, data: struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data))
    with open(path, 'wb') as out:
        out.write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
                  + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


def main(path, out_dir):
    f = DirFile(path)
    os.makedirs(out_dir, exist_ok=True)
    mac = json.load(open(MAC_PALETTE))
    mac = [mac[i:i + 3] for i in range(0, 768, 3)]
    children = f.children()
    font_names = fonts(f)
    members = cast_members(f)
    palettes = {num: palette(f, children[m['chunk']]['CLUT']) for num, m in members.items()
                if m['type'] == 4 and 'CLUT' in children.get(m['chunk'], {})}
    movie = {'config': config(f), 'fonts': font_names, 'members': {}, 'palettes': palettes, 'macPalette': mac}
    rec, nchan, frames = score(f)
    movie['frames'] = len(frames)
    movie['tempo'] = [tempo(fr, rec) for fr in frames[:1]]
    movie['sprites'] = sprites(frames[0], rec, nchan)
    for num, m in members.items():
        entry = {'type': m['type'], 'name': m['name']}
        kids = children.get(m['chunk'], {})
        if m['type'] == 1 and 'BITD' in kids:  # bitmap
            b = bitmap(f, m, kids['BITD'])
            pal = palettes.get(b['clut'], mac)
            rows = []
            for y in range(b['height']):
                row = b['pixels'][y * b['pitch']:y * b['pitch'] + b['width']]
                rows.append(bytes(c for i in row for c in pal[i]))
            name = (m['name'] or str(num)) + '.png'
            write_png(os.path.join(out_dir, name), b['width'], b['height'], rows)
            entry.update({k: b[k] for k in ('width', 'height', 'bitsPerPixel', 'clut', 'regX', 'regY')}, file=name)
        elif m['type'] == 3 and 'STXT' in kids:  # field
            d = m['data']
            entry.update(text(f, kids['STXT'], font_names))
            entry['field'] = {'border': d[0], 'gutter': d[1], 'boxShadow': d[2], 'textType': d[3],
                              'align': struct.unpack('>h', d[4:6])[0], 'background': [d[6], d[8], d[10]],
                              'rect': struct.unpack('>hhhh', d[14:22]), 'maxHeight': struct.unpack('>h', d[22:24])[0]}
        elif m['type'] == 8:  # shape
            d = m['data']
            shape_type, top, left, bottom, right, pattern, fore, back, fill, thickness, direction = \
                struct.unpack('>HhhhhHBBBBB', d[:17])
            entry.update(shape=shape_type, width=right - left, height=bottom - top, pattern=pattern,
                         fore=fore, back=back, filled=bool(fill & 1), thickness=thickness)
        movie['members'][num] = entry
    with open(os.path.join(out_dir, 'data.js'), 'w', encoding='utf-8') as out:
        out.write(f'/* extracted from {os.path.basename(path)} by _scripts/director.py */\n')
        out.write('window.MOVIE = ' + json.dumps(movie) + ';\n')
    print(json.dumps({k: v for k, v in movie.items() if k not in ('macPalette', 'palettes')}, ensure_ascii=False)[:3000])


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
