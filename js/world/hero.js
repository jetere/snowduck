/* Snowduck - world/hero */
// ---------- hero: snowman-duck "Quackman"
const hero=new THREE.Group(),body=new THREE.Group(),AN={hop:0,tilt:0,dive:0,flap:.1,crouch:0,spd:1};body.position.y=.8;hero.add(body);
const SPH=new THREE.SphereGeometry(1,16,12),CYL=new THREE.CylinderGeometry(1,1,1,14),
 mk=(g,c,x,y,z,sx,sy,sz,p=body)=>{const m=new THREE.Mesh(g,LM(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);p.add(m);return m},
 piv=(x,y)=>{const g=new THREE.Group();g.position.set(x,y,0);body.add(g);return g};
mk(SPH,0xffffff,0,-.3,0,.5,.5,.5);mk(SPH,0xffffff,0,.45,0,.36,.36,.36);
mk(SPH,0xff9a1f,0,.42,.4,.2,.075,.25);mk(SPH,0xe86a10,0,.35,.38,.17,.05,.2);
for(const e of[-1,1]){mk(SPH,0x111111,e*.15,.54,.3,.065,.08,.05);mk(SPH,0xffffff,e*.14,.57,.34,.02,.02,.02)}
mk(new THREE.TorusGeometry(.3,.085,8,16),0xd8332b,0,.13,0,1,1,1).rotation.x=Math.PI/2;mk(new THREE.BoxGeometry(.14,.4,.06),0xd8332b,.2,-.08,.3,1,1,1).rotation.z=.15;
mk(CYL,0x1a1a22,0,.78,0,.34,.03,.34);mk(CYL,0x1a1a22,0,.93,0,.2,.28,.2);mk(CYL,0xd8332b,0,.84,0,.205,.05,.205);
for(const by of[0,-.25,-.5])mk(SPH,0x222233,0,by,Math.sqrt(Math.max(.01,.25-(by+.3)*(by+.3))),.045,.045,.03);
mk(SPH,0xf0f4ff,0,-.1,-.52,.13,.2,.18);
const aL=piv(-.5,-.05),aR=piv(.5,-.05),lL=piv(-.2,-.76),lR=piv(.2,-.76);
mk(SPH,0xdbe8ff,-.04,-.2,0,.1,.28,.2,aL);mk(SPH,0xdbe8ff,.04,-.2,0,.1,.28,.2,aR);
mk(SPH,0xff9a1f,0,0,.12,.17,.05,.26,lL);mk(SPH,0xff9a1f,0,0,.12,.17,.05,.26,lR);
scene.add(hero);
const blob=new THREE.Mesh(new THREE.CircleGeometry(.65,16),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.5,depthWrite:false}));blob.rotation.x=-Math.PI/2;scene.add(blob);
