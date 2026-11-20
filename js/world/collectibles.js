/* Star Hopper 64 - world/collectibles */
// ---------- collectibles
const coins=[],cg=new THREE.CylinderGeometry(.45,.45,.12,12).rotateX(Math.PI/2),cy=LM(0xffd21f),cr=LM(0xff2a2a);cy.emissive=new THREE.Color(0x7a5a00);cr.emissive=new THREE.Color(0x7a0000);
function coin(x,y,z,red){const m=new THREE.Mesh(cg,red?cr:cy);m.position.set(x,y,z);if(red)m.scale.setScalar(1.5);scene.add(m);coins.push({m,red})}
const G=(x,z,o=1.3)=>TH(x,z)+o;
for(let i=0;i<10;i++)coin(0,G(0,36-i*3),36-i*3);
for(const[x,z]of[[25,20],[-25,15],[20,-30],[38,-5],[-42,-5],[10,50],[-12,32]]){const y=G(x,z);if(y>2)for(let k=0;k<8;k++)coin(x+Math.cos(k*.785)*3.2,y,z+Math.sin(k*.785)*3.2)}
for(let i=0;i<5;i++)coin(-11.5,3+1.8*(i+1)+1.4,5-i*2.2);PL.forEach(p=>coin(p[0],p[1]+1.4,p[2]));
[[0,13.5,-6],[8,17.4,-1],[-8,17.4,-1],[PL[5][0],PL[5][1]+4,PL[5][2]],[PL[10][0],PL[10][1]+4,PL[10][2]],[38,G(38,26),26],[-44,G(-44,8),8],[44,G(44,-28),-28]].forEach(p=>coin(p[0],p[1],p[2],true));
const ss=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?.5:1.2;ss[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}
const sg=new THREE.ExtrudeGeometry(ss,{depth:.45,bevelEnabled:false});sg.translate(0,0,-.22);const sm=LM(0xffd21f);sm.emissive=new THREE.Color(0x8a6400);
const stars=[];function star(x,y,z,on){const m=new THREE.Mesh(sg,sm);m.scale.setScalar(1.4);m.position.set(x,y,z);for(const e of[-.25,.25]){const k=new THREE.Mesh(new THREE.BoxGeometry(.12,.3,.1),LM(0x111111));k.position.set(e,.1,.3);m.add(k)}m.visible=on;scene.add(m);stars.push({m,on,y})}
star(CX,TH(CX,CZ)+2.4,CZ,true);star(0,TH(0,18)+2.2,18,false);
