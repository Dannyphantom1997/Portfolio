/* ============================================================
   SPLIT TEXT EFFECT
   ============================================================ */

(function () {
  var MAX_MOVE = 50;
  var FALLOFF  = 0.15;

  function buildSplitLine(text, parentEl) {
    var lineEl = document.createElement('div');
    lineEl.className = 'split-text-line';

    var charObjs = [];

    text.split('').forEach(function (char) {
      var charEl = document.createElement('div');
      charEl.className = 'split-char';

      var display = char === ' ' ? '\u00A0' : char;

      var topSpan = document.createElement('span');
      topSpan.className   = 'split-char__top';
      topSpan.textContent = display;

      var bottomOuter = document.createElement('span');
      bottomOuter.className = 'split-char__bottom';
      var bottomInner = document.createElement('span');
      bottomInner.textContent = display;
      bottomOuter.appendChild(bottomInner);

      charEl.appendChild(topSpan);
      charEl.appendChild(bottomOuter);
      lineEl.appendChild(charEl);
      charObjs.push({ el: charEl, top: topSpan, bottom: bottomOuter });
    });

    charObjs.forEach(function (obj, i) {
      obj.el.addEventListener('mouseenter', function () {
        charObjs.forEach(function (other, j) {
          var distance = Math.abs(j - i);
          var offset   = Math.max(0, MAX_MOVE * (1 - distance * FALLOFF));
          other.top.style.transform    = 'translateY(-' + offset + '%)';
          other.bottom.style.transform = 'translateY('  + offset + '%)';
        });
      });
    });

    lineEl.addEventListener('mouseleave', function () {
      charObjs.forEach(function (obj) {
        obj.top.style.transform    = 'translateY(0)';
        obj.bottom.style.transform = 'translateY(0)';
      });
    });

    parentEl.appendChild(lineEl);
  }

  // Hero name — two lines
  var hero = document.querySelector('.hero__name');
  if (hero) {
    hero.innerHTML = '';
    ['Sascha', 'Thompson'].forEach(function (word) {
      buildSplitLine(word, hero);
    });
  }

  // Section headings — single line each
  ['#work h2', '#code h2', '#about h2'].forEach(function (selector) {
    var el = document.querySelector(selector);
    if (!el) return;
    var text = el.textContent;
    el.innerHTML = '';
    buildSplitLine(text, el);
  });
}());


/* ============================================================
   HERO DESCRIPTOR — SCATTER HOVER
   ============================================================ */

(function () {
  var SCATTER = [
    { x: -15, y:  60, r:   8 },
    { x: -30, y:  30, r:   4 },
    { x: -20, y:  40, r:  -6 },
    { x:   0, y:   8, r:  -8 },
    { x:   0, y: -20, r:   5 },
    { x:   0, y:  20, r:  -3 },
    { x:   0, y: -40, r:  -5 },
    { x:   0, y:  15, r:  10 },
    { x:  10, y: -30, r:   7 },
    { x:  20, y:  50, r:  -9 },
    { x: -10, y: -15, r:   3 },
    { x:  15, y:  25, r:  -7 },
    { x: -25, y: -35, r:   6 },
    { x:   5, y:  45, r:  -4 },
    { x:  -5, y: -50, r:   9 },
    { x:  25, y:  10, r:  -2 },
    { x: -20, y: -20, r:   5 },
    { x:  30, y: -10, r:  -8 },
    { x: -35, y:  35, r:   3 },
    { x:  10, y:  60, r:  -6 },
  ];

  var desc = document.querySelector('.hero__descriptor');
  if (!desc) return;

  var text = desc.textContent;
  desc.innerHTML = '';

  var outers = [];

  // Group chars by word inside nowrap spans — prevents mid-word line breaks
  var words = text.split(' ');
  words.forEach(function (word, wi) {
    var wordSpan = document.createElement('span');
    wordSpan.style.whiteSpace = 'nowrap';

    word.split('').forEach(function (char) {
      var outer  = document.createElement('span');
      outer.className = 'fancy-word__outer';
      var inner  = document.createElement('span');
      inner.className = 'fancy-word__inner';
      var letter = document.createElement('span');
      letter.className   = 'fancy-word__letter';
      letter.textContent = char;
      inner.appendChild(letter);
      outer.appendChild(inner);
      wordSpan.appendChild(outer);
      outers.push(outer);
    });

    desc.appendChild(wordSpan);

    // Space between words (outside nowrap span so words can wrap normally)
    if (wi < words.length - 1) {
      var spaceOuter = document.createElement('span');
      spaceOuter.className = 'fancy-word__outer';
      var spaceInner = document.createElement('span');
      spaceInner.className = 'fancy-word__inner';
      var spaceLetter = document.createElement('span');
      spaceLetter.className = 'fancy-word__letter';
      spaceLetter.textContent = '\u00A0';
      spaceInner.appendChild(spaceLetter);
      spaceOuter.appendChild(spaceInner);
      desc.appendChild(spaceOuter);
      outers.push(spaceOuter);
    }
  });

  desc.addEventListener('mouseenter', function () {
    outers.forEach(function (outer, i) {
      var t = SCATTER[i % SCATTER.length];
      outer.style.transform =
        'translateX(' + t.x + '%) translateY(' + t.y + '%) rotate(' + t.r + 'deg)';
    });
  });

  desc.addEventListener('mouseleave', function () {
    outers.forEach(function (outer) {
      outer.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
    });
  });
}());


