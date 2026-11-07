(() => {
'use strict';
const T = THREE;
const LW = 1920, LH = 1080;
/* scene boundaries (seconds) */
const S = { intro:0, lib:6, syene:14, alex:22, walk:33, globeWalk:36.6, geo:44, result:53, end:61 };
const DURATION = 66;
const CUTS = [S.lib, S.syene, S.alex, S.walk, S.globeWalk, S.geo, S.result, S.end];
const CAPTURE = !!window.__CAPTURE;

/* ---------- helpers ---------- */
function rngf(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const R = rngf(240);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), lerp=(a,b,u)=>a+(b-a)*u, seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const smooth=u=>{u=clamp(u,0,1);return u*u*(3-2*u);};
const easeOut=u=>{u=clamp(u,0,1);return 1-Math.pow(1-u,3);};
const easeInOut=u=>{u=clamp(u,0,1);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;};
const backOut=u=>{u=clamp(u,0,1);const c1=1.7,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2);};
const hash=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const V=(x,y,z)=>new T.Vector3(x,y,z), D2R=Math.PI/180;

/* ---------- renderer ---------- */
const glc=document.getElementById('gl'), ui=document.getElementById('ui'), ctx=ui.getContext('2d');
const renderer=new T.WebGLRenderer({canvas:glc,antialias:true,preserveDrawingBuffer:CAPTURE});
renderer.useLegacyLights=true; renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.setPixelRatio(1);
let SCL=1;
function setRenderSize(w){ const W=Math.round(w), H=Math.round(w*9/16); SCL=W/LW; renderer.setSize(W,H,false); ui.width=W; ui.height=H; }

/* ---------- caches ---------- */
const _m=new Map(), _g=new Map();
const lam=c=>{const k='L'+c; if(!_m.has(k)) _m.set(k,new T.MeshLambertMaterial({color:c})); return _m.get(k);};
const bas=c=>{const k='B'+c; if(!_m.has(k)) _m.set(k,new T.MeshBasicMaterial({color:c})); return _m.get(k);};
const G=(k,f)=>{ if(!_g.has(k)) _g.set(k,f()); return _g.get(k); };
const sph=(r,s)=>G('s'+r+'_'+(s||32),()=>new T.SphereGeometry(r,s||32,Math.max(8,(s||32)>>1)));
const cap=(r,l)=>G('c'+r+'_'+l,()=>new T.CapsuleGeometry(r,l,6,16));
const cyl=(a,b,h,s)=>G('y'+a+'_'+b+'_'+h+'_'+(s||24),()=>new T.CylinderGeometry(a,b,h,s||24));
const bx=(w,h,d)=>G('b'+w+'_'+h+'_'+d,()=>new T.BoxGeometry(w,h,d));
function mesh(p,geo,mat,x,y,z,o){
  o=o||{}; const m=new T.Mesh(geo,typeof mat==='string'?(o.basic?bas(mat):lam(mat)):mat);
  m.position.set(x||0,y||0,z||0); m.castShadow=o.cast!==false; m.receiveShadow=o.recv!==false;
  if(o.s) m.scale.set(o.s[0],o.s[1],o.s[2]); if(o.rx) m.rotation.x=o.rx; if(o.ry) m.rotation.y=o.ry; if(o.rz) m.rotation.z=o.rz;
  p.add(m); return m;
}
function grp(p,x,y,z){const g=new T.Group(); g.position.set(x||0,y||0,z||0); if(p) p.add(g); return g;}
function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=4; return t; }
const gradTex=stops=>canvasTex(4,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h); stops.forEach(([o,c])=>gr.addColorStop(o,c)); g.fillStyle=gr; g.fillRect(0,0,w,h);});
function glowSprite(color,size){
  const t=canvasTex(128,128,(g)=>{const gr=g.createRadialGradient(64,64,0,64,64,64); gr.addColorStop(0,color); gr.addColorStop(0.35,color.replace('1)','0.45)')); gr.addColorStop(1,color.replace('1)','0)')); g.fillStyle=gr; g.fillRect(0,0,128,128);});
  const s=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,depthWrite:false,blending:T.AdditiveBlending})); s.scale.set(size,size,1); return s;
}
function addLights(sc,dir,int,shadow,bounds){
  sc.add(new T.HemisphereLight('#ffffff','#b8a07a',0.72));
  const L=new T.DirectionalLight('#fff4e0',int); L.position.copy(dir); sc.add(L); sc.add(L.target);
  if(shadow){ L.castShadow=true; L.shadow.mapSize.set(2048,2048); const b=bounds||14; Object.assign(L.shadow.camera,{left:-b,right:b,top:b,bottom:-b,near:1,far:200}); L.shadow.bias=-0.0005; L.shadow.normalBias=0.02; }
  return L;
}

/* ====================================================================== */
/*  Characters - smooth "mannequin" style (big round head, long thin limbs) */
/* ====================================================================== */
function person(o){
  const root=new T.Group(), body=grp(root,0,0,0), P={root,body,o};
  for(const s of [-1,1]){
    const hip=grp(body,s*0.3,4.1,0);
    mesh(hip,cap(0.17,1.7),o.thigh||o.legs,0,-1.0,0);
    const knee=grp(hip,0,-2.0,0);
    mesh(knee,cap(0.15,1.55),o.legs,0,-0.92,0);
    const foot=grp(knee,0,-1.85,0);
    mesh(foot,sph(0.24,20),o.shoes,0,0.02,0.14,{s:[1,0.6,1.65]});
    if(o.sole) mesh(foot,cyl(0.22,0.22,0.07,20),o.sole,0,-0.1,0.14,{s:[1,1,1.7]});
    P[s<0?'hipL':'hipR']=hip; P[s<0?'kneeL':'kneeR']=knee;
  }
  mesh(body,cap(0.5,1.45),o.top,0,5.0,0,{s:[1.06,1,0.74]});
  if(o.tunic){ mesh(body,cyl(0.5,0.82,1.55,28),o.top,0,3.85,0); if(o.trim) mesh(body,cyl(0.83,0.83,0.12,28),o.trim,0,3.1,0); }
  if(o.sash) mesh(body,bx(0.26,2.1,0.12),o.sash,0.05,5.0,0.38,{rz:0.55});
  for(const s of [-1,1]){
    const sh=grp(body,s*0.64,5.82,0);
    mesh(sh,cap(0.13,1.1),o.sleeve||o.top,0,-0.6,0);
    const el=grp(sh,0,-1.22,0);
    mesh(el,cap(0.12,0.95),o.forearm||o.sleeve||o.top,0,-0.52,0);
    mesh(el,sph(0.16,16),o.skin,0,-1.1,0);
    P[s<0?'shL':'shR']=sh; P[s<0?'elL':'elR']=el;
  }
  mesh(body,cyl(0.15,0.17,0.45,16),o.skin,0,6.12,0);
  const head=grp(body,0,6.28,0); P.head=head;
  mesh(head,sph(0.78,40),o.skin,0,0.75,0,{s:[0.97,1.06,0.97]});
  mesh(head,sph(0.11,16),o.skin,0,0.66,0.78);
  for(const s of [-1,1]){ mesh(head,sph(0.07,12),'#2a211d',s*0.26,0.86,0.68,{cast:false}); mesh(head,sph(0.13,12),o.skin,s*0.76,0.74,0,{s:[0.55,1,0.8]}); }
  mesh(head,sph(0.08,12),'#a4524f',0,0.43,0.71,{s:[1.7,0.55,0.6],cast:false});
  if(o.hair) mesh(head,sph(0.8,32),o.hair,0,0.6,-0.1,{s:[1.0,0.62,0.95]});
  if(o.beard){ mesh(head,sph(0.5,28),o.beard,0,0.28,0.3,{s:[1.15,0.95,0.8]}); mesh(head,sph(0.14,12),o.beard,0,0.5,0.74,{s:[2.0,0.6,0.7]}); }
  if(o.headband) mesh(head,G('tb',()=>new T.TorusGeometry(0.79,0.07,8,40)),o.headband,0,1.1,0,{rx:Math.PI/2+0.08});
  return P;
}
function resetP(P){ P.body.position.set(0,0,0); P.body.rotation.set(0,0,0); for(const k of ['hipL','hipR','kneeL','kneeR','shL','shR','elL','elR']) P[k].rotation.set(0,0,0); P.head.rotation.set(0,0,0); }
function walk(P,ph,amp){
  const s=Math.sin(ph);
  P.hipL.rotation.x=-s*amp; P.hipR.rotation.x=s*amp;
  P.kneeL.rotation.x=Math.max(0,Math.sin(ph+1.4))*amp*1.3; P.kneeR.rotation.x=Math.max(0,Math.sin(ph+Math.PI+1.4))*amp*1.3;
  P.shL.rotation.x=s*amp*0.75; P.shR.rotation.x=-s*amp*0.75; P.elL.rotation.x=-0.35; P.elR.rotation.x=-0.35;
  P.body.position.y=Math.abs(Math.cos(ph))*0.14;
}
function wave(P,side,t){ const sh=side>0?P.shR:P.shL, el=side>0?P.elR:P.elL; sh.rotation.z=side*2.5; el.rotation.z=side*(0.35+0.35*Math.sin(t*10)); }
const ERATO={skin:'#f1c7a0',top:'#f6f2ea',tunic:true,trim:'#3d6fb6',sash:'#3d6fb6',legs:'#f1c7a0',thigh:'#f1c7a0',shoes:'#7a5232',forearm:'#f1c7a0',hair:'#d9d6d0',beard:'#e2dfd9'};
const BEMA={skin:'#d9a77c',top:'#d8b27a',tunic:true,trim:'#8a5a32',sash:'#8a5a32',legs:'#d9a77c',thigh:'#d9a77c',shoes:'#6b4428',forearm:'#d9a77c',headband:'#b8473a',hair:'#3a2a20'};
const MESSENGER={skin:'#e8b88f',top:'#86b86b',tunic:true,trim:'#4f7f3a',legs:'#e8b88f',thigh:'#e8b88f',shoes:'#6b4428',forearm:'#e8b88f',hair:'#4a3020'};
const KID={skin:'#c98e62',top:'#9cc9e8',tunic:true,trim:'#3d7fb6',legs:'#c98e62',thigh:'#c98e62',shoes:'#6b4428',forearm:'#c98e62',hair:'#2a1c14'};

