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
 { dur:18, title:{fr:'Une mission pour l\'abbé Picard',en:'A mission for Abbé Picard'},
   caps:[[0.4,{fr:'Paris, 1669. L\'Académie royale des sciences confie une mission à l\'abbé Jean Picard : mesurer la Terre bien plus précisément qu\'Ératosthène.',en:'Paris, 1669. The Royal Academy of Sciences gives Abbé Jean Picard a mission: measure the Earth far more precisely than Eratosthenes did.'}],
         [8.8,{fr:'Son atout : une lunette à deux fils croisés, montée sur un grand quart de cercle gradué. Il vise au 1/240e de degré près !',en:'His secret weapon: a telescope with crossed hairs, mounted on a large graduated quadrant. He can aim to within 1/240 of a degree!'}]] },
 { dur:19, title:{fr:'La même idée qu\'Ératosthène',en:'Eratosthenes\' idea again'},
   caps:[[0.4,{fr:'L\'idée est celle d\'Ératosthène : mesurer la distance entre deux lieux sur le même méridien, et l\'angle qui les sépare.',en:'The idea is Eratosthenes\': measure the distance between two places on the same meridian, and the angle between them.'}],
         [9.0,{fr:'Picard choisit Malvoisine, au sud de Paris, et Sourdon, près d\'Amiens : environ 150 km plein nord.',en:'Picard picks Malvoisine, south of Paris, and Sourdon, near Amiens: about 150 km due north.'}]] },
 { dur:22, title:{fr:'La base : 11 km à la main',en:'The baseline: 11 km by hand'},
   caps:[[0.4,{fr:'Une seule longueur est mesurée à la main : la « base », une route toute droite entre Villejuif et Juvisy.',en:'Only one length is measured by hand: the “baseline”, a perfectly straight road from Villejuif to Juvisy.'}],
         [9.6,{fr:'Deux perches de bois de 4 toises (environ 8 m), posées l\'une après l\'autre : 5 663 toises, soit environ 11 km !',en:'Two wooden rods of 4 toises (about 8 m), laid one after the other: 5,663 toises, about 11 km!'}]] },
 { dur:32, title:{fr:'La triangulation',en:'Triangulation'},
   caps:[[0.4,{fr:'Plus besoin de marcher ! Depuis chaque bout de la base, on vise un clocher lointain et on mesure l\'angle.',en:'No more walking! From each end of the baseline, a distant church tower is sighted and the angle measured.'}],
         [11.0,{fr:'Une longueur et deux angles suffisent pour connaître tout le triangle : on calcule les deux autres côtés.',en:'One length and two angles are enough to know the whole triangle: the other two sides can be calculated.'}],
         [18.6,{fr:'Le calcul : le 3e angle vaut 180° moins les deux autres. Puis la « loi des sinus » donne chaque côté.',en:'The calculation: the third angle is 180° minus the other two. Then the “law of sines” gives each side.'}]] },
 { dur:30, title:{fr:'13 triangles jusqu\'à Amiens',en:'13 triangles to Amiens'},
   caps:[[0.4,{fr:'De clocher en clocher, Picard enchaîne 13 triangles. Dans chacun, le côté déjà connu (en jaune) sert de base.',en:'From tower to tower, Picard chains 13 triangles. In each one, the side already known (in yellow) is the base.'}],
         [8.2,{fr:'Depuis ses deux bouts, on vise le nouveau clocher, puis on calcule les deux autres côtés (en vert).',en:'From both of its ends, the new tower is sighted, then the other two sides are calculated (in green).'}],
         [15.6,{fr:'Un côté calculé devient à son tour la base du triangle suivant… et ainsi de suite jusqu\'à Sourdon !',en:'A calculated side then becomes the base of the next triangle… and so on, all the way to Sourdon!'}]] },
 { dur:28, title:{fr:'La distance du sud au nord',en:'The south-to-north distance'},
   caps:[[0.4,{fr:'Mais aucun côté de triangle n\'est orienté plein nord. Comment trouver la distance du sud au nord ?',en:'But no side of any triangle points due north. So how do you find the south-to-north distance?'}],
         [5.2,{fr:'Picard mesure aussi l\'angle entre un côté et la direction du nord, repérée grâce à l\'étoile Polaire. Il connaît alors l\'orientation de tous les côtés.',en:'Picard also measures the angle between one side and the direction of north, found with the Pole Star. He then knows the direction of every side.'}],
         [11.4,{fr:'Il « projette » chaque côté sur la ligne nord-sud, puis il additionne les morceaux, de Malvoisine jusqu\'à Sourdon.',en:'He “projects” each side onto the north-south line, then adds up the pieces, from Malvoisine to Sourdon.'}],
         [20.6,{fr:'Total : 78 850 toises, environ 154 km du sud au nord. Une 2e base, mesurée à la main, confirme les calculs.',en:'Total: 78,850 toises, about 154 km from south to north. A second baseline, measured by hand, confirms the calculations.'}]] },
 { dur:34, title:{fr:'L\'angle grâce aux étoiles',en:'The angle from the stars'},
   caps:[[0.4,{fr:'Reste l\'angle. À Malvoisine, puis à Sourdon, Picard mesure l\'angle entre une même étoile et la verticale du fil à plomb : ses deux « visées ».',en:'Now the angle. At Malvoisine, then at Sourdon, Picard measures the angle between the same star and the vertical of a plumb line: his two “sightings”.'}],
         [11.6,{fr:'L\'étoile est si loin que ses rayons arrivent parallèles. La verticale du fil à plomb, elle, pointe vers le centre de la Terre.',en:'The star is so far away that its rays arrive parallel. The plumb line, for its part, points to the Earth\'s centre.'}],
         [17.6,{fr:'Traçons par le centre une parallèle aux rayons : on y retrouve les deux visées (ce sont des angles correspondants).',en:'Draw a line through the centre parallel to the rays: both sightings appear there again (they are corresponding angles).'}],
         [24.8,{fr:'Donc l\'angle au centre = visée 1 − visée 2 = 1° 22′ 55″, à peine 1,4°. C\'est bien l\'angle entre les deux lieux !',en:'So the angle at the centre = sighting 1 − sighting 2 = 1° 22′ 55″, barely 1.4°. That really is the angle between the two places!'}]] },
 { dur:21, title:{fr:'Le rayon de la Terre',en:'The Earth\'s radius'},
   caps:[[0.4,{fr:'78 850 toises pour 1,38° : un degré vaut donc 57 060 toises, environ 111 km. Le tour de la Terre : 360 fois plus, environ 40 000 km.',en:'78,850 toises for 1.38°: so one degree is 57,060 toises, about 111 km. Around the Earth: 360 times that, about 40,000 km.'}],
         [11.0,{fr:'Rayon de la Terre : environ 6 372 km. Aujourd\'hui, on mesure 6 371 km en moyenne : presque parfait !',en:'Earth\'s radius: about 6,372 km. Today we measure 6,371 km on average: almost perfect!'}]] },
 { dur:21, title:{fr:'Sur les épaules de Picard',en:'On Picard\'s shoulders'},
   caps:[[0.4,{fr:'En 1684, Isaac Newton se sert du rayon de Picard pour vérifier sa loi : la Lune « tombe » vers la Terre comme une pomme !',en:'In 1684, Isaac Newton uses Picard\'s radius to check his law: the Moon “falls” towards the Earth just like an apple!'}],
         [10.6,{fr:'Et en 1672, Picard avait ramené du Danemark un jeune astronome : Ole Rømer, qui mesurera la vitesse de la lumière !',en:'And in 1672, Picard had brought a young astronomer back from Denmark: Ole Rømer, who would measure the speed of light!'}]] },
];
const TXT={
  picard:{fr:'l\'abbé Jean Picard',en:'Abbé Jean Picard'}, paris:{fr:'Paris, 1669',en:'Paris, 1669'}, quad:{fr:'quart de cercle gradué',en:'graduated quadrant'}, lens:{fr:'lunette à fils croisés',en:'telescope with crossed hairs'},
  erato:{fr:'Ératosthène : 7,2° et 800 km',en:'Eratosthenes: 7.2° and 800 km'}, malv:{fr:'Malvoisine',en:'Malvoisine'}, sourd:{fr:'Sourdon',en:'Sourdon'},
  dist:{fr:'distance ?',en:'distance?'}, angle:{fr:'angle ?',en:'angle?'}, km150:{fr:'≈ 150 km',en:'≈ 150 km'},
  vil:{fr:'moulin de Villejuif',en:'Villejuif windmill'}, juv:{fr:'pavillon de Juvisy',en:'Juvisy pavilion'}, toises:{fr:'toises mesurées',en:'toises measured'}, toise:{fr:'1 toise ≈ 1,95 m',en:'1 toise ≈ 1.95 m'},
  base:{fr:'base mesurée',en:'measured baseline'}, clocher:{fr:'clocher',en:'church tower'}, known:{fr:'connu',en:'known'}, calc:{fr:'calculé !',en:'calculated!'},
  notScale:{fr:'(pas à l\'échelle)',en:'(not to scale)'}, simple:{fr:'(schéma simplifié)',en:'(simplified diagram)'}, tri:{fr:'triangle',en:'triangle'}, check:{fr:'2e base : vérifié !',en:'2nd baseline: checked!'},
  vert:{fr:'verticale (fil à plomb)',en:'vertical (plumb line)'}, star:{fr:'étoile',en:'star'}, exag:{fr:'(angles exagérés)',en:'(angles exaggerated)'}, center:{fr:'centre de la Terre',en:'Earth\'s centre'},
  oneDeg:{fr:'1 degré',en:'1 degree'}, around:{fr:'tour de la Terre',en:'around the Earth'}, radius:{fr:'rayon',en:'radius'}, today:{fr:'aujourd\'hui : 6 371 km',en:'today: 6,371 km'},
  same:{fr:'la même force : la gravitation',en:'the same force: gravity'}, newton:{fr:'Isaac Newton',en:'Isaac Newton'}, roemer:{fr:'Ole Rømer',en:'Ole Rømer'}, seeStory:{fr:'→ son histoire : la vitesse de la lumière',en:'→ his story: the speed of light'},
};

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
  if(o.cassock) P.cassock=mesh(body,cyl(0.56,1.02,4.3,28),o.cassock,0,2.98,0);
  if(o.coat){ mesh(body,cyl(0.52,0.8,2.05,28),o.coat,0,3.62,0); }
  if(o.buttons) for(let k=0;k<6;k++) mesh(body,sph(0.06,8),o.buttons,0,3.0+k*0.5,k<3?0.6+k*0.05:0.42,{cast:false});
  if(o.cravat){ mesh(body,sph(0.2,14),'#ffffff',0,5.85,0.3,{s:[1.1,0.9,0.6],cast:false}); mesh(body,sph(0.14,12),'#ffffff',0,5.45,0.36,{s:[0.9,1.6,0.5],cast:false}); }
  if(o.rabat) for(const s of [-1,1]) mesh(body,bx(0.17,0.46,0.05),'#ffffff',s*0.095,5.62,0.4,{cast:false,rx:-0.12});
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
  if(o.hair){ mesh(head,sph(0.8,32),o.hair,0,0.62,-0.1,{s:[1.02,0.66,0.98]}); for(const s of [-1,1]) mesh(head,sph(0.3,16),o.hair,s*0.7,0.42,-0.18,{s:[0.6,1.1,0.9]}); }
  if(o.calotte) mesh(head,sph(0.46,24),o.calotte,0,1.5,-0.14,{s:[1,0.36,1]});
  if(o.hat){ const h=grp(head,0,1.42,-0.04); h.rotation.x=-0.08; mesh(h,cyl(1.12,1.12,0.07,28),o.hat,0,0,0); mesh(h,cyl(0.58,0.66,0.72,24),o.hat,0,0.38,0); mesh(h,cyl(0.67,0.67,0.12,24),o.band||'#2a2018',0,0.1,0,{cast:false}); }
  return P;
}
function resetP(P){ P.body.position.set(0,0,0); P.body.rotation.set(0,0,0); for(const k of ['hipL','hipR','kneeL','kneeR','shL','shR','elL','elR']) P[k].rotation.set(0,0,0); P.head.rotation.set(0,0,0); }
function walkP(P,ph,amp){ const a=amp==null?0.5:amp; P.hipL.rotation.x=Math.sin(ph)*a; P.hipR.rotation.x=-Math.sin(ph)*a; P.kneeL.rotation.x=Math.max(0,-Math.sin(ph))*a*1.3; P.kneeR.rotation.x=Math.max(0,Math.sin(ph))*a*1.3;
  P.shL.rotation.x=-Math.sin(ph)*a*0.7; P.shR.rotation.x=Math.sin(ph)*a*0.7; P.body.position.y=Math.abs(Math.cos(ph))*0.12; }
