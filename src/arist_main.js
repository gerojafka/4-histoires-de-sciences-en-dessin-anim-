(() => {
'use strict';
const T = THREE;
const LW = 1920, LH = 1080;
const CAPTURE = !!window.__CAPTURE;
//@@HELPERS@@
//@@WORLD@@
//@@OVERLAY@@

/* ====================================================================== */
/*  Texts (FR / EN)                                                        */
/* ====================================================================== */
let LANG='fr';
const L=(o)=>o[LANG];
const STEPS=[
 { dur:14, title:{fr:'Une question',en:'A question'},
   caps:[[0.4,{fr:'Île de Samos, au IIIe siècle avant J.-C. L\'astronome grec Aristarque de Samos regarde la pleine Lune.',en:'Island of Samos, 3rd century BC. The Greek astronomer Aristarchus of Samos is looking at the full Moon.'}],
         [6.6,{fr:'Son élève demande : « Quelle est la vraie taille de la Lune ? » Elle paraît petite… mais elle est très loin !',en:'His student asks: “How big is the Moon really?” It looks small… but it is very far away!'}]] },
 { dur:17, title:{fr:'L\'éclipse de Lune',en:'The lunar eclipse'},
   caps:[[0.4,{fr:'Son idée : utiliser une éclipse de Lune. Parfois, la Terre se place exactement entre le Soleil et la Lune…',en:'His idea: use a lunar eclipse. Sometimes the Earth lines up exactly between the Sun and the Moon…'}],
         [7.0,{fr:'… et la Lune traverse l\'ombre de la Terre. Elle s\'assombrit et devient rouge cuivré.',en:'… and the Moon passes through the Earth\'s shadow. It darkens and turns copper-red.'}],
         [12.2,{fr:'Le bord de l\'ombre est toujours arrondi : c\'est aussi la preuve que la Terre est ronde !',en:'The edge of the shadow is always curved: that also proves the Earth is round!'}]] },
 { dur:21, title:{fr:'Mesurer l\'ombre',en:'Measuring the shadow'},
   caps:[[0.4,{fr:'Aristarque chronomètre l\'éclipse. La Lune avance de sa propre largeur en 1 heure environ.',en:'Aristarchus times the eclipse. The Moon moves its own width in about 1 hour.'}],
         [9.5,{fr:'Elle met environ 2 heures pour traverser l\'ombre : l\'ombre de la Terre est donc large d\'environ 2 Lunes.',en:'It takes about 2 hours to cross the shadow: so the Earth\'s shadow is about 2 Moons wide.'}],
         [16.5,{fr:'C\'est l\'estimation d\'Aristarque. Aujourd\'hui, on mesure plutôt 2,6 Lunes.',en:'That was Aristarchus\'s estimate. Today we measure about 2.6 Moons.'}]] },
 { dur:22, title:{fr:'L\'ombre rétrécit',en:'The shadow narrows'},
   caps:[[0.4,{fr:'Mais l\'ombre de la Terre est un cône : elle rétrécit en s\'éloignant, car le Soleil est plus grand que la Terre.',en:'But the Earth\'s shadow is a cone: it narrows with distance, because the Sun is bigger than the Earth.'}],
         [7.6,{fr:'Lors d\'une éclipse de Soleil, la Lune cache juste le Soleil : ils paraissent de la même taille.',en:'In a solar eclipse, the Moon just covers the Sun: they look the same size.'}],
         [13.6,{fr:'Résultat : jusqu\'à la Lune, l\'ombre perd environ 1 Lune de largeur. Largeur de la Terre ≈ 2 Lunes + 1 Lune = 3 Lunes !',en:'Result: by the Moon\'s distance, the shadow loses about 1 Moon of width. Earth\'s width ≈ 2 Moons + 1 Moon = 3 Moons!'}]] },
 { dur:19, title:{fr:'La taille de la Lune',en:'The size of the Moon'},
   caps:[[0.4,{fr:'Conclusion d\'Aristarque : la Lune mesure environ un tiers de la Terre (entre 0,32 et 0,40 fois).',en:'Aristarchus\'s conclusion: the Moon is about one third of the Earth (between 0.32 and 0.40 times).'}],
         [8.6,{fr:'Aujourd\'hui : 0,27. Avec la taille de la Terre mesurée plus tard par Ératosthène, on trouve une Lune d\'environ 3 500 km.',en:'Today: 0.27. With the Earth\'s size, measured later by Eratosthenes, the Moon comes out at about 3,500 km.'}]] },
 { dur:22, title:{fr:'Bonus : sa distance',en:'Bonus: its distance'},
   caps:[[0.4,{fr:'Bonus : la Lune paraît large d\'un demi-degré. Un petit pois tenu à bout de bras suffit à la cacher !',en:'Bonus: the Moon looks half a degree wide. A pea held at arm\'s length is enough to hide it!'}],
         [8.6,{fr:'Elle est donc à environ 110 fois sa largeur : 110 Lunes alignées, environ 380 000 km (en réalité 384 400 km).',en:'So it is about 110 times its own width away: 110 Moons in a row, about 380,000 km (actually 384,400 km).'}]] },
 { dur:15, title:{fr:'Et le Soleil ?',en:'And the Sun?'},
   caps:[[0.4,{fr:'Avec la même géométrie, Aristarque estime que le Soleil est environ 7 fois plus large que la Terre (en réalité 109 fois !).',en:'With the same geometry, Aristarchus estimates the Sun is about 7 times wider than the Earth (actually 109 times!).'}],
         [7.4,{fr:'Alors pour lui, c\'est la Terre qui tourne autour du Soleil… 1 800 ans avant Copernic !',en:'So for him, it is the Earth that goes around the Sun… 1,800 years before Copernicus!'}]] },
];
const TXT={
  moon:{fr:'Lune',en:'Moon'}, moons:{fr:'Lunes',en:'Moons'}, earth:{fr:'Terre',en:'Earth'}, sun:{fr:'Soleil',en:'Sun'},
  shadow:{fr:'ombre de la Terre',en:'Earth\'s shadow'}, notScale:{fr:'(pas à l\'échelle)',en:'(not to scale)'},
  aristarque:{fr:'Aristarque de Samos',en:'Aristarchus of Samos'}, student:{fr:'son élève',en:'his student'}, samos:{fr:'Samos, IIIe s. av. J.-C.',en:'Samos, 3rd century BC'},
  hour:{fr:'h',en:'h'}, oneHour:{fr:'1 heure = 1 largeur de Lune',en:'1 hour = 1 Moon width'}, twoMoons:{fr:'≈ 2 Lunes',en:'≈ 2 Moons'},
  minus1:{fr:'− 1 Lune',en:'− 1 Moon'}, threeMoons:{fr:'3 Lunes',en:'3 Moons'}, twoMoonsS:{fr:'2 Lunes',en:'2 Moons'},
  solarEcl:{fr:'éclipse de Soleil',en:'solar eclipse'}, sameSize:{fr:'même taille apparente',en:'same apparent size'},
  arist:{fr:'Aristarque : 3 Lunes',en:'Aristarchus: 3 Moons'}, today:{fr:'Aujourd\'hui : 3,7 Lunes',en:'Today: 3.7 Moons'},
  pea:{fr:'petit pois à bout de bras',en:'pea at arm\'s length'}, half:{fr:'≈ ½ degré',en:'≈ ½ degree'}, eye:{fr:'œil',en:'eye'},
  heliocentric:{fr:'Le Soleil au centre',en:'The Sun at the centre'}, copper:{fr:'Lune rouge cuivré',en:'copper-red Moon'}, curved:{fr:'bord arrondi',en:'curved edge'},
  title:{fr:'Aristarque et la taille de la Lune',en:'Aristarchus and the size of the Moon'},
};

/* ====================================================================== */
/*  Characters                                                             */
/* ====================================================================== */
function person(o){
  const root=new T.Group(), body=grp(root,0,0,0), P={root,body,o};
  for(const s of [-1,1]){
    const hip=grp(body,s*0.3,4.1,0); mesh(hip,cap(0.17,1.7),o.thigh||o.legs,0,-1.0,0);
    const knee=grp(hip,0,-2.0,0); mesh(knee,cap(0.15,1.55),o.legs,0,-0.92,0);
    const foot=grp(knee,0,-1.85,0); mesh(foot,sph(0.24,20),o.shoes,0,0.02,0.14,{s:[1,0.6,1.65]});
    P[s<0?'hipL':'hipR']=hip; P[s<0?'kneeL':'kneeR']=knee;
  }
  mesh(body,cap(0.5,1.45),o.top,0,5.0,0,{s:[1.06,1,0.74]});
  if(o.tunic){ mesh(body,cyl(0.5,0.82,1.55,28),o.top,0,3.85,0); if(o.trim) mesh(body,cyl(0.83,0.83,0.12,28),o.trim,0,3.1,0); }
  if(o.sash) mesh(body,bx(0.32,2.3,0.12),o.sash,0.05,4.9,0.38,{rz:0.55});
  if(o.cloak) mesh(body,cyl(0.56,0.86,2.6,28,),o.cloak,0,4.3,-0.18,{s:[1,1,0.6]});
  for(const s of [-1,1]){
    const sh=grp(body,s*0.64,5.82,0); mesh(sh,cap(0.13,1.1),o.sleeve||o.top,0,-0.6,0);
    const el=grp(sh,0,-1.22,0); mesh(el,cap(0.12,0.95),o.forearm||o.sleeve||o.top,0,-0.52,0); mesh(el,sph(0.16,16),o.skin,0,-1.1,0);
    P[s<0?'shL':'shR']=sh; P[s<0?'elL':'elR']=el;
  }
  mesh(body,cyl(0.15,0.17,0.45,16),o.skin,0,6.12,0);
  const head=grp(body,0,6.28,0); P.head=head;
  mesh(head,sph(0.78,40),o.skin,0,0.75,0,{s:[0.97,1.06,0.97]}); mesh(head,sph(0.11,16),o.skin,0,0.66,0.78);
  for(const s of [-1,1]){ mesh(head,sph(0.07,12),'#2a211d',s*0.26,0.86,0.68,{cast:false}); mesh(head,sph(0.13,12),o.skin,s*0.76,0.74,0,{s:[0.55,1,0.8]}); }
  mesh(head,sph(0.08,12),'#a4524f',0,0.43,0.71,{s:[1.7,0.55,0.6],cast:false});
  if(o.hair) mesh(head,sph(0.8,32),o.hair,0,0.6,-0.1,{s:[1.0,0.62,0.95]});
  if(o.curls) mesh(head,sph(0.82,32),o.curls,0,1.0,-0.12,{s:[1.03,0.75,1.0]});
  if(o.beard){ mesh(head,sph(0.5,28),o.beard,0,0.28,0.3,{s:[1.15,0.95,0.8]}); mesh(head,sph(0.14,12),o.beard,0,0.5,0.74,{s:[2.0,0.6,0.7]}); }
  if(o.wreath) mesh(head,G('wr',()=>new T.TorusGeometry(0.8,0.08,8,40)),o.wreath,0,1.15,0,{rx:Math.PI/2+0.12});
  return P;
}
function resetP(P){ P.body.position.set(0,0,0); P.body.rotation.set(0,0,0); for(const k of ['hipL','hipR','kneeL','kneeR','shL','shR','elL','elR']) P[k].rotation.set(0,0,0); P.head.rotation.set(0,0,0); }
const ARIST={skin:'#eab993',top:'#f1ece2',tunic:true,trim:'#5b4a8a',cloak:'#5b4a8a',sash:'#5b4a8a',legs:'#eab993',thigh:'#eab993',shoes:'#6b4428',forearm:'#eab993',hair:'#7a7a7a',beard:'#8a8a8a',wreath:'#6f9a4a'};
const STUD={skin:'#d9a77c',top:'#8fbf7a',tunic:true,trim:'#4f7f3a',legs:'#d9a77c',thigh:'#d9a77c',shoes:'#6b4428',forearm:'#d9a77c',curls:'#2a1c14'};

/* moon texture */
const moonTex=canvasTex(1024,512,(g,w,h)=>{ g.fillStyle='#cfcac0'; g.fillRect(0,0,w,h);
  for(let i=0;i<9;i++){ g.fillStyle=`rgba(120,115,110,${0.25+hash(i)*0.2})`; g.beginPath(); g.ellipse(hash(i*3)*w,h*0.25+hash(i*5)*h*0.5,60+hash(i)*120,40+hash(i+1)*60,0,0,Math.PI*2); g.fill(); }
  for(let i=0;i<160;i++){ const x=hash(i*7)*w, y=hash(i*11)*h, r=3+hash(i*13)*16; g.fillStyle='rgba(90,85,80,0.35)'; g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill(); g.fillStyle='rgba(240,236,228,0.35)'; g.beginPath(); g.arc(x-r*0.25,y-r*0.25,r*0.7,0,Math.PI*2); g.fill(); } });
const moonImg=(()=>{ const c=document.createElement('canvas'); c.width=c.height=512; const g=c.getContext('2d'); const gr=g.createRadialGradient(220,220,30,256,256,256); gr.addColorStop(0,'#f4f1ea'); gr.addColorStop(0.85,'#cfcac0'); gr.addColorStop(1,'#a9a49a'); g.fillStyle=gr; g.beginPath(); g.arc(256,256,256,0,Math.PI*2); g.fill();
  g.save(); g.beginPath(); g.arc(256,256,256,0,Math.PI*2); g.clip();
  [[180,170,70],[330,210,55],[260,330,80],[150,320,40],[360,350,35]].forEach(([x,y,r])=>{ g.fillStyle='rgba(120,115,108,0.35)'; g.beginPath(); g.ellipse(x,y,r*1.3,r,0.3,0,Math.PI*2); g.fill(); });
  for(let i=0;i<60;i++){ const x=hash(i*3)*512, y=hash(i*5)*512, r=4+hash(i*7)*14; g.fillStyle='rgba(95,90,85,0.35)'; g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill(); }
  g.restore(); return c; })();

/* ====================================================================== */
/*  SCENE: Samos terrace (night / dawn)                                    */
/* ====================================================================== */
const sam=new T.Scene(); const samNight=gradTex([[0,'#070b2a'],[0.5,'#162060'],[0.82,'#33377a'],[1,'#4c4580']]), samDawn=gradTex([[0,'#3a5aa8'],[0.5,'#8a8ac8'],[0.8,'#f0a07a'],[1,'#ffd49a']]);
sam.background=samNight; sam.fog=new T.Fog('#26285a',80,320);
const samCam=new T.PerspectiveCamera(40,LW/LH,0.1,1500);
const samHemi=new T.HemisphereLight('#a8b4ff','#3a3450',0.55); sam.add(samHemi);
const samKey=new T.DirectionalLight('#dfe6ff',0.75); samKey.position.set(60,30,-40); samKey.castShadow=true; samKey.shadow.mapSize.set(2048,2048); Object.assign(samKey.shadow.camera,{left:-16,right:16,top:16,bottom:-16,near:1,far:200}); samKey.shadow.bias=-0.0005; sam.add(samKey); sam.add(samKey.target);
const lamp=new T.PointLight('#ffc27a',0.9,26,1.5); lamp.position.set(-5,4.5,4); sam.add(lamp);
const seaMat=new T.MeshLambertMaterial({color:'#1d2c66'}); mesh(sam,new T.PlaneGeometry(1200,800),seaMat,0,-7,-200,{rx:-Math.PI/2,cast:false});
(function(){ const n=900,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const a=-Math.PI*0.95+R()*Math.PI*0.9, e=0.05+R()*1.2; pos.set([Math.cos(a)*Math.cos(e)*500,Math.sin(e)*500,Math.sin(a)*Math.cos(e)*500],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); const m=new T.PointsMaterial({color:'#ffffff',size:2,sizeAttenuation:false,transparent:true}); sam.userData.stars=m; sam.add(new T.Points(g,m)); })();
(function(){
  const stone=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#d9cdb4'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(110,95,70,0.4)'; g.lineWidth=4; for(let i=0;i<=8;i++){ g.beginPath(); g.moveTo(0,i*64); g.lineTo(w,i*64); g.stroke(); for(let k=0;k<4;k++){ const x=((i%2)*64+k*128); g.beginPath(); g.moveTo(x,i*64); g.lineTo(x,i*64+64); g.stroke(); } } });
  stone.wrapS=stone.wrapT=T.RepeatWrapping; stone.repeat.set(5,3);
  mesh(sam,bx(40,8,22),new T.MeshLambertMaterial({map:stone}),0,-4,-2);
  for(let x=-19;x<=19;x+=1.4) mesh(sam,cyl(0.2,0.26,1.3,10),'#e2d6be',x,0.65,8.6); mesh(sam,bx(39,0.3,0.7),'#e8ddc6',0,1.4,8.6);
  for(const x of [-15,-10,-5]){ mesh(sam,cyl(0.85,0.95,11,20),'#efe6d4',x,5.5,-9); mesh(sam,bx(2.3,0.6,2.3),'#e6dcc6',x,11.3,-9); mesh(sam,bx(2.3,0.4,2.3),'#e6dcc6',x,0.2,-9); }
  mesh(sam,bx(14,1.4,2.6),'#e6dcc6',-10,12.2,-9); mesh(sam,bx(14,0.5,2.8),'#d6c8ae',-10,13.1,-9);
  const ol=grp(sam,13,0,-5); mesh(ol,cyl(0.45,0.7,4,10),'#6b5a44',0,2,0,{rz:0.15}); mesh(ol,cyl(0.3,0.45,3,10),'#6b5a44',0.6,4.8,0,{rz:-0.35});
  [[0,7,0,3.2],[-2,6.2,1,2.4],[2.2,6.6,-0.5,2.5],[0.6,8.3,0.6,2.2]].forEach(([x,y,z,r],i)=>mesh(ol,sph(r,20),i%2?'#7d8f5c':'#6f8350',x,y,z,{s:[1.2,0.75,1.1]}));
  for(let i=0;i<5;i++) mesh(sam,cyl(0.5,0.4,1.0,14),'#b5653f',8+i*1.4,0.5,4+(i%2)*0.8);
})();
const bigMoon=grp(sam,70,26,-170); const bigMoonBall=mesh(bigMoon,new T.SphereGeometry(10,48,32),new T.MeshBasicMaterial({map:moonTex,fog:false,toneMapped:false}),0,0,0,{cast:false,recv:false}); bigMoonBall.rotation.y=1.9; const moonGlowS=glowSprite('rgba(220,225,255,1)',48); bigMoon.add(moonGlowS);
const moonPath=mesh(sam,new T.PlaneGeometry(14,170),new T.MeshBasicMaterial({map:canvasTex(64,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(220,225,255,0)'); gr.addColorStop(0.3,'rgba(220,225,255,0.55)'); gr.addColorStop(1,'rgba(220,225,255,0.05)'); g.fillStyle=gr; g.fillRect(0,0,w,h); const gx=g.createLinearGradient(0,0,w,0); }),transparent:true,depthWrite:false,blending:T.AdditiveBlending}),55,-6.9,-90,{rx:-Math.PI/2,rz:-0.33,cast:false,recv:false});
const dawnSun=glowSprite('rgba(255,200,120,1)',60); dawnSun.position.set(60,4,-200); sam.add(dawnSun); dawnSun.visible=false;
const arist=person(ARIST); sam.add(arist.root);
const stud=person(STUD); stud.root.scale.setScalar(0.82); sam.add(stud.root);
const orrery=grp(sam,1.6,0,1.2); mesh(orrery,bx(2.6,0.2,2.0),'#8a5a3a',0,3.0,0); for(const [x,z] of [[-1.1,-0.8],[1.1,-0.8],[-1.1,0.8],[1.1,0.8]]) mesh(orrery,bx(0.16,3.0,0.16),'#6b4428',x,1.5,z);
mesh(orrery,cyl(0.5,0.6,0.2,24),'#b8862e',0,3.2,0); mesh(orrery,cyl(0.05,0.05,0.8,8),'#b8862e',0,3.6,0); const orSun=mesh(orrery,sph(0.38,24),bas('#ffcf4a'),0,4.1,0,{cast:false}); const orSunGlow=glowSprite('rgba(255,210,100,1)',2.2); orSun.add(orSunGlow);
const orArm=grp(orrery,0,4.1,0); mesh(orArm,cyl(0.025,0.025,1.5,6),'#b8862e',0.75,0,0,{rz:Math.PI/2}); const orEarth=mesh(orArm,sph(0.16,20),new T.MeshLambertMaterial({map:worldTex}),1.5,0,0,{cast:false}); const orMoonArm=grp(orArm,1.5,0,0); mesh(orMoonArm,sph(0.06,12),'#ddd8cc',0.32,0,0,{cast:false});
orrery.visible=false;

/* ====================================================================== */
/*  SCENE: space (side view) - eclipse and shadow cone                     */
/* ====================================================================== */
const sp=new T.Scene(); sp.background=gradTex([[0,'#04061a'],[0.6,'#0b1238'],[1,'#141a4a']]);
const spCam=new T.PerspectiveCamera(40,LW/LH,0.1,3000);
sp.add(new T.AmbientLight('#8a94c8',0.14));
const spSunL=new T.DirectionalLight('#fff2d6',1.35); spSunL.position.set(-100,0,0); sp.add(spSunL);
(function(){ const n=2000,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const v=V(R()-0.5,R()-0.5,R()-0.5).normalize().multiplyScalar(900+R()*300); pos.set([v.x,v.y,v.z],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); sp.add(new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2.2,sizeAttenuation:false}))); })();
const ER2=1.26, MR2=0.42, MD=12, APEX=ER2/(MR2/MD);
const spSun=grp(sp,-38,0,0); mesh(spSun,sph(9,48),bas('#ffd23f'),0,0,0,{cast:false,recv:false}); spSun.add(glowSprite('rgba(255,200,80,1)',34));
const spEarth=mesh(sp,new T.SphereGeometry(ER2,64,40),new T.MeshLambertMaterial({map:worldTex}),0,0,0,{cast:false,recv:false}); spEarth.rotation.set(0.3,2.2,0.1);
const spEarthGlow=glowSprite('rgba(110,170,255,1)',4.5); sp.add(spEarthGlow);
const cone=mesh(sp,new T.ConeGeometry(ER2,APEX,64,1,true),new T.MeshBasicMaterial({color:'#000000',transparent:true,opacity:0.38,depthWrite:false}),APEX/2,0,0,{rz:-Math.PI/2,cast:false,recv:false});
const orbitLine=(function(){ const pts=[]; for(let i=0;i<=200;i++){ const a=i/200*Math.PI*2; pts.push(V(MD*Math.cos(a),0,-MD*Math.sin(a))); } const g=new T.BufferGeometry().setFromPoints(pts); const l=new T.Line(g,new T.LineDashedMaterial({color:'#9fb4ff',dashSize:0.5,gapSize:0.35,transparent:true,opacity:0.6})); l.computeLineDistances(); sp.add(l); return l; })();
const spMoonMat=new T.MeshLambertMaterial({map:moonTex,color:'#ffffff'});
const spMoon=mesh(sp,new T.SphereGeometry(MR2,40,24),spMoonMat,MD,0,0,{cast:false,recv:false});
const COPPER=new T.Color('#9a4a2e'), WHITE=new T.Color('#ffffff');
function placeMoon(phi){ spMoon.position.set(MD*Math.cos(phi),0,-MD*Math.sin(phi)); const x=spMoon.position.x, d=Math.abs(spMoon.position.z); const rc=ER2*(1-x/APEX); const k=clamp((rc-d+MR2)/(2*MR2),0,1)*(x>0?1:0); spMoonMat.color.copy(WHITE).lerp(COPPER,k); spMoonMat.emissive.copy(COPPER).multiplyScalar(0.75*k); return k; }

/* ====================================================================== */
/*  SCENE: sizes (Earth + Moons) and distance (110 Moons)                   */
/* ====================================================================== */
const sz=new T.Scene(); sz.background=gradTex([[0,'#04061a'],[1,'#121a48']]);
const szCam=new T.PerspectiveCamera(40,LW/LH,0.1,3000);
sz.add(new T.AmbientLight('#8fa0d8',0.4)); const szL=new T.DirectionalLight('#fff6e6',1.05); szL.position.set(-30,20,40); sz.add(szL);
(function(){ const n=1800,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const v=V(R()-0.5,R()-0.5,R()-0.5).normalize().multiplyScalar(900); pos.set([v.x,v.y,v.z],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); sz.add(new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2,sizeAttenuation:false}))); })();
const szEarth=mesh(sz,new T.SphereGeometry(3,72,48),new T.MeshLambertMaterial({map:worldTex}),0,0,0,{cast:false,recv:false}); szEarth.rotation.set(0.35,2.0,0);
const szHalo=glowSprite('rgba(110,170,255,1)',9); sz.add(szHalo);
const moonMat=new T.MeshLambertMaterial({map:moonTex});
const szMoons=[0,1,2,3].map(()=>mesh(sz,new T.SphereGeometry(1,40,24),moonMat,0,0,0,{cast:false,recv:false}));
const DIST_N=110; const distMoons=new T.InstancedMesh(new T.SphereGeometry(0.5,16,10),moonMat,DIST_N); distMoons.count=0; distMoons.frustumCulled=false; sz.add(distMoons);
const farMoon=mesh(sz,new T.SphereGeometry(0.5,32,20),moonMat,0,0,0,{cast:false,recv:false});

