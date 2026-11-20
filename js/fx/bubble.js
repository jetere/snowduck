/* Star Hopper 64 - fx/bubble */
// ---------- impact bubble (black-hole shader port: fresnel rim, accretion glow, SDF-noise dissolve, ripple) + screen lens + smoke (smoke shader port)
const BLC={on:1,size:1,dur:1,distort:.5,glow:1.2,width:3,ns:3,ripple:1,r:1,g:.6,b:.2},SMK={on:1,count:1,size:1,life:1,alpha:1,vs:3,vsp:1,emis:1,heat:1,r:.75,g:.72,b:.8};
const BLF=`uniform float time,ph,inten,acc,accw,ns,rip;uniform vec3 ac,rc;varying vec3 vN,vV,vO,vW;
float smn(float a,float b,float k){float h=max(k-abs(a-b),0.);return min(a,b)-h*h*.25/k;}
float smx(float a,float b,float k){float h=max(k-abs(a-b),0.);return max(a,b)+h*h*.25/k;}
float sph(vec3 i,vec3 f,vec3 c){vec3 p=17.*fract((i+c)*.3183099+vec3(.11,.17,.13));float w=fract(p.x*p.y*p.z*(p.x+p.y+p.z));return length(f-c)-.7*w*w;}
float sdB(vec3 p){vec3 i=floor(p),f=fract(p);return min(min(min(sph(i,f,vec3(0,0,0)),sph(i,f,vec3(0,0,1))),min(sph(i,f,vec3(0,1,0)),sph(i,f,vec3(0,1,1)))),min(min(sph(i,f,vec3(1,0,0)),sph(i,f,vec3(1,0,1))),min(sph(i,f,vec3(1,1,0)),sph(i,f,vec3(1,1,1)))));}
float fbm(vec3 p,float rough,float infl,float sm,float d){float s=1.;for(int i=0;i<4;i++){float n=s*sdB(p);n=smx(n,d-infl*s,sm*s);d=smn(n,d,sm*s);p=mat3(vec3(0.,1.6,1.2),vec3(-1.6,.72,-.96),vec3(-1.2,-.96,1.28))*p;s*=rough;}return d;}
void main(){vec3 N=normalize(vN),V=normalize(vV);float ed=1.-abs(dot(N,V));float sm=mix(.6,.01,ph),sh=mix(50.,1.,ph);
vec3 np=vO*ns;float ya=np.y*10.;np=mat3(vec3(cos(ya),0.,-sin(ya)),vec3(0.,1.,0.),vec3(sin(ya),0.,cos(ya)))*np+vec3(0.,-time*.1,0.);
float nd=fbm(np,.4,.1,sm,length(vO)-.5);float al=1.-clamp(-nd*sh,0.,1.);al*=al;
float dist=distance(vW,rc);float wv=sin(dist*3.-ph*20.)*.5+.5,fd=exp(-dist*.15)*(1.-ph);
vec3 col=vec3(.8,.9,1.)*(1.-ed)*.5+ac*pow(ed,accw)*acc*1.5+vec3(.4,.7,1.)*wv*fd*rip;col=floor(col*4.+.5)/4.;
gl_FragColor=vec4(col,clamp((ed+.15)*al*inten,0.,1.));}`;
const BL=[];for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{time:OU.time,ph:{value:0},inten:{value:1},acc:{value:1},accw:{value:3},ns:{value:3},rip:{value:0},ac:{value:new THREE.Color()},rc:{value:new THREE.Vector3()}},vertexShader:'varying vec3 vN,vV,vO,vW;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=-mv.xyz;vO=position*.5;vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*mv;}',fragmentShader:BLF}));m.visible=false;m.frustumCulled=false;m.renderOrder=6;scene.add(m);BL.push({m,on:0,t:0})}
const NS=140,sP=[],sA=new THREE.InstancedBufferAttribute(new Float32Array(NS).fill(1),1),smG=new THREE.PlaneGeometry(1,1),tD2=new THREE.Object3D();for(let i=0;i<NS;i++)sP.push({x:0,y:-99,z:0,vx:0,vy:0,vz:0,s:1,d:1,l:1});smG.setAttribute('life',sA);
const sM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:OU.time,col:{value:new THREE.Color()},heat:{value:1},emis:{value:1},vs:{value:3},vsp:{value:1},alpha:{value:1}},
vertexShader:'attribute float life;varying vec2 vUv;varying float vL;void main(){vUv=uv;vL=life;vec3 c=instanceMatrix[3].xyz;float s=instanceMatrix[0][0];vec3 r=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]),u=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);gl_Position=projectionMatrix*viewMatrix*vec4(c+(r*position.x+u*position.y)*s,1.);}',
fragmentShader:`uniform float time,heat,emis,vs,vsp,alpha;uniform vec3 col;varying vec2 vUv;varying float vL;
vec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float vor(vec2 p){vec2 i=floor(p),f=fract(p);float m=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=.5+.5*sin(time*vsp*1.5+6.2831*h2(i+g));m=min(m,length(g+o-f));}return m;}
void main(){float r=length(vUv-.5)*2.;if(r>1.)discard;float n=vor((vUv+time*vsp*.1)*vs);float a=smoothstep(.1,.65,1.-n);a*=1.-smoothstep(.5,1.,r);if(a<vL*.8)discard;
vec3 g=mix(mix(vec3(1.,.9,.5),vec3(1.,.45,.12),smoothstep(0.,.3,vL)),vec3(.35,.33,.4),smoothstep(.25,.8,vL));
vec3 c=col*mix(vec3(1.),g*1.6,heat);c*=1.+emis*.4*(1.-vL);c=floor(c*4.+.5)/4.;gl_FragColor=vec4(c,a*alpha*(1.-vL*.7));}`});
const sMesh=new THREE.InstancedMesh(smG,sM,NS);sMesh.frustumCulled=false;sMesh.renderOrder=7;scene.add(sMesh);
function smoke(x,y,z,n,sp,rad){for(let i=0,k=0;i<NS&&k<n;i++){const s=sP[i];if(s.l<1)continue;const a=Math.random()*6.283,v=sp*(.5+Math.random()*.7),r=rad*Math.random();s.x=x+Math.cos(a)*r;s.z=z+Math.sin(a)*r;s.y=y+Math.random()*.3;s.vx=Math.cos(a)*v;s.vz=Math.sin(a)*v;s.vy=.8+Math.random()*1.8;s.s=(1+Math.random()*1.3)*SMK.size;s.d=(.6+Math.random()*.6)*SMK.life;s.l=0;k++}}
const BK={jump:{R:2.4,d:.45,l:.5,sm:8},flip:{R:2.6,d:.45,l:.5,sm:3,f:1},wall:{R:2.2,d:.4,l:.4,sm:6,f:1},dash:{R:0,sm:2},slam:{R:10,d:.9,l:1.2,sm:36,ring:1,rip:1},land:{R:3.6,d:.5,l:.6,sm:10}};
function blast(kind,y){const k=BK[kind];if(!k)return;const yy=y===undefined?P.y:y;if(SMK.on)smoke(P.x,yy+(kind==='dash'?0:.2),P.z,Math.round(k.sm*SMK.count),k.ring?9:3.5,k.ring?4:.6);
 if(!k.R||!BLC.on)return;const b=BL.find(q=>!q.on)||BL[0];b.on=1;b.t=0;b.d=k.d;b.R=k.R;b.l=k.l;b.f=k.f;b.rip=k.rip?BLC.ripple:0;b.x=P.x;b.y=yy+(k.f?1:.3);b.z=P.z;b.m.visible=true}
