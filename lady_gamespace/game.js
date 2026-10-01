// ==========================================
// GALAXIAN - LENGKAP DENGAN KARAKTER PANDUAN
// ==========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score-display');
const waveDisplay = document.getElementById('wave-display');
const livesDisplay = document.getElementById('lives-display');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnFire = document.getElementById('btn-fire');

const WIDTH = 500;
const HEIGHT = 600;

let score = 0;
let lives = 3;
let wave = 1;
let gameRunning = false;
let animationId = null;

// ==========================================
// PLAYER (ROKET DI BAWAH) 🚀
// ==========================================
const player = {
    x: 230,
    y: 540,
    width: 40,
    height: 40,
    speed: 5,
    movingLeft: false,
    movingRight: false,
    cooldown: 0
};

// ==========================================
// GUIDE CHARACTER (ICE CREAM DI TENGAH) 🍦
// ==========================================
const guide = {
    x: 230,
    y: 280,
    width: 40,
    height: 40,
    speed: 5,
    movingLeft: false,
    movingRight: false,
    blinkTimer: 0
};

// ==========================================
// BULLETS
// ==========================================
let bullets = [];
let enemyBullets = [];

// ==========================================
// ALIENS
// ==========================================
let aliens = [];
const alienEmojis = ['👾', '', '👻'];
let alienDirection = 1;
let alienSpeed = 30;
let alienMoveTimer = 0;

// ==========================================
// STARS BACKGROUND
// ==========================================
const stars = [];
for (let i = 0; i < 50; i++) {
    stars.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
    });
}

// ==========================================
// CREATE ALIENS
// ==========================================
function createAliens() {
    aliens = [];
    const offsetX = 40;
    const offsetY = 60;
    const spacingX = 50;
    const spacingY = 40;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
            aliens.push({
                x: offsetX + col * spacingX,
                y: offsetY + row * spacingY,
                width: 30,
                height: 30,
                alive: true,
                emoji: alienEmojis[row % 3],
                points: (4 - row) * 100
            });
        }
    }
}

// ==========================================
// DRAW BACKGROUND
// ==========================================
function drawBackground() {
    ctx.fillStyle = '#000010';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#ffffff';
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > HEIGHT) {
            star.y = 0;
            star.x = Math.random() * WIDTH;
        }
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
}

// ==========================================
// DRAW PLAYER (ROKET 🚀)
// ==========================================
function drawPlayer() {
    ctx.save();
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 15;
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('', player.x + player.width / 2, player.y + player.height / 2);
    ctx.restore();
}

// ==========================================
// DRAW GUIDE CHARACTER (ICE CREAM LUCU)
// ==========================================
function drawGuide() {
    const cx = guide.x + guide.width / 2;
    const cy = guide.y + guide.height / 2;

    guide.blinkTimer = (guide.blinkTimer + 1) % 120;
    const isBlinking = guide.blinkTimer > 110;

    ctx.save();
    ctx.shadowColor = '#ff6b9d';
    ctx.shadowBlur = 15;

    // BADAN (putih)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 5, 18, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // KEPALA/ATAS (pink)
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.arc(cx, cy - 5, 12, 0, Math.PI * 2);
    ctx.fill();

    // MATA
    if (!isBlinking) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cx - 5, cy, 4, 0, Math.PI * 2);
        ctx.arc(cx + 5, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Highlight mata
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - 6, cy - 1, 1.5, 0, Math.PI * 2);
        ctx.arc(cx + 4, cy - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Mata kedip (garis)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy);
        ctx.lineTo(cx - 2, cy);
        ctx.moveTo(cx + 2, cy);
        ctx.lineTo(cx + 8, cy);
        ctx.stroke();
    }

    // MULUT
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy + 5, 5, 0, Math.PI);
    ctx.stroke();

    // SAYAP KIRI (teal)
    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy + 5);
    ctx.lineTo(cx - 22, cy + 12);
    ctx.lineTo(cx - 12, cy + 8);
    ctx.closePath();
    ctx.fill();

    // SAYAP KANAN (teal)
    ctx.beginPath();
    ctx.moveTo(cx + 15, cy + 5);
    ctx.lineTo(cx + 22, cy + 12);
    ctx.lineTo(cx + 12, cy + 8);
    ctx.closePath();
    ctx.fill();

    // EKOR/API (orange)
    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 18);
    ctx.lineTo(cx, cy + 28);
    ctx.lineTo(cx + 6, cy + 18);
    ctx.closePath();
    ctx.fill();

    // Api dalam (kuning)
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy + 18);
    ctx.lineTo(cx, cy + 24);
    ctx.lineTo(cx + 3, cy + 18);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// ==========================================
