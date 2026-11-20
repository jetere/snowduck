# ⭐ Star Hopper 64

A 3D toon platformer built with Three.js. Grab coins, climb the castle, spiral up Star Mountain, ride the portal rings to three sky levels and collect all six Power Stars.

The game is a single-page static site — no build step, no dependencies to install.

## Play

- **Move:** WASD / arrow keys
- **Camera:** mouse drag, or Q/E to turn
- **Jump:** Space (chain three for a triple jump)
- **Crouch:** Shift or Z — crouch + jump while running is a long jump, standing is a backflip; in the air it is a ground pound. Jump into a wall to wall-kick.
- **Sprint:** X
- **Other:** V director camera · F fog · N map · M mute · R respawn · P settings
- **Gamepad:** left stick run, right stick look, A jump, B/X crouch, trigger sprint

## Project layout

```
index.html               markup + ordered script list
css/style.css            HUD and title screen
assets/icon.svg          favicon

js/
  core/
    util.js              helpers + terrain height function TH(x, z)
    scene.js             renderer, camera, lights, toon materials
    input.js             keyboard, mouse, pointer lock
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
  boot.js                starts the render loop

vendor/three.min.js      Three.js r128 (MIT), vendored so the site works offline
```

Script order in `index.html` matters: the game is written as classic scripts that share one global scope, split by feature. Add a new file after the features it depends on.

## Default look

The visual defaults live in the shader/effect modules and can still be changed live with **P**:

| Setting | Value |
| --- | --- |
| Bloom intensity | 0.22 |
| Glow particles | 2.24 |
| Outlines | 1 |
| Vignette | 1 |
| Saturation | 1.4 |
| Chromatic aberration | 0.01 (max) |
| Impact strength | 0.05 |
| Wobble strength | 10 |
| Wobble FPS | 12 |
| Noise scale | 35 |
| Walk animation speed | 1.80 |
| Flutter glide | off |
| Aurora brightness / speed | 1.80 / 0.42 |
| Ghost trail gain / length / RGB | 12 / 0.21 / 1,1,1 |
| Smoke amount / size | 0.10 / 0.35 |
| Impact bubble size / screen distortion | 0.45 / 0.16 |

Saved settings use the `starhopper64.settings.v3` key.

## Run locally

Any static file server works, for example:

```bash
npx serve .
# or
python -m http.server 8080
```

Then open <http://localhost:8080>. Opening `index.html` directly with `file://` also works.

## Deploy

The site is hosted with GitHub Pages from the `main` branch root:

<https://jetere.github.io/snowduck/>

Pushing to `main` publishes the update automatically.