function wave(P,side,t){ const sh=side>0?P.shR:P.shL, el=side>0?P.elR:P.elL; sh.rotation.z=side*2.5; el.rotation.z=side*(0.35+0.35*Math.sin(t*10)); }
const PICARD={skin:'#f1c9a7',top:'#1d1b26',cassock:'#1d1b26',sleeve:'#1d1b26',legs:'#1d1b26',thigh:'#1d1b26',shoes:'#121212',buckle:'#c9a24a',rabat:true,hair:'#a29c94',calotte:'#121218'};
const AIDE1={skin:'#e9bf9c',top:'#7a5534',coat:'#7a5534',sleeve:'#7a5534',legs:'#e8e0d0',thigh:'#4a3a2a',shoes:'#2a1a10',hair:'#4a3020',hat:'#4a3c2c',band:'#2a2018'};
const AIDE2={skin:'#d9a883',top:'#3f6e4f',coat:'#3f6e4f',sleeve:'#3f6e4f',legs:'#e8e0d0',thigh:'#2f3a2a',shoes:'#2a1a10',hair:'#2a1a10',hat:'#6b4a2c',band:'#3a2414'};
const NEWTON={skin:'#f2cba8',top:'#8a3b2e',coat:'#8a3b2e',sleeve:'#8a3b2e',buttons:'#e8c25a',cravat:true,cuffs:'#ffffff',legs:'#f1ede4',thigh:'#3a2a20',shoes:'#1a1a1a',buckle:'#e8c25a',wig:'#ece8e0'};
const ROEMER={skin:'#f2cba8',top:'#2f4a8a',coat:'#2f4a8a',sleeve:'#2f4a8a',buttons:'#e8c25a',cravat:true,cuffs:'#ffffff',legs:'#f1ede4',thigh:'#2b2b3a',shoes:'#1a1a1a',buckle:'#e8c25a',wig:'#6b4528'};

/* ====================================================================== */
/*  SCENE: the countryside south of Paris (day / dusk / night)              */
/* ====================================================================== */
const fld=new T.Scene();
const skyDay=gradTex([[0,'#4f86d4'],[0.55,'#9fc3ee'],[1,'#f2e6c8']]), skyDusk=gradTex([[0,'#34428e'],[0.5,'#8e84c4'],[0.85,'#f0a67c'],[1,'#ffd6a0']]), skyNight=gradTex([[0,'#03051a'],[0.6,'#0b1340'],[1,'#22245a']]);
fld.background=skyDay; fld.fog=new T.Fog('#d6e0ee',160,900);
const fldCam=new T.PerspectiveCamera(40,LW/LH,0.1,4000);
const fldHemi=new T.HemisphereLight('#ffffff','#7f925e',0.78); fld.add(fldHemi);
const fldSun=new T.DirectionalLight('#fff3dc',0.95); fldSun.castShadow=true; fldSun.shadow.mapSize.set(2048,2048);
Object.assign(fldSun.shadow.camera,{left:-46,right:46,top:46,bottom:-46,near:1,far:300}); fldSun.shadow.bias=-0.0005; fldSun.shadow.normalBias=0.02; fld.add(fldSun); fld.add(fldSun.target);
function sunAt(x,z){ fldSun.target.position.set(x,0,z); fldSun.position.set(x+60,90,z+45); }
const fieldTex=canvasTex(1024,1024,(g,w,h)=>{ const cols=['#9cbf63','#b9cf72','#d9c76d','#8fb35a','#c9b45e','#a7c46a','#e0cf86'];
  g.fillStyle='#a6c46a'; g.fillRect(0,0,w,h); let y=0; while(y<h){ const hh=60+R()*130; let x=0; while(x<w){ const ww=90+R()*260; g.fillStyle=cols[Math.floor(R()*cols.length)]; g.fillRect(x,y,ww,hh);
    g.strokeStyle='rgba(80,90,40,0.18)'; g.lineWidth=2; const vert=R()<0.5; for(let k=6;k<(vert?ww:hh);k+=12){ g.beginPath(); if(vert){ g.moveTo(x+k,y); g.lineTo(x+k,y+hh);} else { g.moveTo(x,y+k); g.lineTo(x+ww,y+k);} g.stroke(); }
    g.strokeStyle='rgba(90,110,50,0.55)'; g.lineWidth=4; g.strokeRect(x,y,ww,hh); x+=ww; } y+=hh; } });
fieldTex.wrapS=fieldTex.wrapT=T.RepeatWrapping; fieldTex.repeat.set(7,7);
const groundMat=new T.MeshLambertMaterial({map:fieldTex});
mesh(fld,new T.PlaneGeometry(4000,4000),groundMat,0,0,0,{rx:-Math.PI/2,cast:false});
const roadMat=new T.MeshLambertMaterial({color:'#dcc79e'});
const road=mesh(fld,new T.PlaneGeometry(6000,7),roadMat,0,0.03,0,{rx:-Math.PI/2,cast:false});
for(const z of [-2.6,2.6]) mesh(road,new T.PlaneGeometry(6000,0.35),new T.MeshLambertMaterial({color:'#c4ad80'}),0,z,0.01,{cast:false});
function tree(p,s,c){ const g=grp(p,0,0,0); mesh(g,cyl(0.35*s,0.5*s,4*s,10),'#6b4f36',0,2*s,0); mesh(g,sph(2.6*s,18),c||'#5f8a3c',0,5.6*s,0,{s:[1,1.15,1]}); mesh(g,sph(1.8*s,16),c?c:'#6f9a48',0.9*s,6.6*s,0.5*s); return g; }
const roadTrees=[]; for(let i=0;i<64;i++){ const t=tree(fld,0.95+R()*0.25,i%3?'#5d8a3a':'#6a9444'); roadTrees.push(t); }
function placeRoadTrees(cx,farOnly){ roadTrees.forEach((t,i)=>{ const side=i%2?1:-1, k=Math.floor(i/2); if(farOnly&&side>0){ t.visible=false; return; } const span=32*28; const x=cx+((((k*28+(side>0?14:0))-cx)%span)+span)%span-span/2; t.position.set(x,0,side*9.5); t.visible=true; }); }
/* scattered trees and hedges far away */
for(let i=0;i<70;i++){ const a=R()*Math.PI*2, r=120+R()*500; const t=tree(fld,1.2+R()*0.8,i%2?'#56803a':'#668f45'); let z=Math.sin(a)*r; if(Math.abs(z)<150) z=-150-Math.abs(z)*2; t.position.set(Math.cos(a)*r,0,z); }
/* windmill of Villejuif */
const mill=grp(fld,0,0,0); mesh(mill,cyl(2.0,2.8,10,20),'#ece3d0',0,5,0); mesh(mill,new T.ConeGeometry(2.5,3.2,20),'#7a5a3e',0,11.6,0); mesh(mill,bx(1.2,2.2,0.3),'#5a3e28',0,1.1,2.6);
const sails=grp(mill,0,9.6,2.6); for(let k=0;k<4;k++){ const b=grp(sails,0,0,0); b.rotation.z=k*Math.PI/2; mesh(b,bx(0.25,7.5,0.15),'#6b4f36',0,3.9,0); mesh(b,bx(1.5,6.2,0.06),'#f3ecdc',0.8,4.3,0.05); }
/* pavilion of Juvisy */
const pav=grp(fld,0,0,0); mesh(pav,bx(10,6,8),'#efe3c8',0,3,0); const pr=mesh(pav,new T.ConeGeometry(7.4,4,4),'#56637e',0,8,0,{ry:Math.PI/4}); pr.scale.set(1,1,0.8);
for(const x of [-3,0,3]) mesh(pav,bx(1.2,1.8,0.2),'#5a6a8a',x,3.6,4.05,{cast:false}); mesh(pav,bx(1.6,2.6,0.2),'#6b4f36',0,1.3,4.05,{cast:false});
/* church towers */
function church(p,x,z,s){ const g=grp(p,x,0,z); g.scale.setScalar(s||1); mesh(g,bx(7,6,12),'#e2d6bc',0,3,4); mesh(g,new T.ConeGeometry(5.2,3,4),'#7a6a5a',0,7.4,4,{ry:Math.PI/4}).scale.set(1,1,1.7);
  mesh(g,bx(3.4,13,3.4),'#ddd0b4',0,6.5,-3); const sp=mesh(g,new T.ConeGeometry(2.5,7,4),'#56637e',0,16.5,-3,{ry:Math.PI/4}); mesh(g,bx(0.15,1.6,0.15),'#c9a24a',0,20.6,-3); mesh(g,bx(0.9,0.15,0.15),'#c9a24a',0,20.8,-3); return g; }
const churchC=church(fld,0,0,1.2); const churchFar=[church(fld,-260,-380,1.4),church(fld,320,-420,1.3)];
/* Paris on the horizon */
const parisG=grp(fld,40,0,-520); (function(){ for(let i=0;i<26;i++){ const w=8+R()*10, h=8+R()*12; mesh(parisG,bx(w,h,8),i%2?'#d9cdb8':'#cbbfa8',-130+i*10.5+R()*4,h/2,R()*20); mesh(parisG,new T.ConeGeometry(w*0.75,5,4),'#5d6a86',-130+i*10.5,h+2.5,0,{ry:Math.PI/4}); }
  for(const x of [-12,12]) mesh(parisG,bx(12,46,12),'#e0d4bc',x-6,23,-6); mesh(parisG,bx(36,24,16),'#d8ccb4',-6,12,-6); const sp=mesh(parisG,new T.ConeGeometry(2.4,22,6),'#56637e',-6,35,-6); })();
/* the quadrant on its tripod */
const limbTex=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#d6a94c'; g.fillRect(0,0,w,h); const ro=4.3, P=(r,a)=>[(r*Math.cos(a)/ro+1)/2*w,(1-(r*Math.sin(a)/ro+1)/2)*h];
  g.strokeStyle='#3a2410';
  for(let d=0;d<=90;d++){ const a=d*D2R, r1=d%10===0?3.6:d%5===0?3.86:4.02; const q0=P(r1,a), q1=P(4.29,a); g.lineWidth=d%10===0?3.2:d%5===0?2.2:1.3; g.beginPath(); g.moveTo(q0[0],q0[1]); g.lineTo(q1[0],q1[1]); g.stroke(); }
  for(const r of [4.02,3.58]){ g.lineWidth=1.6; g.beginPath(); for(let d=0;d<=90;d++){ const q=P(r,d*D2R); d?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); } g.stroke(); } });