function fxTick(dt){const L=post.uniforms.lens.value;let n=0;
 for(const b of BL){if(!b.on)continue;b.t+=dt*BLC.dur;const u=b.t/b.d;if(u>=1){b.on=0;b.m.visible=false;continue}
  const m=b.m,BU=m.material.uniforms,e=1-Math.pow(1-u,3),R=b.R*BLC.size*(.3+.9*e);m.scale.setScalar(R);if(b.f)m.position.set(P.x,P.y+1,P.z);else m.position.set(b.x,b.y,b.z);
  BU.ph.value=u;BU.inten.value=1-u*u;BU.acc.value=BLC.glow;BU.accw.value=BLC.width;BU.ns.value=BLC.ns;BU.rip.value=b.rip;BU.ac.value.setRGB(BLC.r,BLC.g,BLC.b);BU.rc.value.set(b.x,b.y,b.z);
  FX.v.copy(m.position).project(cam);const dist=cam.position.distanceTo(m.position);
  L[n].set(FX.v.x*.5+.5,FX.v.y*.5+.5,R/(dist*Math.tan(cam.fov*Math.PI/360))*.5,FX.v.z<1?BLC.distort*b.l*(1-u):0);n++}
 for(;n<4;n++)L[n].set(0,0,0,0);
 const SU2=sM.uniforms;SU2.col.value.setRGB(SMK.r,SMK.g,SMK.b);SU2.heat.value=SMK.heat;SU2.emis.value=SMK.emis;SU2.vs.value=SMK.vs;SU2.vsp.value=SMK.vsp;SU2.alpha.value=SMK.alpha;
 for(let i=0;i<NS;i++){const s=sP[i];if(s.l<1){s.l+=dt/s.d;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;const dm=Math.exp(-dt*2.5);s.vx*=dm;s.vz*=dm;s.vy=s.vy*dm+1.2*dt}
  tD2.position.set(s.x,s.y,s.z);tD2.scale.setScalar(s.l<1?s.s*(1+s.l*1.6):1e-4);tD2.updateMatrix();sMesh.setMatrixAt(i,tD2.matrix);sA.array[i]=Math.min(1,s.l)}
 sMesh.instanceMatrix.needsUpdate=true;sA.needsUpdate=true}
let mK=0;function mistTick(t){const k=(t*8)|0;if(k===mK||!started)return;mK=k;for(const e of WE)if(Math.hypot(e[0]-P.x,e[2]-P.z)<80)burst(e[0],e[1]+.4,e[2],2,2.2,[.85,.95,1])}
