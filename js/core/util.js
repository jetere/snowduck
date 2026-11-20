/* Snowduck - core/util */
window.onerror=(m,s,l)=>{const o=document.getElementById('ov');o.style.display='flex';o.innerHTML='<div><h1>Oops</h1><p>'+m+' (line '+l+')</p></div>'};
const $=id=>document.getElementById(id),S=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
const CX=-30,CZ=-35,IX=98,IZ=92;
function TH(x,z){const r=Math.hypot(x,z),isl=1-S(62,88,r),hills=Math.sin(x*.07+1)*Math.cos(z*.06)*2.2+Math.sin(x*.16+z*.11)*.7,dm=Math.hypot(x-CX,z-CZ),mt=Math.min(34*Math.exp(-((dm/28)*(dm/28))),27);
 let b=3+hills+mt;const w=1-S(15,24,Math.hypot(x,z+6));b+=(3-b)*w;const v=isl*b+(1-isl)*-4,d2=Math.hypot(x-IX,z-IZ);if(d2>30)return v;const i2=1-S(15,25,d2),hh=3.2+Math.sin(x*.25)*Math.cos(z*.22)*.9+(1-S(0,9,d2))*3.5;return Math.max(v,i2*hh+(1-i2)*-4)}
