/*
 * Word Drift — mounted inside #game-fullscreen / #gfs-body (from word_drift_v3.html).
 * Exposes wordDriftFullscreenMount(host).
 */
function wordDriftFullscreenMount(host) {
  document.body.classList.add('playroom-wf-open');

  host.className = 'gfs-body gfs-body--worddrift';
  host.setAttribute('data-theme', 'dark');
  host.setAttribute('lang', 'en-GB');
  host.innerHTML =
    '<canvas id="wd-c"></canvas>' +
    '<div id="wd-ch"></div><div id="wd-cv"></div><div id="wd-cdot"></div>' +
    '<div class="wd-ui wd-topbar" id="wd-topbar">' +
      '<button type="button" id="wd-logo" aria-label="Back to home">Ran Song</button>' +
      '<span id="wd-gtitle">Word Drift</span>' +
      '<div id="wd-topr-wrap">' +
        '<div class="wd-topr-lines">' +
          '<span id="wd-top-line1"></span>' +
          '<span id="wd-top-line2"></span>' +
        '</div>' +
        '<button type="button" class="wd-theme-btn" id="wd-theme-toggle">[ LIGHT ]</button>' +
      '</div>' +
    '</div>' +
    '<div class="wd-ui wd-score-panel" id="wd-score-panel">' +
      '<span class="wd-sl">Score</span>' +
      '<span class="wd-sv" id="wd-score-val">000</span>' +
    '</div>' +
    '<div class="wd-ui wd-lives-panel" id="wd-lives-panel">' +
      '<span class="wd-sl">Lives</span>' +
      '<span class="wd-sv" id="wd-lives-val">3 / 3</span>' +
    '</div>' +
    '<div class="wd-bottombar" id="wd-bottombar">' +
      '<span id="wd-word-label">click the letters in order</span>' +
      '<div id="wd-slots"></div>' +
      '<span id="wd-word-progress"></span>' +
      '<span id="wd-hint">find · click · spell</span>' +
    '</div>' +
    '<div id="wd-caught-flash"></div>' +
    '<div id="wd-score-popup"></div>' +
    '<div class="wd-screen wd-screen--hidden" id="wd-lvl-screen">' +
      '<h1 id="wd-lvl-title">Level complete.</h1>' +
      '<p id="wd-lvl-sub"></p>' +
      '<button type="button" class="wd-sbtn" id="wd-next-btn">Continue →</button>' +
    '</div>' +
    '<div class="wd-screen wd-screen--hidden" id="wd-over-screen">' +
      '<h1>The experiment ends.</h1>' +
      '<div id="wd-final-num">000</div>' +
      '<p>final score</p>' +
      '<button type="button" class="wd-sbtn" id="wd-restart-btn">Begin again →</button>' +
    '</div>';

  function qs(id) {
    return host.querySelector('#' + id);
  }

  var pendingTimeouts = [];
  function later(fn, ms) {
    var tid = setTimeout(function() {
      var ix = pendingTimeouts.indexOf(tid);
      if (ix >= 0) pendingTimeouts.splice(ix, 1);
      fn();
    }, ms);
    pendingTimeouts.push(tid);
    return tid;
  }

  function clearLater() {
    pendingTimeouts.forEach(function(t) { clearTimeout(t); });
    pendingTimeouts.length = 0;
  }

  var WD_LIVES_CAP = 3;

  var LEVELS = [
    {
      words: ['chaos', 'order', 'drift', 'flux', 'form', 'void', 'still', 'rise', 'fall', 'change', 'cloud', 'shift'],
      speed: 0.55,
      decoys: 6,
      toCatch: 5,
      desc: 'Letters move slowly. Find your bearings.',
    },
    {
      words: ['dissolve', 'emerge', 'pattern', 'signal', 'gather', 'scatter', 'system', 'filter', 'clarity', 'silence'],
      speed: 0.85,
      decoys: 9,
      toCatch: 5,
      desc: 'The void grows restless.',
    },
    {
      words: ['becoming', 'curiosity', 'structure', 'intention', 'permanence', 'uncertainty', 'experiment'],
      speed: 1.2,
      decoys: 12,
      toCatch: 4,
      desc: 'Chaos at full force.',
    },
  ];

  var canvas = qs('wd-c');
  var ctx = canvas.getContext('2d');
  var W;
  var H;
  /** No word repeats until the level pool has been emptied, then reshuffle fresh. */
  var usedWordsThisLevel = [];
  var WD_PALETTE = {
    bg: '#080806',
    target: '#ffffff',
    targetCur: '#ffffff',
    decoy: '#c8c2b6',
    mote: '#9c968a',
    ring: [240, 236, 228],
    ringAmp: [0.08, 0.04],
    haloStrong: 'rgba(255,255,255,0.45)',
  };

  function resetUsedWordsForLevel() {
    usedWordsThisLevel.length = 0;
  }

  function syncWdPalette() {
    var light = host.getAttribute('data-theme') === 'light';
    if (light) {
      WD_PALETTE.bg = '#ffffff';
      WD_PALETTE.target = '#141412';
      WD_PALETTE.targetCur = '#070706';
      WD_PALETTE.decoy = '#4f4a41';
      WD_PALETTE.mote = '#6f6a61';
      WD_PALETTE.ring = [40, 36, 32];
      WD_PALETTE.ringAmp = [0.12, 0.06];
      WD_PALETTE.haloStrong = 'rgba(14,13,11,0.35)';
    } else {
      WD_PALETTE.bg = '#080806';
      WD_PALETTE.target = '#ffffff';
      WD_PALETTE.targetCur = '#ffffff';
      WD_PALETTE.decoy = '#c8c2b6';
      WD_PALETTE.mote = '#9c968a';
      WD_PALETTE.ring = [240, 236, 228];
      WD_PALETTE.ringAmp = [0.08, 0.04];
      WD_PALETTE.haloStrong = 'rgba(255,255,255,0.45)';
    }
  }

  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }

  resize();
  window.addEventListener('resize', onResize);

  function onResize() {
    resize();
    invalidateDriftArena();
  }

  /** Playfield for target letters + decoys (not motes) — aligns with HUD / bottom click zone */
  var arenaRect = null;
  var arenaWH = '';

  function invalidateDriftArena() {
    arenaRect = null;
    arenaWH = '';
  }

  function computeDriftArena() {
    var wh = W + 'x' + H;
    if (arenaRect && arenaWH === wh) return arenaRect;
    var tb = qs('wd-topbar');
    var bb = qs('wd-bottombar');
    var margin = Math.max(24, Math.min(W * 0.08, 56));
    var fallbackTop = Math.max(120, Math.min(H * 0.22, 200));
    var fallbackBot = Math.max(H - 130, fallbackTop + 160);
    if (!tb || !bb || W < 80 || H < 160) {
      arenaWH = wh;
      arenaRect = {
        left: margin,
        top: fallbackTop,
        right: W - margin,
        bottom: fallbackBot,
      };
      return arenaRect;
    }
    var tr = tb.getBoundingClientRect();
    var br = bb.getBoundingClientRect();
    var sp = qs('wd-score-panel').getBoundingClientRect();
    var lpPanel = qs('wd-lives-panel').getBoundingClientRect();
    var top = Math.max(tr.bottom, sp.bottom, lpPanel.bottom, 0) + 12;
    var bottomHud = br.top - 14;
    var bottom = isFinite(bottomHud) ? bottomHud : fallbackBot;
    if (bottom <= top + 100) bottom = Math.min(H - margin, Math.max(bottom, top + 140, fallbackBot));
    var zoneWDesired = Math.max(260, Math.min(720, (br.width || 0) > 120 ? br.width + 120 : W * 0.62));
    var cx = br.left + (br.width || 0) * 0.5;
    if (!isFinite(cx)) cx = W * 0.5;
    var left = cx - zoneWDesired * 0.5;
    var right = cx + zoneWDesired * 0.5;
    left = Math.max(margin, left);
    right = Math.min(W - margin, right);
    if (right - left < 220) {
      left = margin;
      right = W - margin;
    }
    top = Math.max(top, fallbackTop * 0.65);
    if (bottom - top < 140) bottom = Math.min(H - margin, top + Math.max(180, H * 0.42));
    arenaWH = wh;
    arenaRect = { left: left, top: top, right: right, bottom: bottom };
    return arenaRect;
  }

  function clampLetterToArena(L) {
    if (L.isMote) return;
    var A = computeDriftArena();
    var r = L.radius + 8;
    if (L.x < A.left + r) {
      L.x = A.left + r;
      L.vx = Math.abs(L.vx) * 0.82;
    }
    if (L.x > A.right - r) {
      L.x = A.right - r;
      L.vx = -Math.abs(L.vx) * 0.82;
    }
    if (L.y < A.top + r) {
      L.y = A.top + r;
      L.vy = Math.abs(L.vy) * 0.82;
    }
    if (L.y > A.bottom - r) {
      L.y = A.bottom - r;
      L.vy = -Math.abs(L.vy) * 0.82;
    }
  }
  var level = 0;
  var score = 0;
  var lives = WD_LIVES_CAP;
  var caught = 0;
  var gameActive = false;
  var particles = [];
  var targetWord = '';
  var nextIdx = 0;
  var wrongCooldown = 0;

  var cH = qs('wd-ch');
  var cV = qs('wd-cv');
  var cD = qs('wd-cdot');
  var mx = W / 2;
  var my = H / 2;

  function onMouseMove(e) {
    mx = e.clientX;
    my = e.clientY;
    cH.style.left = mx + 'px';
    cH.style.top = my + 'px';
    cV.style.left = mx + 'px';
    cV.style.top = my + 'px';
    cD.style.left = mx + 'px';
    cD.style.top = my + 'px';
  }
  document.addEventListener('mousemove', onMouseMove);

  function Letter(ch, isTarget, wordIdx, isMote) {
    this.ch = ch;
    this.isTarget = isTarget;
    this.wordIdx = wordIdx;
    this.isMote = !!isMote;
    this.reset.call(this);
    this.opacity = 0;
    this.fadeIn = true;
  }

  Letter.prototype.reset = function() {
    this.vx = (Math.random() - 0.5) * 1.8;
    this.vy = (Math.random() - 0.5) * 1.8;
    this.angle = Math.random() * Math.PI * 2;
    this.av = (Math.random() - 0.5) * 0.018;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseS = 0.3 + Math.random() * 0.5;
    if (this.isMote) {
      this.size = 6 + Math.random() * 6;
      this.targetOpacity = 0.11 + Math.random() * 0.15;
      this.vx *= 0.42;
      this.vy *= 0.42;
      this.phaseS *= 1.2;
      this.av *= 0.65;
      this.x = 80 + Math.random() * (W - 160);
      this.y = 80 + Math.random() * (H - 200);
    } else if (this.isTarget) {
      this.size = 16 + Math.random() * 6;
      this.targetOpacity = 1;
      var rr = this.radius + 10;
      var A = computeDriftArena();
      var spanX = Math.max(12, A.right - A.left - 2 * rr);
      var spanY = Math.max(12, A.bottom - A.top - 2 * rr);
      this.x = A.left + rr + Math.random() * spanX;
      this.y = A.top + rr + Math.random() * spanY;
    } else {
      this.size = 12 + Math.random() * 6;
      this.targetOpacity = 0.38 + Math.random() * 0.22;
      var rr2 = this.radius + 10;
      var A2 = computeDriftArena();
      var sx = Math.max(12, A2.right - A2.left - 2 * rr2);
      var sy = Math.max(12, A2.bottom - A2.top - 2 * rr2);
      this.x = A2.left + rr2 + Math.random() * sx;
      this.y = A2.top + rr2 + Math.random() * sy;
    }
    this.clicked = false;
    this.wrongT = 0;
    this.hovered = false;
    this.catchAnim = 0;
    this.catchTX = 0;
    this.catchTY = 0;
  };

  Object.defineProperty(Letter.prototype, 'radius', {
    get: function() {
      return this.size * 1.1;
    },
  });

  Letter.prototype.containsMouse = function() {
    if (this.isMote) return false;
    var dx = mx - this.x;
    var dy = my - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius + 8;
  };

  Letter.prototype.update = function(dt, spd) {
    var t;
    if (this.clicked) return;

    if (this.fadeIn) {
      this.opacity += dt * 0.002;
      if (this.opacity >= this.targetOpacity) {
        this.opacity = this.targetOpacity;
        this.fadeIn = false;
      }
    }

    t = Date.now() * 0.001;
    this.vx += Math.sin(t * this.phaseS + this.phase) * 0.035 * spd;
    this.vy += Math.cos(t * this.phaseS * 0.7 + this.phase) * 0.028 * spd;
    this.vx *= 0.982;
    this.vy *= 0.982;

    var s = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    var ms = 2.2 * spd;
    if (s > ms) {
      this.vx *= ms / s;
      this.vy *= ms / s;
    }

    this.x += this.vx * spd;
    this.y += this.vy * spd;
    this.angle += this.av;

    if (this.isMote) {
      var pad = 60;
      var topM = Math.max(128, Math.min(H * 0.14, 168));
      if (this.x < pad) {
        this.x = pad;
        this.vx = Math.abs(this.vx) * 0.8;
      }
      if (this.x > W - pad) {
        this.x = W - pad;
        this.vx = -Math.abs(this.vx) * 0.8;
      }
      if (this.y < topM) {
        this.y = topM;
        this.vy = Math.abs(this.vy) * 0.8;
      }
      if (this.y > H - 120) {
        this.y = H - 120;
        this.vy = -Math.abs(this.vy) * 0.8;
      }
    } else {
      clampLetterToArena(this);
    }

    if (this.wrongT > 0) this.wrongT -= dt;
    this.hovered = this.containsMouse();
  };

  Letter.prototype.draw = function(c2) {
    if (this.clicked) return;
    c2.save();
    c2.translate(this.x, this.y);
    c2.rotate(this.angle);

    var P = WD_PALETTE;
    var fillAlpha = this.opacity;
    var col = P.target;
    var weight = this.isTarget ? '700' : this.isMote ? '400' : '400';

    if (this.isMote) {
      col = P.mote;
      fillAlpha = this.opacity * 0.88;
    } else if (!this.isTarget) {
      col = P.decoy;
      fillAlpha = this.opacity;
    } else if (this.isTarget && this.wordIdx === nextIdx) {
      fillAlpha = Math.min(1, this.opacity + 0.06 + Math.sin(Date.now() * 0.004) * 0.12);
      col = P.targetCur;
    } else if (this.isTarget) {
      fillAlpha = this.opacity;
      col = P.target;
    }

    if (this.wrongT > 0) {
      col = 'rgba(255,110,110,0.92)';
      fillAlpha = 0.94;
    } else if (this.hovered && this.isTarget && this.wordIdx === nextIdx) {
      fillAlpha = 1;
      c2.shadowColor = WD_PALETTE.haloStrong;
      c2.shadowBlur = 14;
    }

    c2.globalAlpha = Math.max(0, Math.min(1, fillAlpha));
    c2.font = weight + ' ' + this.size + "px 'Space Mono', monospace";
    c2.fillStyle = col;
    c2.textAlign = 'center';
    c2.textBaseline = 'middle';
    c2.fillText(this.ch.toUpperCase(), 0, 0);
    c2.restore();
  };

  function pickWord() {
    var cfg = LEVELS[level];
    var avail = cfg.words.filter(function(w) {
      return usedWordsThisLevel.indexOf(w) < 0;
    });
    if (avail.length === 0) {
      resetUsedWordsForLevel();
      avail = cfg.words.slice();
    }
    var w = avail[Math.floor(Math.random() * avail.length)];
    usedWordsThisLevel.push(w);
    return w;
  }

  function buildSlots() {
    var el = qs('wd-slots');
    el.innerHTML = '';
    targetWord.split('').forEach(function(_, i) {
      var s = document.createElement('div');
      s.className = 'wd-slot' + (i === 0 ? ' wd-slot--active' : '');
      s.id = 'wd-slot-' + i;
      el.appendChild(s);
    });
  }

  function spawnRound() {
    var cfg;
    var alpha;
    var wordSet;
    var pool;

    invalidateDriftArena();

    particles = [];
    nextIdx = 0;
    targetWord = pickWord();
    cfg = LEVELS[level];

    alpha = 'abcdefghijklmnopqrstuvwxyz';
    wordSet = {};
    targetWord.split('').forEach(function(c) {
      wordSet[c] = true;
    });
    pool = alpha.split('').filter(function(c) {
      return !wordSet[c];
    });
    var noisePool = alpha.split('');
    var nMotes = 32 + cfg.decoys * 2 + level * 16;
    var i;
    for (i = 0; i < nMotes; i++) {
      particles.push(new Letter(noisePool[Math.floor(Math.random() * noisePool.length)], false, -1, true));
    }

    targetWord.split('').forEach(function(ch, ii) {
      particles.push(new Letter(ch, true, ii));
    });

    for (i = 0; i < cfg.decoys; i++) {
      particles.push(new Letter(pool[Math.floor(Math.random() * pool.length)], false, -1));
    }

    particles.forEach(function(p) {
      p.opacity = 0;
      p.fadeIn = true;
    });

    buildSlots();
    updateTopIndicator();
    updateWordProgress();
    updateHint();
  }

  function fillSlot(idx, ch) {
    var s = qs('wd-slot-' + idx);
    if (!s) return;
    s.textContent = ch.toUpperCase();
    s.classList.add('wd-slot--filled');
    s.classList.remove('wd-slot--active');
    var next = qs('wd-slot-' + (idx + 1));
    if (next) next.classList.add('wd-slot--active');
  }

  function wrongSlot(idx) {
    var s = qs('wd-slot-' + (idx > 0 ? idx - 1 : 0));
    if (!s || !host.isConnected) return;
    s.classList.add('wd-slot--wrong');
    later(function() {
      var el = qs('wd-slot-' + (idx > 0 ? idx - 1 : 0));
      if (el && host.isConnected) el.classList.remove('wd-slot--wrong');
    }, 300);
  }

  function refreshHeaderRight() {
    var cfg = LEVELS[level];
    var cur = caught >= cfg.toCatch ? cfg.toCatch : caught + 1;
    qs('wd-top-line1').textContent =
      'LEVEL ' +
      (level + 1) +
      ' · ' +
      cfg.toCatch +
      ' WORDS';
    qs('wd-top-line2').textContent = 'WORD ' + cur + ' / ' + cfg.toCatch;
  }

  function updateTopIndicator() {
    refreshHeaderRight();
  }

  function updateWordProgress() {
    var cfg = LEVELS[level];
    var cur = caught >= cfg.toCatch ? cfg.toCatch : caught + 1;
    qs('wd-word-progress').textContent = 'WORD ' + cur + ' / ' + cfg.toCatch;
    refreshHeaderRight();
  }

  function updateHint() {
    qs('wd-hint').textContent =
      nextIdx + '/' + targetWord.length + ' · click the glowing letter';
  }

  function onCanvasClick() {
    if (!gameActive || wrongCooldown > 0) return;
    var candidates = particles.filter(function(p) {
      return !p.clicked && p.containsMouse();
    });
    if (candidates.length === 0) return;
    var hit = candidates[candidates.length - 1];

    if (hit.isTarget && hit.wordIdx === nextIdx) {
      hit.clicked = true;
      fillSlot(nextIdx, hit.ch);
      showScorePopup(hit.x, hit.y, '+' + (level + 1) * 5);
      score += (level + 1) * 5;
      nextIdx++;
      updateScore();
      updateHint();
      if (nextIdx >= targetWord.length) wordComplete();
    } else {
      hit.wrongT = 600;
      wrongCooldown = 500;
      wrongSlot(nextIdx);
      flashScreen();
      loseLife();
    }
  }
  canvas.addEventListener('click', onCanvasClick);

  function wordComplete() {
    var bonus = 20 * (level + 1);
    var el = qs('wd-caught-flash');
    score += bonus;
    updateScore();
    caught++;
    updateWordProgress();
    el.textContent = targetWord;
    el.style.opacity = '1';
    showScorePopup(W / 2, H / 2 - 60, '+' + bonus + ' bonus');

    later(function() {
      if (!host.isConnected) return;
      el.style.opacity = '0';
      if (caught >= LEVELS[level].toCatch) levelDone();
      else spawnRound();
    }, 1000);
  }

  function loseLife() {
    lives = Math.max(0, lives - 1);
    updateLives();
    if (lives <= 0) later(gameOver, 400);
  }

  function updateLives() {
    qs('wd-lives-val').textContent = lives + ' / ' + WD_LIVES_CAP;
  }

  function updateScore() {
    qs('wd-score-val').textContent = String(score).padStart(3, '0');
  }

  function flashScreen() {
    canvas.style.filter = 'brightness(1.3)';
    later(function() {
      if (host.isConnected) canvas.style.filter = '';
    }, 100);
  }

  function showScorePopup(x, y, text) {
    var el = qs('wd-score-popup');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    later(function() {
      if (!host.isConnected) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-24px)';
    }, 600);
  }

  var lastT = 0;
  var rafId = null;

  function gameLoop(ts) {
    var dt = Math.min(ts - lastT, 32);
    lastT = ts;
    if (wrongCooldown > 0) wrongCooldown -= dt;

    syncWdPalette();
    ctx.fillStyle = WD_PALETTE.bg;
    ctx.fillRect(0, 0, W, H);

    if (gameActive) {
      var spd = LEVELS[level].speed;
      var rk;
      var ra;
      particles
        .filter(function(p) {
          return !p.isTarget;
        })
        .forEach(function(p) {
          p.update(dt, spd);
          p.draw(ctx);
        });
      particles
        .filter(function(p) {
          return p.isTarget;
        })
        .forEach(function(p) {
          p.update(dt, spd);
          p.draw(ctx);
        });

      var nextP = particles.filter(function(p) {
        return p.isTarget && p.wordIdx === nextIdx && !p.clicked;
      })[0];
      if (nextP) {
        rk = WD_PALETTE.ring;
        ra = WD_PALETTE.ringAmp;
        ctx.save();
        ctx.beginPath();
        ctx.arc(nextP.x, nextP.y, nextP.radius + 14, 0, Math.PI * 2);
        ctx.strokeStyle =
          'rgba(' +
          rk[0] +
          ',' +
          rk[1] +
          ',' +
          rk[2] +
          ',' +
          (ra[0] + Math.sin(Date.now() * 0.004) * ra[1]) +
          ')';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.restore();
      }
    }

    rafId = requestAnimationFrame(gameLoop);
  }

  rafId = requestAnimationFrame(gameLoop);

  function levelDone() {
    var isLast;
    gameActive = false;
    isLast = level >= LEVELS.length - 1;
    qs('wd-lvl-title').textContent = isLast ? 'Complete.' : 'Level ' + (level + 1) + ' done.';
    qs('wd-lvl-sub').textContent = caught + ' words · ' + score + ' points';
    qs('wd-next-btn').textContent = isLast ? 'Begin again →' : 'Next level →';
    qs('wd-lvl-screen').classList.remove('wd-screen--hidden');
  }

  function gameOver() {
    if (!host.isConnected) return;
    gameActive = false;
    qs('wd-final-num').textContent = String(score).padStart(3, '0');
    qs('wd-over-screen').classList.remove('wd-screen--hidden');
  }

  function startGame(fromLevel) {
    level = fromLevel || 0;
    score = 0;
    lives = WD_LIVES_CAP;
    caught = 0;
    resetUsedWordsForLevel();
    updateScore();
    updateLives();
    updateTopIndicator();
    gameActive = true;
    spawnRound();
  }

  function onNextClick() {
    var isLast;
    qs('wd-lvl-screen').classList.add('wd-screen--hidden');
    isLast = level >= LEVELS.length - 1;
    if (isLast) {
      score = 0;
      level = 0;
    } else level++;
    lives = WD_LIVES_CAP;
    caught = 0;
    resetUsedWordsForLevel();
    updateLives();
    updateScore();
    updateTopIndicator();
    gameActive = true;
    spawnRound();
  }

  function onRestartClick() {
    qs('wd-over-screen').classList.add('wd-screen--hidden');
    startGame(0);
  }

  function onWdLogoClick(e) {
    e.preventDefault();
    e.stopPropagation();
    var closeBtn = document.getElementById('gfs-close');
    if (closeBtn) closeBtn.click();
    if (typeof showSection === 'function') showSection('home');
  }
  qs('wd-logo').addEventListener('click', onWdLogoClick);

  qs('wd-next-btn').addEventListener('click', onNextClick);
  qs('wd-restart-btn').addEventListener('click', onRestartClick);

  var wdIsDarkTheme = true;
  function wdThemeToggleLabel() {
    qs('wd-theme-toggle').textContent = wdIsDarkTheme ? '[ LIGHT ]' : '[ DARK ]';
  }
  function onWdThemeClick(e) {
    e.preventDefault();
    e.stopPropagation();
    wdIsDarkTheme = !wdIsDarkTheme;
    host.setAttribute('data-theme', wdIsDarkTheme ? 'dark' : 'light');
    wdThemeToggleLabel();
    syncWdPalette();
  }
  qs('wd-theme-toggle').addEventListener('click', onWdThemeClick);
  wdThemeToggleLabel();

  function cleanupWordDrift() {
    clearLater();
    document.body.classList.remove('playroom-wf-open');
    gameActive = false;
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    window.removeEventListener('resize', onResize);
    document.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('click', onCanvasClick);
    qs('wd-next-btn').removeEventListener('click', onNextClick);
    qs('wd-restart-btn').removeEventListener('click', onRestartClick);
    qs('wd-theme-toggle').removeEventListener('click', onWdThemeClick);
    qs('wd-logo').removeEventListener('click', onWdLogoClick);
  }

  ranFullscreenCleanup = cleanupWordDrift;

  ranGameFsEsc = function(e) {
    if (e.key === 'Escape') document.getElementById('gfs-close').click();
  };
  document.addEventListener('keydown', ranGameFsEsc);

  /*
   * Start immediately — no splash / Begin step.
   * Crosshair at centre first frame:
   */
  onMouseMove({ clientX: innerWidth / 2, clientY: innerHeight / 2 });
  startGame(0);
}
