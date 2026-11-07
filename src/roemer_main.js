(() => {
'use strict';
const T = THREE;
const LW = 1920, LH = 1080;
const S = { intro:0, gal:7, obs:18, ecl:29, puz:41, idea:55, acad:70, nov:77, speed:87, earth:101, end:107 };
const DURATION = 114;
const CUTS = [S.gal, S.obs, S.ecl, S.puz, S.idea, S.acad, S.nov, S.speed, S.earth, S.end];
const CAPTURE = !!window.__CAPTURE;
//@@HELPERS@@

/* ====================================================================== */
/*  Characters - smooth mannequin style, 17th-century clothes              */
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
    if(o.buckle) mesh(foot,bx(0.18,0.1,0.08),o.buckle,0,0.12,0.42,{cast:false});
    P[s<0?'hipL':'hipR']=hip; P[s<0?'kneeL':'kneeR']=knee;
  }
  mesh(body,cap(0.5,1.45),o.top,0,5.0,0,{s:[1.06,1,0.74]});
  if(o.coat){ mesh(body,cyl(0.52,0.8,2.05,28),o.coat,0,3.62,0); }
  if(o.buttons) for(let k=0;k<6;k++) mesh(body,sph(0.06,8),o.buttons,0,3.0+k*0.5,k<3?0.6+k*0.05:0.42,{cast:false});
  if(o.cravat){ mesh(body,sph(0.2,14),'#ffffff',0,5.85,0.3,{s:[1.1,0.9,0.6],cast:false}); mesh(body,sph(0.14,12),'#ffffff',0,5.45,0.36,{s:[0.9,1.6,0.5],cast:false}); }
  for(const s of [-1,1]){
    const sh=grp(body,s*0.64,5.82,0);
    mesh(sh,cap(0.14,1.1),o.sleeve||o.top,0,-0.6,0);
    const el=grp(sh,0,-1.22,0);
    mesh(el,cap(0.13,0.95),o.forearm||o.sleeve||o.top,0,-0.52,0);
    if(o.cuffs) mesh(el,cyl(0.19,0.17,0.22,16),o.cuffs,0,-0.9,0,{cast:false});
    mesh(el,sph(0.16,16),o.skin,0,-1.12,0);
    P[s<0?'shL':'shR']=sh; P[s<0?'elL':'elR']=el;
  }
  mesh(body,cyl(0.15,0.17,0.45,16),o.skin,0,6.12,0);
  const head=grp(body,0,6.28,0); P.head=head;
  mesh(head,sph(0.78,40),o.skin,0,0.75,0,{s:[0.97,1.06,0.97]});
  mesh(head,sph(0.11,16),o.skin,0,0.66,0.78);
  for(const s of [-1,1]){ mesh(head,sph(0.07,12),'#2a211d',s*0.26,0.86,0.68,{cast:false}); mesh(head,sph(0.13,12),o.skin,s*0.76,0.74,0,{s:[0.55,1,0.8]}); }
  mesh(head,sph(0.08,12),'#a4524f',0,0.43,0.71,{s:[1.7,0.55,0.6],cast:false});
  if(o.wig){
    mesh(head,sph(0.82,32),o.wig,0,1.06,-0.2,{s:[1.04,0.72,1.0]});
    for(const s of [-1,1]){ mesh(head,sph(0.42,20),o.wig,s*0.74,0.42,-0.12,{s:[0.75,1.45,1.0]}); mesh(head,sph(0.4,20),o.wig,s*0.72,-0.3,-0.1,{s:[0.75,1.35,0.95]}); }
    mesh(head,sph(0.62,24),o.wig,0,0.2,-0.42,{s:[1.25,1.55,0.75]});
  }
  if(o.hair) mesh(head,sph(0.8,32),o.hair,0,0.6,-0.1,{s:[1.0,0.62,0.95]});
  if(o.beard){ mesh(head,sph(0.5,28),o.beard,0,0.28,0.3,{s:[1.15,0.95,0.8]}); mesh(head,sph(0.14,12),o.beard,0,0.5,0.74,{s:[2.0,0.6,0.7]}); }
  if(o.capHat) mesh(head,sph(0.8,24),o.capHat,0,1.15,-0.05,{s:[1.02,0.45,1.02]});
  return P;
}
function resetP(P){ P.body.position.set(0,0,0); P.body.rotation.set(0,0,0); for(const k of ['hipL','hipR','kneeL','kneeR','shL','shR','elL','elR']) P[k].rotation.set(0,0,0); P.head.rotation.set(0,0,0); }
function wave(P,side,t){ const sh=side>0?P.shR:P.shL, el=side>0?P.elR:P.elL; sh.rotation.z=side*2.5; el.rotation.z=side*(0.35+0.35*Math.sin(t*10)); }
function sit(P){ P.hipL.rotation.x=P.hipR.rotation.x=-1.5; P.kneeL.rotation.x=P.kneeR.rotation.x=1.5; P.body.position.y=-1.45; }
const ROEMER={skin:'#f2cba8',top:'#2f4a8a',coat:'#2f4a8a',sleeve:'#2f4a8a',buttons:'#e8c25a',cravat:true,cuffs:'#ffffff',legs:'#f1ede4',thigh:'#2b2b3a',shoes:'#1a1a1a',buckle:'#e8c25a',wig:'#6b4528'};
const CASSINI={skin:'#eec1a0',top:'#8a2f3a',coat:'#8a2f3a',sleeve:'#8a2f3a',buttons:'#e8c25a',cravat:true,cuffs:'#ffffff',legs:'#e9e4da',thigh:'#2e2a2a',shoes:'#1a1a1a',buckle:'#e8c25a',wig:'#d8d4ce'};
const SAV=[['#3f6e4f','#e2ddd2'],['#6b4a32','#4a3020'],['#5a3f7a','#2a1c14'],['#2f6a7a','#b9a58a']].map(([c,w])=>({skin:'#efc6a6',top:c,coat:c,sleeve:c,buttons:'#e8c25a',cravat:true,cuffs:'#ffffff',legs:'#e9e4da',thigh:'#2e2a2a',shoes:'#1a1a1a',wig:w}));
const GALILEO={skin:'#eec1a0',top:'#2a2a33',coat:'#2a2a33',sleeve:'#2a2a33',legs:'#2a2a33',thigh:'#2a2a33',shoes:'#1a1a1a',beard:'#e6e2dc',hair:'#e6e2dc'};
const HELPER={skin:'#e3b088',top:'#7a5a3a',coat:'#7a5a3a',sleeve:'#7a5a3a',legs:'#5a4a3a',thigh:'#5a4a3a',shoes:'#3a2a1a',hair:'#3a2a20'};

/* ====================================================================== */
/*  Earth texture                                                          */
/* ====================================================================== */
//@@WORLD@@
const earthMat=new T.MeshLambertMaterial({map:worldTex});
const jupTex=canvasTex(1024,512,(g,w,h)=>{ const b=['#e9d6b3','#c99a6a','#f1e2c6','#b8804f','#e7cfa6','#c08a5a','#f3e6cc','#a9744a','#e9d6b3'];
  b.forEach((c,i)=>{ g.fillStyle=c; g.fillRect(0,i*h/b.length,w,h/b.length+1); });
  for(let i=0;i<40;i++){ g.fillStyle=`rgba(255,255,255,${0.05+hash(i)*0.08})`; g.fillRect(hash(i*3)*w,hash(i*7)*h,80+hash(i)*200,6); }
  g.fillStyle='#c4573a'; g.beginPath(); g.ellipse(w*0.62,h*0.64,46,26,0,0,Math.PI*2); g.fill(); });

