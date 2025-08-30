export default function createSnake(ctx, W, H, onExit) {
  let timer = null;
  let snake = [];
  let dir = { x: 1, y: 0 };
  let food = { x: 0, y: 0 };

  function placeFood() {
    while (true) {
      const fx = Math.floor(Math.random() * 15);
      const fy = Math.floor(Math.random() * 20);
      if (!snake.some(s => s.x === fx && s.y === fy)) { food = { x: fx, y: fy }; break; }
    }
  }

  function draw() {
    ctx.fillStyle = '#001';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#0f0';
    snake.forEach(s => ctx.fillRect(s.x * 8, s.y * 8, 8, 8));
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * 8, food.y * 8, 8, 8);
  }

  function update() {
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    head.x = (head.x + 15) % 15;
    head.y = (head.y + 20) % 20;
    if (snake.some(s => s.x === head.x && s.y === head.y)) { stop(); onExit(); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) placeFood(); else snake.pop();
    draw();
  }

  function start() {
    snake = [{ x: 5, y: 5 }];
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

