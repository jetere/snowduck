/* Snowduck - player/frame */
function frame(t){requestAnimationFrame(frame);const rdt=Math.min(.05,(t-frame.l||16)/1000);frame.l=t;const dt=rdt*CAM.ts;
 if(started)update(dt);
 OU.time.value=t/1000;slTick(rdt);fxTick(rdt);trailTick(t/1000,rdt);mistTick(t/1000);cloudG.rotation.y+=rdt*.004;
 camUpdate(t/1000,rdt);
 dl.position.set(P.x+60,P.y+100,P.z+40);dl.target.position.set(P.x,P.y,P.z);
 sky.position.copy(cam.position);GU.cpos.value.set(P.x,P.y,P.z);skyMat.uniforms.time.value=gm.material.uniforms.time.value=t/1000;tickDying(dt);parts(dt);FX.imp*=Math.exp(-rdt*2.6);FX.wob*=Math.exp(-rdt*3);FX.flash*=Math.exp(-rdt*5);FX.shk+=rdt*.9;
 FX.v.set(P.x,P.y+1,P.z).project(cam);const U=post.uniforms;U.ctr.value.set(FX.v.x*.5+.5,FX.v.y*.5+.5);U.imp.value=FX.imp*CFG.impact;U.shk.value=FX.shk;U.wob.value=FX.wob*CFG.impact*CFG.wobble+CFG.wobBase;U.flash.value=FX.flash;U.time.value=t/1000;
 ffTick(t/1000);renderer.setRenderTarget(rt);renderer.render(scene,cam);bzRun();renderer.setRenderTarget(null);renderer.render(pScene,pCam)}
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);const w=innerWidth*PR,h=innerHeight*PR;rt.depthTexture.image.width=w;rt.depthTexture.image.height=h;rt.setSize(w,h);post.uniforms.res.value.set(w,h);bzSize();ffU.scl.value=innerHeight*PR*.8;cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});
