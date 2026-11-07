"""Builds savants.html: one self-contained page with the four step-by-step stories."""
import base64, json, pathlib, sys
d = pathlib.Path(__file__).parent
src = d / 'src'
b64 = lambda p: base64.b64encode((d / p).read_bytes()).decode()

# ---------- shared helper blocks, taken from the (single-language) Eratosthenes source ----------
E = (src / 'erato_film.js').read_text()
def back(pos): return E.rfind('/* =====', 0, pos)
HELPERS = E[E.index('/* ---------- helpers ---------- */'):back(E.index('/*  Characters - smooth'))]
WORLD = E[E.index('const AFRICA='):E.index('const GR=10;')]
OVERLAY = E[E.index("const FF='Fredoka"):back(E.index('/*  Scene updates'))]
def fill(code):
    return code.replace('//@@HELPERS@@', HELPERS).replace('//@@WORLD@@', WORLD).replace('//@@OVERLAY@@', OVERLAY)

def body(code):
    """IIFE source -> function body using the shared renderer and canvases."""
    code = code.strip()
    assert code.startswith('(() => {'), code[:30]
    code = code[len('(() => {'):].lstrip()
    if code.startswith("'use strict';"): code = code[len("'use strict';"):]
    rep = [
        ("const CAPTURE = !!window.__CAPTURE;", "const CAPTURE=false;"),
        ("const glc=document.getElementById('gl'), ui=document.getElementById('ui'), ctx=ui.getContext('2d');", "const glc=env.gl, ui=env.ui, ctx=ui.getContext('2d');"),
        ("const renderer=new T.WebGLRenderer({canvas:glc,antialias:true,preserveDrawingBuffer:CAPTURE});", "const renderer=env.renderer;"),
        ("renderer.useLegacyLights=true; renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.setPixelRatio(1);", ""),
    ]
    for a, b in rep:
        assert a in code, a[:60]; code = code.replace(a, b)
    return code

PROLOGUE = "STORIES[%r]=function(env){\n'use strict';\nlet LANG='fr', CAPREC=null; const L2=(fr,en)=>LANG==='fr'?fr:en;\n"

FILM_EPI = r"""
const SD=__SD__;
CAPREC=[]; { const R0=renderer.render; renderer.render=function(){}; try{ for(let t=0;t<=DURATION+1e-6;t+=0.1) renderAt(t); } finally { renderer.render=R0; } }
const CAPS=[]; for(const c of CAPREC){ if(!CAPS.some(x=>Math.abs(x[0]-c[0])<1e-6)) CAPS.push(c); } CAPREC=null; CAPS.sort((p,q)=>p[0]-q[0]);
function warp(A,B){
  const starts=CAPS.map(c=>c[0]).filter(a=>a>A+0.05&&a<B-0.5); const pts=[A,...starts,B]; const segs=[]; let loc=0;
  for(let k=0;k<pts.length-1;k++){ const g0=pts[k], g1=pts[k+1]; let c=null; for(const x of CAPS){ if(x[0]<=g0+0.06&&x[1]>g0+0.06) c=x; }
    const need=c?1.8+Math.max(c[2].length,c[3].length)/15:0; const len=Math.max(g1-g0,need); segs.push([g0,g1,loc,loc+len]); loc+=len; }
  return {dur:loc, map(l){ for(const s of segs){ if(l<=s[3]) return s[0]+(s[1]-s[0])*clamp((l-s[2])/(s[3]-s[2]),0,1); } return B; }};
}
const WP=SD.map(s=>warp(s.a,s.b));
return { steps:SD.map((s,i)=>({title:s.title,dur:WP[i].dur})), setSize:setRenderSize,
  draw(i,l,g,lang,nocap){ LANG=lang; if(nocap) CAPREC=[]; renderAt(WP[i].map(l)); CAPREC=null; } __PORTRAIT__ };
"""

