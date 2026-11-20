/* Star Hopper 64 - core/input (keyboard, mouse, pointer lock). Touch controls live in js/mobile.js */
// ---------- input state
const keys = {};
let yaw = 0, pitch = .4, started = false, locked = false, drag = false, tcr = false, shake = 0;
// T is the shared virtual-input state filled by the on-screen controller (mobile.js)
const T = { mx: 0, my: 0, spr: false }, cvs = renderer.domElement, crouchK = ['ShiftLeft', 'ShiftRight', 'KeyZ', 'KeyC'];
let tA = false;

function pound() {
  if (started && !P.on && P.mode !== 'pound') {
    P.mode = 'pound'; P.mt = MV.poundWind; SFX.spin(); SL.acc = 0; slash('dash', P.y + .8); P.flip = 0; body.rotation.x = 0
  }
}

addEventListener('keydown', e => {
  if (e.repeat) return;
  keys[e.code] = true;
  if (e.code === 'Space') { P.jb = performance.now() / 1000; e.preventDefault() }
  if (e.code === 'KeyR') respawn();
  if (e.code === 'KeyV' && started) toggleDir();
  if (e.code === 'KeyF' && started) toggleFog();
  if (e.code === 'KeyM') { AU.mute = !AU.mute; applyAudio(); banner(AU.mute ? '🔇 Muted' : '🔊 Sound on') }
  if (crouchK.includes(e.code)) pound()
});
addEventListener('keyup', e => {
  keys[e.code] = false;
  if (e.code === 'Space' && MV.varJump && !P.on && P.mode === '' && P.vy > 6) P.vy *= .5
});
const look = (dx, dy, s) => {
  CAM.lastIn = performance.now() / 1000;
  yaw -= dx * s * CC.sens;
  pitch = Math.max(.05, Math.min(1.25, pitch + dy * s * .8 * CC.sens * (CC.invY ? -1 : 1)))
};
['keydown', 'mousedown', 'touchstart', 'mousemove', 'pointerdown', 'pointermove'].forEach(e => addEventListener(e, () => CAM.lastAct = performance.now() / 1000, { passive: true }));
addEventListener('mousemove', e => { if (locked || drag) look(e.movementX, e.movementY, .0035) });
cvs.addEventListener('mousedown', () => drag = true);
addEventListener('mouseup', () => drag = false);
document.addEventListener('pointerlockchange', () => { locked = document.pointerLockElement === cvs });

function begin() {
  if (started) return;
  $('ov').style.display = 'none';
  started = true;
  try { audioInit() } catch (e) { }
  CAM.cut = 1; CAM.fov = cam.fov; CAM.lastAct = performance.now() / 1000;
  yaw = 0; pitch = .4;
  if (CC.shots) introShot();
  document.body.classList.add('playing');
}
$('ov').addEventListener('click', begin);
cvs.addEventListener('click', () => {
  if (started && !locked && !('ontouchstart' in window)) try {
    const p = cvs.requestPointerLock();
    if (p && p.catch) p.catch(() => { })
  } catch (e) { }
});
