# Flappy Bird

## 1. Game description
Flappy Bird (Easy Version) is an advanced, browser-based arcade game built from scratch. The player controls a rotating bird navigating through dynamically generated pipes. This polished version includes a dynamic physics simulation, smooth procedural cloud backgrounds, custom Web Audio API sound synthesis, real-time audio muting, a game pause state, and local storage persistence for tracking high scores.

## 2. Entity list
* **Bird** - The main player entity drawn from an image asset (`image/bird.png`). It utilizes `birdY`, `velocity`, and `gravity` for real-time physics, along with a dynamic `birdRotation` angle mapped directly to its falling/jumping speed.
* **Pipe** - Green obstacle pairs (`#2ecc71`) generated at fixed intervals. Each pipe contains an `x` coordinate, random `top` and `bottom` heights maintaining a precise `pipeGap`, and a `passed` boolean flag to trigger scoring.
* **Cloud** - Procedurally generated background decorations that float across the screen at randomized heights, sizes, and speeds, creating a parallax depth effect.
* **UI & Audio Engine** - A centralized rendering and event system managing interactive Canvas button hitboxes (Mute/Pause), custom text overlays, and web-synthesized game audio triggers (`jump`, `score`, `gameover`).

## 3. Excalidraw sketch placeholder
<img width="1408" height="768" alt="WhatsApp Image 2026-05-26 at 5 58 51 PM" src="https://github.com/user-attachments/assets/5af855ad-e9af-4791-a895-c9f672a1cb30" />

## 4. How to play
* **Controls**:
  * `SPACE` or **Mouse Click** - Flap wings / Jump up.
  * `Key P` or **Canvas Pause Icon (▶/⏸)** - Toggle pause mode during gameplay.
  * `Key M` or **Canvas Mute Icon (🔇/🔊)** - Toggle sound on/off.
  * `ENTER` or **Clicking the REPLAY Button** - Restarts the game instantly when Game Over.
* **Objective** - Navigate safely through the moving pipe corridors to accumulate points.
* **Win condition** - Endless; score as many points as possible to secure a new personal record.
* **Lose condition** - The game halts if the bird's collision radius hits the canvas ceiling, crashes into the floor, or intersects with any active pipe boundary.

## 5. Tech decisions
* **Canvas-Driven UI & Input Mapping** - Built completely with Vanilla JavaScript, HTML5 Canvas, and CSS3. UI interactives like the Top-Right Mute/Pause buttons and the Game Over "REPLAY" button are computed directly inside the Canvas element using geometric bounding-box mouse coordinate checks (`getBoundingClientRect`).
* **Web Audio API Synth Architecture** - Instead of loading large static audio files for simple alerts, the codebase utilizes modern browser `AudioContext` to programmatically spawn `OscillatorNode` soundwaves (Sine, Triangle, and Sawtooth frequencies) paired with `GainNode` volume envelopes. This ensures lag-free audio scheduling without execution hiccups.
* **State Preservation** - High scores are safely updated and committed locally using `localStorage` APIs right at the moment of impact.

## 6. AI diary
Check out the detailed step-by-step development process here: [AI_DIARY.md](AI_DIARY.md)

## 7. GitHub Pages link
[Play the game](https://revandev11.github.io/Flappy-Bird/)

## 8. Known bugs / what I'd fix next
* **Mobile performance lag** - Minor frame drop stutters occasionally occur on mobile webviews during heavy cloud/pipe array redrawing loops or sound contextualization. Next fix: optimize touch event listeners and hardware-accelerate rendering scales.
* **Click Listener Duplication** - Multiple click event handlers are registered directly within the execution loop, which could cause event piling over long sessions. Next fix: streamline all inputs into a single global window event manager.

---

## Commit stages
* `feat: player movement`
* `feat: collission implemented`
* `feat: add score/lose`
* `feat: start & game over screen`
* `feat: game restart`
* `feat: high score`

⭐ If you like this project, don't forget to give it a star!
