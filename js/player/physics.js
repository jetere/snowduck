/* Snowduck - player/physics */
// ---------- physics
const P={x:0,y:TH(0,40),z:40,vx:0,vz:0,vy:0,on:true,face:Math.PI,chain:0,landT:0,mode:'',mt:0,wallT:-9,wn:[0,0],flip:0,fa:0,fd:1,jb:-9,ph:0,gT:0,aj:0,gl:false,glp:false};
function gY(x,z,py){let y=TH(x,z);for(const b of BX)if(Math.abs(x-b.x)<=b.w/2+.2&&Math.abs(z-b.z)<=b.d/2+.2){const t=b.y+b.h;if(t<=py+.8&&t>y)y=t}return y}
function hb(x,z){for(const b of BX){if(P.y+1.2<=b.y+.02||P.y>=b.y+b.h-.35)continue;const hx=b.w/2+.42,hz=b.d/2+.42;if(Math.abs(x-b.x)<hx&&Math.abs(z-b.z)<hz)return Math.abs(x-b.x)/hx>Math.abs(z-b.z)/hz?[Math.sign(x-b.x),0]:[0,Math.sign(z-b.z)]}return null}
function blk(nx,nz){const d=Math.hypot(nx-P.x,nz-P.z)||1e-6,t=TH(nx,nz);
 if(t>P.y+.5&&(t-TH(P.x,P.z))/d>.8){const gx=TH(nx-1,nz)-TH(nx+1,nz),gz=TH(nx,nz-1)-TH(nx,nz+1),l=Math.hypot(gx,gz)||1;return[gx/l,gz/l]}
 return hb(nx,nz)&&!hb(P.x,P.z)?hb(nx,nz):null}