/* ====================================================================== */
/*  2D helpers                                                             */
/* ====================================================================== */
function wrap(s,maxW,font){ ctx.font=font; const words=s.split(' '); const lines=[]; let cur=''; for(const w of words){ const tst=cur?cur+' '+w:w; if(ctx.measureText(tst).width>maxW&&cur){ lines.push(cur); cur=w; } else cur=tst; } if(cur) lines.push(cur); return lines; }
function captionBox(text,a){
  if(a<=0.003||!text) return; const font=`600 44px ${FF}`; const lines=wrap(text,1560,font); const h=lines.length*58+44, y0=975-h;
  ctx.save(); ctx.globalAlpha=a*0.82; ctx.fillStyle='#14102e'; rrect(150,y0,1620,h,30); ctx.fill(); ctx.restore();
  lines.forEach((ln,i)=>txt(ln,960,y0+22+29+i*58,44,{alpha:a,weight:600,shadow:false}));
}
function label(s,x,y,size,o){ return txt(s,x,y,size,Object.assign({stroke:'#0b0820',sw:0.14},o||{})); }
function tag1(x,y,s,a,color){ if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.font=`700 34px ${FF}`; const w=ctx.measureText(s).width+48; ctx.fillStyle=color||'rgba(20,16,46,0.85)'; rrect(x-w/2,y-30,w,60,22); ctx.fill(); ctx.restore(); txt(s,x,y,34,{alpha:a,shadow:false}); }
function moonDisc(x,y,r,alpha){ ctx.save(); ctx.globalAlpha=alpha==null?1:alpha; ctx.drawImage(moonImg,x-r,y-r,2*r,2*r); ctx.restore(); }
function ghost(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle=col||'#ffffff'; ctx.lineWidth=4; ctx.setLineDash([12,9]); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke(); ctx.restore(); }
function bracketH(x0,x1,y,col,a,txtS,size){ if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle=col; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(x0,y-14); ctx.lineTo(x0,y); ctx.lineTo(x1,y); ctx.lineTo(x1,y-14); ctx.stroke(); ctx.restore(); if(txtS) label(txtS,(x0+x1)/2,y+34,size||34,{alpha:a,fill:col}); }
function bracketV(x,y0,y1,col,a,txtS,size,side){ if(a<=0.003) return; const d=side||1; ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle=col; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(x-14*d,y0); ctx.lineTo(x,y0); ctx.lineTo(x,y1); ctx.lineTo(x-14*d,y1); ctx.stroke(); ctx.restore(); if(txtS) label(txtS,x+d*22,(y0+y1)/2,size||34,{alpha:a,fill:col,align:d>0?'left':'right'}); }
const SKY_STARS=Array.from({length:260},(_,i)=>[hash(i*3)*LW,hash(i*7)*LH*0.8,0.6+hash(i*11)*1.8]);
function nightSky2D(g){ const gr=ctx.createLinearGradient(0,0,0,LH); gr.addColorStop(0,'#05081f'); gr.addColorStop(0.7,'#141c4a'); gr.addColorStop(1,'#2a2a5a'); ctx.fillStyle=gr; ctx.fillRect(0,0,LW,LH);
  SKY_STARS.forEach(([x,y,r],i)=>{ ctx.globalAlpha=0.5+0.5*Math.sin(g*1.5+i); ctx.fillStyle='#ffffff'; ctx.fillRect(x,y,r,r); }); ctx.globalAlpha=1;
  ctx.fillStyle='#0b0d24'; ctx.beginPath(); ctx.moveTo(0,LH); ctx.lineTo(0,930); for(let x=0;x<=LW;x+=60) ctx.lineTo(x,930-18*Math.sin(x*0.004)-10*Math.sin(x*0.013)); ctx.lineTo(LW,LH); ctx.fill();
  [[150,640],[230,640],[310,640]].forEach(([x,y])=>{ ctx.fillRect(x,y,34,300); ctx.fillRect(x-10,y-14,54,16); }); ctx.fillRect(130,600,230,40); }