/* ====================================================================== */
/*  SCENE: solar system (top view) + Jupiter close-ups                     */
/* ====================================================================== */
const sol=new T.Scene(); sol.background=gradTex([[0,'#04061a'],[0.6,'#0b1238'],[1,'#141a4a']]);
const solCam=new T.PerspectiveCamera(40,LW/LH,0.05,3000);
sol.add(new T.AmbientLight('#8a94c8',0.22));
const sunPL=new T.PointLight('#fff2d6',1.9,0,0); sol.add(sunPL);
(function(){ const n=2200,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const v=V(R()-0.5,R()-0.5,R()-0.5).normalize().multiplyScalar(900+R()*300); pos.set([v.x,v.y,v.z],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); sol.add(new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2.2,sizeAttenuation:false}))); })();
const RE=10, RJ=28;
mesh(sol,sph(2.2,40),bas('#ffd23f'),0,0,0,{cast:false,recv:false}); const sunGlow=glowSprite('rgba(255,200,80,1)',10); sol.add(sunGlow);
function ringLine(r,col,dash,op){ const pts=[]; for(let i=0;i<=256;i++){ const a=i/256*Math.PI*2; pts.push(V(r*Math.cos(a),0,-r*Math.sin(a))); }
  const g=new T.BufferGeometry().setFromPoints(pts); const m=dash?new T.LineDashedMaterial({color:col,dashSize:0.6,gapSize:0.45,transparent:true,opacity:op||0.8}):new T.LineBasicMaterial({color:col,transparent:true,opacity:op||0.8}); const l=new T.Line(g,m); if(dash) l.computeLineDistances(); return l; }
sol.add(ringLine(RE,'#6fa8ff',true,0.85)); const jOrbit=ringLine(RJ,'#d9b38a',true,0.35); sol.add(jOrbit);
const earth=grp(sol,0,0,0); const earthBall=mesh(earth,new T.SphereGeometry(0.7,48,32),earthMat,0,0,0,{cast:false,recv:false}); const earthGlow=glowSprite('rgba(110,170,255,1)',3.0); earth.add(earthGlow);
const ghost=grp(sol,0,0,0); mesh(ghost,sph(0.7,32),new T.MeshBasicMaterial({color:'#6fa8ff',transparent:true,opacity:0.35}),0,0,0,{cast:false}); ghost.visible=false;
const jup=grp(sol,RJ,0,0); const jupBall=mesh(jup,new T.SphereGeometry(1.4,64,40),new T.MeshLambertMaterial({map:jupTex}),0,0,0,{cast:false,recv:false});
const shadowCone=mesh(jup,cyl(1.38,1.38,14,40,),new T.MeshBasicMaterial({color:'#000000',transparent:true,opacity:0.55,depthWrite:false}),7.0,0,0,{rz:Math.PI/2,cast:false,recv:false});
const ioOrbit=(function(){ const pts=[]; for(let i=0;i<=128;i++){ const a=i/128*Math.PI*2; pts.push(V(2.6*Math.cos(a),0,-2.6*Math.sin(a))); } const l=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:'#f2d16b',transparent:true,opacity:0.45})); jup.add(l); return l; })();
const ioMat=new T.MeshBasicMaterial({color:'#f2d16b'}); const io=mesh(jup,sph(0.22,24),ioMat,2.6,0,0,{cast:false}); const ioGlow=glowSprite('rgba(255,220,120,1)',1.4); io.add(ioGlow);
const moons=[[3.5,'#cfc6b6',0.18,1.3],[4.4,'#a99a85',0.26,2.4],[5.4,'#8e8478',0.24,4.1]].map(([r,c,s,ph])=>{ const m=mesh(jup,sph(s,16),new T.MeshLambertMaterial({color:c}),r,0,0,{cast:false}); m.userData={r,ph}; return m; });
const pulses=[]; for(let i=0;i<12;i++){ const s=glowSprite('rgba(255,236,140,1)',1.6); sol.add(s); s.visible=false; pulses.push(s); }
const trailDots=new T.InstancedMesh(sph(0.08,8),bas('#ffe58a'),400); trailDots.count=0; trailDots.frustumCulled=false; sol.add(trailDots);
const IO_DARK=new T.Color('#1a1a24'), IO_BRIGHT=new T.Color('#f2d16b');
function earthAt(th){ return V(RE*Math.cos(th),0,-RE*Math.sin(th)); }
function setIo(angle){ io.position.set(2.6*Math.cos(angle),0,-2.6*Math.sin(angle)); const inShadow=io.position.x>0&&Math.abs(io.position.z)<1.38; const k=inShadow?0:1; ioMat.color.copy(IO_DARK).lerp(IO_BRIGHT,k); ioGlow.visible=!inShadow; return inShadow; }
function setMoons(t){ moons.forEach(m=>{ const a=m.userData.ph+t*0.35/m.userData.r; m.position.set(m.userData.r*Math.cos(a),0,-m.userData.r*Math.sin(a)); }); }
function hidePulses(){ pulses.forEach(p=>p.visible=false); trailDots.count=0; }

/* ====================================================================== */
/*  SCENE: Galileo's lanterns on two hills (dusk)                          */
/* ====================================================================== */
const gal=new T.Scene(); gal.background=gradTex([[0,'#1e2160'],[0.45,'#5a3f8a'],[0.75,'#e0806a'],[1,'#f6c58a']]); gal.fog=new T.Fog('#c9907a',80,260);
const galCam=new T.PerspectiveCamera(40,LW/LH,0.1,1000);
gal.add(new T.HemisphereLight('#b9b0ff','#4a3a5a',0.75)); const galSun=new T.DirectionalLight('#ffb27a',0.7); galSun.position.set(-40,20,30); gal.add(galSun);
mesh(gal,new T.PlaneGeometry(800,400),'#3c5a3a',0,-2,0,{rx:-Math.PI/2,cast:false});
const hillL=mesh(gal,sph(30,48),'#4f7a45',-34,-2,-6,{s:[1,0.3,0.6],cast:false}); const hillR=mesh(gal,sph(30,48),'#557f4a',34,-2,-10,{s:[1,0.3,0.6],cast:false});
for(let i=0;i<10;i++){ const x=-80+i*18, h=12+hash(i)*10; mesh(gal,sph(20,24),'#3a4a6a',x,-6,-90-hash(i+3)*30,{s:[1.2,h/20,0.6],cast:false}); }
const galileo=person(GALILEO); gal.add(galileo.root); galileo.root.position.set(-34,7,-6); galileo.root.rotation.y=Math.PI/2-0.15;
const helper=person(HELPER); gal.add(helper.root); helper.root.position.set(34,7,-10); helper.root.rotation.y=-Math.PI/2+0.15;
function lantern(P){ const g=grp(P.elR,0,-1.45,0.1); mesh(g,cyl(0.22,0.26,0.5,10),'#5a4a3a',0,0,0); mesh(g,cyl(0.03,0.03,0.4,6),'#3a2a1a',0,0.42,0); const gl=glowSprite('rgba(255,210,120,1)',5); gl.position.set(0,0,0); g.add(gl); return gl; }
const lampG=lantern(galileo), lampH=lantern(helper);
const galBeam=mesh(gal,cyl(0.18,0.18,1,10),new T.MeshBasicMaterial({color:'#ffe58a',transparent:true,opacity:0.9,blending:T.AdditiveBlending,depthWrite:false}),0,0,0,{cast:false,recv:false}); galBeam.visible=false;

