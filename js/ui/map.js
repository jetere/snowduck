/* Star Hopper 64 - ui/map */
// ---------- island map: rotating minimap (bottom-left) + full north-up map (N key / 🗺 button)
const MK=2,MR=130,mapT=document.createElement('canvas');mapT.width=mapT.height=MR*2*MK;
{const x=mapT.getContext('2d'),im=x.createImageData(mapT.width,mapT.height),d=im.data,n=mapT.width;
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){const wx=(i+.5)/MK-MR,wz=(j+.5)/MK-MR,y=TH(wx,wz),y2=TH(wx+2,wz+2);let c;
  if(y<-.1){const q=Math.min(1,(-.1-y)/4),f=y>-.6?.75:0;c=[.45-.38*q,.95-.57*q,.92-.08*q];if(f)c=c.map(v=>v+(1-v)*f)}
  else{const sl=Math.hypot(TH(wx+2,wz)-y,y2-y)/2,cw=1-S(15,24,Math.hypot(wx,wz+6));
   if(y<1.3)c=[.93,.82,.52];else if(sl>.8)c=y>18?[.6,.6,.64]:[.62,.5,.38];else if(y>=26)c=[.96,.97,1];else if(cw>.7)c=[.75,.7,.5];else c=[.3,.72,.22];
   const sh=Math.max(.7,Math.min(1.3,1+(y-y2)*.07))*(1+y*.004);c=c.map(v=>Math.min(1,v*sh))}
  const k=(j*n+i)*4;d[k]=c[0]*255;d[k+1]=c[1]*255;d[k+2]=c[2]*255;d[k+3]=255}
 x.putImageData(im,0,0);
 // castle + towers
 const P2=(a,b)=>[(a+MR)*MK,(b+MR)*MK];x.fillStyle='#f2e2b8';let q=P2(-8,-11);x.fillRect(q[0],q[1],16*MK,10*MK);
 for(const[sx,sz]of[[-8,-1],[8,-1],[-8,-11],[8,-11]]){q=P2(sx-2,sz-2);x.fillStyle=sz<-5?'#d8332b':'#f6e9c6';x.fillRect(q[0],q[1],4*MK,4*MK)}
 x.strokeStyle='rgba(60,40,20,.6)';x.lineWidth=1;q=P2(-8,-11);x.strokeRect(q[0],q[1],16*MK,10*MK);
 for(let i=0;i<PL.length;i++){q=P2(PL[i][0]-2.5,PL[i][2]-2.5);x.fillStyle=['#ff9d2e','#35c4e8','#ff5fa2','#a5e13a'][i%4];x.fillRect(q[0],q[1],5*MK,5*MK)}}
