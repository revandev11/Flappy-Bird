const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Sənin təyin etdiyin minimum dəyişənlər
let gravity = 0.25;
let velocity = 0;
let birdY = 250;
const birdX = 50;
const birdRadius = 15;
const jump = -5.5;

// Klaviaturadan SPACE düyməsini dinləyirik
document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        velocity = jump; // Düyməyə basanda quş yuxarı sıçrayır
    }
});

// Əsas oyun dövrü (Game Loop)
function gameLoop() {
    // 1. UPDATE (Yeniləmə)
    velocity += gravity;
    birdY += velocity;

    // Sərhəd yoxlanışı: Quş yerə düşəndə qalsın
    if (birdY + birdRadius > canvas.height) {
        birdY = canvas.height - birdRadius;
        velocity = 0;
    }

    // 2. CLEAR (Təmizləmə)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 3. DRAW (Çəkmə)
    // Quşu sadə sarı dairə olaraq çəkirik
    ctx.beginPath();
    ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f39c12";
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(gameLoop);
}

// Oyunu başladırıq
gameLoop();