/* ====================================================================== */
/*  World map texture + globe                                              */
/* ====================================================================== */
const AFRICA=[[-17,14.7],[-16,19],[-17,21],[-13,27.5],[-9.8,30],[-6,35.8],[0,35.8],[3,36.8],[10,37.3],[11,33],[15,32.3],[20,30.5],[20,32.5],[25,31.8],[29.9,31.2],[32.3,31.3],[32.6,29.9],[34,27],[35.5,24],[37.2,21],[38.5,18],[39.5,15.5],[42.7,13],[43.3,11.6],[45,10.5],[51.2,11.8],[49,6],[46,2],[42,-1.5],[40,-3.5],[39.2,-6.8],[40.5,-10.5],[40.5,-15],[35.5,-22],[32.6,-26],[31,-29.5],[27.9,-33],[25.6,-34],[20,-34.8],[18.4,-34],[17.5,-30],[15,-26],[14.5,-22.9],[11.8,-17],[13.5,-12],[12.2,-6],[9.8,2],[9.5,4],[8.5,4.5],[6,4.3],[3,6.4],[0,5.6],[-4,5.2],[-7.5,4.4],[-10.8,6.5],[-13.2,8.5],[-15,11],[-16.8,12.5]];
const EURASIA=[[32.3,31.3],[32.6,29.9],[33.6,28.0],[34.3,27.8],[34.9,29.5],[35.2,28],[36.5,26],[38,24],[39.2,21.5],[40.5,19],[42,16.5],[42.8,14],[43.4,12.7],[45,12.8],[48.7,14],[52,15.6],[55,17.2],[57,18.9],[58.5,20.5],[59.8,22.5],[58.5,23.6],[56.4,24.6],[56.3,26.3],[57,27.2],[61,25.2],[67,24.8],[68.5,23.5],[72.8,21],[73.5,16],[76,9],[77.5,8.1],[79.9,10.3],[80.3,13],[82,17],[87,21.5],[91,22],[94,16],[98,16],[99,10],[100.5,13.5],[105,9],[106.8,10.5],[109,13],[108,21.6],[113.5,22.5],[121,28],[122,31],[121,37],[117.5,39],[122,40],[125,39.5],[129,35],[129.5,42],[135,43],[141,52],[142,59],[155,59],[160,61],[170,60],[180,65],[180,72],[140,72],[110,77],[80,73],[60,70],[45,68],[40,66],[30,70],[25,71],[18,69],[14,66],[12,64],[10,63],[5,61],[5,58.5],[8,58],[10.5,59],[12,56],[9,57],[8.5,55],[8,53.5],[4,51.5],[1.5,50.5],[-1.6,48.8],[-4.5,48],[-1.2,46],[-1.5,43.4],[-8,43.7],[-9,43],[-9.5,38.7],[-8.9,37],[-6,36.2],[-5.6,36],[-2,36.7],[0,38.8],[0.3,40.5],[3.2,42],[3,43.2],[5,43.3],[7.5,43.8],[9,44.4],[10.5,43],[12.3,41.7],[14.2,40.8],[15.7,40],[16,38],[16.6,38.8],[17.1,39.4],[16.5,40.4],[18.5,40.1],[17,41],[16,41.9],[13.6,43.5],[12.3,45.4],[13.7,45.6],[15,44.5],[17.5,43],[19.4,41.8],[19.5,40],[21,38.4],[21.5,36.8],[23,36.5],[23.8,38.2],[22.9,40.6],[24,40.9],[26,40.8],[26.5,40],[26.3,38.3],[28,36.7],[30,36.2],[32,36.6],[34,36.3],[36.2,36.6],[35.9,35.5],[35,33],[34.3,31.4]];
const LANDS=[AFRICA,EURASIA,
  [[-35,-5],[-39,-13],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-65,-41],[-68,-50],[-70,-53],[-75,-50],[-73,-40],[-71,-30],[-70,-18],[-76,-14],[-81,-5],[-80,1],[-77,8],[-72,12],[-62,10.5],[-52,5],[-50,0],[-44,-2.5]],
  [[-82,9],[-83,15],[-87,21],[-90,21],[-97,19],[-97,26],[-90,29.5],[-82,25],[-80,31],[-76,35],[-74,40.5],[-70,42],[-66,44.5],[-60,46],[-56,52],[-64,60],[-78,62],[-82,55],[-94,59],[-110,68],[-140,70],[-165,68],[-168,62],[-155,58],[-140,60],[-130,55],[-124,48],[-124,40],[-117,32.5],[-110,23],[-105,20],[-95,16],[-90,14],[-85,11]],
  [[-45,60],[-20,70],[-20,80],[-60,82],[-70,77],[-55,68]],
  [[114,-22],[114,-34],[117,-35],[129,-32],[135,-35],[140,-38],[150,-37.5],[153,-28],[146,-19],[142,-10.7],[141,-17],[136,-12],[130,-12],[123,-16.5]],
  [[-5.5,50],[1.4,51.2],[1.7,52.7],[0,53.5],[-1.5,55],[-2,57.5],[-3,58.6],[-5,58.6],[-6.2,56.5],[-5,55],[-3.3,54.5],[-3,53.4],[-4.5,52.8],[-5.2,51.7]],
  [[-6,52],[-6.2,54],[-7.5,55.2],[-10,54.2],[-10,51.6]],
  [[44,-25],[47,-25],[50.4,-15.5],[49.3,-12],[44,-16.5],[43.3,-22]],
  [[12.4,37.8],[15.6,38.3],[15.1,36.7]],[[23.5,35.3],[26.3,35.2],[26,35],[23.6,35.0]],[[32.3,35],[34.6,35.7],[33.9,34.6],[32.4,34.7]],
  [[8.2,41],[9.6,43],[9.8,41],[9.5,39],[8.4,39]],[[95,5],[105,-5],[106,-6],[96,4]],[[110,-7],[114,-8],[110,-8]],[[130,31],[140,35],[142,41],[140,36],[131,33]]];
const WATERS=[
  [[28,41.2],[29,44.5],[30.5,46.5],[33,46],[33.5,44.5],[36.5,45.3],[38,47],[39.5,47],[38,45],[41.5,42],[41.6,41.5],[38,41],[35,42],[31,41.2]],
  [[47,44.5],[49,46.5],[53,47],[54,44],[52.5,42],[53,40],[54,37.5],[50,37.2],[49,38.5],[49.5,40.5],[47.5,42]],
  [[47.9,30.0],[50.0,30.2],[51.5,27.9],[54.5,26.5],[56.3,27.1],[56.4,26.2],[54.0,24.3],[51.6,24.6],[51.5,25.9],[50.2,26.3],[48.7,28.0]]];
const NILE=[[-1,33],[2,32.3],[4.8,31.6],[9.5,30.6],[12,32.6],[15.6,32.5],[17.7,34.0],[19.5,33.3],[18.4,31.8],[19.2,30.5],[21.8,31.3],[22.5,31.6],[24.09,32.9],[25.0,32.85],[25.7,32.64],[26.16,32.73],[26.05,32.24],[26.56,31.69],[27.18,31.18],[28.1,30.75],[29.07,31.1],[30.04,31.24],[30.6,30.9],[31.0,30.4],[31.2,29.92]];
const WALKPATH=NILE.slice(12); // Syene -> Alexandria
const MAPW=4096, MAPH=2048;
const mx=lon=>(lon+180)/360*MAPW, my=lat=>(90-lat)/180*MAPH;
const worldTex=canvasTex(MAPW,MAPH,(g,w,h)=>{
  const og=g.createLinearGradient(0,0,0,h); og.addColorStop(0,'#2b6fb3'); og.addColorStop(0.5,'#3b8fd8'); og.addColorStop(1,'#2b6fb3'); g.fillStyle=og; g.fillRect(0,0,w,h);
  const poly=(pts)=>{ g.beginPath(); pts.forEach(([lo,la],i)=>i?g.lineTo(mx(lo),my(la)):g.moveTo(mx(lo),my(la))); g.closePath(); };
  g.save(); g.shadowColor='rgba(150,220,255,0.9)'; g.shadowBlur=14; g.fillStyle='#78b45a'; LANDS.forEach(p=>{poly(p); g.fill();}); g.restore();
  g.fillStyle='#78b45a'; LANDS.forEach(p=>{poly(p); g.fill();});
  // deserts (Sahara, Arabia, Kalahari, Australia) inside land
  g.save(); g.beginPath(); LANDS.forEach(p=>{ p.forEach(([lo,la],i)=>i?g.lineTo(mx(lo),my(la)):g.moveTo(mx(lo),my(la))); g.closePath(); }); g.clip();
  [[10,23,32,9],[42,23,14,8],[22,-23,8,6],[130,-25,14,7],[60,42,18,6]].forEach(([lo,la,rx,ry])=>{ const gr=g.createRadialGradient(mx(lo),my(la),0,mx(lo),my(la),mx(lo+rx)-mx(lo)); gr.addColorStop(0,'#ead095'); gr.addColorStop(0.75,'#e3c486'); gr.addColorStop(1,'rgba(227,196,134,0)'); g.fillStyle=gr; g.save(); g.translate(mx(lo),my(la)); g.scale(1,(my(la-ry)-my(la))/(mx(lo+rx)-mx(lo))); g.translate(-mx(lo),-my(la)); g.beginPath(); g.arc(mx(lo),my(la),mx(lo+rx)-mx(lo),0,Math.PI*2); g.fill(); g.restore(); });
  g.restore();
  g.fillStyle='#3b8fd8'; WATERS.forEach(p=>{poly(p); g.fill();});
  g.fillStyle='#f4f8fb'; g.fillRect(0,my(-70),w,h-my(-70)); g.fillRect(0,0,w,my(80));
  g.strokeStyle='rgba(255,255,255,0.18)'; g.lineWidth=2;
  for(let lo=-180;lo<=180;lo+=30){ g.beginPath(); g.moveTo(mx(lo),0); g.lineTo(mx(lo),h); g.stroke(); }
  for(let la=-60;la<=60;la+=30){ g.beginPath(); g.moveTo(0,my(la)); g.lineTo(w,my(la)); g.stroke(); }
  g.strokeStyle='#3b8fd8'; g.lineWidth=5; g.lineJoin='round'; g.beginPath(); NILE.forEach(([la,lo],i)=>i?g.lineTo(mx(lo),my(la)):g.moveTo(mx(lo),my(la))); g.stroke();
});
const GR=10;
function ll(lat,lon,r){ const la=lat*D2R, ph=(lon+180)*D2R, rr=r||GR; return V(-rr*Math.cos(ph)*Math.cos(la), rr*Math.sin(la), rr*Math.sin(ph)*Math.cos(la)); }
const globeMat=new T.MeshLambertMaterial({map:worldTex,transparent:true});
function makeGlobe(parent){
  const tilt=grp(parent,0,0,0), spin=grp(tilt,0,0,0);
  const g=mesh(spin,new T.SphereGeometry(GR,128,64),globeMat,0,0,0,{cast:false,recv:false});
  const nileCurve=new T.CatmullRomCurve3(WALKPATH.map(([la,lo])=>ll(la,lo,GR+0.012)));
  mesh(spin,new T.TubeGeometry(nileCurve,120,0.018,6,false),'#2f7fd0',0,0,0,{cast:false,recv:false});
  return {tilt,spin,globe:g};
}
function aimGlobe(Gb,lat,lon){ Gb.tilt.rotation.x=lat*D2R; Gb.spin.rotation.y=(270-lon)*D2R; }
function pin(parent,lat,lon,color){
  const p=grp(parent,0,0,0); const n=ll(lat,lon,1).normalize(); p.position.copy(n.clone().multiplyScalar(GR));
  p.quaternion.setFromUnitVectors(V(0,1,0),n);
  mesh(p,cyl(0.012,0.03,0.42,10),'#ececec',0,0.21,0,{cast:false}); mesh(p,sph(0.075,16),color,0,0.45,0,{cast:false});
  return p;
}

