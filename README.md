# 🐦 Flappy Bird - Vanilla JS (Easy Version)

This project is a simplified Flappy Bird game built entirely with fundamental web technologies and the **Canvas API**, without using any external libraries or CSS frameworks.

---

## 🎮 Game Structure

The game is designed with a Minimum Viable Product (MVP) approach and consists of 3 main screens:

### 1. Start Screen
* The game elements remain static upon loading.
* Prompts the player with a centered text: **`PRESS SPACE TO START`**.

### 2. Gameplay
* **Bird:** Affected by gravitational pull, moving downward automatically and jumping upwards upon user input.
* **Pipes:** Move from right to left with randomized gap placements.
* **Score:** Increments by 1 every time the bird successfully passes through a pair of pipes.

### 3. Game Over
* Triggers instantly when the bird collides with a pipe or the ground.
* Displays **`GAME OVER`**, the final score (**`Score: X`**), and a prompt to retry: **`Press Enter`**.

---

## 🧠 Minimum Logic & Variables

The core mechanics are driven by the following minimal variable set:
* `gravity` — The constant downward force acting on the bird.
* `velocity` — The current vertical speed/momentum of the bird.
* `birdY` — The actual Y-coordinate position of the bird on the canvas.
* `score` — The current count of passed obstacles.
* `gameOver` — A boolean flag (`true`/`false`) tracking the active game state.

---

## ⌨️ Controls

* **`SPACE`:** * On Start Screen -> Launches the gameplay loop.
  * During Gameplay -> Triggers a `jump` (reverses vertical velocity).
* **`ENTER`:** * On Game Over Screen -> Triggers a `restart` (resets all variables and positions).

---

## 🚀 How to Run

1. Open the `index.html` file directly in any modern web browser.
2. Press the **`SPACE`** key to start playing!