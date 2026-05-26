# AI Diary - Flappy Bird 
## AI Tools Used: Gemini & Grok


### [Stage 1] - Bird Falling Out of Canvas Boundaries
* **What I asked the AI:** I asked Gemini why my bird entity kept falling continuously and completely disappeared from the bottom of the screen.
* **What it gave me:** It provided a generic boundaries check using a hardcoded pixel value instead of dynamically tracking the canvas configuration.
* **What was wrong:** The value it gave for `canvas.height` logic was mathematically incorrect for my specific bounding box, causing the bird to still clip through the lower floor.
* **How I fixed it:** I researched the HTML5 Canvas coordinate system independently and corrected the check using `if (birdY + birdRadius > canvas.height)` to properly snap the bird to the floor boundary.
* **Time lost:** ~20 minutes

---

### [Stage 2] - Reverse Loop for Pipe Cleanup (Memory Leak)
* **What I asked the AI:** I asked Grok for a reliable data structure and logic to handle obstacle spawning and clearing once they leave the screen view.
* **What it gave me:** Grok provided a highly precise array management strategy using an inverse loop mechanism.
* **What was wrong:** The logic itself was solid, but I had to manually fine-tune the strict pixel threshold (`pipes[i].x + pipeWidth < 0`) to prevent visual popping on the left edge.
* **How I fixed it:** Implemented Grok's suggestion directly by spinning the loop backwards (`for (let i = pipes.length - 1; i >= 0; i--)`), which allowed safe splicing of the array elements without disrupting indexes.
* **Time lost:** ~5 minutes

---

### [Stage 3] - Rapid Infinite Score Bug
* **What I asked the AI:** I asked Gemini how to trigger a score increase when the bird passes a pipe corridor.
* **What it gave me:** It suggested a simple conditional alignment check based entirely on the horizontal coordinates (`if (pipes[i].x + pipeWidth < birdX)`).
* **What was wrong:** Because the condition remained valid for every single frame while the pipe was behind the bird, the score increased infinitely by hundreds of points per second.
* **How I fixed it:** I modified the pipe objects by tracking a dedicated state using a `passed: false` boolean flag, ensuring the score updates exactly once per obstacle.
* **Time lost:** ~15 minutes

---

### [Stage 4] - Web Audio API Synthesis Block
* **What I asked the AI:** I asked Grok how to generate classic arcade sound effects dynamically without heavily loading static audio assets.
* **What it gave me:** It introduced me to the modern browser standard `AudioContext` and showed me how to construct soundwave frequencies using `OscillatorNode`.
* **What was wrong:** It did not account for the standard browser autoplay security policy, which throws severe execution errors if sound context initialization is attempted before any explicit user interaction.
* **How I fixed it:** Wrapped the trigger triggers safely inside the user keyboard spacebar and click handlers so the execution context boots up natively during active play.
* **Time lost:** ~20 minutes

---

### [Stage 5] - Parallax Cloud Movement on Pause State
* **What I asked the AI:** I asked Gemini why my environmental background elements kept animating across the screen even when the main gameplay state was completely paused.
* **What it gave me:** It suggested overriding the global conditional flags, trying to enforce `paused = true` directly across every individual update array improperly.
* **What was wrong:** The initial loop updates it gave completely ignored the background array iteration logic, leaving the procedural cloud elements drifting autonomously.
* **How I fixed it:** I rejected the bloated code rewrite, isolated my custom array loop, and encapsulated the horizontal transformation sequence right within a clean conditional block: `if (!paused) cloud.x -= cloud.speed;`.
* **Time lost:** ~15 minutes

---

### [Stage 6] - Local Asset Path Ingestion in Canvas Context
* **What I asked the AI:** I asked Grok how to structure the asset paths to correctly preload and paint my local sprite sheet (`image/bird.png`) onto the canvas.
* **What it gave me:** It gave me conflicting advice regarding raw string path formatting vs synchronous file imports that didn't align with local relative paths.
* **What was wrong:** The recommended pathing threw a silent file-not-found break because the rendering context wrapper was looking for a pre-loaded Image instance object rather than a raw dynamic URL reference.
* **How I fixed it:** I instantiated a native image loader pattern (`const birdImage = new Image(); birdImage.src = ...`) and hooked it explicitly into the render sequence.
* **Time lost:** ~10 minutes