STEP_EPI = r"""
function drawStep(i,l,g,nocap){ ctx.setTransform(SCL,0,0,SCL,0,0); ctx.clearRect(0,0,LW,LH); STEP_FN[i](l,g); if(nocap) return;
  const st=STEPS[i]; let capTxt=null, capStart=0; for(const [t0,o] of st.caps){ if(l>=t0){ capTxt=L(o); capStart=t0; } }
  captionBox(capTxt,smooth(seg(l,capStart,capStart+0.4))); veil(1-smooth(l/0.35)); }
return { steps:STEPS.map(s=>({title:s.title,dur:s.dur})), setSize:setRenderSize,
  draw(i,l,g,lang,nocap){ LANG=lang; drawStep(i,l,g,nocap); } __PORTRAIT__ };
"""

SD = {
 'erato': """[{a:0,b:S.syene-0.3,title:{fr:'La Bibliothèque d\\'Alexandrie',en:'The Library of Alexandria'}},
  {a:S.syene,b:S.alex-0.3,title:{fr:'Le puits de Syène',en:'The well at Syene'}},
  {a:S.alex,b:S.walk-0.3,title:{fr:'L\\'ombre à Alexandrie',en:'The shadow in Alexandria'}},
  {a:S.walk,b:S.geo-0.3,title:{fr:'Mesurer la distance',en:'Measuring the distance'}},
  {a:S.geo,b:S.result-0.3,title:{fr:'La géométrie',en:'The geometry'}},
  {a:S.result,b:DURATION-0.7,title:{fr:'Le tour de la Terre',en:'Around the Earth'}}]""",
 'roemer': """[{a:0,b:S.obs-0.3,title:{fr:'La lumière est-elle instantanée ?',en:'Is light instantaneous?'}},
  {a:S.obs,b:S.ecl-0.3,title:{fr:'L\\'Observatoire de Paris',en:'The Paris Observatory'}},
  {a:S.ecl,b:S.puz-0.3,title:{fr:'Les éclipses d\\'Io',en:'Io\\'s eclipses'}},
  {a:S.puz,b:S.idea-0.3,title:{fr:'L\\'énigme',en:'The puzzle'}},
  {a:S.idea,b:S.acad-0.3,title:{fr:'L\\'idée de Rømer',en:'Rømer\\'s idea'}},
  {a:S.acad,b:S.speed-0.3,title:{fr:'La prédiction',en:'The prediction'}},
  {a:S.speed,b:S.earth-0.3,title:{fr:'La vitesse de la lumière',en:'The speed of light'}},
  {a:S.earth,b:DURATION-0.7,title:{fr:'7 fois et demie le tour de la Terre',en:'7½ times around the Earth'}}]""",
}

PORTRAIT = r"""portrait(o){ o=o||{}; const P=__VAR__; const par=P.root.parent, pos=P.root.position.clone(), rot=P.root.rotation.clone(), scl=P.root.scale.clone(), vis=P.root.visible;
    const KK=['hipL','hipR','kneeL','kneeR','shL','shR','elL','elR','head']; const save=KK.map(k=>P[k].rotation.clone()), bp=P.body.position.clone(), br=P.body.rotation.clone();
    const S2=new T.Scene(); S2.add(new T.HemisphereLight('#ffffff','#9a8a7a',0.95)); const dl=new T.DirectionalLight('#fff4e0',0.8); dl.position.set(10,16,22); S2.add(dl);
    S2.add(P.root); resetP(P); P.root.position.set(0,0,0); P.root.rotation.set(0,o.ry||0,0); P.root.scale.setScalar(o.scale||1); P.root.visible=true;
    for(const k in (o.pose||{})){ const q=k.split('.'); P[q[0]].rotation[q[1]]=o.pose[k]; }
    if(P.cassock&&o.sit){ P.cassock.scale.y=0.42; P.cassock.position.y=4.25; }
    const hid=[]; if(o.legsOnly){ P.body.children.forEach(c=>{ if(c!==P.hipL&&c!==P.hipR&&c.visible){ c.visible=false; hid.push(c); } }); }
    const W=o.w||700, H=o.h||1200, u=o.upp||0.01, fo=o.foot||150;
    const cam=new T.OrthographicCamera(-W/2*u,W/2*u,(H-fo)*u,-fo*u,0.1,300); cam.position.set(0,0,80); cam.lookAt(0,0,0);
    renderer.setSize(W,H,false); renderer.setClearColor(0x000000,0); renderer.render(S2,cam); const url=renderer.domElement.toDataURL('image/png');
    hid.forEach(c=>c.visible=true); if(P.cassock){ P.cassock.scale.y=1; P.cassock.position.y=2.98; }
    par.add(P.root); P.root.position.copy(pos); P.root.rotation.copy(rot); P.root.scale.copy(scl); P.root.visible=vis; KK.forEach((k,i)=>P[k].rotation.copy(save[i])); P.body.position.copy(bp); P.body.rotation.copy(br);
    setRenderSize(1920); return url; }"""