/* ====================================================================== */
/*  SCENE: terrace of the Paris Observatory (night / dawn)                  */
/* ====================================================================== */
const obs=new T.Scene(); const nightSky=gradTex([[0,'#060a28'],[0.6,'#141c4e'],[1,'#2a2a62']]), dawnSky=gradTex([[0,'#3c4a9a'],[0.55,'#8a7ab8'],[0.85,'#f1a37a'],[1,'#ffd09a']]);
obs.background=nightSky;
const obsCam=new T.PerspectiveCamera(40,LW/LH,0.1,600);
const obsHemi=new T.HemisphereLight('#9fb0ff','#3a3450',0.5); obs.add(obsHemi);
const moonL=new T.DirectionalLight('#c8d4ff',0.55); moonL.position.set(-20,30,25); moonL.castShadow=true; moonL.shadow.mapSize.set(2048,2048); Object.assign(moonL.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:120}); moonL.shadow.bias=-0.0005; obs.add(moonL);
const candle=new T.PointLight('#ffc26a',1.4,22,1.6); candle.position.set(7.4,4.6,1.4); obs.add(candle);
(function(){ const n=900,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const a=R()*Math.PI*2, e=0.15+R()*1.3; pos.set([Math.cos(a)*Math.cos(e)*300,Math.sin(e)*300,Math.sin(a)*Math.cos(e)*300-60],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); const m=new T.PointsMaterial({color:'#ffffff',size:2,sizeAttenuation:false,transparent:true}); obs.userData.stars=m; obs.add(new T.Points(g,m)); })();
(function(){
  const tiles=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#cfc4b0'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(90,80,60,0.35)'; g.lineWidth=4; for(let i=0;i<=8;i++){ g.beginPath(); g.moveTo(i*64,0); g.lineTo(i*64,h); g.stroke(); g.beginPath(); g.moveTo(0,i*64); g.lineTo(w,i*64); g.stroke(); } });
  tiles.wrapS=tiles.wrapT=T.RepeatWrapping; tiles.repeat.set(8,8);
  mesh(obs,new T.PlaneGeometry(60,40),new T.MeshLambertMaterial({map:tiles}),0,0,0,{rx:-Math.PI/2,cast:false});
  for(let x=-20;x<=20;x+=1.6) mesh(obs,cyl(0.18,0.24,1.4,10),'#d8cfbd',x,0.7,8.5); mesh(obs,bx(41,0.3,0.7),'#e3dac8',0,1.55,8.5);
  const b=grp(obs,0,0,-16);
  mesh(b,bx(30,11,9),'#ddd2bd',0,5.5,0); mesh(b,bx(31,0.6,9.6),'#cfc4ae',0,11.2,0);
  for(const s of [-1,1]){ mesh(b,cyl(5,5,14,8),'#e3d9c6',s*16,7,0.5); mesh(b,cyl(5.3,5.3,0.6,8),'#cfc4ae',s*16,14.2,0.5); }
  mesh(b,bx(7,13.5,9.4),'#e6dccb',0,6.75,0.3); mesh(b,G('dome',()=>new T.SphereGeometry(3,24,12,0,Math.PI*2,0,Math.PI/2)),'#9aa6b8',0,13.5,0.3);
  for(let r=0;r<2;r++) for(let k=0;k<8;k++){ const x=-13+k*3.7; if(Math.abs(x)<3.6) continue; const lit=hash(r*13+k)<0.45; mesh(b,bx(1.3,2.4,0.2),lit?'#ffd27a':'#33405e',x,3+r*4.2,4.55,{basic:lit,cast:false}); }
  mesh(b,bx(2.2,3.6,0.2),'#5a3a24',0,1.8,4.8,{cast:false});
})();
const PIV=V(-3.4,8.7,0.4), TDIR=V(-0.75,0.45,-0.48).normalize();
const scopeG=grp(obs,PIV.x,0,PIV.z);
(function(){ const st=grp(scopeG,0,0,0); for(let i=0;i<3;i++){ const a=i*2.094+0.3; const leg=grp(st,0,0,0); leg.rotation.y=a; const L=mesh(leg,cyl(0.09,0.13,PIV.y+0.4,8),'#6b4428',0,PIV.y/2,0.9); L.rotation.x=-0.1; } mesh(st,bx(0.6,0.6,0.6),'#4a2f1c',0,PIV.y-0.2,0); })();
const tube=grp(obs,PIV.x,PIV.y,PIV.z); tube.quaternion.setFromUnitVectors(V(1,0,0),TDIR);
mesh(tube,cyl(0.26,0.34,9,20),'#c9a36a',1.0,0,0,{rz:Math.PI/2}); for(const x of [-3.2,-0.6,2.6,5.3]) mesh(tube,cyl(0.38,0.38,0.25,20),'#7a5232',x,0,0,{rz:Math.PI/2}); mesh(tube,cyl(0.12,0.14,0.6,12),'#3a2a1a',-3.8,0,0,{rz:Math.PI/2});
const EYEP=PIV.clone().add(TDIR.clone().multiplyScalar(-3.9));
const clock=grp(obs,5.4,0,-1.4);
mesh(clock,bx(1.5,6.4,1.0),'#5a3820',0,3.2,0); mesh(clock,bx(1.8,0.4,1.2),'#4a2c18',0,6.6,0); mesh(clock,cyl(0.55,0.55,0.08,32),'#f8f2e4',0,5.4,0.52,{rx:Math.PI/2,cast:false});
const handH=mesh(clock,bx(0.06,0.32,0.03),'#1a1a1a',0,5.55,0.58,{cast:false}), handM=mesh(clock,bx(0.04,0.46,0.03),'#1a1a1a',0,5.6,0.6,{cast:false});
mesh(clock,bx(1.0,3.4,0.05),new T.MeshBasicMaterial({color:'#1a1410'}),0,2.9,0.52,{cast:false});
const pend=grp(clock,0,4.4,0.56); mesh(pend,bx(0.05,2.6,0.03),'#d8b25a',0,-1.3,0,{cast:false,basic:true}); mesh(pend,cyl(0.28,0.28,0.06,24),'#e8c25a',0,-2.6,0,{rx:Math.PI/2,cast:false,basic:true});
const tableO=grp(obs,7.0,0,1.6); mesh(tableO,bx(2.6,0.2,1.6),'#7a4e30',0,3.0,0); for(const [x,z] of [[-1.1,-0.6],[1.1,-0.6],[-1.1,0.6],[1.1,0.6]]) mesh(tableO,bx(0.16,3.0,0.16),'#5a3820',x,1.5,z);
mesh(tableO,bx(1.0,0.18,0.7),'#f3e6c8',-0.5,3.18,0.1); mesh(tableO,cyl(0.1,0.12,0.5,10),'#f6efe0',0.6,3.35,-0.2); const flame=glowSprite('rgba(255,200,100,1)',1.8); flame.position.set(0.6,3.75,-0.2); tableO.add(flame);
const jupDot=glowSprite('rgba(255,236,180,1)',4); jupDot.position.set(-22,16,-30); obs.add(jupDot);
const roemer=person(ROEMER); obs.add(roemer.root);
const cassini=person(CASSINI); obs.add(cassini.root);
const book=mesh(cassini.elL,bx(0.7,0.95,0.14),'#7a2f2a',0.15,-1.2,0.25,{cast:false});

