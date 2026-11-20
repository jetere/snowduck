/* Snowduck - levels/levels */
// ---------- new levels: three sky courses reached through glowing portal rings on the island
const LV={cur:0,cd:0,floor:0,rings:[]},LS=[null];
const lvBox=(x,y,z,w,h,d,c)=>{box(x,y,z,w,h,d,c,checker);const m=scene.children[scene.children.length-1];m.castShadow=m.receiveShadow=true};
function mkRing(x,y,z,col,label,to){const g=new THREE.Group();g.position.set(x,y,z);
 const add=(geo,op)=>new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:col,transparent:op<1,opacity:op,blending:op<1?THREE.AdditiveBlending:THREE.NormalBlending,depthWrite:op>=1,side:THREE.DoubleSide,fog:false}));
 const tr=add(new THREE.TorusGeometry(1.7,.24,10,32),1),di=add(new THREE.CircleGeometry(1.6,28),.32);g.add(tr,di);
 const bm=add(new THREE.CylinderGeometry(1.2,1.2,16,16,1,true),.12);bm.position.set(x,y+6,z);scene.add(bm);
 const cv=document.createElement('canvas');cv.width=320;cv.height=72;const c=cv.getContext('2d');c.font='900 34px Trebuchet MS,sans-serif';c.textAlign='center';c.lineWidth=7;c.strokeStyle='#000';c.strokeText(label,160,48);c.fillStyle='#fff';c.fillText(label,160,48);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false,fog:false}));sp.scale.set(7,1.6,1);sp.position.y=2.9;g.add(sp);
 scene.add(g);LV.rings.push({g,tr,x,y,z,to})}
function lvTp(x,y,z,face){P.x=x;P.y=y;P.z=z;P.vx=P.vz=P.vy=0;P.mode='';P.on=true;P.face=face;yaw=face+Math.PI;CAM.cut=1;LV.cd=performance.now()+1600;impact(.4,.3);FX.flash=.4;burst(x,y+1,z,30,6,[.6,.9,1])}
function lvDone(n,name,col,sp,top,ex,ez,sy){// register spawn, island portal, return ring beside the star
 LS[n]=sp;star(ex,top+2.4,ez,true);
 const ip=[[-12,34],[12,34],[0,52]][n-1];mkRing(ip[0],TH(ip[0],ip[1])+2,ip[1],col,'LEVEL '+n+': '+name,{x:sp.x,y:sp.y+.05,z:sp.z,face:sp.face,lv:n});
 mkRing(ex+2.6,top+1.9,ez,col,'BACK HOME',{x:ip[0],y:TH(ip[0],ip[1]+4),z:ip[1]+4,face:Math.PI,lv:0})}
const cc=[0xff9d2e,0x35c4e8,0xff5fa2,0xa5e13a];
// ---------- new area: Sakura Isle (second island, reached by stepping stones from the east beach)
{const gT=new THREE.CylinderGeometry(.3,.4,2.4,6),gB=new THREE.SphereGeometry(1.9,8,6),mT=LM(0x7a4a22),mP=LM(0xff9ccf),mP2=LM(0xffc2e2),sh=m=>{m.castShadow=m.receiveShadow=true;return m};
 for(let i=0;i<26;i++){const a=i*2.4,r=7+(i%4)*3.4,x=IX+Math.cos(a)*r,z=IZ+Math.sin(a)*r,y=TH(x,z);if(y<1.7)continue;const t=sh(new THREE.Mesh(gT,mT)),l=sh(new THREE.Mesh(gB,i%2?mP:mP2));t.position.set(x,y+1.1,z);l.position.set(x,y+3.4,z);l.scale.set(1.15,.9,1.15);scene.add(t,l)}
 for(let i=0;i<7;i++){const a=i*.9+.3,r=5.5,x=IX+Math.cos(a)*r,z=IZ+Math.sin(a)*r,m=new THREE.Mesh(new THREE.ConeGeometry(.5,2.4,5),new THREE.MeshBasicMaterial({color:i%2?0xffa8e6:0x9fe8ff}));m.position.set(x,TH(x,z)+1.1,z);m.rotation.z=(i%3-1)*.12;scene.add(m)}
 for(let k=0;k<8;k++){const x=IX+Math.cos(k*.785)*4.5,z=IZ+Math.sin(k*.785)*4.5;coin(x,TH(x,z)+1.3,z)}
 for(let k=0;k<14;k++){const x=IX+Math.cos(k*.449)*12,z=IZ+Math.sin(k*.449)*12;if(TH(x,z)>1.7)coin(x,TH(x,z)+1.3,z)}
 star(IX,TH(IX,IZ)+2.4,IZ,true);
 for(let i=0;i<6;i++){const x=50+27*i/5,z=50+21*i/5;lvBox(x,.7,z,5,1,5,cc[i%4]);coin(x,2.9,z)}}