/* ====================================================================== */
/*  SCENE: space + globe (intro, bematists on the globe, result)            */
/* ====================================================================== */
const space=new T.Scene();
space.background=gradTex([[0,'#060a24'],[0.6,'#0f1a48'],[1,'#1b2260']]);
const scam=new T.PerspectiveCamera(40,LW/LH,0.1,2000);
space.add(new T.AmbientLight('#8fa0d8',0.45));
const sunL=new T.DirectionalLight('#fff6e6',1.05); sunL.position.set(-30,20,40); space.add(sunL);
(function stars(){ const n=1600,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const v=V(R()-0.5,R()-0.5,R()-0.5).normalize().multiplyScalar(500+R()*200); pos.set([v.x,v.y,v.z],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); space.add(new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2.2,sizeAttenuation:false}))); })();
const GB=makeGlobe(space);
const halo=glowSprite('rgba(120,190,255,1)',29); space.add(halo);
const pinA=pin(GB.spin,31.2,29.92,'#e63946'), pinS=pin(GB.spin,24.09,32.9,'#ffb703');
/* walkers on the globe */
const walkCurve=new T.CatmullRomCurve3(WALKPATH.map(([la,lo])=>ll(la,lo,GR)));
const gWalkers=[0,1,2].map(i=>{ const P=person(BEMA); P.root.scale.setScalar(0.05); GB.spin.add(P.root); return P; });
const stepDots=new T.InstancedMesh(sph(0.018,8),lam('#7a5a3a'),180); stepDots.count=0; GB.spin.add(stepDots);
/* measuring tape (meridian) & diameter rod */
const merPts=[]; for(let i=0;i<=240;i++){ const a=(31.2+i*1.5)*D2R; const e=ll(0,30.6,1).normalize(); merPts.push(e.clone().multiplyScalar(Math.cos(a)*(GR+0.1)).add(V(0,Math.sin(a)*(GR+0.1),0))); }
const tapeGeo=new T.TubeGeometry(new T.CatmullRomCurve3(merPts),360,0.09,8,false);
const tape=mesh(GB.spin,tapeGeo,bas('#ffc83d'),0,0,0,{cast:false}); tape.visible=false;
const rod=grp(space,0,0,0); mesh(rod,cyl(0.16,0.16,2*GR,24),bas('#e63946'),0,0,0,{rz:Math.PI/2,cast:false}); mesh(rod,sph(0.35,20),bas('#e63946'),-GR,0,0,{cast:false}); mesh(rod,sph(0.35,20),bas('#e63946'),GR,0,0,{cast:false}); rod.visible=false;
const coreBall=mesh(space,sph(0.55,20),bas('#ffb347'),0,0,0,{cast:false}); coreBall.visible=false;

/* ====================================================================== */
/*  SCENE: the Library of Alexandria (scene 2 and ending)                  */
/* ====================================================================== */
const lib=new T.Scene(); lib.background=new T.Color('#d9c8a8'); lib.fog=new T.Fog('#d9c8a8',40,90);
const libCam=new T.PerspectiveCamera(40,LW/LH,0.1,300);
addLights(lib,V(-12,22,16),0.75,true,16);
(function(){
  const floor=canvasTex(512,512,(g,w,h)=>{ for(let i=0;i<8;i++)for(let j=0;j<8;j++){ g.fillStyle=(i+j)%2?'#efe3cc':'#d9b98f'; g.fillRect(i*64,j*64,64,64);} });
  floor.wrapS=floor.wrapT=T.RepeatWrapping; floor.repeat.set(10,10);
  mesh(lib,new T.PlaneGeometry(80,80),new T.MeshLambertMaterial({map:floor}),0,0,0,{rx:-Math.PI/2,cast:false});
  mesh(lib,bx(60,20,1),'#eadcc2',0,10,-9,{cast:false});
  for(let c=-3;c<=3;c++){ const sx=c*4.2;
    mesh(lib,bx(3.6,9.4,1.6),'#8a5a3a',sx,4.7,-7.9);
    for(let r=0;r<4;r++) for(let k=0;k<4;k++){ const x=sx-1.2+k*0.8, y=1.2+r*2.2; mesh(lib,bx(0.7,1.9,0.2),'#5e3a24',x,y,-7.05,{cast:false});
      for(let s=0;s<3;s++) mesh(lib,cyl(0.13,0.13,0.6,12),hash(c*31+r*7+k*3+s)<0.5?'#f3e6c8':'#e9d5ad',x-0.2+s*0.2,y-0.6+s*0.45,-6.9,{rx:Math.PI/2}); } }
  for(const x of [-11,-5.5,5.5,11]){ mesh(lib,cyl(0.75,0.85,11,28),'#f4eee2',x,5.5,-2.5); mesh(lib,bx(2.1,0.5,2.1),'#ece2cf',x,11.2,-2.5); mesh(lib,bx(2.1,0.5,2.1),'#ece2cf',x,0.25,-2.5); }
  mesh(lib,bx(30,1.2,2.4),'#ece2cf',0,12.0,-2.5);
  const tb=grp(lib,1.8,0,0.6); mesh(tb,bx(5.2,0.3,2.4),'#9a6a45',0,3.3,0); for(const [x,z] of [[-2.3,-1],[2.3,-1],[-2.3,1],[2.3,1]]) mesh(tb,bx(0.25,3.3,0.25),'#7a4e30',x,1.65,z);
  for(let i=0;i<4;i++) mesh(tb,cyl(0.16,0.16,1.0,12),'#f3e6c8',-1.6+i*0.45,3.62,-0.5+(i%2)*0.3,{rz:Math.PI/2,ry:0.3*i});
  mesh(tb,G('lamp',()=>new T.SphereGeometry(0.35,20,12)),'#c98a3a',1.9,3.65,-0.4,{s:[1.4,0.6,1]});
})();
const libGlobe=grp(lib,3.6,3.45,0.4); mesh(libGlobe,cyl(0.12,0.4,0.2,20),'#7a4e30',0,0.1,0); mesh(libGlobe,cyl(0.05,0.05,0.7,10),'#7a4e30',0,0.45,0);
const libGlobeBall=mesh(libGlobe,new T.SphereGeometry(0.75,48,32),new T.MeshLambertMaterial({map:worldTex}),0,1.5,0); libGlobe.visible=false;
const erato=person(ERATO); lib.add(erato.root);
const messenger=person(MESSENGER); lib.add(messenger.root);
const scroll=grp(lib,0,0,0); mesh(scroll,cyl(0.14,0.14,0.9,14),'#f3e6c8',0,0,0,{rz:Math.PI/2}); const parch=mesh(scroll,bx(0.9,1.2,0.03),'#f6ead0',0,-0.62,0.02,{cast:false});
const endBema=person(BEMA); lib.add(endBema.root); const endKid=person(KID); endKid.root.scale.setScalar(0.78); lib.add(endKid.root);