PVAR = {'erato': 'erato', 'roemer': 'roemer', 'arist': 'arist', 'picard': 'picard'}
def portrait_code(name):
    return ',\n  ' + PORTRAIT.replace('__VAR__', PVAR[name])

def film(name, code):
    code = body(code)
    cut = code.index("const capC=document.createElement('canvas')") if "const capC=document.createElement('canvas')" in code else code.index('//@@TAIL@@')
    return PROLOGUE % name + code[:cut] + FILM_EPI.replace('__SD__', SD[name]).replace('__PORTRAIT__', portrait_code(name)) + '\n};\n'

def stepstory(name, code):
    code = body(code)
    code = code.replace("let LANG='fr';\n", '', 1)
    for marker in ('let cur=0, lt=0', '//@@END@@'):
        if marker in code: code = code[:code.index(marker)]; break
    else: raise SystemExit('no end marker in ' + name)
    return PROLOGUE % name + code + STEP_EPI.replace('__PORTRAIT__', portrait_code(name)) + '\n};\n'

arist = fill((src / 'arist_main.js').read_text())
arist = arist.replace("const h=lines.length*58+44, y0=975-h;", "const h=lines.length*58+44, y0=1046-h;")
stories = [film('erato', E), film('roemer', fill((src / 'roemer_main.js').read_text())), stepstory('arist', arist)]
if (src / 'picard_main.js').exists(): stories.append(stepstory('picard', fill((src / 'picard_main.js').read_text())))

app = 'const STORIES={};\n' + '\n'.join(stories) + '\n' + (src / 'shell.js').read_text()
assets = d / 'assets'
def thumb(n):
    p = assets / f'thumb_{n}.jpg'
    return 'data:image/jpeg;base64,' + base64.b64encode(p.read_bytes()).decode() if p.exists() else 'data:,'
for n in ['arist', 'erato', 'picard', 'roemer']:
    for lg in ['fr', 'en']: app = app.replace(f'__TH_{n}_{lg}__', thumb(f'{n}_{lg}'))
hj = assets / 'hero.json'
app = app.replace('__HEROJSON__', hj.read_text() if hj.exists() else '{"heads":[0.5,0.35,0.2,0.06]}')
mins = assets / 'minutes.json'
if mins.exists():
    m = json.loads(mins.read_text())
    app = app.replace("MINUTES={arist:2.2,erato:1.8,picard:2.6,roemer:2.8}", 'MINUTES=' + json.dumps(m))
hero = assets / 'hero.png'
hero_uri = 'data:image/png;base64,' + base64.b64encode(hero.read_bytes()).decode() if hero.exists() else 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

fonts = 'node_modules/@fontsource/fredoka/files/fredoka-latin-{}-normal.woff2'
html = (src / 'template.html').read_text()
audios = '\n'.join(f'<audio id="mu_{n}" loop preload="auto" src="data:audio/mpeg;base64,{b64('assets/' + n + '_music.mp3')}"></audio>' for n in ['arist', 'erato', 'picard', 'roemer'] if (assets / (n + '_music.mp3')).exists())
html = (html.replace('__F500__', b64(fonts.format(500))).replace('__F600__', b64(fonts.format(600))).replace('__F700__', b64(fonts.format(700)))
            .replace('__HERO__', hero_uri).replace('__AUDIOS__', audios))
three = (d / 'node_modules/three/build/three.min.js').read_text()
html = html.replace('<script>__THREE__</script>', '<script>' + three.replace('</script', '<\\/script') + '</script>', 1)
html = html.replace('<script>__APP__</script>', '<script>' + app.replace('</script', '<\\/script') + '</script>', 1)
(d / 'index.html').write_text(html)
print('built', round(len(html) / 1024), 'KB')
