/* --- DOUGH GAMES CANVAS MINI-GAME: DOUGH CATCHER / BAKER RUN --- */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('game-score');
  const livesEl = document.getElementById('game-lives');
  const levelEl = document.getElementById('game-level');
  const startBtn = document.getElementById('start-game-btn');
  const gameMsg = document.getElementById('game-msg');

  let score = 0;
  let lives = 3;
  let level = 1;
  let gameRunning = false;
  let animationId = null;

  // Paddle / Baker Cart
  const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 25,
    width: 80,
    height: 15,
    speed: 7,
    dx: 0
  };

  // Falling Items (Dough coins, gems, bombs)
  let items = [];
  let itemSpawnTimer = 0;

  // Control Listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      paddle.dx = -paddle.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      paddle.dx = paddle.speed;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(e.key)) {
      paddle.dx = 0;
    }
  });

  // Touch / Mouse controls for paddle
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    paddle.x = mouseX - paddle.width / 2;
  });

  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  function startGame() {
    score = 0;
    lives = 3;
    level = 1;
    items = [];
    gameRunning = true;
    startBtn.innerText = 'RESTART GAME 🔄';
    if (gameMsg) gameMsg.style.display = 'none';
    updateHUD();

    if (animationId) cancelAnimationFrame(animationId);
    gameLoop();
  }

  function updateHUD() {
    if (scoreEl) scoreEl.innerText = score;
    if (livesEl) livesEl.innerText = '❤️'.repeat(lives);
    if (levelEl) levelEl.innerText = level;
  }

  function spawnItem() {
    const types = [
      { name: 'gold', color: '#ffd700', points: 100, symbol: '🍪', speed: 2 + level * 0.5 },
      { name: 'cyan', color: '#00f0ff', points: 250, symbol: '💎', speed: 3 + level * 0.5 },
      { name: 'bomb', color: '#ff0055', points: -1, symbol: '💣', speed: 2.5 + level * 0.5 }
    ];

    const rand = Math.random();
    let selected = types[0];
    if (rand > 0.85) selected = types[2]; // 15% bomb
    else if (rand > 0.65) selected = types[1]; // 20% gem

    items.push({
      x: Math.random() * (canvas.width - 24),
      y: -20,
      size: 24,
      ...selected
    });
  }

  function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Move Paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // Draw Paddle
    ctx.fillStyle = '#ffd700';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffd700';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;

    // Spawn Items
    itemSpawnTimer++;
    if (itemSpawnTimer > Math.max(15, 50 - level * 5)) {
      spawnItem();
      itemSpawnTimer = 0;
    }

    // Update & Draw Items
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;

      // Draw item
      ctx.font = '20px serif';
      ctx.fillText(item.symbol, item.x, item.y);

      // Collision Detection with Paddle
      if (
        item.y + item.size >= paddle.y &&
        item.x + item.size >= paddle.x &&
        item.x <= paddle.x + paddle.width
      ) {
        if (item.name === 'bomb') {
          lives--;
          if (typeof playSynthBeep === 'function') playSynthBeep(200, 0.3);
        } else {
          score += item.points;
          if (score >= level * 1000) level++;
          if (typeof playSynthBeep === 'function') playSynthBeep(900, 0.1);
        }

        items.splice(i, 1);
        updateHUD();

        if (lives <= 0) {
          endGame();
          return;
        }
        continue;
      }

      // Missed Item
      if (item.y > canvas.height) {
        if (item.name !== 'bomb') {
          // Missed dough item
        }
        items.splice(i, 1);
      }
    }

    animationId = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff0055';
    ctx.font = '900 28px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#ffd700';
    ctx.font = '18px Orbitron, sans-serif';
    ctx.fillText(`FINAL DOUGH SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    startBtn.innerText = 'PLAY AGAIN 🎮';
  }
});