/* ====================================================================== */
/*  SCENE: Syene - the well at noon on the summer solstice                 */
/* ====================================================================== */
const sy=new T.Scene(); sy.background=gradTex([[0,'#5aa8e8'],[0.6,'#a8d4f2'],[1,'#f3e2bf']]); sy.fog=new T.Fog('#efe0c0',60,160);
const syCam=new T.PerspectiveCamera(42,LW/LH,0.1,400);
addLights(sy,V(0.3,60,0.6),1.0,true,14);
const WR=1.25;
(function(){
  const shape=new T.Shape(); shape.moveTo(-90,-90); shape.lineTo(90,-90); shape.lineTo(90,90); shape.lineTo(-90,90); shape.closePath();
  const hole=new T.Path(); hole.absarc(0,0,WR,0,Math.PI*2,true); shape.holes.push(hole);
  mesh(sy,new T.ShapeGeometry(shape,64),'#e9d3a4',0,0,0,{rx:-Math.PI/2,cast:false});
  const prof=[V(WR,-6,0),V(WR,0.85,0),V(WR+0.45,0.85,0),V(WR+0.45,0,0)].map(v=>new T.Vector2(v.x,v.y));
  mesh(sy,new T.LatheGeometry(prof,56),new T.MeshLambertMaterial({color:'#c4a77c',side:T.DoubleSide}),0,0,0);
  for(let i=0;i<28;i++){ const a=i/28*Math.PI*2; mesh(sy,bx(0.32,0.2,0.46),hash(i)<0.5?'#b8996e':'#d1b58a',Math.cos(a)*(WR+0.22),0.9,Math.sin(a)*(WR+0.22),{ry:-a}); }
  mesh(sy,cyl(WR-0.01,WR-0.01,0.05,40),'#2a6aa3',0,-5.6,0,{cast:false});
  for(const s of [-1,1]) mesh(sy,cyl(0.1,0.1,3.2,10),'#7a5232',s*(WR+0.35),2.4,0);
  mesh(sy,cyl(0.08,0.08,3.4,10),'#7a5232',0,3.85,0,{rz:Math.PI/2});
  mesh(sy,cyl(0.015,0.015,1.6,6),'#5a4030',0,3.05,0); mesh(sy,cyl(0.26,0.2,0.4,16),'#8a6040',0,2.1,0);
  mesh(sy,new T.PlaneGeometry(300,14),'#3f9ad8',0,0.02,-26,{rx:-Math.PI/2,cast:false});
  for(let i=0;i<9;i++){ const x=-40+i*10+hash(i)*4; const h=3+hash(i+3)*3; mesh(sy,bx(4,h,4),hash(i+1)<0.5?'#d9b98a':'#cfa978',x,h/2,-16-hash(i+7)*4); mesh(sy,bx(1,1.2,0.1),'#5a4030',x,0.6,-14-hash(i+7)*4+0.05,{cast:false}); }
})();
function palm(sc,x,z,h,seed){
  const g=grp(sc,x,0,z); let y=0, lean=0.05+hash(seed)*0.1;
  for(let i=0;i<7;i++){ mesh(g,cyl(0.32-i*0.025,0.36-i*0.025,h/7,12),i%2?'#8a6a45':'#7a5a3a',lean*i,y+h/14,0); y+=h/7; }
  const top=grp(g,lean*7,y,0);
  for(let i=0;i<8;i++){ const a=i/8*Math.PI*2+seed; const f=grp(top,0,0,0); f.rotation.y=a; const leaf=mesh(f,sph(0.5,16),i%2?'#4f9a3c':'#5fae46',1.5,-0.45,0,{s:[3.4,0.35,1]}); leaf.rotation.z=-0.45; }
  mesh(top,sph(0.32,12),'#7a5a3a',0,0,0);
  return g;
}
palm(sy,-7,-5,7,1); palm(sy,8,-7,8,2); palm(sy,-12,-10,6.5,3); palm(sy,13,-3,7,4);
const gnomonS=mesh(sy,cyl(0.08,0.08,3.4,12),'#7a5232',3.4,1.7,1.2);
const kid=person(KID); kid.root.scale.setScalar(0.78); sy.add(kid.root); kid.root.position.set(-2.5,0,0.3); kid.root.rotation.y=Math.PI/2;
const beam=mesh(sy,cyl(1.05,1.05,48,32,),new T.MeshBasicMaterial({color:'#fff1a8',transparent:true,opacity:0.22,depthWrite:false,blending:T.AdditiveBlending}),0,18,0,{cast:false,recv:false});
const sunSpot=mesh(sy,cyl(0.55,0.55,0.06,32),bas('#fffbe0'),0,-5.55,0,{cast:false}); const spotGlow=glowSprite('rgba(255,245,190,1)',3.2); spotGlow.position.set(0,-5.4,0); sy.add(spotGlow);

/* ====================================================================== */
/*  SCENE: Alexandria - the shadow of a stick                              */
/* ====================================================================== */
const ax=new T.Scene(); ax.background=gradTex([[0,'#4f9fe6'],[0.6,'#a6d2f3'],[1,'#f1e4c6']]); ax.fog=new T.Fog('#eadfc6',60,180);
const axCam=new T.PerspectiveCamera(42,LW/LH,0.1,400);
ax.add(new T.HemisphereLight('#ffffff','#b8a07a',0.42));
const axSun=new T.DirectionalLight('#fff4e0',1.2); axSun.castShadow=true; axSun.shadow.mapSize.set(2048,2048);
Object.assign(axSun.shadow.camera,{left:-11,right:11,top:11,bottom:-11,near:1,far:200}); axSun.shadow.bias=-0.0004; axSun.shadow.normalBias=0.02; ax.add(axSun); ax.add(axSun.target);
const STICK=5;
(function(){
  const plaza=canvasTex(1024,1024,(g,w,h)=>{ g.fillStyle='#ebdcc0'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(150,120,80,0.35)'; g.lineWidth=3;
    for(let i=0;i<=16;i++){ g.beginPath(); g.moveTo(i*64,0); g.lineTo(i*64,h); g.stroke(); g.beginPath(); g.moveTo(0,i*64); g.lineTo(w,i*64); g.stroke(); }
    g.strokeStyle='#b33a2f'; g.lineWidth=10; g.beginPath(); g.moveTo(512,512); g.lineTo(512,1000); g.stroke();
    g.fillStyle='#b33a2f'; g.font='bold 110px sans-serif'; g.textAlign='center'; g.fillText('N',512,990);
    g.strokeStyle='rgba(120,90,60,0.5)'; g.lineWidth=5; for(let k=1;k<=4;k++){ g.beginPath(); g.arc(512,512,k*90,0,Math.PI); g.stroke(); } });
  mesh(ax,new T.PlaneGeometry(22,22),new T.MeshLambertMaterial({map:plaza}),0,0.01,0,{rx:-Math.PI/2,cast:false});
  mesh(ax,new T.PlaneGeometry(400,400),'#e9d7b0',0,0,0,{rx:-Math.PI/2,cast:false});
  mesh(ax,cyl(0.9,1.1,0.4,24),'#d8c7a5',0,0.2,0);
  mesh(ax,new T.PlaneGeometry(400,120),'#3f8fd2',0,0.03,-80,{rx:-Math.PI/2,cast:false});
  const ph=grp(ax,-30,0,-60); mesh(ph,bx(9,12,9),'#efe7d6',0,6,0); mesh(ph,cyl(3.2,3.6,9,8),'#f4eee2',0,16.5,0); mesh(ph,cyl(1.8,2.1,6,24),'#f4eee2',0,24,0); mesh(ph,sph(1.4,20),bas('#ffb347'),0,28,0,{cast:false});
  for(let i=0;i<6;i++){ const x=14+i*6, h=4+hash(i)*4; mesh(ax,bx(5,h,5),hash(i+2)<0.5?'#efe2c8':'#e3d1ae',x,h/2,-20-hash(i)*8); }
  const ob=grp(ax,-12,0,-14); mesh(ob,cyl(0.7,1.25,13,4),'#d9b27a',0,6.5,0,{ry:Math.PI/4}); mesh(ob,cyl(0,0.7,1.4,4),'#e8c48a',0,13.7,0,{ry:Math.PI/4});
})();
const stick=mesh(ax,cyl(0.15,0.15,STICK,16),'#6b4428',0,STICK/2+0.4,0);
const eratoA=person(ERATO); ax.add(eratoA.root); eratoA.root.position.set(2.4,0,1.6); eratoA.root.rotation.y=-1.9;
const tablet=mesh(eratoA.elR,bx(0.6,0.8,0.06),'#c9a36a',0,-1.25,0.25,{cast:false});
const rays=grp(ax,0,0,0); const rayMat=new T.MeshBasicMaterial({color:'#ffd84a',transparent:true,opacity:0.9});
const RAYOFF=[-1.6,-0.8,0,0.8]; RAYOFF.forEach(o=>mesh(rays,cyl(0.035,0.035,30,8),rayMat,0,0,0,{cast:false})); rays.visible=false;
function sunDirAt(u){ const az=lerp(100,180,u)*D2R, alt=lerp(30,90-7.2,u)*D2R; return V(Math.sin(az)*Math.cos(alt),Math.sin(alt),Math.cos(az)*Math.cos(alt)); }

/* ====================================================================== */
/*  SCENE: close-up of a bematist counting his steps                       */
/* ====================================================================== */
const wk=new T.Scene(); wk.background=gradTex([[0,'#5aa8e8'],[0.65,'#b6dbf3'],[1,'#f3e2bf']]); wk.fog=new T.Fog('#efe0c0',40,120);
const wkCam=new T.PerspectiveCamera(36,LW/LH,0.1,300);
addLights(wk,V(-10,30,18),0.95,true,14);
const sandTex=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#e9d3a4'; g.fillRect(0,0,w,h); for(let i=0;i<220;i++){ g.fillStyle=`rgba(${190+hash(i)*40|0},${160+hash(i+1)*30|0},110,0.35)`; g.beginPath(); g.ellipse(hash(i*3)*w,hash(i*5)*h,6+hash(i)*14,3+hash(i+2)*5,0,0,Math.PI*2); g.fill(); } });
sandTex.wrapS=sandTex.wrapT=T.RepeatWrapping; sandTex.repeat.set(12,6);
const sand=mesh(wk,new T.PlaneGeometry(120,60),new T.MeshLambertMaterial({map:sandTex}),0,0,0,{rx:-Math.PI/2,cast:false});
palm(wk,-14,-14,8,5); palm(wk,10,-18,9,6); palm(wk,26,-12,7,7);
mesh(wk,new T.PlaneGeometry(300,10),'#3f9ad8',0,0.02,-24,{rx:-Math.PI/2,cast:false});
const bema=person(BEMA); wk.add(bema.root); bema.root.rotation.y=Math.PI/2;
const staff=mesh(bema.elL,cyl(0.05,0.05,4.2,8),'#7a5232',0,-1.1,0.12,{cast:false});
const prints=[]; for(let i=0;i<14;i++) prints.push(mesh(wk,sph(0.2,12),'#b9925e',0,0.02,0,{s:[1.7,0.08,0.75],cast:false}));
const ticks=[]; for(let i=0;i<14;i++) ticks.push(mesh(wk,bx(0.06,0.04,0.7),'#b33a2f',0,0.03,1.4,{cast:false}));
const STEPL=1.9, STEPW=7.0, SPEED=STEPL*STEPW/Math.PI;

