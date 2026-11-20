/* Star Hopper 64 - player/tuning */
// ---------- movement tuning + gamepad
const MV={run:10,sprint:1.5,accel:11,friction:11,air:3.5,turn:14,grav:38,term:45,j1:13,j2:15.5,j3:20.5,chain:.3,coyote:.1,buffer:.12,varJump:1,airJumps:0,glide:0,glideFall:3,ljS:17,ljV:10,bfH:17,wkV:15,wkS:9,wkWin:.15,pound:34,poundWind:.3,animSpd:1.8,animSync:0},MD={...MV};
const GP={jump:0,cr:0,spr:0,mx:0,my:0};
let padOK=true;
function pollPad(dt,now){let gp=null;if(padOK){try{gp=[...(navigator.getGamepads?navigator.getGamepads():[])].find(Boolean)}catch(e){padOK=false}}
 if(!gp){GP.mx=GP.my=GP.cr=GP.spr=GP.jump=0;return}
 const dz=v=>Math.abs(v)<.15?0:v,B=i=>gp.buttons[i]&&gp.buttons[i].pressed;
 GP.mx=dz(gp.axes[0]||0);GP.my=dz(gp.axes[1]||0);const rx=dz(gp.axes[2]||0),ry=dz(gp.axes[3]||0);
 if(rx||ry)look(rx*dt*500,ry*dt*500,.0035);
 const j=!!B(0),c=!!(B(1)||B(2)),sp=!!(B(7)||B(5));
 if(j&&!GP.jump)P.jb=now;if(c&&!GP.cr)pound();GP.jump=j;GP.cr=c;GP.spr=sp;
 if(j||c||GP.mx||GP.my)CAM.lastAct=now}