/* ====================================================================== */
/*  SCENE: the Académie royale des sciences                                 */
/* ====================================================================== */
const acad=new T.Scene(); acad.background=new T.Color('#3a2a20');
const acCam=new T.PerspectiveCamera(40,LW/LH,0.1,300);
acad.add(new T.HemisphereLight('#fff2dc','#5a4030',0.65)); const acL=new T.DirectionalLight('#fff0d8',0.75); acL.position.set(-14,20,18); acL.castShadow=true; acL.shadow.mapSize.set(2048,2048); Object.assign(acL.shadow.camera,{left:-16,right:16,top:16,bottom:-16,near:1,far:120}); acL.shadow.bias=-0.0005; acad.add(acL);
(function(){
  const parq=canvasTex(512,512,(g,w,h)=>{ for(let i=0;i<16;i++) for(let j=0;j<4;j++){ g.fillStyle=(i+j)%2?'#a8743f':'#b9844b'; g.fillRect(j*128+(i%2)*64,i*32,128,32);} });
  parq.wrapS=parq.wrapT=T.RepeatWrapping; parq.repeat.set(6,6);
  mesh(acad,new T.PlaneGeometry(70,50),new T.MeshLambertMaterial({map:parq}),0,0,0,{rx:-Math.PI/2,cast:false});
  mesh(acad,bx(70,18,1),'#7a5236',0,9,-10,{cast:false});
  for(let k=-4;k<=4;k++){ mesh(acad,bx(5,6,0.3),'#8a6244',k*6.4,4,-9.4,{cast:false}); if(k%2===0){ mesh(acad,bx(3.4,7,0.2),'#bfe0ff',k*6.4,12.2,-9.4,{basic:true,cast:false}); mesh(acad,bx(3.8,7.4,0.15),'#e8d8b8',k*6.4,12.2,-9.45,{cast:false}); } }
  const tb=grp(acad,1.5,0,-3.2); mesh(tb,bx(14,0.3,3.2),'#2f6b4a',0,3.0,0); mesh(tb,bx(14.1,2.6,0.08),'#2f6b4a',0,1.75,1.62);
  for(let i=0;i<4;i++) mesh(tb,cyl(0.14,0.14,0.9,10),'#f3e6c8',-4+i*2.6,3.3,0.6,{rz:Math.PI/2,ry:0.3*i});
})();
const chart=canvasTex(800,600,(g,w,h)=>{ g.fillStyle='#f6ecd2'; g.fillRect(0,0,w,h); g.strokeStyle='#3a2a1a'; g.lineWidth=6; g.strokeRect(10,10,w-20,h-20);
  g.fillStyle='#e8a83a'; g.beginPath(); g.arc(300,300,34,0,Math.PI*2); g.fill(); g.setLineDash([12,10]); g.lineWidth=4; g.strokeStyle='#3a5a9a'; g.beginPath(); g.arc(300,300,150,0,Math.PI*2); g.stroke(); g.setLineDash([]);
  g.fillStyle='#3a6ad0'; g.beginPath(); g.arc(450,300,18,0,Math.PI*2); g.fill(); g.beginPath(); g.arc(150,300,18,0,Math.PI*2); g.fill();
  g.fillStyle='#b8804f'; g.beginPath(); g.arc(700,300,40,0,Math.PI*2); g.fill(); g.strokeStyle='#d8a020'; g.lineWidth=4; g.setLineDash([8,8]); g.beginPath(); g.moveTo(660,300); g.lineTo(150,300); g.stroke(); g.setLineDash([]);
  g.fillStyle='#8a1f1f'; g.font='bold 52px serif'; g.textAlign='center'; g.fillText('9 nov. 1676 : +10 min',w/2,120); g.font='italic 34px serif'; g.fillStyle='#3a2a1a'; g.fillText('la lumière prend du temps',w/2,540); });
const easel=grp(acad,-8.6,0,-1.0); for(const [x,r] of [[-1.2,0.12],[1.2,-0.12]]) mesh(easel,cyl(0.08,0.08,7,8),'#5a3820',x,3.5,0,{rz:r}); mesh(easel,bx(4.6,3.4,0.12),new T.MeshLambertMaterial({map:chart}),0,5.0,0.12,{cast:false});
const roemerA=person(ROEMER); acad.add(roemerA.root);
const cassiniA=person(CASSINI); acad.add(cassiniA.root);
const savants=SAV.map((o,i)=>{ const P=person(o); acad.add(P.root); const ch=grp(acad,-3.4+i*3.3,0,-5.6); mesh(ch,bx(1.6,0.25,1.6),'#5a3820',0,2.45,0.2); mesh(ch,bx(1.6,3.4,0.2),'#5a3820',0,4.1,-0.6); P.root.position.set(-3.4+i*3.3,0,-5.4); return P; });

/* ====================================================================== */
/*  SCENE: light circling the Earth                                        */
/* ====================================================================== */
const es=new T.Scene(); es.background=gradTex([[0,'#04061a'],[1,'#121a48']]);
const esCam=new T.PerspectiveCamera(40,LW/LH,0.1,2000);
es.add(new T.AmbientLight('#8fa0d8',0.45)); const esL=new T.DirectionalLight('#fff6e6',1.05); esL.position.set(-30,20,40); es.add(esL);
(function(){ const n=1400,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const v=V(R()-0.5,R()-0.5,R()-0.5).normalize().multiplyScalar(600); pos.set([v.x,v.y,v.z],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); es.add(new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2,sizeAttenuation:false}))); })();
const bigEarth=mesh(es,new T.SphereGeometry(6,96,64),earthMat,0,0,0,{cast:false,recv:false}); const bigHalo=glowSprite('rgba(120,190,255,1)',17); bigHalo.position.set(0,0,-1); es.add(bigHalo);
const lightRing=grp(es,0,0,0); lightRing.rotation.set(0.35,0,0.18);
const photon=glowSprite('rgba(255,240,160,1)',2.2); lightRing.add(photon);
const ringTrail=new T.InstancedMesh(sph(0.09,8),bas('#ffe58a'),160); ringTrail.frustumCulled=false; lightRing.add(ringTrail);

//@@OVERLAY@@
function clockFace(x,y,r,secs,label,labelEn,col,a){
  if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a;
  ctx.fillStyle='rgba(20,16,46,0.85)'; rrect(x-r-30,y-r-70,2*r+60,2*r+170,26); ctx.fill();
  ctx.fillStyle='#fbf6ea'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.strokeStyle=col||'#3a2a1a'; ctx.lineWidth=7; ctx.stroke();
  ctx.strokeStyle='#3a2a1a'; ctx.lineWidth=3; for(let i=0;i<12;i++){ const an=i/12*Math.PI*2; ctx.beginPath(); ctx.moveTo(x+Math.sin(an)*r*0.82,y-Math.cos(an)*r*0.82); ctx.lineTo(x+Math.sin(an)*r*0.94,y-Math.cos(an)*r*0.94); ctx.stroke(); }
  const h=(secs/3600)%12, m=(secs/60)%60, s=secs%60;
  const hand=(an,len,w,c)=>{ ctx.strokeStyle=c; ctx.lineWidth=w; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+Math.sin(an)*len,y-Math.cos(an)*len); ctx.stroke(); };
  hand(h/12*Math.PI*2,r*0.5,8,'#1a1a1a'); hand(m/60*Math.PI*2,r*0.75,5,'#1a1a1a'); hand(s/60*Math.PI*2,r*0.85,2,'#c0392b');
  ctx.restore();
  const hh=Math.floor(secs/3600)%24, mm=Math.floor(secs/60)%60, ss=Math.floor(secs)%60;
  txt(`${hh} h ${String(mm).padStart(2,'0')} min ${String(ss).padStart(2,'0')} s`,x,y+r+38,30,{alpha:a,shadow:false,fill:'#ffffff'});
  txt(labelEn?L2(label,labelEn):label,x,y-r-30,30,{alpha:a,weight:600,shadow:false,fill:col||'#ffffff'});
}
function stopwatch(x,y,val,sub,a){
  if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='rgba(20,16,46,0.88)'; rrect(x-200,y-70,400,140,28); ctx.fill(); ctx.restore();
  if(sub&&sub.includes(' · ')){ const q=sub.split(' · '); sub=L2(q[0],q[1]); } txt(val,x,y-10,58,{alpha:a,fill:'#ffd84a',shadow:false}); if(sub) txt(sub,x,y+42,28,{alpha:a,weight:500,fill:'#ffe39a',shadow:false,maxW:370});
}
const sp=v=>scrV(v,solCam);
const mmss=m=>{ const mi=Math.floor(Math.abs(m)), se=Math.round((Math.abs(m)-mi)*60); return (m<0?'−':'+')+mi+' min '+String(se).padStart(2,'0')+' s'; };

