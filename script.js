const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 0.25;
let velocity = 0;
let birdY = 250;
const birdX = 50;
let birdRotation = 0;

let score = 0;
let gameOver = false;
let gameStarted = false;
let highScore = localStorage.getItem("flappyHighScore") ? parseInt(localStorage.getItem("flappyHighScore")) : 0;

let pipes = [];
const pipeWidth = 60;
const pipeGap = 140;
const pipeSpeed = 2;
let frameCount = 0;

const birdImage = new Image();
birdImage.src = "image/bird.png";
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const hitSound = new Audio("hit.mp3");
hitSound.volume = 0.85;

function playSound(type) {
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
    pipes = [];
    frameCount = 0;
    spawnPipe();
}

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
        } else if (!gameOver) {
            velocity = -5.5;
            playSound("jump");
        }
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
    } else {
        velocity = -5.5;
        playSound("jump");
    }
});

// ====================== GAME LOOP ======================
function gameLoop() {
    if (gameStarted && !gameOver) {
        velocity += gravity;
        birdY += velocity;

        birdRotation = Math.max(Math.min(velocity * 5.5, 75), -25);

        if (birdY + 20 > canvas.height || birdY - 20 < 0) {
            gameOver = true;
            playSound("hit");
        }

        frameCount++;
        if (frameCount % 120 === 0) {
            spawnPipe();
        }

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

            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }

        if (gameOver && score > highScore) {
            highScore = score;
            localStorage.setItem("flappyHighScore", highScore);
            playSound("gameover");
        }
    }

    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2ecc71";
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    }

    drawBird();

    if (!gameStarted) {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 34px Arial";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY BIRD", canvas.width/2, 180);
        ctx.font = "20px Arial";
        ctx.fillText("PRESS SPACE OR CLICK TO START", canvas.width/2, 270);
    }

    if (gameStarted && !gameOver) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 42px Arial";
        ctx.textAlign = "center";
        ctx.fillText(score, canvas.width/2, 70);
    }

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#34495e";
        ctx.fillRect(60, 140, 280, 260);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 5;
        ctx.strokeRect(60, 140, 280, 260);

        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 32px Arial";
        ctx.fillText("GAME OVER", canvas.width/2, 190);

        ctx.fillStyle = "#fff";
        ctx.font = "22px Arial";
        ctx.fillText(`Score: ${score}`, canvas.width/2, 245);
        ctx.fillText(`Best: ${highScore}`, canvas.width/2, 280);

        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(120, 360, 160, 50);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial";
        ctx.fillText("REPLAY", canvas.width/2, 390);
    }

    requestAnimationFrame(gameLoop);
}

spawnPipe();
gameLoop();