// DRAW ALIENS
// ==========================================
function drawAliens() {
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let alien of aliens) {
        if (alien.alive) {
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 10;
            ctx.fillText(alien.emoji, alien.x + alien.width / 2, alien.y + alien.height / 2);
            ctx.shadowBlur = 0;
        }
    }
}

// ==========================================
// DRAW BULLETS
// ==========================================
function drawBullets() {
    // Peluru pemain (hijau)
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    // Peluru musuh (merah)
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    for (let bullet of enemyBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    ctx.shadowBlur = 0;
}

// ==========================================
// UPDATE PLAYER & GUIDE
// ==========================================
function updatePlayer() {
    // Update player (di bawah)
    if (player.movingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x < WIDTH - player.width) {
        player.x += player.speed;
    }
    if (player.cooldown > 0) player.cooldown--;

    // Update guide (di tengah) - gerak sinkron
    if (guide.movingLeft && guide.x > 0) {
        guide.x -= guide.speed;
    }
    if (guide.movingRight && guide.x < WIDTH - guide.width) {
        guide.x += guide.speed;
    }
}

// ==========================================
// UPDATE BULLETS
// ==========================================
function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.y -= 8;
        return bullet.y > -10;
    });

    enemyBullets = enemyBullets.filter(bullet => {
        bullet.y += 4;
        return bullet.y < HEIGHT + 10;
    });
}

// ==========================================
// UPDATE ALIENS
// ==========================================
function updateAliens() {
    alienMoveTimer++;
    if (alienMoveTimer < 20) return;
    alienMoveTimer = 0;

    let hitEdge = false;
    let leftEdge = WIDTH;
    let rightEdge = 0;

    for (let alien of aliens) {
        if (alien.alive) {
            if (alien.x < leftEdge) leftEdge = alien.x;
            if (alien.x + alien.width > rightEdge) rightEdge = alien.x + alien.width;
        }
    }

    if ((rightEdge >= WIDTH - 10 && alienDirection === 1) ||
        (leftEdge <= 10 && alienDirection === -1)) {
        alienDirection *= -1;
        for (let alien of aliens) {
            if (alien.alive) alien.y += 20;
        }
    } else {
        for (let alien of aliens) {
            if (alien.alive) alien.x += alienSpeed * alienDirection * 0.5;
        }
    }

    // Enemy shooting
    if (Math.random() < 0.02) {
        const aliveAliens = aliens.filter(a => a.alive);
        if (aliveAliens.length > 0) {
            const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
            enemyBullets.push({
                x: shooter.x + shooter.width / 2 - 2,
                y: shooter.y + shooter.height,
                width: 4,
                height: 12
            });
        }
    }
}

// ==========================================
// CHECK COLLISIONS
// ==========================================
function checkCollisions() {
    // Peluru pemain kena alien
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let alien of aliens) {
            if (alien.alive &&
                bullets[i].x < alien.x + alien.width &&
                bullets[i].x + bullets[i].width > alien.x &&
                bullets[i].y < alien.y + alien.height &&
                bullets[i].y + bullets[i].height > alien.y) {
                
                alien.alive = false;
                bullets.splice(i, 1);
                score += alien.points;
                updateHUD();
                break;
            }
        }
    }

    // Peluru musuh kena player
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y) {
            
            enemyBullets.splice(i, 1);
            lives--;
            updateHUD();

            if (lives <= 0) {
                gameOver();
            }
            break;
        }
    }

    // Alien sampai ke player
    for (let alien of aliens) {
        if (alien.alive && alien.y + alien.height >= player.y) {
            gameOver();
            break;
        }
    }
}