/* ====================================================================== */
/*  Scene updates                                                          */
/* ====================================================================== */
function renderAt(t){
  t=clamp(t,0,DURATION);
  ctx.setTransform(SCL,0,0,SCL,0,0); ctx.clearRect(0,0,LW,LH);
  if(t<S.gal) doIntro(t);
  else if(t<S.obs) doGalileo(t);
  else if(t<S.ecl) doObs(t,false);
  else if(t<S.puz) doEclipse(t);
  else if(t<S.idea) doPuzzle(t);
  else if(t<S.acad) doIdea(t);
  else if(t<S.nov) doAcad(t);
  else if(t<S.speed) doNov(t);
  else if(t<S.earth) doSpeed(t);
  else if(t<S.end) doEarth(t);
  else doObs(t,true);
  let v=0; CUTS.forEach(c=>{ v=Math.max(v,1-smooth(Math.abs(t-c)/0.28)); }); veil(v);
  if(t<0.4) veil(1-smooth(t/0.4)); if(t>DURATION-0.6) veil(smooth(seg(t,DURATION-0.6,DURATION)));
}
function solDefaults(){ shadowCone.visible=true; ioOrbit.visible=true; jOrbit.visible=true; ghost.visible=false; hidePulses(); earthBall.rotation.y=0; sunGlow.visible=true; jupBall.rotation.y=0; }
function topCam(cx,cz,dist,tilt){ solCam.fov=40; solCam.updateProjectionMatrix(); solCam.position.set(cx,dist*Math.cos(tilt),cz+dist*Math.sin(tilt)); solCam.lookAt(cx,0,cz); }

function doIntro(t){
  solDefaults(); jup.position.set(RJ*Math.cos(0.5),0,-RJ*Math.sin(0.5));
  earth.position.copy(earthAt(t*0.35+0.3)); earthBall.rotation.y=t*0.8; setIo(t*1.4); setMoons(t*3); jupBall.rotation.y=t*0.3;
  const u=easeInOut(seg(t,0,6.5)); const d=lerp(95,62,u); topCam(lerp(6,10,u),lerp(-6,-8,u),d,lerp(0.9,0.75,u));
  renderer.render(sol,solCam);
  txt(L2('Comment Ole Rømer a mesuré la vitesse de la lumière','How Ole Rømer measured the speed of light'),960,120,70,{alpha:smooth(seg(t,0.5,1.2)),stroke:'#1b1446',sw:0.14,scale:backOut(seg(t,0.5,1.0)),maxW:1760});
  txt('Paris, 1676',960,206,40,{alpha:smooth(seg(t,1.0,1.6)),weight:600,fill:'#ffe39a',stroke:'#1b1446',sw:0.14});
  const la=smooth(seg(t,2.2,2.8)); if(la>0){ const pS=sp(V(0,0,0)), pE=sp(earth.position), pJ=sp(jup.position);
    txt(L2('Soleil','Sun'),pS.x,pS.y+70,32,{alpha:la,fill:'#ffd84a'}); txt(L2('Terre','Earth'),pE.x,pE.y+46,30,{alpha:la,fill:'#9fc7ff'}); txt('Jupiter',pJ.x,pJ.y+70,30,{alpha:la,fill:'#e9c79a'});
    txt(L2('(pas à l\'échelle)','(not to scale)'),1700,860,26,{alpha:la*0.8,weight:500,fill:'#c9c4e8'}); }
}

function doGalileo(t){
  const l=t-S.gal; [galileo,helper].forEach(resetP);
  const close=easeInOut(seg(l,5.6,7.2));
  galCam.position.lerpVectors(V(0,16,62),V(-27,13.5,10),close); galCam.lookAt(new T.Vector3().lerpVectors(V(0,7,-8),V(-34,11,-6),close));
  galileo.shR.rotation.x=-1.25; helper.shR.rotation.x=-1.25; galileo.elR.rotation.x=-0.2; helper.elR.rotation.x=-0.2;
  const flashes=[1.0,2.4,3.8]; let fg=0.35, fh=0.35; galBeam.visible=false;
  flashes.forEach(f=>{ const a=l-f; if(a>=0&&a<0.6){ fg=Math.max(fg,1.6*(1-a/0.6)+0.35); if(a<0.35){ galBeam.visible=true; const p0=V(-34,9.6,-5.6), p1=V(34,9.6,-9.6); const u=Math.min(1,a/0.05); const e=p0.clone().lerp(p1,u); const mid=p0.clone().add(e).multiplyScalar(0.5); galBeam.position.copy(mid); galBeam.scale.set(1,p0.distanceTo(e)||0.001,1); galBeam.quaternion.setFromUnitVectors(V(0,1,0),e.clone().sub(p0).normalize()); galBeam.material.opacity=0.9*(1-a/0.35); } }
    const b=a-0.05; if(b>=0&&b<0.6) fh=Math.max(fh,1.6*(1-b/0.6)+0.35); });
  lampG.scale.setScalar(5*fg); lampH.scale.setScalar(5*fh);
  if(l>5.4){ const sh=smooth(seg(l,5.6,6.2)); galileo.shL.rotation.z=-0.9*sh; galileo.shR.rotation.z=0.9*sh; galileo.shR.rotation.x=-1.25*(1-sh); galileo.elL.rotation.x=-1.2*sh; galileo.elR.rotation.x=-1.2*sh; galileo.head.rotation.z=0.18*Math.sin(l*3)*sh; }
  renderer.render(gal,galCam);
  if(l<5.4){ const pg=scrV(V(-34,16.5,-6),galCam), ph=scrV(V(34,16.5,-10),galCam), a=smooth(seg(l,0.3,0.7)); tag(pg.x,pg.y-40,'Galilée','Galileo',a); tag(ph.x,ph.y-40,'Son assistant','His assistant',a); }
  const qa=smooth(seg(l,1.2,1.6))*(1-smooth(seg(l,5.2,5.6))); stopwatch(960,110,L2('0,000… s ?','0.000… s ?'),'temps mesuré · measured time',qa);
  if(l>6.2){ const p=scrV(V(-34,16,-6),galCam); txt(L2('Trop rapide !','Too fast!'),p.x+330,p.y-10,64,{alpha:smooth(seg(l,6.3,6.7)),stroke:'#1b1446',sw:0.14,scale:backOut(seg(l,6.3,6.7))}); }
  caption(t,S.gal+0.3,S.gal+5.4,'Au XVIIe siècle, on se demande : la lumière arrive-t-elle instantanément ?','In the 17th century, people wondered: does light arrive instantly?');
  caption(t,S.gal+5.5,S.obs,'Galilée essaie avec deux lanternes sur deux collines : bien trop rapide pour être mesuré !','Galileo tries with two lanterns on two hills: far too fast to measure!');
}