const sp2=v=>scrV(v,spCam);

/* ====================================================================== */
/*  Steps                                                                  */
/* ====================================================================== */
function step0(l,g){ /* Samos: the question */
  sam.background=samNight; sam.userData.stars.opacity=1; seaMat.color.set('#1d2c66'); samHemi.intensity=0.55; samKey.color.set('#dfe6ff'); samKey.position.set(60,30,-40);
  bigMoon.visible=true; moonPath.visible=true; dawnSun.visible=false; orrery.visible=false; lamp.intensity=0.9;
  [arist,stud].forEach(resetP);
  samCam.position.set(lerp(-4,-2,l/14),lerp(6.5,6.0,l/14),lerp(24,20,l/14)); samCam.lookAt(lerp(6,7,l/14),6.5,-12);
  arist.root.position.set(-2.4,0,2.4); arist.root.rotation.y=1.2; arist.head.rotation.x=-0.3; arist.shL.rotation.x=-0.4; arist.elL.rotation.x=-0.8; arist.shR.rotation.x=-0.3;
  stud.root.position.set(1.6,0,3.4); stud.root.rotation.y=0.5; stud.head.rotation.x=-0.35;
  const ask=smooth(seg(l,6.6,7.2)); stud.shR.rotation.x=-2.4*ask; stud.shR.rotation.z=0.4*ask; stud.head.rotation.y=-0.6*(1-ask)+0.0; stud.body.position.y=Math.abs(Math.sin(g*5))*0.15*ask;
  if(l<6.6){ stud.head.rotation.y=-0.9; }
  bigMoonBall.rotation.y=1.9+g*0.01;
  renderer.render(sam,samCam);
  const pa=scr(arist.head,samCam,V(0,1.9,0)), ps=scr(stud.head,samCam,V(0,1.7,0));
  tag1(pa.x-60,pa.y-40,L(TXT.aristarque),smooth(seg(l,0.8,1.3))); tag1(ps.x+30,ps.y-40,L(TXT.student),smooth(seg(l,1.0,1.5)));
  if(l>7){ const pm=scr(bigMoon,samCam); label('?',pm.x+170,pm.y+30,120,{alpha:smooth(seg(l,7.2,7.7)),fill:'#ffe39a',scale:backOut(seg(l,7.2,7.6))}); }
  if(l<5) label(L(TXT.samos),960,90,40,{alpha:smooth(seg(l,0.3,0.8))*(1-smooth(seg(l,4.4,5)))});
}
function spaceCam(px,py,pz,lx,ly,lz,fov){ spCam.fov=fov||40; spCam.updateProjectionMatrix(); spCam.position.set(px,py,pz); spCam.lookAt(lx,ly,lz); }
function step1(l,g){ /* lunar eclipse overview */
  cone.visible=true; orbitLine.visible=true; spEarth.rotation.y=2.2+g*0.05;
  const phi=l<10?lerp(-0.55,-0.02,smooth(seg(l,1.0,10))):l<14?lerp(-0.02,0.05,seg(l,10,14)):lerp(0.05,0.22,smooth(seg(l,14,17)));
  const k=placeMoon(phi);
  const z=smooth(seg(l,7.5,11.5));
  spaceCam(lerp(-2,9,z),lerp(6,2.2,z),lerp(34,14,z),lerp(-2,11,z),0,0,40);
  renderer.render(sp,spCam);
  const a=smooth(seg(l,0.6,1.1)); const ps=sp2(V(-38,0,0)), pe=sp2(V(0,0,0)), pm=sp2(spMoon.position);
  if(z<0.6){ label(L(TXT.sun),Math.max(120,ps.x+40),ps.y+150,36,{alpha:a*(1-z),fill:'#ffd84a'}); label(L(TXT.earth),pe.x,pe.y+70,32,{alpha:a*(1-z),fill:'#9fc7ff'}); }
  label(L(TXT.moon),pm.x,pm.y-50,30,{alpha:a,fill:'#e6e1d6'});
  if(z<0.7){ const pc=sp2(V(6,1.6,0)); label(L(TXT.shadow),pc.x,pc.y-30,30,{alpha:smooth(seg(l,2,2.5))*(1-z),fill:'#c9c4e8'}); }
  if(k>0.9) label(L(TXT.copper),pm.x,pm.y+70,34,{alpha:smooth(seg(l,9,9.6)),fill:'#ff9a6a'});
  const ia=smooth(seg(l,12.3,12.9)); if(ia>0){ ctx.save(); ctx.globalAlpha=ia; ctx.fillStyle='rgba(8,8,24,0.92)'; rrect(1380,90,460,360,26); ctx.fill(); const cx=1610, cy=280, r=105;
    ctx.drawImage(moonImg,cx-r,cy-r,2*r,2*r); ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip(); ctx.fillStyle='rgba(90,25,12,0.85)'; ctx.beginPath(); ctx.arc(cx-250+lerp(0,40,smooth(seg(l,12.4,16))),cy+30,230,0,Math.PI*2); ctx.fill(); ctx.restore(); ctx.restore();
    txt(L(TXT.curved),1610,125,32,{alpha:ia,fill:'#ffe39a',shadow:false}); ctx.save(); ctx.globalAlpha=ia; ctx.strokeStyle='#ffe39a'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(1690,420); ctx.lineTo(1600,330); ctx.stroke(); ctx.restore(); }
}
function step2(l,g){ /* measure the shadow: sky view */
  renderer.render(sz,szCam); /* any scene; covered by the 2D sky */
  nightSky2D(g);
  const Rm=78, RS=2*Rm, CX=960, CY=420;
  const hh=lerp(-0.6,3.4,seg(l,1.0,16.0));
  const mx0=CX-RS-Rm; const x=mx0+hh*2*Rm;
  /* shadow outline */
  const oa=smooth(seg(l,0.4,1.0)); ctx.save(); ctx.globalAlpha=oa*0.35; ctx.fillStyle='#3a1a2a'; ctx.beginPath(); ctx.arc(CX,CY,RS,0,Math.PI*2); ctx.fill(); ctx.restore(); ghost(CX,CY,RS,'#ff9a6a',oa*0.8);
  label(L(TXT.shadow),CX,CY-RS-36,34,{alpha:oa,fill:'#ff9a6a'});
  /* the Moon, darkened where it is inside the shadow */
  moonDisc(x,CY,Rm);
  ctx.save(); ctx.beginPath(); ctx.arc(x,CY,Rm,0,Math.PI*2); ctx.clip(); const sg=ctx.createRadialGradient(CX,CY,RS-10,CX,CY,RS+8); sg.addColorStop(0,'rgba(90,25,12,0.82)'); sg.addColorStop(1,'rgba(90,25,12,0)');
  ctx.fillStyle='rgba(90,25,12,0.82)'; ctx.beginPath(); ctx.arc(CX,CY,RS-8,0,Math.PI*2); ctx.fill(); ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(CX,CY,RS+8,0,Math.PI*2); ctx.fill(); ctx.restore();
  /* hour marks */
  const hrs=Math.max(0,hh); txt(`${hrs.toFixed(1).replace('.',LANG==='fr'?',':'.')} h`,1620,150,64,{fill:'#ffd84a',alpha:smooth(seg(l,0.6,1.0))});
  txt(LANG==='fr'?'temps écoulé':'time elapsed',1620,205,28,{weight:500,fill:'#ffe39a',alpha:smooth(seg(l,0.6,1.0))});
  if(hh>1.0){ const a=smooth(seg(hh,1.0,1.25)); ghost(mx0,CY,Rm,'#9fc7ff',a*0.9); ghost(mx0+2*Rm,CY,Rm,'#9fc7ff',a*0.9); bracketH(mx0,mx0+2*Rm,CY+Rm+40,'#9fc7ff',a,L(TXT.oneHour),30); }
  if(l>10.4){ const a=smooth(seg(l,10.4,11.2)); ghost(CX-Rm,CY,Rm,'#ffd84a',a); ghost(CX+Rm,CY,Rm,'#ffd84a',a); bracketH(CX-RS,CX+RS,CY+RS+40,'#ffd84a',a,L(TXT.twoMoons),40); }
}
function step3(l,g){ /* the shadow narrows: cone diagram */
  cone.visible=true; orbitLine.visible=false; placeMoon(0); spEarth.rotation.y=2.2+g*0.05;
  spaceCam(6.5,0.6,21,6.5,0.3,0,40);
  renderer.render(sp,spCam);
  const pe=sp2(V(0,0,0)), pm=sp2(V(MD,0,0)), pa=sp2(V(APEX,0,0)), et=sp2(V(0,ER2,0)), eb=sp2(V(0,-ER2,0)), mt=sp2(V(MD,ER2*(1-MD/APEX),0)), mb=sp2(V(MD,-ER2*(1-MD/APEX),0));
  const a1=smooth(seg(l,0.8,1.6));
  ctx.save(); ctx.globalAlpha=a1; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=4; const back=sp2(V(-30,ER2+30*ER2/APEX,0)), backB=sp2(V(-30,-ER2-30*ER2/APEX,0));
  ctx.beginPath(); ctx.moveTo(back.x,back.y); ctx.lineTo(pa.x,pa.y); ctx.moveTo(backB.x,backB.y); ctx.lineTo(pa.x,pa.y); ctx.stroke(); ctx.restore();
  label('◀ '+L(TXT.sun),150,pe.y-160,40,{alpha:a1,fill:'#ffd84a'}); label(L(TXT.earth),pe.x,eb.y+60,34,{alpha:a1,fill:'#9fc7ff'}); label(L(TXT.moon),pm.x,mb.y+60,34,{alpha:a1,fill:'#e6e1d6'}); label(L(TXT.notScale),960,62,26,{alpha:a1*0.85,weight:500,fill:'#c9c4e8'});
  /* solar eclipse inset */
  const ia=smooth(seg(l,7.6,8.2))*(1-smooth(seg(l,13.2,13.8)));
  if(ia>0){ ctx.save(); ctx.globalAlpha=ia; ctx.fillStyle='rgba(8,8,24,0.92)'; rrect(1360,80,460,330,26); ctx.fill(); const cx=1590, cy=230;
    const cg=ctx.createRadialGradient(cx,cy,60,cx,cy,130); cg.addColorStop(0,'rgba(255,240,200,0.95)'); cg.addColorStop(1,'rgba(255,240,200,0)'); ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(cx,cy,130,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ffd23f'; ctx.beginPath(); ctx.arc(cx,cy,64,0,Math.PI*2); ctx.fill(); const cover=smooth(seg(l,8.2,10.2)); ctx.fillStyle='#0b0b14'; ctx.beginPath(); ctx.arc(cx+lerp(140,0,cover),cy,64,0,Math.PI*2); ctx.fill(); ctx.restore();
    txt(L(TXT.solarEcl),1590,112,30,{alpha:ia,fill:'#ffe39a',shadow:false}); txt(L(TXT.sameSize),1590,382,28,{alpha:ia*smooth(seg(l,10.2,10.6)),fill:'#ffffff',shadow:false}); }
  /* width bars */
  const ra=smooth(seg(l,13.8,14.6)); const rmPx=Math.abs(mt.y-mb.y)/4; /* moon radius in px */
  if(ra>0){ const xm=pm.x; for(let i=0;i<2;i++) ghost(xm,mt.y+rmPx+i*2*rmPx,rmPx,'#ffd84a',ra); bracketV(xm+rmPx+26,mt.y,mb.y,'#ffd84a',ra,L(TXT.twoMoonsS),32,1); }
  const ea=smooth(seg(l,15.6,16.4)); if(ea>0){ const xe=pe.x-150; for(let i=0;i<3;i++) ghost(xe,et.y+rmPx+i*2*rmPx,rmPx,'#9fc7ff',ea); bracketV(xe-rmPx-26,et.y,eb.y,'#9fc7ff',ea,L(TXT.threeMoons),36,-1);
    label(L(TXT.minus1),(pe.x+pm.x)/2,et.y-50,34,{alpha:ea,fill:'#ff9a6a'}); }
}
function step4(l,g){ /* result: Earth vs Moon sizes */
  szCam.fov=40; szCam.updateProjectionMatrix(); szCam.position.set(2,-0.4,17.5); szCam.lookAt(2,-1.3,0); szEarth.position.set(0,0,0); szEarth.rotation.y=2.0+g*0.04; szHalo.position.set(0,0,-1); szHalo.visible=true;
  distMoons.count=0; farMoon.visible=false; szEarth.visible=true;
  const real=smooth(seg(l,8.6,10.4)); const r=lerp(1,3/3.67,real); const n=real>0.02?4:3;
  szMoons.forEach((m,i)=>{ m.visible=i<n; m.scale.setScalar(r); const tIn=1.2+i*0.7; const u=easeOut(seg(l,tIn,tIn+1.2)); const y=-3+r+i*2*r; m.position.set(lerp(12,0,u),y,3.4); m.rotation.y=g*0.2+i; if(i===3){ m.scale.setScalar(r*smooth(seg(l,9.2,10.2))); m.position.x=lerp(12,0,easeOut(seg(l,9.2,10.4))); } });
  const fin=smooth(seg(l,13.5,15.0)); if(fin>0){ szMoons.forEach((m,i)=>{ if(i>0){ m.scale.multiplyScalar(1-fin); } else { m.position.set(lerp(0,6.4,fin),lerp(-3+r,0,fin),lerp(3.4,0,fin)); } }); }
  renderer.render(sz,szCam);
  const pE=scrV(V(0,-3,0),szCam), top=scrV(V(0,3,3.4),szCam), bot=scrV(V(0,-3,3.4),szCam);
  if(fin<0.5){ const a=smooth(seg(l,3.6,4.2))*(1-fin*2); bracketV(top.x+190,top.y,bot.y,'#ffd84a',a*(1-real),L(TXT.arist),40,1); bracketV(top.x+190,top.y,bot.y,'#7dff8a',a*real,L(TXT.today),40,1); }
  if(fin>0.5){ const a=smooth(seg(l,14.6,15.2)); label(LANG==='fr'?'Terre : 12 742 km':'Earth: 12,742 km',pE.x,pE.y+60,40,{alpha:a,fill:'#9fc7ff'}); const pm=scrV(V(6.4,-0.82,0),szCam); label(LANG==='fr'?'Lune : 3 474 km':'Moon: 3,474 km',pm.x,pm.y+60,40,{alpha:a,fill:'#e6e1d6'}); label(LANG==='fr'?'× 0,27':'× 0.27',(pE.x+pm.x)/2+60,scrV(V(3,2.6,0),szCam).y,52,{alpha:a,fill:'#ffd84a'}); }
}
function step5(l,g){ /* bonus: distance */
  if(l<8.2){ renderer.render(sz,szCam); nightSky2D(g);
    const a=smooth(seg(l,0.5,1.2)); const eye={x:230,y:600}, pea={x:860,y:560}, mo={x:1650,y:500}; const rp=20, rm=rp*(mo.x-eye.x)/(pea.x-eye.x);
    ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#e9b98f'; ctx.beginPath(); ctx.ellipse(eye.x-40,eye.y+10,70,90,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#2a211d'; ctx.beginPath(); ctx.arc(eye.x,eye.y-10,10,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#e9b98f'; ctx.lineWidth=34; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(eye.x-20,eye.y+90); ctx.quadraticCurveTo(eye.x+260,eye.y+120,pea.x-20,pea.y+40); ctx.stroke();
    ctx.fillStyle='#e9b98f'; ctx.beginPath(); ctx.ellipse(pea.x-10,pea.y+40,34,26,-0.3,0,Math.PI*2); ctx.fill(); ctx.restore();
    moonDisc(mo.x,mo.y+(eye.y-10-mo.y)*0,rm,a);
    const sl=smooth(seg(l,2.0,3.0)); if(sl>0){ ctx.save(); ctx.globalAlpha=sl; ctx.strokeStyle='rgba(255,230,140,0.9)'; ctx.lineWidth=3; ctx.setLineDash([10,8]);
      const ey=eye.y-10; const t1=(pea.y-rp-ey)/(pea.x-eye.x), t2=(pea.y+rp-ey)/(pea.x-eye.x); ctx.beginPath(); ctx.moveTo(eye.x,ey); ctx.lineTo(mo.x,ey+t1*(mo.x-eye.x)); ctx.moveTo(eye.x,ey); ctx.lineTo(mo.x,ey+t2*(mo.x-eye.x)); ctx.stroke(); ctx.restore();
      moonDisc(mo.x,ey+((t1+t2)/2)*(mo.x-eye.x),rm,a*0.0); }
    ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#6fbf4a'; ctx.beginPath(); ctx.arc(pea.x,pea.y,rp,0,Math.PI*2); ctx.fill(); ctx.restore();
    label(L(TXT.pea),pea.x,pea.y-70,32,{alpha:a,fill:'#b8f08a'}); label(L(TXT.half),eye.x+190,eye.y-80,40,{alpha:smooth(seg(l,3.0,3.5)),fill:'#ffd84a'}); label(L(TXT.moon),mo.x,mo.y-rm-40,34,{alpha:a});
    label(L(TXT.notScale),1660,70,26,{alpha:a*0.8,weight:500,fill:'#c9c4e8'});
    return; }
  const u=easeInOut(seg(l,8.4,13.5)); szEarth.visible=true; szHalo.visible=false; szMoons.forEach(m=>m.visible=false);
  const ER3=1.835; szEarth.scale.setScalar(ER3/3); szEarth.position.set(0,0,0);
  szCam.fov=40; szCam.updateProjectionMatrix(); szCam.position.set(lerp(-3,56,u),lerp(2.5,30,u),lerp(9,110,u)); szCam.lookAt(lerp(4,56,u),0,0);
  const nShow=Math.floor(clamp(seg(l,9.0,16.5),0,1)*DIST_N); const mm=new T.Matrix4(); for(let i=0;i<nShow;i++){ mm.makeTranslation(ER3+0.5+i*1.0,0,0); distMoons.setMatrixAt(i,mm); } distMoons.count=nShow; distMoons.instanceMatrix.needsUpdate=true;
  farMoon.visible=true; farMoon.position.set(ER3+0.5+DIST_N,0,0);
  renderer.render(sz,szCam);
  const pE=scrV(V(0,-ER3,0),szCam), pM=scrV(farMoon.position,szCam);
  label(L(TXT.earth),pE.x,pE.y+50,34,{fill:'#9fc7ff'}); label(L(TXT.moon),pM.x,pM.y+50,34,{fill:'#e6e1d6'});
  txt(`${nShow} ${L(TXT.moons)}`,960,150,64,{fill:'#ffd84a'}); txt(`≈ ${LANG==='fr'?fmt(nShow*3474):fmtEn(nShow*3474)} km`,960,215,40,{fill:'#ffffff'});
}
function step6(l,g){ /* the Sun at the centre */
  sam.background=samDawn; sam.userData.stars.opacity=0.15; seaMat.color.set('#3a62b0'); samHemi.intensity=0.85; samKey.color.set('#ffd8b0'); samKey.position.set(60,12,-200);
  bigMoon.visible=false; moonPath.visible=false; dawnSun.visible=true; orrery.visible=true; lamp.intensity=0.2;
  [arist,stud].forEach(resetP);
  samCam.position.set(lerp(-1,0,l/15),lerp(7,6.4,l/15),lerp(17,14,l/15)); samCam.lookAt(1.2,4.6,0);
  arist.root.position.set(-1.6,0,1.6); arist.root.rotation.y=0.6; arist.shR.rotation.x=-1.2; arist.shR.rotation.z=0.3; arist.head.rotation.y=0.25; arist.head.rotation.x=0.2;
  stud.root.position.set(4.6,0,2.2); stud.root.rotation.y=-0.8; stud.head.rotation.x=0.25; const wow=smooth(seg(l,8,8.6)); stud.shL.rotation.z=-2.4*wow; stud.shR.rotation.z=2.4*wow; stud.body.position.y=Math.abs(Math.sin(g*6))*0.2*wow;
  orArm.rotation.y=g*0.9; orMoonArm.rotation.y=g*4;
  renderer.render(sam,samCam);
  const po=scr(orSun,samCam); tag1(po.x,po.y-80,L(TXT.heliocentric),smooth(seg(l,1.0,1.5)),'rgba(184,134,46,0.92)');
  label(L(TXT.title),960,90,46,{alpha:smooth(seg(l,11,11.6))});
}
const STEP_FN=[step0,step1,step2,step3,step4,step5,step6];

/* ====================================================================== */
/*  Player                                                                 */
/* ====================================================================== */
let cur=0, lt=0, playing=false, mode='step', speed=1, holdT=0, gclock=0, started=false;
function drawFrame(){
  ctx.setTransform(SCL,0,0,SCL,0,0); ctx.clearRect(0,0,LW,LH);
  STEP_FN[cur](lt,gclock);
  const st=STEPS[cur]; let capTxt=null, capStart=0; for(const [t0,txtO] of st.caps){ if(lt>=t0){ capTxt=L(txtO); capStart=t0; } }
  captionBox(capTxt,smooth(seg(lt,capStart,capStart+0.4)));
  /* step chip */
  ctx.save(); ctx.globalAlpha=0.85; ctx.fillStyle='rgba(20,16,46,0.8)'; rrect(36,30,470,64,24); ctx.fill(); ctx.restore();
  txt(`${LANG==='fr'?'Étape':'Step'} ${cur+1}/${STEPS.length} · ${L(st.title)}`,56,62,30,{align:'left',shadow:false,maxW:430});
  veil(1-smooth(lt/0.35));
}
window.APP={ still(i,t,lang){ cur=i; lt=t; gclock=t; if(lang) LANG=lang; drawFrame(); return true; }, steps:STEPS.length, setSize:setRenderSize,
  fonts:document.fonts?document.fonts.load('700 100px Fredoka').then(()=>document.fonts.load('600 60px Fredoka')).then(()=>document.fonts.load('500 60px Fredoka')):Promise.resolve() };
const capC=document.createElement('canvas'); capC.width=LW; capC.height=LH; const capX=capC.getContext('2d');
window.APP.frame=(i,t,lang)=>{ window.APP.still(i,t,lang); capX.drawImage(glc,0,0,LW,LH); capX.drawImage(ui,0,0,LW,LH); return capC.toDataURL('image/jpeg',0.9); };
if(CAPTURE){ setRenderSize(LW); return; }

const $=id=>document.getElementById(id);
const stage=$('stage'), cover=$('cover'), music=$('music');
function layout(){ const vw=window.innerWidth, vh=window.innerHeight; let w=vw, h=vw*9/16; if(h>vh){ h=vh; w=vh*16/9; } stage.style.width=w+'px'; stage.style.height=h+'px'; setRenderSize(clamp(Math.round(w*Math.min(window.devicePixelRatio||1,2)),480,LW)); drawFrame(); }
let actx=null; function chime(){ if(!actx||$('mute').dataset.on==='0') return; try{ const o=actx.createOscillator(), gn=actx.createGain(); o.type='sine'; o.frequency.setValueAtTime(880,actx.currentTime); o.frequency.exponentialRampToValueAtTime(1320,actx.currentTime+0.12); gn.gain.setValueAtTime(0.0001,actx.currentTime); gn.gain.exponentialRampToValueAtTime(0.12,actx.currentTime+0.02); gn.gain.exponentialRampToValueAtTime(0.0001,actx.currentTime+0.9); o.connect(gn).connect(actx.destination); o.start(); o.stop(actx.currentTime+1); }catch(e){} }
const SV=(d)=>`<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" style="vertical-align:-0.16em" fill="currentColor">${d}</svg>`;
const ICON={ prev:SV('<path d="M6 5h2.5v14H6zM20 5v14L9.5 12z"/>'), next:SV('<path d="M5 5l11 7-11 7z"/><path d="M16.5 5H19v14h-2.5z"/>'), play:SV('<path d="M7 4.5l13 7.5-13 7.5z"/>'), pause:SV('<path d="M6 4.5h4.3v15H6zM13.7 4.5H18v15h-4.3z"/>'),
  replay:SV('<path d="M12 4a8 8 0 1 1-7.4 5h2.3A6 6 0 1 0 12 6v3L7.5 5 12 1z"/>'), snd:SV('<path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15 8.5a5 5 0 0 1 0 7M17.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'),
  mute:SV('<path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 9l5 6M20.5 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>') };
const UI={ fr:{start:'Commencer',prev:'Précédent',next:'Suivant',replay:'Rejouer l\'étape',mode_step:'Pas à pas',mode_auto:'Continu',speed:'Vitesse',sub:'Une animation en 7 étapes · cliquez sur « Suivant » à votre rythme',pause:'Pause',play:'Lecture',sound:'Son',modeTip:'Pas à pas : l\'animation attend « Suivant » à la fin de chaque étape. Continu : enchaîne tout seul.',speedTip:'Ralentir l\'animation',rot:'Tournez le téléphone pour un plus grand écran'},
           en:{start:'Start',prev:'Previous',next:'Next',replay:'Replay step',mode_step:'Step by step',mode_auto:'Continuous',speed:'Speed',sub:'An animation in 7 steps · click “Next” at your own pace',pause:'Pause',play:'Play',sound:'Sound',modeTip:'Step by step: waits for “Next” at the end of each step. Continuous: plays straight through.',speedTip:'Slow the animation down',rot:'Turn your phone sideways for a bigger picture'} };
function refreshUI(){ const u=UI[LANG]; $('btnStart').textContent=u.start; $('btnPrev').title=u.prev; $('btnNext').innerHTML=u.next+' '+ICON.play; $('btnPrev').innerHTML=ICON.prev; $('btnReplay').innerHTML=ICON.replay; $('mute').innerHTML=$('mute').dataset.on==='0'?ICON.mute:ICON.snd; $('mute').title=u.sound; $('btnMode').title=u.modeTip; $('btnSpeed').title=u.speedTip; $('btnReplay').title=u.replay;
  $('btnMode').textContent=mode==='step'?u.mode_step:u.mode_auto; $('btnSpeed').textContent=`${u.speed} ${speed===1?'1×':speed===0.75?'0,75×':'0,5×'}`.replace('0,',LANG==='fr'?'0,':'0.');
  $('btnPlay').innerHTML=playing?ICON.pause:ICON.play; $('btnPlay').title=playing?u.pause:u.play;
  $('coverTitle').textContent=L(TXT.title); $('coverSub').textContent=u.sub; $('rot').textContent='⟳ '+u.rot; document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.l===LANG));
  const dots=$('dots'); dots.innerHTML=''; STEPS.forEach((s,i)=>{ const d=document.createElement('button'); d.className='dot'+(i===cur?' on':'')+(i<cur?' done':''); d.title=`${i+1}. ${L(s.title)}`; d.onclick=()=>go(i); dots.appendChild(d); });
  document.documentElement.lang=LANG; }
