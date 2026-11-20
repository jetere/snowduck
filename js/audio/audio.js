/* Star Hopper 64 - audio/audio */
// ---------- audio engine (synthesized: FM bells, noise whooshes, reverb, compressor, wind + generative music)
const AU={master:.8,sfx:1,music:.45,ambient:.5,reverb:.3,musicOn:1,mute:0};
let actx,mG,sG,musG,ambG,rvG,nbuf;
function audioInit(){if(actx){actx.resume();return}
 actx=new(window.AudioContext||window.webkitAudioContext)();
 const comp=actx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=5;
 mG=actx.createGain();sG=actx.createGain();musG=actx.createGain();ambG=actx.createGain();rvG=actx.createGain();
 const cv=actx.createConvolver(),n=actx.sampleRate*1.9|0,ib=actx.createBuffer(2,n,actx.sampleRate);
 for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3)}
 cv.buffer=ib;
 sG.connect(mG);sG.connect(rvG);musG.connect(mG);musG.connect(rvG);ambG.connect(mG);rvG.connect(cv);cv.connect(mG);mG.connect(comp);comp.connect(actx.destination);
 nbuf=actx.createBuffer(1,actx.sampleRate*2,actx.sampleRate);{const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 const ws=actx.createBufferSource(),wf=actx.createBiquadFilter(),lfo=actx.createOscillator(),lg=actx.createGain();
 ws.buffer=nbuf;ws.loop=true;wf.type='bandpass';wf.frequency.value=450;wf.Q.value=.7;lfo.frequency.value=.11;lg.gain.value=220;
 lfo.connect(lg);lg.connect(wf.frequency);ws.connect(wf);wf.connect(ambG);ws.start();lfo.start();
 applyAudio();setInterval(musTick,230)}
function applyAudio(){if(!actx)return;mG.gain.value=AU.mute?0:AU.master;sG.gain.value=AU.sfx;musG.gain.value=AU.musicOn?AU.music:0;ambG.gain.value=AU.ambient*.18;rvG.gain.value=AU.reverb}
function tn(f,d,o={}){if(!actx)return;const{type='sine',vol:v=.25,slide:sl=0,at=0,att=.006,fm=0,fr=2,dest=sG}=o,t0=actx.currentTime+at,os=actx.createOscillator(),g=actx.createGain();
 os.type=type;os.frequency.setValueAtTime(f,t0);if(sl)os.frequency.exponentialRampToValueAtTime(Math.max(20,f*sl),t0+d);
 if(fm){const m=actx.createOscillator(),mg=actx.createGain();m.frequency.value=f*fr;mg.gain.setValueAtTime(fm*f,t0);mg.gain.exponentialRampToValueAtTime(.01,t0+d);m.connect(mg);mg.connect(os.frequency);m.start(t0);m.stop(t0+d+.05)}
 g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(v,t0+att);g.gain.exponentialRampToValueAtTime(.0001,t0+d);os.connect(g);g.connect(dest);os.start(t0);os.stop(t0+d+.05)}
function ns(d,o={}){if(!actx)return;const{f=1000,q=1,type='lowpass',vol:v=.2,at=0,sw=1,att=.004,dest=sG}=o,t0=actx.currentTime+at,s=actx.createBufferSource(),fl=actx.createBiquadFilter(),g=actx.createGain();
 s.buffer=nbuf;s.playbackRate.value=.8+Math.random()*.4;fl.type=type;fl.Q.value=q;fl.frequency.setValueAtTime(f,t0);if(sw!==1)fl.frequency.exponentialRampToValueAtTime(Math.max(30,f*sw),t0+d);
 g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(v,t0+att);g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(fl);fl.connect(g);g.connect(dest);s.start(t0,Math.random());s.stop(t0+d+.05)}