function doObs(t,ending){
  [roemer,cassini].forEach(resetP);
  obs.background=ending?dawnSky:nightSky; obs.userData.stars.opacity=ending?0.25:1; obsHemi.intensity=ending?0.75:0.5; jupDot.visible=!ending;
  const swing=Math.sin(t*Math.PI); pend.rotation.z=0.22*swing;
  const secs=ending?6*3600+2*60:(22*3600+14*60+(t-S.obs)*1);
  handM.rotation.z=-((secs/60)%60)/60*Math.PI*2; handH.rotation.z=-((secs/3600)%12)/12*Math.PI*2;
  handM.position.set(Math.sin(-handM.rotation.z)*0.2,5.4+Math.cos(handM.rotation.z)*0.2,0.6); handH.position.set(Math.sin(-handH.rotation.z)*0.14,5.4+Math.cos(handH.rotation.z)*0.14,0.58);
  if(!ending){
    const l=t-S.obs;
    obsCam.position.set(lerp(1.5,0.5,l/11),lerp(8.5,7.6,l/11),lerp(24,19,l/11)); obsCam.lookAt(0.8,5.2,-1);
    roemer.root.position.set(EYEP.x+0.62,0,EYEP.z+0.25); roemer.root.rotation.y=-1.25; roemer.body.rotation.x=0.04; roemer.head.rotation.x=-0.05;
    roemer.shR.rotation.x=-1.35; roemer.elR.rotation.x=-0.5; roemer.shL.rotation.x=-1.2; roemer.elL.rotation.x=-0.7;
    cassini.root.position.set(3.4,0,2.7); cassini.root.rotation.y=-0.65; cassini.shL.rotation.x=-0.9; cassini.elL.rotation.x=-0.9; cassini.shR.rotation.x=-0.7; cassini.elR.rotation.x=-1.1+0.15*Math.sin(t*6);
    cassini.head.rotation.x=0.25; cassini.head.rotation.y=l>5.6?0.8*smooth(seg(l,5.6,6.2)):0;
    renderer.render(obs,obsCam);
    const pr=scr(roemer.head,obsCam,V(0,1.9,0)), pc=scr(cassini.head,obsCam,V(0,1.9,0));
    tag(pr.x-170,pr.y-60,'Ole Rømer','Ole Rømer',smooth(seg(l,0.5,1.0))); tag(pc.x+190,pc.y-40,'Jean-Dominique Cassini','Giovanni Domenico Cassini',smooth(seg(l,0.8,1.3)));
    if(l>5.6){ const pk=scrV(V(5.4,5.4,-0.8),obsCam); txt(L2('horloge à pendule','pendulum clock'),pk.x+30,pk.y-130,34,{alpha:smooth(seg(l,5.8,6.3)),stroke:'#1b1446',sw:0.14}); const pj=scrV(jupDot.position,obsCam); txt('Jupiter',pj.x+70,pj.y,34,{alpha:smooth(seg(l,6.0,6.5)),fill:'#ffe9b0',stroke:'#1b1446',sw:0.14}); }
    caption(t,S.obs+0.3,S.obs+5.5,'1676, Observatoire de Paris : l\'astronome danois Ole Rømer travaille avec Cassini.','1676, Paris Observatory: Danish astronomer Ole Rømer works with Cassini.');
    caption(t,S.obs+5.6,S.ecl,'Ils chronomètrent Io, une lune de Jupiter, avec une horloge à pendule très précise.','They time Io, a moon of Jupiter, with a very precise pendulum clock.');
  } else {
    const l=t-S.end;
    obsCam.position.set(lerp(1.0,0.6,l/7),lerp(7.4,7.0,l/7),lerp(20,17,l/7)); obsCam.lookAt(0,5,0);
    roemer.root.position.set(-2.2,0,3.4); roemer.root.rotation.y=0.25; wave(roemer,1,t); roemer.body.position.y=Math.abs(Math.sin(t*4))*0.18;
    cassini.root.position.set(1.8,0,3.2); cassini.root.rotation.y=-0.25; cassini.head.rotation.x=0.18*Math.abs(Math.sin(t*3)); cassini.shL.rotation.x=-0.9; cassini.elL.rotation.x=-0.9; wave(cassini,1,t+1.2);
    renderer.render(obs,obsCam);
    caption(t,S.end+0.3,DURATION-0.3,'Grâce à Rømer, on sait depuis 1676 que la lumière a une vitesse !','Thanks to Rømer, we have known since 1676 that light has a speed!');
    txt(L2('FIN','THE END'),960,120,70,{alpha:smooth(seg(l,2.6,3.2)),stroke:'#1b1446',sw:0.14,scale:backOut(seg(l,2.6,3.1))});
  }
}

function doEclipse(t){
  solDefaults(); const l=t-S.ecl;
  jup.position.set(RJ,0,0); earth.position.copy(earthAt(0.35)); setMoons(t*2); jupBall.rotation.y=t*0.4;
  const ang=0.4+l*(Math.PI*2/6.2); const inSh=setIo(ang);
  solCam.fov=38; solCam.updateProjectionMatrix(); const o=V(RJ,0,0);
  solCam.position.copy(o.clone().add(V(lerp(-1.5,-0.5,l/12),lerp(7.5,6.5,l/12),lerp(10.5,9.5,l/12)))); solCam.lookAt(o.clone().add(V(2.4,-0.2,0)));
  renderer.render(sol,solCam);
  const pj=sp(V(RJ,0,0)); const sa=smooth(seg(l,0.4,0.9));
  for(let i=0;i<4;i++){ const y=pj.y-120+i*80; ctx.save(); ctx.globalAlpha=sa*0.85; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(60,y); ctx.lineTo(260,y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(260,y); ctx.lineTo(240,y-10); ctx.lineTo(240,y+10); ctx.closePath(); ctx.fillStyle='#ffd84a'; ctx.fill(); ctx.restore(); }
  txt(L2('Soleil →','Sun →'),160,pj.y-160,36,{alpha:sa,fill:'#ffd84a'});
  const ps=sp(V(RJ+7.5,0,0)); txt(L2('ombre de Jupiter','Jupiter\'s shadow'),ps.x,ps.y-80,36,{alpha:sa,stroke:'#0b0820',sw:0.14});
  const pi=scr(io,solCam); txt(inSh?L2('Io : éclipse !','Io: eclipse!'):'Io',pi.x,pi.y-46,inSh?38:32,{alpha:sa,fill:inSh?'#ff8a92':'#f2d16b',stroke:'#0b0820',sw:0.14});
  stopwatch(1680,120,L2('42 h 30','42.5 h'),'un tour d\'Io · one orbit of Io',smooth(seg(l,1.0,1.4)));
  caption(t,S.ecl+0.3,S.ecl+6.2,'Io fait le tour de Jupiter en 42 h 30. À chaque tour, elle passe dans l\'ombre de Jupiter et disparaît.','Io circles Jupiter every 42.5 hours. Each time, it passes into Jupiter\'s shadow and vanishes.');
  caption(t,S.ecl+6.3,S.puz,'Ces éclipses sont si régulières qu\'on peut prévoir leur heure à l\'avance.','These eclipses are so regular that their times can be predicted in advance.');
}

function delayAt(d){ return 11*(d-RJ)/RE; }
function doPuzzle(t){
  solDefaults(); const l=t-S.puz;
  jup.position.set(RJ,0,0); setIo(t*1.5); setMoons(t*2); jupBall.rotation.y=t*0.3;
  const th=lerp(0,Math.PI,smooth(seg(l,1.0,12.5))); earth.position.copy(earthAt(th)); earthBall.rotation.y=t;
  topCam(10.5,-6.5,44,0.45);
  renderer.render(sol,solCam);
  const pE=sp(earth.position), pJ=sp(V(RJ,0,0)); const d=earth.position.distanceTo(V(RJ,0,0));
  dashLine(pE,pJ,'rgba(255,255,255,0.7)',3,[12,10]); txt(L2('Terre','Earth'),pE.x,pE.y+50,30,{fill:'#9fc7ff'}); txt('Jupiter',pJ.x,pJ.y+70,30,{fill:'#e9c79a'});
  const delay=delayAt(d), a=smooth(seg(l,0.6,1.0));
  const base=21*3600; clockFace(330,230,105,base,'Prévue','Predicted','#9fc7ff',a); clockFace(640,230,105,base+delay*60,'Observée','Observed',delay>0.05?'#ff8a92':'#7dff8a',a);
  ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='rgba(20,16,46,0.85)'; rrect(1180,60,640,190,26); ctx.fill(); const x0=1240,x1=1760,y=170; ctx.strokeStyle='#ffffff'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x1,y); ctx.stroke();
  ctx.fillStyle='#7dff8a'; ctx.fillRect(x0,y-4,(x1-x0)/2,8); ctx.fillStyle='#ff8a92'; ctx.fillRect((x0+x1)/2,y-4,(x1-x0)/2,8);
  const mx2=lerp(x0,x1,(delay+11)/22); ctx.fillStyle='#ffd84a'; ctx.beginPath(); ctx.arc(mx2,y,16,0,Math.PI*2); ctx.fill(); ctx.restore();
  txt(L2('en avance','early'),x0+60,y+44,26,{alpha:a,weight:500,fill:'#7dff8a',shadow:false}); txt(L2('en retard','late'),x1-60,y+44,26,{alpha:a,weight:500,fill:'#ff8a92',shadow:false});
  txt(L2('écart : ','difference: ')+mmss(delay),(x0+x1)/2,y-62,32,{alpha:a,fill:'#ffd84a',shadow:false});
  caption(t,S.puz+0.3,S.puz+6.4,'Mais au fil des mois, les éclipses arrivent en avance… puis en retard !','But over the months, the eclipses come early… then late!');
  caption(t,S.puz+6.5,S.idea,'Terre près de Jupiter : en avance. Terre loin de Jupiter : en retard. Jusqu\'à 22 minutes d\'écart !','Earth near Jupiter: early. Earth far from Jupiter: late. Up to 22 minutes apart!');
}

