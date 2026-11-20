# ⭐ Star Hopper 64

A 3D toon platformer built with Three.js. Grab coins, climb the castle, spiral up Star Mountain, ride the portal rings to three sky levels and collect all six Power Stars.

The game is a single-page static site — no build step, no dependencies to install.

## Play

- **Desktop:** WASD / arrows to run, mouse or Q/E for the camera, **X** sprint, **Space** jump (chain three for a triple jump, hold in the air to flutter-glide), **Shift/Z** crouch (long jump / backflip / ground pound), **V** director camera, **F** fog, **N** map, **M** mute, **R** respawn, **P** settings.
- **Mobile:** floating left thumb-stick to move, drag the right side to look, **A** jump (hold to glide), **B** crouch / ground-pound, **X** sprint, **↺** respawn.
- **Gamepad:** left stick run, right stick look, A jump, B/X crouch, trigger sprint.

## Project layout

```
index.html               markup + ordered script list
css/style.css            HUD, title screen, on-screen controller
manifest.webmanifest     installable "app" metadata
assets/icon.svg          favicon / home-screen icon

js/
  core/
    util.js              helpers + terrain height function TH(x, z)
    scene.js             renderer, camera, lights, toon materials
    input.js             keyboard, mouse, pointer lock, shared input state
  world/
    terrain.js           vertex-coloured island mesh
    water.js             toon ocean + rivers + waterfalls
    castle.js            solid box helper (BX) and castle layout
    decor.js             trees and clouds
    hero.js              Quackman the snowman-duck
    collectibles.js      coins and Power Stars
    grass.js             instanced grass shader
    sky.js               aurora sky shader
  fx/
    shadows.js           shadow flags
    post.js              squiggle / outline / AO post-process
    bloom.js             four-level bloom chain
    fireflies.js         glowing pollen particles
    impact.js            shockwave, particles, coin popups
    trail.js             ghost trail
    slash.js             toon slash arcs
    bubble.js            impact bubble + smoke
  player/
    physics.js           player state and collision helpers
    tuning.js            movement tuning + gamepad polling
    update.js            per-frame gameplay update
    frame.js             render loop + resize handling
  camera/
    director.js          follow camera, cinematic shots, letterbox
  audio/
    audio.js             synthesised SFX, ambience and music
  ui/
    hud.js               respawn, banners, HUD counters
    settings.js          live settings panel (movement, camera, audio, shaders)
    map.js               rotating minimap + full island map
  levels/
    levels.js            portal rings, Sakura Isle, the three sky levels
  mobile.js              on-screen touch controller
  boot.js                starts the render loop

vendor/three.min.js      Three.js r128 (MIT), vendored so the site works offline
```

Script order in `index.html` matters: the game is written as classic scripts that share one global scope, split by feature. Add a new file after the features it depends on.

## Run locally

Any static file server works, for example:

```bash
npx serve .
# or
python -m http.server 8080
```

Then open <http://localhost:8080>. Opening `index.html` directly with `file://` also works.

Force the touch controller on a desktop browser with `?touch=1`.

## Deploy

The site is hosted with GitHub Pages from the `main` branch root:

<https://jetere.github.io/snowduck/>

Pushing to `main` publishes the update automatically.
