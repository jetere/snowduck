/* Star Hopper 64 - player/update */
// ---------- update
function update(dt){const now=performance.now()/1000,K=keys;pollPad(dt,now);if(P.on)P.gT=now;
 const crK=crouchK.some(c=>K[c])||GP.cr;
 let f=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0)-GP.my,r=(K.KeyD?1:0)-(K.KeyA?1:0)+GP.mx;if(K.ArrowLeft||K.KeyQ){yaw+=dt*CC.keyRot;CAM.lastIn=now}if(K.ArrowRight||K.KeyE){yaw-=dt*CC.keyRot;CAM.lastIn=now}if(CAM.shot&&CAM.shot.lock){f=0;r=0;P.jb=-9}
 let dx=-Math.sin(yaw)*f+Math.cos(yaw)*r,dz=-Math.cos(yaw)*f-Math.sin(yaw)*r;const hl=Math.hypot(dx,dz),mg=Math.min(1,hl),ux=hl?dx/hl*mg:0,uz=hl?dz/hl*mg:0;
 if(P.mode==='pound'){P.mt-=dt;P.vx=P.vz=0;P.vy=P.mt>0?0:-MV.pound;body.rotation.y+=dt*22;if(P.mt<=0){SL.acc+=dt;if(SL.acc>.045){SL.acc=0;slash('dash',P.y+.9)}}}
 else if(P.mode==='plant'){P.mt-=dt;P.vx=P.vz=0;if(P.mt<=0)P.mode=''}
 else{const crouching=P.on&&crK;
  if(!(P.mode==='long'&&!P.on)){const k=Math.min(1,dt*(P.on?(mg>.1?MV.accel:MV.friction):MV.air)),spd=MV.run*(((K.KeyX||GP.spr)&&MV.sprint>1)?MV.sprint:1)*AN.spd;P.vx+=((crouching?0:ux*spd)-P.vx)*k;P.vz+=((crouching?0:uz*spd)-P.vz)*k}
  if(P.mode!=='long'&&mg>.1)P.face=lerpA(P.face,Math.atan2(ux,uz),Math.min(1,dt*MV.turn));
  if(now-P.jb<MV.buffer){
   if(P.on||(now-P.gT<MV.coyote&&P.vy<=0&&P.mode==='')){P.jb=-9;const sp=Math.hypot(P.vx,P.vz);P.fa=0;
    if(crouching&&sp>4){P.mode='long';P.vy=MV.ljV;P.vx=Math.sin(P.face)*MV.ljS;P.vz=Math.cos(P.face)*MV.ljS}
    else if(crouching){P.vy=MV.bfH;P.vx=-Math.sin(P.face)*5;P.vz=-Math.cos(P.face)*5;P.flip=1;P.fd=-1;P.chain=0}
    else{P.chain=(now-P.landT<MV.chain&&sp>5)?Math.min(P.chain+1,2):0;P.vy=[MV.j1,MV.j2,MV.j3][P.chain];if(P.chain===2){P.flip=1;P.fd=1}}
    P.on=false;SFX.jump(P.chain,P.mode==='long'?1:(crouching?2:0));FX.sv=8;burst(P.x,P.y+.1,P.z,6,3);if(P.chain===2)impact(.25,.6);slash('jump',P.y);if(P.chain===2||crouching)slash('flip')}
   else if(now-P.wallT<MV.wkWin){P.aj=0;P.vy=MV.wkV;P.vx=P.wn[0]*MV.wkS;P.vz=P.wn[1]*MV.wkS;P.face=Math.atan2(P.wn[0],P.wn[1]);P.mode='';P.wallT=-9;P.jb=-9;P.chain=0;SFX.wall();impact(.3,.4);slash('wall');burst(P.x,P.y+1,P.z,10,4);FX.sv=6}
   else if(P.aj<MV.airJumps&&P.mode===''){P.aj++;P.jb=-9;P.vy=MV.j2;P.flip=1;P.fd=1;SFX.air();burst(P.x,P.y+.5,P.z,8,3,[.8,.9,1]);FX.sv=6}}
  P.vy-=MV.grav*dt}
 if(P.mode==='pound'&&P.mt>0)P.vy=0;P.vy=Math.max(P.vy,-MV.term);{const gl=!!(MV.glide&&!P.on&&P.mode===''&&P.vy<0&&(K.Space||GP.jump));if(gl){P.vy=Math.max(P.vy,-MV.glideFall);if(!P.glp)SFX.glide()}P.gl=P.glp=gl}
 for(const ax of[0,1]){const nx=ax?P.x:P.x+P.vx*dt,nz=ax?P.z+P.vz*dt:P.z,b=blk(nx,nz);if(b){P.wn=b;if(!P.on)P.wallT=now;ax?P.vz=0:P.vx=0}else{P.x=nx;P.z=nz}}
 {const WB=LV.cur?400:130;P.x=Math.max(-WB,Math.min(WB,P.x));P.z=Math.max(-WB,Math.min(WB,P.z))}
 const gy=gY(P.x,P.z,P.y);let ny=P.y+P.vy*dt;
 if(P.vy<=0&&ny<=gy+(P.on?.55:0)){if(!P.on){P.landT=now;const fv=-P.vy;if(P.mode==='pound'){P.mode='plant';P.mt=.35;shake=.5;SFX.pound();impact(1,1);slash('slam',gy);slash('slam2',gy);FX.sq=.45;FX.sv=0;FX.flash=.25;burst(P.x,gy+.2,P.z,45,9)}else{if(P.mode==='long')P.mode='';SFX.land(fv);if(fv>8){FX.sq=Math.max(.6,1-fv*.012);FX.sv=0;burst(P.x,gy+.2,P.z,Math.min(16,fv|0),4);if(fv>24)impact(.35,.5);if(fv>14)slash('land',gy)}}P.flip=0;body.rotation.set(0,0,0)}P.on=true;P.aj=0;P.y=gy;P.vy=0}
 else{P.on=false;if(P.vy>0)for(const b of BX)if(Math.abs(P.x-b.x)<b.w/2+.35&&Math.abs(P.z-b.z)<b.d/2+.35&&P.y+1.5<=b.y+.01&&ny+1.5>b.y){ny=b.y-1.5;P.vy=0}P.y=ny}
 if(P.y<-1.6){SFX.fall();burst(P.x,0,P.z,35,7);impact(.6,1);respawn()}
 // collectibles
 for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.m.rotation.y+=dt*4;if(Math.hypot(c.m.position.x-P.x,c.m.position.y-P.y-.9,c.m.position.z-P.z)<(c.red?1.6:1.3)){coins.splice(i,1);dying.push({m:c.m,t:0,red:c.red});sparkle(c.m.position.x,c.m.position.y,c.m.position.z,c.red);
  if(c.red){$('rc').textContent=++nR;SFX.red();if(nR===8){stars[1].m.visible=stars[1].on=true;banner('A Power Star appeared!');setTimeout(SFX.appear,350);if(CC.shots)appearShot()}}else{$('co').textContent=++nC;combo=now-lastC<1.2?Math.min(combo+1,8):0;lastC=now;SFX.coin(combo)}}}
 for(const s of stars){if(!s.on)continue;s.m.rotation.y+=dt*2.5;s.m.position.y=s.y+Math.sin(now*3)*.3;if(Math.hypot(s.m.position.x-P.x,s.m.position.y-P.y-.9,s.m.position.z-P.z)<2.2){s.on=s.m.visible=false;$('st').textContent=++nS;impact(.8,.9);FX.flash=.45;burst(P.x,P.y+1,P.z,35,7);banner(nS>=6?'ALL STARS COLLECTED!':'★ POWER STAR! ★');SFX.star();if(CC.shots)starShot()}}
 // animation: snowman-duck kangaroo hops, every value eased (nothing snaps)
 const sp=Math.hypot(P.vx,P.vz),cr=P.on&&crK&&P.mode!=='plant',ez=k=>Math.min(1,dt*k);
 const mv=P.on&&P.mode===''&&!cr?Math.min(1,sp/6):0;AN.hop+=(mv-AN.hop)*ez(9);
 if(AN.hop>.03){const o0=Math.floor(P.ph/Math.PI);P.ph+=dt*Math.PI*(1.5+AN.hop*1.1)*MV.animSpd*(MV.animSync?Math.max(.6,Math.min(2.2,sp/6)):1);if(Math.floor(P.ph/Math.PI)!==o0&&AN.hop>.4)SFX.step()}
 const fr=(P.ph/Math.PI)%1,arc=Math.sin(fr*Math.PI),hopH=arc*.6*AN.hop,land=Math.pow(1-arc,4)*AN.hop;AN.spd=1+AN.hop*(arc*.6-.25);
 AN.crouch+=((cr?1:0)-AN.crouch)*ez(14);
 const sy=1+.16*arc*AN.hop-.3*land-.35*AN.crouch+Math.sin(performance.now()/400)*.015;
 AN.tilt+=(.24*Math.cos(fr*Math.PI)*AN.hop-AN.tilt)*ez(18);AN.dive+=((P.mode==='long'?1.3:0)-AN.dive)*ez(12);
 const air=!P.on,wt=air?(P.vy>0||P.gl?1:.55):.12+.5*arc*AN.hop;AN.flap+=(wt-AN.flap)*ez(12);
 body.scale.set(1/Math.sqrt(sy),sy,1/Math.sqrt(sy));body.position.y=.8*sy+hopH;
 aL.rotation.z=-AN.flap;aR.rotation.z=AN.flap;
 const fw=air?.7:-.6*arc*AN.hop;lL.rotation.x+=(fw-lL.rotation.x)*ez(16);lR.rotation.x+=(fw-lR.rotation.x)*ez(16);
 if(P.flip){P.fa+=dt*13*P.fd;if(Math.abs(P.fa)>6.28){P.flip=0;P.fa=0}body.rotation.x=P.fa}else body.rotation.x=AN.tilt+AN.dive;
 if(P.mode!=='pound')body.rotation.y=0;
 FX.sv+=(-140*(FX.sq-1)-9*FX.sv)*dt;FX.sq=Math.max(.4,Math.min(1.5,FX.sq+FX.sv*dt));const qs=1/Math.sqrt(FX.sq);hero.scale.set(qs,FX.sq,qs);hero.position.set(P.x,P.y,P.z);hero.rotation.y=P.face;const g2=gY(P.x,P.z,P.y);blob.position.set(P.x,g2+.06,P.z);blob.scale.setScalar(Math.max(.35,1.1-(P.y-g2)*.035-hopH*.5))}
