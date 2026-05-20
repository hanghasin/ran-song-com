/*
 * Type Speed — mounted inside #game-fullscreen / #gfs-body (from type_speed.html).
 * Typography matches Word Drift: Space Mono for quote letters, IBM Plex Mono for HUD.
 */
function typeSpeedFullscreenMount(host) {
  document.body.classList.add('playroom-ts-open');

  host.className = 'gfs-body gfs-body--typespeed';
  host.setAttribute('data-theme', 'dark');
  host.setAttribute('lang', 'en-GB');

  host.innerHTML =
    '<div id="ts-cur"></div>' +
    '<input id="ts-type-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-hidden="true">' +
    '<div class="ts-topbar">' +
      '<div class="ts-topbar-lead" aria-hidden="true"></div>' +
      '<span id="ts-game-label">Type Speed</span>' +
      '<div class="ts-topbar-right">' +
        '<button type="button" id="ts-theme-toggle">[ LIGHT ]</button>' +
        '<button type="button" id="ts-restart" class="ts-restart-btn">[ RESTART ]</button>' +
        '<span id="ts-top-right">GAME · 02</span>' +
      '</div>' +
    '</div>' +
    '<div id="ts-stats-bar">' +
      '<div class="ts-stat"><span class="ts-stat-label">WPM</span><span class="ts-stat-val" id="ts-wpm-val">—</span></div>' +
      '<div class="ts-stat"><span class="ts-stat-label">Accuracy</span><span class="ts-stat-val" id="ts-acc-val">—</span></div>' +
      '<div class="ts-stat"><span class="ts-stat-label">Time</span><span class="ts-stat-val" id="ts-time-val">—</span></div>' +
    '</div>' +
    '<div id="ts-mode-bar">' +
      '<button type="button" class="ts-mode-btn ts-mode-btn--active" data-mode="short">Short</button>' +
      '<span class="ts-mode-sep">·</span>' +
      '<button type="button" class="ts-mode-btn" data-mode="long">Long</button>' +
    '</div>' +
    '<div id="ts-stage">' +
      '<div id="ts-quote-wrap">' +
        '<div id="ts-attribution"></div>' +
        '<div id="ts-quote-text"></div>' +
      '</div>' +
    '</div>' +
    '<div id="ts-start-overlay">' +
      '<span id="ts-start-msg">· start typing · five quotes this round ·</span>' +
    '</div>' +
    '<div id="ts-bottom-bar">' +
      '<span id="ts-bottom-left">—</span>' +
      '<div id="ts-progress-wrap"><div id="ts-progress-fill"></div></div>' +
      '<span id="ts-bottom-right">—</span>' +
    '</div>' +
    '<div id="ts-result">' +
      '<div id="ts-result-quote"></div>' +
      '<div id="ts-result-attr"></div>' +
      '<div class="ts-result-stats">' +
        '<div class="ts-rs">' +
          '<div class="ts-rs-val" id="ts-r-acc">—</div>' +
          '<div class="ts-rs-label">Accuracy</div>' +
        '</div>' +
        '<div class="ts-rs">' +
          '<div class="ts-rs-val ts-rs-val--big" id="ts-r-wpm">—</div>' +
          '<div class="ts-rs-label">WPM</div>' +
        '</div>' +
        '<div class="ts-rs">' +
          '<div class="ts-rs-val" id="ts-r-time">—</div>' +
          '<div class="ts-rs-label">Seconds</div>' +
        '</div>' +
      '</div>' +
      '<div id="ts-result-comment"></div>' +
      '<div class="ts-result-btns">' +
        '<button type="button" class="ts-rbtn" id="ts-r-next">Next round →</button>' +
        '<button type="button" class="ts-rbtn ts-rbtn--secondary" id="ts-r-retry">Try again</button>' +
      '</div>' +
    '</div>';

  function qs(id) {
    return host.querySelector('#' + id);
  }

  var QUOTES = {
    short: [
      { text: 'Comfort in chaos.', author: 'Ran Song' },
      { text: 'Curiosity over certainty.', author: 'Ran Song' },
      { text: 'Change as commitment.', author: 'Ran Song' },
      { text: 'Becoming oneself is a long experiment.', author: 'Ran Song' },
      { text: 'Nothing is fixed. I work from there.', author: 'Ran Song' },
      {
        text: 'The only way to make sense out of change is to plunge into it.',
        author: 'Alan Watts',
      },
      { text: 'Not all those who wander are lost.', author: 'J.R.R. Tolkien' },
      {
        text: 'In the depth of winter, I finally learnt that within me there lay an invincible summer.',
        author: 'Albert Camus',
      },
      {
        text: 'You must be the change you wish to see in the world.',
        author: 'Mahatma Gandhi',
      },
      { text: 'The present moment always will have been.', author: 'Unknown' },
      {
        text: 'Simplicity is the ultimate sophistication.',
        author: 'Leonardo da Vinci',
      },
      {
        text: 'Everything you can imagine is real.',
        author: 'Pablo Picasso',
      },
      { text: 'What I see is not always what remains.', author: 'Ran Song' },
      { text: 'Systems that question themselves.', author: 'Ran Song' },
      { text: 'I don\'t adapt to change. I become it.', author: 'Ran Song' },
    ],
    long: [
      {
        text:
          'The most common form of despair is not being who you are. To exist is to change, to change is to mature, to mature is to go on creating oneself endlessly.',
        author: 'Henri Bergson',
      },
      {
        text:
          'I am not what happened to me. I am what I choose to become. The privilege of a lifetime is to become who you truly are.',
        author: 'Carl Jung',
      },
      {
        text:
          'You are not a drop in the ocean. You are the entire ocean in a drop. The wound is the place where the light enters you.',
        author: 'Rumi',
      },
      {
        text:
          'It is not the strongest of the species that survives, nor the most intelligent. It is the one most adaptable to change.',
        author: 'Charles Darwin',
      },
      {
        text:
          'We are what we repeatedly do. Excellence, then, is not an act, but a habit. The whole is more than the sum of its parts.',
        author: 'Aristotle',
      },
      {
        text:
          'The important thing is not to stop questioning. Curiosity has its own reason for existence. One cannot help but be in awe when one contemplates the mysteries of eternity.',
        author: 'Albert Einstein',
      },
      {
        text:
          'Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.',
        author: 'Viktor Frankl',
      },
      {
        text:
          'Comfort in chaos. Curiosity over certainty. Change as commitment. Becoming oneself is a long experiment. I am still running it.',
        author: 'Ran Song',
      },
    ],
  };

  function getComment(wpm, acc) {
    if (acc < 85) return 'Accuracy matters more than speed.';
    if (wpm >= 100) return 'You think in sentences.';
    if (wpm >= 80) return 'Fast and deliberate.';
    if (wpm >= 60) return 'A steady hand.';
    if (wpm >= 40) return 'Every word considered.';
    return 'Slow is smooth. Smooth is fast.';
  }

  var ROUND_QUOTE_COUNT = 5;
  var mode = 'short';
  var quote = null;
  var letters = [];
  var idx = 0;
  var errors = 0;
  var totalTyped = 0;
  var started = false;
  var finished = false;
  var startTime = 0;
  var timerRAF = null;
  var roundQuoteIndex = 0;
  /** Fixed queue of quotes for current round */
  var roundQueue = [];
  /** Copy after each refill — same order for Retry */
  var lastRoundQueue = [];
  var pendingTimeouts = [];
  var isDark = true;

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
    pendingTimeouts.forEach(function(t) {
      clearTimeout(t);
    });
    pendingTimeouts.length = 0;
  }

  var cur = qs('ts-cur');
  function onMouseMove(e) {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
  }
  document.addEventListener('mousemove', onMouseMove);

  function shuffleOrder(len) {
    var ax = [];
    var i;
    for (i = 0; i < len; i++) ax.push(i);
    for (i = ax.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = ax[i];
      ax[i] = ax[j];
      ax[j] = t;
    }
    return ax;
  }

  function refillRoundQueue() {
    var pool = QUOTES[mode];
    var order = shuffleOrder(pool.length);
    roundQueue.length = 0;
    var k;
    for (k = 0; k < ROUND_QUOTE_COUNT; k++) {
      roundQueue.push(pool[order[k % order.length]]);
    }
    lastRoundQueue = roundQueue.slice();
  }

  function resetActiveModeButtons() {
    host.querySelectorAll('.ts-mode-btn').forEach(function(b) {
      b.classList.remove('ts-mode-btn--active');
    });
    host.querySelector('[data-mode="' + mode + '"]').classList.add('ts-mode-btn--active');
  }

  /**
   * @param {*} q Quote object { text, author }
   * @param {boolean} continueSession Same round — keeps timer / errors / totalTyped / started state
   * @param {boolean} hideStartHint When starting round quote 2–5 overlay stays hidden
   */
  function buildQuote(q, continueSession, hideStartHint) {
    quote = q;
    letters = q.text.split('');
    idx = 0;

    if (!continueSession) {
      errors = 0;
      totalTyped = 0;
      started = false;
      finished = false;
      if (timerRAF != null) {
        cancelAnimationFrame(timerRAF);
        timerRAF = null;
      }
      qs('ts-start-overlay').style.opacity = hideStartHint ? '0' : '1';
    } else {
      finished = false;
      qs('ts-start-overlay').style.opacity = '0';
    }

    var attr = qs('ts-attribution');
    attr.textContent = '— ' + q.author;
    attr.classList.add('show');

    var qt = qs('ts-quote-text');
    qt.innerHTML = letters
      .map(function(ch, i) {
        var cls = i === 0 ? 'ts-letter ts-letter--current' : 'ts-letter';
        var safe = ch === ' ' ? '&nbsp;' : escapeHtml(ch);
        return '<span class="' + cls + '" data-i="' + i + '">' + safe + '</span>';
      })
      .join('');

    if (!continueSession) {
      qs('ts-wpm-val').textContent = '—';
      qs('ts-acc-val').textContent = '—';
      qs('ts-time-val').textContent = '—';
    }
    qs('ts-progress-fill').style.width = '0%';

    qs('ts-bottom-left').textContent =
      (mode === 'short' ? 'Short' : 'Long') +
      ' · ' +
      String(roundQuoteIndex + 1) +
      '/' +
      ROUND_QUOTE_COUNT;
    qs('ts-bottom-right').textContent = letters.length + ' chars';

    if (started && timerRAF == null && !finished) startTimer();

    qs('ts-type-input').value = '';
    qs('ts-type-input').focus();
    resetActiveModeButtons();
  }

  function beginRound() {
    refillRoundQueue();
    roundQuoteIndex = 0;
    buildQuote(roundQueue[0], false, false);
  }

  function onRestartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    clearLater();
    qs('ts-result').classList.remove('show');
    if (timerRAF != null) {
      cancelAnimationFrame(timerRAF);
      timerRAF = null;
    }
    beginRound();
    qs('ts-type-input').focus();
  }

  function escapeHtml(ch) {
    if (ch === '&') return '&amp;';
    if (ch === '<') return '&lt;';
    if (ch === '>') return '&gt;';
    return ch;
  }

  function getLetter(i) {
    return host.querySelector('.ts-letter[data-i="' + i + '"]');
  }

  function finishWholeRound() {
    finished = true;
    if (timerRAF != null) cancelAnimationFrame(timerRAF);

    var elapsed = (Date.now() - startTime) / 1000;
    var words = totalTyped / 5;
    var wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
    var acc =
      totalTyped > 0
        ? Math.round(((totalTyped - errors) / totalTyped) * 100)
        : 100;

    later(function() {
      showRoundResult(wpm, acc, elapsed);
    }, 400);
  }

  function showRoundResult(wpm, acc, elapsed) {
    qs('ts-result-quote').textContent =
      ROUND_QUOTE_COUNT + ' quotes · average over the round';
    qs('ts-result-attr').textContent =
      mode === 'short' ? 'Short mode' : 'Long mode';
    qs('ts-r-wpm').textContent = wpm;
    qs('ts-r-acc').textContent = acc + '%';
    qs('ts-r-time').textContent = elapsed.toFixed(1);
    qs('ts-result-comment').textContent = getComment(wpm, acc);
    qs('ts-result').classList.add('show');
  }

  function updateStats() {
    if (!started) return;
    var elapsed = (Date.now() - startTime) / 1000;
    var words = idx / 5;
    var wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
    var acc =
      totalTyped > 0
        ? Math.round(((totalTyped - errors) / totalTyped) * 100)
        : 100;

    qs('ts-wpm-val').textContent = wpm;
    qs('ts-acc-val').textContent = acc + '%';
    qs('ts-time-val').textContent = elapsed.toFixed(1) + 's';
  }

  function tick() {
    if (!started || finished) return;
    updateStats();
    timerRAF = requestAnimationFrame(tick);
  }

  function startTimer() {
    timerRAF = requestAnimationFrame(tick);
  }

  function onClickDoc() {
    qs('ts-type-input').focus();
  }
  document.addEventListener('click', onClickDoc);

  function onKeyDown(e) {
    if (finished) return;

    if (e.key !== 'Backspace' && e.key.length !== 1) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (idx <= 0) return;
      idx--;
      var el = getLetter(idx);
      if (el) {
        el.classList.remove('done', 'error');
        el.classList.add('ts-letter--current');
      }
      var prev = getLetter(idx + 1);
      if (prev) prev.classList.remove('ts-letter--current');
      updateStats();
      return;
    }

    if (!started) {
      started = true;
      startTime = Date.now();
      qs('ts-start-overlay').style.opacity = '0';
      startTimer();
    }

    if (idx >= letters.length) return;

    var expected = letters[idx];
    var typed = e.key;
    e.preventDefault();

    var letterEl = getLetter(idx);
    if (!letterEl) return;

    letterEl.classList.remove('ts-letter--current');

    if (typed === expected) {
      letterEl.classList.add('done');
    } else {
      letterEl.classList.add('error');
      errors++;
    }
    totalTyped++;
    idx++;

    var next = getLetter(idx);
    if (next) next.classList.add('ts-letter--current');

    var pct = (idx / letters.length) * 100;
    qs('ts-progress-fill').style.width = pct + '%';

    if (idx >= letters.length) {
      if (roundQuoteIndex >= ROUND_QUOTE_COUNT - 1) {
        finishWholeRound();
      } else {
        roundQuoteIndex++;
        buildQuote(roundQueue[roundQuoteIndex], true, true);
      }
    } else {
      updateStats();
    }
  }

  qs('ts-type-input').addEventListener('keydown', onKeyDown);

  host.querySelectorAll('.ts-mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      mode = btn.getAttribute('data-mode');
      qs('ts-result').classList.remove('show');
      beginRound();
    });
  });

  qs('ts-r-next').addEventListener('click', function() {
    qs('ts-result').classList.remove('show');
    beginRound();
  });

  qs('ts-r-retry').addEventListener('click', function() {
    qs('ts-result').classList.remove('show');
    roundQueue = lastRoundQueue.slice();
    roundQuoteIndex = 0;
    buildQuote(roundQueue[0], false, false);
  });

  qs('ts-theme-toggle').addEventListener('click', function() {
    isDark = !isDark;
    host.setAttribute('data-theme', isDark ? 'dark' : 'light');
    qs('ts-theme-toggle').textContent = isDark ? '[ LIGHT ]' : '[ DARK ]';
    qs('ts-type-input').focus();
  });

  qs('ts-restart').addEventListener('click', onRestartClick);

  ranFullscreenCleanup = function cleanupTypeSpeed() {
    clearLater();
    document.body.classList.remove('playroom-ts-open');
    if (timerRAF != null) {
      cancelAnimationFrame(timerRAF);
      timerRAF = null;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('click', onClickDoc);
    qs('ts-type-input').removeEventListener('keydown', onKeyDown);
    qs('ts-restart').removeEventListener('click', onRestartClick);
    ranFullscreenCleanup = null;
  };

  ranGameFsEsc = function(e) {
    if (e.key === 'Escape') document.getElementById('gfs-close').click();
  };
  document.addEventListener('keydown', ranGameFsEsc);

  beginRound();
}
