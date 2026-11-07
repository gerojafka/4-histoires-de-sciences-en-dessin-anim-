/* ====================================================================== */
/*  Shell: home page + step-by-step player shared by the four stories      */
/* ====================================================================== */
(() => {
'use strict';
const T=THREE, $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const CAPTURE=!!window.__CAPTURE;
const glc=$('gl'), uic=$('ui');
const renderer=new T.WebGLRenderer({canvas:glc,antialias:true,preserveDrawingBuffer:CAPTURE,alpha:CAPTURE});
renderer.useLegacyLights=true; renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.setPixelRatio(1);
const env={gl:glc,ui:uic,renderer};
const inst={}; const story=id=>{ if(!inst[id]) inst[id]=STORIES[id](env); return inst[id]; };

let LANG='fr'; try{ const s=localStorage.getItem('savants_lang'); if(s==='fr'||s==='en') LANG=s; }catch(e){}
const L=o=>o[LANG];

/* ---------------------------------------------------------------- texts */
const META=[
  {id:'arist', name:{fr:'Aristarque de Samos',en:'Aristarchus of Samos'}, date:{fr:'vers 270 av. J.-C.',en:'c. 270 BC'},
   q:{fr:'Quelle est la taille de la Lune ?',en:'How big is the Moon?'}, thumb:{fr:'__TH_arist_fr__',en:'__TH_arist_en__'}},
  {id:'erato', name:{fr:'Ératosthène',en:'Eratosthenes'}, date:{fr:'vers 240 av. J.-C.',en:'c. 240 BC'},
   q:{fr:'Quel est le tour de la Terre ?',en:'How big around is the Earth?'}, thumb:{fr:'__TH_erato_fr__',en:'__TH_erato_en__'}},
  {id:'picard', name:{fr:'Jean Picard',en:'Jean Picard'}, date:{fr:'1669-1670',en:'1669–1670'},
   q:{fr:'Quel est le rayon exact de la Terre ?',en:'What exactly is the Earth\'s radius?'}, thumb:{fr:'__TH_picard_fr__',en:'__TH_picard_en__'}},
  {id:'roemer', name:{fr:'Ole Rømer',en:'Ole Rømer'}, date:{fr:'1676',en:'1676'},
   q:{fr:'La lumière a-t-elle une vitesse ?',en:'Does light have a speed?'}, thumb:{fr:'__TH_roemer_fr__',en:'__TH_roemer_en__'}},
];
const HERO=__HEROJSON__;
const STEPS_N={arist:7,erato:6,picard:9,roemer:8}, MINUTES={arist:2.2,erato:1.8,picard:2.6,roemer:2.8};
const HOME={
  fr:{kicker:'4 histoires de sciences en dessin animé',
      title:'Nos savants sont des nains sur des <em>épaules de géants</em>',
      quote:'« Nous sommes comme des nains assis sur des épaules de géants : nous voyons plus loin qu\'eux, non parce que notre vue est plus perçante, mais parce qu\'ils nous portent. »<small>Bernard de Chartres, XIIe siècle, idée reprise par Isaac Newton</small>',
      intro:'Quatre savants, quatre grandes questions. Chacun a pu voir plus loin grâce à ceux d\'avant. Choisissez une histoire : elle avance pas à pas, à votre rythme.',
      chain:'Les mesures d\'<b>Aristarque</b> prennent tout leur sens quand <b>Ératosthène</b> mesure la Terre. Dix-neuf siècles plus tard, <b>Jean Picard</b> la mesure à nouveau, bien plus précisément, puis ramène du Danemark un jeune astronome : <b>Ole Rømer</b>, qui mesurera la vitesse de la lumière. Et <b>Isaac Newton</b> se servira du rayon de Picard pour vérifier sa loi de la gravitation.',
      help:['<kbd>Suivant ▶</kbd> étape suivante','<kbd>Pas à pas</kbd> ou <kbd>Continu</kbd>','<kbd>Vitesse</kbd> 1× · 0,75× · 0,5×','Clavier : <kbd>→</kbd> <kbd>←</kbd> <kbd>espace</kbd>'],
      steps:'étapes', min:'min', watch:'Regarder', more:'Qui s\'appuie sur qui ? ›', mTitle:'Chacun sur les épaules du précédent', close:'Fermer',
      tl:[['vers 270 av. J.-C.','<b>Aristarque</b> : la Lune mesure environ un tiers de la Terre.'],['vers 240 av. J.-C.','<b>Ératosthène</b> : le tour de la Terre, environ 39 400 km.'],['1669-1670','<b>Jean Picard</b> : le rayon de la Terre, environ 6 372 km.'],['1676','<b>Ole Rømer</b> : la lumière a une vitesse.'],['1684','<b>Isaac Newton</b> : la gravitation, vérifiée grâce au rayon de Picard.']]},
  en:{kicker:'4 animated science stories',
      title:'Our scientists are dwarfs on the <em>shoulders of giants</em>',
      quote:'“We are like dwarfs sitting on the shoulders of giants: we see further than they do, not because our sight is sharper, but because they lift us up.”<small>Bernard of Chartres, 12th century, an idea later taken up by Isaac Newton</small>',
      intro:'Four scientists, four big questions. Each one could see further thanks to those before. Pick a story: it moves step by step, at your own pace.',
      chain:'<b>Aristarchus</b>\'s measurements take on their full meaning once <b>Eratosthenes</b> measures the Earth. Nineteen centuries later, <b>Jean Picard</b> measures it again, far more precisely, then brings a young astronomer back from Denmark: <b>Ole Rømer</b>, who will measure the speed of light. And <b>Isaac Newton</b> will use Picard\'s radius to check his law of gravitation.',
      help:['<kbd>Next ▶</kbd> next step','<kbd>Step by step</kbd> or <kbd>Continuous</kbd>','<kbd>Speed</kbd> 1× · 0.75× · 0.5×','Keyboard: <kbd>→</kbd> <kbd>←</kbd> <kbd>space</kbd>'],
      steps:'steps', min:'min', watch:'Watch', more:'Who builds on whom? ›', mTitle:'Each on the shoulders of the one before', close:'Close',
      tl:[['c. 270 BC','<b>Aristarchus</b>: the Moon is about one third the size of the Earth.'],['c. 240 BC','<b>Eratosthenes</b>: around the Earth, about 39,400 km.'],['1669–1670','<b>Jean Picard</b>: the Earth\'s radius, about 6,372 km.'],['1676','<b>Ole Rømer</b>: light has a speed.'],['1684','<b>Isaac Newton</b>: gravity, checked using Picard\'s radius.']]}
};
const UI={fr:{home:'Accueil',prevShort:'Précédent',prev:'Étape précédente',next:'Suivant',replay:'Rejouer l\'étape',play:'Lecture',pause:'Pause',mode_step:'Pas à pas',mode_auto:'Continu',
              modeTip:'Pas à pas : l\'animation attend « Suivant » à la fin de chaque étape. Continu : elle enchaîne toute seule.',speed:'Vitesse',speedTip:'Ralentir l\'animation',sound:'Musique',step:'Étape',rot:'Tournez le téléphone pour un plus grand écran',loading:'Chargement…'},
          en:{home:'Home',prevShort:'Previous',prev:'Previous step',next:'Next',replay:'Replay step',play:'Play',pause:'Pause',mode_step:'Step by step',mode_auto:'Continuous',
              modeTip:'Step by step: waits for “Next” at the end of each step. Continuous: plays straight through.',speed:'Speed',speedTip:'Slow the animation down',sound:'Music',step:'Step',rot:'Turn your phone sideways for a bigger picture',loading:'Loading…'}};
const SV=d=>`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${d}</svg>`;
const ICON={home:SV('<path d="M12 3l9 8h-2.5v9h-5v-6h-3v6h-5v-9H3z"/>'), prev:SV('<path d="M6 5h2.5v14H6zM20 5v14L9.5 12z"/>'), play:SV('<path d="M7 4.5l13 7.5-13 7.5z"/>'), pause:SV('<path d="M6 4.5h4.3v15H6zM13.7 4.5H18v15h-4.3z"/>'),
  replay:SV('<path d="M12 4a8 8 0 1 1-7.4 5h2.3A6 6 0 1 0 12 6v3L7.5 5 12 1z"/>'),
  snd:SV('<path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15 8.5a5 5 0 0 1 0 7M17.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'),
  mute:SV('<path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 9l5 6M20.5 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>')};

/* ---------------------------------------------------------------- home */
function drawSky(){ const c=$('sky'), w=c.clientWidth, h=c.clientHeight; if(!w) return; c.width=w; c.height=h; const x=c.getContext('2d');
  let a=1234567; const rnd=()=>{ a=(a*16807)%2147483647; return a/2147483647; };
  for(let i=0;i<Math.round(w*h/2600);i++){ const r=rnd()*1.4+0.3; x.globalAlpha=0.25+rnd()*0.75; x.fillStyle=rnd()<0.12?'#ffe9b0':'#ffffff'; x.beginPath(); x.arc(rnd()*w,rnd()*h,r,0,Math.PI*2); x.fill(); } }
function buildHome(){ const H=HOME[LANG]; document.documentElement.lang=LANG; document.title=LANG==='fr'?'Nos savants sont des nains sur des épaules de géants':'Our scientists are dwarfs on the shoulders of giants';
  $('kicker').textContent=H.kicker; $('hTitle').innerHTML=H.title; $('hQuote').innerHTML=H.quote; $('hIntro').textContent=H.intro; $('hChain').innerHTML=H.chain;
  $('btnMore').textContent=H.more; $('mTitle').textContent=H.mTitle; $('btnMoreClose').title=H.close; $('btnMoreClose').setAttribute('aria-label',H.close);
  $('mList').innerHTML=H.tl.map(([d,s])=>`<li><span class="d">${d}</span><span>${s}</span></li>`).join('');
  $('cards').innerHTML=META.map(m=>`<button class="card" data-id="${m.id}"><div class="thumb" style="background-image:url('${L(m.thumb)}')"><span class="date">${L(m.date)}</span><span class="play">${ICON.play}</span></div>
    <div class="cbody"><div class="cname">${L(m.name)}</div><div class="cq">${L(m.q)}</div><div class="cmeta"><span>${STEPS_N[m.id]} ${H.steps}</span><span>≈ ${Math.round(MINUTES[m.id]*2)/2} ${H.min}</span></div></div></button>`).join('');
  document.querySelectorAll('.card').forEach(b=>b.onclick=()=>openStory(b.dataset.id));
  const HN=[{fr:'Aristarque',en:'Aristarchus'},{fr:'Ératosthène',en:'Eratosthenes'},{fr:'Jean Picard',en:'Jean Picard'},{fr:'Ole Rømer',en:'Ole Rømer'}];
  HN.forEach((n,i)=>{ const e=$('hl'+i); e.textContent=L(n); e.style.top=(HERO.heads[i]*100)+'%'; });
  document.querySelectorAll('.langsw button').forEach(b=>b.classList.toggle('on',b.dataset.l===LANG));
}
$('btnMore').onclick=()=>{ $('moreBox').hidden=false; $('btnMoreClose').focus(); };
$('btnMoreClose').onclick=()=>{ $('moreBox').hidden=true; };
$('moreBox').onclick=e=>{ if(e.target===$('moreBox')) $('moreBox').hidden=true; };
document.querySelectorAll('.langsw button').forEach(b=>b.onclick=()=>{ LANG=b.dataset.l; try{ localStorage.setItem('savants_lang',LANG); }catch(e){} buildHome(); });

/* ---------------------------------------------------------------- player */
let sid=null, S=null, cur=0, lt=0, playing=false, mode='step', speed=1, holdT=0, gclock=0, last=performance.now();
let actx=null; const music=()=>sid?$('mu_'+sid):null;
function chime(){ if(!actx||$('btnSound').dataset.on==='0') return; try{ const o=actx.createOscillator(), g=actx.createGain(); o.type='sine'; o.frequency.setValueAtTime(880,actx.currentTime); o.frequency.exponentialRampToValueAtTime(1320,actx.currentTime+0.12); g.gain.setValueAtTime(0.0001,actx.currentTime); g.gain.exponentialRampToValueAtTime(0.12,actx.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.0001,actx.currentTime+0.9); o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime+1); }catch(e){} }
function layout(){ const vw=innerWidth, vh=innerHeight; const portrait=vh>vw&&vw<=820;
  let w=vw-(vw>700?24:0); const bf=clamp(Math.round(Math.min(w,(vh-60)*16/9)/78),11,17); const barH=Math.round(bf*2.9); const extra=portrait?44:0;
  let h=w*9/16; if(h>vh-barH-extra-(vh>500?20:0)){ h=vh-barH-extra-(vh>500?20:0); w=h*16/9; }
  const st=$('stage'); st.style.width=w+'px'; st.style.height=h+'px'; const bar=$('bar'); bar.style.width=w+'px'; bar.style.height=barH+'px'; bar.style.setProperty('--bf',bf+'px');
  $('stepTitle').style.display=w<760?'none':'';
  if(S) S.setSize(clamp(Math.round(w*Math.min(devicePixelRatio||1,2)),480,1920)); }
function refreshUI(){ const u=UI[LANG];
  $('btnHome').innerHTML=ICON.home; $('btnHome').title=u.home; $('btnReplay').innerHTML=ICON.replay; $('btnReplay').title=u.replay;
  $('btnPlay').innerHTML=playing?ICON.pause:ICON.play; $('btnPlay').title=playing?u.pause:u.play; const last=S&&cur===S.steps.length-1; $('barL').innerHTML=SV('<path d="M15.5 4l2 2-6 6 6 6-2 2-8-8z"/>'); $('barR').innerHTML=SV('<path d="M8.5 4l-2 2 6 6-6 6 2 2 8-8z"/>'); $('barL').title=u.prev; $('barR').title=u.next; $('barL').classList.toggle('off',!S||cur===0); $('barR').classList.toggle('off',!S||last);
  $('btnMode').textContent=mode==='step'?u.mode_step:u.mode_auto; $('btnMode').title=u.modeTip;
  $('btnSpeed').textContent=`${u.speed} ${speed===1?'1':speed===0.75?(LANG==='fr'?'0,75':'0.75'):(LANG==='fr'?'0,5':'0.5')}×`; $('btnSpeed').title=u.speedTip;
  $('btnSound').innerHTML=$('btnSound').dataset.on==='0'?ICON.mute:ICON.snd; $('btnSound').title=u.sound; $('rot').textContent='⟳ '+u.rot;
  $('sideL').innerHTML=SV('<path d="M15.5 4l2 2-6 6 6 6-2 2-8-8z"/>'); $('sideR').innerHTML=SV('<path d="M8.5 4l-2 2 6 6-6 6 2 2 8-8z"/>');
  $('sideL').title=u.prev; $('sideR').title=u.next; $('sideL').hidden=!S||cur===0; $('sideR').hidden=!S||cur===S.steps.length-1;
  if(S){ $('stepTitle').textContent=`${u.step} ${cur+1}/${S.steps.length} · ${L(S.steps[cur].title)}`;
    document.querySelectorAll('.dot').forEach((d,i)=>{ d.className='dot'+(i<cur?' done':'')+(i===cur?' on':''); d.title=`${u.step} ${i+1} · ${L(S.steps[i].title)}`; }); } }
function setPulse(on){ $('barR').classList.toggle('pulse',on); $('sideR').classList.toggle('pulse',on); }
function go(i){ if(!S) return; cur=clamp(i,0,S.steps.length-1); lt=0; holdT=0; playing=true; setPulse(false); refreshUI(); }
function next(){ if(!S) return; if(cur<S.steps.length-1) go(cur+1); else { lt=S.steps[cur].dur; playing=false; refreshUI(); } }
function openStory(id){
  $('home').classList.add('hide'); sid=id; S=null; $('dots').innerHTML=''; $('stepTitle').textContent=UI[LANG].loading;
  try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  document.querySelectorAll('audio').forEach(a=>{ a.pause(); });
  const m=music(); if(m){ try{ m.currentTime=0; m.volume=0.5; m.muted=$('btnSound').dataset.on==='0'; const p=m.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} }
  const ctx=uic.getContext('2d'); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,uic.width,uic.height);
  setTimeout(()=>{ S=story(id); $('dots').innerHTML=S.steps.map((_,i)=>`<button class="dot" data-i="${i}"></button>`).join(''); document.querySelectorAll('.dot').forEach(d=>d.onclick=()=>go(+d.dataset.i)); layout(); go(0); },30);
}
function goHome(){ playing=false; S=null; sid=null; document.querySelectorAll('audio').forEach(a=>a.pause()); $('home').classList.remove('hide'); buildHome(); drawSky(); }
$('btnHome').onclick=goHome; $('sideL').onclick=()=>go(cur-1); $('sideR').onclick=()=>{ if(S&&cur<S.steps.length-1) next(); }; $('barL').onclick=()=>go(cur-1); $('barR').onclick=()=>{ if(S&&cur<S.steps.length-1) next(); }; $('btnReplay').onclick=()=>go(cur);
$('btnPlay').onclick=()=>{ if(!S) return; if(lt>=S.steps[cur].dur){ next(); return; } playing=!playing; refreshUI(); };
$('btnMode').onclick=()=>{ mode=mode==='step'?'auto':'step'; if(mode==='auto') setPulse(false); else if(S&&lt>=S.steps[cur].dur&&cur<S.steps.length-1) setPulse(true); refreshUI(); };
$('btnSpeed').onclick=()=>{ speed=speed===1?0.75:speed===0.75?0.5:1; refreshUI(); };
$('btnSound').onclick=()=>{ const on=$('btnSound').dataset.on!=='0'; $('btnSound').dataset.on=on?'0':'1'; const m=music(); if(m){ m.muted=on; if(!on&&m.paused){ const p=m.play(); if(p&&p.catch) p.catch(()=>{}); } } refreshUI(); };
addEventListener('keydown',e=>{ if(e.key==='Escape'&&!$('moreBox').hidden){ $('moreBox').hidden=true; return; } if(!S) return; if(e.key==='ArrowRight'){ if(cur<S.steps.length-1) next(); } else if(e.key==='ArrowLeft') go(cur-1); else if(e.key===' '){ e.preventDefault(); $('btnPlay').click(); } else if(e.key==='Escape') goHome(); });
addEventListener('resize',()=>{ layout(); if(!$('home').classList.contains('hide')) drawSky(); });
function loop(now){ const dt=Math.min(0.1,(now-last)/1000); last=now; gclock+=dt;
  if(S){ const d=S.steps[cur].dur;
    if(playing){ lt=Math.min(d,lt+dt*speed); if(lt>=d){ playing=false; holdT=0; chime(); if(mode==='step'&&cur<S.steps.length-1) setPulse(true); refreshUI(); } }
    else if(lt>=d&&mode==='auto'){ holdT+=dt; if(holdT>2.6&&cur<S.steps.length-1) next(); }
    S.draw(cur,lt,gclock,LANG); }
  requestAnimationFrame(loop); }

