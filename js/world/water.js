/* Snowduck - world/water */
// ---------- toon ocean + waterfalls + rivers (toon-shader style: banded diffuse, toon spec, rim light, shore foam)
const OU={time:{value:0}},FOGU=()=>THREE.UniformsUtils.clone(THREE.UniformsLib.fog);
const sd=new Uint8Array(384*384*4);for(let j=0;j<384;j++)for(let i=0;i<384;i++){const k=(j*384+i)*4;sd[k]=Math.round(Math.min(1,Math.max(0,-TH((i/383-.5)*280,(j/383-.5)*280)/4))*255);sd[k+3]=255}
const shoreT=new THREE.DataTexture(sd,384,384,THREE.RGBAFormat);shoreT.magFilter=shoreT.minFilter=THREE.LinearFilter;shoreT.needsUpdate=true;
const NZ='float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}\n';
const water=new THREE.Mesh(new THREE.PlaneGeometry(900,900),new THREE.ShaderMaterial({transparent:true,fog:true,uniforms:Object.assign(FOGU(),{time:OU.time,shore:{value:shoreT},sun:{value:new THREE.Vector3(.5,.83,.33).normalize()}}),
vertexShader:`varying vec3 vW;
#include <fog_pars_vertex>
void main(){vec4 wp=modelMatrix*vec4(position,1.);vW=wp.xyz;vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`,
fragmentShader:`uniform float time;uniform sampler2D shore;uniform vec3 sun;varying vec3 vW;
#include <fog_pars_fragment>
`+NZ+`void main(){vec2 p=vW.xz;float t=time;
vec2 d1=vec2(.96,.29),d2=vec2(-.37,.93),d3=vec2(.7,-.7);
vec2 g=d1*cos(dot(p,d1)*.45+t*1.1)*.16+d2*cos(dot(p,d2)*.8+t*1.5)*.1+d3*cos(dot(p,d3)*1.7+t*2.1)*.05;
vec3 N=normalize(vec3(-g.x,1.,-g.y)),V=normalize(cameraPosition-vW);
float dep=texture2D(shore,clamp((p+140.)/280.+g*.01,0.,1.)).r;
float n=vn(p*.35+vec2(t*.05,0.))*.6+vn(p*1.2-t*.1)*.4;
float nd=dot(N,sun)*.5+.5,bnd=smoothstep(.45,.5,nd)*.5+smoothstep(.62,.67,nd)*.5;
float dq=smoothstep(0.,.18,dep)*.5+smoothstep(.25,.6,dep)*.5;
vec3 col=mix(vec3(.45,.98,.94),vec3(.12,.68,.95),smoothstep(0.,.5,dq));col=mix(col,vec3(.07,.38,.84),smoothstep(.5,1.,dq));
col*=.92+.25*bnd;
vec3 H=normalize(sun+V);float sp=pow(max(dot(N,H),0.),90.);col+=vec3(1.,.95,.8)*smoothstep(.5,.55,sp)*.8;
float rim=pow(1.-max(dot(N,V),0.),3.);col=mix(col,vec3(.75,.92,1.),smoothstep(.45,.55,rim)*.5);
col=mix(col,vec3(1.,.74,.66),pow(1.-max(dot(N,V),0.),4.)*.4);
float cd=length(cameraPosition-vW);float gl2=step(.9,vn(p*2.2+vec2(t*.7,-t*.5)))*step(.8,vn(p*.7-t*.2));col+=vec3(1.,.96,.75)*gl2*1.6*(1.-smoothstep(50.,190.,cd));
col+=vec3(.2)*step(.78,vn(p*.9+vec2(t*.3,-t*.2)+g*3.))*(1.-dq*.7);
float foam=max(1.-smoothstep(.02,.07,dep),step(.5,sin(dep*70.-t*2.+n*5.))*(1.-smoothstep(.07,.2,dep))*.9);
col=mix(col,vec3(1.),foam);
gl_FragColor=vec4(col,mix(.65,.97,smoothstep(0.,.25,dep)));
#ifdef USE_FOG
float wf=smoothstep(fogNear,fogFar*1.7,fogDepth)*.5;gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,wf);
#endif
}`}));
water.rotation.x=-Math.PI/2;water.position.y=-.1;water.userData.nofx=true;scene.add(water);
function stream(a,r0){let x=CX+Math.cos(a)*r0,z=CZ+Math.sin(a)*r0;const p=[];for(let i=0;i<150;i++){p.push([x,z]);const gx=TH(x+.5,z)-TH(x-.5,z),gz=TH(x,z+.5)-TH(x,z-.5),gl=Math.hypot(gx,gz);if(gl<.01||TH(x,z)<.25)break;x-=gx/gl*1.1;z-=gz/gl*1.1}
 for(let k=0;k<3;k++)for(let i=1;i<p.length-1;i++)p[i]=[(p[i-1][0]+p[i][0]*2+p[i+1][0])/4,(p[i-1][1]+p[i][1]*2+p[i+1][1])/4];return p}
const wfMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:Object.assign(FOGU(),{time:OU.time}),
vertexShader:`attribute float steep,tt;varying vec2 vUv;varying float vS,vT;
#include <fog_pars_vertex>
void main(){vUv=uv;vS=steep;vT=tt;vec4 mvPosition=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`,
fragmentShader:`uniform float time;varying vec2 vUv;varying float vS,vT;
#include <fog_pars_fragment>
`+NZ+`void main(){float sp=1.+vS*3.5;
float s=vn(vec2(vUv.x*8.,vUv.y*2.2-time*sp*1.3))*.6+vn(vec2(vUv.x*17.+3.,vUv.y*4.-time*sp*2.1))*.4;
float b=step(.45,s)+step(.68,s);vec3 col=b<.5?vec3(.12,.5,.9):(b<1.5?vec3(.45,.9,1.):vec3(1.));
float e=min(vUv.x,1.-vUv.x);float f=(1.-smoothstep(0.,.16,e))*step(.4,vn(vec2(vUv.x*20.,vUv.y*6.-time*3.)));col=mix(col,vec3(1.),f);
gl_FragColor=vec4(col,smoothstep(0.,.07,e+.02)*.92*smoothstep(0.,.05,vT));
#include <fog_fragment>
}`});
const WE=[];
for(const[a,w0,w1]of[[3.7,2.4,4.6],[4.3,2,4]]){const pts=stream(a,14.5),n=pts.length;if(n<4)continue;const pos=[],uv=[],st=[],tt=[],idx=[];let L=0;
 for(let i=0;i<n;i++){const A=pts[Math.max(0,i-1)],B=pts[Math.min(n-1,i+1)],dx=B[0]-A[0],dz=B[1]-A[1],l=Math.hypot(dx,dz)||1,sx=-dz/l,sz=dx/l,w=(w0+(w1-w0)*i/(n-1))/2,x=pts[i][0],z=pts[i][1];
  if(i)L+=Math.hypot(x-pts[i-1][0],z-pts[i-1][1]);const sl=Math.min(1,Math.hypot(TH(x+1,z)-TH(x-1,z),TH(x,z+1)-TH(x,z-1))/2.4);
  for(const s of[-1,1]){const px=x+sx*w*s,pz=z+sz*w*s;pos.push(px,TH(px,pz)+.3,pz);uv.push(s<0?0:1,L/5);st.push(sl);tt.push(i/(n-1))}
  if(i%8===0&&sl>.35||i===n-1)WE.push([x,TH(x,z),z]);
  if(i){const k=i*2;idx.push(k-2,k-1,k,k-1,k+1,k)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('steep',new THREE.Float32BufferAttribute(st,1));g.setAttribute('tt',new THREE.Float32BufferAttribute(tt,1));g.setIndex(idx);
 const m=new THREE.Mesh(g,wfMat);m.frustumCulled=false;m.userData.nofx=true;m.renderOrder=2;scene.add(m)}
