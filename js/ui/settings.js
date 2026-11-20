/* Star Hopper 64 - ui/settings */
// ---------- shader control panel (⚙ button or P key)
const SU=post.uniforms,SK=skyMat.uniforms,GU=gm.material.uniforms,CFG={impact:.05,windStr:1,windDir:.5,wobble:1,wobBase:0};
const CT=[['Wobble & squiggle',[['Strength',0,12,.05,SU.str],['FPS',1,24,1,SU.fps],['Noise scale',4,60,1,SU.sc],['Impact wobble',0,3,.05,CFG,'wobble'],['Constant screen wobble',0,2,.02,CFG,'wobBase']]],
['Look',[['Bloom intensity',0,2,.02,SU.bI],['Bloom threshold',.2,1,.01,bzTh],['Glow particles',0,3,.05,ffU.gain],['Outlines',0,1,.01,SU.edge],['Saturation',0,2,.01,SU.sat],['Vignette',0,1,.01,SU.vig],['Chromatic aberration',0,.01,.0002,SU.ca0],['Impact strength',0,2,.05,CFG,'impact']]],
['Aurora sky',[['Brightness',0,4,.05,SK.bright],['Speed',0,.6,.01,SK.speed],['Height',10,80,1,SK.height],['Scale',.2,2,.05,SK.scale]]],
['Grass',[['Wind strength',0,3,.05,CFG,'windStr'],['Wind direction',0,6.28,.05,CFG,'windDir'],['Wind speed',0,2,.05,GU.wspd],['Wind vertical',0,1,.02,GU.wvert],['Wind tile size',5,60,1,GU.wtile],['Push radius',0,8,.1,GU.crad],['Push strength',0,3,.05,GU.cpush]]]];
CT.unshift(
['Movement',[['Run speed',3,25,.5,MV,'run'],['Sprint multiplier (hold X)',1,2.5,.05,MV,'sprint'],['Ground accel',2,40,.5,MV,'accel'],['Ground friction',2,40,.5,MV,'friction'],['Air control',0,15,.1,MV,'air'],['Turn speed',2,40,.5,MV,'turn'],['Gravity',10,90,1,MV,'grav'],['Max fall speed',15,90,1,MV,'term'],['Walk animation speed',.2,3,.05,MV,'animSpd'],['Sync animation to speed (0/1)',0,1,1,MV,'animSync']]],
['Jumps',[['Jump 1',6,30,.5,MV,'j1'],['Jump 2',6,30,.5,MV,'j2'],['Triple jump',6,34,.5,MV,'j3'],['Triple window (s)',.1,.8,.02,MV,'chain'],['Coyote time (s)',0,.3,.01,MV,'coyote'],['Jump buffer (s)',0,.4,.01,MV,'buffer'],['Variable height (0/1)',0,1,1,MV,'varJump'],['Air jumps',0,3,1,MV,'airJumps'],['Flutter glide (0/1)',0,1,1,MV,'glide'],['Glide fall speed',.5,12,.1,MV,'glideFall']]],
['Special moves',[['Long jump speed',8,35,.5,MV,'ljS'],['Long jump height',4,20,.5,MV,'ljV'],['Backflip height',8,30,.5,MV,'bfH'],['Wall kick height',6,30,.5,MV,'wkV'],['Wall kick push',3,20,.5,MV,'wkS'],['Wall kick window',.05,.5,.01,MV,'wkWin'],['Pound speed',15,80,1,MV,'pound'],['Pound wind-up',0,.8,.02,MV,'poundWind']]],
['Camera',[['Distance',3,20,.5,CC,'dist'],['Height',0,4,.1,CC,'height'],['Base FOV',40,90,1,CC,'fov'],['Speed FOV boost',0,40,1,CC,'fovSpeed'],['Look-ahead',0,3,.05,CC,'ahead'],['Follow lag',2,25,.5,CC,'lagXZ'],['Vertical lag',1,15,.5,CC,'lagY'],['Zoom smoothing',1,20,.5,CC,'zoomLag'],['Banking',0,3,.05,CC,'bank'],['Shake',0,2,.05,CC,'shake'],['Mouse sensitivity',.2,3,.05,CC,'sens'],['Invert Y (0/1)',0,1,1,CC,'invY'],['Q/E turn speed',.5,5,.1,CC,'keyRot'],['Auto-recenter',0,2,.05,CC,'recenter']]],
['Cinematics',[['Event shots (0/1)',0,1,1,CC,'shots'],['Slow-mo (0/1)',0,1,1,CC,'slowmo'],['Letterbox (0/1)',0,1,1,CC,'bars'],['Idle orbit (0/1)',0,1,1,CC,'idle'],['Idle delay (s)',2,30,1,CC,'idleDelay']]],
['Audio',[['Master',0,1,.01,AU,'master'],['Effects',0,1.5,.01,AU,'sfx'],['Music',0,1,.01,AU,'music'],['Music on (0/1)',0,1,1,AU,'musicOn'],['Ambient wind',0,1,.01,AU,'ambient'],['Reverb',0,1,.01,AU,'reverb']]]);
const MP={Default:{},Snappy:{accel:18,friction:20,air:6,grav:46,j1:14,j2:16.5,j3:21,turn:22},Floaty:{grav:26,air:6,j1:12,j2:14,j3:18,glideFall:2,airJumps:1},Heavy:{run:8,accel:7,friction:9,air:2,grav:50,j1:15,j2:17,j3:22}};
const hemi=scene.children.find(o=>o.isHemisphereLight);
const FG={get near(){return scene.fog.near},set near(v){scene.fog.near=v;GU.fogN.value=v},get far(){return scene.fog.far},set far(v){scene.fog.far=v;GU.fogF.value=v},
 get r(){return scene.fog.color.r},set r(v){scene.fog.color.r=v},get g(){return scene.fog.color.g},set g(v){scene.fog.color.g=v},get b(){return scene.fog.color.b},set b(v){scene.fog.color.b=v}};