/* ============================================================
   NAV ACCORDION
   ============================================================ */

(function () {
  const accordion = document.querySelector('.nav__accordion');
  const panels    = accordion ? Array.from(accordion.querySelectorAll('.accordion__panel')) : [];

  if (!panels.length) return;

  function setActive(panel) {
    panels.forEach(p => p.classList.remove('is-active'));
    panel.classList.add('is-active');
  }

  panels.forEach(panel => {
    // Expand on hover
    panel.addEventListener('mouseenter', () => setActive(panel));

    // Smooth-scroll on click (href already set on <a>; this ensures behaviour
    // on browsers that don't support scroll-behavior: smooth natively)
    panel.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(panel.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // When the mouse leaves the whole accordion, keep last active panel open
  // (no collapse — matches the reference component's feel)
}());


/* ============================================================
   FOOTER WAVE
   ============================================================ */

(function () {
  const container = document.getElementById('waveContainer');
  const footer    = document.getElementById('footer');
  if (!container || !footer) return;

  const BAR_COUNT = 23;
  const bars = [];

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.style.cssText = [
      `height:${i + 1}px`,
      'background-color:#f85a41',
      'transition:transform 0.1s ease',
      'will-change:transform',
      'margin-top:-2px',
    ].join(';');
    container.appendChild(bar);
    bars.push(bar);
  }

  let t = 0;
  let rafId = null;

  function animateWave() {
    let offset = 0;
    bars.forEach(function (bar, index) {
      offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
      bar.style.transform = 'translateY(' + (index + offset) + 'px)';
    });
    t += 0.1;
    rafId = requestAnimationFrame(animateWave);
  }

  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      animateWave();
    } else {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }
  }, { threshold: 0.2 });

  observer.observe(footer);
}());


/* ============================================================
   RESUME SCROLL REVEAL — PARALLAX + FADE IN/OUT + CARD FLIP
   ============================================================ */

