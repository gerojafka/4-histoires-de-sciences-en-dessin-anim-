import asyncio, base64, io, json, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image
SHOTS = {'arist': (0, 9.5), 'erato': (2, 'f0.45'), 'picard': (0, 13.2), 'roemer': (1, 'f0.6')}
if len(sys.argv) > 1: SHOTS = {k: v for k, v in SHOTS.items() if k in sys.argv[1:]}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width':1280,'height':720}); await pg.add_init_script('window.__CAPTURE=true')
        await pg.goto('file://' + str(pathlib.Path('index.html').resolve())); await pg.evaluate('APP.fonts')
        mins = {}
        for sid in ['arist', 'erato', 'picard', 'roemer']:
            d = await pg.evaluate(f'APP.steps({json.dumps(sid)})'); mins[sid] = round(sum(d) / 60, 2)
        for sid, (st, tm) in SHOTS.items():
            d = (await pg.evaluate(f'APP.steps({json.dumps(sid)})'))[st]
            t = d * float(tm[1:]) if isinstance(tm, str) else tm
            for lg in ['fr', 'en']:
                uri = await pg.evaluate(f'APP.frame({json.dumps(sid)},{st},{t},"{lg}",0.92,true)')
                Image.open(io.BytesIO(base64.b64decode(uri.split(',')[1]))).resize((640, 360), Image.LANCZOS).save(f'assets/thumb_{sid}_{lg}.jpg', quality=82)
        pathlib.Path('assets/minutes.json').write_text(json.dumps(mins)); print('minutes', mins)
        await b.close()
asyncio.run(main())