/* ---------------------------------------------------------------- capture API (stills) */
const capC=document.createElement('canvas'); capC.width=1920; capC.height=1080; const capX=capC.getContext('2d');
window.APP={ fonts:document.fonts?Promise.all([document.fonts.load('700 100px Fredoka'),document.fonts.load('600 60px Fredoka'),document.fonts.load('500 60px Fredoka')]):Promise.resolve(),
  steps(id){ return story(id).steps.map(s=>s.dur); },
  frame(id,i,t,lang,q,nocap){ const s=story(id); s.setSize(1920); s.draw(i,t,t,lang||LANG,nocap); capX.clearRect(0,0,1920,1080); capX.drawImage(glc,0,0,1920,1080); capX.drawImage(uic,0,0,1920,1080); return capC.toDataURL('image/jpeg',q||0.9); },
  portrait(id,o){ return story(id).portrait?story(id).portrait(o||{}):null; },
  open:openStory, home:goHome, state:()=>({sid,cur,lt,playing,mode,speed}), seek:(i,t)=>{ go(i); lt=t; } };
if(CAPTURE){ $('home').classList.add('hide'); layout(); return; }
buildHome(); refreshUI(); APP.fonts.then(()=>{ drawSky(); }); drawSky(); layout(); requestAnimationFrame(loop);
})();