// Level 1: Candy Spiral
{const cx=160,cz=-120,r=15;let a=0;const px=()=>cx+Math.cos(a)*r,pz=()=>cz+Math.sin(a)*r;
 const sx=px(),sz=pz();lvBox(sx,5,sz,10,1,10,0xff9d2e);let nx,nz;
 const sp={x:sx,y:6,z:sz,face:0};a+=10/r;nx=px();nz=pz();sp.face=Math.atan2(nx-sx,nz-sz);
 let top=6;for(let i=1;i<=18;i++){top=6+i*1.3;const x=px(),z=pz();lvBox(x,top-1,z,5,1,5,cc[i%4]);coin(x,top+1.4,z);if(i%6===0)for(let k=1;k<4;k++)coin(x+Math.cos(a+1.57)*k*1.2,top+1.4+k*.5,z+Math.sin(a+1.57)*k*1.2);a+=7/r}
 a+=1/r;top+=1.3;const ex=px(),ez=pz();lvBox(ex,top-1,ez,9,1,9,0xffd21f);
 lvDone(1,'Candy Spiral',0xff9d2e,sp,top,ex,ez)}
// Level 2: Sky Zigzag
{const sx=-170,sz=100;lvBox(sx,5,sz,10,1,10,0x35c4e8);const sp={x:sx,y:6,z:sz,face:Math.PI/2};let top=6,x=0,z=0;
 for(let i=0;i<18;i++){x=sx+10+i*5.2;z=sz+(i%2?2.6:-2.6);top=6+(i+1)*.8;const w=i<9?4.5:3.3;lvBox(x,top-1,z,w,1,w,cc[(i+1)%4]);coin(x,top+1.4,z);if(i%4===3)for(let k=-1;k<=1;k++)coin(x+2.6+k*.8,top+2.4-Math.abs(k)*.6,z+(i%2?-1.3:1.3))}
 const ex=x+7,ez=sz;top+=.8;lvBox(ex,top-1,ez,9,1,9,0xffd21f);lvDone(2,'Sky Zigzag',0x35c4e8,sp,top,ex,ez)}
// Level 3: Tower Climb (wall-kick the central column!)
{const cx=0,cz=-200,N=26;lvBox(cx,6,cz,6,N*1.8,6,0xf6e9c6);const r0=11;lvBox(cx+r0,5,cz,6,1,6,0xff5fa2);const sp={x:cx+r0,y:6,z:cz,face:-Math.PI/2};
 let a=0;for(let i=0;i<N;i++){a+=.85;const x=cx+Math.cos(a)*8.5,z=cz+Math.sin(a)*8.5,top=6+(i+1)*1.8*.96;lvBox(x,top-1,z,4,1,4,cc[i%4]);coin(x,top+1.4,z)}
 const top=6+N*1.8;lvDone(3,'Tower Climb',0xff5fa2,sp,top,cx-1.2,cz)}
const _rs=respawn;respawn=function(){if(LV.cur){const s=LS[LV.cur];lvTp(s.x,s.y+.05,s.z,s.face)}else _rs()};
(function lvLoop(){requestAnimationFrame(lvLoop);const now=performance.now();
 for(const r of LV.rings){r.g.rotation.y=yaw;r.tr.rotation.z=now/1200;r.g.scale.setScalar(1+.05*Math.sin(now/300+r.x));
  if(started&&now>LV.cd&&Math.abs(P.y+.9-r.y)<3&&Math.hypot(P.x-r.x,P.z-r.z)<1.9){LV.cur=r.to.lv;lvTp(r.to.x,r.to.y,r.to.z,r.to.face);banner(LV.cur?'Level '+LV.cur+': '+['','Candy Spiral','Sky Zigzag','Tower Climb'][LV.cur]:'Back on the island')}}
 if(started&&!LV.seen&&Math.hypot(P.x-IX,P.z-IZ)<28){LV.seen=1;banner('🌸 Sakura Isle')}
 if(started&&LV.cur&&P.y<-8)respawn()})();