const hz=(f,s)=>f*Math.pow(1.0595,s);
const SFX={
 jump(c,k){const b=[392,466,587][c];
  if(k===1){tn(300,.28,{type:'sawtooth',vol:.1,slide:2.6});ns(.3,{f:1200,type:'bandpass',vol:.12,sw:3})}
  else if(k===2){tn(260,.3,{type:'triangle',vol:.2,slide:3});tn(520,.25,{vol:.1,slide:2.4,at:.03})}
  else{tn(b,.17,{type:'square',vol:.07,slide:1.9});tn(b*2,.12,{vol:.12,slide:1.6,fm:.4})}
  if(c===2&&!k)[0,4,7,12].forEach((s,i)=>tn(hz(784,s),.3,{vol:.1,at:.05+i*.05,fm:.3}));ns(.08,{f:3000,type:'highpass',vol:.05})},
 air(){tn(500,.14,{vol:.12,slide:2,fm:.3});tn(750,.16,{vol:.1,slide:2,at:.06})},
 wall(){tn(220,.1,{type:'square',vol:.1,slide:.5});tn(880,.18,{vol:.14,slide:1.5,at:.02,fm:.5});ns(.1,{f:2500,type:'highpass',vol:.1})},
 land(v){if(v<5)return;const a=Math.min(1,v/30);ns(.12+a*.1,{f:500+a*300,vol:.1+a*.25,sw:.3});tn(130,.15,{vol:.1+a*.3,slide:.4})},
 pound(){tn(95,.55,{vol:.55,slide:.25});tn(48,.7,{type:'sawtooth',vol:.25,slide:.6});ns(.6,{f:1800,vol:.4,sw:.08});[0,7,12].forEach(s=>tn(hz(196,s),.4,{type:'triangle',vol:.06,at:.02}))},
 spin(){ns(.3,{f:3500,type:'bandpass',q:2,vol:.12,sw:.15});tn(600,.3,{type:'sawtooth',vol:.05,slide:.3})},
 glide(){ns(.25,{f:1400,type:'bandpass',q:1.5,vol:.07,sw:.6})},
 step(){ns(.05,{f:900+Math.random()*500,vol:.05});tn(170+Math.random()*60,.06,{vol:.05,slide:.6})},
 coin(c){const f=hz(988,c*2);tn(f,.3,{vol:.13,fm:.6,fr:3});tn(f*1.5,.45,{vol:.12,at:.07,fm:.5,fr:3});tn(f*3,.2,{vol:.03,at:.07})},
 red(){[0,4,7,12].forEach((s,i)=>{tn(hz(660,s),.5,{vol:.13,at:i*.06,fm:.5});tn(hz(1320,s),.3,{vol:.04,at:i*.06})});ns(.35,{f:6000,type:'highpass',vol:.07,at:.05})},
 star(){[0,4,7,12,16,19,24].forEach((s,i)=>{tn(hz(523,s),.9,{vol:.12,at:i*.09,fm:.4});tn(hz(1046,s),.6,{vol:.04,at:i*.09})});tn(130,1.6,{type:'triangle',vol:.14,att:.1});ns(1,{f:400,type:'bandpass',q:3,vol:.1,sw:20})},
 appear(){[12,7,4,0].forEach((s,i)=>tn(hz(784,s),.6,{vol:.1,at:i*.12,fm:.4}));ns(.6,{f:8000,type:'highpass',vol:.05})},
 fall(){tn(500,.9,{vol:.15,slide:.12,type:'triangle'});ns(.5,{f:2000,vol:.12,sw:.1,at:.4})},
 ui(){tn(900,.07,{vol:.1,type:'square'});tn(1350,.09,{vol:.1,at:.06,type:'square'})}};
const CH=[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]];let ms=0;
function musTick(){if(!actx||!AU.musicOn||AU.music<=0||document.hidden)return;const c=CH[(ms>>4)&3];
 if(ms%16===0){c.forEach(f=>tn(f/2,3.4,{type:'triangle',vol:.05,att:.8,dest:musG}));tn(c[0]/4,1.8,{vol:.14,att:.03,dest:musG})}
 if(ms%8===4)tn(c[0]/4*1.5,1,{vol:.08,att:.03,dest:musG});
 if(ms%2===0&&Math.random()<.7){const f=c[Math.random()*3|0]*(Math.random()<.5?2:4);tn(f,.7,{vol:.07,fm:.25,fr:2,dest:musG})}
 ms++}