function go(i){ cur=clamp(i,0,STEPS.length-1); lt=0; holdT=0; playing=true; $('btnNext').classList.remove('pulse'); refreshUI(); }
function next(){ if(cur<STEPS.length-1) go(cur+1); else { lt=STEPS[cur].dur; playing=false; refreshUI(); } }
$('btnStart').onclick=()=>{ cover.classList.add('hide'); started=true; try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); music.volume=0.55; const p=music.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} go(0); };
$('btnNext').onclick=()=>next(); $('btnPrev').onclick=()=>go(cur-1); $('btnReplay').onclick=()=>go(cur);
$('btnPlay').onclick=()=>{ if(lt>=STEPS[cur].dur){ next(); return; } playing=!playing; refreshUI(); };
$('btnMode').onclick=()=>{ mode=mode==='step'?'auto':'step'; refreshUI(); };
$('btnSpeed').onclick=()=>{ speed=speed===1?0.75:speed===0.75?0.5:1; refreshUI(); };
$('mute').onclick=()=>{ const on=$('mute').dataset.on!=='0'; $('mute').dataset.on=on?'0':'1'; music.muted=on; refreshUI(); };
document.querySelectorAll('.lang button').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); LANG=b.dataset.l; refreshUI(); drawFrame(); });
window.addEventListener('keydown',e=>{ if(!started) return; if(e.key==='ArrowRight') next(); else if(e.key==='ArrowLeft') go(cur-1); else if(e.key===' '){ e.preventDefault(); $('btnPlay').click(); } });
window.addEventListener('resize',layout);
let last=performance.now();
function loop(now){ const dt=Math.min(0.1,(now-last)/1000); last=now; gclock+=dt;
  if(started){ const d=STEPS[cur].dur;
    if(playing){ lt=Math.min(d,lt+dt*speed); if(lt>=d){ playing=false; holdT=0; chime(); if(mode==='step') $('btnNext').classList.add('pulse'); refreshUI(); } }
    else if(lt>=d && mode==='auto'){ holdT+=dt; if(holdT>2.6 && cur<STEPS.length-1) next(); } }
  drawFrame(); requestAnimationFrame(loop); }
window.APP.seek=(i,t)=>{ go(i); lt=t; }; window.APP.state=()=>({cur,lt,playing,mode,speed});
refreshUI(); window.APP.fonts.then(()=>{ layout(); }); layout(); requestAnimationFrame(loop);
})();
