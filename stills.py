"""python3 stills.py story:step:time:lang ...  -> stills/<story>_s<step>_t<time>_<lang>.jpg  (time may be 'end' or a fraction like f0.5)"""
import asyncio, base64, sys, pathlib, json
from playwright.async_api import async_playwright
async def main(args):
    out = pathlib.Path('stills'); out.mkdir(exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':1280,'height':720})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script('window.__CAPTURE=true')
        await pg.goto('file://' + str(pathlib.Path('index.html').resolve())); await pg.evaluate('APP.fonts')
        durs = {}
        for a in args:
            sid, st, tm, lang = a.split(':'); st = int(st)
            if sid not in durs: durs[sid] = await pg.evaluate(f'APP.steps({json.dumps(sid)})')
            d = durs[sid][st]
            t = d if tm == 'end' else (float(tm[1:]) * d if tm.startswith('f') else float(tm))
            uri = await pg.evaluate(f'APP.frame({json.dumps(sid)},{st},{t},{json.dumps(lang)})')
            (out / f'{sid}_s{st}_t{t:05.1f}_{lang}.jpg').write_bytes(base64.b64decode(uri.split(',')[1]))
        print('durations', json.dumps({k: [round(x, 1) for x in v] for k, v in durs.items()}))
        if errs: print('ERRORS', errs)
        await b.close()
asyncio.run(main(sys.argv[1:]))