/* ====================================================================== */
/*  SCENE: the geometry - a slice of the Earth                             */
/* ====================================================================== */
const geo=new T.Scene(); geo.background=gradTex([[0,'#070b26'],[1,'#141c4e']]);
const gCam=new T.PerspectiveCamera(30,LW/LH,0.1,500);
geo.add(new T.AmbientLight('#ffffff',0.55)); const gL=new T.DirectionalLight('#ffffff',0.6); gL.position.set(10,8,30); geo.add(gL);
(function(){ const n=700,pos=new Float32Array(n*3); for(let i=0;i<n;i++) pos.set([(R()-0.5)*300,(R()-0.5)*180,-60-R()*40],i*3); const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); geo.add(new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2,sizeAttenuation:false}))); })();
const ER=10;
const sliceTex=canvasTex(1024,1024,(g,w,h)=>{ const c=w/2; const gr=g.createRadialGradient(c,c,0,c,c,c); [[0,'#fff1a0'],[0.18,'#ffc94a'],[0.2,'#ffad3a'],[0.54,'#ff8a3a'],[0.56,'#d9573a'],[0.94,'#a8443a'],[0.955,'#8b5a3c'],[0.985,'#8b5a3c'],[0.99,'#5fae46'],[1,'#5fae46']].forEach(([o,cc])=>gr.addColorStop(o,cc)); g.fillStyle=gr; g.fillRect(0,0,w,h); });
const disc=new T.Mesh(new T.CylinderGeometry(ER,ER,0.8,160),[lam('#3f8fd6'),new T.MeshLambertMaterial({map:sliceTex}),lam('#3f8fd6')]); disc.rotation.x=Math.PI/2; geo.add(disc);
const AANG=7.2*D2R, STK=2.0;
const pS=V(ER,0,0.42), pA=V(ER*Math.cos(AANG),ER*Math.sin(AANG),0.42);
function radialStick(p,ang){ const g=grp(geo,p.x,p.y,p.z); g.rotation.z=ang-Math.PI/2; mesh(g,cyl(0.07,0.07,STK,10),'#f0e2c0',0,STK/2,0); mesh(g,sph(0.12,12),'#f0e2c0',0,STK,0); return g; }
radialStick(pS,0); radialStick(pA,AANG);
mesh(geo,cyl(0.32,0.32,0.06,24),bas('#ffb703'),pS.x,pS.y,0.43,{rx:Math.PI/2}); mesh(geo,cyl(0.32,0.32,0.06,24),bas('#e63946'),pA.x,pA.y,0.43,{rx:Math.PI/2});
const topA=V((ER+STK)*Math.cos(AANG),(ER+STK)*Math.sin(AANG),0.42), topS=V(ER+STK,0,0.42);
const shadowTipX=Math.sqrt(ER*ER-topA.y*topA.y);
const shadowA=mesh(geo,bx(1,0.1,0.06),bas('#1a1430'),0,0,0.47,{cast:false});
{ const a=V(pA.x,pA.y,0), b=V(shadowTipX,topA.y,0); const mid=a.clone().add(b).multiplyScalar(0.5); shadowA.position.set(mid.x,mid.y,0.47); shadowA.scale.x=a.distanceTo(b); shadowA.rotation.z=Math.atan2(b.y-a.y,b.x-a.x); }
const RAYY=[-4.5,-2.2,0,topA.y,3.6,5.8,8.0];
const rayEnd=y=>Math.abs(y-topA.y)<1e-6?shadowTipX:(y===0?topS.x:Math.sqrt(Math.max(0,ER*ER-y*y)));
const gRays=RAYY.map(y=>{ const m=mesh(geo,cyl(0.06,0.06,1,8),new T.MeshBasicMaterial({color:'#ffd84a'}),0,y,0.5,{rz:Math.PI/2,cast:false}); m.userData.y=y; return m; });
const wedges=[]; for(let i=0;i<50;i++){ const w=mesh(geo,new T.CircleGeometry(ER-0.02,6,i*AANG,AANG),new T.MeshBasicMaterial({color:i===0?'#ffd84a':(i%2?'#ffffff':'#9fd3ff'),transparent:true,opacity:i===0?0.55:0.28,depthWrite:false}),0,0,0.44,{cast:false}); w.visible=false; wedges.push(w); }

