/* Snowduck - fx/trail */
// ---------- ghost trail (port of CompositorEffectGhostTrail): fading additive after-images driven by velocity
const TRN=26,TR={on:1,gain:12,len:.21,r:1,g:1,b:1},tH=[];for(let i=0;i<TRN;i++)tH.push({x:0,y:-99,z:0,s:0,t:-9,sx:1,sy:1});
const tAge=new THREE.InstancedBufferAttribute(new Float32Array(TRN*2).fill(1),1),tGeo=new THREE.SphereGeometry(1,14,10);tGeo.setAttribute('age',tAge);
const tMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{col:{value:new THREE.Color(.15,.5,1)},gain:{value:1}},
vertexShader:'attribute float age;varying float vA;varying vec3 vN,vV;void main(){vA=age;vec4 mv=modelViewMatrix*instanceMatrix*vec4(position,1.);vN=normalize(normalMatrix*mat3(instanceMatrix)*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
fragmentShader:'uniform vec3 col;uniform float gain;varying float vA;varying vec3 vN,vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.4);float a=1.-vA;a*=a;float e=(.35+.9*f)*a*gain;e=floor(e*4.+.5)/4.;if(e<.05)discard;gl_FragColor=vec4(col*e*1.2+vec3(.15)*e*step(.75,e),1.);}'});
const tMesh=new THREE.InstancedMesh(tGeo,tMat,TRN*2);tMesh.frustumCulled=false;tMesh.renderOrder=3;scene.add(tMesh);
let tI=0,tL=0;const tD=new THREE.Object3D();
function trailTick(now,dt){const sp=Math.hypot(P.vx,P.vz),str=Math.max(S(6,15,sp+Math.abs(P.vy)*.5),P.mode==='pound'||P.mode==='long'?1:0)*TR.on;
 tL+=dt;if(tL>.016){tL=0;const g=tH[tI++%TRN];g.x=P.x;g.y=P.y;g.z=P.z;g.s=str;g.t=now;g.sx=hero.scale.x;g.sy=hero.scale.y}
 const life=.12+TR.len*.5;tMat.uniforms.col.value.setRGB(TR.r,TR.g,TR.b);tMat.uniforms.gain.value=TR.gain/50;
 for(let i=0;i<TRN;i++){const g=tH[i],a=(now-g.t)/life,vis=g.s>.02&&a<1&&a>.03?1:0;
  for(let k=0;k<2;k++){tD.position.set(g.x,g.y+(k?1.25:.5)*g.sy,g.z);tD.scale.setScalar((k?.36:.5)*g.sx*(1-a*.25)*vis+1e-4);tD.updateMatrix();tMesh.setMatrixAt(i*2+k,tD.matrix);tAge.array[i*2+k]=vis?Math.min(1,a+(1-g.s)*.8):1}}
 tMesh.instanceMatrix.needsUpdate=true;tAge.needsUpdate=true}
