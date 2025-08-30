import createSnake from './games/snake.js';
import createPong from './games/pong.js';
import createBreakout from './games/breakout.js';
import createFlappy from './games/flappy.js';
import createDodge from './games/dodge.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

let state = 'menu';
let menuIndex = 0;
let currentGame = null;
let games = [];

function returnToMenu() {
  if (currentGame && currentGame.stop) {
    try { currentGame.stop(); } catch {}
  }
  currentGame = null;
  startMenu();
}

function startMenu() {
  state = 'menu';
  drawMenu();
}

function drawMenu() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0cf';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CloudPhone Games', W / 2, 18);
  ctx.fillStyle = '#7cf';
  ctx.font = '6px monospace';
  ctx.fillText('Use arrows + Enter  |  1-5', W / 2, 28);

  ctx.textAlign = 'left';
  for (let i = 0; i < games.length; i++) {
    const y = 48 + i * 20;
    const isSel = i === menuIndex;
    if (isSel) {
      ctx.fillStyle = '#112';
      ctx.fillRect(10, y - 10, W - 20, 16);
      ctx.strokeStyle = '#39f';
      ctx.strokeRect(10.5, y - 9.5, W - 21, 15);
    }
    ctx.fillStyle = isSel ? '#fff' : '#bcd';
    ctx.font = '8px monospace';
    ctx.fillText(`${i + 1}. ${games[i].name}`, 16, y);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#89a';
  ctx.font = '6px monospace';
  ctx.fillText('Esc/0 to return here', W / 2, H - 8);
}

function startSelected(index) {
  if (!games[index]) return;
  state = 'play';
  currentGame = games[index];
  currentGame.start();
}

function handleKey(key) {
  if (state === 'menu') {
    if (key === 'up') { menuIndex = (menuIndex - 1 + games.length) % games.length; drawMenu(); }
    else if (key === 'down') { menuIndex = (menuIndex + 1) % games.length; drawMenu(); }
    else if (key === 'select') { startSelected(menuIndex); }
  } else if (state === 'play' && currentGame) {
    if (key === 'back') returnToMenu();
    else if (currentGame.handleKey) currentGame.handleKey(key);
  }
}

document.addEventListener('keydown', e => {
  // Quick start with number keys
  if (e.key >= '1' && e.key <= '5') {
    e.preventDefault();
    const idx = parseInt(e.key, 10) - 1;
    startSelected(idx);
    return;
  }
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Enter: 'select',
    Escape: 'back',
    '0': 'back',
    ' ': 'flap',
  };
  const k = map[e.key];
  if (k) {
    e.preventDefault();
    handleKey(k);
  }
});

// Build game list
games = [
  createSnake(ctx, W, H, returnToMenu),
  createPong(ctx, W, H, returnToMenu),
  createBreakout(ctx, W, H, returnToMenu),
  createFlappy(ctx, W, H, returnToMenu),
  createDodge(ctx, W, H, returnToMenu),
];

startMenu();
