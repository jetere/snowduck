/* Snowduck - fx/slash */
// ---------- toon slash FX (port of the Godot slash shader: polar noise ring, width/length masks, sweeping arc, colour ramp)
function gtex(w,st,rep){const c=document.createElement('canvas');c.width=w;c.height=1;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,w,0);st.forEach(s=>g.addColorStop(s[0],s[1]));x.fillStyle=g;x.fillRect(0,0,w,1);const t=new THREE.CanvasTexture(c);if(rep)t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const SBN=(()=>{const W=128,c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d'),im=x.createImageData(W,W),L=[];for(let o=0;o<3;o++){const fx=2<<o,fy=10<<o,a=[];for(let i=0;i<fx*fy;i++)a.push(Math.random());L.push([fx,fy,a])}
 for(let j=0;j<W;j++)for(let i=0;i<W;i++){let v=0,w=.55;for(const[fx,fy,a]of L){const u=i/W*fx,q=j/W*fy,i0=Math.floor(u),j0=Math.floor(q),fu=S(0,1,u-i0),fq=S(0,1,q-j0),g=(m,n)=>a[(n%fy)*fx+(m%fx)];v+=w*((g(i0,j0)*(1-fu)+g(i0+1,j0)*fu)*(1-fq)+(g(i0,j0+1)*(1-fu)+g(i0+1,j0+1)*fu)*fq);w*=.5}
  const k=(j*W+i)*4;im.data[k]=im.data[k+1]=im.data[k+2]=Math.min(255,v*1.15*255);im.data[k+3]=255}
 x.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t})();
const SWM=gtex(256,[[0,'#fff'],[.14,'#fff'],[.34,'#000'],[.62,'#000'],[.82,'#fff'],[1,'#fff']]),SLM=gtex(256,[[0,'#fff'],[.2,'#000'],[.8,'#000'],[1,'#fff']],1),SHL=gtex(256,[[0,'#000'],[.44,'#000'],[.5,'#fff'],[.56,'#000'],[1,'#000']]),SRP=gtex(128,[[0,'#202020'],[.4,'#808080'],[.75,'#d8d8d8'],[1,'#fff']]);
const SLF=`varying vec2 vUv;uniform sampler2D bn,wm,lm,hl,rp;uniform float p,rot,al;uniform vec3 tint;
vec2 pol(vec2 uv,vec2 c,float z){vec2 d=uv-c;return mod(vec2(length(d)*2.*z,atan(d.y,d.x)/6.28318),1.);}
vec2 rt(vec2 uv,vec2 pv,float a){mat2 m=mat2(vec2(sin(a),-cos(a)),vec2(cos(a),sin(a)));return (uv-pv)*m+pv;}
float eio(float x){return x<.5?(1.-sqrt(1.-pow(2.*x,2.)))/2.:(sqrt(1.-pow(-2.*x+2.,2.))+1.)/2.;}
void main(){vec2 a=pol(rt(vUv,vec2(.5),rot),vec2(.5),1.);
vec4 b=texture2D(bn,a-vec2(0.,p)),w=texture2D(wm,a),l=texture2D(lm,rt(a-vec2(0.,eio(clamp(p,0.,1.))),vec2(.5),3.14159265));
vec4 pre=(b-w)-l;vec3 al3=texture2D(rp,vec2(clamp(pre.r*(.5+.5*vUv.x),0.,1.),.5)).rgb;
vec4 hi=clamp(texture2D(hl,a)-l,0.,1.);vec3 c=clamp(al3*tint*1.5+hi.rgb,0.,1.);c=floor(c*4.+.5)/4.;
float st=abs(cos(p*3.14159265));float A=clamp(step(st,pre.r)+step(clamp(st,0.,.2),hi.r*.2),0.,1.)*al;
gl_FragColor=vec4(c,A);}`;
const SLP=[],SL={acc:0},SLC={on:1,size:1,speed:1};
for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{bn:{value:SBN},wm:{value:SWM},lm:{value:SLM},hl:{value:SHL},rp:{value:SRP},p:{value:0},rot:{value:0},al:{value:1},tint:{value:new THREE.Color(1,1,1)}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:SLF}));m.visible=false;m.frustumCulled=false;m.renderOrder=5;scene.add(m);SLP.push({m,t:0,on:0})}
const SLK={jump:{d:.5,sz:9,c:[.35,.85,1],hz:1,rise:.5},flip:{d:.5,sz:7,c:[1,.55,.9],hz:0},wall:{d:.4,sz:6.5,c:[.4,1,.8],hz:0},dash:{d:.34,sz:6.5,c:[1,.62,.18],hz:1,rise:-.4},slam:{d:.85,sz:40,c:[1,.7,.2],hz:1},slam2:{d:.6,sz:24,c:[1,1,.9],hz:1,rise:.4},land:{d:.45,sz:12,c:[.7,.9,1],hz:1}};
function slash(kind,y){blast(kind,y);return;if(!SLC.on)return;const s=SLP.find(q=>!q.on)||SLP[0],k=SLK[kind];s.on=1;s.t=0;s.k=kind;s.x=P.x;s.z=P.z;s.y=(y===undefined?P.y:y)+.12;s.ry=P.face+Math.PI/2;const u=s.m.material.uniforms;u.tint.value.setRGB(k.c[0],k.c[1],k.c[2]);u.rot.value=Math.random()*6.28}
function slTick(dt){for(const s of SLP){if(!s.on)continue;s.t+=dt*SLC.speed;const k=SLK[s.k],u=s.t/k.d,m=s.m;if(u>=1){s.on=0;m.visible=false;continue}m.visible=true;
 const e=1-Math.pow(1-u,3),sc=k.sz*SLC.size*(.55+.65*e);m.scale.set(sc,sc,1);
 if(k.hz){m.rotation.set(-Math.PI/2,0,0);m.position.set(s.x,s.y+(k.rise||0)*e,s.z)}else{m.rotation.set(0,s.ry,0);m.position.set(P.x,P.y+1,P.z)}
 m.material.uniforms.p.value=u}}
