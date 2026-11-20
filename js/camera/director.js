/* Snowduck - camera/director */
// ---------- cinematic camera director
const CC={dist:9,height:1.5,fov:60,fovSpeed:14,ahead:1,lagXZ:9,lagY:3.5,zoomLag:5,bank:1,shake:1,sens:1,invY:0,keyRot:2,recenter:.3,idle:1,idleDelay:8,shots:1,slowmo:1,bars:1};
const V3=()=>new THREE.Vector3();
const CAM={look:V3(),dd:9,fov:60,df:60,roll:0,punch:0,shot:null,dir:0,lastAct:0,lastIn:-9,ts:1,cut:1,barOn:false,pos:V3(),fl:V3(),dp:V3(),dl:V3(),fp:V3(),so:{pos:V3(),look:V3(),fov:60}};
function shot(dur,fn,o){CAM.shot=Object.assign({t:0,dur,fn,inT:.4,outT:.8,lock:0,slow:0},o||{})}
function starShot(){const y0=yaw;shot(3.4,(u,o)=>{const a=y0+u*5.2,r=7-u*3.2;o.pos.set(P.x+Math.sin(a)*r,P.y+2.2+u*2,P.z+Math.cos(a)*r);o.look.set(P.x,P.y+1.6,P.z);o.fov=50-u*8},{lock:1,slow:1,inT:.25,outT:.9})}
function appearShot(){const s=stars[1].m.position;shot(3.2,(u,o)=>{const a=Math.atan2(P.x-s.x,P.z-s.z)+u*.8,r=10-u*3;o.pos.set(s.x+Math.sin(a)*r,s.y+3.5,s.z+Math.cos(a)*r);o.look.set(s.x,s.y,s.z);o.fov=52},{lock:1,inT:.6,outT:.9})}
function introShot(){shot(4.2,(u,o)=>{const a=.35-u*.5,r=70-u*34,h=26-u*16;o.pos.set(Math.sin(a)*r,8+h,-6+Math.cos(a)*r);o.look.set(0,7+u*(P.y-5.5),-6+u*(P.z+6));o.fov=46+u*14},{inT:0,outT:1.3})}
function dirTarget(now,o){const f=P.face,s=Math.floor(now/6)%4,u=(now%6)/6,fx=Math.sin(f),fz=Math.cos(f);
 if(s===0){const a=now*.45;o.pos.set(P.x+Math.sin(a)*8,P.y+1.3,P.z+Math.cos(a)*8);o.look.set(P.x,P.y+1,P.z);o.fov=56}
 else if(s===1){o.pos.set(P.x+Math.cos(f)*10+fx*2,P.y+2.2,P.z-Math.sin(f)*10+fz*2);o.look.set(P.x+fx*3,P.y+1.2,P.z+fz*3);o.fov=48}
 else if(s===2){o.pos.set(P.x-fx*7,P.y+1+u*12,P.z-fz*7);o.look.set(P.x,P.y+1.5,P.z);o.fov=55-u*8}
 else{const a=now*.2;o.pos.set(P.x+Math.sin(a)*20,P.y+15,P.z+Math.cos(a)*20);o.look.set(P.x,P.y,P.z);o.fov=44}}