// ==========================================
// SHOOT
// ==========================================
function shoot() {
    if (!gameRunning || player.cooldown > 0) return;

    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 12
    });

    player.cooldown = 15;
}

// ==========================================
// UPDATE HUD
// ==========================================
function updateHUD() {
    scoreDisplay.textContent = 'SCORE: ' + String(score).padStart(4, '0');
    waveDisplay.textContent = 'WAVE: ' + wave;
    livesDisplay.textContent = '♥ ' + lives;
}

// ==========================================
// GAME OVER
// ==========================================
function gameOver() {
    gameRunning = false;
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <h1 style="color: #ff0055; font-size: 36px; margin-bottom: 20px;">GAME OVER</h1>
        <h2 style="color: #00ffff; font-size: 18px; margin-bottom: 30px;">Score: ${score}</h2>
        <button id="restart-btn" style="padding: 15px 30px; font-size: 16px; background: transparent; color: #00ff00; border: 3px solid #00ff00; cursor: pointer;">MAIN LAGI</button>
    `;
    document.getElementById('restart-btn').addEventListener('click', () => {
        location.reload();
    });
}

// ==========================================
// INIT GAME
// ==========================================
function initGame() {
    score = 0;
    lives = 3;
    wave = 1;
    player.x = 230;
    player.y = 540;
    guide.x = 230;
    guide.y = 280;
    bullets = [];
    enemyBullets = [];
    createAliens();
    updateHUD();
}

// ==========================================
// GAME LOOP
// ==========================================
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground();
    updatePlayer();
    updateBullets();
    updateAliens();
    checkCollisions();
    drawAliens();
    drawBullets();
    drawPlayer();
    drawGuide();  // ← Karakter panduan di tengah

    animationId = requestAnimationFrame(gameLoop);
}

// ==========================================
// START BUTTON
// ==========================================
startBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    initGame();
    gameRunning = true;
    gameLoop();
});

// ==========================================
// KEYBOARD
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        player.movingLeft = true;
        guide.movingLeft = true;  // Guide ikut gerak
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        player.movingRight = true;
        guide.movingRight = true;  // Guide ikut gerak
    }
    if (e.code === 'Space') {
        e.preventDefault();
        shoot();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        player.movingLeft = false;
        guide.movingLeft = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        player.movingRight = false;
        guide.movingRight = false;
    }
});

// ==========================================
// TOUCH CONTROLS
// ==========================================
if (btnLeft) {
    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.movingLeft = true;
        guide.movingLeft = true;
        btnLeft.classList.add('active');
    });
    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        player.movingLeft = false;
        guide.movingLeft = false;
        btnLeft.classList.remove('active');
    });
    btnLeft.addEventListener('mousedown', () => {
        player.movingLeft = true;
        guide.movingLeft = true;
        btnLeft.classList.add('active');
    });
    btnLeft.addEventListener('mouseup', () => {
        player.movingLeft = false;
        guide.movingLeft = false;
        btnLeft.classList.remove('active');
    });
}

if (btnRight) {
    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.movingRight = true;
        guide.movingRight = true;
        btnRight.classList.add('active');
    });
    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        player.movingRight = false;
        guide.movingRight = false;
        btnRight.classList.remove('active');
    });
    btnRight.addEventListener('mousedown', () => {
        player.movingRight = true;
        guide.movingRight = true;
        btnRight.classList.add('active');
    });
    btnRight.addEventListener('mouseup', () => {
        player.movingRight = false;
        guide.movingRight = false;
        btnRight.classList.remove('active');
    });
}

if (btnFire) {
    btnFire.addEventListener('touchstart', (e) => {
        e.preventDefault();
        shoot();
        btnFire.classList.add('active');
    });
    btnFire.addEventListener('touchend', (e) => {
        e.preventDefault();
        btnFire.classList.remove('active');
    });
    btnFire.addEventListener('mousedown', () => {
        shoot();
        btnFire.classList.add('active');
    });
    btnFire.addEventListener('mouseup', () => {
        btnFire.classList.remove('active');
    });
}

// Initial draw
drawBackground();