CT.splice(CT.findIndex(c=>c[0]==='Audio')+1,0,['Fog & light',[['Fog start',0,200,1,FG,'near'],['Fog end',10,400,1,FG,'far'],['Fog red',0,1,.01,FG,'r'],['Fog green',0,1,.01,FG,'g'],['Fog blue',0,1,.01,FG,'b'],['Sky fog blend',0,1,.01,SK.fogMix],['Sky fog height',.1,2,.05,SK.fogH],['Ambient light',0,2,.01,hemi,'intensity'],['Sun light',0,2,.01,dl,'intensity']]]);
const FZ={Default:{near:90,far:300,r:.49,g:.416,b:.659,mix:0,h:.6,hemi:.95,sun:1,sat:1.4,vig:1,edge:1,str:.24},
 'Silent Hill':{near:2,far:48,r:.72,g:.72,b:.69,mix:1,h:1.6,hemi:.7,sun:.45,sat:.3,vig:.8,edge:.2,str:1.6},
 Dense:{near:0,far:26,r:.62,g:.64,b:.68,mix:1,h:1.2,hemi:.85,sun:.7,sat:.7,vig:.6,edge:.25,str:1},
 Haze:{near:30,far:140,r:.78,g:.8,b:.86,mix:.6,h:.9,hemi:1,sun:1,sat:1,vig:.4,edge:.3,str:1}};