/* ====================================================================== */
/*  2D overlay                                                             */
/* ====================================================================== */
const FF='Fredoka, "Trebuchet MS", sans-serif';
function txt(s,x,y,size,o){
  o=o||{}; const al=o.alpha==null?1:o.alpha; if(al<=0.003) return 0; const sc=o.scale==null?1:o.scale; if(sc<=0.001) return 0;
  ctx.save(); ctx.globalAlpha=al; ctx.translate(x,y); ctx.scale(sc,sc);
  ctx.font=`${o.weight||700} ${size}px ${FF}`; ctx.textAlign=o.align||'center'; ctx.textBaseline='middle'; ctx.lineJoin='round';
  let w=ctx.measureText(s).width; if(o.maxW&&w>o.maxW){ const f=o.maxW/w; ctx.scale(f,f); w=o.maxW; }
  if(o.stroke){ ctx.lineWidth=size*(o.sw||0.16); ctx.strokeStyle=o.stroke; ctx.strokeText(s,0,0); }
  if(o.shadow!==false){ ctx.shadowColor='rgba(0,0,0,0.45)'; ctx.shadowBlur=size*0.2; ctx.shadowOffsetY=size*0.05; }
  ctx.fillStyle=o.fill||'#ffffff'; ctx.fillText(s,0,0); ctx.restore(); return w*sc;
}
function rrect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function caption(t,a,b,fr,en){
  if(CAPREC){ CAPREC.push([a,b,fr,en]); return; }
  const al=smooth(seg(t,a,a+0.35))*(1-smooth(seg(t,b-0.3,b))); if(al<=0.003) return;
  capBox(L2(fr,en),al);
}
function capBox(s,al){
  ctx.save(); ctx.font=`600 46px ${FF}`; const words=s.split(' '), lines=[]; let cur='';
  for(const w of words){ const tt=cur?cur+' '+w:w; if(ctx.measureText(tt).width>1480&&cur){ lines.push(cur); cur=w; } else cur=tt; } if(cur) lines.push(cur); ctx.restore();
  const lh=58, h=lines.length*lh+40, y0=1046-h;
  ctx.save(); ctx.globalAlpha=al*0.8; ctx.fillStyle='#14102e'; rrect(150,y0,1620,h,30); ctx.fill(); ctx.restore();
  lines.forEach((ln,i)=>txt(ln,960,y0+20+lh/2+i*lh,46,{alpha:al,weight:600,shadow:false,maxW:1560}));
}
function tag(x,y,fr,en,a,color){
  if(a<=0.003) return; const str=L2(fr,en); ctx.save(); ctx.globalAlpha=a; ctx.font=`700 36px ${FF}`; const w=ctx.measureText(str).width+48;
  ctx.fillStyle=color||'rgba(20,16,46,0.82)'; rrect(x-w/2,y-34,w,68,24); ctx.fill(); ctx.restore();
  txt(str,x,y,36,{alpha:a,shadow:false});
}
function veil(a,c){ if(a<=0.003) return; ctx.save(); ctx.globalAlpha=Math.min(1,a); ctx.fillStyle=c||'#0b0820'; ctx.fillRect(0,0,LW,LH); ctx.restore(); }
const _v=new T.Vector3();
function scr(obj,cam,off){ if(obj.isVector3) _v.copy(obj); else obj.getWorldPosition(_v); if(off) _v.add(off); _v.project(cam); return {x:(_v.x+1)/2*LW,y:(1-_v.y)/2*LH}; }
const scrV=(v,cam)=>scr(v.clone(),cam);
function dashLine(a,b,col,w,dash,frac){ ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w; ctx.setLineDash(dash||[16,12]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(lerp(a.x,b.x,frac==null?1:frac),lerp(a.y,b.y,frac==null?1:frac)); ctx.stroke(); ctx.restore(); }
function arcAt(c,r,a0,a1,col,w){ ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w; ctx.beginPath(); ctx.arc(c.x,c.y,r,a0,a1,a0>a1); ctx.stroke(); ctx.restore(); }
function sunIcon(x,y,r,t){ ctx.save(); ctx.translate(x,y); ctx.rotate(t*0.4); ctx.fillStyle='#ffd84a'; for(let i=0;i<12;i++){ ctx.rotate(Math.PI/6); ctx.fillRect(r*1.15,-r*0.09,r*0.45,r*0.18);} ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
function bubble(x,y,w,h,a,t){
  if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#fffaf0'; ctx.strokeStyle='#3a2a20'; ctx.lineWidth=5;
  rrect(x,y,w,h,40); ctx.fill(); ctx.stroke();
  [[x+40,y+h+30,16],[x+10,y+h+70,10]].forEach(([cx,cy,r])=>{ ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); ctx.stroke(); });
  const cx=x+w/2, top=y+60, wy=y+h-110;
  sunIcon(cx,top+10,34,t);
  ctx.fillStyle='rgba(255,220,90,0.55)'; ctx.fillRect(cx-28,top+50,56,wy-top-10);
  ctx.fillStyle='#c4a77c'; ctx.fillRect(cx-110,wy-10,60,120); ctx.fillRect(cx+50,wy-10,60,120); ctx.fillStyle='#8a6a45'; ctx.fillRect(cx-50,wy+10,100,100);
  ctx.fillStyle='#2a6aa3'; ctx.fillRect(cx-50,wy+80,100,30); ctx.fillStyle='#fff6c2'; ctx.beginPath(); ctx.ellipse(cx,wy+92,34,10,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function counterBox(x,y,label,labelEn,value,a){
  if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='rgba(20,16,46,0.85)'; rrect(x-210,y-80,420,160,28); ctx.fill(); ctx.restore();
  txt(L2(label,labelEn),x,y-38,32,{alpha:a,weight:600,shadow:false,maxW:390}); txt(value,x,y+30,56,{alpha:a,fill:'#ffd84a',shadow:false});
}
const fmtL=n=>LANG==='fr'?fmt(n):fmtEn(n);
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const fmtEn=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');

/* ====================================================================== */
/*  Scene updates                                                          */
/* ====================================================================== */
function renderAt(t){
  t=clamp(t,0,DURATION);
  ctx.setTransform(SCL,0,0,SCL,0,0); ctx.clearRect(0,0,LW,LH);
  if(t<S.lib) doIntro(t);
  else if(t<S.syene) doLib(t,false);
  else if(t<S.alex) doSyene(t);
  else if(t<S.walk) doAlex(t);
  else if(t<S.globeWalk) doWalk(t);
  else if(t<S.geo) doGlobeWalk(t);
  else if(t<S.result) doGeo(t);
  else if(t<S.end) doResult(t);
  else doLib(t,true);
  /* quick dip-to-dark between scenes */
  let v=0; CUTS.forEach(c=>{ v=Math.max(v,1-smooth(Math.abs(t-c)/0.28)); }); veil(v);
  if(t<0.4) veil(1-smooth(t/0.4)); if(t>DURATION-0.6) veil(smooth(seg(t,DURATION-0.6,DURATION)));
}

function globeView(lat,lon,dist,fov,yoff){ aimGlobe(GB,lat,lon); scam.fov=fov; scam.updateProjectionMatrix(); scam.position.set(0,yoff||0,GR+dist); scam.lookAt(0,yoff||0,0); halo.position.set(0,0,-2); }
function resetGlobeExtras(){ tape.visible=false; rod.visible=false; coreBall.visible=false; globeMat.opacity=1; gWalkers.forEach(w=>w.root.visible=false); stepDots.count=0; pinA.visible=pinS.visible=true; }

function doIntro(t){
  resetGlobeExtras();
  const u=easeInOut(seg(t,0,5.6));
  aimGlobe(GB,lerp(8,26,u),lerp(-40,31,u));
  scam.fov=40; scam.updateProjectionMatrix(); const d=lerp(48,21,u); scam.position.set(0,0,GR+d); scam.lookAt(0,0,0); halo.position.set(0,0,-2);
  pinA.visible=pinS.visible=t>3.2; const ps=backOut(seg(t,3.2,3.6)); pinA.scale.setScalar(ps); pinS.scale.setScalar(backOut(seg(t,3.4,3.8)));
  renderer.render(space,scam);
  txt(L2('Comment Ératosthène a mesuré la Terre','How Eratosthenes measured the Earth'),960,130,78,{alpha:smooth(seg(t,0.5,1.2)),stroke:'#1b1446',sw:0.14,scale:backOut(seg(t,0.5,1.0)),maxW:1760});
  txt(L2('Égypte, vers 240 av. J.-C.','Egypt, around 240 BC'),960,222,40,{alpha:smooth(seg(t,1.0,1.6)),weight:600,fill:'#ffe39a',stroke:'#1b1446',sw:0.14});
  if(t>3.3){ const a=smooth(seg(t,3.4,3.8)); const pa=scr(pinA,scam,V(0,0,0)), ps2=scr(pinS,scam);
    tag(pa.x-170,pa.y-40,'Alexandrie','Alexandria',a,'rgba(230,57,70,0.88)'); tag(ps2.x+190,ps2.y+20,'Syène (Assouan)','Syene (Aswan)',smooth(seg(t,3.6,4.0)),'rgba(200,120,0,0.9)'); }
}

function doLib(t,ending){
  [erato,messenger,endBema,endKid].forEach(resetP);
  scroll.visible=!ending; libGlobe.visible=ending; endBema.root.visible=endKid.root.visible=ending; messenger.root.visible=true;
  if(!ending){
    const l=t-S.lib;
    libCam.position.set(lerp(-1,0.5,l/8),lerp(7.2,6.6,l/8),lerp(22,17.5,l/8)); libCam.lookAt(0.5,4.6,0);
    erato.root.position.set(1.2,0,-0.6); erato.root.rotation.y=l<2.5?0.2:lerp(0.2,-0.6,smooth(seg(l,2.3,3.0)));
    erato.head.rotation.x=0.25; erato.shR.rotation.x=-0.5; erato.elR.rotation.x=-0.8; erato.shL.rotation.x=-0.4; erato.elL.rotation.x=-0.7;
    const wl=seg(l,0.3,2.6); messenger.root.position.set(lerp(-13,-2.0,wl),0,lerp(1.2,0.4,wl)); messenger.root.rotation.y=Math.PI/2*(1-smooth(seg(l,2.5,2.9)))+0.5*smooth(seg(l,2.5,2.9));
    if(wl<1) walk(messenger,l*8,0.55);
    const give=smooth(seg(l,2.7,3.3)), take=smooth(seg(l,3.3,3.9));
    messenger.shR.rotation.x=-1.3*give*(1-take*0.6); messenger.elR.rotation.x=-0.3*give;
    const handM=new T.Vector3(); messenger.elR.getWorldPosition(handM);
    if(l<3.3){ messenger.root.updateMatrixWorld(true); const hp=V(0,-1.1,0).applyMatrix4(messenger.elR.matrixWorld); scroll.position.copy(hp); scroll.rotation.set(0,0.4,0); parch.visible=false; }
    else { const rd=smooth(seg(l,3.6,4.2)); erato.shR.rotation.x=-1.1; erato.shL.rotation.x=-1.1; erato.elR.rotation.x=-0.6; erato.elL.rotation.x=-0.6; erato.shR.rotation.z=0.35; erato.shL.rotation.z=-0.35;
      erato.root.updateMatrixWorld(true); const a=V(0,-1.1,0).applyMatrix4(erato.elR.matrixWorld), b=V(0,-1.1,0).applyMatrix4(erato.elL.matrixWorld);
      scroll.position.copy(a.add(b).multiplyScalar(0.5)).add(V(0,0.5,0)); scroll.rotation.set(0,erato.root.rotation.y,0); parch.visible=rd>0.05; parch.scale.y=rd; parch.position.y=-0.62*rd; erato.head.rotation.x=0.35; }
    renderer.render(lib,libCam);
    caption(t,S.lib+0.2,S.lib+3.3,'Ératosthène dirige la grande Bibliothèque d\'Alexandrie.','Eratosthenes runs the great Library of Alexandria.');
    caption(t,S.lib+3.4,S.syene,'On lui raconte : à Syène, à midi, le jour le plus long de l\'année, le Soleil éclaire le fond des puits.','He hears that in Syene, at noon on the longest day of the year, sunlight reaches the bottom of the wells.');
    bubble(1180,90,420,440,smooth(seg(t,S.lib+4.2,S.lib+4.7))*(1-smooth(seg(t,S.syene-0.4,S.syene))),t);
  } else {
    const l=t-S.end;
    libCam.position.set(lerp(0,0.4,l/5),lerp(6.4,6.0,l/5),lerp(23,20,l/5)); libCam.lookAt(0.4,4.4,0);
    erato.root.position.set(2.2,0,0.9); erato.root.rotation.y=-0.25; erato.shR.rotation.x=-0.9; erato.elR.rotation.x=-0.4; wave(erato,-1,t);
    libGlobeBall.rotation.y=t*1.6; libGlobe.position.set(3.9,3.45,1.0);
    messenger.root.position.set(-1.6,0,1.4); messenger.root.rotation.y=0.25; wave(messenger,1,t+1); wave(messenger,-1,t+1.5);
    endBema.root.position.set(-4.6,0,0.9); endBema.root.rotation.y=0.35; wave(endBema,1,t+0.5); endBema.body.position.y=Math.abs(Math.sin(t*5))*0.25;
    endKid.root.position.set(-0.1,0,3.4); endKid.root.rotation.y=0.1; wave(endKid,1,t+2); wave(endKid,-1,t+2.2); endKid.body.position.y=Math.abs(Math.sin(t*6))*0.35;
    renderer.render(lib,libCam);
    caption(t,S.end+0.2,DURATION-0.2,'Avec un bâton, des pas… et beaucoup de réflexion !','With a stick, footsteps… and a lot of thinking!');
    txt(L2('FIN','THE END'),960,120,70,{alpha:smooth(seg(t,S.end+2.2,S.end+2.8)),stroke:'#1b1446',sw:0.14,scale:backOut(seg(t,S.end+2.2,S.end+2.7))});
  }
}

function doSyene(t){
  const l=t-S.syene; resetP(kid);
  const crane=easeInOut(seg(l,3.6,6.6));
  const p0=V(0.5,5.0,17.5), p1=V(0.25,13.5,3.0), l0=V(0.3,3.2,0), l1=V(0,-5.6,0);
  syCam.position.lerpVectors(p0,p1,crane); syCam.lookAt(new T.Vector3().lerpVectors(l0,l1,easeInOut(seg(l,3.6,6.9))));
  const back=smooth(seg(l,3.2,4.2)); kid.root.position.set(lerp(-2.5,-5.2,back),0,lerp(0.3,1.6,back)); kid.root.rotation.y=Math.PI/2;
  kid.body.rotation.x=(0.35+0.05*Math.sin(t*2))*(1-back); kid.head.rotation.x=0.4*(1-back); kid.shR.rotation.x=-0.9*(1-back); kid.shL.rotation.x=-0.9*(1-back); kid.elL.rotation.x=-0.4; kid.elR.rotation.x=-0.4;
  if(back>0.99){ wave(kid,1,t); }
  beam.material.opacity=0.2+0.05*Math.sin(t*3); sunSpot.scale.setScalar(1+0.06*Math.sin(t*6)); spotGlow.material.opacity=0.8+0.2*Math.sin(t*5);
  renderer.render(sy,syCam);
  const a=smooth(seg(l,0.4,0.9))*(1-smooth(seg(l,3.4,3.8)));
  if(a>0){ const top=scrV(V(0,40,0),syCam); sunIcon(clamp(top.x,100,1820),Math.max(70,top.y),46,t); ctx.globalAlpha=1; }
  tag(300,90,'Syène (Assouan)','Syene (Aswan)',smooth(seg(l,0.3,0.8)),'rgba(200,120,0,0.9)');
  tag(1620,90,'Solstice d\'été, midi','Summer solstice, noon',smooth(seg(l,0.6,1.1)));
  const g=scr(gnomonS,syCam,V(0,-1.7,0)); const ga=smooth(seg(l,1.4,1.9))*(1-smooth(seg(l,3.6,4.0)));
  if(ga>0){ txt(L2('pas d\'ombre !','no shadow!'),g.x+150,g.y-30,40,{alpha:ga,stroke:'#3a2a20',sw:0.16}); }
  if(l>6.3){ const s=scrV(V(0,-5.55,0),syCam); txt(L2('Le Soleil au fond du puits','The Sun at the bottom of the well'),s.x,s.y-205,42,{alpha:smooth(seg(l,6.4,6.8)),stroke:'#1b1446',sw:0.14}); }
  caption(t,S.syene+0.3,S.alex,'À Syène, à midi, le Soleil est juste au-dessus : il n\'y a pas d\'ombre.','In Syene at noon, the Sun is straight overhead: there is no shadow.');
}

function doAlex(t){
  const l=t-S.alex; resetP(eratoA);
  const u=smooth(seg(l,0.3,5.0));
  const sd=sunDirAt(u); axSun.position.copy(sd.clone().multiplyScalar(60)); axSun.target.position.set(0,0,0);
  const close=easeInOut(seg(l,7.3,8.4));
  const pW=V(0.5,12.5,18.5), lW=V(-3.0,1.4,0.6), pC=V(-9.5,3.4,1.3), lC=V(0,3.0,1.3);
  axCam.position.lerpVectors(pW,pC,close); axCam.lookAt(new T.Vector3().lerpVectors(lW,lC,close));
  eratoA.root.visible=l<7.6; eratoA.head.rotation.x=0.35; eratoA.shR.rotation.x=-0.7; eratoA.elR.rotation.x=-0.9;
  if(l>4.8&&l<7.3){ eratoA.shL.rotation.z=-2.2; eratoA.elL.rotation.z=-0.3; eratoA.body.position.y=Math.abs(Math.sin((l-4.8)*6))*0.2*(1-seg(l,6,7)); }
  const showRays=l>8.2; rays.visible=showRays;
  if(showRays){ const dir=sunDirAt(1); const top=V(0,STICK+0.4,0); const grow=easeOut(seg(l,8.2,8.9));
    rays.children.forEach((m,i)=>{ const off=V(0,0,RAYOFF[i]); const p0=top.clone().add(off); const hitT=p0.y/dir.y; const hit=p0.clone().sub(dir.clone().multiplyScalar(hitT));
      const far=p0.clone().add(dir.clone().multiplyScalar(14)); const len=far.distanceTo(hit)*grow; const end=hit; const start=hit.clone().add(dir.clone().multiplyScalar(len));
      m.position.copy(start.clone().add(end).multiplyScalar(0.5)); m.scale.set(1,Math.max(0.001,len/30),1); m.quaternion.setFromUnitVectors(V(0,1,0),dir); }); }
  renderer.render(ax,axCam);
  /* sky inset: the Sun climbs toward noon */
  const ia=smooth(seg(l,0.2,0.6))*(1-smooth(seg(l,7.0,7.4)));
  if(ia>0){ ctx.save(); ctx.globalAlpha=ia; ctx.fillStyle='rgba(20,16,46,0.8)'; rrect(1560,40,320,250,26); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(1720,200,120,Math.PI,0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1585,200); ctx.lineTo(1855,200); ctx.stroke();
    const sa=lerp(0.17,0.5,u)*Math.PI; sunIcon(1720-120*Math.cos(sa),200-120*Math.sin(sa),18,t); ctx.restore();
    const hr=lerp(8,12,u); const hh=Math.floor(hr), mm=Math.floor((hr-hh)*4)*15;
    txt(u>=0.999?L2('MIDI','NOON'):`${hh} h ${mm?mm:'00'}`,1720,248,32,{alpha:ia,fill:u>=0.999?'#ffd84a':'#ffffff',shadow:false}); }
  /* shortest shadow marker at noon */
  const na=smooth(seg(l,4.9,5.3))*(1-smooth(seg(l,7.0,7.4)));
  if(na>0){ const tip=scrV(V(0,0,STICK*Math.tan(7.2*D2R)+0.6),axCam); ctx.save(); ctx.globalAlpha=na; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(tip.x,tip.y,46+6*Math.sin(t*8),0,Math.PI*2); ctx.stroke(); ctx.restore();
    txt(L2('ombre la plus courte','shortest shadow'),tip.x-60,tip.y+96,38,{alpha:na,stroke:'#3a2a20',sw:0.16}); }
  tag(320,90,'Alexandrie','Alexandria',smooth(seg(l,0.2,0.7))*(1-smooth(seg(l,7.0,7.4))),'rgba(230,57,70,0.88)');
  /* the angle */
  if(l>8.6){ const a=smooth(seg(l,8.7,9.2)); const top=scrV(V(0,STICK+0.4,0),axCam), down=scrV(V(0,1.0,0),axCam), dir=sunDirAt(1), up=scrV(V(0,STICK+0.4,0).add(dir.clone().multiplyScalar(-4)),axCam);
    const a0=Math.atan2(down.y-top.y,down.x-top.x), a1=Math.atan2(up.y-top.y,up.x-top.x);
    ctx.save(); ctx.globalAlpha=a; arcAt(top,170,a0,a1,'#ffffff',6); arcAt(top,180,a0,a1,'#ffd84a',3); ctx.restore();
    txt(L2('7,2°','7.2°'),top.x+120,top.y+300,64,{alpha:a,fill:'#ffd84a',stroke:'#1b1446',sw:0.14});
    const pa=smooth(seg(l,9.4,9.9)); if(pa>0){ ctx.save(); ctx.globalAlpha=pa; ctx.fillStyle='rgba(20,16,46,0.82)'; rrect(1500,120,330,330,30); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(1665,300,120,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#ffd84a'; ctx.beginPath(); ctx.moveTo(1665,300); ctx.arc(1665,300,120,-Math.PI/2,-Math.PI/2+Math.PI*2/50); ctx.closePath(); ctx.fill(); ctx.restore();
      txt('= 1/50',1665,165,44,{alpha:pa,fill:'#ffd84a',shadow:false}); } }
  caption(t,S.alex+0.3,S.alex+4.6,'Le même jour à Alexandrie, il observe l\'ombre d\'un bâton : elle raccourcit jusqu\'à midi.','The same day in Alexandria, he watches a stick\'s shadow: it shrinks until noon.');
  caption(t,S.alex+4.7,S.alex+8.0,'Midi, c\'est quand l\'ombre est la plus courte : c\'est le moment de mesurer !','Noon is when the shadow is shortest: time to measure!');
  caption(t,S.alex+8.1,S.walk,'L\'angle des rayons avec le bâton : 7,2°, soit 1/50 d\'un tour complet.','The angle between sunrays and stick: 7.2°, which is 1/50 of a full circle.');
}

function doWalk(t){
  const l=t-S.walk; resetP(bema);
  const ph=l*STEPW; walk(bema,ph,0.6); bema.shL.rotation.x=-0.25; bema.elL.rotation.x=-0.8;
  const off=l*SPEED;
  sandTex.offset.x=(off/10)%1;
  prints.forEach((p,i)=>{ const x=((i*STEPL-off)%(14*STEPL)+14*STEPL)%(14*STEPL)-12; p.position.set(x,0.02,i%2?0.33:-0.33); });
  ticks.forEach((m,i)=>{ const x=((i*STEPL-off)%(14*STEPL)+14*STEPL)%(14*STEPL)-12; m.position.set(x,0.03,1.4); });
  wkCam.position.set(1.0,4.8,19.5); wkCam.lookAt(0.4,3.3,0);
  renderer.render(wk,wkCam);
  const steps=Math.floor(ph/Math.PI)+1;
  counterBox(1600,190,'Pas','Steps',fmtL(1200+steps),smooth(seg(l,0.3,0.7)));
  const k=(ph/Math.PI)%1; if(k<0.35){ const p=scr(bema.root,wkCam,V(0,0.4,0)); txt('+1',p.x+40,p.y-100-k*160,44,{alpha:1-k/0.35,fill:'#ffd84a',stroke:'#3a2a20',sw:0.14}); }
  const a=smooth(seg(l,0.9,1.3)); if(a>0){ const p1=scrV(V(-12+STEPL*Math.ceil((off+6)/STEPL)-off-6+0,0.05,1.4),wkCam); void p1; }
  caption(t,S.walk+0.2,S.globeWalk+3.6,'Pour la distance, des bématistes, entraînés à faire des pas tous égaux, comptent leurs pas.','For the distance, bematists, trained to take perfectly equal steps, count their paces.');
}

function doGlobeWalk(t){
  resetGlobeExtras(); const l=t-S.globeWalk;
  const zoom=easeInOut(seg(l,0,1.2));
  aimGlobe(GB,lerp(27.5,27.8,zoom),lerp(31.2,31.4,zoom)); scam.fov=40; scam.updateProjectionMatrix(); scam.position.set(0,0,GR+lerp(9,3.3,zoom)); scam.lookAt(0,0,0);
  pinA.scale.setScalar(1); pinS.scale.setScalar(1);
  const prog=easeInOut(seg(l,0.8,6.8));
  const up=new T.Vector3(), fw=new T.Vector3(), rt=new T.Vector3(), m4=new T.Matrix4();
  gWalkers.forEach((P,i)=>{ resetP(P); P.root.visible=true; const s=clamp(prog-i*0.035,0,1); const p=walkCurve.getPointAt(s); const p2=walkCurve.getPointAt(Math.min(1,s+0.01));
    up.copy(p).normalize(); fw.copy(p2).sub(p); fw.sub(up.clone().multiplyScalar(fw.dot(up))).normalize(); if(fw.lengthSq()<1e-6) fw.set(1,0,0); rt.crossVectors(up,fw).normalize();
    const lat=rt.clone().multiplyScalar((i-1)*0.07); P.root.position.copy(p).add(lat); m4.makeBasis(rt,up,fw); P.root.quaternion.setFromRotationMatrix(m4);
    if(s>0&&s<1) walk(P,t*9+i,0.6); });
  let n=0; const mm=new T.Matrix4();
  for(let k=0;k<180&&n<180;k++){ const s=k/180; if(s>prog-0.01) break; const p=walkCurve.getPointAt(s); mm.makeTranslation(p.x,p.y,p.z); stepDots.setMatrixAt(n++,mm); }
  stepDots.count=n; stepDots.instanceMatrix.needsUpdate=true;
  renderer.render(space,scam);
  const pa=scr(pinA,scam), ps=scr(pinS,scam);
  tag(pa.x-190,pa.y-30,'Alexandrie','Alexandria',smooth(seg(l,0.8,1.2)),'rgba(230,57,70,0.88)'); tag(ps.x+200,ps.y+10,'Syène','Syene',smooth(seg(l,0.8,1.2)),'rgba(200,120,0,0.9)');
  const st=5000*prog;
  counterBox(1620,170,'Stades parcourus','Stadia walked',fmtL(st),smooth(seg(l,0.6,1.0)));
  txt(`≈ ${fmtL(st*0.1575)} km`,1620,300,40,{alpha:smooth(seg(l,0.6,1.0)),fill:'#ffffff'});
  if(l>3.6) caption(t,S.globeWalk+3.7,S.geo,'De Syène à Alexandrie : 5 000 stades, soit environ 800 km.','From Syene to Alexandria: 5,000 stadia, about 800 km.');
  else caption(t,S.walk+0.2,S.globeWalk+3.6,'Pour la distance, des bématistes, entraînés à faire des pas tous égaux, comptent leurs pas.','For the distance, bematists, trained to take perfectly equal steps, count their paces.');
}

function doGeo(t){
  const l=t-S.geo;
  const pull=easeInOut(seg(l,2.1,3.7));
  const pZ=V(10.3,0.9,10.5), lZ=V(10.3,0.9,0), pF=V(1.5,0,47), lF=V(1.5,0,0);
  gCam.position.lerpVectors(pZ,pF,pull); gCam.lookAt(new T.Vector3().lerpVectors(lZ,lF,pull));
  gRays.forEach((m,i)=>{ const y=m.userData.y, end=rayEnd(y), start=45; const g=easeOut(seg(l,0.05+i*0.05,0.75+i*0.05)); const x0=start, x1=lerp(start,end,g); m.position.set((x0+x1)/2,y,0.5); m.scale.y=Math.max(0.001,Math.abs(x0-x1)); });
  shadowA.visible=l>1.2;
  const nW=Math.floor(clamp((l-4.8)/3.6,0,1)*50+(l>4.8?1:0)); wedges.forEach((w,i)=>w.visible=i<nW||(i===0&&l>3.9));
  renderer.render(geo,gCam);
  const c=scrV(V(0,0,0.45),gCam), s=scrV(V(pS.x,pS.y,0.45),gCam), a=scrV(V(pA.x,pA.y,0.45),gCam), ta=scrV(topA,gCam), ts=scrV(topS,gCam);
  const la=smooth(seg(l,0.4,0.9));
  txt(L2('Syène','Syene'),s.x+40,s.y+70,34,{alpha:la,fill:'#ffb703',align:'left',stroke:'#0b0820',sw:0.14}); txt(L2('Alexandrie','Alexandria'),a.x-30,a.y-40,34,{alpha:la,fill:'#ff6b75',align:'right',stroke:'#0b0820',sw:0.14});
  const ra=smooth(seg(l,0.9,1.4))*(1-pull*0.5); txt(L2('rayons du Soleil parallèles','parallel sunrays'),1500,140,36,{alpha:ra,weight:600,fill:'#ffd84a',maxW:760}); sunIcon(1830,140,40,t);
  const sa=smooth(seg(l,1.3,1.8))*(1-smooth(seg(l,2.0,2.4))); if(sa>0){ const tip=scrV(V(shadowTipX,topA.y,0.45),gCam); txt(L2('ombre','shadow'),tip.x-170,tip.y-30,34,{alpha:sa,stroke:'#0b0820',sw:0.14}); }
  const dl=seg(l,3.6,4.6); if(dl>0){ dashLine(s,c,'rgba(255,255,255,0.9)',4,[14,10],dl); dashLine(a,c,'rgba(255,255,255,0.9)',4,[14,10],dl); dashLine(ts,s,'rgba(255,255,255,0.9)',4,[14,10],1); }
  const an=smooth(seg(l,4.2,4.7)); if(an>0){ const a0=Math.atan2(s.y-c.y,s.x-c.x), a1=Math.atan2(a.y-c.y,a.x-c.x);
    ctx.save(); ctx.globalAlpha=an; arcAt(c,120,a0,a1,'#ffd84a',8); ctx.restore(); txt(L2('7,2°','7.2°'),c.x+175,c.y-26,46,{alpha:an,fill:'#ffd84a',stroke:'#0b0820',sw:0.14});
    const b0=Math.atan2(a.y-ta.y,a.x-ta.x), b1=Math.PI; ctx.save(); ctx.globalAlpha=an; arcAt(ta,60,b1,b0+Math.PI*2*(b0<0?1:0),'#ffd84a',6); ctx.restore(); txt(L2('7,2°','7.2°'),ta.x+95,ta.y-80,40,{alpha:an,fill:'#ffd84a',stroke:'#0b0820',sw:0.14}); }
  if(l>4.8){ const k=Math.min(50,nW); txt(`× ${k}`,c.x,c.y+120,72,{alpha:smooth(seg(l,4.8,5.1)),fill:'#ffffff',stroke:'#0b0820',sw:0.14});
    if(k>=50) txt(L2('360° ÷ 7,2° = 50','360° ÷ 7.2° = 50'),c.x,c.y+210,52,{alpha:smooth(seg(l,8.4,8.7)),fill:'#ffd84a',stroke:'#0b0820',sw:0.14,scale:backOut(seg(l,8.4,8.8))}); }
  caption(t,S.geo+0.2,S.geo+4.7,'Les rayons du Soleil arrivent parallèles : l\'angle de l\'ombre est le même qu\'au centre de la Terre.','Sunrays arrive parallel: the shadow\'s angle is the same as the angle at the Earth\'s centre.');
  caption(t,S.geo+4.8,S.result,'7,2° tient 50 fois dans un tour complet : 360° ÷ 7,2° = 50.','7.2° fits 50 times into a full circle: 360° ÷ 7.2° = 50.');
}

function doResult(t){
  resetGlobeExtras(); const l=t-S.result;
  aimGlobe(GB,18,lerp(-20,-12,l/8)); scam.fov=40; scam.updateProjectionMatrix(); scam.position.set(0,3.2,GR+27); scam.lookAt(0,2.6,0);
  pinA.visible=pinS.visible=true;
  tape.visible=true; const tf=easeInOut(seg(l,0.3,3.0)); tape.geometry.setDrawRange(0,Math.floor(tapeGeo.index.count*tf/6)*6);
  const half=smooth(seg(l,3.6,4.3)); globeMat.opacity=lerp(1,0.32,half); rod.visible=half>0.02; coreBall.visible=rod.visible; rod.scale.set(easeOut(seg(l,4.0,4.8))||0.001,1,1);
  renderer.render(space,scam);
  const ca=smooth(seg(l,0.5,1.0)); const v=250000*tf;
  txt(L2(`50 × 5 000 = ${fmt(v)} stades`,`50 × 5,000 = ${fmtEn(v)} stadia`),960,120,58,{alpha:ca,stroke:'#0b0820',sw:0.14});
  txt(`≈ ${fmtL(v*0.1575)} km`,960,190,48,{alpha:ca,fill:'#ffd84a',stroke:'#0b0820',sw:0.14});
  const ra=smooth(seg(l,4.6,5.1)); if(ra>0){ const pR=scrV(V(GR,0,0),scam);
    txt(L2('diamètre = tour ÷ π','diameter = circumference ÷ π'),960,scrV(V(0,0,0),scam).y-70,40,{alpha:ra,fill:'#ffffff',stroke:'#0b0820',sw:0.14});
    txt(L2('≈ 12 500 km','≈ 12,500 km'),pR.x+190,pR.y,56,{alpha:ra,fill:'#ff8a92',stroke:'#0b0820',sw:0.14}); }
  caption(t,S.result+0.2,S.result+4.4,'Tour de la Terre = 50 × 5 000 = 250 000 stades, environ 39 400 km.','Earth\'s circumference = 50 × 5,000 = 250,000 stadia, about 39,400 km.');
  caption(t,S.result+4.5,S.end,'Diamètre = tour ÷ π ≈ 12 500 km. Aujourd\'hui on mesure 12 742 km !','Diameter = circumference ÷ π ≈ 12,500 km. Today we measure 12,742 km!');
}

/* ====================================================================== */
const capC=document.createElement('canvas'); capC.width=LW; capC.height=LH; const capX=capC.getContext('2d');
window.CARD={duration:DURATION,setSize:setRenderSize,render:renderAt,
  frame(t,q){ renderAt(t); capX.drawImage(glc,0,0,LW,LH); capX.drawImage(ui,0,0,LW,LH); return capC.toDataURL('image/jpeg',q||0.92); },
  fonts:document.fonts?document.fonts.load('700 100px Fredoka').then(()=>document.fonts.load('600 60px Fredoka')).then(()=>document.fonts.load('500 60px Fredoka')):Promise.resolve()};
if(CAPTURE){ setRenderSize(LW); return; }

const stage=document.getElementById('stage'), cover=document.getElementById('cover'), replay=document.getElementById('replay'), audio=document.getElementById('music'), bar=document.getElementById('bar');
function layout(){ const vw=window.innerWidth, vh=window.innerHeight; let w=vw, h=vw*9/16; if(h>vh){ h=vh; w=vh*16/9; } stage.style.width=w+'px'; stage.style.height=h+'px'; setRenderSize(clamp(Math.round(w*Math.min(window.devicePixelRatio||1,2)),480,LW)); }
let playing=false, t0=0, lastT=1.6;
window.addEventListener('resize',()=>{ layout(); if(!playing) renderAt(lastT); }); layout();
function loop(now){
  if(playing){ let t=(now-t0)/1000;
    if(audio&&!audio.paused&&audio.currentTime>0.05&&audio.currentTime<DURATION-0.2){ const at=audio.currentTime; if(Math.abs(at-t)>0.12){ t0=now-at*1000; t=at; } }
    if(t>=DURATION){ t=DURATION; playing=false; replay.classList.add('show'); }
    lastT=t; renderAt(t); bar.style.width=(t/DURATION*100)+'%'; }
  requestAnimationFrame(loop);
}
function start(){ cover.classList.add('hide'); replay.classList.remove('show'); try{ audio.currentTime=0; const p=audio.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} t0=performance.now(); playing=true; }
cover.addEventListener('click',start); replay.addEventListener('click',start);
window.CARD.fonts.then(()=>renderAt(lastT)); renderAt(lastT); requestAnimationFrame(loop);
})();