function quadrantModel(){ const g=new T.Group(); const brass='#c79a3c', wood='#6b4a2a';
  for(let k=0;k<3;k++){ const lg=grp(g,0,4.3,0); lg.rotation.y=k*Math.PI*2/3+0.5; const inner=grp(lg,0,0,0); inner.rotation.x=0.38; mesh(inner,cyl(0.07,0.1,4.8,8),wood,0,-2.35,0); }
  const head=grp(g,0,4.45,0); mesh(head,cyl(0.3,0.36,0.3,16),brass,0,-0.1,0);
  const plate=grp(head,0,0.12,0);
  /* frame: two radii + a brace, and the graduated limb (0° to 90°) */
  mesh(plate,bx(4.3,0.1,0.24),brass,2.15,0,0); mesh(plate,bx(0.24,0.1,4.3),brass,0,0,-2.15); mesh(plate,bx(3.5,0.08,0.14),brass,1.25,0,-1.25,{ry:Math.PI/4});
  const limb=new T.Mesh(new T.RingGeometry(3.55,4.3,48,1,0,Math.PI/2),new T.MeshLambertMaterial({map:limbTex,side:T.DoubleSide})); limb.rotation.x=-Math.PI/2; limb.position.y=0.07; limb.receiveShadow=true; plate.add(limb);
  for(const r of [3.55,4.3]){ const rim=new T.Mesh(new T.TorusGeometry(r,0.05,6,40,Math.PI/2),lam(brass)); rim.rotation.x=-Math.PI/2; rim.position.y=0.07; plate.add(rim); }
  mesh(plate,cyl(0.17,0.17,0.95,12),brass,0,0.42,0);
  /* fixed telescope, resting on two posts along the first radius */
  const fixedT=grp(plate,0,0,0); for(const x of [0.9,3.4]) mesh(fixedT,cyl(0.05,0.05,0.34,8),brass,x,0.22,0);
  mesh(fixedT,cyl(0.13,0.11,3.85,14),wood,2.2,0.42,0,{rz:Math.PI/2}); mesh(fixedT,cyl(0.15,0.15,0.16,14),brass,4.1,0.42,0,{rz:Math.PI/2}); mesh(fixedT,cyl(0.1,0.1,0.2,12),brass,0.3,0.42,0,{rz:Math.PI/2});
  /* movable telescope (alidade): turns around the centre, its pointer slides on the graduations */
  const alid=grp(plate,0,0,0); mesh(alid,bx(4.2,0.06,0.2),brass,2.2,0.13,0); for(const x of [0.9,3.4]) mesh(alid,cyl(0.05,0.05,0.56,8),brass,x,0.44,0);
  mesh(alid,cyl(0.13,0.11,3.85,14),wood,2.2,0.76,0,{rz:Math.PI/2}); mesh(alid,cyl(0.15,0.15,0.16,14),brass,4.1,0.76,0,{rz:Math.PI/2}); mesh(alid,cyl(0.1,0.1,0.2,12),brass,0.3,0.76,0,{rz:Math.PI/2});
  mesh(alid,new T.ConeGeometry(0.13,0.4,4),'#b0301e',3.95,0.2,0,{rz:-Math.PI/2,cast:false});
  return {g,head,plate,alid,fixedT};
}
const Q=quadrantModel(); fld.add(Q.g);
const Q2=quadrantModel(); fld.add(Q2.g);
/* the zenith sector (night) */
const sector=grp(fld,0,0,0); (function(){ const wood='#6b4a2a', brass='#c79a3c';
  for(const x of [-1.6,1.6]) mesh(sector,bx(0.45,21,0.45),wood,x,10.5,0); mesh(sector,bx(4.0,0.5,0.6),wood,0,21,0); for(const x of [-1.6,1.6]) mesh(sector,bx(0.5,0.5,5),wood,x,0.25,0);
})();
const secTube=grp(sector,0,20.6,0); mesh(secTube,cyl(0.28,0.22,14.5,16),'#6b4a2a',0,-7.25,0); mesh(secTube,cyl(0.32,0.32,0.3,16),'#c79a3c',0,-0.15,0); mesh(secTube,cyl(0.18,0.18,0.5,12),'#c79a3c',0,-14.6,0);
const secArc=new T.Mesh(new T.TorusGeometry(14.0,0.1,8,40,0.7),lam('#c79a3c')); secArc.rotation.z=-Math.PI/2-0.35; secArc.position.set(0,20.6,0); sector.add(secArc);
const plumb=grp(sector,0,20.6,0); mesh(plumb,cyl(0.025,0.025,14.6,6),'#f2f2f2',0,-7.3,0.35,{cast:false}); mesh(plumb,sph(0.28,12),'#3a3a3a',0,-14.7,0.35);
sector.visible=false; const SS=0.8; sector.scale.setScalar(SS);
const lantern=grp(fld,0,0,0); mesh(lantern,cyl(0.32,0.4,0.9,10),'#3a2a1a',0,0.45,0); mesh(lantern,sph(0.34,12),bas('#ffd27a'),0,1.1,0,{cast:false}); const lanternL=new T.PointLight('#ffc27a',1.6,46,1.4); lanternL.position.set(0,2.2,0); lantern.add(lanternL); lantern.add(glowSprite('rgba(255,200,110,1)',4)); lantern.visible=false;
/* rods for the baseline */
const rodMat=new T.MeshLambertMaterial({color:'#caa46a'});
const rods=[0,1].map(()=>{ const g=grp(fld,0,0,0); mesh(g,bx(32,0.34,0.34),rodMat,16,0,0); for(const x of [0.15,31.85]) mesh(g,bx(0.3,0.4,0.4),'#8a6a3a',x,0,0); return g; });
/* people */
const picard=person(PICARD); fld.add(picard.root);
const aide1=person(AIDE1); fld.add(aide1.root);
const aide2=person(AIDE2); fld.add(aide2.root);
const newton=person(NEWTON); fld.add(newton.root);
const roemer=person(ROEMER); roemer.root.scale.setScalar(0.96); fld.add(roemer.root);
/* apple tree + apple + Moon (step 7) */
const appleTree=grp(fld,0,0,0); mesh(appleTree,cyl(0.6,0.9,6,10),'#6b4f36',0,3,0); [[0,8.4,0,4],[-2.6,7.4,1,2.8],[2.8,7.6,-0.6,3],[0.8,10,0.8,2.6]].forEach(([x,y,z,r],i)=>mesh(appleTree,sph(r,20),i%2?'#4f7f34':'#5a8c3c',x,y,z,{s:[1.15,0.85,1.1]}));
for(let i=0;i<14;i++){ const a=R()*Math.PI*2, e=R()*0.9-0.2; mesh(appleTree,sph(0.3,12),'#d6352b',Math.cos(a)*3.8*Math.cos(e),8.4+Math.sin(e)*3.0,Math.sin(a)*3.4*Math.cos(e)+0.4,{cast:false}); }
const apple=mesh(fld,sph(0.34,14),'#d6352b',0,0,0); mesh(apple,cyl(0.03,0.03,0.25,6),'#5a3a20',0,0.35,0,{cast:false});
const fldMoon=grp(fld,0,0,0); mesh(fldMoon,new T.SphereGeometry(9,32,20),new T.MeshBasicMaterial({color:'#f2efe6',fog:false}),0,0,0,{cast:false,recv:false}); fldMoon.add(glowSprite('rgba(230,235,255,1)',40));
/* night sky (stars + Cassiopeia) */
const nightStars=(function(){ const n=1400,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const a=R()*Math.PI*2, e=0.06+R()*1.45; pos.set([Math.cos(a)*Math.cos(e)*900,Math.sin(e)*900,Math.sin(a)*Math.cos(e)*900],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); const p=new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2.2,sizeAttenuation:false,fog:false})); fld.add(p); return p; })();
const CASS=[[-0.5,0.2],[-0.25,-0.18],[0,0.06],[0.24,-0.2],[0.5,0.14]];
const cassG=grp(fld,0,0,0); const cassStars=CASS.map(([u,v],i)=>{ const s=glowSprite(i===2?'rgba(255,240,170,1)':'rgba(235,240,255,1)',i===2?7:4.2); s.position.set(u*26,v*26,0); s.material.fog=false; cassG.add(s); return s; });
function setMood(m){ /* 'day' | 'dusk' | 'night' */
  fld.background=m==='day'?skyDay:m==='dusk'?skyDusk:skyNight; fld.fog.color.set(m==='day'?'#d6e0ee':m==='dusk'?'#d7b9a8':'#141a40');
  fldHemi.intensity=m==='night'?0.32:0.78; fldHemi.color.set(m==='night'?'#8fa0ff':'#ffffff'); fldSun.intensity=m==='night'?0.25:m==='dusk'?0.75:0.95; fldSun.color.set(m==='night'?'#9fb0ff':m==='dusk'?'#ffd0a0':'#fff3dc');
  groundMat.color.set(m==='night'?'#55607a':'#ffffff'); nightStars.visible=m==='night'; cassG.visible=m==='night'; }
function hideAll(){ [Q.g,Q2.g,sector,lantern,mill,pav,churchC,parisG,appleTree,apple,fldMoon,...rods,picard.root,aide1.root,aide2.root,newton.root,roemer.root,...churchFar].forEach(o=>o.visible=false); roadTrees.forEach(t=>t.visible=false); road.visible=true; [picard,aide1,aide2,newton,roemer].forEach(resetP); if(fldCam.fov!==40){ fldCam.fov=40; fldCam.updateProjectionMatrix(); } }

/* ====================================================================== */
/*  SCENE: the globe in space                                              */
/* ====================================================================== */
const glb=new T.Scene(); glb.background=gradTex([[0,'#060a24'],[0.6,'#0f1a48'],[1,'#1b2260']]);
const gCam=new T.PerspectiveCamera(40,LW/LH,0.1,3000);
glb.add(new T.AmbientLight('#8fa0d8',0.5)); const gSun=new T.DirectionalLight('#fff6e6',1.0); gSun.position.set(-30,20,40); glb.add(gSun);
(function(){ const n=1600,pos=new Float32Array(n*3); for(let i=0;i<n;i++){ const v=V(R()-0.5,R()-0.5,R()-0.5).normalize().multiplyScalar(600+R()*200); pos.set([v.x,v.y,v.z],i*3);} const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(pos,3)); glb.add(new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2,sizeAttenuation:false}))); })();
const GR=10;
function ll(lat,lon,r){ const la=lat*D2R, ph=(lon+180)*D2R, rr=r||GR; return V(-rr*Math.cos(ph)*Math.cos(la), rr*Math.sin(la), rr*Math.sin(ph)*Math.cos(la)); }
const gMat=new T.MeshLambertMaterial({map:worldTex,transparent:true});
const gTilt=grp(glb,0,0,0), gSpin=grp(gTilt,0,0,0);
mesh(gSpin,new T.SphereGeometry(GR,128,64),gMat,0,0,0,{cast:false,recv:false});
const gHalo=glowSprite('rgba(110,170,255,1)',30); gHalo.position.set(0,0,-2); glb.add(gHalo);
function aimG(lat,lon){ gTilt.rotation.x=lat*D2R; gSpin.rotation.y=(270-lon)*D2R; }
function pinG(lat,lon,color){ const p=grp(gSpin,0,0,0); const n=ll(lat,lon,1).normalize(); p.position.copy(n.clone().multiplyScalar(GR)); p.quaternion.setFromUnitVectors(V(0,1,0),n);
  mesh(p,cyl(0.012,0.03,0.42,10),'#ececec',0,0.21,0,{cast:false}); mesh(p,sph(0.075,16),color,0,0.45,0,{cast:false}); return p; }
function arcTube(a,b,color,rad,seg){ const va=ll(a[0],a[1],1).normalize(), vb=ll(b[0],b[1],1).normalize(); const pts=[]; const n=seg||40; for(let i=0;i<=n;i++){ pts.push(va.clone().lerp(vb,i/n).normalize().multiplyScalar(GR+0.03)); }
  return mesh(gSpin,new T.TubeGeometry(new T.CatmullRomCurve3(pts),n,rad||0.05,8,false),new T.MeshBasicMaterial({color}),0,0,0,{cast:false,recv:false}); }
const MALV=[48.51,2.45], SOUR=[49.71,2.37], ALEX=[31.2,29.9], SYEN=[24.09,32.9];
const pinM=pinG(MALV[0],MALV[1],'#ffd84a'), pinS=pinG(SOUR[0],SOUR[1],'#ffd84a'), pinA=pinG(ALEX[0],ALEX[1],'#ff6b75'), pinY=pinG(SYEN[0],SYEN[1],'#ffb703');
const eraArc=arcTube(SYEN,ALEX,'#ff9f43',0.06), picArc=arcTube(MALV,SOUR,'#ffd84a',0.07,20);
const ringPts=[]; for(let i=0;i<=360;i++){ ringPts.push(ll(MALV[0]+i,2.4,GR+0.04)); }
const ring=mesh(gSpin,new T.TubeGeometry(new T.CatmullRomCurve3(ringPts),360,0.13,6,false),new T.MeshBasicMaterial({color:'#ffd84a'}),0,0,0,{cast:false,recv:false});
const RING_IDX=ring.geometry.index.count;
const gw=V(0,0,0); function gScr(lat,lon,r){ const v=gSpin.localToWorld(ll(lat,lon,r||GR)); return scrV(v,gCam); }

