"""Renders the four scientists one by one (transparent PNG) and stacks them, each on the shoulders of the one before."""
import asyncio, base64, io, json, pathlib
from playwright.async_api import async_playwright
from PIL import Image
SIT = {'hipL.x':-1.45,'hipR.x':-1.45,'hipL.z':-0.55,'hipR.z':0.55,'kneeL.x':1.6,'kneeR.x':1.6}
HOLD = {'shL.z':-1.45,'shR.z':1.45,'elL.z':-2.75,'elR.z':2.75}
CFG = [ # bottom -> top
  ('arist',  1.00, dict(HOLD, **{'head.x':-0.12}), 0.18),
  ('erato',  0.82, dict(SIT, **HOLD, **{'head.x':-0.1}), 0.12),
  ('picard', 0.68, dict(SIT, **HOLD, **{'head.x':-0.1}), 0.1),
  ('roemer', 0.56, dict(SIT, **{'shR.z':2.55,'elR.z':0.25,'shL.z':-0.35,'elL.x':-0.4,'head.x':-0.3}), 0.0),
]
UPP = 0.01; W, H, FOOT = 700, 1200, 150
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width':1280,'height':720}); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script('window.__CAPTURE=true')
        await pg.goto('file://' + str(pathlib.Path('index.html').resolve())); await pg.evaluate('APP.fonts')
        ims = []; legs = []
        for i, (sid, sc, pose, ry) in enumerate(CFG):
            o = dict(scale=sc, pose=pose, ry=ry, w=W, h=H, upp=UPP, foot=FOOT, sit=i > 0)
            uri = await pg.evaluate(f'APP.portrait({json.dumps(sid)},{json.dumps(o)})')
            ims.append(Image.open(io.BytesIO(base64.b64decode(uri.split(',')[1]))).convert('RGBA'))
            o['legsOnly'] = True
            uri = await pg.evaluate(f'APP.portrait({json.dumps(sid)},{json.dumps(o)})')
            legs.append(Image.open(io.BytesIO(base64.b64decode(uri.split(',')[1]))).convert('RGBA'))
        if errs: print('ERR', errs)
        await b.close()
    # vertical placement (units): root of each upper figure so its hips rest on the lower's shoulders
    roots = [0.0]
    for i in range(1, len(CFG)):
        s_low, s_up = CFG[i-1][1], CFG[i][1]
        roots.append(roots[-1] + 7.35 * s_low - 4.1 * s_up)
    px = 1 / UPP; top_extra = 3.2
    CH = int((roots[-1] + 9.5 * CFG[-1][1] + top_extra) * px) + FOOT; CW = W
    canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    pos = lambda i: (0, CH - FOOT - int(roots[i] * px) - (H - FOOT))
    for i in reversed(range(len(CFG))):          # top figure first; each lower one covers the seat, then the upper's legs dangle in front
        canvas.alpha_composite(ims[i], pos(i))
        if i + 1 < len(CFG):                      # the upper's shins, only below the lower's chin
            lg = legs[i + 1].copy(); chin = CH - FOOT - int((roots[i] + 6.35 * CFG[i][1]) * px) - pos(i + 1)[1]
            mask = Image.new('L', lg.size, 0); mask.paste(255, (0, max(0, chin), lg.width, lg.height))
            lg.putalpha(Image.composite(lg.getchannel('A'), Image.new('L', lg.size, 0), mask)); canvas.alpha_composite(lg, pos(i + 1))
    bb = canvas.getbbox(); canvas = canvas.crop((max(0, bb[0]-20), max(0, bb[1]-20), min(CW, bb[2]+20), min(CH, bb[3]+10)))
    pathlib.Path('assets').mkdir(exist_ok=True)
    canvas.save('assets/hero_full.png'); h = 900; canvas.resize((int(canvas.width * h / canvas.height), h), Image.LANCZOS).save('assets/hero.png', optimize=True)
    k = h / canvas.height; top0 = max(0, bb[1]-20)
    heads = [round(((CH - FOOT - (roots[i] + 7.0 * CFG[i][1]) * px) - top0) * k / h, 4) for i in range(len(CFG))]
    pathlib.Path('assets/hero.json').write_text(json.dumps({'heads': heads, 'aspect': round(canvas.width / canvas.height, 4)}))
    print('heads', heads)
    print('hero', canvas.size, 'roots', [round(r, 2) for r in roots])
asyncio.run(main())
