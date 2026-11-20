/* Star Hopper 64 - fx/impact */

// ---------- impact FX: shockwave, wobble, squash & stretch, dust
const FX={imp:0,shk:0,wob:0,flash:0,sq:1,sv:0,v:new THREE.Vector3()};
function impact(a,w){FX.imp=Math.max(FX.imp,a);FX.shk=0;FX.wob=Math.max(FX.wob,w);CAM.punch=Math.max(CAM.punch,a*8)}
const NP=160,pp=new Float32Array(NP*3).fill(-999),pv=new Float32Array(NP*3),pc=new Float32Array(NP*3).fill(1),pl=new Float32Array(NP),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));pg.setAttribute('color',new THREE.BufferAttribute(pc,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({vertexColors:true,size:1.1,transparent:true,opacity:.9,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);
function burst(x,y,z,n,sp,c=[1,1,1]){for(let i=0,k=0;i<NP&&k<n;i++)if(pl[i]<=0){pc.set(c,i*3);const a=Math.random()*6.283,s=sp*(.5+Math.random());pp.set([x,y,z],i*3);pv.set([Math.cos(a)*s,2+Math.random()*sp*.5,Math.sin(a)*s],i*3);pl[i]=.5+Math.random()*.4;k++}}
function parts(dt){for(let i=0;i<NP;i++)if(pl[i]>0){pl[i]-=dt;pv[i*3+1]-=14*dt;for(let k=0;k<3;k++)pp[i*3+k]+=pv[i*3+k]*dt;if(pl[i]<=0)pp.set([0,-999,0],i*3)}pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true}
// ---------- coin collection FX
const dying=[];let combo=0,lastC=-9;
function plus(x,y,z,txt){FX.v.set(x,y+.8,z).project(cam);const d=document.createElement('div');d.textContent=txt;d.style.cssText='position:fixed;pointer-events:none;font:900 26px Trebuchet MS,sans-serif;color:#ffe14d;text-shadow:2px 2px 0 #000,-1px -1px 0 #000;transition:transform .7s ease-out,opacity .7s;left:'+((FX.v.x*.5+.5)*innerWidth)+'px;top:'+((.5-FX.v.y*.5)*innerHeight)+'px;transform:translate(-50%,-50%)';document.body.appendChild(d);requestAnimationFrame(()=>{d.style.transform='translate(-50%,-190%) scale(1.3)';d.style.opacity=0});setTimeout(()=>d.remove(),750)}
function sparkle(x,y,z,red){burst(x,y,z,red?40:14,red?8:4.5,red?[1,.25,.25]:[1,.85,.25]);if(!red)burst(x,y,z,4,2.5,[1,1,1]);plus(x,y,z,red?'RED COIN!':'+1');if(red){impact(.5,.3);FX.flash=.18}}
function tickDying(dt){for(let i=dying.length-1;i>=0;i--){const d=dying[i];d.t+=dt;d.m.rotation.y+=dt*22;d.m.position.y+=dt*(7-d.t*14);d.m.scale.setScalar((d.red?1.5:1)*Math.max(0,1-d.t/.4));if(d.t>=.4){scene.remove(d.m);dying.splice(i,1)}}}