function toggleDir(){CAM.dir=CAM.dir?0:1;if(CAM.dir){CAM.dp.copy(cam.position);CAM.dl.copy(CAM.fl);CAM.df=cam.fov}banner(CAM.dir?'🎬 Director cam':'Follow cam');SFX.ui()}
function camUpdate(now,dt){
 const so=CAM.so,sp=Math.hypot(P.vx,P.vz),ahead=Math.min(1,sp/17);
 if(!started){const a=now*.06;cam.position.set(Math.sin(a)*62,26,-6+Math.cos(a)*62);cam.lookAt(0,8,-6);cam.fov+=(52-cam.fov)*.1;cam.updateProjectionMatrix();CAM.fov=cam.fov;return}
 const idle=CC.idle&&P.on&&now-CAM.lastAct>CC.idleDelay&&!CAM.shot&&!CAM.dir;
 if(idle){yaw+=dt*.2;pitch+=(.22-pitch)*Math.min(1,dt*.8)}
 else if(CC.recenter>0&&sp>3&&now-CAM.lastIn>1.2&&!CAM.dir&&!CAM.shot&&P.mode!=='long')yaw=lerpA(yaw,P.face+Math.PI,Math.min(1,dt*CC.recenter*sp/10));
 const L=CAM.look,tx=P.x+P.vx*.12*CC.ahead,tz=P.z+P.vz*.12*CC.ahead,ty=P.y+CC.height,kx=1-Math.exp(-dt*CC.lagXZ),ky=1-Math.exp(-dt*CC.lagY*(P.on?1:.8));
 if(CAM.cut){L.set(tx,ty,tz);CAM.dd=CC.dist;CAM.cut=0}
 L.x+=(tx-L.x)*kx;L.z+=(tz-L.z)*kx;L.y+=(ty-L.y)*ky;L.y=Math.max(ty-3.5,Math.min(ty+3.5,L.y));
 const want=CC.dist*(1+ahead*.1+(P.mode==='long'?.12:0)-(P.mode==='pound'?.2:0)),cp=Math.cos(pitch),d0=Math.sin(yaw)*cp,d1=Math.sin(pitch),d2=Math.cos(yaw)*cp;let dd=want;
 for(let s=1;s<=want;s+=.5){const x=L.x+d0*s,y=L.y+d1*s,z=L.z+d2*s;let hit=TH(x,z)>y-.5;for(const b of BX)if(Math.abs(x-b.x)<b.w/2+.3&&Math.abs(z-b.z)<b.d/2+.3&&y>b.y-.3&&y<b.y+b.h+.3)hit=true;if(hit){dd=Math.max(1.5,s-.8);break}}
 CAM.dd+=(dd-CAM.dd)*(dd<CAM.dd?Math.min(1,dt*20):1-Math.exp(-dt*CC.zoomLag));
 const fp=CAM.fp.set(L.x+d0*CAM.dd,0,L.z+d2*CAM.dd);fp.y=Math.max(L.y+d1*CAM.dd,TH(fp.x,fp.z)+1);
 CAM.fov+=(CC.fov+CC.fovSpeed*ahead*(P.mode==='long'?1.35:1)+CAM.punch-CAM.fov)*(1-Math.exp(-dt*5));CAM.punch*=Math.exp(-dt*4.5);
 CAM.pos.copy(fp);CAM.fl.copy(L);let fv=CAM.fov;
 if(CAM.dir){dirTarget(now,so);so.pos.y=Math.max(so.pos.y,TH(so.pos.x,so.pos.z)+1);const k=1-Math.exp(-dt*2.5);CAM.dp.lerp(so.pos,k);CAM.dl.lerp(so.look,Math.min(1,k*1.4));CAM.df+=(so.fov-CAM.df)*k;CAM.pos.copy(CAM.dp);CAM.fl.copy(CAM.dl);fv=CAM.df;yaw=Math.atan2(CAM.pos.x-CAM.fl.x,CAM.pos.z-CAM.fl.z)}
 let ts=1;const sh=CAM.shot;
 if(sh){sh.t+=dt;const u=Math.min(1,sh.t/sh.dur);sh.fn(u,so);const w=(sh.inT>.01?S(0,sh.inT,sh.t):1)*(1-S(sh.dur-sh.outT,sh.dur,sh.t));CAM.pos.lerp(so.pos,w);CAM.fl.lerp(so.look,w);fv+=(so.fov-fv)*w;if(sh.slow&&CC.slowmo)ts=1-.65*(1-S(.05,.3,u));if(sh.t>=sh.dur)CAM.shot=null}
 CAM.ts+=(ts-CAM.ts)*Math.min(1,dt*(ts<CAM.ts?30:6));
 const lat=(P.vx*Math.cos(yaw)-P.vz*Math.sin(yaw))/17;CAM.roll+=((CAM.dir||CAM.shot?0:-lat*.06*CC.bank)-CAM.roll)*(1-Math.exp(-dt*4));
 shake=Math.max(0,shake-dt);const sa=shake*CC.shake*.4;
 cam.position.set(CAM.pos.x+Math.sin(now*55)*sa,CAM.pos.y+Math.sin(now*70+1)*sa*.8,CAM.pos.z+Math.cos(now*47)*sa*.6);
 cam.lookAt(CAM.fl);cam.rotateZ(CAM.roll);
 if(Math.abs(cam.fov-fv)>.01){cam.fov=fv;cam.updateProjectionMatrix()}
 const bars=!!(CAM.shot||CAM.dir)&&!!CC.bars;if(bars!==CAM.barOn){CAM.barOn=bars;$('bt').style.height=$('bb').style.height=bars?'9vh':'0'}}
