/* ============================================================
   TETRIS — game logic
   ============================================================ */

(function () {
  var canvas = document.getElementById('tetrisCanvas');
  if (!canvas) return;

  var ctx  = canvas.getContext('2d');
  var COLS = 10;
  var ROWS = 20;

  // Cell size matches the CSS width/height set on the canvas
  // Desktop: 240px wide / 10 cols = 24px  |  Mobile: 160px / 10 cols = 16px
  var CELL = window.innerWidth <= 768 ? 16 : 24;

  canvas.width  = COLS * CELL;   // 240 desktop / 160 mobile
  canvas.height = ROWS * CELL;   // 480 desktop / 320 mobile

  // Keep CSS display size in sync
  canvas.style.width  = canvas.width  + 'px';
  canvas.style.height = canvas.height + 'px';

  // ── Piece shapes ──────────────────────────────────────────
  var SHAPES = [
    [[1,1,1,1]],                        // I
    [[1,1],[1,1]],                      // O
    [[0,1,0],[1,1,1]],                  // T
    [[0,1,1],[1,1,0]],                  // S
    [[1,1,0],[0,1,1]],                  // Z
    [[1,0,0],[1,1,1]],                  // J
    [[0,0,1],[1,1,1]],                  // L
  ];

  var board, piece, score, level, lines, paused, over, dropInterval, dropCounter, lastTime, rafId;

  // ── Init / restart ────────────────────────────────────────
  function init() {
    board        = Array.from({ length: ROWS }, function () { return Array(COLS).fill(0); });
    score        = 0;
    level        = 1;
    lines        = 0;
    paused       = false;
    over         = false;
    dropInterval = 1000;
    dropCounter  = 0;
    lastTime     = 0;
    piece        = spawn();
    updateStats();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function spawn() {
    var shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      shape: shape,
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0,
    };
  }

  // ── Collision ─────────────────────────────────────────────
  function valid(shape, ox, oy) {
    for (var r = 0; r < shape.length; r++) {
      for (var c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        var nx = ox + c;
        var ny = oy + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
    }
    return true;
  }

  // ── Rotate ────────────────────────────────────────────────
  function rotate(shape) {
    return shape[0].map(function (_, c) {
      return shape.map(function (row) { return row[c]; }).reverse();
    });
  }

  // ── Place & clear lines ───────────────────────────────────
  function place() {
    piece.shape.forEach(function (row, r) {
      row.forEach(function (v, c) {
        if (v) {
          if (piece.y + r < 0) { over = true; return; }
          board[piece.y + r][piece.x + c] = 1;
        }
      });
    });

    // Clear full rows
    var cleared = 0;
    for (var r = ROWS - 1; r >= 0; r--) {
      if (board[r].every(function (v) { return v; })) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }

    if (cleared) {
      var pts = [0, 100, 300, 500, 800][cleared] || 800;
      score += pts * level;
      lines += cleared;
      level  = Math.floor(lines / 10) + 1;
      dropInterval = Math.max(100, 1000 - (level - 1) * 90);
    }

    if (!over) piece = spawn();
    if (!valid(piece.shape, piece.x, piece.y)) over = true;

    saveBest();
    updateStats();
  }

  // ── Ghost piece ───────────────────────────────────────────
  function ghostY() {
    var gy = piece.y;
    while (valid(piece.shape, piece.x, gy + 1)) gy++;
    return gy;
  }

  // ── Stats ─────────────────────────────────────────────────
  function updateStats() {
    var el;
    el = document.getElementById('tScore'); if (el) el.textContent = score.toLocaleString();
    el = document.getElementById('tLevel'); if (el) el.textContent = level;
    el = document.getElementById('tLines'); if (el) el.textContent = lines;
    el = document.getElementById('tBest');  if (el) el.textContent = (loadBest() || 0).toLocaleString();
  }

  function saveBest() {
    var best = loadBest() || 0;
    if (score > best) localStorage.setItem('tetris_best', score);
  }

  function loadBest() {
    return parseInt(localStorage.getItem('tetris_best'), 10) || 0;
  }

  // ── Draw ─────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Landed pieces
    ctx.fillStyle = '#c4472f';
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (board[r][c]) ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }

    if (!over) {
      // Ghost
      var gy = ghostY();
      ctx.strokeStyle = 'rgba(248,90,65,0.3)';
      ctx.lineWidth = 1;
      piece.shape.forEach(function (row, r) {
        row.forEach(function (v, c) {
          if (v) ctx.strokeRect((piece.x + c) * CELL + 0.5, (gy + r) * CELL + 0.5, CELL - 1, CELL - 1);
        });
      });

      // Active piece
      ctx.fillStyle = '#f85a41';
      piece.shape.forEach(function (row, r) {
        row.forEach(function (v, c) {
          if (v) ctx.fillRect((piece.x + c) * CELL, (piece.y + r) * CELL, CELL, CELL);
        });
      });
    }

    // Paused overlay
    if (paused) {
      ctx.fillStyle = 'rgba(237,233,225,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f85a41';
      ctx.font = 'bold ' + (CELL * 0.9) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }

    // Game-over overlay
    if (over) {
      ctx.fillStyle = 'rgba(237,233,225,0.88)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f85a41';
      ctx.font = 'bold ' + (CELL * 0.9) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - CELL);
      ctx.font = (CELL * 0.58) + 'px sans-serif';
      ctx.fillStyle = 'rgba(248,90,65,0.7)';
      ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + CELL * 0.6);
    }
  }

  // ── Game loop ─────────────────────────────────────────────
  function loop(time) {
    var delta = time - lastTime;
    lastTime  = time;

    if (!paused && !over) {
      dropCounter += delta;
      if (dropCounter >= dropInterval) {
        dropCounter = 0;
        if (valid(piece.shape, piece.x, piece.y + 1)) {
          piece.y++;
        } else {
          place();
        }
      }
    }

    draw();
    rafId = requestAnimationFrame(loop);
  }

  // ── Keyboard ──────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (!piece) return;
    switch (e.code) {
      case 'ArrowLeft':
        if (!paused && !over && valid(piece.shape, piece.x - 1, piece.y)) piece.x--;
        e.preventDefault(); break;
      case 'ArrowRight':
        if (!paused && !over && valid(piece.shape, piece.x + 1, piece.y)) piece.x++;
        e.preventDefault(); break;
      case 'ArrowDown':
        if (!paused && !over && valid(piece.shape, piece.x, piece.y + 1)) {
          piece.y++; score += 1; updateStats();
        }
        e.preventDefault(); break;
      case 'ArrowUp':
        if (!paused && !over) {
          var rot = rotate(piece.shape);
          if (valid(rot, piece.x, piece.y)) piece.shape = rot;
        }
        e.preventDefault(); break;
      case 'Space':
        if (!paused && !over) {
          while (valid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 2; }
          place(); updateStats();
        }
        e.preventDefault(); break;
      case 'KeyP':
        if (!over) paused = !paused;
        break;
      case 'KeyR':
        init();
        break;
    }
  });

  // ── Touch buttons ─────────────────────────────────────────
  function bindBtn(id, action) {
    var btn = document.getElementById(id);
    if (!btn) return;
    function fire(e) { e.preventDefault(); action(); }
    btn.addEventListener('click', fire);
    btn.addEventListener('touchstart', fire, { passive: false });
  }

  bindBtn('tLeft',  function () { if (!paused && !over && valid(piece.shape, piece.x - 1, piece.y)) piece.x--; });
  bindBtn('tRight', function () { if (!paused && !over && valid(piece.shape, piece.x + 1, piece.y)) piece.x++; });
  bindBtn('tDown',  function () {
    if (!paused && !over && valid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 1; updateStats(); }
  });
  bindBtn('tUp',    function () {
    if (!paused && !over) { var rot = rotate(piece.shape); if (valid(rot, piece.x, piece.y)) piece.shape = rot; }
  });
  bindBtn('tDrop',  function () {
    if (!paused && !over) { while (valid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 2; } place(); updateStats(); }
  });

  // ── Start ─────────────────────────────────────────────────
  // Show best score before first game
  var bestEl = document.getElementById('tBest');
  if (bestEl) bestEl.textContent = (loadBest() || 0).toLocaleString();

  init();
}());