function doIdea(t){
  solDefaults(); const l=t-S.idea;
  jup.position.set(RJ,0,0); setIo(0.25); setMoons(t*2);
  const E1=earthAt(0), E2=earthAt(Math.PI); earth.position.copy(E1); ghost.visible=true; ghost.position.copy(E2); earthBall.rotation.y=t;
  topCam(9.5,-2.0,43,0.5);
  const src=V(RJ,0,0).add(io.position); const v=5.0; const t0=1.2;
  const flight=(dst,k)=>{ const tt=l-t0-k*0.45; const D=src.distanceTo(dst); if(tt<0) return null; const u=Math.min(1,tt*v/D); return {p:src.clone().lerp(dst,u),u}; };
  let pi=0, n=0; const mm=new T.Matrix4();
  for(const dst of [E1,E2]) for(let k=0;k<3;k++){ const f=flight(dst,k); const sp2=pulses[pi++]; if(!f||f.u>=1){ sp2.visible=false; continue; } sp2.visible=true; sp2.position.copy(f.p);
    for(let j=1;j<8;j++){ const q=src.clone().lerp(f.p,Math.max(0,1-j*0.035*src.distanceTo(dst)/Math.max(0.01,src.distanceTo(f.p)))); mm.makeTranslation(q.x,q.y,q.z); if(n<400) trailDots.setMatrixAt(n++,mm); } }
  trailDots.count=n; trailDots.instanceMatrix.needsUpdate=true;
  renderer.render(sol,solCam);
  const p1=sp(E1), p2=sp(E2), pJ=sp(V(RJ,0,0));
  txt(L2('Terre proche','Earth near'),p1.x,p1.y+56,32,{fill:'#9fc7ff'});
  txt(L2('Terre loin (6 mois plus tard)','Earth far (6 months later)'),p2.x,p2.y+56,32,{fill:'#9fc7ff'});
  txt('Io',pJ.x,pJ.y-70,30,{fill:'#f2d16b'});
  const tA=t0+src.distanceTo(E1)/v, tB=t0+src.distanceTo(E2)/v;
  if(l>tA){ const ex=smooth(seg(l,tA,tA+0.6)); ctx.save(); ctx.globalAlpha=ex; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); ctx.restore();
    txt(L2('chemin en plus = diamètre de l\'orbite','extra path = diameter of Earth\'s orbit'),(p1.x+p2.x)/2,(p1.y+p2.y)/2+160,36,{alpha:ex,fill:'#ffd84a',stroke:'#0b0820',sw:0.14}); }
  const sw=l<tA?0:Math.min(22,(l-tA)/(tB-tA)*22); stopwatch(1640,120,sw>=22?'22 min !':`${Math.floor(sw)} min`,'retard de la lumière · light delay',smooth(seg(l,tA-0.2,tA+0.2)));
  caption(t,S.idea+0.3,S.idea+5.9,'L\'idée de Rømer : la lumière d\'Io met du temps pour arriver jusqu\'à nous !','Rømer\'s idea: Io\'s light takes time to reach us!');
  caption(t,S.idea+6.0,S.acad,'Quand la Terre est loin, la lumière doit traverser en plus toute l\'orbite terrestre : environ 22 minutes, selon lui.','When Earth is far away, the light must also cross Earth\'s whole orbit: about 22 minutes, by his estimate.');
}

function doAcad(t){
  const l=t-S.acad; [roemerA,cassiniA,...savants].forEach(resetP);
  acCam.position.set(lerp(-1.5,-0.5,l/7),lerp(8.2,7.6,l/7),lerp(23,20,l/7)); acCam.lookAt(-0.8,4.6,-2);
  roemerA.root.position.set(-6.0,0,0.6); roemerA.root.rotation.y=0.3; roemerA.shL.rotation.x=-1.4; roemerA.shL.rotation.z=-0.5; roemerA.elL.rotation.x=-0.2; roemerA.head.rotation.y=-0.35+0.3*Math.sin(t*1.5);
  roemerA.shR.rotation.x=-0.6+0.25*Math.sin(t*4); roemerA.elR.rotation.x=-0.9;
  cassiniA.root.position.set(8.6,0,0.2); cassiniA.root.rotation.y=-0.6; cassiniA.shL.rotation.x=0.45; cassiniA.shR.rotation.x=0.45; cassiniA.elL.rotation.x=-0.5; cassiniA.elR.rotation.x=-0.5; cassiniA.head.rotation.y=0.35*Math.sin(t*5);
  savants.forEach((P,i)=>{ sit(P); P.root.rotation.y=0; P.head.rotation.y=-0.45+0.15*Math.sin(t*2+i); P.head.rotation.x=0.05*Math.sin(t*3+i); P.shL.rotation.x=-0.9; P.shR.rotation.x=-0.9; P.elL.rotation.x=-0.6; P.elR.rotation.x=-0.6; });
  renderer.render(acad,acCam);
  const pr=scr(roemerA.head,acCam,V(0,1.9,0)), pc=scr(cassiniA.head,acCam,V(0,1.9,0));
  tag(pr.x,pr.y-50,'Rømer','Rømer',smooth(seg(l,0.4,0.8))); tag(pc.x,pc.y-50,'Cassini : « Impossible ! »','Cassini: “Impossible!”',smooth(seg(l,2.6,3.0)),'rgba(138,47,58,0.9)');
  tag(960,90,'Académie royale des sciences','Royal Academy of Sciences, Paris',smooth(seg(l,0.3,0.7)));
  caption(t,S.acad+0.3,S.nov,'Septembre 1676 : devant l\'Académie, il prédit que l\'éclipse du 9 novembre aura 10 minutes de retard.','September 1676: before the Academy, he predicts the 9 November eclipse will be 10 minutes late.');
}

