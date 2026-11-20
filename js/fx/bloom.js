/* Star Hopper 64 - fx/bloom */
// ---------- bloom: bright-pass -> 4 blurred mip levels -> screen-blended in the post shader
const bzVS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
 bzTh={value:.62},bzTex={value:null},bzTx={value:new THREE.Vector2()},bzDir={value:new THREE.Vector2()};
const bzMat=(fs)=>new THREE.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{t:bzTex,tx:bzTx,dir:bzDir,th:bzTh},vertexShader:bzVS,fragmentShader:fs});
const bzBright=bzMat(`varying vec2 vUv;uniform sampler2D t;uniform vec2 tx;uniform float th;
vec3 s(vec2 u){vec3 c=texture2D(t,u).rgb;float l=max(c.r,max(c.g,c.b));return c*smoothstep(th,th+.3,l);}
void main(){vec3 c=s(vUv)*.4+(s(vUv+tx*.5)+s(vUv-tx*.5)+s(vUv+vec2(tx.x,-tx.y)*.5)+s(vUv+vec2(-tx.x,tx.y)*.5))*.15;gl_FragColor=vec4(c,1.);}`),
 bzDown=bzMat(`varying vec2 vUv;uniform sampler2D t;uniform vec2 tx;
void main(){vec3 c=(texture2D(t,vUv+tx*.5).rgb+texture2D(t,vUv-tx*.5).rgb+texture2D(t,vUv+vec2(tx.x,-tx.y)*.5).rgb+texture2D(t,vUv+vec2(-tx.x,tx.y)*.5).rgb)*.25;gl_FragColor=vec4(c,1.);}`),
 bzBlur=bzMat(`varying vec2 vUv;uniform sampler2D t;uniform vec2 dir;
void main(){vec3 c=texture2D(t,vUv).rgb*.227027;c+=(texture2D(t,vUv+dir*1.3846).rgb+texture2D(t,vUv-dir*1.3846).rgb)*.316216;c+=(texture2D(t,vUv+dir*3.2308).rgb+texture2D(t,vUv-dir*3.2308).rgb)*.07027;gl_FragColor=vec4(c,1.);}`);
const bzScene=new THREE.Scene(),bzQ=new THREE.Mesh(new THREE.PlaneGeometry(2,2),bzBright);bzQ.frustumCulled=false;bzScene.add(bzQ);
const bzA=[],bzB=[],bzW=[],bzH=[],bzN=4;
const bzRT=(w,h)=>new THREE.WebGLRenderTarget(w,h,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false});
function bzSize(){const w=innerWidth*PR,h=innerHeight*PR;for(let i=0;i<bzN;i++){const sw=Math.max(2,Math.round(w/2**(i+1))),sh=Math.max(2,Math.round(h/2**(i+1)));bzW[i]=sw;bzH[i]=sh;if(bzA[i]){bzA[i].setSize(sw,sh);bzB[i].setSize(sw,sh)}else{bzA[i]=bzRT(sw,sh);bzB[i]=bzRT(sw,sh)}}
 post.uniforms.b0.value=bzA[0].texture;post.uniforms.b1.value=bzA[1].texture;post.uniforms.b2.value=bzA[2].texture;post.uniforms.b3.value=bzA[3].texture}
bzSize();
function bzPass(mat,srcTex,dst,tw,th2,dx,dy){mat.uniformsNeedUpdate=true;bzQ.material=mat;bzTex.value=srcTex;bzTx.value.set(1/tw,1/th2);bzDir.value.set(dx,dy);renderer.setRenderTarget(dst);renderer.render(bzScene,pCam)}
function bzRun(){if(post.uniforms.bI.value<=0)return;const w=innerWidth*PR,h=innerHeight*PR;
 bzPass(bzBright,rt.texture,bzA[0],w,h,0,0);
 for(let i=0;i<bzN;i++){if(i>0)bzPass(bzDown,bzA[i-1].texture,bzA[i],bzW[i-1],bzH[i-1],0,0);
  bzPass(bzBlur,bzA[i].texture,bzB[i],bzW[i],bzH[i],1/bzW[i],0);bzPass(bzBlur,bzB[i].texture,bzA[i],bzW[i],bzH[i],0,1/bzH[i])}}