function setFog(n){const p=FZ[n];FG.near=p.near;FG.far=p.far;FG.r=p.r;FG.g=p.g;FG.b=p.b;SK.fogMix.value=p.mix;SK.fogH.value=p.h;hemi.intensity=p.hemi;dl.intensity=p.sun;SU.sat.value=p.sat;SU.vig.value=p.vig;SU.edge.value=p.edge;SU.str.value=p.str;cpSync()}
let fogOn=false;function toggleFog(){fogOn=!fogOn;setFog(fogOn?'Silent Hill':'Default');banner(fogOn?'🌫 Silent Hill fog':'Fog off');SFX.ui()}
CT.push(['Ambient occlusion',[['Strength',0,1.5,.01,SU.aoS],['Radius (world units)',.3,4,.05,SU.aoR]]],
['Ghost trail',[['Enabled (0/1)',0,1,1,TR,'on'],['Gain',0,100,1,TR,'gain'],['Length',.01,.99,.01,TR,'len'],['Glow red',0,1,.01,TR,'r'],['Glow green',0,1,.01,TR,'g'],['Glow blue',0,1,.01,TR,'b']]],
['Smoke',[['Enabled (0/1)',0,1,1,SMK,'on'],['Amount',0,3,.05,SMK,'count'],['Size',.3,3,.05,SMK,'size'],['Lifetime',.3,3,.05,SMK,'life'],['Opacity',0,1.5,.02,SMK,'alpha'],['Voronoi scale',1,10,.1,SMK,'vs'],['Voronoi speed',0,4,.05,SMK,'vsp'],['Emission',0,3,.05,SMK,'emis'],['Fire gradient',0,1,.01,SMK,'heat'],['Red',0,1,.01,SMK,'r'],['Green',0,1,.01,SMK,'g'],['Blue',0,1,.01,SMK,'b']]],
['Impact bubble',[['Enabled (0/1)',0,1,1,BLC,'on'],['Size',.3,2.5,.05,BLC,'size'],['Duration',.4,3,.05,BLC,'dur'],['Screen distortion',0,2,.02,BLC,'distort'],['Rim glow',0,3,.05,BLC,'glow'],['Rim width',1,10,.1,BLC,'width'],['Noise scale',1,8,.1,BLC,'ns'],['Ripple',0,1,1,BLC,'ripple'],['Glow red',0,1,.01,BLC,'r'],['Glow green',0,1,.01,BLC,'g'],['Glow blue',0,1,.01,BLC,'b']]]);
const cpCss=document.createElement('style');cpCss.textContent='#cp label{display:block;margin:5px 0}#cp input[type=range]{width:100%}#cp .ch{margin-top:10px;color:#ffe14d;font-weight:900}#cp button{margin:4px 4px 0 0;padding:5px 9px;border-radius:8px;border:1px solid #ffe14d;background:#1b2f66;color:#fff;font:inherit;cursor:pointer}#cp span{float:right;opacity:.8}';document.head.appendChild(cpCss);
const cp=document.createElement('div');cp.id='cp';cp.style.cssText='display:none;position:fixed;right:14px;top:64px;width:290px;max-height:calc(100% - 80px);overflow:auto;background:rgba(10,20,50,.88);color:#fff;padding:10px 12px;border-radius:12px;border:2px solid #ffe14d;font:12px Trebuchet MS,sans-serif;z-index:30;touch-action:pan-y';
const cpAll=[];function applyWind(){GU.wind.value.set(Math.cos(CFG.windDir),Math.sin(CFG.windDir)).multiplyScalar(CFG.windStr);applyAudio()}
cp.innerHTML='<b style="font-size:15px">🎛 Game settings</b> <span>P to hide · click titles to fold</span>';
for(const[title,rows]of CT){const h=document.createElement('div');h.className='ch';h.textContent=title;h.style.cursor='pointer';const wr=document.createElement('div');cp.append(h,wr);if(/Aurora|Grass|Ambient|Ghost|Smoke|Impact/.test(title))wr.style.display='none';h.onclick=()=>wr.style.display=wr.style.display==='none'?'':'none';
 for(const[lb,mn,mx,st,o,k='value']of rows){const r=document.createElement('label'),v=document.createElement('span'),i=document.createElement('input');i.type='range';i.min=mn;i.max=mx;i.step=st;i.value=o[k];
  const show=()=>v.textContent=(+o[k]).toFixed(st<.001?4:st<.1?2:st<1?2:0);show();
  i.addEventListener('input',()=>{o[k]=+i.value;show();applyWind();cpSave()});i.addEventListener('change',()=>i.blur());
  r.append(lb+' ',v,i);wr.appendChild(r);cpAll.push({o,k,i,show,d:o[k],key:title+'|'+lb})}}