function doNov(t){
  solDefaults(); const l=t-S.nov;
  jup.position.set(RJ,0,0); setMoons(t*0.6); jupBall.rotation.y=t*0.2; shadowCone.visible=false; ioOrbit.visible=false; jOrbit.visible=false; sunGlow.visible=false;
  const clockSecs=5*3600+25*60+45+(l-1.1)*93.75;
  const emerge=5*3600+35*60+45; const k=clockSecs-emerge;
  const ang=0.56+(k/600)*0.35; const inSh=setIo(ang);
  solCam.fov=8; solCam.updateProjectionMatrix(); solCam.position.copy(V(RJ,0,0).add(V(-36,7,-58))); solCam.lookAt(V(RJ,0,0));
  renderer.render(sol,solCam);
  const CX=960, CY=470, RT=360; ctx.save(); ctx.fillStyle='#05040f'; ctx.beginPath(); ctx.rect(0,0,LW,LH); ctx.arc(CX,CY,RT,0,Math.PI*2,true); ctx.fill('evenodd'); ctx.lineWidth=24; ctx.strokeStyle='#5a4a3a'; ctx.beginPath(); ctx.arc(CX,CY,RT+10,0,Math.PI*2); ctx.stroke(); ctx.restore();
  clockFace(250,300,110,clockSecs,'9 novembre 1676','9 November 1676','#ffd84a',smooth(seg(l,0.2,0.6)));
  const pa=smooth(seg(l,1.0,1.4)); ctx.save(); ctx.globalAlpha=pa; ctx.fillStyle='rgba(20,16,46,0.88)'; rrect(1440,150,420,300,26); ctx.fill(); ctx.restore();
  txt(L2('Prévue','Predicted'),1650,200,32,{alpha:pa,weight:600,fill:'#9fc7ff',shadow:false}); txt('5 h 25 min 45 s',1650,244,38,{alpha:pa,fill:'#ffffff',shadow:false});
  const ob=smooth(seg(l,7.9,8.3)); txt(L2('Observée','Observed'),1650,320,32,{alpha:ob,weight:600,fill:'#ff8a92',shadow:false}); txt('5 h 35 min 45 s',1650,364,38,{alpha:ob,fill:'#ffffff',shadow:false}); txt('+10 min !',1650,414,40,{alpha:ob,fill:'#ffd84a',shadow:false});
  if(l>1.2&&l<7.8){ const q=smooth(seg(l,1.3,1.7)); txt('… ?',CX-190,CY-60,90,{alpha:q,fill:'#ffffff',stroke:'#1b1446',sw:0.12}); }
  if(!inSh&&l>7.7){ const pi=scr(io,solCam); const f=seg(l,7.75,8.8); ctx.save(); ctx.globalAlpha=1-f; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(pi.x,pi.y,30+f*90,0,Math.PI*2); ctx.stroke(); ctx.restore(); txt('Io !',pi.x-60,pi.y-70,48,{alpha:smooth(seg(l,7.8,8.1)),fill:'#f2d16b',stroke:'#1b1446',sw:0.14}); }
  caption(t,S.nov+0.3,S.nov+4.8,'9 novembre 1676, avant l\'aube : heure prévue, 5 h 25 min 45 s… mais rien !','9 November 1676, before dawn: predicted time 5:25:45… but nothing!');
  caption(t,S.nov+4.9,S.speed,'Io réapparaît à 5 h 35 min 45 s : 10 minutes de retard, comme Rømer l\'avait prédit !','Io reappears at 5:35:45: 10 minutes late, just as Rømer predicted!');
}

function doSpeed(t){
  solDefaults(); const l=t-S.speed;
  jup.position.set(RJ,0,0); setIo(t*1.5); setMoons(t*2);
  const E1=earthAt(0), E2=earthAt(Math.PI); earth.position.copy(E1); ghost.visible=true; ghost.position.copy(E2);
  topCam(0,0,34,0.55);
  const run=(t0,dur)=>{ const u=seg(l,t0,t0+dur); return u; };
  const u1=run(1.2,3.6), u2=run(8.0,2.7);
  pulses.forEach(p=>p.visible=false);
  if(u1>0&&u1<1){ pulses[0].visible=true; pulses[0].position.copy(E1.clone().lerp(E2,u1)); }
  if(u2>0&&u2<1){ pulses[1].visible=true; pulses[1].position.copy(E1.clone().lerp(E2,u2)); pulses[1].scale.set(2.4,2.4,1); }
  renderer.render(sol,solCam);
  const p1=sp(E1), p2=sp(E2);
  const da=smooth(seg(l,0.4,0.9)); ctx.save(); ctx.globalAlpha=da; ctx.strokeStyle='#ffffff'; ctx.lineWidth=4; ctx.setLineDash([16,12]); ctx.beginPath(); ctx.moveTo(p1.x,p1.y+70); ctx.lineTo(p2.x,p2.y+70); ctx.stroke(); ctx.restore();
  txt(L2('≈ 300 000 000 km','≈ 300,000,000 km'),(p1.x+p2.x)/2,p1.y+110,44,{alpha:da,fill:'#ffffff',stroke:'#0b0820',sw:0.14}); txt(L2('diamètre de l\'orbite terrestre','diameter of Earth\'s orbit'),(p1.x+p2.x)/2,p1.y+158,32,{alpha:da,weight:500,fill:'#ffe39a',stroke:'#0b0820',sw:0.14,maxW:1100});
  const sw1=Math.min(22,u1*22); stopwatch(480,130,u1>=1?'22 min':`${Math.floor(sw1)} min`,'selon Rømer · according to Rømer',smooth(seg(l,1.0,1.4)));
  txt(L2('≈ 227 000 km/s','≈ 227,000 km/s'),480,262,46,{alpha:smooth(seg(l,4.9,5.3)),fill:'#ffd84a',stroke:'#0b0820',sw:0.14,scale:backOut(seg(l,4.9,5.3))});
  const sw2=u2*1000; const m2=Math.floor(sw2/60), s2=Math.floor(sw2%60); stopwatch(1440,130,u2>=1?'16 min 40 s':`${m2} min ${String(s2).padStart(2,'0')} s`,'mesure moderne · modern value',smooth(seg(l,7.6,8.0)));
  txt(L2('299 792 km/s','299,792 km/s'),1440,262,52,{alpha:smooth(seg(l,10.8,11.2)),fill:'#7dff8a',stroke:'#0b0820',sw:0.14,scale:backOut(seg(l,10.8,11.2))});
  tag(960,770,'Christiaan Huygens fera le premier ce calcul de vitesse','Christiaan Huygens was the first to calculate the speed',smooth(seg(l,5.4,5.8))*(1-smooth(seg(l,7.2,7.6))));
  caption(t,S.speed+0.3,S.speed+6.9,'Vitesse = distance ÷ temps : 300 millions de km ÷ 22 min ≈ 227 000 km/s.','Speed = distance ÷ time: 300 million km ÷ 22 min ≈ 227,000 km/s.');
  caption(t,S.speed+7.0,S.earth,'Le vrai temps est 16 min 40 s : la lumière file à 299 792 km/s !','The true time is 16 min 40 s: light races at 299,792 km/s!');
}

function doEarth(t){
  const l=t-S.earth; esCam.fov=40; esCam.updateProjectionMatrix(); esCam.position.set(0,2,24); esCam.lookAt(0,0,0);
  bigEarth.rotation.y=0.6+t*0.05; bigEarth.rotation.x=0.25;
  const sec=clamp((l-0.8)/4.4,0,1); const ang=sec*7.48*Math.PI*2; const R2=6.35;
  photon.position.set(R2*Math.cos(ang),0,-R2*Math.sin(ang));
  const mm=new T.Matrix4(); let n=0; for(let k=1;k<160;k++){ const a2=ang-k*0.03; if(a2<0) break; mm.makeTranslation(R2*Math.cos(a2),0,-R2*Math.sin(a2)); ringTrail.setMatrixAt(n++,mm); } ringTrail.count=n; ringTrail.instanceMatrix.needsUpdate=true;
  renderer.render(es,esCam);
  stopwatch(330,140,`${sec.toFixed(2).replace('.',LANG==='fr'?',':'.')} s`,'1 seconde au ralenti · 1 second in slow motion',smooth(seg(l,0.3,0.7)));
  stopwatch(1590,140,`${(sec*7.48).toFixed(1).replace('.',LANG==='fr'?',':'.')} ${L2('tours','laps')}`,'tours de la Terre · laps of the Earth',smooth(seg(l,0.3,0.7)));
  caption(t,S.earth+0.3,S.end,'En une seconde, la lumière fait 7 fois et demie le tour de la Terre !','In one second, light travels around the Earth 7½ times!');
}

//@@TAIL@@
