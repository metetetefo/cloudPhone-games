export default function createSnake(ctx, W, H, onExit, offset = { x: 0, y: 0 }) {
  let timer = null;
  let snake = [];
  let dir = { x: 1, y: 0 };
  let food = { x: 0, y: 0 };
  const CELL = 8;
  let GRID_W = Math.floor(W / CELL);
  let GRID_H = Math.floor(H / CELL);

  function placeFood() {
    while (true) {
      const fx = Math.floor(Math.random() * GRID_W);
      const fy = Math.floor(Math.random() * GRID_H);
      if (!snake.some(s => s.x === fx && s.y === fy)) { food = { x: fx, y: fy }; break; }
    }
  }

  function draw() {
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.fillStyle = '#001';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#0f0';
    snake.forEach(s => ctx.fillRect(s.x * CELL, s.y * CELL, CELL, CELL));
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);
    ctx.restore();
  }

  function update() {
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    head.x = (head.x + GRID_W) % GRID_W;
    head.y = (head.y + GRID_H) % GRID_H;
    if (snake.some(s => s.x === head.x && s.y === head.y)) { stop(); onExit(); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) placeFood(); else snake.pop();
    draw();
  }

  function start() {
    GRID_W = Math.floor(W / CELL);
    GRID_H = Math.floor(H / CELL);
    snake = [{ x: Math.max(2, Math.floor(GRID_W / 3)), y: Math.max(2, Math.floor(GRID_H / 2)) }];
    dir = { x: 1, y: 0 };
    placeFood();
    timer = setInterval(update, 150);
    draw();
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function handleKey(key) {
    if (key === 'up' && dir.y === 0) dir = { x: 0, y: -1 };
    else if (key === 'down' && dir.y === 0) dir = { x: 0, y: 1 };
    else if (key === 'left' && dir.x === 0) dir = { x: -1, y: 0 };
    else if (key === 'right' && dir.x === 0) dir = { x: 1, y: 0 };
  }

  return { id: 'snake', name: 'Snake', start, stop, handleKey };
}
