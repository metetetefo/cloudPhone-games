export default function createDodge(ctx, W, H, onExit, offset = { x: 0, y: 0 }) {
  let timer = null;
  let playerX = W / 2 - 6;
  let hazards = [];

  function draw() {
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.fillStyle = '#010';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#6cf';
    ctx.fillRect(playerX, H - 10, 12, 4);
    ctx.fillStyle = '#f55';
    for (const h of hazards) ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.restore();
  }

  function update() {
    if (Math.random() < 0.035) {
      const w = 6 + Math.floor(Math.random() * 16);
      hazards.push({ x: Math.floor(Math.random() * (W - w)), y: -6, w, h: 5, v: 1.2 + Math.random() * 1.8 });
    }
    for (const h of hazards) h.y += h.v;
    hazards = hazards.filter(h => h.y < H + 10);
    const px = playerX, py = H - 10, pw = 12, ph = 4;
    for (const h of hazards) {
      if (px < h.x + h.w && px + pw > h.x && py < h.y + h.h && py + ph > h.y) { stop(); onExit(); return; }
    }
    draw();
  }

  function start() {
    playerX = W / 2 - 6;
    hazards = [];
    timer = setInterval(update, 16);
    draw();
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function handleKey(key) {
    if (key === 'left') playerX = Math.max(0, playerX - 8);
    else if (key === 'right') playerX = Math.min(W - 12, playerX + 8);
  }

  return { id: 'dodge', name: 'Dodge', start, stop, handleKey };
}
