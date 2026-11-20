/* Snowduck - world/grass */
// ---------- stylized grass (ported from Godot grass shader): billboard tufts, noise-gradient colour, wind
const gcv=document.createElement('canvas');gcv.width=64;gcv.height=1;{const x=gcv.getContext('2d'),g=x.createLinearGradient(0,0,64,0);g.addColorStop(0,'#1f6b2a');g.addColorStop(.35,'#3fae3a');g.addColorStop(.62,'#8fd14a');g.addColorStop(.8,'#d8e04a');g.addColorStop(.92,'#ff8fb4');g.addColorStop(1,'#fff3a0');x.fillStyle=g;x.fillRect(0,0,64,1)}
const gradTex=new THREE.CanvasTexture(gcv),gl=[];
const rcv=document.createElement('canvas');rcv.width=64;rcv.height=1;{const x=rcv.getContext('2d'),g=x.createLinearGradient(0,0,64,0);g.addColorStop(0,'#11361a');g.addColorStop(.45,'#2f8a30');g.addColorStop(.8,'#7fcf45');g.addColorStop(1,'#d9f06a');x.fillStyle=g;x.fillRect(0,0,64,1)}
const rampTex=new THREE.CanvasTexture(rcv);
for(let x=-72;x<72;x+=.55)for(let z=-72;z<72;z+=.55){const px=x+(Math.sin(x*91.7+z*12.3)*43758.5%1)*.5,pz=z+(Math.sin(z*77.1+x*31.9)*24634.6%1)*.5,y=TH(px,pz);if(y<1.6||y>25)continue;if(Math.hypot(TH(px+1.5,pz)-y,TH(px,pz+1.5)-y)/1.5>.6)continue;if(1-S(15,24,Math.hypot(px,pz+6))>.45)continue;if(Math.abs(px)<2.2&&pz>6)continue;gl.push(px,y,pz)}
for(let x=IX-24;x<IX+24;x+=.55)for(let z=IZ-24;z<IZ+24;z+=.55){const px=x+(Math.sin(x*91.7+z*12.3)*43758.5%1)*.5,pz=z+(Math.sin(z*77.1+x*31.9)*24634.6%1)*.5,y=TH(px,pz);if(y<1.6||Math.hypot(px-IX,pz-IZ)>23)continue;if(Math.hypot(TH(px+1.5,pz)-y,TH(px,pz+1.5)-y)/1.5>.6)continue;gl.push(px,y,pz)}
const gq=new THREE.PlaneGeometry(1,1);gq.translate(0,.5,0);
const gm=new THREE.InstancedMesh(gq,new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{time:{value:0},grad:{value:gradTex},ramp:{value:rampTex},fogC:{value:scene.fog.color},fogN:{value:scene.fog.near},fogF:{value:scene.fog.far},wind:{value:new THREE.Vector2(1,.6)},wspd:{value:.35},wvert:{value:.3},wtile:{value:20},crad:{value:3.5},cpush:{value:1},cpos:{value:new THREE.Vector3(0,-99,0)}},
vertexShader:`uniform float time,wspd,wvert,wtile,crad,cpush;uniform vec2 wind;uniform vec3 cpos;varying vec2 vUv;varying vec3 vW;varying float vR,vD,vWn;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
void main(){vUv=uv;vec3 o=instanceMatrix[3].xyz;vR=h(o.xz);float s=.8+vR;
vec3 right=normalize(vec3(viewMatrix[0][0],0.,viewMatrix[2][0]));
vec3 wp=o+right*position.x*s*1.3+vec3(0.,position.y*s,0.);
float aff=pow(uv.y,1.6);
float ws=length(wind);vec2 wd=wind/(ws+1e-5);
float wn=vn((wp.xz/wtile+wd*time*wspd)*3.)-.5;vWn=wn;
wp+=vec3(wn*wd.x*ws*1.6,-abs(wn)*wvert*2.,wn*wd.y*ws*1.6)*aff;
wp.x+=sin(time*3.+o.x*2.)*.03*aff;
vec2 dc=o.xz-cpos.xz;float dist=length(dc);float fo=1.-smoothstep(0.,1.,dist/crad);float cv=fo*fo*(3.-2.*fo);cv*=1.-smoothstep(1.5,4.,abs(o.y-cpos.y));
wp.xz+=dc/(dist+1e-4)*cv*cpush*aff*1.4;wp.y-=cv*cpush*aff*.45;
vW=wp;vec4 mv=viewMatrix*vec4(wp,1.);vD=-mv.z;gl_Position=projectionMatrix*mv;}`,
fragmentShader:`uniform sampler2D grad,ramp;uniform vec3 fogC;uniform float fogN,fogF;varying vec2 vUv;varying vec3 vW;varying float vR,vD,vWn;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 p=vUv;float a=0.,bi=0.,bh=1.;
for(int k=0;k<5;k++){float fk=float(k);float c=.13+fk*.185+(h(vec2(fk,vR))-.5)*.1;float ht=.5+h(vec2(vR,fk+3.))*.5;float bend=(h(vec2(fk,7.+vR))-.5)*.5*p.y*p.y;float w=pow(max(1.-p.y/ht,0.),.8)*.078;if(p.y<ht&&abs(p.x-c-bend)<w){a=1.;bi=fk;bh=ht;}}
if(a<.5)discard;
float n=vn(vW.xz*.08)*.7+vn(vW.xz*.33)*.3;float t=p.y;
vec3 baseC=mix(vec3(.20,.56,.17),vec3(.24,.62,.24),n);
vec3 midC=mix(vec3(.42,.80,.20),vec3(.32,.76,.34),n);
vec3 tipC=mix(vec3(.84,.98,.34),vec3(.98,.95,.42),n);
vec3 col=mix(baseC,midC,smoothstep(.0,.5,t));col=mix(col,tipC,smoothstep(.45,.98,t));
col*=.9+.22*h(vec2(bi,vR*9.));
col+=vec3(.30,.34,.05)*pow(t,2.4)*(.55+vWn*1.4);
if(vR<.05)col=mix(col,vec3(1.,.62,.82),smoothstep(.55,.9,t));
if(vR>.95)col=mix(col,vec3(1.,.95,.55),smoothstep(.6,.95,t));
float pk=smoothstep(30.,19.,length(vW.xz-vec2(98.,92.)));col=mix(col,vec3(1.,.74,.9),pk*(.2+.5*smoothstep(.2,.9,t)));
col=mix(col,fogC,smoothstep(fogN,fogF,vD));gl_FragColor=vec4(col,1.);}`}),gl.length/3);
{const mt=new THREE.Matrix4();for(let i=0;i<gl.length/3;i++){mt.setPosition(gl[i*3],gl[i*3+1],gl[i*3+2]);gm.setMatrixAt(i,mt)}}gm.frustumCulled=false;scene.add(gm);
