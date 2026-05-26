const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Sənin təyin etdiyin minimum dəyişənlər
let gravity = 0.25;
let velocity = 0;
let birdY = 250;
const birdX = 50;
const birdRadius = 15;
const jump = -5.5;
let gameOver = false; // Oyunun bitib-bitmədiyini yoxlayan dəyişən

// Borular üçün lazımdır olan yeni dəyişənlər
let pipes = [];
const pipeWidth = 60;
const pipeGap = 140; // Boruların arasındakı boşluq (quşun keçəcəyi yer)
const pipeSpeed = 2;
let frameCount = 0;

// Klaviaturadan SPACE düyməsini dinləyirik
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !gameOver) {
        velocity = jump;
    }
});

// Yeni boru yaratmaq funksiyası
function spawnPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    // Təsadüfi yuxarı boru hündürlüyü seçirik
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap
    });
}

// Əsas oyun dövrü (Game Loop)
function gameLoop() {
    // 1. UPDATE (Yeniləmə)
    if (!gameOver) {
        velocity += gravity;
        birdY += velocity;

        // Yerə və ya tavana dəymə yoxlanışı (Uduzma şərti)
        if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
            gameOver = true;
        }

        // Boruların hərəkəti və yenilərinin yaranması
        frameCount++;
        if (frameCount % 120 === 0) { // Hər 120 kadrda bir yeni boru gəlsin
            spawnPipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            // TOQQUŞMA MƏNTİQİ (Collision Detection)
            // Quşun borunun X və Y sərhədlərinə girib-girmədiyini yoxlayırıq
            if (
                birdX + birdRadius > pipes[i].x && 
                birdX - birdRadius < pipes[i].x + pipeWidth
            ) {
                // Yuxarı və ya aşağı boruya dəymə yoxlanışı
                if (birdY - birdRadius < pipes[i].top || birdY + birdRadius > canvas.height - pipes[i].bottom) {
                    gameOver = true;
                }
            }

            // Ekrandan çıxan boruları massivdən silirik (yaddaş dolmasın)
            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    // 2. CLEAR (Təmizləmə)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 3. DRAW (Çəkmə)
    // Boruları çəkirik
    ctx.fillStyle = "#b8ff35"; // Yaşıl boru rəngi
    for (let i = 0; i < pipes.length; i++) {
        // Yuxarı boru
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);
        // Aşağı boru
        ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, pipeWidth, pipes[i].bottom);
    }

    // Quşu çəkirik
    ctx.beginPath();
    ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f39c12";
    ctx.fill();
    ctx.closePath();

    // Əgər oyun bitibsə, ekrana sadə bir mesaj yazaq (Hələlik)
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("YOU LOSE!", canvas.width / 2, canvas.height / 2);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// İlk borunu yaradırıq və oyunu başladırıq
spawnPipe();
gameLoop();