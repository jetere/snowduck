/* Star Hopper 64 - core/scene */
// ---------- renderer & scene
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.domElement.id='game';document.body.prepend(renderer.domElement);
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.3,600);
const gc=document.createElement('canvas');gc.width=2;gc.height=256;{const x=gc.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#2f86e8');g.addColorStop(.7,'#9fd8ff');g.addColorStop(1,'#d6f1ff');x.fillStyle=g;x.fillRect(0,0,2,256)}
scene.fog=new THREE.Fog(0x7d6aa8,90,300);
scene.add(new THREE.HemisphereLight(0xd4d8ff,0x5a7a60,.95));const dl=new THREE.DirectionalLight(0xffe4c4,1.0);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);Object.assign(dl.shadow.camera,{left:-60,right:60,top:60,bottom:-60,near:1,far:260});dl.shadow.bias=-.0006;dl.shadow.normalBias=.4;scene.add(dl,dl.target);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const GR=new THREE.DataTexture(new Uint8Array([120,160,200,230,255]),5,1,THREE.LuminanceFormat);GR.minFilter=GR.magFilter=THREE.NearestFilter;GR.generateMipmaps=false;GR.needsUpdate=true;
const LM=c=>new THREE.MeshToonMaterial({color:c,gradientMap:GR});
function mkTex(fn,rep){const c=document.createElement('canvas');c.width=c.height=8;const x=c.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=fn(i,j);x.fillRect(i,j,1,1)}const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const checker=mkTex((i,j)=>((i>>2)+(j>>2))&1?'#fff':'#dcdcdc'),brick=mkTex((i,j)=>(j%4===0||(i+(j>>2)*4)%8===0)?'#bbb':'#f4f4f4');
