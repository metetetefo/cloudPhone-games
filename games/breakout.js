export default function createBreakout(ctx, W, H, onExit) {
  let timer = null;
  let paddleX = 40;
  let ballX = W / 2;
  let ballY = H - 14;
  let ballVX = 2;
  let ballVY = -2;
  let bricks = [];

  const COLS = 8, ROWS = 5, BW = 12, BH = 6, PAD = 2;

  function buildBricks() {
    const gridW = COLS * BW + (COLS - 1) * PAD;
    const x0 = Math.floor((W - gridW) / 2);
    const y0 = 24;
    bricks = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        bricks.push({ x: x0 + c * (BW + PAD), y: y0 + r * (BH + PAD), w: BW, h: BH, alive: true });
      }
    }
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    for (const b of bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = '#39f';
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddleX, H - 8, 40, 5);
    ctx.fillRect(ballX - 2, ballY - 2, 4, 4);
  }

  function update() {
    ballX += ballVX;
    ballY += ballVY;
    if (ballX <= 1 || ballX >= W - 1) ballVX *= -1;
    if (ballY <= 1) ballVY *= -1;

    // Paddle collision
    if (ballY >= H - 10 && ballX >= paddleX && ballX <= paddleX + 40 && ballVY > 0) {
      ballVY *= -1;
      const hit = (ballX - (paddleX + 20)) / 20; // -1..1
      ballVX = Math.max(-3, Math.min(3, ballVX + hit));
    }

    // Brick collision
    for (const b of bricks) {
      if (!b.alive) continue;
      if (ballX >= b.x && ballX <= b.x + b.w && ballY >= b.y && ballY <= b.y + b.h) {
        b.alive = false;
        ballVY *= -1;
        break;
      }
    }

    if (ballY > H) { stop(); onExit(); return; }
    if (bricks.every(b => !b.alive)) { stop(); onExit(); return; }
    draw();
  }

  function start() {
    paddleX = 40;
    ballX = W / 2;
    ballY = H - 14;
    ballVX = 2;
    ballVY = -2;
    buildBricks();
    timer = setInterval(update, 16);
    draw();
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function handleKey(key) {
    if (key === 'left') paddleX = Math.max(0, paddleX - 10);
    else if (key === 'right') paddleX = Math.min(W - 40, paddleX + 10);
  }

  return { id: 'breakout', name: 'Breakout', start, stop, handleKey };
}

