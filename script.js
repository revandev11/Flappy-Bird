const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 0.25;
let velocity = 0;
let birdY = 250;
const birdX = 50;
const birdRadius = 15;
const jump = -5.5;

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        velocity = jump; 
    }
});

function gameLoop() {
    velocity += gravity;
    birdY += velocity;

    if (birdY + birdRadius > canvas.height) {
        birdY = canvas.height - birdRadius;
        velocity = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f39c12";
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(gameLoop);
}

gameLoop();