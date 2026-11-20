/* Star Hopper 64 - mobile touch controller
   Floating left stick + drag-to-look right pad + A/B/X action buttons.
   Writes into the shared virtual-input state T / tA / tcr used by the player update. */
(function mobileController() {
  const params = new URLSearchParams(location.search);
  const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const force = params.get('touch') === '1';
  const isTouch = force || coarse || (hasTouch && !matchMedia('(pointer: fine)').matches);
  if (!isTouch) return;

  document.body.classList.add('touch');

  const moveZone = $('moveZone'), lookZone = $('lookZone'), stick = $('stick'), knob = $('stickKnob');
  const TRAVEL = 52, DEAD = 5;
  let stickId = null, homeX = 0, homeY = 0, cx = 0, cy = 0;

  // measure the real safe-area inset (custom properties do not resolve env() reliably)
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:0;bottom:0;width:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;visibility:hidden';
  document.body.appendChild(probe);
  const safeBottom = () => probe.offsetHeight || 0;

  function placeHome() {
    homeX = 102;
    homeY = innerHeight - 102 - safeBottom();
    if (stickId === null) parkStick();
  }
  function parkStick() {
    stick.style.left = homeX + 'px';
    stick.style.top = homeY + 'px';
    knob.style.transform = 'translate(-50%,-50%)';
    stick.classList.remove('active');
  }
  function moveStick(x, y) {
    const dx = x - cx, dy = y - cy, len = Math.hypot(dx, dy) || 1;
    const cl = Math.min(len, TRAVEL), kx = dx / len * cl, ky = dy / len * cl;
    knob.style.transform = `translate(-50%,-50%) translate(${kx}px,${ky}px)`;
    const m = cl < DEAD ? 0 : Math.min(1, (cl - DEAD) / (TRAVEL - DEAD));
    T.mx = m ? (dx / len) * m : 0;
    T.my = m ? (dy / len) * m : 0;
  }
  function releaseStick() {
    stickId = null;
    T.mx = T.my = 0;
    parkStick();
  }

  placeHome();
  addEventListener('resize', placeHome);
  addEventListener('orientationchange', () => setTimeout(placeHome, 250));

  moveZone.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch' || stickId !== null) return;
    e.preventDefault();
    stickId = e.pointerId;
    // Floating stick: recentre under the thumb, clamped so the base stays on screen.
    const pad = 82;
    cx = Math.max(pad, Math.min(innerWidth - pad, e.clientX));
    cy = Math.max(pad, Math.min(innerHeight - pad, e.clientY));
    stick.style.left = cx + 'px';
    stick.style.top = cy + 'px';
    stick.classList.add('active');
    try { moveZone.setPointerCapture(e.pointerId) } catch (err) { }
    moveStick(e.clientX, e.clientY);
  });
  moveZone.addEventListener('pointermove', e => {
    if (e.pointerId !== stickId) return;
    e.preventDefault();
    moveStick(e.clientX, e.clientY);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev =>
    moveZone.addEventListener(ev, e => { if (e.pointerId === stickId) releaseStick(); }));

  // ---- look pad (right side drag)
  let lookId = null, lx = 0, ly = 0;
  lookZone.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch' || lookId !== null) return;
    e.preventDefault();
    lookId = e.pointerId; lx = e.clientX; ly = e.clientY;
    try { lookZone.setPointerCapture(e.pointerId) } catch (err) { }
  });
  lookZone.addEventListener('pointermove', e => {
    if (e.pointerId !== lookId) return;
    e.preventDefault();
    look(e.clientX - lx, e.clientY - ly, .006);
    lx = e.clientX; ly = e.clientY;
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev =>
    lookZone.addEventListener(ev, e => { if (e.pointerId === lookId) lookId = null; }));

  // ---- action buttons
  const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms) } catch (e) { } };
  function bindHold(id, down, up) {
    const el = $(id);
    el.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation();
      el.classList.add('down');
      try { el.setPointerCapture(e.pointerId) } catch (err) { }
      down();
    });
    const end = e => { e.preventDefault(); e.stopPropagation(); el.classList.remove('down'); up(); };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => el.addEventListener(ev, end));
    el.addEventListener('contextmenu', e => e.preventDefault());
  }

  bindHold('btnA', () => { tA = true; P.jb = performance.now() / 1000; buzz(8); }, () => { tA = false; });
  bindHold('btnB', () => { tcr = true; pound(); buzz(12); }, () => { tcr = false; });
  bindHold('btnX', () => { T.spr = true; }, () => { T.spr = false; });
  $('btnRespawn').addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation();
    if (started) { respawn(); buzz(20); }
  });

  // ---- keep the world from scrolling / zooming under the thumbs
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('dblclick', e => e.preventDefault());
  document.addEventListener('contextmenu', e => { if (e.target.closest('.tui')) e.preventDefault(); });

  // ---- release everything when the app goes to the background
  function releaseAll() {
    releaseStick(); lookId = null;
    tA = tcr = false; T.spr = false;
    document.querySelectorAll('.tbtn.down').forEach(b => b.classList.remove('down'));
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });
  addEventListener('blur', releaseAll);

  // ---- first touch on the title screen also starts the game (iOS needs a gesture for audio)
  addEventListener('touchstart', () => { if (!started) begin(); }, { passive: true, once: true });
})();
