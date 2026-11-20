## Snowduck

A 3D toon platformer made with Three.js. Collect coins, explore the island, take portals to three sky levels, and find all six Power Stars.

**Play online:** https://jetere.github.io/snowduck/

No build step. No install. It runs in any modern browser.

## Controls

| Action | Keys |
| --- | --- |
| Move | WASD or arrow keys |
| Camera | Mouse drag, or Q / E |
| Jump | Space (press three times in a row for a triple jump) |
| Crouch | Shift or Z |
| Sprint | X |
| Wall kick | Jump into a wall |
| Respawn | R |
| Map | N |
| Settings | P |
| Fog / Director camera / Mute | F / V / M |

**Moves:** crouch and jump while running for a long jump. Crouch and jump while standing for a backflip. Crouch in the air for a ground pound.

**Gamepad:** left stick to move, right stick to look, A to jump, B or X to crouch, trigger to sprint.

## Run locally

Use any static file server:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>. You can also open `index.html` directly.

## Project structure

```
index.html      page and script list
css/            styles
assets/         icon
vendor/         Three.js r128 (works offline)
js/
  core/         helpers, terrain height, scene, input
  world/        terrain, water, castle, trees, hero, coins, grass, sky
  fx/           post-processing, bloom, particles, trails
  player/       physics, movement tuning, update loop
  camera/       follow camera and cinematic shots
  audio/        sound effects and music
  ui/           HUD, settings panel, map
  levels/       portals, Sakura Isle, sky levels
  boot.js       starts the game
```

The scripts share one global scope and load in order. When you add a file, list it after the files it depends on.

## Settings

Press **P** to change the look and feel while playing. Your choices are saved in the browser under `snowduck.settings.v1`.

| Setting | Default |
| --- | --- |
| Bloom intensity | 0.06 |
| Glow particles | 2.24 |
| Saturation | 1.4 |
| Wobble strength / FPS | 0.10 / 12 |
| Wobble noise scale | 35 |
| Walk animation speed | 1.8 |
| Aurora brightness / speed | 1.8 / 0.42 |

## Deploy

GitHub Pages serves the `main` branch. Push to `main` and the site updates automatically.
