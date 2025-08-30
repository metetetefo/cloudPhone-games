const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

let state = 'menu';
let menuIndex = 0;
const menuItems = ['Snake', 'Pong'];
let snakeTimer = null;
let pongTimer = null;
let snake, dir, food;
let paddleX, ballX, ballY, ballVX, ballVY;

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  if (state === 'menu') drawMenu();
  else if (state === 'snake') drawSnake();
  else if (state === 'pong') drawPong();
}

function drawMenu() {
  ctx.fillStyle = '#0af';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Mini Games', W / 2, 30);
  menuItems.forEach((item, i) => {
    ctx.fillStyle = i === menuIndex ? '#fff' : '#0af';
    ctx.fillText(item, W / 2, 60 + i * 20);
  });
}

function startMenu() {
  state = 'menu';
  clearInterval(snakeTimer);
  clearInterval(pongTimer);
  draw();
}

/* SNAKE */
function startSnake() {
  state = 'snake';
  snake = [{ x: 5, y: 5 }];
  dir = { x: 1, y: 0 };
  placeFood();
  snakeTimer = setInterval(updateSnake, 150);
  draw();
}
function placeFood() {
  food = { x: Math.floor(Math.random() * 15), y: Math.floor(Math.random() * 20) };
}
function updateSnake() {
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  head.x = (head.x + 15) % 15;
  head.y = (head.y + 20) % 20;
  if (snake.some(s => s.x === head.x && s.y === head.y)) return startMenu();
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) placeFood(); else snake.pop();
  draw();
}
function drawSnake() {
  ctx.fillStyle = '#001';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0f0';
  snake.forEach(s => ctx.fillRect(s.x * 8, s.y * 8, 8, 8));
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * 8, food.y * 8, 8, 8);
}

/* PONG */
function startPong() {
  state = 'pong';
  paddleX = 40;
  ballX = W / 2;
  ballY = H / 2;
  ballVX = 2;
  ballVY = 2;
  pongTimer = setInterval(updatePong, 30);
  draw();
}
function updatePong() {
  ballX += ballVX;
  ballY += ballVY;
  if (ballX <= 0 || ballX >= W) ballVX *= -1;
  if (ballY <= 0) ballVY *= -1;
  if (ballY >= H - 8 && ballX >= paddleX && ballX <= paddleX + 40) {
    ballVY *= -1;
    ballY = H - 8;
  }
  if (ballY > H) return startMenu();
  draw();
}
function drawPong() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddleX, H - 8, 40, 5);
  ctx.fillRect(ballX - 2, ballY - 2, 4, 4);
}

function handleKey(key) {
  if (state === 'menu') {
    if (key === 'up') menuIndex = (menuIndex + menuItems.length - 1) % menuItems.length;
    else if (key === 'down') menuIndex = (menuIndex + 1) % menuItems.length;
    else if (key === 'select') {
      if (menuItems[menuIndex] === 'Snake') startSnake();
      else startPong();
    }
  } else if (state === 'snake') {
    if (key === 'up' && dir.y === 0) dir = { x: 0, y: -1 };
    else if (key === 'down' && dir.y === 0) dir = { x: 0, y: 1 };
    else if (key === 'left' && dir.x === 0) dir = { x: -1, y: 0 };
    else if (key === 'right' && dir.x === 0) dir = { x: 1, y: 0 };
    else if (key === 'soft1' || key === 'back') startMenu();
  } else if (state === 'pong') {
    if (key === 'left') paddleX = Math.max(0, paddleX - 10);
    else if (key === 'right') paddleX = Math.min(W - 40, paddleX + 10);
    else if (key === 'soft1' || key === 'back') startMenu();
  }
  draw();
}

// Button bindings
const buttons = document.querySelectorAll('[data-key]');
buttons.forEach(b => b.addEventListener('click', () => handleKey(b.dataset.key)));

document.addEventListener('keydown', e => {
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Enter: 'select',
    Escape: 'back'
  };
  const k = map[e.key];
  if (k) {
    e.preventDefault();
    handleKey(k);
  }
});

startMenu();
