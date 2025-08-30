export default function createFlappy(ctx, W, H, onExit, offset = { x: 0, y: 0 }) {
  let timer = null;
  let birdY = H / 2;
  let birdV = 0;
  let pipes = [];

  const GAP = 42;

  function draw() {
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.fillStyle = '#013';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#0c4';
    for (const p of pipes) {
      ctx.fillRect(p.x, 0, 20, p.gapY);
      ctx.fillRect(p.x, p.gapY + GAP, 20, H - (p.gapY + GAP));
    }
    ctx.fillStyle = '#ff0';
    ctx.fillRect(30 - 3, birdY - 3, 6, 6);
    ctx.restore();
  }

  function update() {
    const GRAV = 0.35;
    const SPEED = 1.5;
    birdV += GRAV;
    birdY += birdV;

    // move pipes
    for (const p of pipes) p.x -= SPEED;
    while (pipes.length && pipes[0].x < -24) pipes.shift();
    if (pipes.length === 0 || pipes[pipes.length - 1].x < W - 70) {
      const gapY = 30 + Math.floor(Math.random() * (H - 60 - GAP));
      pipes.push({ x: W + 20, gapY });
    }

    // collision
    const birdX = 30, r = 3;
    for (const p of pipes) {
      if (birdX + r > p.x && birdX - r < p.x + 20) {
        if (birdY - r < p.gapY || birdY + r > p.gapY + GAP) { stop(); onExit(); return; }
      }
    }
    if (birdY < 0 || birdY > H) { stop(); onExit(); return; }

    draw();
  }

  function start() {
    birdY = H / 2; birdV = 0; pipes = [];
    let x = W + 20;
    for (let i = 0; i < 3; i++) {
      const gapY = 30 + Math.floor(Math.random() * (H - 60 - GAP));
      pipes.push({ x, gapY });
      x += 70;
    }
    timer = setInterval(update, 16);
    draw();
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function handleKey(key) {
    if (key === 'up' || key === 'flap' || key === 'select') { birdV = -3.5; }
  }

  return { id: 'flappy', name: 'Flappy', start, stop, handleKey };
}
