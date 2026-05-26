const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 0.25;
let velocity = 0;
let birdY = 250;
const birdX = 50;
let birdRotation = 0;
let muted = false;
let score = 0;
let gameOver = false;
let gameStarted = false;
let paused = false;                    // ← Pause üçün yeni dəyişən
let highScore = localStorage.getItem("flappyHighScore") ? parseInt(localStorage.getItem("flappyHighScore")) : 0;

let pipes = [];
const pipeWidth = 60;
const pipeGap = 140;
const pipeSpeed = 2;
let frameCount = 0;

const birdImage = new Image();
birdImage.src = "image/bird.png";

let clouds = [];

function createCloud() {
    clouds.push({
        x: Math.random() * canvas.width,
        y: 50 + Math.random() * 100,
        size: 55 + Math.random() * 45,
        speed: 0.4 + Math.random() * 0.5
    });
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const hitSound = new Audio("hit.mp3");
hitSound.volume = 0.85;

function playSound(type) {
    if (muted) return; 
    if (type === "hit") {
        hitSound.currentTime = 0;
        hitSound.play().catch(() => {});
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    switch(type) {
        case "jump":
            oscillator.frequency.setValueAtTime(620, audioContext.currentTime);
            gain.gain.value = 0.3;
            oscillator.type = "sine";
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case "score":
            oscillator.frequency.setValueAtTime(900, audioContext.currentTime);
            gain.gain.value = 0.25;
            oscillator.type = "triangle";
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
        case "gameover":
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            gain.gain.value = 0.5;
            oscillator.type = "sawtooth";
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.8);
            break;
    }
}

function drawBird() {
    ctx.save();
    ctx.translate(birdX, birdY);
    ctx.rotate(birdRotation * Math.PI / 180);
    const size = 38;
    ctx.drawImage(birdImage, -size/2, -size/2, size, size);
    ctx.restore();
}

function spawnPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap,
        passed: false
    });
}

function resetGame() {
    birdY = 250;
    velocity = 0;
    birdRotation = 0;
    score = 0;
    gameOver = false;
    gameStarted = false;
    paused = false;
    pipes = [];
    frameCount = 0;
    spawnPipe();
}

// ====================== KONTROLLAR ======================
document.addEventListener("keydown", function(e) {
   if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
        } else if (gameOver) {
            resetGame();
        } else if (paused) {
            paused = false;
        } else {
            velocity = -5.5;
            playSound("jump");
        }
    }

    if (e.code === "KeyP" && gameStarted && !gameOver) {  
        paused = !paused;
    }
    if (e.code === "KeyM") {
        muted = !muted;
    }

    if (e.code === "Enter" && gameOver) {
        resetGame();
    }
});

canvas.addEventListener("click", function() {
    if (!gameStarted) {
        gameStarted = true;
    } else if (gameOver) {
        resetGame();
    } else if (!paused) {
        velocity = -5.5;
        playSound("jump");
    }
});

function drawUI() {
    // Mute ikonu
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = muted ? "#ff6b6b" : "rgba(255,255,255,0.9)";
    ctx.fillText(muted ? "🔇" : "🔊", canvas.width - 70, 32);

    // Pause ikonu
    ctx.fillStyle = paused ? "#ffe066" : "rgba(255,255,255,0.9)";
    ctx.fillText(paused ? "▶" : "⏸", canvas.width - 30, 32);
}


// ====================== GAME LOOP ======================
function gameLoop() {
    // Pause vəziyyətində yalnız çizim olsun, hərəkət olmasın
    if (gameStarted && !gameOver && !paused) {
        velocity += gravity;
        birdY += velocity;
        birdRotation = Math.max(Math.min(velocity * 5.5, 75), -25);

        if (birdY + 20 > canvas.height || birdY - 20 < 0) {
            gameOver = true;
            playSound("hit");
        }

        frameCount++;
        if (frameCount % 120 === 0) spawnPipe();

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            if (birdX + 18 > pipes[i].x && birdX - 18 < pipes[i].x + pipeWidth) {
                if (birdY - 18 < pipes[i].top || birdY + 18 > canvas.height - pipes[i].bottom) {
                    gameOver = true;
                    playSound("hit");
                }
            }

            if (!pipes[i].passed && pipes[i].x + pipeWidth < birdX) {
                score += 5;
                pipes[i].passed = true;
                playSound("score");
            }

            if (pipes[i].x + pipeWidth < 0) pipes.splice(i, 1);
        }

        if (gameOver && score > highScore) {
            highScore = score;
            localStorage.setItem("flappyHighScore", highScore);
            playSound("gameover");
        }
    }

    // Background
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Buludlar
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    for (let cloud of clouds) {
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloud.x + cloud.size * 0.4, cloud.y - 10, cloud.size * 0.7, cloud.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        
        if (!paused) cloud.x -= cloud.speed;
        if (cloud.x < -150) cloud.x = canvas.width + 100;
    }

    // Pipes
    ctx.fillStyle = "#2ecc71";
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    }

    drawBird();

    // Score
    if (gameStarted && !gameOver) {
        ctx.fillStyle = "#000000";
        ctx.font = "bold 38px 'Courier New', Courier, monospace";
        ctx.textAlign = "center";
        ctx.fillText(score, canvas.width / 2, 25);
    }
        drawUI();
    // Pause yazısı
    if (paused) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width/2, canvas.height/2);
        ctx.font = "20px Arial";
        ctx.fillText("tap to continue", canvas.width/2, canvas.height/2 + 50);
    }
    canvas.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Pause ikonu tıklama sahəsi
    if (mx > canvas.width - 52 && mx < canvas.width - 10 && my > 8 && my < 46) {
        if (gameStarted && !gameOver) { paused = !paused; return; }
    }
    // Mute ikonu tıklama sahəsi
    if (mx > canvas.width - 100 && mx < canvas.width - 60 && my > 8 && my < 46) {
        muted = !muted; return;
    }

    // Mövcud click məntiqi
    if (!gameStarted) { gameStarted = true; }
    else if (gameOver) { resetGame(); }
    else if (!paused) { velocity = -5.5; playSound("jump"); }
});

    // Start Screen
    if (!gameStarted) {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY BIRD", canvas.width/2, 180);
        ctx.font = "22px Arial";
        ctx.fillText("PRESS SPACE OR CLICK TO START", canvas.width/2, 270);
    }

    // Game Over (daha yaxşı görünüş)
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#1e2a44";
        ctx.fillRect(60, 130, 280, 270);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 6;
        ctx.strokeRect(60, 130, 280, 270);

        ctx.fillStyle = "#ff4757";
        ctx.font = "bold 34px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, 180);

        ctx.fillStyle = "#fff";
        ctx.font = "22px Arial";
        ctx.fillText(`Score: ${score}`, canvas.width/2, 230);
        ctx.fillText(`Best: ${highScore}`, canvas.width/2, 265);

        // Replay düyməsi (daha mərkəzdə və gözəl)
        ctx.fillStyle = "#2ed573";
        ctx.fillRect(110, 310, 180, 55);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px Arial";
        ctx.fillText("REPLAY", canvas.width/2, 345);
    }

    requestAnimationFrame(gameLoop);
}

// Buludları yarat
for (let i = 0; i < 6; i++) {
    createCloud();
}

spawnPipe();
gameLoop();