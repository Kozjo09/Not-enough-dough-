/* --- DOUGH GAMES CANVAS MINI-GAME: MONOCHROME MANGA DOUGH RUSH --- */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('game-score');
  const livesEl = document.getElementById('game-lives');
  const levelEl = document.getElementById('game-level');
  const startBtn = document.getElementById('start-game-btn');

  let score = 0;
  let lives = 3;
  let level = 1;
  let gameRunning = false;
  let animationId = null;

  // Responsive paddle scale
  const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 25,
    width: 80,
    height: 12,
    speed: 7,
    dx: 0
  };

  let items = [];
  let itemSpawnTimer = 0;

  document.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) paddle.dx = -paddle.speed;
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) paddle.dx = paddle.speed;
  });

  document.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(e.key)) paddle.dx = 0;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    paddle.x = (mouseX * (canvas.width / rect.width)) - paddle.width / 2;
  });

  // Touch support for mobile devices
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    paddle.x = (touchX * (canvas.width / rect.width)) - paddle.width / 2;
  }, { passive: false });

  if (startBtn) startBtn.addEventListener('click', startGame);

  function startGame() {
    score = 0;
    lives = 3;
    level = 1;
    items = [];
    gameRunning = true;
    startBtn.innerText = 'RESTART GAME 🔄';
    updateHUD();

    if (animationId) cancelAnimationFrame(animationId);
    gameLoop();
  }

  function updateHUD() {
    if (scoreEl) scoreEl.innerText = score;
    if (livesEl) livesEl.innerText = '🖤'.repeat(lives);
    if (levelEl) levelEl.innerText = level;
  }

  function spawnItem() {
    const types = [
      { name: 'dough', points: 100, symbol: '⚪', speed: 2 + level * 0.4 },
      { name: 'gem', points: 250, symbol: '◆', speed: 3 + level * 0.4 },
      { name: 'bomb', points: -1, symbol: '✖', speed: 2.5 + level * 0.4 }
    ];

    const rand = Math.random();
    let selected = types[0];
    if (rand > 0.82) selected = types[2]; // Bomb
    else if (rand > 0.65) selected = types[1]; // Gem

    items.push({
      x: Math.random() * (canvas.width - 24),
      y: -20,
      size: 20,
      ...selected
    });
  }

  function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Subtle Manga Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Move & Bound Paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // Draw Monochrome Paddle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Item Spawning
    itemSpawnTimer++;
    if (itemSpawnTimer > Math.max(15, 45 - level * 4)) {
      spawnItem();
      itemSpawnTimer = 0;
    }

    // Items Logic
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;

      ctx.fillStyle = '#ffffff';
      ctx.font = '18px sans-serif';
      ctx.fillText(item.symbol, item.x, item.y);

      // Collision Check
      if (
        item.y + item.size >= paddle.y &&
        item.x + item.size >= paddle.x &&
        item.x <= paddle.x + paddle.width
      ) {
        if (item.name === 'bomb') {
          lives--;
          if (typeof playSynthBeep === 'function') playSynthBeep(200, 0.2);
        } else {
          score += item.points;
          if (score >= level * 800) level++;
          if (typeof playSynthBeep === 'function') playSynthBeep(700, 0.06);
        }

        items.splice(i, 1);
        updateHUD();

        if (lives <= 0) {
          endGame();
          return;
        }
        continue;
      }

      if (item.y > canvas.height) {
        items.splice(i, 1);
      }
    }

    animationId = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 15);

    ctx.font = '16px Orbitron, sans-serif';
    ctx.fillText(`FINAL DOUGH SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    startBtn.innerText = 'PLAY AGAIN 🎮';
  }
});