(function () {
  const scene   = document.querySelector('.resume__scene');
  const card    = document.querySelector('.resume__card');
  const floatEl = document.querySelector('.resume__float');
  if (!scene || !card || !floatEl) return;

  if (window.matchMedia('(max-width: 768px)').matches) return;

  // How many px of scroll the page-flip spans
  const FLIP_DISTANCE = 800;

  function update() {
    const sectionTop = floatEl.getBoundingClientRect().top + window.scrollY;
    const sectionH   = floatEl.offsetHeight;
    const scrollY    = window.scrollY;
    const vh         = window.innerHeight;

    // 0 = section top at viewport top  /  1 = section bottom at viewport top
    const progress = Math.min(Math.max((scrollY - sectionTop) / sectionH, 0), 1);

    // ── FADE IN: delayed — starts when section is ~70% into viewport ─────────
    const scrollSinceVisible = scrollY - (sectionTop - vh * 0.3);
    const fadeIn  = Math.min(Math.max(scrollSinceVisible / 500, 0), 1);

    // ── FADE OUT: gradual over last 500 px ───────────────────────────────────
    const distanceToEnd = (sectionTop + sectionH) - scrollY;
    const fadeOut = Math.min(Math.max(distanceToEnd / 500, 0), 1);

    scene.style.opacity = (Math.min(fadeIn, fadeOut)).toFixed(3);

    // ── PARALLAX: scene drifts ~60 px upward across the full section ─────────
    // +30 px when entering  →  −30 px when exiting
    const parallaxY = (0.5 - progress) * 60;
    scene.style.transform = `translateY(${parallaxY.toFixed(1)}px)`;

    // ── CARD FLIP: rotateY 0 → 180 over FLIP_DISTANCE px of scroll ──────────
    const flipStart    = sectionTop + vh * 0.65;
    const flipProgress = Math.min(Math.max((scrollY - flipStart) / FLIP_DISTANCE, 0), 1);
    card.style.transform = `rotateY(${flipProgress * 180}deg)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}());


/* ============================================================
   POLAROID STRIP — LOOPING SCATTER + HOVER
   ============================================================ */

(function () {
  const strip = document.getElementById('polaroidStrip');
  if (!strip) return;

  const cards = Array.from(strip.querySelectorAll('.polaroid-card'));

  // Fixed scattered positions per card
  var SCATTER = [
    { left: '10%', transform: 'translate(-50%, calc(-50% - 12px)) rotate(-9deg)' },
    { left: '28%', transform: 'translate(-50%, calc(-50% + 10px)) rotate(5deg)'  },
    { left: '50%', transform: 'translate(-50%, -50%) rotate(-2deg)'               },
    { left: '70%', transform: 'translate(-50%, calc(-50% + 14px)) rotate(8deg)'  },
    { left: '88%', transform: 'translate(-50%, calc(-50% - 8px)) rotate(-6deg)'  },
  ];

  // Allow pointer events on the cards themselves so hover works
  cards.forEach(function (card) { card.style.pointerEvents = 'auto'; });

  function scatter() {
    cards.forEach(function (card, i) {
      card.style.left      = SCATTER[i].left;
      card.style.transform = SCATTER[i].transform;
    });
    strip.classList.add('is-scattered');
  }

  function unscatter() {
    cards.forEach(function (card) {
      card.style.left      = '';
      card.style.transform = '';
    });
    strip.classList.remove('is-scattered');
  }

  // ---- HOVER ----
  var hoverDebounce = null;
  var isHovered     = false;

  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      isHovered = true;
      clearTimeout(hoverDebounce);
      scatter();
    });
    card.addEventListener('mouseleave', function () {
      // Small debounce so moving between cards doesn't flicker
      hoverDebounce = setTimeout(function () {
        isHovered = false;
        unscatter();
      }, 150);
    });
  });

  // ---- AUTO LOOP ----
  // Last card: 0.48s delay + 1.3s duration ≈ 1.78s to fully settle
  var TRANSITION_SETTLE = 1800;
  var SCATTER_HOLD      = 2400;
  var STACK_HOLD        = 1000;

  var looping     = false;
  var loopTimeout = null;

  function loop() {
    if (isHovered) {
      loopTimeout = setTimeout(loop, 500);
      return;
    }
    scatter();
    loopTimeout = setTimeout(function () {
      if (!isHovered) unscatter();
      loopTimeout = setTimeout(function () {
        if (looping) loop();
      }, TRANSITION_SETTLE + STACK_HOLD);
    }, TRANSITION_SETTLE + SCATTER_HOLD);
  }

  var triggered = false;

  function check() {
    if (triggered) return;
    var rect = strip.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      triggered = true;
      looping   = true;
      loop();
      window.removeEventListener('scroll', check);
    }
  }

  window.addEventListener('scroll', check, { passive: true });
}());


/* ============================================================
   LOGO FLOATERS — SCROLL-DRIVEN FLOAT PAST RESUME
   ============================================================ */

(function () {
  const floatEl = document.querySelector('.resume__float');
  if (!floatEl) return;

  // Only run on wide enough viewports where there's room beside the resume
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const imgs = Array.from(floatEl.querySelectorAll('.logo-floater'));
  if (!imgs.length) return;

  // Each entry: which image, horizontal position (% from left), scroll start
  // (fraction of the section's height), and travel speed multiplier.
  // Odd indices hug the left gutter, even indices hug the right gutter.
  const CONFIG = [
    { el: imgs[0], x: '4%',  start: 0.04, speed: 1.0,  rot: -12 }, // Garmin      — left
    { el: imgs[1], x: '81%', start: 0.10, speed: 0.95, rot:  18 }, // SportChek   — right
    { el: imgs[2], x: '7%',  start: 0.20, speed: 1.05, rot:  22 }, // Run Calgary — left
    { el: imgs[3], x: '85%', start: 0.30, speed: 1.0,  rot:  -8 }, // Sait        — right
    { el: imgs[4], x: '3%',  start: 0.42, speed: 1.1,  rot: -20 }, // Sportsnet   — left
    { el: imgs[5], x: '80%', start: 0.52, speed: 0.9,  rot:  14 }, // Olympics    — right
    { el: imgs[6], x: '10%', start: 0.62, speed: 1.05, rot: -16 }, // Gateway     — left
  ];

  // Fix horizontal positions and rotations (only vertical + opacity change on scroll)
  CONFIG.forEach(function (f) {
    f.el.style.left      = f.x;
    f.el.style.transform = 'rotate(' + f.rot + 'deg)';
  });

  // Track whether the resume section is in view at all
  let isActive = false;

  const observer = new IntersectionObserver(function (entries) {
    isActive = entries[0].isIntersecting;
    if (!isActive) {
      CONFIG.forEach(function (f) { f.el.style.opacity = '0'; });
    }
  }, { threshold: 0 });

  observer.observe(floatEl);

  function update() {
    if (!isActive) return;

    const sectionTop = floatEl.getBoundingClientRect().top + window.scrollY;
    const sectionH   = floatEl.offsetHeight;
    const scrollY    = window.scrollY;
    const vh         = window.innerHeight;

    CONFIG.forEach(function (f) {
      // How far the user has scrolled past this logo's personal trigger point
      const triggerScrollY = sectionTop + f.start * sectionH;
      const localScroll    = (scrollY - triggerScrollY) * f.speed;

      // yTop: screen-space Y of the logo's top edge.
      // Starts just below the fold and climbs as localScroll increases.
      const yTop = vh + 60 - localScroll;

      // Off the bottom (not started) or off the top (done) — hide completely
      if (localScroll < 0 || yTop < -130) {
        f.el.style.opacity = '0';
        return;
      }

      f.el.style.top = yTop + 'px';

      // Fade in: ramp from 0 → 1 over the first 180px of travel
      const fadeIn  = Math.min(localScroll / 180, 1);
      // Fade out: ramp from 1 → 0 as yTop drops below 130px (near top of viewport)
      const fadeOut = yTop < 130 ? Math.max(yTop / 130, 0) : 1;

      f.el.style.opacity = (Math.min(fadeIn, fadeOut) * 1.0).toFixed(3);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}());


/* ============================================================
   TETRIS EASTER EGG — inline beside Contact section
   ============================================================ */

(function () {
  const canvas = document.getElementById('tetrisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLS = 10;
  const ROWS = 20;
  const CELL = 20;

  // All seven tetrominoes
  const SHAPES = [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
    [[1,1],[1,1]],                               // O
    [[0,1,0],[1,1,1],[0,0,0]],                  // T
    [[0,1,1],[1,1,0],[0,0,0]],                  // S
    [[1,1,0],[0,1,1],[0,0,0]],                  // Z
    [[1,0,0],[1,1,1],[0,0,0]],                  // J
    [[0,0,1],[1,1,1],[0,0,0]],                  // L
  ];

  let board, piece, score, level, lines, paused, over, dropInterval, dropCounter, lastTime, rafId;

  function init() {
    board        = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
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
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      shape: shape,
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0,
    };
  }

  function rotate(shape) {
    const rows = shape.length, cols = shape[0].length;
    const out = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out[c][rows - 1 - r] = shape[r][c];
      }
    }
    return out;
  }

  function valid(shape, px, py) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const nx = px + c, ny = py + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
    }
    return true;
  }

  function place() {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const ny = piece.y + r, nx = piece.x + c;
        if (ny < 0) { over = true; return; }
        board[ny][nx] = 1;
      }
    }
    clearLines();
    piece = spawn();
    if (!valid(piece.shape, piece.x, piece.y)) over = true;
  }

  function clearLines() {
    const pts = [0, 100, 300, 500, 800];
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every(function (v) { return v !== 0; })) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }
    if (cleared) {
      score += (pts[cleared] || 800) * level;
      lines += cleared;
      level  = Math.floor(lines / 10) + 1;
      dropInterval = Math.max(100, 1000 - (level - 1) * 80);
      updateStats();
    }
  }

  var best = 15000;

  function updateStats() {
    var s  = document.getElementById('tetrisScore');
    var lv = document.getElementById('tetrisLevel');
    var ln = document.getElementById('tetrisLines');
    var bs = document.getElementById('tetrisBest');
    if (s)  s.textContent  = score;
    if (lv) lv.textContent = level;
    if (ln) ln.textContent = lines;
    if (score > best) best = score;
    if (bs) bs.textContent = best.toLocaleString();
  }

  function ghostY() {
    var gy = piece.y;
    while (valid(piece.shape, piece.x, gy + 1)) gy++;
    return gy;
  }

  function draw() {
    // Clear to page background colour
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Landed pieces — whole cells, no gaps
    ctx.fillStyle = '#c4472f';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }

    if (!over) {
      // Ghost piece — outline only, no fill
      const gy = ghostY();
      ctx.strokeStyle = 'rgba(248,90,65,0.35)';
      ctx.lineWidth = 1;
      piece.shape.forEach(function (row, r) {
        row.forEach(function (v, c) {
          if (v) ctx.strokeRect((piece.x + c) * CELL + 0.5, (gy + r) * CELL + 0.5, CELL - 1, CELL - 1);
        });
      });

      // Active piece — whole cells, no gaps
      ctx.fillStyle = '#f85a41';
      piece.shape.forEach(function (row, r) {
        row.forEach(function (v, c) {
          if (v) ctx.fillRect((piece.x + c) * CELL, (piece.y + r) * CELL, CELL, CELL);
        });
      });
    }

    // Pause overlay
    if (paused) {
      ctx.fillStyle = 'rgba(237,233,225,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f85a41';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }

    // Game over overlay
    if (over) {
      ctx.fillStyle = 'rgba(237,233,225,0.88)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f85a41';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 18);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = 'rgba(248,90,65,0.7)';
      ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 14);
    }
  }

  function loop(time) {
    const delta = time - lastTime;
    lastTime = time;

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

  // ── Keyboard controls ─────────────────────────────────────────
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
          piece.y++;
          score += 1;
          updateStats();
        }
        e.preventDefault(); break;
      case 'ArrowUp':
        if (!paused && !over) {
          const rotated = rotate(piece.shape);
          if (valid(rotated, piece.x, piece.y)) piece.shape = rotated;
        }
        e.preventDefault(); break;
      case 'Space':
        if (!paused && !over) {
          while (valid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 2; }
          place();
          updateStats();
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

  // ── Touch / button controls ───────────────────────────────────
  function bindBtn(id, action) {
    const btn = document.getElementById(id);
    if (!btn) return;
    function fire(e) { e.preventDefault(); action(); }
    btn.addEventListener('click', fire);
    btn.addEventListener('touchstart', fire, { passive: false });
  }

  bindBtn('tetrisLeft',  function () {
    if (!paused && !over && valid(piece.shape, piece.x - 1, piece.y)) piece.x--;
  });
  bindBtn('tetrisRight', function () {
    if (!paused && !over && valid(piece.shape, piece.x + 1, piece.y)) piece.x++;
  });
  bindBtn('tetrisUp',    function () {
    if (!paused && !over) { const r = rotate(piece.shape); if (valid(r, piece.x, piece.y)) piece.shape = r; }
  });
  bindBtn('tetrisDown',  function () {
    if (!paused && !over && valid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 1; updateStats(); }
  });
  bindBtn('tetrisSpace', function () {
    if (!paused && !over) {
      while (valid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 2; }
      place();
      updateStats();
    }
  });

  init();
}());


/* ============================================================
   P.S. NOTE — draw-on reveal
   ============================================================ */

(function () {
  const psNote  = document.getElementById('psNote');
  const section = document.getElementById('contact');
  if (!psNote || !section) return;

  psNote.innerHTML =
    '<span class="ps-line ps-line-1">P.S. Think you can beat my score? No pressure either way \u2014</span>' +
    '<span class="ps-line ps-line-2">the email works too.</span>';

  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      psNote.classList.add('ps-draw');
      observer.disconnect();
    }
  }, { threshold: 0.25 });
  observer.observe(section);
}());