const mmS=150,mm=document.createElement('canvas'),mmX=mm.getContext('2d'),PRm=Math.min(devicePixelRatio,2);mm.width=mm.height=mmS*PRm;
mm.style.cssText='position:fixed;left:14px;bottom:calc(env(safe-area-inset-bottom,0px) + 14px);width:'+mmS+'px;height:'+mmS+'px;z-index:10;pointer-events:none;display:none;border-radius:50%;box-shadow:0 0 0 3px #ffe14d,0 4px 14px rgba(0,0,0,.5)';document.body.appendChild(mm);
const bg=document.createElement('div');bg.style.cssText='position:fixed;inset:0;z-index:25;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(10,20,50,.8);cursor:pointer;font:700 15px Trebuchet MS,sans-serif;color:#fff';
const bgC=document.createElement('canvas');bgC.style.cssText='border:3px solid #ffe14d;border-radius:14px;background:#4aa8e8';
const bgT=document.createElement('div');bgT.style.cssText='margin-top:10px;text-align:center;text-shadow:1px 1px 0 #000';bgT.innerHTML='🧭 <b style="color:#ffe14d">ISLAND MAP</b> &nbsp; <span style="color:#ffe14d">●</span> coin &nbsp; <span style="color:#ff4040">●</span> red coin &nbsp; <span style="color:#ffe14d">★</span> power star &nbsp; ▲ you<br><small>N or click to close</small>';bg.append(bgC,bgT);document.body.appendChild(bg);
let mapOpen=false;function toggleMap(){if(!started)return;mapOpen=!mapOpen;bg.style.display=mapOpen?'flex':'none';if(mapOpen&&document.exitPointerLock)document.exitPointerLock()}
bg.addEventListener('click',toggleMap);addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyN')toggleMap();else if(e.code==='Escape'&&mapOpen)toggleMap()});
const mbtn=document.createElement('div');mbtn.textContent='🗺';mbtn.title='Map (N)';mbtn.style.cssText='position:fixed;right:118px;top:calc(env(safe-area-inset-top,0px) + 10px);width:44px;height:44px;border-radius:50%;background:rgba(10,20,50,.75);border:2px solid #ffe14d;font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:30';document.body.appendChild(mbtn);mbtn.addEventListener('click',toggleMap);mbtn.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true});
function mapDraw(x,W,rot,sc,cx0,cz0,round){// rot: camera yaw (minimap) or 0 (north-up); sc: px per world unit; centred on (cx0,cz0)
 const C=W/2,cs=Math.cos(rot),sn=Math.sin(rot),pj=(wx,wz)=>{const dx=wx-cx0,dz=wz-cz0;return[C+(dx*cs-dz*sn)*sc,C+(dx*sn+dz*cs)*sc]},u=W/(mmS*PRm);
 x.clearRect(0,0,W,W);x.save();if(round){x.beginPath();x.arc(C,C,C,0,6.2832);x.clip()}x.fillStyle='#4aa8e8';x.fillRect(0,0,W,W);
 x.translate(C,C);x.rotate(rot);x.scale(sc,sc);x.translate(-cx0,-cz0);x.imageSmoothingEnabled=true;x.drawImage(mapT,-MR,-MR,MR*2,MR*2);x.restore();
 const r=Math.max(2.5,W*(round?.016:.007));
 for(const c of coins){const q=pj(c.m.position.x,c.m.position.z);x.fillStyle=c.red?'#ff3b3b':'#ffd21f';x.strokeStyle='rgba(0,0,0,.65)';x.lineWidth=Math.max(1,r*.35);x.beginPath();x.arc(q[0],q[1],c.red?r*1.5:r,0,6.2832);x.fill();x.stroke()}
 x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
 for(const s of stars){if(!s.m.visible)continue;const q=pj(s.m.position.x,s.m.position.z),t=1+.15*Math.sin(performance.now()/180);x.font='900 '+(r*(round?5:4.2)*t)+'px sans-serif';x.lineWidth=r*.6;x.strokeStyle='#000';x.strokeText('★',q[0],q[1]);x.fillStyle='#ffe14d';x.fillText('★',q[0],q[1])}
 if(!round){x.font='900 '+W*.022+'px Trebuchet MS,sans-serif';x.fillStyle='#fff';x.strokeStyle='rgba(0,0,0,.7)';x.lineWidth=4;for(const[t,wx,wz]of[['CASTLE',0,-13],['STAR MOUNTAIN',CX,CZ+8],['WATERFALLS',-10,-28],['SAKURA ISLE',IX,IZ+14]]){const q=pj(wx,wz);x.strokeText(t,q[0],q[1]);x.fillText(t,q[0],q[1])}}
 // player arrow
 const q=pj(P.x,P.z),vx=Math.sin(P.face),vz=Math.cos(P.face),sx=vx*cs-vz*sn,sy=vx*sn+vz*cs,ph=Math.atan2(sx,-sy),a=W*(round?.05:.024);
 x.save();x.translate(q[0],q[1]);x.rotate(ph);x.beginPath();x.moveTo(0,-a);x.lineTo(a*.75,a*.8);x.lineTo(0,a*.4);x.lineTo(-a*.75,a*.8);x.closePath();x.fillStyle='#fff';x.strokeStyle='#d8332b';x.lineWidth=Math.max(2,a*.28);x.stroke();x.fill();x.restore();
 if(round){const nx=C+Math.sin(rot)*(C-.1*W),ny=C-Math.cos(rot)*(C-.1*W);x.font='900 '+W*.09+'px Trebuchet MS,sans-serif';x.lineWidth=4;x.strokeStyle='#000';x.strokeText('N',nx,ny);x.fillStyle='#ffe14d';x.fillText('N',nx,ny)}}
(function mapLoop(){requestAnimationFrame(mapLoop);const on=started&&!mapOpen&&!LV.cur;mm.style.display=on?'block':'none';
 if(on)mapDraw(mmX,mm.width,yaw,1.45*PRm,P.x,P.z,true);
 if(mapOpen){const S=Math.floor(Math.min(innerWidth,innerHeight*.86)*.9*PRm);if(bgC.width!==S){bgC.width=bgC.height=S;const css=S/PRm;bgC.style.width=bgC.style.height=css+'px'}
  mapDraw(bgC.getContext('2d'),S,0,S/(MR*2),0,0,false)}})();
