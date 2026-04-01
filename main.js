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

    // Entrance animation — letters cascade up on load
    var allChars = Array.from(hero.querySelectorAll('.split-char'));
    allChars.forEach(function (char) {
      char.style.opacity   = '0';
      char.style.transform = 'translateY(24px)';
    });

    // Double rAF ensures initial state is painted before transition starts
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        allChars.forEach(function (char, i) {
          var delay = i * 45;
          char.style.transition = 'opacity 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ' + delay + 'ms, '
                                + 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ' + delay + 'ms';
          char.style.opacity   = '1';
          char.style.transform = 'translateY(0)';
        });
      });
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
   HERO DESCRIPTOR — LETTER CASCADE
   ============================================================ */

(function () {
  var desc = document.querySelector('.hero__descriptor');
  if (!desc) return;

  var text  = desc.textContent;
  desc.innerHTML = '';

  var letters = [];

  // Group chars by word in nowrap spans — prevents mid-word line breaks
  text.split(' ').forEach(function (word, wi, words) {
    var wordSpan = document.createElement('span');
    wordSpan.style.whiteSpace = 'nowrap';

    word.split('').forEach(function (char) {
      var span = document.createElement('span');
      span.style.display   = 'inline-block';
      span.style.opacity   = '0';
      span.style.transform = 'translateY(20px)';
      span.textContent     = char;
      wordSpan.appendChild(span);
      letters.push(span);
    });

    desc.appendChild(wordSpan);

    if (wi < words.length - 1) {
      var space = document.createElement('span');
      space.style.display   = 'inline-block';
      space.style.opacity   = '0';
      space.style.transform = 'translateY(20px)';
      space.textContent     = '\u00A0';
      desc.appendChild(space);
      letters.push(space);
    }
  });

  // Start after the name has begun — 500ms base delay, 35ms stagger per letter
  var BASE_DELAY = 500;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      letters.forEach(function (span, i) {
        var delay = BASE_DELAY + i * 35;
        span.style.transition = 'opacity 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ' + delay + 'ms, '
                              + 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ' + delay + 'ms';
        span.style.opacity   = '1';
        span.style.transform = 'translateY(0)';
      });
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
   HAMBURGER MENU — MOBILE ONLY
   ============================================================ */

(function () {
  var btn   = document.getElementById('hamburgerBtn');
  var menu  = document.getElementById('mobileMenu');
  var close = document.getElementById('mobileMenuClose');
  if (!btn || !menu || !close) return;

  btn.addEventListener('click', function () {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
  });

  close.addEventListener('click', function () {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
  });

  // Close when a link is tapped
  menu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
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
    const parallaxY = (0.5 - progress) * 60;

    // ── ZOOM: in → hold through flip → out ───────────────────────────────────
    const ZOOM_SCALE    = 1.3;
    const ZOOM_IN_DIST  = 600;
    const ZOOM_OUT_DIST = 400;
    const flipStart     = sectionTop + vh * 0.65;
    const flipEnd       = flipStart + FLIP_DISTANCE;
    const zoomOutEnd    = flipEnd + ZOOM_OUT_DIST;

    let scale;
    if      (scrollY <= sectionTop)              { scale = 1; }
    else if (scrollY <= sectionTop + ZOOM_IN_DIST) { scale = 1 + (ZOOM_SCALE - 1) * ((scrollY - sectionTop) / ZOOM_IN_DIST); }
    else if (scrollY <= flipEnd)                 { scale = ZOOM_SCALE; }
    else if (scrollY <= zoomOutEnd)              { scale = ZOOM_SCALE - (ZOOM_SCALE - 1) * ((scrollY - flipEnd) / ZOOM_OUT_DIST); }
    else                                         { scale = 1; }

    scene.style.transform = `translateY(${parallaxY.toFixed(1)}px) scale(${scale.toFixed(3)})`;

    // ── CARD FLIP: rotateY 0 → 180 over FLIP_DISTANCE px of scroll ──────────
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

  // ---- AUTO LOOP ----
  // Last card: 0.48s delay + 1.3s duration ≈ 1.78s to fully settle
  var TRANSITION_SETTLE = 1800;
  var SCATTER_HOLD      = 2400;
  var STACK_HOLD        = 1000;

  var looping = false;

  function loop() {
    scatter();
    setTimeout(function () {
      unscatter();
      setTimeout(function () {
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
   TETRIS PLACEHOLDER — removed, to be rebuilt
   ============================================================ */
/*
(function () {
  const canvas = document.getElementById('tetrisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLS = 10;
  const ROWS = 20;
  const CELL = window.innerWidth < 768 ? 18 : 28;
  canvas.width  = COLS * CELL;
  canvas.height = ROWS * CELL;

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
*/


