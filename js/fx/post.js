/* Star Hopper 64 - fx/post */
// ---------- post-processing: squiggle shader (ported from Godot) + ink outlines + impact FX
const SQ={scale:35,strength:10,fps:12},PR=Math.min(devicePixelRatio,2);
const rt=new THREE.WebGLRenderTarget(innerWidth*PR,innerHeight*PR,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthTexture:new THREE.DepthTexture(innerWidth*PR,innerHeight*PR,THREE.UnsignedIntType)});
const nd=new Uint8Array(32*32*4);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*255;
const nz=new THREE.DataTexture(nd,32,32,THREE.RGBAFormat);nz.wrapS=nz.wrapT=THREE.RepeatWrapping;nz.magFilter=nz.minFilter=THREE.LinearFilter;nz.needsUpdate=true;
const post=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{tC:{value:rt.texture},tD:{value:rt.depthTexture},noise:{value:nz},res:{value:new THREE.Vector2(innerWidth*PR,innerHeight*PR)},nf:{value:new THREE.Vector2(.3,600)},ctr:{value:new THREE.Vector2(.5,.5)},time:{value:0},fps:{value:SQ.fps},str:{value:SQ.strength},sc:{value:SQ.scale},imp:{value:0},shk:{value:0},wob:{value:0},flash:{value:0},edge:{value:1},sat:{value:1.4},vig:{value:1},ca0:{value:.01},aoS:{value:.55},aoR:{value:1.7},pM:{value:cam.projectionMatrix},ipM:{value:cam.projectionMatrixInverse},bI:{value:.06},b0:{value:null},b1:{value:null},b2:{value:null},b3:{value:null},lens:{value:[new THREE.Vector4(),new THREE.Vector4(),new THREE.Vector4(),new THREE.Vector4()]}},
vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
fragmentShader:`varying vec2 vUv;uniform sampler2D tC,tD,noise;uniform vec2 res,ctr,nf;uniform float time,fps,str,sc,imp,shk,wob,flash,edge,sat,vig,ca0,aoS,aoR;uniform mat4 pM,ipM;uniform vec4 lens[4];uniform sampler2D b0,b1,b2,b3;uniform float bI;
float iz(vec2 u){float z=texture2D(tD,u).r*2.-1.;return (nf.y+nf.x-z*(nf.y-nf.x))/(2.*nf.x*nf.y);}
vec3 vp(vec2 u){vec4 v=ipM*vec4(u*2.-1.,texture2D(tD,u).r*2.-1.,1.);return v.xyz/v.w;}
void main(){vec2 uv=vUv;
for(int i=0;i<4;i++){vec4 L=lens[i];if(L.z>0.){vec2 dd=uv-L.xy;dd.x*=res.x/res.y;float rr=length(dd)/L.z;if(rr<1.){float k=rr*(1.-rr)*4.;uv-=normalize(dd+1e-5)*vec2(res.y/res.x,1.)*L.w*k*L.z*.5;}}}
vec2 off=vec2(floor(time*fps))*vec2(3.14159265,2.71828183);
float a=texture2D(noise,uv*res/(32.*sc)+off).r*12.56637;
uv+=vec2(cos(a),sin(a))*str*.005;
uv+=wob*.012*vec2(sin(uv.y*22.+time*16.),cos(uv.x*18.+time*13.));
vec2 d=uv-ctr;d.x*=res.x/res.y;float r=length(d);float ring=exp(-pow((r-shk)*12.,2.))*imp;
uv+=normalize(d+1e-5)*vec2(res.y/res.x,1.)*ring*.05;
float ca=ca0+imp*.008+ring*.01;vec2 cd=(uv-.5)*ca*2.;
vec3 col=vec3(texture2D(tC,uv+cd).r,texture2D(tC,uv).g,texture2D(tC,uv-cd).b);
float d0=1./iz(uv),ao=0.,hn=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453),rp=clamp(aoR/(d0*1.15),.002,.09);
vec3 P0=vp(uv),pr=vp(uv+vec2(1.5/res.x,0.)),pl=vp(uv-vec2(1.5/res.x,0.)),pu=vp(uv+vec2(0.,1.5/res.y)),pd=vp(uv-vec2(0.,1.5/res.y));
vec3 dxv=abs(pr.z-P0.z)<abs(P0.z-pl.z)?pr-P0:P0-pl,dyv=abs(pu.z-P0.z)<abs(P0.z-pd.z)?pu-P0:P0-pd,Nn=normalize(cross(dxv,dyv)+vec3(1e-7));if(dot(Nn,P0)>0.)Nn=-Nn;
vec3 Tt=normalize(abs(Nn.y)<.9?cross(Nn,vec3(0.,1.,0.)):cross(Nn,vec3(1.,0.,0.))),Bb=cross(Nn,Tt);
for(int i=0;i<12;i++){float fi=float(i),an=fi*2.3999+hn*.8,el=.3+.65*fract(fi*.618),sc=aoR*(.25+.75*fract(fi*.381+.13));vec3 sp=P0+((Tt*cos(an)+Bb*sin(an))*sqrt(1.-el*el)+Nn*el)*sc;vec4 q=pM*vec4(sp,1.);float sz=vp(q.xy/q.w*.5+.5).z;ao+=step(.03-sp.z*.004,sz-sp.z)*smoothstep(aoR*2.,aoR*.6,abs(P0.z-sz));}
if(!(ao>=0.))ao=0.;
col=mix(col,col*vec3(.4,.38,.6),clamp(ao/12.*aoS*2.,0.,1.)*smoothstep(.004,.02,iz(uv))*(1.-smoothstep(80.,260.,-P0.z)));
vec2 px=1.4/res;float ic=iz(uv);float lap=abs(iz(uv+vec2(px.x,0.))+iz(uv-vec2(px.x,0.))+iz(uv+vec2(0.,px.y))+iz(uv-vec2(0.,px.y))-4.*ic);
float e=smoothstep(.15,.4,lap/(ic+1e-4))*smoothstep(.004,.02,ic);
col=mix(col,vec3(.07,.05,.18),e*edge);
vec3 bl=texture2D(b0,uv).rgb*.45+texture2D(b1,uv).rgb*.65+texture2D(b2,uv).rgb*.85+texture2D(b3,uv).rgb*1.1;col=1.-(1.-clamp(col,0.,1.))*(1.-clamp(bl*bI,0.,1.));
float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,sat);col=(col-.5)*1.06+.5;
col*=1.-smoothstep(.45,.95,length(vUv-.5))*vig;col+=flash*vec3(1.,.95,.7);
gl_FragColor=vec4(col,1.);}`});
const pScene=new THREE.Scene(),pCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1),pq=new THREE.Mesh(new THREE.PlaneGeometry(2,2),post);pq.frustumCulled=false;pScene.add(pq);
