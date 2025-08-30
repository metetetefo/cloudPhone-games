import createSnake from './games/snake.js';
import createPong from './games/pong.js';
import createBreakout from './games/breakout.js';
import createFlappy from './games/flappy.js';
import createDodge from './games/dodge.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const SAFE = { top: 4, bottom: 14, left: 4, right: 4 };
const VIEW = {
  x: SAFE.left,
  y: SAFE.top,
  w: W - SAFE.left - SAFE.right,
  h: H - SAFE.top - SAFE.bottom,
};
const SAFE = { top: 4, bottom: 14, left: 4, right: 4 };

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

  const MX = VIEW.x;
  const MY = VIEW.y;
  const MW = VIEW.w;
  const MH = VIEW.h;

  // Title & hint inside safe area
  ctx.fillStyle = '#0cf';
  ctx.font = '7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CloudPhone Games', MX + MW / 2, MY + 8);
  ctx.fillStyle = '#7cf';
  ctx.font = '5px monospace';
  ctx.fillText('Arrows+Enter | 1-5', MX + MW / 2, MY + 14);

  // Items
  ctx.textAlign = 'left';
  const startY = MY + 22;
  const gapY = 14;
  for (let i = 0; i < games.length; i++) {
    const y = startY + i * gapY;
    const isSel = i === menuIndex;
    if (isSel) {
      ctx.fillStyle = '#112';
      ctx.fillRect(MX + 4, y - 7, MW - 8, 10);
      ctx.strokeStyle = '#39f';
      ctx.strokeRect(MX + 4.5, y - 6.5, MW - 9, 9);
    }
    ctx.fillStyle = isSel ? '#fff' : '#bcd';
    ctx.font = '7px monospace';
    ctx.fillText(`${i + 1}. ${games[i].name}`, MX + 8, y);
  }

  // Footer inside safe area
  ctx.textAlign = 'center';
  ctx.fillStyle = '#89a';
  ctx.font = '5px monospace';
  ctx.fillText('Esc/0 menu', MX + MW / 2, MY + MH - 2);
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

// Build game list using viewport and offset
games = [
  createSnake(ctx, VIEW.w, VIEW.h, returnToMenu, VIEW),
  createPong(ctx, VIEW.w, VIEW.h, returnToMenu, VIEW),
  createBreakout(ctx, VIEW.w, VIEW.h, returnToMenu, VIEW),
  createFlappy(ctx, VIEW.w, VIEW.h, returnToMenu, VIEW),
  createDodge(ctx, VIEW.w, VIEW.h, returnToMenu, VIEW),
];

startMenu();
