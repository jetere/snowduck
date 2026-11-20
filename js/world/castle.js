/* Star Hopper 64 - world/castle */
// ---------- solid boxes (castle, steps, floating platforms)
const BX=[];
function box(x,y,z,w,h,d,col,tex,solid=true){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv,dm=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
 for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*dm[f][0]/4,uv.getY(i)*dm[f][1]/4)}
 const m=new THREE.Mesh(g,new THREE.MeshToonMaterial({color:col,map:tex,gradientMap:GR}));m.position.set(x,y+h/2,z);scene.add(m);if(solid)BX.push({x,y,z,w,h,d})}
box(0,3,-6,16,9,10,0xf2e2b8,brick);
for(const[sx,sz]of[[-8,-1],[8,-1],[-8,-11],[8,-11]]){box(sx,3,sz,4,13,4,0xf6e9c6,brick);if(sz<-5){const c=new THREE.Mesh(new THREE.ConeGeometry(3.2,5,8),LM(0xd8332b));c.position.set(sx,18.5,sz);scene.add(c)}}
box(0,3,-.9,3.4,4.4,.4,0x6b3d1b,null,false);box(0,7.4,-.9,3.4,.3,.5,0xd8332b,null,false);
for(const wx of[-5,5])box(wx,6,-.95,1.4,2,.3,0x58b6ff,null,false);
for(let i=0;i<5;i++)box(-11.5,3,5-i*2.2,3,1.8*(i+1),2.2,0xff9d2e,checker);
const cols=[0xff9d2e,0x35c4e8,0xff5fa2,0xa5e13a],PL=[];{let a=1.2;for(let i=0;i<14;i++){const r=44-i*2.3;a+=8/r;const x=CX+Math.cos(a)*r,z=CZ+Math.sin(a)*r,top=Math.max(6+i*1.9,TH(x,z)+1.2);box(x,top-1,z,5,1,5,cols[i%4],checker);PL.push([x,top,z])}}
