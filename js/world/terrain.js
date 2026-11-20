/* Star Hopper 64 - world/terrain */
// ---------- terrain
const tg=new THREE.PlaneGeometry(280,280,140,140);tg.rotateX(-Math.PI/2);const tp=tg.attributes.position,tc=new Float32Array(tp.count*3);
for(let i=0;i<tp.count;i++){const x=tp.getX(i),z=tp.getZ(i),y=TH(x,z);tp.setY(i,y);const sl=Math.hypot(TH(x+2,z)-y,TH(x,z+2)-y)/2,ch=((Math.floor(x/5)+Math.floor(z/5))&1)*.07,cw=1-S(15,24,Math.hypot(x,z+6));
 let c;if(y<1.3)c=[.93,.82,.52];else if(sl>.8)c=y>18?[.6,.6,.64]:[.62,.5,.38];else if(y>=26)c=[.96,.97,1];else if(cw>.7)c=[.75+ch,.7+ch,.5];else c=[.27+ch,.72+ch,.2];if(y>=1.3&&sl<=.8&&Math.hypot(x-IX,z-IZ)<30)c=[.78+ch,.55+ch,.86];tc.set(c,i*3)}
tg.setAttribute('color',new THREE.BufferAttribute(tc,3));tg.computeVertexNormals();scene.add(new THREE.Mesh(tg,new THREE.MeshToonMaterial({vertexColors:true,gradientMap:GR})));
