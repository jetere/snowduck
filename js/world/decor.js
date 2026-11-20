/* Star Hopper 64 - world/decor */
// ---------- decorations
{const tk=new THREE.CylinderGeometry(.35,.45,2.2,6),lf=new THREE.SphereGeometry(1.7,8,6),m1=LM(0x7a4a22),m2=LM(0x2f9e2a);let n=0;
 for(let i=0;i<500&&n<90;i++){const x=Math.sin(i*12.9898)*43758.5453%1*140,z=Math.sin(i*78.233)*12345.678%1*140;if(Math.hypot(x,z)>58||(Math.abs(x)<22&&z>-24&&z<12)||Math.abs(x)<4&&z>5)continue;const y=TH(x,z);if(y<2||y>14||Math.hypot(x-CX,z-CZ)<24)continue;
  const t=new THREE.Mesh(tk,m1);t.position.set(x,y+1,z);const l=new THREE.Mesh(lf,m2);l.position.set(x,y+3.3,z);l.scale.y=1.2;scene.add(t,l);n++}}
const cloudG=new THREE.Group(),cm=new THREE.MeshBasicMaterial({color:0xb8a8e8,fog:true});
for(let i=0;i<16;i++){const g=new THREE.Group(),a=i*2.4,r=70+(i*37%130);for(let k=0;k<4;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(5+k%2*2,8,6),cm);s.position.set(k*5,k%2*1.5,0);s.scale.y=.6;g.add(s)}g.position.set(Math.cos(a)*r,55+i%4*9,Math.sin(a)*r);cloudG.add(g)}scene.add(cloudG);
