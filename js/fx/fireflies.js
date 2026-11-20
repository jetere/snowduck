/* Star Hopper 64 - fx/fireflies */
// ---------- glow particles: fireflies + pollen drifting over the grass, additive soft sprites that feed the bloom
const FFN=360,ffPos=new Float32Array(FFN*3),ffSd=new Float32Array(FFN),ffSz=new Float32Array(FFN),ffCol=new Float32Array(FFN*3),ffBase=new Float32Array(FFN*3);
const ffPal=[[1,.92,.35],[.55,1,.5],[.5,.95,1],[1,.6,.85],[1,.8,.4]];
function ffSpawn(i,cx,cz,full){for(let k=0;k<12;k++){const a=Math.random()*6.283,r=full?Math.sqrt(Math.random())*40:30+Math.random()*10,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(TH(x,z)<1.7||Math.hypot(x,z)>150)continue;ffBase.set([x,TH(x,z),z],i*3);break}
 ffSd[i]=Math.random();ffSz[i]=.22+Math.random()*.34;const c=ffPal[(Math.random()*ffPal.length)|0];ffCol.set(c,i*3);ffBase[i*3+1]=ffBase[i*3+1]||-999}
for(let i=0;i<FFN;i++){ffBase[i*3+1]=-999;ffSpawn(i,0,10,true);ffSd[i]=Math.random()}
const ffG=new THREE.BufferGeometry();ffG.setAttribute('position',new THREE.BufferAttribute(ffPos,3));ffG.setAttribute('sd',new THREE.BufferAttribute(ffSd,1));ffG.setAttribute('sz',new THREE.BufferAttribute(ffSz,1));ffG.setAttribute('col',new THREE.BufferAttribute(ffCol,3));
const ffU={time:{value:0},scl:{value:innerHeight*PR*.8},gain:{value:1}};
const ffM=new THREE.Points(ffG,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:ffU,
vertexShader:'attribute float sd,sz;attribute vec3 col;uniform float time,scl;varying vec3 vC;varying float vA;void main(){vC=col;vec4 mv=modelViewMatrix*vec4(position,1.);float fl=.5+.5*sin(time*(1.2+sd*2.2)+sd*50.);fl=fl*fl*(3.-2.*fl);float d=max(-mv.z,.1);vA=(.25+.9*fl)*smoothstep(90.,25.,d)*step(-900.,position.y);gl_PointSize=clamp(sz*scl/d*(.8+.5*fl),1.,70.);gl_Position=projectionMatrix*mv;}',
fragmentShader:'uniform float gain;varying vec3 vC;varying float vA;void main(){vec2 q=gl_PointCoord-.5;float r=length(q)*2.;if(r>1.)discard;float g=exp(-r*r*5.)*.7+exp(-r*r*40.)*.9;gl_FragColor=vec4(vC*g*vA*gain,1.);}'}));
ffM.frustumCulled=false;ffM.renderOrder=5;scene.add(ffM);
function ffTick(t){ffU.time.value=t;const cx=P.x,cz=P.z;for(let i=0;i<FFN;i++){let bx=ffBase[i*3],bz=ffBase[i*3+2];if(ffBase[i*3+1]<-900||Math.hypot(bx-cx,bz-cz)>44){ffBase[i*3+1]=-999;ffSpawn(i,cx,cz,false);bx=ffBase[i*3];bz=ffBase[i*3+2];ffG.attributes.sd.needsUpdate=ffG.attributes.sz.needsUpdate=ffG.attributes.col.needsUpdate=true}
 const s=ffSd[i]*40,y0=ffBase[i*3+1];ffPos[i*3]=bx+Math.sin(t*.5+s)*1.4+Math.sin(t*1.3+s*2)*.4;ffPos[i*3+2]=bz+Math.cos(t*.45+s*1.3)*1.4;ffPos[i*3+1]=y0<-900?-999:TH(ffPos[i*3],ffPos[i*3+2])+.9+ffSz[i]*2+Math.sin(t*.8+s)*.6+.5*ffSd[i]*3}
 ffG.attributes.position.needsUpdate=true}