function cpSync(){for(const c of cpAll){c.i.value=c.o[c.k];c.show()}applyWind()}
const H2=document.createElement('div');H2.className='ch';H2.textContent='Toggles & presets';cp.appendChild(H2);
for(const[lb,fn]of[['Shadows',()=>dl.castShadow=!dl.castShadow],['Grass',()=>gm.visible=!gm.visible],['Clouds',()=>cloudG.visible=!cloudG.visible]]){const b=document.createElement('button');b.textContent=lb;b.onclick=fn;cp.appendChild(b)}
cp.appendChild(document.createElement('br'));
const PS={Default:{},Clean:{str:0,edge:0,vig:.3,imp:.4},Cartoon:{str:1.8,fps:8,edge:.7,sat:1.35,imp:1.3}},PK={str:[SU.str,'value'],fps:[SU.fps,'value'],edge:[SU.edge,'value'],sat:[SU.sat,'value'],vig:[SU.vig,'value'],imp:[CFG,'impact']};
for(const n in PS){const b=document.createElement('button');b.textContent=n;b.onclick=()=>{for(const c of cpAll)c.o[c.k]=c.d;for(const q in PS[n])PK[q][0][PK[q][1]]=PS[n][q];cpSync();cpSave()};cp.appendChild(b)}
for(const n in FZ){const b=document.createElement('button');b.textContent='Fog: '+n;b.onclick=()=>setFog(n);cp.appendChild(b)}
for(const n in MP){const b=document.createElement('button');b.textContent='Move: '+n;b.onclick=()=>{Object.assign(MV,MD,MP[n]);cpSync();cpSave()};cp.appendChild(b)}
cp.addEventListener('keydown',e=>e.stopPropagation());cp.addEventListener('keyup',e=>e.stopPropagation());document.body.appendChild(cp);applyWind();
const CPK='starhopper64.settings.v4';let cpLoaded=false;
function cpSave(){if(!cpLoaded)return;try{const d={};for(const c of cpAll)if(!c.key.startsWith('Fog & light'))d[c.key]=+c.o[c.k];localStorage.setItem(CPK,JSON.stringify(d))}catch(e){}}
try{const d=JSON.parse(localStorage.getItem(CPK)||'null');if(d)for(const c of cpAll)if(c.key in d&&isFinite(d[c.key]))c.o[c.k]=d[c.key]}catch(e){}
cpLoaded=true;cpSync();
{const b=document.createElement('button');b.textContent='Reset saved settings';b.onclick=()=>{try{localStorage.removeItem(CPK)}catch(e){}for(const c of cpAll)c.o[c.k]=c.d;cpSync()};cp.appendChild(b)}
const gear=document.createElement('div');gear.textContent='⚙';gear.style.cssText='position:fixed;right:14px;top:calc(env(safe-area-inset-top,0px) + 10px);width:44px;height:44px;border-radius:50%;background:rgba(10,20,50,.75);border:2px solid #ffe14d;color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:30';document.body.appendChild(gear);
const dbtn=document.createElement('div');dbtn.textContent='🎬';dbtn.title='Director camera (V)';dbtn.style.cssText='position:fixed;right:66px;top:calc(env(safe-area-inset-top,0px) + 10px);width:44px;height:44px;border-radius:50%;background:rgba(10,20,50,.75);border:2px solid #ffe14d;font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:30';document.body.appendChild(dbtn);dbtn.addEventListener('click',()=>{if(started)toggleDir()});dbtn.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true});
function togglePanel(){const on=cp.style.display==='none';cp.style.display=on?'block':'none';if(on&&document.exitPointerLock)document.exitPointerLock()}
gear.addEventListener('click',togglePanel);addEventListener('keydown',e=>{if(e.code==='KeyP'&&!e.repeat)togglePanel()});
