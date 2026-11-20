/* Star Hopper 64 - world/sky */
// ---------- aurora sky (ported from Godot sky shader)
const skyC=document.createElement('canvas');skyC.width=512;skyC.height=256;{const x=skyC.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#070b24');g.addColorStop(.35,'#1c2260');g.addColorStop(.47,'#8a4f9c');g.addColorStop(.5,'#ffb27a');g.addColorStop(.53,'#4a3a7a');g.addColorStop(1,'#1a1840');x.fillStyle=g;x.fillRect(0,0,512,256);x.fillStyle='#fff';for(let i=0;i<260;i++){x.globalAlpha=.3+Math.random()*.7;x.fillRect(Math.random()*512,Math.random()*110,Math.random()<.2?2:1,1)}}
const skyTex=new THREE.CanvasTexture(skyC);skyTex.wrapS=THREE.RepeatWrapping;
const agc=document.createElement('canvas');agc.width=256;agc.height=1;{const x=agc.getContext('2d'),g=x.createLinearGradient(0,0,256,0);g.addColorStop(0,'#33ff88');g.addColorStop(.4,'#22ddcc');g.addColorStop(.75,'#8855ff');g.addColorStop(1,'#ff55aa');x.fillStyle=g;x.fillRect(0,0,256,1)}
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,uniforms:{eq:{value:skyTex},grad:{value:new THREE.CanvasTexture(agc)},time:{value:0},bright:{value:1.7},speed:{value:.12},height:{value:42},scale:{value:.8},fogCol:{value:scene.fog.color},fogMix:{value:0},fogH:{value:.6}},
vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:`#define PI 3.14159265
varying vec3 vD;uniform sampler2D eq,grad;uniform float time,bright,speed,height,scale;uniform vec3 fogCol;uniform float fogMix,fogH;
mat2 mm2(float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}
float tri(float x){return clamp(abs(fract(x)-.5),.01,.49);}
vec2 tri2(vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}
float tn(vec2 p,float t){float z=1.8,z2=2.5,rz=0.;p*=mm2(p.x*.06);vec2 bp=p;mat2 rot=mm2(t);
for(int i=0;i<4;i++){vec2 dg=tri2(bp*1.85)*.75;dg=dg*rot;p-=dg/z2;bp*=1.3;z2*=.45;z*=.42;p*=1.21+(rz-1.)*.02;rz+=tri(p.x+tri(p.y))*z;p*=mat2(-.95534,-.29552,.29552,-.95534);}
return clamp(1./pow(rz*29.,1.3),0.,.55);}
vec4 aur(vec3 d){vec4 color=vec4(0.),avg=vec4(0.);float jit=fract(sin(dot(d.xz,vec2(13.,78.))));float js=height/18.;
for(int i=0;i<18;i++){float ds=(float(i)+jit)*js;float depth=(scale+pow(ds,1.4)*.002)/(d.y*2.+.4);vec3 pos=depth*d;float n=tn(pos.zx,time*speed);vec4 col=vec4(0.);col.a=n;float w=exp2(-ds*.065-2.5)*smoothstep(0.,5.,ds);col.rgb=texture2D(grad,vec2(ds/height,.5)).rgb*n;avg=mix(avg,col,.5);color+=avg*w*js;}
color*=clamp(d.y*15.+.4,0.,1.);color*=bright;return color;}
void main(){vec3 d=normalize(vD);float u=atan(d.x,d.z)/(2.*PI)+.5;float v=asin(clamp(d.y,-1.,1.))/PI+.5;vec3 sky=texture2D(eq,vec2(u,v)).rgb;
if(d.y>-.1){vec4 a=aur(d);sky=mix(sky,a.rgb,clamp(a.a,0.,1.));}
sky=mix(sky,fogCol,fogMix*(1.-smoothstep(0.,fogH,d.y)));gl_FragColor=vec4(sky,1.);}`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(400,32,16),skyMat);sky.renderOrder=-10;sky.frustumCulled=false;scene.add(sky);
