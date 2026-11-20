/* Snowduck - ui/hud */
function respawn(){CAM.cut=1;P.x=0;P.z=40;P.y=TH(0,40);P.vx=P.vz=P.vy=0;P.mode='';P.on=true}
let nC=0,nR=0,nS=0;function banner(t){const m=$('msg');m.textContent=t;m.style.opacity=1;setTimeout(()=>m.style.opacity=0,2400)}
const lerpA=(a,b,t)=>{let d=((b-a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;return a+d*t};