/* ====================================================================== */
/*  2D helpers                                                             */
/* ====================================================================== */
function captionBox(text,a){ if(a<=0.003||!text) return; capBox(text,a); }
function label(s,x,y,size,o){ return txt(s,x,y,size,Object.assign({stroke:'#0b0820',sw:0.14},o||{})); }
function pill(x,y,s,a,color,size){ if(a<=0.003) return; const sz=size||34; ctx.save(); ctx.globalAlpha=a; ctx.font=`700 ${sz}px ${FF}`; const w=ctx.measureText(s).width+sz*1.4; ctx.fillStyle=color||'rgba(20,16,46,0.85)'; rrect(x-w/2,y-sz*0.9,w,sz*1.8,sz*0.65); ctx.fill(); ctx.restore(); txt(s,x,y,sz,{alpha:a,shadow:false}); }
function line2(a,b,col,w,frac,dash){ ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w; ctx.lineCap='round'; if(dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(a.x,a.y); const f=frac==null?1:frac; ctx.lineTo(lerp(a.x,b.x,f),lerp(a.y,b.y,f)); ctx.stroke(); ctx.restore(); }
function angArc(c,r,a0,a1,col,w,al){ ctx.save(); ctx.globalAlpha=al==null?1:al; ctx.strokeStyle=col; ctx.lineWidth=w||6; ctx.beginPath(); let d=a1-a0; while(d>Math.PI) d-=Math.PI*2; while(d<-Math.PI) d+=Math.PI*2; ctx.arc(c.x,c.y,r,a0,a0+d,d<0); ctx.stroke(); ctx.restore(); }
const ang=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
function panel(x,y,w,h,a){ if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='rgba(14,10,36,0.88)'; rrect(x,y,w,h,26); ctx.fill(); ctx.restore(); }
function check(x,y,s,a){ if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle='#7dff8a'; ctx.lineWidth=s*0.18; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(x-s*0.45,y); ctx.lineTo(x-s*0.1,y+s*0.35); ctx.lineTo(x+s*0.5,y-s*0.4); ctx.stroke(); ctx.restore(); }
const NUM=(fr,en)=>LANG==='fr'?fr:en;
function goldArc(c,p,q,a){ if(a<=0.003) return; const r=Math.hypot(p.x-c.x,p.y-c.y); ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=10; ctx.lineCap='round'; ctx.beginPath(); angArc(c,r,ang(c,p),ang(c,q),'#ffd84a',10,a); ctx.restore();
  [p,q].forEach(o=>{ ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#ffd84a'; ctx.strokeStyle='#1b1446'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(o.x,o.y,11,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore(); }); }

/* ====================================================================== */
/*  Step 0: a mission for Abbé Picard (field near Paris)                   */
/* ====================================================================== */
function step0(l,g){
  hideAll(); setMood('day'); sunAt(0,0);
  parisG.visible=true; churchC.visible=true; churchC.position.set(-150,0,-260); placeRoadTrees(0);
  mill.visible=true; mill.position.set(-46,0,-26); sails.rotation.z=g*0.6;
  picard.root.visible=true; Q.g.visible=true; aide1.root.visible=true;
  Q.g.position.set(4,0,6); Q.g.rotation.y=0;
  const aim=smooth(seg(l,9.2,11.5)); Q.plate.rotation.y=lerp(0.25,0.95,aim); Q.plate.scale.z=1; Q.alid.rotation.y=lerp(0.35,0.8,smooth(seg(l,12,14)));
  picard.root.position.set(lerp(-3,0.6,smooth(seg(l,0.5,3.5))),0,9.6); picard.root.rotation.y=lerp(0.9,2.6,smooth(seg(l,3.2,4.5)));
  if(l<3.5) walkP(picard,l*5,0.45*(1-smooth(seg(l,3.0,3.5))));
  const look=smooth(seg(l,4.6,5.6)); picard.head.rotation.x=0.35*look; picard.body.rotation.x=0.12*look; picard.shR.rotation.x=-0.9*look; picard.elR.rotation.x=-0.6*look;
  aide1.root.position.set(12,0,3); aide1.root.rotation.y=-1.9; aide1.shL.rotation.x=-0.3;
  const zc=smooth(seg(l,7.8,10.5));
  fldCam.position.set(lerp(18,15,zc),lerp(9,8.6,zc),lerp(34,30,zc)); fldCam.lookAt(lerp(-6,0,zc),lerp(6,5.2,zc),lerp(-40,0,zc));
  renderer.render(fld,fldCam);
  const pp=scr(picard.head,fldCam,V(0,2.0,0)); pill(pp.x,pp.y-40,L(TXT.picard),smooth(seg(l,1.2,1.7))*(1-smooth(seg(l,8.4,8.9))),'rgba(20,16,46,0.85)',34);
  const pa=scrV(V(parisG.position.x,40,parisG.position.z),fldCam); label('Paris',pa.x,pa.y-20,40,{alpha:smooth(seg(l,1.6,2.2))*(1-zc),fill:'#ffffff'});
  if(l<6) label(L(TXT.paris),960,96,44,{alpha:smooth(seg(l,0.3,0.8))*(1-smooth(seg(l,5.3,5.9)))});
  /* the crossed-hairs view */
  const ia=smooth(seg(l,10.2,10.8)); if(ia>0){ const cx=1520, cy=330, r=200;
    ctx.save(); ctx.globalAlpha=ia; ctx.fillStyle='rgba(10,8,30,0.9)'; ctx.beginPath(); ctx.arc(cx,cy,r+16,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip(); const sky=ctx.createLinearGradient(0,cy-r,0,cy+r); sky.addColorStop(0,'#86b4e8'); sky.addColorStop(0.62,'#cfe0f2'); sky.addColorStop(0.63,'#9cbf63'); sky.addColorStop(1,'#88ab55'); ctx.fillStyle=sky; ctx.fillRect(cx-r,cy-r,2*r,2*r);
    const dx=lerp(120,0,smooth(seg(l,11,13.6))); const bx0=cx+dx, by0=cy+40;
    ctx.fillStyle='#ddd0b4'; ctx.fillRect(bx0-26,by0-120,52,190); ctx.fillStyle='#56637e'; ctx.beginPath(); ctx.moveTo(bx0-36,by0-120); ctx.lineTo(bx0,by0-250); ctx.lineTo(bx0+36,by0-120); ctx.fill();
    ctx.fillStyle='#e2d6bc'; ctx.fillRect(bx0+26,by0-40,110,110); ctx.fillStyle='#7a6a5a'; ctx.beginPath(); ctx.moveTo(bx0+20,by0-40); ctx.lineTo(bx0+80,by0-85); ctx.lineTo(bx0+142,by0-40); ctx.fill();
    ctx.strokeStyle='#111'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-r,cy); ctx.lineTo(cx+r,cy); ctx.moveTo(cx,cy-r); ctx.lineTo(cx,cy+r); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha=ia; ctx.strokeStyle='#c79a3c'; ctx.lineWidth=10; ctx.beginPath(); ctx.arc(cx,cy,r+5,0,Math.PI*2); ctx.stroke(); ctx.restore();
    label(L(TXT.lens),cx,cy+r+56,36,{alpha:ia,fill:'#ffe39a'});
    if(l>13.7){ check(cx+r-20,cy-r+30,60,smooth(seg(l,13.7,14.1))); }
  }
  /* zoom on the graduated scale: the pointer of the movable telescope gives the angle */
  const ga=smooth(seg(l,12.2,12.8)); if(ga>0){ const cx=110, cy=470, R1=300, R0=230, deg=Q.alid.rotation.y/D2R;
    panel(40,60,440,470,ga); ctx.save(); ctx.globalAlpha=ga; ctx.fillStyle='#d6a94c'; ctx.beginPath(); ctx.arc(cx,cy,R1,-Math.PI/2,0); ctx.arc(cx,cy,R0,0,-Math.PI/2,true); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#3a2410'; for(let d=0;d<=90;d++){ const a=-d*D2R, r1=d%10===0?R0:d%5===0?R0+30:R0+45; ctx.lineWidth=d%10===0?3:d%5===0?2:1.2; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); ctx.lineTo(cx+Math.cos(a)*R1,cy+Math.sin(a)*R1); ctx.stroke(); }
    ctx.fillStyle='#ffe39a'; ctx.font=`700 24px ${FF}`; ctx.textAlign='center'; ctx.textBaseline='middle'; for(let d=0;d<=90;d+=10){ const a=-d*D2R; ctx.fillText(String(d),cx+Math.cos(a)*(R0-26),cy+Math.sin(a)*(R0-26)); }
    const pa=-deg*D2R; ctx.strokeStyle='#b0301e'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(pa)*(R1+18),cy+Math.sin(pa)*(R1+18)); ctx.stroke(); ctx.fillStyle='#b0301e'; ctx.beginPath(); ctx.arc(cx,cy,9,0,Math.PI*2); ctx.fill(); ctx.restore();
    label(NUM('graduations en degrés','scale in degrees'),260,100,30,{alpha:ga,fill:'#ffe39a'}); label(`${deg.toFixed(1).replace('.',LANG==='fr'?',':'.')}°`,cx+Math.cos(pa)*(R1+40)+30,cy+Math.sin(pa)*(R1+40),34,{alpha:ga,fill:'#ff8a5c',align:'left'}); }
  const qa=smooth(seg(l,9.0,9.6)); if(qa>0){ const qp=scrV(V(Q.g.position.x+1.5,6.2,Q.g.position.z-1.5),fldCam); label(L(TXT.quad),qp.x-180,qp.y-70,36,{alpha:qa,fill:'#ffe39a'}); }
}

/* ====================================================================== */
/*  Step 1: same idea as Eratosthenes (globe)                              */
/* ====================================================================== */
function globeCam(dist,fov,yoff){ gCam.fov=fov||40; gCam.updateProjectionMatrix(); gCam.position.set(0,yoff||0,GR+dist); gCam.lookAt(0,yoff||0,0); }
function step1(l,g){
  const u1=easeInOut(seg(l,4.2,8.4)), u2=easeInOut(seg(l,11.0,14.2));
  let lat=lerp(28,49.1,u1), lon=lerp(31,2.4,u1), dist=lerp(24,5.5,u1);
  if(u2>0){ lat=lerp(49.1,0,u2); lon=lerp(2.4,76.4,u2); dist=lerp(5.5,30,u2); }
  aimG(lat,lon); globeCam(dist,40); gMat.opacity=lerp(1,0.55,u2); gHalo.visible=true;
  eraArc.visible=pinA.visible=pinY.visible=true; picArc.visible=pinM.visible=pinS.visible=l>8.0&&u2<0.5; ring.visible=false;
  const ps=backOut(seg(l,8.0,8.5)); pinM.scale.setScalar(Math.max(0.001,ps*0.45)); pinS.scale.setScalar(Math.max(0.001,backOut(seg(l,8.2,8.7))*0.45));
  picArc.scale.setScalar(1);
  renderer.render(glb,gCam);
  const ea=smooth(seg(l,0.8,1.4))*(1-smooth(seg(l,4.0,4.6))); if(ea>0){ const p=gScr(27.5,31.4); pill(p.x+250,p.y-30,L(TXT.erato),ea,'rgba(200,110,20,0.9)',32); }
  if(l>8.2&&u2<0.3){ const a=smooth(seg(l,8.4,9.0))*(1-smooth(seg(l,10.8,11.4))); const pm=scr(pinM,gCam,V(0,0,0)), pq=scr(pinS,gCam,V(0,0,0));
    pill(pm.x+150,pm.y+30,L(TXT.malv),a,'rgba(150,110,10,0.92)',30); pill(pq.x-140,pq.y-40,L(TXT.sourd),a,'rgba(150,110,10,0.92)',30); }
  if(u2>0.6){ const a=smooth(seg(l,13.6,14.4)); const c=scrV(gSpin.localToWorld(V(0,0,0)),gCam), pm=gScr(42,2.4,GR), pq=gScr(56,2.4,GR); goldArc(c,pm,pq,a);
    const ext=(p,k)=>({x:c.x+(p.x-c.x)*k,y:c.y+(p.y-c.y)*k});
    ctx.save(); ctx.globalAlpha=a; line2(c,ext(pm,1.18),'#ffffff',4,smooth(seg(l,13.8,15.0)),[14,10]); line2(c,ext(pq,1.18),'#ffffff',4,smooth(seg(l,13.8,15.0)),[14,10]); ctx.restore();
    const la=smooth(seg(l,15.0,15.6)); angArc(c,90,ang(c,pm),ang(c,pq),'#ffd84a',7,la); label(L(TXT.angle),c.x+40,c.y-130,40,{alpha:la,fill:'#ffd84a',align:'left'});
    label(L(TXT.dist),(pm.x+pq.x)/2-210,(pm.y+pq.y)/2+10,40,{alpha:smooth(seg(l,15.6,16.2)),fill:'#ffe39a',align:'right'});
    label(L(TXT.center),c.x,c.y+52,30,{alpha:la*0.9,weight:600,fill:'#c9c4e8'});
    label(L(TXT.malv),pm.x-24,pm.y+40,30,{alpha:a,fill:'#ffffff',align:'right'}); label(L(TXT.sourd),pq.x-20,pq.y-36,30,{alpha:a,fill:'#ffffff',align:'right'});
    label(L(TXT.notScale),1660,70,26,{alpha:la*0.85,weight:500,fill:'#c9c4e8'}); }
  if(l>9.6&&u2<0.2){ const a=smooth(seg(l,9.8,10.3))*(1-smooth(seg(l,10.9,11.3))); const pm=scr(pinM,gCam), pq=scr(pinS,gCam); label(L(TXT.km150),(pm.x+pq.x)/2+170,(pm.y+pq.y)/2,40,{alpha:a,fill:'#ffd84a'}); }
}

/* ====================================================================== */
/*  Step 2: the baseline, measured with wooden rods                        */
/* ====================================================================== */
const ROD=32;
function rodState(c){ /* c = continuous cycle counter -> rod positions + carriers */
  const k=Math.floor(c), f=c-k; const moving=k%2, still=1-moving;
  const x0=k*ROD; /* moving rod starts at [x0,x0+ROD], goes to [x0+2ROD, x0+3ROD]; still rod lies at [x0+ROD, x0+2ROD] */
  const carry=smooth(seg(f,0.08,0.62)), lift=Math.min(smooth(seg(f,0.0,0.1)),1-smooth(seg(f,0.6,0.68)));
  const mx=x0+carry*2*ROD, my=0.25+lift*3.1;
  const back=smooth(seg(f,0.7,1.0));
  const rear=f<0.68?mx:lerp(x0+2*ROD,x0+ROD,back), front=f<0.68?mx+ROD:lerp(x0+3*ROD,x0+2*ROD,back);
  return {moving,still,mx,my,sx:x0+ROD,rear,front,walking:(f>0.1&&f<0.62)||(f>0.7&&f<0.98),dir:f<0.68?1:-1,f};
}
function cycOf(l){ /* slow at first, then fast-forward */ const base=Math.min(l,9.5)/3.2; const ff=l>9.5?(l-9.5)*0.42+Math.pow(Math.max(0,l-11),2)*0.03:0; return base+ff; }
const C_END=cycOf(18.2);
function step2(l,g){
  hideAll(); setMood('day');
  const c=Math.min(cycOf(l),C_END); const st=rodState(c);
  rods.forEach((r,i)=>{ r.visible=true; if(i===st.moving){ r.position.set(st.mx,st.my,0.6); } else { r.position.set(st.sx,0.25,0.6); } });
  aide1.root.visible=aide2.root.visible=true;
  const ph=c*Math.PI*4.2;
  aide1.root.position.set(st.rear-0.6,0,2.0); aide2.root.position.set(st.front+0.6,0,2.0);
  [aide1,aide2].forEach((P,i)=>{ P.root.rotation.y=st.dir>0?Math.PI/2:-Math.PI/2; if(st.walking) walkP(P,ph+i*Math.PI,0.5); if(st.f<0.68){ P.shL.rotation.x=P.shR.rotation.x=-0.25; P.shL.rotation.z=-0.2; P.shR.rotation.z=0.2; P.elL.rotation.x=P.elR.rotation.x=-0.5; } });
  if(st.f<0.68){ aide1.root.rotation.y=Math.PI/2; aide2.root.rotation.y=Math.PI/2; }
  const cx=(st.rear+st.front)/2+ROD*0.25;
  placeRoadTrees(cx,true); sunAt(cx,0);
  mill.visible=true; mill.position.set(4,0,-24); sails.rotation.z=g*0.6;
  const xEnd=rodState(C_END).front+ROD; pav.visible=l>15; pav.position.set(xEnd+30,0,-20); pav.rotation.y=-0.3;
  picard.root.visible=l<9.5; picard.root.position.set(-12,0,9); picard.root.rotation.y=0.6; picard.shR.rotation.x=-0.5;
  const fin=smooth(seg(l,17.6,20));
  const tx=lerp(cx+6,pav.position.x-24,fin); fldCam.position.set(tx-14,lerp(15,44,fin),lerp(60,80,fin)); fldCam.lookAt(tx,lerp(2.5,0,fin),lerp(-4,-14,fin));
  renderer.render(fld,fldCam);
  /* labels + counter */
  const pv=scrV(V(4,15,-24),fldCam); label(L(TXT.vil),pv.x,pv.y-10,34,{alpha:smooth(seg(l,0.8,1.3))*(1-smooth(seg(l,5.5,6.0))),fill:'#ffffff'});
  if(pav.visible){ const pj=scrV(V(pav.position.x,13,pav.position.z),fldCam); label(L(TXT.juv),pj.x,pj.y-20,36,{alpha:smooth(seg(l,17.8,18.4)),fill:'#ffffff'}); }
  const fast=l>9.5; const toises=Math.min(5663,Math.round(8+4*Math.floor(c)+(fast?(5663-8-4*Math.floor(c))*smooth(seg(l,9.5,18.2)):0)));
  counterBox(1590,170,'Toises mesurées','Toises measured',NUM(fmt(toises),fmtEn(toises)),smooth(seg(l,0.6,1.0)));
  label(L(TXT.toise),1590,290,30,{alpha:smooth(seg(l,0.8,1.2)),weight:600,fill:'#ffe39a'});
  if(fast&&l<18){ const a=smooth(seg(l,9.6,10.0))*(1-smooth(seg(l,17.4,18))); ctx.save(); ctx.globalAlpha=a*0.9; ctx.fillStyle='#ffd84a'; for(let k=0;k<2;k++){ ctx.beginPath(); ctx.moveTo(110+k*46,96); ctx.lineTo(150+k*46,124); ctx.lineTo(110+k*46,152); ctx.fill(); } ctx.restore(); }
  const ea=smooth(seg(l,18.6,19.2)); if(ea>0){ label(NUM('5 663 toises ≈ 11 km','5,663 toises ≈ 11 km'),900,190,72,{alpha:ea,fill:'#ffd84a',scale:backOut(seg(l,18.6,19.1))}); }
}

/* ====================================================================== */
/*  Step 3: triangulation                                                  */
/* ====================================================================== */
const TA=V(-48,0,0), TB=V(48,0,0), TC=V(8.3,0,-115.4);   /* angles: A = 64°, B = 71°, C = 45° */
function step3(l,g){
  hideAll(); setMood('day'); sunAt(0,-40);
  placeRoadTrees(0,true); mill.visible=true; mill.position.set(TA.x-9,0,TA.z-8); sails.rotation.z=g*0.6; pav.visible=true; pav.position.set(TB.x+9,0,TB.z-9); pav.rotation.y=0;
  churchC.visible=true; churchC.position.copy(TC); churchC.rotation.y=0.3;
  Q.g.visible=true; Q.g.position.set(TA.x,0,TA.z+4); Q2.g.visible=true; Q2.g.position.set(TB.x,0,TB.z+4);
  const psiA=Math.atan2(-(TC.z-TA.z),TC.x-TA.x), psiB=Math.atan2(-(TC.z-TB.z),TC.x-TB.x);
  /* fixed telescope along the base, movable one on the tower; at B the quadrant is turned over so the angle stays inside it */
  Q.plate.rotation.y=0; Q.plate.scale.z=1; Q.alid.rotation.y=lerp(0.3,psiA,smooth(seg(l,2.0,4.4)));
  Q2.plate.rotation.y=Math.PI; Q2.plate.scale.z=-1; Q2.alid.rotation.y=lerp(0.3,Math.PI-psiB,smooth(seg(l,5.4,7.6)));
  picard.root.visible=true; picard.root.position.set(TA.x-1.2,0,TA.z+8.4); picard.root.rotation.y=Math.PI*0.85; picard.head.rotation.x=0.3; picard.shR.rotation.x=-0.8;
  aide1.root.visible=true; aide1.root.position.set(TB.x+1.4,0,TB.z+8.4); aide1.root.rotation.y=-Math.PI*0.85; aide1.head.rotation.x=0.3; aide1.shL.rotation.x=-0.8;
  const up=smooth(seg(l,0.4,2.2)), far=smooth(seg(l,10.8,13.5));
  fldCam.position.set(lerp(0,22,far),lerp(26,150,up)+far*30,lerp(70,150,up)+far*20); fldCam.lookAt(lerp(0,-46,far),0,lerp(-10,-44,up)-far*6);
  renderer.render(fld,fldCam);
  const a=scrV(V(TA.x,0.5,TA.z),fldCam), b=scrV(V(TB.x,0.5,TB.z),fldCam), c=scrV(V(TC.x,1,TC.z),fldCam);
  const ba=smooth(seg(l,1.0,1.6)); ctx.save(); ctx.globalAlpha=ba; line2(a,b,'#ffd84a',10); ctx.restore();
  label(NUM('AB = 5 663 toises (mesuré)','AB = 5,663 toises (measured)'),(a.x+b.x)/2,(a.y+b.y)/2+56,34,{alpha:ba,fill:'#ffd84a'});
  label('A',a.x-40,a.y+10,44,{alpha:ba,fill:'#ffffff'}); label('B',b.x+40,b.y+10,44,{alpha:ba,fill:'#ffffff'});
  const s1=smooth(seg(l,3.0,4.6)), s2=smooth(seg(l,6.2,7.8));
  if(s1>0) line2(a,c,'#ffffff',5,s1,[16,12]); if(s2>0) line2(b,c,'#ffffff',5,s2,[16,12]);
  const aa=smooth(seg(l,4.4,5.0)), ab=smooth(seg(l,7.6,8.2));
  angArc(a,70,ang(a,b),ang(a,c),'#7dd3ff',7,aa); label('A = 64°',a.x+78,a.y-62,34,{alpha:aa,fill:'#7dd3ff',align:'left'});
  angArc(b,70,ang(b,a),ang(b,c),'#7dd3ff',7,ab); label('B = 71°',b.x-78,b.y-62,34,{alpha:ab,fill:'#7dd3ff',align:'right'});
  label(L(TXT.clocher)+' C',c.x,c.y-74,36,{alpha:smooth(seg(l,4.0,4.6)),fill:'#ffffff'});
  const cA=smooth(seg(l,19.6,20.2)); angArc(c,60,ang(c,a),ang(c,b),'#ff8a5c',7,cA); label('C = 45°',c.x+70,c.y+8,34,{alpha:cA,fill:'#ff8a5c',align:'left'});
  const ta=smooth(seg(l,11.4,12.2)); if(ta>0){ ctx.save(); ctx.globalAlpha=ta*0.28; ctx.fillStyle='#ffd84a'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=ta; line2(a,c,'#3ddc6a',7); line2(b,c,'#3ddc6a',7); ctx.restore();
    const ma={x:(a.x+c.x)/2,y:(a.y+c.y)/2}, mb={x:(b.x+c.x)/2,y:(b.y+c.y)/2};
    label(l<23.2?'AC '+L(TXT.calc):NUM('AC ≈ 7 570 toises','AC ≈ 7,570 toises'),ma.x-24,ma.y,34,{alpha:smooth(seg(l,12.4,12.9)),fill:'#3ddc6a',align:'right'});
    label(l<26.2?'BC '+L(TXT.calc):NUM('BC ≈ 7 200 toises','BC ≈ 7,200 toises'),mb.x+24,mb.y,34,{alpha:smooth(seg(l,12.9,13.4)),fill:'#3ddc6a',align:'left'}); }
  const ra=smooth(seg(l,14.0,14.6))*(1-smooth(seg(l,18.2,18.8))); if(ra>0){ panel(1350,60,520,240,ra); txt(NUM('1 côté','1 side'),1610,112,40,{alpha:ra,fill:'#ffd84a',shadow:false}); txt('+ 2 angles',1610,170,40,{alpha:ra,fill:'#7dd3ff',shadow:false}); txt(NUM('= tout le triangle !','= the whole triangle!'),1610,236,40,{alpha:ra*smooth(seg(l,14.6,15.2)),fill:'#3ddc6a',shadow:false}); }
  /* the calculation (law of sines) */
  const ka=smooth(seg(l,18.8,19.4)); if(ka>0){ panel(30,30,840,400,ka);
    const row=(t0,s,y,col,size,w)=>txt(s,60,y,size||34,{alpha:ka*smooth(seg(l,t0,t0+0.5)),fill:col||'#ffffff',align:'left',weight:w||600,shadow:false,maxW:780});
    row(19.5,'C = 180° − 64° − 71° = 45°',80,'#ff8a5c',36,700);
    row(21.4,'AC = AB × sin B ÷ sin C',150,'#3ddc6a',34,700);
    row(22.4,NUM('     = 5 663 × sin 71° ÷ sin 45° ≈ 7 570 toises','     = 5,663 × sin 71° ÷ sin 45° ≈ 7,570 toises'),198,'#ffffff',32);
    row(24.4,'BC = AB × sin A ÷ sin C',268,'#3ddc6a',34,700);
    row(25.4,NUM('     = 5 663 × sin 64° ÷ sin 45° ≈ 7 200 toises','     = 5,663 × sin 64° ÷ sin 45° ≈ 7,200 toises'),316,'#ffffff',32);
    row(27.2,NUM('(loi des sinus · exemple avec des angles arrondis)','(law of sines · example with rounded angles)'),386,'#c9c4e8',26,500); }
  label(L(TXT.notScale),960,40,26,{alpha:ba*0.85,weight:500,fill:'#ffffff'});
}

/* ====================================================================== */
/*  Step 4: 13 triangles from Malvoisine to Sourdon (map)                  */
/* ====================================================================== */
const MX0=lon=>960+(lon-2.4)*340, MY0=lat=>450-(lat-49.15)*517;
let VZ=1, VCX=960, VCY=455;
const mp=(lat,lon)=>({x:(MX0(lon)-VCX)*VZ+960,y:(MY0(lat)-VCY)*VZ+455});
function setView(z,cx,cy){ VZ=z; VCX=cx; VCY=cy; }
function mapClip(){ ctx.beginPath(); rrect(330,40,1260,830,30); ctx.clip(); }
const NET=(function(){ const lons=[2.45,2.20,2.40,2.345,2.62,2.20,2.60,2.22,2.58,2.20,2.60,2.22,2.58,2.24,2.37]; const out=[]; for(let i=0;i<15;i++){ let lat=lerp(48.51,49.71,i/14); if(i===2) lat=48.69; if(i===3) lat=48.79; out.push([lat,lons[i]]); } return out; })();
const RIVERS=[ [[48.40,3.05],[48.54,2.66],[48.62,2.48],[48.72,2.44],[48.82,2.40],[48.856,2.35],[48.86,2.27],[48.90,2.22],[48.94,2.12],[48.99,2.05],[49.02,1.85],[49.08,1.62],[49.15,1.40],[49.2,1.0],[49.3,0.6]],
  [[48.99,2.07],[49.07,2.17],[49.17,2.32],[49.26,2.47],[49.33,2.62],[49.42,2.83],[49.52,2.98],[49.63,3.2],[49.75,3.4]],
  [[48.82,2.41],[48.86,2.55],[48.92,2.72],[48.96,2.88],[48.95,3.10],[49.0,3.4],[49.05,3.8]],
  [[49.98,1.10],[49.95,1.50],[49.92,1.85],[49.90,2.10],[49.894,2.30],[49.88,2.55],[49.90,2.75],[49.93,2.93],[49.88,3.10],[49.85,3.30]] ];
const FORESTS=[[48.42,2.62,0.06],[48.62,2.72,0.05],[49.10,2.42,0.05],[49.20,2.62,0.07],[49.38,2.85,0.06],[49.56,2.10,0.05],[49.30,1.95,0.05],[48.95,1.85,0.05]];
function mapBase(a){
  ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#ecdcb4'; rrect(330,40,1260,830,30); ctx.fill(); mapClip();
  const vg=ctx.createRadialGradient(960,455,200,960,455,820); vg.addColorStop(0,'rgba(255,248,225,0.5)'); vg.addColorStop(1,'rgba(150,110,60,0.35)'); ctx.fillStyle=vg; ctx.fillRect(330,40,1260,830);
  const fz=Math.pow(VZ,0.8);
  FORESTS.forEach(([la,lo,r],i)=>{ ctx.fillStyle='rgba(110,140,80,0.4)'; for(let k=0;k<7;k++){ const p=mp(la+Math.sin(k*2.1+i)*r*0.6,lo+Math.cos(k*1.7+i)*r); ctx.beginPath(); ctx.arc(p.x,p.y,(16+((k*7+i*3)%9)*3)*fz,0,Math.PI*2); ctx.fill(); } });
  ctx.strokeStyle='#5f9bd6'; ctx.lineCap='round'; ctx.lineJoin='round'; RIVERS.forEach((rv,i)=>{ ctx.lineWidth=(i===0?9:6)*Math.min(1.7,Math.sqrt(VZ)); ctx.beginPath(); rv.forEach(([la,lo],k)=>{ const p=mp(la,lo); k?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y); }); ctx.stroke(); });
  ctx.fillStyle='rgba(120,90,50,0.35)'; ctx.font=`600 34px ${FF}`; ctx.textAlign='center'; const q1=mp(48.70,1.75), q2=mp(49.55,1.45); ctx.fillText('Île-de-France',q1.x,q1.y); ctx.fillText('Picardie',q2.x,q2.y);
  ctx.restore(); ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle='#8a6a3a'; ctx.lineWidth=6; rrect(330,40,1260,830,30); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#6b4a2a'; ctx.beginPath(); ctx.moveTo(1520,110); ctx.lineTo(1500,170); ctx.lineTo(1520,158); ctx.lineTo(1540,170); ctx.closePath(); ctx.fill(); ctx.restore(); txt('N',1520,88,30,{alpha:a,fill:'#6b4a2a',shadow:false});
  const km=VZ>1.6?20:50, k50=km*4.65*VZ; ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle='#6b4a2a'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(1180,830); ctx.lineTo(1180+k50,830); ctx.moveTo(1180,818); ctx.lineTo(1180,842); ctx.moveTo(1180+k50,818); ctx.lineTo(1180+k50,842); ctx.stroke(); ctx.restore(); txt(km+' km',1180+k50/2,806,26,{alpha:a,fill:'#6b4a2a',shadow:false});
}
function town(lat,lon,name,a,big,side){ const p=mp(lat,lon); if(p.x<340||p.x>1580||p.y<50||p.y>860) return; ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#4a3a2a'; ctx.beginPath(); ctx.arc(p.x,p.y,big?11:8,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff6dc'; ctx.beginPath(); ctx.arc(p.x,p.y,big?5:3.5,0,Math.PI*2); ctx.fill(); ctx.restore();
  txt(name,p.x+(side||1)*(big?22:18),p.y,big?34:28,{alpha:a,align:(side||1)>0?'left':'right',fill:'#3a2a1a',weight:700,shadow:false,stroke:'#fff3d6',sw:0.22}); }
function mapBg(){ const bgr=ctx.createLinearGradient(0,0,0,LH); bgr.addColorStop(0,'#0b1238'); bgr.addColorStop(1,'#1d2460'); ctx.fillStyle=bgr; ctx.fillRect(0,0,LW,LH); }
function tower(p,a,big){ ctx.save(); ctx.globalAlpha=a; ctx.fillStyle='#8a3a1a'; const s=big?1.5:1; ctx.beginPath(); ctx.moveTo(p.x,p.y-14*s); ctx.lineTo(p.x-8*s,p.y+6*s); ctx.lineTo(p.x+8*s,p.y+6*s); ctx.fill(); ctx.restore(); }
function tri(P,i,fill,fa,stroke,sa,w){ const A=P[i],B=P[i+1],C=P[i+2]; ctx.save(); if(fa>0){ ctx.globalAlpha=fa; ctx.fillStyle=fill; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.closePath(); ctx.fill(); }
  if(sa>0){ ctx.globalAlpha=sa; ctx.strokeStyle=stroke; ctx.lineWidth=w||3.5; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.closePath(); ctx.stroke(); } ctx.restore(); }
/* order of construction: south from the base to Malvoisine, then north to Sourdon */
const TRI_ORDER=[1,0,2,3,4,5,6,7,8,9,10,11,12], SLOWN=4;
const triKnown=k=>{ const i=TRI_ORDER[k]; return (i===1||i===2)?[2,3]:i===0?[1,2]:[i,i+1]; };
const triNew=k=>{ const i=TRI_ORDER[k], kn=triKnown(k); return [i,i+1,i+2].filter(j=>!kn.includes(j))[0]; };
const T4S=2.4, T4SLOW=3.2, T4FAST=1.25;
const triT0=k=>T4S+(k<SLOWN?k*T4SLOW:SLOWN*T4SLOW+(k-SLOWN)*T4FAST), triD=k=>k<SLOWN?T4SLOW:T4FAST;
const T4END=triT0(12)+T4FAST;
const cen0=k=>{ const i=TRI_ORDER[k]; let x=0,y=0; for(const j of [i,i+1,i+2]){ x+=MX0(NET[j][1]); y+=MY0(NET[j][0]); } return {x:x/3,y:y/3}; };
const mid=(p,q)=>({x:(p.x+q.x)/2,y:(p.y+q.y)/2});
function sideLabel(p,q,s,a,col,side){ const m=mid(p,q), dx=q.x-p.x, dy=q.y-p.y, n=Math.hypot(dx,dy)||1; const ox=-dy/n*side*46, oy=dx/n*side*46; pill(m.x+ox,m.y+oy,s,a,col,26); }
function step4(l,g){
  renderer.render(glb,gCam); mapBg();
  let kc=-1; for(let k=0;k<13;k++) if(l>=triT0(k)) kc=k;
  const zin=smooth(seg(l,0.9,2.3)), zout=smooth(seg(l,T4END+0.4,T4END+2.4));
  const base0={x:(MX0(NET[2][1])+MX0(NET[3][1]))/2,y:(MY0(NET[2][0])+MY0(NET[3][0]))/2};
  let tg=base0; if(kc>=0){ const pv=kc>0?cen0(kc-1):base0, cu=cen0(kc); const f=smooth(seg(l,triT0(kc),triT0(kc)+Math.min(1.1,triD(kc)*0.6))); tg={x:lerp(pv.x,cu.x,f),y:lerp(pv.y,cu.y,f)}; }
  const zt=lerp(2.8,1.9,smooth(seg(l,triT0(SLOWN),triT0(SLOWN)+1.6)));
  const z=lerp(lerp(1,zt,zin),1,zout), w=zin*(1-zout); setView(z,lerp(960,tg.x,w),lerp(455,tg.y,w));
  const a=smooth(seg(l,0.2,0.9)); mapBase(a);
  const P=NET.map(([la,lo])=>mp(la,lo));
  ctx.save(); mapClip();
  for(let k=0;k<=kc;k++){ const u=clamp((l-triT0(k))/triD(k),0,1); const i=TRI_ORDER[k];
    tri(P,i,k%2?'#e0a040':'#d07a30',a*(k<kc?0.2:0.26*smooth(seg(u,0.45,0.7))),'#8a3a1a',a*(k<kc?1:smooth(seg(u,0.75,0.95))),3.5); }
  if(kc>=0){ const k=kc, u=clamp((l-triT0(k))/triD(k),0,1), kn=triKnown(k), nv=triNew(k), K0=P[kn[0]], K1=P[kn[1]], N=P[nv];
    const s=smooth(seg(u,0.05,0.4)); line2(K0,N,'#ffffff',4,s,[12,9]); line2(K1,N,'#ffffff',4,s,[12,9]);
    const aa=smooth(seg(u,0.28,0.42))*(1-smooth(seg(u,0.8,0.98))); angArc(K0,30+6*VZ,ang(K0,K1),ang(K0,N),'#7dd3ff',5,aa); angArc(K1,30+6*VZ,ang(K1,K0),ang(K1,N),'#7dd3ff',5,aa);
    const gA=smooth(seg(u,0.42,0.6))*(k===12?1-smooth(seg(l,T4END+0.2,T4END+1.2)):1); ctx.save(); ctx.globalAlpha=gA; line2(K0,N,'#3ddc6a',8); line2(K1,N,'#3ddc6a',8); ctx.restore(); }
  /* the side currently used as a base (gold) - just before the next triangle starts, it moves to the next base */
  let gs=[2,3]; if(kc>=0){ const u=clamp((l-triT0(kc))/triD(kc),0,1); gs=(u>0.8&&kc<12)?triKnown(kc+1):triKnown(kc); }
  const ga=(1-smooth(seg(l,T4END+0.2,T4END+1.2)))*smooth(seg(l,1.0,1.6)); ctx.save(); ctx.globalAlpha=ga; line2(P[gs[0]],P[gs[1]],'#ffd84a',11); ctx.restore();
  ctx.restore();
  const vis=new Array(15).fill(0); vis[2]=vis[3]=smooth(seg(l,1.0,1.6)); for(let k=0;k<=kc;k++){ const u=clamp((l-triT0(k))/triD(k),0,1); vis[triNew(k)]=Math.max(vis[triNew(k)],smooth(seg(u,0,0.15))); for(const j of triKnown(k)) vis[j]=Math.max(vis[j],1); }
  ctx.save(); mapClip(); P.forEach((p,i)=>{ if(vis[i]>0) tower(p,a*vis[i],VZ>1.5); }); ctx.restore();
  town(48.856,2.35,'Paris',a,true,1); town(49.894,2.30,'Amiens',a,true,1); town(NET[0][0],NET[0][1],L(TXT.malv),a*vis[0],false,1); town(NET[14][0],NET[14][1],L(TXT.sourd),a*vis[14],false,1);
  /* explanations on the first triangles */
  if(kc<0&&l>1.2) sideLabel(P[2],P[3],L(TXT.base),smooth(seg(l,1.2,1.7)),'rgba(160,120,10,0.95)',1);
  if(kc>=0&&kc<SLOWN){ const k=kc, u=clamp((l-triT0(k))/triD(k),0,1), kn=triKnown(k), nv=triNew(k);
    const la=smooth(seg(u,0.0,0.12))*(1-smooth(seg(u,0.72,0.8)));
    sideLabel(P[kn[0]],P[kn[1]],NUM('côté connu','known side'),la,'rgba(160,120,10,0.95)',nv===TRI_ORDER[k]?-1:1);
    const ca=smooth(seg(u,0.5,0.6))*(1-smooth(seg(u,0.8,0.88)));
    for(const j of kn){ const sd=Math.sign((P[j].x-P[nv].x)||1); sideLabel(P[j],P[nv],L(TXT.calc),ca,'rgba(20,120,50,0.95)',(P[nv].y<P[j].y?1:-1)*sd); }
    if(u>0.8&&k<12){ const nk=triKnown(k+1); const isNew=nk.includes(nv); sideLabel(P[nk[0]],P[nk[1]],isNew?NUM('→ base du triangle suivant','→ base of the next triangle'):NUM('on repart de la base vers le nord','back to the baseline, heading north'),smooth(seg(u,0.8,0.9)),'rgba(160,120,10,0.95)',1); } }
  const n=Math.max(0,Math.min(13,kc+1)), pa=a*smooth(seg(l,2.0,2.4)); panel(40,330,260,150,pa); txt(L(TXT.tri),170,370,30,{alpha:pa,weight:600,shadow:false}); txt(`${n} / 13`,170,430,54,{alpha:pa,fill:'#ffd84a',shadow:false});
  label(L(TXT.simple),1760,60,26,{alpha:a*0.85,weight:500,fill:'#c9c4e8'});
}
/* ---------------------------------------------------------------- the south-to-north distance */
function step4b(l,g){
  renderer.render(glb,gCam); mapBg();
  const z=1.08; setView(z,960,(MY0(48.51)+MY0(49.71))/2+10);
  const a=smooth(seg(l,0.0,0.4)); mapBase(a);
  const P=NET.map(([la,lo])=>mp(la,lo));
  ctx.save(); mapClip(); for(let k=0;k<13;k++) tri(P,TRI_ORDER[k],k%2?'#e0a040':'#d07a30',a*0.14,'#8a3a1a',a*0.55,3);
  /* north-south line through Malvoisine */
  const pM=P[0], pS=P[14]; const xr=pM.x, na=smooth(seg(l,1.0,2.0));
  ctx.save(); ctx.globalAlpha=na; line2({x:xr,y:pM.y+20},{x:xr,y:mp(49.95,2.4).y},'#d62828',5,smooth(seg(l,1.0,2.6)),[16,10]); ctx.restore();
  /* the base and its measured direction relative to north */
  const B0=P[2], B1=P[3]; const ba=smooth(seg(l,5.6,6.2)); ctx.save(); ctx.globalAlpha=ba; line2(B0,B1,'#ffd84a',10); line2(B0,{x:B0.x,y:B0.y-150},'#d62828',4,smooth(seg(l,6.0,6.8)),[10,8]); ctx.restore();
  angArc(B0,70,-Math.PI/2,ang(B0,B1),'#ffd84a',6,smooth(seg(l,6.8,7.4)));
  /* path along the triangle sides, projected on the north-south line */
  const xl=MX0(2.06)*1, rx=(MX0(2.06)-VCX)*VZ+960;
  for(let i=0;i<14;i++){ const t0=12.0+i*0.6, f=smooth(seg(l,t0,t0+0.45)); if(f<=0) continue; const p=P[i], q=P[i+1];
    const hot=l<t0+0.9; ctx.save(); ctx.globalAlpha=hot?1:0.85; line2(p,q,hot?'#ff9f43':'#c0602a',hot?8:5,f); ctx.restore();
    if(hot){ ctx.save(); ctx.globalAlpha=f; line2(p,{x:p.x,y:q.y},'#ffffff',3,1,[8,6]); line2({x:p.x,y:q.y},q,'#ffffff',3,1,[8,6]); ctx.restore(); }
    ctx.save(); ctx.globalAlpha=f; ctx.fillStyle=i%2?'#ffb703':'#fb8500'; ctx.fillRect(rx-12,q.y,24,(p.y-q.y)*f); ctx.restore(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha=smooth(seg(l,11.6,12.0)); ctx.strokeStyle='#3a2a1a'; ctx.lineWidth=3; ctx.strokeRect(rx-12,pS.y,24,pM.y-pS.y); ctx.restore();
  town(48.856,2.35,'Paris',a,true,1); town(49.894,2.30,'Amiens',a,true,1); town(NET[0][0],NET[0][1],L(TXT.malv),a,false,1); town(NET[14][0],NET[14][1],L(TXT.sourd),a,false,1);
  label(NUM('nord ↑','north ↑'),xr-18,mp(49.78,2.4).y,30,{alpha:na,fill:'#d62828',align:'right'});
  /* Pole Star */
  const ps=smooth(seg(l,5.2,5.9)); if(ps>0){ const sx=1440, sy=200; ctx.save(); ctx.globalAlpha=ps; ctx.fillStyle='#14102e'; ctx.beginPath(); ctx.arc(sx,sy,58,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#ffe9a0'; ctx.beginPath(); for(let k=0;k<10;k++){ const r=k%2?10:26, an=k*Math.PI/5-Math.PI/2; ctx.lineTo(sx+Math.cos(an)*r,sy+Math.sin(an)*r); } ctx.fill(); ctx.restore();
    label(NUM('étoile Polaire','Pole Star'),sx,sy+86,30,{alpha:ps,fill:'#ffe39a'}); label(NUM('angle avec le nord (mesuré)','angle with north (measured)'),B0.x+90,B0.y-110,28,{alpha:smooth(seg(l,7.0,7.6)),fill:'#ffd84a',align:'left'}); }
  /* sum */
  let frac=0; for(let i=0;i<14;i++){ const t0=12.0+i*0.6; frac+=smooth(seg(l,t0,t0+0.45))*(P[i].y-P[i+1].y); } frac/=(pM.y-pS.y);
  const ca=smooth(seg(l,11.8,12.3)); panel(30,300,290,170,ca); txt(NUM('du sud au nord','south to north'),175,340,26,{alpha:ca,weight:600,shadow:false}); txt(NUM(fmt(Math.round(78850*frac)),fmtEn(Math.round(78850*frac))),175,398,50,{alpha:ca,fill:'#ffd84a',shadow:false}); txt('toises',175,444,26,{alpha:ca,weight:500,fill:'#ffe39a',shadow:false});
  const ta=smooth(seg(l,21.0,21.6)); if(ta>0){ label(NUM('78 850 toises ≈ 154 km','78,850 toises ≈ 154 km'),rx-30,(pM.y+pS.y)/2,42,{alpha:ta,fill:'#ffd84a',align:'right',scale:backOut(seg(l,21.0,21.5))}); }
  const va=smooth(seg(l,23.6,24.2)); if(va>0){ panel(30,520,290,120,va); check(70,580,44,va); txt(NUM('2e base :','2nd baseline:'),190,560,28,{alpha:va,weight:600,shadow:false}); txt(NUM('vérifié !','checked!'),190,600,32,{alpha:va,fill:'#7dff8a',shadow:false}); }
  label(L(TXT.simple),1760,60,26,{alpha:a*0.85,weight:500,fill:'#c9c4e8'});
}

/* ====================================================================== */
/*  Step 5: the angle from the stars                                       */
/* ====================================================================== */
function step5(l,g){
  const part2=l>=10.6;
  if(!part2){
    hideAll(); setMood('night'); sunAt(0,0); road.visible=false;
    const site=l<5.6?0:1; const tilt=site===0?0.32:0.17; /* exaggerated zenith distances */
    sector.visible=true; sector.position.set(0,0,0); secTube.rotation.z=tilt;
    const ex=Math.sin(tilt)*14.5*SS, ey=(20.6-Math.cos(tilt)*14.5)*SS;
    picard.root.visible=true; picard.root.position.set(ex+1.5,Math.max(0,ey-6.95),0.5); picard.root.rotation.y=-Math.PI/2; picard.head.rotation.x=-0.75; picard.shR.rotation.x=-2.0; picard.elR.rotation.x=-0.7;
    churchFar.forEach(c=>c.visible=true);
    cassG.position.set(-Math.sin(tilt)*24,20.6*SS+Math.cos(tilt)*24,-2); lantern.visible=true; lantern.position.set(ex+4.2,0,3.2);
    fldCam.fov=54; fldCam.updateProjectionMatrix(); fldCam.position.set(20,9,38); fldCam.lookAt(-2,15.5,0);
    renderer.render(fld,fldCam);
    const piv=scrV(V(0,20.6*SS,0),fldCam), eye=scrV(V(ex,ey,0),fldCam), star=scrV(cassStars[2].getWorldPosition(V(0,0,0)),fldCam), bob=scrV(V(0,6*SS,0.35*SS),fldCam);
    const sw=smooth(seg(l%5.6,0.6,1.2));
    const top={x:piv.x,y:Math.max(30,piv.y-470)};
    ctx.save(); ctx.globalAlpha=sw; line2(bob,top,'#7dd3ff',5,1,[14,10]); line2(eye,star,'#ffd84a',5,1,[14,10]); ctx.restore();
    const vc=site===0?'#ff9f43':'#4dd2ff', va2=smooth(seg(l%5.6,1.2,1.8)); angArc(piv,150,ang(piv,top),ang(piv,{x:piv.x+(piv.x-eye.x),y:piv.y+(piv.y-eye.y)}),vc,8,va2);
    label(site===0?NUM('visée 1','sighting 1'):NUM('visée 2','sighting 2'),piv.x-40,piv.y-190,36,{alpha:va2,fill:vc,align:'right'});
    label(L(TXT.vert),top.x+24,top.y+40,30,{alpha:sw,fill:'#7dd3ff',align:'left'});
    label(L(TXT.star),star.x-60,star.y+10,34,{alpha:sw,fill:'#ffe39a',align:'right'});
    pill(300,150,site===0?L(TXT.malv):L(TXT.sourd),smooth(seg(l%5.6,0.2,0.6))*(1-smooth(seg(l,5.2,5.6))*(site===0?1:0))*(1-smooth(seg(l,10.2,10.6))),'rgba(150,110,10,0.92)',40);
    label(L(TXT.exag),1660,70,26,{alpha:sw*0.85,weight:500,fill:'#c9c4e8'});
    veil(site===1?1-smooth(seg(l,5.6,6.0)):smooth(seg(l,5.2,5.6)),'#03051a'); veil(smooth(seg(l,10.2,10.6)),'#03051a');
    return;
  }
  /* part 2: the geometric proof on a cross-section of the Earth */
  renderer.render(glb,gCam);
  const l2=l-10.6; const bg=ctx.createLinearGradient(0,0,0,LH); bg.addColorStop(0,'#05081f'); bg.addColorStop(1,'#141c4a'); ctx.fillStyle=bg; ctx.fillRect(0,0,LW,LH);
  for(let i=0;i<120;i++){ ctx.fillStyle='rgba(255,255,255,'+(0.3+0.5*hash(i))+')'; ctx.fillRect(hash(i*3.1)*LW,hash(i*7.7)*LH*0.8,2,2); }
  const C={x:720,y:770}, Rr=320, aM=-62*D2R, aS=-80*D2R, sDir=-118*D2R;
  ctx.save(); const eg=ctx.createRadialGradient(C.x-80,C.y-90,40,C.x,C.y,Rr); eg.addColorStop(0,'#3d8be0'); eg.addColorStop(1,'#1d4f9a'); ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(C.x,C.y,Rr,0,Math.PI*2); ctx.fill(); ctx.restore();
  const M={x:C.x+Rr*Math.cos(aM),y:C.y+Rr*Math.sin(aM)}, Sd={x:C.x+Rr*Math.cos(aS),y:C.y+Rr*Math.sin(aS)};
  const ext=(p,a,k)=>({x:p.x+Math.cos(a)*k,y:p.y+Math.sin(a)*k});
  const OR='#ff9f43', CY='#4dd2ff';
  const va=smooth(seg(l2,0.3,1.0));
  ctx.save(); ctx.globalAlpha=va; line2(C,ext(M,aM,260),'#c9d6ff',4,1,[14,10]); line2(C,ext(Sd,aS,260),'#c9d6ff',4,1,[14,10]); ctx.restore();
  const ra=smooth(seg(l2,1.0,1.8)); ctx.save(); ctx.globalAlpha=ra; [M,Sd].forEach(p=>{ line2(ext(p,sDir,420),p,'#ffd84a',5,1); }); ctx.restore();
  const st=ext(M,sDir,450); ctx.save(); ctx.globalAlpha=ra; ctx.fillStyle='#ffe9a0'; ctx.beginPath(); for(let k=0;k<10;k++){ const r=k%2?12:30, a=k*Math.PI/5-Math.PI/2; ctx.lineTo(st.x+Math.cos(a)*r,st.y+Math.sin(a)*r); } ctx.fill(); ctx.restore();
  label(L(TXT.star)+NUM(' (rayons parallèles)',' (parallel rays)'),st.x+50,st.y+6,32,{alpha:ra,fill:'#ffe39a',align:'left'});
  label(NUM('verticale','vertical'),ext(M,aM,250).x+14,ext(M,aM,250).y,28,{alpha:va,fill:'#c9d6ff',align:'left'});
  const badge=(p,n,col,a)=>{ if(a<=0.003) return; ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p.x,p.y,19,0,Math.PI*2); ctx.fill(); ctx.restore(); txt(n,p.x,p.y+1,26,{alpha:a,fill:'#14102e',shadow:false}); };
  const z1=smooth(seg(l2,1.8,2.5)), z2=smooth(seg(l2,2.4,3.1));
  angArc(M,90,aM,sDir,OR,7,z1); badge(ext(M,(aM+sDir)/2,118),'1',OR,z1);
  angArc(Sd,90,aS,sDir,CY,7,z2); badge(ext(Sd,(aS+sDir)/2,118),'2',CY,z2);
  ctx.save(); [M,Sd].forEach(p=>{ ctx.fillStyle='#ffd84a'; ctx.beginPath(); ctx.arc(p.x,p.y,10,0,Math.PI*2); ctx.fill(); }); ctx.restore();
  label(L(TXT.malv),M.x+34,M.y+34,32,{alpha:va,fill:'#ffffff',align:'left'}); label(L(TXT.sourd),Sd.x-30,Sd.y+40,32,{alpha:va,fill:'#ffffff',align:'right'});
  label(L(TXT.center),C.x,C.y+50,30,{alpha:va,weight:600,fill:'#c9c4e8'}); ctx.save(); ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(C.x,C.y,8,0,Math.PI*2); ctx.fill(); ctx.restore();
  /* the parallel through the centre, and the same two angles found again there */
  const pa=smooth(seg(l2,7.2,8.2)); ctx.save(); ctx.globalAlpha=pa; line2(ext(C,sDir+Math.PI,120),ext(C,sDir,640),'#ffd84a',4,smooth(seg(l2,7.2,8.4)),[16,10]); ctx.restore();
  label(NUM('parallèle aux rayons','parallel to the rays'),ext(C,sDir,520).x-20,ext(C,sDir,520).y,28,{alpha:pa,fill:'#ffd84a',align:'right'});
  const o1=smooth(seg(l2,8.8,9.6)), o2=smooth(seg(l2,10.2,11.0));
  angArc(C,170,aM,sDir,OR,7,o1); badge(ext(C,(aM+sDir)/2,198),'1',OR,o1);
  angArc(C,120,aS,sDir,CY,7,o2); badge(ext(C,(aS+sDir)/2+0.08,146),'2',CY,o2);
  /* the difference */
  const da=smooth(seg(l2,14.4,15.2)); angArc(C,240,aS,aM,'#ff5c5c',11,da); badge(ext(C,(aS+aM)/2,272),'?',da>0.9?'#ff5c5c':'#ff5c5c',da*(1-smooth(seg(l2,15.4,15.8))));
  label('1° 22′ 55″',ext(C,-50*D2R,190).x,ext(C,-50*D2R,190).y,48,{alpha:smooth(seg(l2,15.6,16.2)),fill:'#ff5c5c',align:'left',scale:backOut(seg(l2,15.6,16.1))});
  /* legend */
  const lg=smooth(seg(l2,1.8,2.4)); if(lg>0){ panel(1270,110,600,l2>14?420:300,lg);
    const row=(t0,s,y,col,size)=>txt(s,1300,y,size||30,{alpha:lg*smooth(seg(l2,t0,t0+0.5)),fill:col,align:'left',shadow:false,maxW:550});
    badge({x:1320,y:170},'1',OR,lg*z1); txt(NUM('visée à Malvoisine','sighting at Malvoisine'),1352,170,30,{alpha:lg*z1,fill:OR,align:'left',shadow:false});
    badge({x:1320,y:230},'2',CY,lg*z2); txt(NUM('visée à Sourdon','sighting at Sourdon'),1352,230,30,{alpha:lg*z2,fill:CY,align:'left',shadow:false});
    row(10.4,NUM('mêmes angles au centre (angles','same angles at the centre'),300,'#ffffff',27); row(10.4,NUM('correspondants : rayons parallèles)','(corresponding angles: parallel rays)'),340,'#ffffff',27);
    row(14.4,NUM('angle au centre = ① − ②','angle at the centre = ① − ②'),410,'#ff5c5c',32); row(15.6,'= 1° 22′ 55″  (≈ 1,4°)'.replace('1,4',LANG==='fr'?'1,4':'1.4'),470,'#ff5c5c',36); }
  label(L(TXT.exag),1660,70,26,{alpha:va*0.85,weight:500,fill:'#c9c4e8'});
  veil(1-smooth(seg(l2,0,0.35)),'#03051a');
}

/* ====================================================================== */
/*  Step 6: the result on the globe                                        */
/* ====================================================================== */
function step6(l,g){
  const u=easeInOut(seg(l,0.0,2.0)), z=easeInOut(seg(l,9.8,12.0));
  aimG(lerp(20,0,u),lerp(60,76.4,u)); globeCam(lerp(34,32,z),40,0); gMat.opacity=lerp(0.85,0.6,u);
  eraArc.visible=pinA.visible=pinY.visible=false; picArc.visible=pinM.visible=pinS.visible=false;
  ring.visible=l>6.0; const rf=smooth(seg(l,6.0,9.6)); ring.geometry.setDrawRange(0,Math.floor(RING_IDX*rf/6)*6);
  renderer.render(glb,gCam);
  const c=scrV(gSpin.localToWorld(V(0,0,0)),gCam), pm=gScr(42,2.4,GR), pq=gScr(56,2.4,GR);
  const la=smooth(seg(l,0.8,1.4)); goldArc(c,pm,pq,la); label(L(TXT.notScale),200,60,26,{alpha:la*0.8*(1-z),weight:500,fill:'#c9c4e8'}); ctx.save(); ctx.globalAlpha=la*(1-z*0.6); line2(c,pm,'#ffffff',4,1,[14,10]); line2(c,pq,'#ffffff',4,1,[14,10]); ctx.restore();
  angArc(c,80,ang(c,pm),ang(c,pq),'#ff8a5c',7,la*(1-z)); { const am=(ang(c,pm)+ang(c,pq))/2; label(NUM('1,38°','1.38°'),c.x+Math.cos(am)*150+40,c.y+Math.sin(am)*150+10,42,{alpha:la*(1-z),fill:'#ff8a5c',align:'left'}); }
  label(NUM('78 850 toises','78,850 toises'),pm.x-40,(pm.y+pq.y)/2-10,34,{alpha:la*(1-smooth(seg(l,5.6,6.2))),fill:'#ffd84a',align:'right'});
  /* counters */
  const c1=smooth(seg(l,2.0,2.5)); counterBox(1560,150,'1 degré','1 degree',NUM('57 060 toises','57,060 toises'),c1); label('≈ 111 km',1560,268,40,{alpha:smooth(seg(l,3.2,3.7)),fill:'#ffffff'});
  const c2=smooth(seg(l,6.4,6.9)); const nDeg=Math.max(1,Math.round(360*rf)); counterBox(1560,420,'Tour de la Terre','Around the Earth',`${nDeg} × 111 km`,c2);
  if(rf>=1) label('≈ 40 000 km'.replace('40 000',NUM('40 000','40,000')),1560,540,44,{alpha:smooth(seg(l,9.6,10.1)),fill:'#ffd84a'});
  /* radius */
  const ra=smooth(seg(l,11.4,12.2)); if(ra>0){ const e={x:c.x+(pm.x-c.x),y:c.y+(pm.y-c.y)}; ctx.save(); ctx.globalAlpha=ra; line2(c,e,'#7dff8a',9,smooth(seg(l,11.4,12.6))); ctx.restore();
    ctx.save(); ctx.fillStyle='#ffffff'; ctx.globalAlpha=ra; ctx.beginPath(); ctx.arc(c.x,c.y,9,0,Math.PI*2); ctx.fill(); ctx.restore();
    const mid={x:(c.x+e.x)/2,y:(c.y+e.y)/2}; label(L(TXT.radius)+NUM(' ≈ 6 372 km',' ≈ 6,372 km'),mid.x-30,mid.y+10,48,{alpha:smooth(seg(l,12.4,13.0)),fill:'#7dff8a',align:'right',scale:backOut(seg(l,12.4,12.9))});
    label(L(TXT.today),mid.x-30,mid.y+76,36,{alpha:smooth(seg(l,14.2,14.8)),fill:'#ffffff',align:'right'}); }
}

/* ====================================================================== */
/*  Step 7: Newton's apple, and young Rømer                                */
/* ====================================================================== */
function step7(l,g){
  hideAll(); setMood('dusk'); sunAt(0,0); placeRoadTrees(0,true); roadTrees.forEach(t=>{ if(t.position.x<6) t.visible=false; }); road.visible=true;
  appleTree.visible=true; appleTree.position.set(-36,0,-20); newton.root.visible=true; newton.root.position.set(-27,0,-9); newton.root.rotation.y=0.55; newton.head.rotation.x=-0.3; newton.shR.rotation.x=-0.5; newton.elR.rotation.x=-0.9;
  const af=(l%3.4)/3.4; apple.visible=true; const fy=Math.max(0.35,8.6-0.5*9.8*Math.pow(af*1.5,2)*1.4); apple.position.set(-23.8,fy,-7.6);
  fldMoon.visible=true; fldMoon.position.set(lerp(-40,40,smooth(seg(l,10,12.6))),95,-260);
  picard.root.visible=true; roemer.root.visible=true; Q.g.visible=true; Q.g.position.set(36,0,-6); Q.plate.rotation.y=0.6; Q.plate.scale.z=1; Q.alid.rotation.y=0.5;
  picard.root.position.set(30,0,-2); picard.root.rotation.y=0.5; roemer.root.position.set(41,0,-1); roemer.root.rotation.y=-0.4;
  const pan=smooth(seg(l,10.0,12.6));
  if(l>12.8) wave(roemer,1,g); if(l>13.2){ picard.shL.rotation.z=-0.5; picard.shL.rotation.x=-0.6; }
  fldCam.position.set(lerp(-15,30,pan),lerp(6,8,pan),lerp(8,28,pan)); fldCam.lookAt(lerp(-25,34,pan),lerp(7,5.5,pan),lerp(-10,-6,pan));
  renderer.render(fld,fldCam);
  const pn=scr(newton.head,fldCam,V(0,2.0,0)); pill(pn.x-120,pn.y-50,L(TXT.newton),smooth(seg(l,0.8,1.3))*(1-pan),'rgba(20,16,46,0.85)',34);
  const aa=smooth(seg(l,3.0,3.6))*(1-pan); if(aa>0){ const pa=scrV(V(-23.8,9,-7.6),fldCam), pg=scrV(V(-23.8,0.6,-7.6),fldCam), pm=scrV(fldMoon.position,fldCam);
    ctx.save(); ctx.globalAlpha=aa; ctx.strokeStyle='#ffd84a'; ctx.lineWidth=7; ctx.lineCap='round'; const gy=Math.min(pg.y-10,850); ctx.beginPath(); ctx.moveTo(pa.x+60,pa.y); ctx.lineTo(pg.x+60,gy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pg.x+44,gy-26); ctx.lineTo(pg.x+60,gy); ctx.lineTo(pg.x+76,gy-26); ctx.stroke();
    const t1={x:pm.x-40,y:pm.y+60}, t2={x:pm.x-260,y:pm.y+330}; ctx.beginPath(); ctx.moveTo(t1.x,t1.y); ctx.quadraticCurveTo(pm.x-60,pm.y+240,t2.x,t2.y); ctx.stroke(); const da=Math.atan2(t2.y-(pm.y+240),t2.x-(pm.x-60)); ctx.beginPath(); ctx.moveTo(t2.x+Math.cos(da+2.6)*26,t2.y+Math.sin(da+2.6)*26); ctx.lineTo(t2.x,t2.y); ctx.lineTo(t2.x+Math.cos(da-2.6)*26,t2.y+Math.sin(da-2.6)*26); ctx.stroke(); ctx.restore();
    label(L(TXT.same),(pa.x+pm.x)/2+60,pm.y+150,44,{alpha:smooth(seg(l,4.4,5.0))*(1-pan),fill:'#ffd84a'}); }
  if(pan>0.5){ const a=smooth(seg(l,12.4,13.0)); const pp=scr(picard.head,fldCam,V(0,2.0,0)), pr=scr(roemer.head,fldCam,V(0,2.0,0));
    pill(pp.x-60,pp.y-46,'Jean Picard',a,'rgba(20,16,46,0.85)',34); pill(pr.x+60,pr.y-46,L(TXT.roemer),a,'rgba(47,74,138,0.92)',34);
    label(L(TXT.seeStory),960,150,40,{alpha:smooth(seg(l,14.0,14.6)),fill:'#ffe39a'}); }
}
const STEP_FN=[step0,step1,step2,step3,step4,step4b,step5,step6,step7];
//@@END@@
})();
