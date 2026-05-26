const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 0.25;
let velocity = 0;
let birdY = 250;
const birdX = 50;
const birdRadius = 15;
const jump = -5.5;
let score = 0;
let gameOver = false;
let gameStarted = false;

let highScore = localStorage.getItem("flappyHighScore") ? parseInt(localStorage.getItem("flappyHighScore")) : 0;

let pipes = [];
const pipeWidth = 60;
const pipeGap = 140;
const pipeSpeed = 2;
let frameCount = 0;

const boxWidth = 280;
const boxHeight = 220;
const boxX = (canvas.width - boxWidth) / 2;
const boxY = (canvas.height - boxHeight) / 2;
const btnX = boxX + 40;
const btnY = boxY + 160;
const btnWidth = boxWidth - 80;
const btnHeight = 35;

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
        } else if (!gameOver) {
            velocity = jump;
        }
    }
    if (e.code === "Enter" && gameOver) {
        resetGame();
    }
});

canvas.addEventListener("click", function(e) {
    if (gameOver) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (
            mouseX >= btnX &&
            mouseX <= btnX + btnWidth &&
            mouseY >= btnY &&
            mouseY <= btnY + btnHeight
        ) {
            resetGame();
        }
    }
});

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
    score = 0;
    gameOver = false;
    gameStarted = false;
    pipes = [];
    frameCount = 0;
    spawnPipe();
}

function gameLoop() {
    if (gameStarted && !gameOver) {
        velocity += gravity;
        birdY += velocity;

        if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
            gameOver = true;
        }

        frameCount++;
        if (frameCount % 120 === 0) {
            spawnPipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            if (birdX + birdRadius > pipes[i].x && birdX - birdRadius < pipes[i].x + pipeWidth) {
                if (birdY - birdRadius < pipes[i].top || birdY + birdRadius > canvas.height - pipes[i].bottom) {
                    gameOver = true;
                }
            }

            if (!pipes[i].passed && pipes[i].x + pipeWidth < birdX) {
                score += 5;
                pipes[i].passed = true;
            }

            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }

        if (gameOver) {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("flappyHighScore", highScore);
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2ecc71";
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);
        ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, pipeWidth, pipes[i].bottom);
    }

    ctx.beginPath();
    ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f39c12";
    ctx.fill();
    ctx.closePath();

    if (!gameStarted) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE TO START", canvas.width / 2, canvas.height / 2);
    }

    if (gameStarted && !gameOver) {
        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Score: " + score, 20, 40);
    }

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#34495e";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, boxY + 45);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, canvas.width / 2, boxY + 95);
        ctx.fillText("Best Score: " + highScore, canvas.width / 2, boxY + 130);

        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.fillText("CLICK OR ENTER TO REPLAY", canvas.width / 2, btnY + 22);
    }

    requestAnimationFrame(gameLoop);
}

spawnPipe();
gameLoop();