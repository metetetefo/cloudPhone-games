export default function createPong(ctx, W, H, onExit, offset = { x: 0, y: 0 }) {
  let timer = null;
  let paddleX = 40;
  let ballX = W / 2;
  let ballY = H / 2;
  let ballVX = 2;
  let ballVY = 2;

  function draw() {
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddleX, H - 8, 40, 5);
    ctx.fillRect(ballX - 2, ballY - 2, 4, 4);
    ctx.restore();
  }

  function update() {
    ballX += ballVX;
    ballY += ballVY;
    if (ballX <= 0 || ballX >= W) ballVX *= -1;
    if (ballY <= 0) ballVY *= -1;
    if (ballY >= H - 8 && ballX >= paddleX && ballX <= paddleX + 40) {
      ballVY *= -1;
      ballY = H - 8;
    }
    if (ballY > H) { stop(); onExit(); return; }
    draw();
  }

  function start() {
    paddleX = 40;
    ballX = W / 2;
    ballY = H / 2;
    ballVX = 2;
    ballVY = 2;
    timer = setInterval(update, 30);
    draw();
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function handleKey(key) {
    if (key === 'left') paddleX = Math.max(0, paddleX - 10);
    else if (key === 'right') paddleX = Math.min(W - 40, paddleX + 10);
  }

  return { id: 'pong', name: 'Pong', start, stop, handleKey };
}
