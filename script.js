const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 0.25;
let velocity = 0;
let birdY = 250;
const birdX = 50;
const birdRadius = 15;
const jump = -5.5;
let gameOver = false;

let pipes = [];
const pipeWidth = 60;
const pipeGap = 140;
const pipeSpeed = 2;
let frameCount = 0;

document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !gameOver) {
        velocity = jump;
    }
});

function spawnPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap
    });
}

function gameLoop() {
    if (!gameOver) {
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

            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
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

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("YOU LOSE!", canvas.width / 2, canvas.height / 2);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

spawnPipe();
gameLoop();