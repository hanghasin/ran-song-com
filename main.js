'use strict';

/* ────────────────────────────────────────────────────
   OBSERVER DATA — real photos
   ──────────────────────────────────────────────────── */
var ITEMS = [
  { src:'photos/p1.png', wide:false, title:'NO END', cat:'Performance', date:'2025', loc:'Antwerp', desc:'Everything cools down. No true conclusion, just an echo hinting at eternity.' },
  { src:'photos/p2.png', wide:true, title:'Naples at Dust', cat:'Landscape', date:'2026', loc:'Naples', desc:'The city spread itself out like it had nothing to prove.' },
  { src:'photos/p3.png', wide:false, title:'Light', cat:'Life', date:'2025', loc:'Stockholm', desc:'Between dark rooms and lit windows, there is a whole life, back then.' },
  { src:'photos/p4.png', wide:true, title:'Road', cat:'Travel', date:'2025', loc:'Normandy', desc:'The road knows something the map does not.' },
  { src:'photos/p5.png', wide:false, title:'The Arch', cat:'Landscape', date:'2025', loc:'Broadstairs', desc:'Kinsgate for centuries.' },
  { src:'photos/p6.png', wide:false, title:'Through the Viewer', cat:'Travel', date:'2026', loc:'New York', desc:'Smaller when you zoom in. Bigger when you do not.' },
  { src:'photos/p7.png', wide:true, title:'Winter', cat:'Landscape', date:'2026', loc:'New York', desc:'The city agreed, for once, to be quiet.' },
  { src:'photos/p8.png', wide:false, title:'Glass Mind', cat:'Exhibition', date:'2025', loc:'Berlin', desc:'An entrance to the way to un-rock one\u2019s mind.' },
  { src:'photos/obs-01.png', wide:false, title:'Eye on the Wall', cat:'Exhibition', date:'2025', loc:'Berlin', desc:'A framed moment \u2014 looking before language.' },
  { src:'photos/obs-02.png', wide:true, title:'Souvenirs & Bookshop', cat:'Travel', date:'2026', loc:'Granada', desc:'\u2014' },
  { src:'photos/obs-03.png', wide:true, title:'Afterglow', cat:'City', date:'2026', loc:'New York', desc:'Humming behind the scene.' },
  { src:'photos/obs-04.png', wide:false, title:'Steps in the Sun', cat:'People', date:'2026', loc:'Vatican', desc:'Reading for all beings.' },
  { src:'photos/obs-06.png', wide:true, title:'From Above', cat:'Travel', date:'2026', loc:'Positano', desc:'\u2014' },
  { src:'photos/obs-08-trike.png', wide:false, col:'verso', edge:'outer', title:'Microlight Wing', cat:'Life', date:'2026', loc:'Saint Michael', desc:'When you feel free, you are free.' },
];
/* Home hero: particle "RAN SONG" ↔ "Becoming oneself…" (both black ink) */
var HOME_HERO_PHASE = 'intro'; // 'intro' | 'quote'
var HOME_HERO_PARTICLE_REBUILD = null;
/** Stop / resume the home canvas loop (avoids ghost layer when another panel is active). */
var HOME_HERO_STOP_DRAW = null;
var HOME_HERO_RESUME_DRAW = null;
var HOME_NAV_CANCEL_REVEAL = null;

function readCssVar(name, fallback) {
  try {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  } catch (_err) {
    return fallback;
  }
}

function applySiteTheme(mode) {
  if (mode !== 'light' && mode !== 'dark') return;
  document.documentElement.dataset.theme = mode;
  try {
    localStorage.setItem('ransong-theme', mode);
  } catch (_e) {}
  var meta = document.getElementById('theme-color-meta');
  if (meta) meta.setAttribute('content', mode === 'dark' ? '#131315' : '#ffffff');
  syncThemeToggleButtons(mode);
  window.dispatchEvent(new CustomEvent('ransong-theme-change', { detail: { theme: mode } }));
  if (typeof HOME_HERO_PARTICLE_REBUILD === 'function') HOME_HERO_PARTICLE_REBUILD();
}

function syncThemeToggleButtons(mode) {
  var dark = mode === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.textContent = dark ? '[DAY]' : '[NIGHT]';
  });
}

function bindSiteThemeToggle() {
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applySiteTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  });
  var mode = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  syncThemeToggleButtons(mode);
}

/* ────────────────────────────────────────────────────
   BUILDER DATA
   ──────────────────────────────────────────────────── */
var BUILDER_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'build', label: 'Build' },
  { id: 'design', label: 'Design' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'field', label: 'Field' },
];

var BUILDER_CARD_ART = {
  governance:
    '<svg class="builder-card-art__svg" viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<text x="24" y="36" font-size="9" fill="currentColor" opacity="0.45">Bias ratio</text>' +
    '<rect x="24" y="44" width="200" height="10" fill="#c44" opacity="0.85"/>' +
    '<text x="24" y="72" font-size="9" fill="currentColor" opacity="0.45">Threshold</text>' +
    '<rect x="24" y="80" width="140" height="10" fill="#c97" opacity="0.75"/>' +
    '<text x="24" y="108" font-size="9" fill="currentColor" opacity="0.45">Status</text>' +
    '<rect x="24" y="116" width="90" height="10" fill="#c44" opacity="0.85"/>' +
    '<text x="130" y="124" font-size="9" fill="#c44" font-weight="600">FAIL</text>' +
    '</svg>',
  playce:
    '<svg class="builder-card-art__svg" viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect x="72" y="32" width="48" height="56" fill="currentColor" opacity="0.12"/>' +
    '<rect x="136" y="20" width="48" height="68" fill="currentColor" opacity="0.18"/>' +
    '<rect x="200" y="40" width="48" height="48" fill="currentColor" opacity="0.1"/>' +
    '<text x="96" y="108" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.5">Lagos</text>' +
    '<text x="160" y="108" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.5">Nazaré</text>' +
    '<text x="88" y="128" text-anchor="middle" font-size="8" fill="#3d8f6e">Novice</text>' +
    '<text x="160" y="128" text-anchor="middle" font-size="8" fill="#c97">Inter.</text>' +
    '<text x="224" y="128" text-anchor="middle" font-size="8" fill="#c44">Pro</text>' +
    '</svg>',
};

var PROJECTS = [
  {
    num: '01',
    title: 'AI Governance Dashboard',
    category: 'build',
    featured: true,
    cardArt: 'governance',
    governanceCaseStudy: true,
    type: 'Independent Research & Build',
    year: '2026',
    cardDesc:
      'Forensic bias audit interface. EU AI Act compliance translated into deterministic engineering behaviour.',
    tags: ['Ethical AI', 'EU AI Act', 'Flask', 'Python'],
    tech: 'React · Tailwind CSS · Flask · Python (SciPy / Pandas)',
    desc:
      'A forensic audit interface for high-risk algorithmic pricing: making automated pricing decisions observable, accountable, and regulator-ready when the underlying model is a proprietary black box.',
    heroVideo: 'assets/ai-governance-dashboard.mp4',
    hero: 'photos/ai-governance-hero.png',
    sections: [],
  },
  {
    num: '02',
    title: 'PLAYCE — Sports Travel Decision',
    category: 'build',
    featured: true,
    cardArt: 'playce',
    playceCaseStudy: true,
    type: 'Independent Research & Build',
    year: '2026',
    cardDesc:
      'One recommendation, fully reasoned. Sport as the primary variable. Solo travel signals built in.',
    tags: ['Next.js', 'Grok API', 'Zod', 'Tailwind v4'],
    tech: 'Next.js · Grok API · Zod · Tailwind CSS v4 · pnpm · Cursor',
    desc:
      'Intent-first AI travel planner: sport as the organising variable — destinations, itineraries, and solo traveller signals in one coherent flow.',
    hero: 'https://picsum.photos/seed/proj2h/1200/675',
    sections: [],
  },
  {
    num: '03',
    title: 'AI Visual Experiments',
    category: 'build',
    year: '2025',
    cardDesc: 'Generative and AI design at the intersection of constraint, chance, and visual systems.',
    tags: ['Midjourney', 'ComfyUI', 'p5.js'],
    type: 'Personal / Ongoing',
    tech: 'Midjourney · ComfyUI · p5.js',
    desc: 'Generative and AI design, where they intersect.',
    hero: 'https://picsum.photos/seed/proj4h/1200/675',
    sections: [
      {
        type: 'text',
        content:
          'An ongoing personal laboratory for exploring what generative AI tools produce when given contradictory instructions, broken grids, and impossible constraints.',
      },
      {
        type: 'image',
        src: 'https://picsum.photos/seed/proj4a/1000/560',
        caption: 'Series 01 — visual interference studies',
      },
    ],
  },
  {
    num: '04',
    title: 'Brand & Poster Design — Selected',
    category: 'design',
    year: '2024',
    cardDesc: 'Poster and identity work across cultural, editorial, and campaign contexts.',
    tags: ['Branding', 'Poster', 'Typography'],
    type: 'Design',
    desc: 'Selected brand and poster design work.',
    hero: 'https://picsum.photos/seed/proj-brand/1200/675',
    sections: [
      {
        type: 'text',
        content:
          'A curated set of brand and poster projects — typography-led layouts, campaign visuals, and identity systems built for print and screen.',
      },
    ],
  },
  {
    num: '05',
    title: 'Confidence in Every Drop — Narta',
    category: 'strategy',
    year: '2024',
    cardDesc: 'Brand positioning and go-to-market strategy for a consumer skincare launch.',
    tags: ['Brand', 'GTM', 'Consumer'],
    type: 'Strategy',
    desc: 'Brand positioning and launch strategy for Narta.',
    hero: 'https://picsum.photos/seed/proj-narta/1200/675',
    sections: [
      {
        type: 'text',
        content:
          'End-to-end brand narrative, channel strategy, and campaign architecture for a confidence-led skincare proposition.',
      },
    ],
  },
  {
    num: '06',
    title: "L'Oréal Paris — Campaign Strategy",
    category: 'strategy',
    year: '2024',
    cardDesc: 'Regional campaign strategy and creative direction for a beauty brand portfolio.',
    tags: ['Beauty', 'Campaign', 'Regional'],
    type: 'Strategy',
    desc: "Campaign strategy for L'Oréal Paris.",
    hero: 'https://picsum.photos/seed/proj-loreal/1200/675',
    sections: [
      {
        type: 'text',
        content:
          'Portfolio-level campaign planning across channels — balancing brand equity, local market nuance, and measurable conversion goals.',
      },
    ],
  },
  {
    num: '07',
    title: 'Circadian Health — Open Innovation',
    category: 'field',
    year: '2025',
    cardDesc: 'Open innovation fieldwork linking sleep science, product concepts, and partner ecosystems.',
    tags: ['Health', 'Innovation', 'Research'],
    type: 'Field',
    desc: 'Open innovation programme in circadian health.',
    hero: 'https://picsum.photos/seed/proj-circadian/1200/675',
    sections: [
      {
        type: 'text',
        content:
          'Field research and partner scouting to translate circadian science into viable product and service concepts.',
      },
    ],
  },
  {
    num: '08',
    title: 'Digital Transformation — Ajisen Group',
    category: 'field',
    year: '2023',
    cardDesc: 'Enterprise digital transformation across operations, customer touchpoints, and internal tooling.',
    tags: ['Enterprise', 'Operations', 'F&B'],
    type: 'Field',
    desc: 'Digital transformation delivery for Ajisen Group.',
    hero: 'https://picsum.photos/seed/proj-ajisen/1200/675',
    sections: [
      {
        type: 'text',
        content:
          'Multi-market digital transformation — process redesign, platform rollout, and change management across restaurant operations.',
      },
    ],
  },
];

/* ────────────────────────────────────────────────────
   GAMES DATA
   ──────────────────────────────────────────────────── */
var GAMES = [
  Object.assign({}, PLAYROOM_ART[0], {
    num: 'GAME 01', title: 'Sudoku', status: 'PLAYABLE', kind: 'sudoku',
    desc: 'Minimal. Focus. Solve. A sudoku stripped of everything except the logic.',
  }),
  Object.assign({}, PLAYROOM_ART[3], {
    num: 'GAME 02', title: 'Type Speed', status: 'PLAYABLE', kind: 'type-speed',
    desc: 'A tabletop typewriter spills characters into orbit. Rhythm over WPM — the dial does not sympathise.',
  }),
  Object.assign({}, PLAYROOM_ART[2], {
    num: 'GAME 03', title: 'Word Drift', status: 'PLAYABLE', kind: 'word-drift',
    desc: 'Letters scatter across the void. Click them in order to spell each word — chaos thins while order rises.',
  }),
  Object.assign({}, PLAYROOM_ART[1], {
    num: 'GAME 04', title: 'Memory Grid', status: 'PLAYABLE', kind: 'memory-grid',
    desc:
      'Flip two tiles; matching pairs score +100.<br>A miss locks play until both cards close again.',
  }),
];

/* ────────────────────────────────────────────────────
   THOUGHTS DATA (Thinker section)
   ──────────────────────────────────────────────────── */
var THOUGHTS = [
  {
    num:'01', date:'2025.05', cat:'ETHICAL AI',
    title:'On Building AI Tools That Question Their Own Outputs',
    desc:'Where fairness, accountability, and explainability actually break down.',
    body:[
      'There is a class of problem in AI ethics that does not resolve with more data or better models. It resolves, if at all, through design choices made upstream of deployment.',
      'Explainability is the most discussed. But in practice, most "explainable AI" is post-hoc rationalisation — a convincing story told after the decision has already been made.',
      'The more interesting constraint is accountability. Not who is responsible when the model fails — that answer is always diffuse. The more interesting question is: who is responsible for designing the conditions under which failure is likely?',
      'This is a product question as much as an ethics question. And it rarely gets asked at the right moment — which is before the first line of code.',
    ]
  },
  {
    num:'02', date:'2025.04', cat:'ART & TECH',
    title:'Calculating Empires and the Feminist Gap in Data Systems',
    desc:'On the MIT exhibition and what gets counted, and what does not.',
    body:[
      'The Calculating Empires exhibition at MIT made one thing very clear: data systems are never neutral. They are always built by someone, for someone, with a particular idea of who counts.',
      'The exhibition traces the history of information systems from colonial record-keeping to algorithmic governance. What connects them is not the technology — it is the assumption that the world can be simplified into a table.',
      'The feminist critique here is not simply that women are underrepresented in the data. It is that the categories used to organise data were designed without considering the lives of women at all. The gap is structural.',
      'I left thinking about what it would mean to build a data system that began with the question: whose life does this model leave out?',
    ]
  },
  {
    num:'03', date:'2025.03', cat:'PM & BUILD',
    title:'What Vibe Coding Taught Me About Product Thinking',
    desc:'Moving fast without a spec is a skill. So is knowing when to stop.',
    body:[
      'Vibe coding — building by intuition, through AI tools, without a formal specification — is either the future of product development or a very fast way to make a mess. Probably both.',
      'What I noticed: the first 40% of a product gets built in 10% of the time. The last 20% takes longer than everything before it. This is not new. But vibe coding makes the ratio extreme.',
      'The skill is not in the building. It is in knowing when you have enough to learn something, and stopping before you have so much momentum that stopping feels like failure.',
      'The best vibe coding sessions I have had ended with a clear question I could not answer. That is the product.',
    ]
  },
  {
    num:'04', date:'2025.02', cat:'TRAVEL & ART',
    title:'Berlin: Yoko Ono, the Memorial, and Absence as Design',
    desc:'Three things in Berlin that made me sit down and think about nothing.',
    body:[
      'There is a Yoko Ono instruction piece: "Look at the sky until you become the sky." I thought about it the entire time I was in Berlin.',
      'The Holocaust Memorial is the best argument I have seen for absence as a design principle. There is nothing to read, nothing to explain. You walk between the columns and you feel something before you think something. That order matters.',
      'Yoko Ono\'s work at the Hamburger Bahnhof is the opposite — instruction-heavy, participatory, loud. But both are making the same argument: that the viewer is not a recipient. They are the medium.',
      'I have been thinking about how to apply this to product design. What would it mean to build something that does not tell the user what to feel?',
    ]
  },
  {
    num:'05', date:'2025.01', cat:'PERSONAL',
    title:'INTJ in a Room Full of People: Energy Management at Work',
    desc:'On protecting your attention without becoming unreachable.',
    body:[
      'The INTJ label is useful not because it explains everything but because it makes one thing obvious: energy is not infinite, and its depletion follows patterns.',
      'The pattern for me: large group meetings where nothing is decided are the most expensive. One-on-one conversations where something is at stake are energising. This is not introversion. It is a preference for signal over noise.',
      'The professional challenge is that organisations run on noise. Status updates, alignment meetings, visibility rituals. The person who opts out of these is usually described as "hard to reach" or "not a team player."',
      'What I have learnt: you can protect your attention without becoming invisible. The key is to be reliably available for the things that matter, and visibly absent from the things that do not. This requires knowing, in advance, which is which.',
    ]
  },
];

/* ────────────────────────────────────────────────────
   STATE
   ──────────────────────────────────────────────────── */
var activeSection = 'home';
var activeView    = 'grid';
var activeProj    = 0;
var builderFilter = 'all';
var builderOnDetail = false;
var activeThought = 0;

/* ────────────────────────────────────────────────────
   CURSOR — two equal dots, cursor2 lags to create
   a stretch/separate-on-move, merge-at-rest effect
   ──────────────────────────────────────────────────── */
var cur1 = document.getElementById('cursor');
var cur2 = document.getElementById('cursor2');

document.addEventListener('mousemove', function(e) {
  cur1.style.left = e.clientX + 'px';
  cur1.style.top  = e.clientY + 'px';
  cur1.style.opacity = '1';
  cur2.style.left = e.clientX + 'px';
  cur2.style.top  = e.clientY + 'px';
  cur2.style.opacity = '1';
});
document.addEventListener('mouseleave', function() {
  cur1.style.opacity = '0';
  cur2.style.opacity = '0';
});

/* ────────────────────────────────────────────────────
   PLAYROOM — Sudoku (inline in fullscreen shell)
   Diagonal 3×3 blocks + backtrack solve, then dig holes.
   ──────────────────────────────────────────────────── */
var ranGameFsEsc = null;
var ranFullscreenCleanup = null;

function ranGameFullscreenClosePrep() {
  if (ranFullscreenCleanup) {
    ranFullscreenCleanup();
    ranFullscreenCleanup = null;
  }
  if (ranGameFsEsc) {
    document.removeEventListener('keydown', ranGameFsEsc);
    ranGameFsEsc = null;
  }
}

function sudShuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
}

function sudIdx(r, c) { return r * 9 + c; }

function sudCanPlace(board, r, c, num) {
  var br = Math.floor(r / 3) * 3;
  var bc = Math.floor(c / 3) * 3;
  var i;
  for (i = 0; i < 9; i++) {
    if (board[sudIdx(r, i)] === num || board[sudIdx(i, c)] === num) return false;
  }
  var rx;
  for (rx = 0; rx < 3; rx++) {
    var cy;
    for (cy = 0; cy < 3; cy++) {
      if (board[sudIdx(br + rx, bc + cy)] === num) return false;
    }
  }
  return true;
}

function sudSolve(board) {
  var ptr = -1;
  var r;
  var c;
  for (r = 0; r < 9; r++) {
    for (c = 0; c < 9; c++) {
      if (board[sudIdx(r, c)] === 0) {
        ptr = sudIdx(r, c);
        r = 9;
        break;
      }
    }
  }
  if (ptr === -1) return true;

  var row = Math.floor(ptr / 9);
  var col = ptr % 9;
  var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  sudShuffle(nums);
  var k;
  for (k = 0; k < 9; k++) {
    var n = nums[k];
    if (sudCanPlace(board, row, col, n)) {
      board[ptr] = n;
      if (sudSolve(board)) return true;
      board[ptr] = 0;
    }
  }
  return false;
}

function sudDiagonalBoxes(board) {
  var zi;
  var boxes = [0, 4, 8];
  for (zi = 0; zi < 3; zi++) {
    var bi = boxes[zi];
    var brow = Math.floor(bi / 3) * 3;
    var bcol = (bi % 3) * 3;
    var digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    sudShuffle(digits);
    var kk = 0;
    var rx;
    for (rx = 0; rx < 3; rx++) {
      var cy;
      for (cy = 0; cy < 3; cy++) board[sudIdx(brow + rx, bcol + cy)] = digits[kk++];
    }
  }
}

function sudBoardCopy(board) {
  var cpy = [];
  var i;
  for (i = 0; i < 81; i++) cpy[i] = board[i];
  return cpy;
}

function sudGenerateSolution() {
  var board = [];
  var i;
  for (i = 0; i < 81; i++) board[i] = 0;
  sudDiagonalBoxes(board);
  sudSolve(board);
  return board;
}

function sudDigPuzzle(solution, digCount) {
  var puzz = sudBoardCopy(solution);
  var order = [];
  var h;
  for (h = 0; h < 81; h++) order.push(h);
  sudShuffle(order);
  var dug = 0;
  var j;
  for (j = 0; j < 81 && dug < digCount; j++) {
    var ix = order[j];
    if (puzz[ix] !== 0) {
      puzz[ix] = 0;
      dug++;
    }
  }
  return puzz;
}

function sudConflictMask(player) {
  var bad = {};
  var r0;
  var c0;

  function markOne(r, c) {
    var v = player[sudIdx(r, c)];
    if (v === 0) return;
    var i;
    for (i = 0; i < 9; i++) {
      if (i !== c && player[sudIdx(r, i)] === v) bad[sudIdx(r, c)] = true;
      if (i !== r && player[sudIdx(i, c)] === v) bad[sudIdx(r, c)] = true;
    }
    var br = Math.floor(r / 3) * 3;
    var bc = Math.floor(c / 3) * 3;
    var rx;
    for (rx = 0; rx < 3; rx++) {
      var cy;
      for (cy = 0; cy < 3; cy++) {
        var rr = br + rx;
        var cc = bc + cy;
        if ((rr !== r || cc !== c) && player[sudIdx(rr, cc)] === v)
          bad[sudIdx(r, c)] = true;
      }
    }
  }

  for (r0 = 0; r0 < 9; r0++) {
    for (c0 = 0; c0 < 9; c0++) markOne(r0, c0);
  }
  return bad;
}

function sudBoardSolved(player, solution) {
  var ix;
  for (ix = 0; ix < 81; ix++) {
    if (player[ix] === 0 || player[ix] !== solution[ix]) return false;
  }
  return true;
}

function sudokuFullscreenMount(host) {
  var diff = 'medium';
  var DIGS = { easy: 38, medium: 46, hard: 53 };

  var solution = sudGenerateSolution();
  var puzzle = sudDigPuzzle(solution, DIGS[diff]);
  var given = {};
  var gi;
  for (gi = 0; gi < 81; gi++) given[gi] = puzzle[gi] !== 0;

  var player = sudBoardCopy(puzzle);
  var focusIx = -1;

  host.className = 'gfs-body gfs-body--scroll gfs-body--sudoku';
  var sudIsDark = document.documentElement.dataset.theme !== 'light';
  var sudFs = document.getElementById('game-fullscreen');
  function applySudTheme() {
    var theme = sudIsDark ? 'dark' : 'light';
    host.setAttribute('data-theme', theme);
    if (sudFs) sudFs.setAttribute('data-game-theme', theme);
  }
  applySudTheme();
  var sudThemeBtn = document.createElement('button');
  sudThemeBtn.type = 'button';
  sudThemeBtn.className = 'gfs-game-theme-btn';
  sudThemeBtn.id = 'sud-theme-toggle';
  sudThemeBtn.textContent = sudIsDark ? '[ DAY ]' : '[ NIGHT ]';
  sudFs.appendChild(sudThemeBtn);
  host.innerHTML =
    '<header class="sud-head">' +
      '<p class="sud-kicker">RAN · PLAYROOM</p>' +
      '<h3 class="sud-title-head">Sudoku</h3>' +
      '<p class="sud-hint">Arrows · 1–9 to fill · Delete or 0 clears</p>' +
    '</header>' +
    '<div class="sud-toolbar" role="toolbar" aria-label="Sudoku">' +
      '<span class="sud-tool-label">New</span>' +
      '<div class="sud-diff-group" role="group" aria-label="Difficulty">' +
      '<button type="button" class="sud-btn" data-sud-diff="easy">Easy</button>' +
      '<button type="button" class="sud-btn sud-btn--on" data-sud-diff="medium">Medium</button>' +
      '<button type="button" class="sud-btn" data-sud-diff="hard">Hard</button>' +
      '</div>' +
    '</div>' +
    '<div class="sud-grid" role="grid" aria-label="Sudoku grid"></div>' +
    '<p class="sud-msg" aria-live="polite"></p>';

  var gridEl = host.querySelector('.sud-grid');
  var msgEl = host.querySelector('.sud-msg');
  var cellEls = [];

  function setMsg(text) {
    msgEl.textContent = text || '';
  }

  function newRound(d) {
    diff = d;
    solution = sudGenerateSolution();
    puzzle = sudDigPuzzle(solution, DIGS[diff]);
    player = sudBoardCopy(puzzle);
    for (gi = 0; gi < 81; gi++) given[gi] = puzzle[gi] !== 0;
    focusIx = focusIx >= 0 ? focusIx : 0;
    host.querySelectorAll('.sud-btn[data-sud-diff]').forEach(function(btn) {
      btn.classList.toggle('sud-btn--on', btn.dataset.sudDiff === diff);
    });
    setMsg('');
    drawGrid();
  }

  function drawGrid() {
    var badMap = sudConflictMask(player);
    var solved = sudBoardSolved(player, solution);

    gridEl.innerHTML = '';
    cellEls = [];
    var r;
    var c;

    function cellClass(ix) {
      var row = Math.floor(ix / 9);
      var col = ix % 9;
      var cls = 'sud-cell';
      var mega = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      var tone = ['a', 'b', 'c', 'b', 'c', 'a', 'c', 'a', 'b'][mega];
      cls += ' sud-zone-' + tone;
      if (row % 3 === 0) cls += ' sud-cell--th-t';
      if (col % 3 === 0) cls += ' sud-cell--th-l';
      if ((row + 1) % 3 === 0) cls += ' sud-cell--th-b';
      if ((col + 1) % 3 === 0) cls += ' sud-cell--th-r';
      if (given[ix]) cls += ' sud-cell--given';
      if (badMap[ix]) cls += ' sud-cell--bad';
      if (ix === focusIx) cls += ' sud-cell--focus';
      return cls;
    }

    for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        var ix = sudIdx(r, c);
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = cellClass(ix);
        cell.dataset.ix = String(ix);
        cell.setAttribute('role', 'gridcell');
        var v = player[ix];
        cell.textContent = v ? String(v) : '';
        cell.setAttribute('aria-label',
          given[ix] ? 'Given ' + v : (v ? 'Cell ' + v : 'Empty'));
        gridEl.appendChild(cell);
        cellEls.push(cell);
      }
    }

    if (solved) setMsg('Complete — solved.');
    else if (cellEls.length) {
      var fi = focusIx >= 0 ? focusIx : 0;
      cellEls[fi].focus();
    }
  }

  function moveFocus(dr, dc) {
    if (focusIx < 0) focusIx = 0;
    var rr = Math.floor(focusIx / 9);
    var cc = focusIx % 9;
    rr = Math.max(0, Math.min(8, rr + dr));
    cc = Math.max(0, Math.min(8, cc + dc));
    focusIx = sudIdx(rr, cc);
    drawGrid();
  }

  function tryDigit(ix, digit) {
    if (given[ix]) return;
    player[ix] = digit;
    drawGrid();
    if (sudBoardSolved(player, solution)) {
      setMsg('Complete — solved.');
      return;
    }
    var badMap = sudConflictMask(player);
    if (digit !== 0 && badMap[ix]) setMsg('Conflict in row, column, or box.');
    else setMsg('');
  }

  gridEl.addEventListener('click', function(e) {
    var btn = e.target.closest('.sud-cell');
    if (!btn) return;
    focusIx = parseInt(btn.dataset.ix, 10);
    drawGrid();
  });

  host.querySelector('.sud-toolbar').addEventListener('click', function(e) {
    var b = e.target.closest('[data-sud-diff]');
    if (!b) return;
    newRound(b.dataset.sudDiff);
  });

  sudThemeBtn.addEventListener('click', function() {
    sudIsDark = !sudIsDark;
    applySudTheme();
    sudThemeBtn.textContent = sudIsDark ? '[ DAY ]' : '[ NIGHT ]';
  });

  ranGameFullscreenClosePrep();
  ranFullscreenCleanup = function() {
    if (sudThemeBtn.parentNode) sudThemeBtn.parentNode.removeChild(sudThemeBtn);
    if (sudFs) sudFs.removeAttribute('data-game-theme');
  };
  ranGameFsEsc = function(e) {
    if (e.key === 'Escape')
      document.getElementById('gfs-close').click();
  };
  document.addEventListener('keydown', ranGameFsEsc);

  host.addEventListener('keydown', function(e) {
    if (focusIx < 0) return;
    if (e.target && e.target.closest('.sud-toolbar')) return;

    if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1, 0); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1, 0); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveFocus(0, -1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); moveFocus(0, 1); }
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      e.preventDefault();
      tryDigit(focusIx, 0);
    }
    else {
      var d = parseInt(e.key, 10);
      if (d >= 1 && d <= 9 && !given[focusIx]) {
        e.preventDefault();
        tryDigit(focusIx, d);
      }
    }
  });

  drawGrid();
}


/* ────────────────────────────────────────────────────
   PLAYROOM — Memory Grid (colour pairs · +100 per match · lock after miss)
   ──────────────────────────────────────────────────── */

/** Pair tile colours — vivid cyan/teal · blue · green · amber/orange/rust (no pink/purple) */
var MEMORY_PAIR_HEX = [
  '#1EE6DC', '#2AA9FF', '#1B7AE8', '#0B5BBB',
  '#00CFB0', '#16CF7A', '#45E06C', '#8EE02C',
  '#E8DB1A', '#F5B814', '#FF9F1E', '#FF7518',
  '#EA4E1D', '#C73F18', '#0AAAA8', '#0C8FAB',
  '#158E6F', '#5AB31A',
];

function memoryFullscreenMount(host) {
  var diff = 'medium';
  var CFG = {
    easy:   { rows: 4, cols: 4, pairs: 8 },
    medium: { rows: 6, cols: 4, pairs: 12 },
    hard:   { rows: 6, cols: 6, pairs: 18 },
  };

  /** pair ids 0 … pairs−1 twice, shuffled; grid always rows×cols === pairs×2 */
  var pairId = [];
  var matched = [];
  var pickA = -1;
  var pickB = -1;
  var inputLocked = false;
  var score = 0;
  var pairsTotal = 0;
  var flipBackTimer = null;

  var memIsDark = document.documentElement.dataset.theme !== 'light';
  host.className = 'gfs-body gfs-body--memory';
  var memFs = document.getElementById('game-fullscreen');
  function applyMemTheme() {
    var theme = memIsDark ? 'dark' : 'light';
    host.setAttribute('data-theme', theme);
    if (memFs) memFs.setAttribute('data-game-theme', theme);
  }
  applyMemTheme();
  var memThemeBtn = document.createElement('button');
  memThemeBtn.type = 'button';
  memThemeBtn.className = 'gfs-game-theme-btn';
  memThemeBtn.id = 'mem-theme-toggle';
  memThemeBtn.textContent = memIsDark ? '[ DAY ]' : '[ NIGHT ]';
  memFs.appendChild(memThemeBtn);
  host.innerHTML =
    '<header class="mem-head">' +
      '<p class="mem-kicker">RAN · PLAYROOM</p>' +
      '<h3 class="mem-title-head">Memory Grid</h3>' +
      '<p class="mem-hint">Tap two tiles of the same colour to clear (+100). Each pair has its own hue — a mismatch briefly hides again.</p>' +
    '</header>' +
    '<div class="mem-toolbar" role="toolbar" aria-label="Memory Grid">' +
      '<span class="mem-tool-label">New</span>' +
      '<div class="mem-diff-group" role="group" aria-label="Difficulty">' +
      '<button type="button" class="mem-btn" data-mem-diff="easy">Easy</button>' +
      '<button type="button" class="mem-btn mem-btn--on" data-mem-diff="medium">Medium</button>' +
      '<button type="button" class="mem-btn" data-mem-diff="hard">Hard</button>' +
      '</div>' +
    '</div>' +
    '<p class="mem-phase" id="mem-phase"></p>' +
    '<div class="mem-grid-wrap">' +
      '<div class="mem-playfield-shell">' +
        '<div class="mem-grid" id="mem-game-grid"></div>' +
      '</div>' +
    '</div>' +
    '<p class="mem-msg" id="mem-msg" aria-live="polite"></p>';

  var gridEl = host.querySelector('#mem-game-grid');
  var msgEl = host.querySelector('#mem-msg');
  var phaseEl = host.querySelector('#mem-phase');

  /*
   * Distinct hue per pair id — “same visible colour ⇒ same logical pair”.
   * (Older %3 recycle made unrelated pairs share a colour and confuse matching.)
   */
  function pairFlatFill(pid) {
    return MEMORY_PAIR_HEX[pid % MEMORY_PAIR_HEX.length];
  }

  function boardSpec() {
    var cfg = CFG[diff];
    var rows = cfg.rows != null ? cfg.rows : cfg.dim;
    var cols = cfg.cols != null ? cfg.cols : cfg.dim;
    var sz = rows * cols;
    var pairs = cfg.pairs;
    pairs = Math.max(2, Math.min(pairs, sz >> 1));
    if (pairs * 2 !== sz) pairs = sz >> 1;
    return { rows: rows, cols: cols, pairs: pairs };
  }

  function setMsg(text) {
    msgEl.textContent = text || '';
  }

  function stopMemoryTimers() {
    if (flipBackTimer) {
      clearTimeout(flipBackTimer);
      flipBackTimer = null;
    }
  }

  function pairsRemaining() {
    var open = {}; var kk;
    for (kk = 0; kk < pairId.length; kk++) {
      var p = pairId[kk];
      if (p < 0) continue;
      if (!matched[kk]) open[p] = true;
    }
    var n = 0;
    var k;
    for (k in open) {
      if (Object.prototype.hasOwnProperty.call(open, k)) n++;
    }
    return n;
  }

  function refreshStatusLine() {
    var left = pairsRemaining();
    phaseEl.textContent =
      pairsTotal + ' pairs · Score ' + score + (left === 0 && pairsTotal > 0 ? ' · complete' : '');
  }

  function refreshToolbar() {
    host.querySelectorAll('.mem-btn[data-mem-diff]').forEach(function(btn) {
      btn.classList.toggle('mem-btn--on', btn.dataset.memDiff === diff);
    });
  }

  function tileFaceVisible(i) {
    if (pairId[i] < 0) return false;
    if (matched[i]) return true;
    return i === pickA || i === pickB;
  }

  function paintGrid() {
    var spec = boardSpec();
    var sz = pairId.length;
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = 'repeat(' + spec.cols + ', minmax(0, 1fr))';

    var ii;
    for (ii = 0; ii < sz; ii++) {
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'mem-cell';
      cell.dataset.idx = String(ii);
      cell.style.setProperty('-webkit-appearance', 'none');
      cell.style.setProperty('appearance', 'none');
      cell.style.borderRadius = '0';
      var show = tileFaceVisible(ii);
      var lockThis = inputLocked || (pickA >= 0 && pickB >= 0);
      cell.disabled = matched[ii] || lockThis;
      cell.setAttribute(
        'aria-label',
        matched[ii] ? 'Matched' : show ? 'Revealed' : 'Hidden'
      );
      cell.setAttribute('aria-pressed', matched[ii] || show ? 'true' : 'false');
      if (show || matched[ii]) {
        cell.classList.add('mem-cell--show');
        if (matched[ii]) cell.classList.add('mem-cell--matched');
        cell.style.background = pairFlatFill(pairId[ii]);
        cell.style.borderColor = 'rgba(0, 0, 0, 0.38)';
      } else {
        cell.style.background = '';
        cell.style.borderColor = '';
      }

      gridEl.appendChild(cell);
    }
    refreshStatusLine();
  }

  function buildDeck(rows, cols, pairs) {
    var sz = rows * cols;
    pairs = Math.max(2, Math.min(pairs, sz >> 1));
    if (pairs * 2 !== sz) pairs = sz >> 1;
    var order = []; var i;
    for (i = 0; i < sz; i++) order.push(i);
    sudShuffle(order);
    var deck = new Array(sz);
    var pidList = [];
    for (i = 0; i < pairs; i++) { pidList.push(i); pidList.push(i); }
    sudShuffle(pidList);
    for (i = 0; i < sz; i++) deck[order[i]] = pidList[i];
    return deck;
  }

  function startRound(which) {
    stopMemoryTimers();
    pickA = -1;
    pickB = -1;
    inputLocked = false;
    score = 0;

    diff = which;
    refreshToolbar();
    var spec = boardSpec();
    pairsTotal = spec.pairs;
    pairId = buildDeck(spec.rows, spec.cols, pairsTotal);
    matched = []; var zz;
    for (zz = 0; zz < pairId.length; zz++) matched[zz] = false;

    setMsg('');
    paintGrid();
  }

  gridEl.addEventListener('click', function(e) {
    var btn = e.target.closest('.mem-cell');
    if (!btn || btn.disabled) return;
    if (inputLocked) return;

    var idx = parseInt(btn.dataset.idx, 10);
    if (idx !== idx || matched[idx]) return;

    if (pickA < 0) {
      pickA = idx;
      setMsg('');
      paintGrid();
      return;
    }

    if (idx === pickA) return;

    pickB = idx;

    var pa = pairId[pickA];
    var pb = pairId[pickB];
    if (pa === pb && pa >= 0) {
      matched[pickA] = true;
      matched[pickB] = true;
      score += 100;
      pickA = -1;
      pickB = -1;
      setMsg('+100 · pair cleared.');
      paintGrid();
      if (pairsRemaining() === 0) setMsg('All pairs cleared — ' + score + ' pts.');
      return;
    }

    inputLocked = true;
    setMsg('Mismatch — wait…');
    paintGrid();

    stopMemoryTimers();
    flipBackTimer = setTimeout(function() {
      flipBackTimer = null;
      pickA = -1;
      pickB = -1;
      inputLocked = false;
      setMsg('');
      paintGrid();
    }, 820);
  });

  host.querySelector('.mem-toolbar').addEventListener('click', function(e) {
    var b = e.target.closest('[data-mem-diff]');
    if (!b) return;
    startRound(b.dataset.memDiff);
  });

  memThemeBtn.addEventListener('click', function() {
    memIsDark = !memIsDark;
    applyMemTheme();
    memThemeBtn.textContent = memIsDark ? '[ DAY ]' : '[ NIGHT ]';
  });

  ranFullscreenCleanup = function() {
    stopMemoryTimers();
    if (memThemeBtn.parentNode) memThemeBtn.parentNode.removeChild(memThemeBtn);
    if (memFs) memFs.removeAttribute('data-game-theme');
  };
  ranGameFsEsc = function(e) {
    if (e.key === 'Escape')
      document.getElementById('gfs-close').click();
  };
  document.addEventListener('keydown', ranGameFsEsc);

  startRound('medium');
}

/* ────────────────────────────────────────────────────
   HOME TEXTURE — PARTICLE TEXT ANIMATION
   "Becoming oneself / is a long experiment."
   Retro-futuristic pixel dots drifting on the texture
   ──────────────────────────────────────────────────── */
function initTextParticles() {
  var container = document.getElementById('home-texture');
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0;
  var textParticles = [];
  var bgParticles = [];
  var raf = null;
  var t = 0;
  var grainImg = new Image();
  var grainReady = false;
  var ranGlyphImg = new Image();
  var songGlyphImg = new Image();
  var becomingGlyphImg = new Image();
  var glyphsReady = false;
  var becomingGlyphReady = false;

  var LINE1 = 'Becoming oneself';
  var LINE2 = 'is a long experiment.';
  var QUOTE_FONT_SIZE = 88;
  var INTRO_LINE1 = 'RAN';
  var INTRO_LINE2 = 'SONG';
  var INTRO_MIN_PX = 52;
  var INTRO_LINE_GAP_RATIO = 0.07;
  var DOT = 4;
  var BG_DOT = 3;
  var HOME_NAV_RESERVE = 56;
  var HOME_NAV_MENU_LINE_PX = 13;
  var HOME_NAV_MENU_LINE_GAP = 2;
  var HOME_NAV_REVEAL_FALLBACK_MS = 3200;
  var HOME_NAV_MOVE_PX = 32;
  var navRevealTimer = null;
  var navRevealDone = false;
  var navRevealAnchor = null;
  var quoteLineLead = 14;
  var SAMPLE = 3;

  // "oneself" hover zone + portrait
  var oneselfZone = { x1:0, x2:0, y1:0, y2:0 };
  var ranZone = { x1: 0, x2: 0, y1: 0, y2: 0 };
  var songZone = { x1: 0, x2: 0, y1: 0, y2: 0 };
  var hoverRan = false;
  var hoverSong = false;
  var heroMorph = null;
  var heroMorphIn = false;
  var HERO_MORPH_MS = 400;
  var reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = reducedMotionMq.matches;
  if (reducedMotionMq.addEventListener) {
    reducedMotionMq.addEventListener('change', function () {
      reducedMotion = reducedMotionMq.matches;
    });
  } else if (reducedMotionMq.addListener) {
    reducedMotionMq.addListener(function () {
      reducedMotion = reducedMotionMq.matches;
    });
  }
  var portrait = document.getElementById('home-portrait');
  if (portrait && portrait.parentNode === container)
    container.appendChild(portrait);

  // Mouse state for water-drag
  var mouseX = -9999, mouseY = -9999;
  var prevMX = -9999, prevMY = -9999;
  var mouseDX = 0, mouseDY = 0;
  var mouseActive = false;
  var particleDotInk = readCssVar('--particle-ink', '#000');
  var particleBgInk = readCssVar('--home-bg-particle', 'rgba(0,0,0,0.11)');

  grainImg.onload = function () {
    grainReady = true;
    if (typeof HOME_HERO_PARTICLE_REBUILD === 'function') HOME_HERO_PARTICLE_REBUILD();
  };
  grainImg.src = 'textures/home-grain-even.png';

  function parseInkRgb(ink) {
    if (!ink || ink[0] !== '#') return [0, 0, 0];
    var h = ink.slice(1);
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16),
      ];
    }
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }

  var glyphBoundsCache = {};
  var GLYPH_ASSET_V = '20260520c';

  function clearGlyphBoundsCache() {
    glyphBoundsCache = {};
  }

  function glyphInkBounds(img) {
    var key = (img.src || 'glyph') + '|' + GLYPH_ASSET_V;
    if (glyphBoundsCache[key]) return glyphBoundsCache[key];
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var tc = document.createElement('canvas');
    tc.width = w;
    tc.height = h;
    var tctx = tc.getContext('2d');
    tctx.drawImage(img, 0, 0);
    var data = tctx.getImageData(0, 0, w, h).data;
    var minX = w;
    var minY = h;
    var maxX = 0;
    var maxY = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var ii = (y * w + x) * 4;
        var lum = (data[ii] + data[ii + 1] + data[ii + 2]) / 765;
        if (lum < 0.42) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    var bounds;
    if (minX > maxX) {
      bounds = { sx: 0, sy: 0, sw: w, sh: h, inkAspect: w / h };
    } else {
      var trim = 3;
      minX = Math.max(0, minX - trim);
      minY = Math.max(0, minY - trim);
      maxX = Math.min(w - 1, maxX + trim);
      maxY = Math.min(h - 1, maxY + trim);
      var sw = maxX - minX + 1;
      var sh = maxY - minY + 1;
      bounds = { sx: minX, sy: minY, sw: sw, sh: sh, inkAspect: sw / sh };
    }
    glyphBoundsCache[key] = bounds;
    return bounds;
  }

  function blitGlyphInk(destCtx, img, destX, destY, destW, destH, ink, bounds) {
    var rgb = parseInkRgb(ink);
    var b = bounds || glyphInkBounds(img);
    var tc = document.createElement('canvas');
    tc.width = destW;
    tc.height = destH;
    var tctx = tc.getContext('2d');
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(img, b.sx, b.sy, b.sw, b.sh, 0, 0, destW, destH);
    var src = tctx.getImageData(0, 0, destW, destH).data;
    var out = destCtx.createImageData(destW, destH);
    for (var i = 0; i < src.length; i += 4) {
      var lum = (src[i] + src[i + 1] + src[i + 2]) / 765;
      if (lum < 0.42) {
        out.data[i] = rgb[0];
        out.data[i + 1] = rgb[1];
        out.data[i + 2] = rgb[2];
        out.data[i + 3] = 255;
      }
    }
    destCtx.putImageData(out, destX, destY);
  }

  function layoutIntroGlyphs(ranImg, songImg, maxW, maxH, padTop) {
    var ranB = glyphInkBounds(ranImg);
    var songB = glyphInkBounds(songImg);
    var ranH = Math.round(maxH * 0.48);
    var ranW = Math.round(ranH * ranB.inkAspect);
    var songH = Math.round(maxH * 0.54);
    var songW = Math.round(songH * songB.inkAspect);
    var gap = Math.round(Math.max(ranH, songH) * INTRO_LINE_GAP_RATIO);
    var maxRanW = Math.round(maxW * 0.88);
    var maxSongW = Math.round(maxW * 0.92);
    if (ranW > maxRanW) {
      var ranScale = maxRanW / ranW;
      ranW = maxRanW;
      ranH = Math.round(ranH * ranScale);
    }
    if (songW > maxSongW) {
      var songScale = maxSongW / songW;
      songW = maxSongW;
      songH = Math.round(songH * songScale);
    }
    var blockH = ranH + gap + songH;
    if (blockH > maxH) {
      var s = maxH / blockH;
      ranW = Math.round(ranW * s);
      ranH = Math.round(ranH * s);
      songW = Math.round(songW * s);
      songH = Math.round(songH * s);
      gap = Math.round(gap * s);
    }
    return {
      ranW: ranW,
      ranH: ranH,
      songW: songW,
      songH: songH,
      gap: gap,
      blockH: ranH + gap + songH,
      ranB: ranB,
      songB: songB,
    };
  }

  function layoutQuoteGlyph(img, maxW, maxH, viewH, padTop) {
    var b = glyphInkBounds(img);
    var glyphH = Math.round(maxH * 0.92);
    var targetW = Math.round(glyphH * b.inkAspect);
    if (targetW > Math.round(maxW * 0.98)) {
      targetW = Math.round(maxW * 0.98);
      glyphH = Math.round(targetW / b.inkAspect);
    }
    if (glyphH > maxH) {
      glyphH = maxH;
      targetW = Math.round(glyphH * b.inkAspect);
    }
    var navReserve = HOME_NAV_RESERVE + HOME_NAV_MENU_LINE_PX * HOME_NAV_MENU_LINE_GAP;
    var top = Math.round((viewH - glyphH - navReserve) * 0.5);
    if (top < padTop) top = padTop;
    return { w: targetW, h: glyphH, top: top, b: b };
  }

  function syncGlyphsReady() {
    var introOk =
      ranGlyphImg.complete &&
      ranGlyphImg.naturalWidth > 0 &&
      songGlyphImg.complete &&
      songGlyphImg.naturalWidth > 0;
    var quoteOk =
      becomingGlyphImg.complete && becomingGlyphImg.naturalWidth > 0;
    var changed = false;
    if (introOk && !glyphsReady) {
      glyphsReady = true;
      changed = true;
    }
    if (quoteOk && !becomingGlyphReady) {
      becomingGlyphReady = true;
      changed = true;
    }
    if (changed) {
      clearGlyphBoundsCache();
      if (typeof HOME_HERO_PARTICLE_REBUILD === 'function') {
        HOME_HERO_PARTICLE_REBUILD();
      }
    }
    return introOk;
  }

  ranGlyphImg.onload = syncGlyphsReady;
  songGlyphImg.onload = syncGlyphsReady;
  becomingGlyphImg.onload = syncGlyphsReady;
  clearGlyphBoundsCache();
  ranGlyphImg.src = 'photos/home-ran-glyph.png?v=' + GLYPH_ASSET_V;
  songGlyphImg.src = 'photos/home-song-glyph.png?v=' + GLYPH_ASSET_V;
  becomingGlyphImg.src = 'photos/home-becoming-glyph.png?v=' + GLYPH_ASSET_V;
  syncGlyphsReady();

  function isHomeDarkTheme() {
    return document.documentElement.dataset.theme === 'dark';
  }

  function homeParticleInk() {
    return isHomeDarkTheme() ? '#f4f2ee' : '#000000';
  }

  function homeBgParticleInk() {
    return isHomeDarkTheme() ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.22)';
  }

  function refreshParticleInk() {
    particleDotInk = homeParticleInk();
    particleBgInk = homeBgParticleInk();
  }

  function makeParticle(ox, oy, kind, weight, tag) {
    return {
      kind: kind || 'text',
      tag: tag || null,
      weight: weight == null ? 1 : weight,
      ox: ox,
      oy: oy,
      cx: 0,
      cy: 0,
      vx: 0,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
      speed: kind === 'bg' ? 0.25 + Math.random() * 0.35 : 0.5 + Math.random() * 0.6,
      amp: kind === 'bg' ? 0.12 + Math.random() * 0.18 : 0.4 + Math.random() * 0.6,
    };
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInCubic(t) {
    return t * t * t;
  }

  function hitIntroZone(mx, my) {
    if (HOME_HERO_PHASE !== 'intro') return null;
    if (mx >= ranZone.x1 && mx <= ranZone.x2 && my >= ranZone.y1 && my <= ranZone.y2) return 'ran';
    if (mx >= songZone.x1 && mx <= songZone.x2 && my >= songZone.y1 && my <= songZone.y2) return 'song';
    return null;
  }

  function revealHomeNav(mode) {
    if (navRevealDone) return;
    navRevealDone = true;
    if (navRevealTimer) {
      clearTimeout(navRevealTimer);
      navRevealTimer = null;
    }
    var ph = document.getElementById('panel-home');
    if (!ph || !ph.classList.contains('panel--active')) return;
    ph.setAttribute('data-home-nav-reveal-mode', mode || 'linger');
    ph.classList.add('home-nav-reveal');
  }

  function tryRevealHomeNav(mx, my, mode) {
    if (navRevealDone || HOME_HERO_PHASE !== 'intro') return;
    if (hitIntroZone(mx, my)) {
      revealHomeNav('explore');
      return;
    }
    if (my > H * 0.58) {
      revealHomeNav('approach');
      return;
    }
    if (navRevealAnchor == null) {
      navRevealAnchor = { x: mx, y: my };
      return;
    }
    var dx = mx - navRevealAnchor.x;
    var dy = my - navRevealAnchor.y;
    if (dx * dx + dy * dy >= HOME_NAV_MOVE_PX * HOME_NAV_MOVE_PX) {
      revealHomeNav('drift');
    }
  }

  function armHomeNavReveal() {
    navRevealDone = false;
    navRevealAnchor = null;
    var panelHome = document.getElementById('panel-home');
    if (!panelHome) return;
    panelHome.classList.remove('home-nav-reveal');
    panelHome.removeAttribute('data-home-nav-reveal-mode');
    if (navRevealTimer) {
      clearTimeout(navRevealTimer);
      navRevealTimer = null;
    }
    if (reducedMotion) {
      panelHome.classList.add('home-nav-reveal');
      navRevealDone = true;
      return;
    }
    navRevealTimer = setTimeout(function () {
      revealHomeNav('linger');
    }, HOME_NAV_REVEAL_FALLBACK_MS);
  }

  function syncHomeChrome() {
    var panelHome = document.getElementById('panel-home');
    if (!panelHome) return;
    panelHome.setAttribute('data-home-hero-phase', HOME_HERO_PHASE);
    panelHome.classList.add('home-hero-hint-on');
    if (HOME_HERO_PHASE === 'intro') {
      armHomeNavReveal();
    } else {
      revealHomeNav('quote');
    }
  }

  function beginHeroMorph() {
    if (heroMorph) return;
    if (reducedMotion) {
      HOME_HERO_PHASE = HOME_HERO_PHASE === 'intro' ? 'quote' : 'intro';
      buildParticles();
      syncHomeChrome();
      return;
    }
    heroMorph = { phase: 'out', t0: performance.now(), swapped: false };
    var panelHome = document.getElementById('panel-home');
    if (panelHome) panelHome.classList.add('home-hero-morphing');
  }

  function appendBackgroundParticles() {
    bgParticles = [];
    if (W < 8 || H < 8) return;

    var step = Math.max(6, Math.sqrt((W * H) / 5500));

    if (grainReady && grainImg.naturalWidth) {
      var bgOff = document.createElement('canvas');
      bgOff.width = W;
      bgOff.height = H;
      var bctx = bgOff.getContext('2d');
      var iw = grainImg.naturalWidth;
      var ih = grainImg.naturalHeight;
      var scale = Math.max(W / iw, H / ih);
      var dw = iw * scale;
      var dh = ih * scale;
      var dx = (W - dw) / 2;
      var dy = (H - dh) / 2;
      bctx.drawImage(grainImg, dx, dy, dw, dh);
      var data = bctx.getImageData(0, 0, W, H).data;
      for (var bx = step * 0.5; bx < W; bx += step) {
        for (var by = step * 0.5; by < H; by += step) {
          var px = Math.min(W - 1, Math.round(bx));
          var py = Math.min(H - 1, Math.round(by));
          var ii = (py * W + px) * 4;
          var lum = (data[ii] + data[ii + 1] + data[ii + 2]) / 765;
          var chance = 0.32 + (1 - lum) * 0.68;
          if (Math.random() > chance) continue;
          bgParticles.push(
            makeParticle(
              bx + (Math.random() - 0.5) * step * 0.35,
              by + (Math.random() - 0.5) * step * 0.35,
              'bg',
              0.45 + (1 - lum) * 0.55
            )
          );
        }
      }
      return;
    }

    for (var gx = step * 0.5; gx < W; gx += step) {
      for (var gy = step * 0.5; gy < H; gy += step) {
        if (Math.random() > 0.28) continue;
        bgParticles.push(
          makeParticle(
            gx + (Math.random() - 0.5) * step * 0.35,
            gy + (Math.random() - 0.5) * step * 0.35,
            'bg',
            0.55 + Math.random() * 0.35
          )
        );
      }
    }
  }

  function introMonoFont(px) {
    return '700 ' + px + 'px "IBM Plex Mono", monospace';
  }

  function paintIntroLine(octx, text, x, y, px) {
    var strokeW = Math.max(1.5, Math.round(px * 0.038));
    octx.lineWidth = strokeW;
    octx.lineJoin = 'round';
    octx.strokeText(text, x, y);
    octx.fillText(text, x, y);
  }

  /** Largest mono size so RAN / SONG (two lines) fill the left hero panel. */
  /** Large screens: pull hero copy toward centre; small screens: near full bleed. */
  function homeContentBand(viewW) {
    var pad = Math.round(Math.max(28, Math.min(56, viewW * 0.045)));
    if (viewW < 1100) {
      return {
        left: pad,
        width: viewW - pad * 2,
        right: viewW - pad,
        centered: false,
      };
    }
    var width =
      viewW >= 1400 ? Math.min(1080, Math.round(viewW * 0.68)) : Math.round(viewW * 0.76);
    var left = Math.round((viewW - width) / 2);
    return { left: left, width: width, right: left + width, centered: true };
  }

  function fitIntroFontSize(octx, maxW, maxH) {
    var lo = INTRO_MIN_PX;
    var hi = Math.min(400, Math.floor(maxW * 0.98), Math.floor(maxH / 1.85));
    var best = lo;
    while (lo <= hi) {
      var mid = Math.floor((lo + hi) / 2);
      octx.font = introMonoFont(mid);
      var tw = Math.max(octx.measureText(INTRO_LINE1).width, octx.measureText(INTRO_LINE2).width);
      var gap = Math.round(mid * INTRO_LINE_GAP_RATIO);
      var th = mid + gap + Math.round(mid * 0.92) + Math.round(mid * 0.45);
      if (tw <= maxW && th <= maxH) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return best;
  }

  function buildParticles() {
    W = container.offsetWidth;
    H = container.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    var off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    var octx = off.getContext('2d');
    octx.textAlign = 'left';

    var band = homeContentBand(W);
    var padX = band.left;
    var contentW = band.width;
    var endXBand = band.right;
    var padY = Math.round(Math.max(32, Math.min(72, H * 0.06)));
    var startX = padX;
    var phase = HOME_HERO_PHASE;

    var rasterPx;
    var cy;
    var line2Y;
    var navTopPx;
    var introLayout = null;
    var quoteLayout = null;
    var introRanX = startX;
    var introSongX = endXBand;
    var introShiftX = Math.round(Math.max(32, Math.min(72, W * 0.055)));
    if (phase === 'intro') {
      introRanX = startX - introShiftX;
      introSongX = endXBand + introShiftX;
      var introFitW = contentW;
      var introMaxBlockH = Math.round(H * 0.62);
      if (glyphsReady) {
        introLayout = layoutIntroGlyphs(
          ranGlyphImg,
          songGlyphImg,
          introFitW,
          introMaxBlockH,
          0
        );
        var introTop = Math.round((H - introLayout.blockH) * 0.5);
        if (introTop < padY) introTop = padY;
        introLayout.ranTop = introTop;
        introLayout.songTop = introTop + introLayout.ranH + introLayout.gap;
        rasterPx = introLayout.ranH;
        cy = introLayout.ranTop + introLayout.ranH;
        line2Y = introLayout.songTop + introLayout.songH;
      } else {
        rasterPx = fitIntroFontSize(octx, introFitW, introMaxBlockH);
        octx.font = introMonoFont(rasterPx);
        var introGap = Math.round(rasterPx * INTRO_LINE_GAP_RATIO);
        var textBlockH = rasterPx + introGap + Math.round(rasterPx * 0.92);
        var introTop = Math.round((H - textBlockH) * 0.5);
        if (introTop < padY) introTop = padY;
        cy = introTop + rasterPx;
        line2Y = cy + introGap + Math.round(rasterPx * 0.92);
      }
    } else if (becomingGlyphReady) {
      quoteLayout = layoutQuoteGlyph(
        becomingGlyphImg,
        contentW,
        Math.round(H * 0.7),
        H,
        padY
      );
      startX = band.centered
        ? band.left + Math.max(0, Math.round((contentW - quoteLayout.w) / 2))
        : band.left;
      rasterPx = quoteLayout.h;
      cy = quoteLayout.top + Math.round(quoteLayout.h * 0.46);
      line2Y = quoteLayout.top + quoteLayout.h;
    } else {
      rasterPx = QUOTE_FONT_SIZE;
      octx.font = introMonoFont(QUOTE_FONT_SIZE);
      var quoteTextW = Math.max(
        octx.measureText(LINE1).width,
        octx.measureText(LINE2).width
      );
      var quoteBlockH = QUOTE_FONT_SIZE + quoteLineLead + QUOTE_FONT_SIZE;
      var quoteNavGap = QUOTE_FONT_SIZE * HOME_NAV_MENU_LINE_GAP;
      var quoteStackH = quoteBlockH + quoteNavGap + HOME_NAV_RESERVE;
      var quoteBlockTop = Math.round((H - quoteStackH) / 2);
      if (quoteBlockTop < padY) quoteBlockTop = padY;
      cy = quoteBlockTop + QUOTE_FONT_SIZE;
      line2Y = cy + QUOTE_FONT_SIZE + quoteLineLead;
      startX = band.centered
        ? band.left + Math.max(0, Math.round((contentW - quoteTextW) / 2))
        : band.left;
    }

    refreshParticleInk();

    var pad = SAMPLE * 3;
    var x0;
    var x1;
    var y0;
    var y1;

    if (phase === 'intro') {
      var zonePad = Math.round(rasterPx * 0.08);
      if (introLayout) {
        var ranDrawX = introRanX;
        var songDrawX = introSongX - introLayout.songW;
        refreshParticleInk();
        blitGlyphInk(
          octx,
          ranGlyphImg,
          ranDrawX,
          introLayout.ranTop,
          introLayout.ranW,
          introLayout.ranH,
          particleDotInk,
          introLayout.ranB
        );
        blitGlyphInk(
          octx,
          songGlyphImg,
          songDrawX,
          introLayout.songTop,
          introLayout.songW,
          introLayout.songH,
          particleDotInk,
          introLayout.songB
        );
        ranZone.x1 = ranDrawX - zonePad;
        ranZone.x2 = ranDrawX + introLayout.ranW + zonePad;
        ranZone.y1 = introLayout.ranTop - zonePad;
        ranZone.y2 = introLayout.ranTop + introLayout.ranH + zonePad;
        songZone.x1 = songDrawX - zonePad;
        songZone.x2 = introSongX + zonePad;
        songZone.y1 = introLayout.songTop - zonePad;
        songZone.y2 = introLayout.songTop + introLayout.songH + zonePad;
        x0 = Math.max(0, Math.floor(ranDrawX - pad));
        x1 = Math.min(W, Math.ceil(introSongX + pad));
        y0 = Math.max(0, Math.floor(introLayout.ranTop - pad));
        y1 = Math.min(
          H,
          Math.ceil(introLayout.songTop + introLayout.songH + pad)
        );
      } else {
        octx.fillStyle = particleDotInk;
        octx.font = introMonoFont(rasterPx);
        octx.strokeStyle = particleDotInk;
        paintIntroLine(octx, INTRO_LINE1, introRanX, cy, rasterPx);
        octx.textAlign = 'right';
        paintIntroLine(octx, INTRO_LINE2, introSongX, line2Y, rasterPx);
        octx.textAlign = 'left';
        var ranW = octx.measureText(INTRO_LINE1).width;
        var songW = octx.measureText(INTRO_LINE2).width;
        ranZone.x1 = introRanX - zonePad;
        ranZone.x2 = introRanX + ranW + zonePad;
        ranZone.y1 = cy - rasterPx - zonePad;
        ranZone.y2 = cy + zonePad;
        songZone.x1 = introSongX - songW - zonePad;
        songZone.x2 = introSongX + zonePad;
        songZone.y1 = line2Y - rasterPx - zonePad;
        songZone.y2 = line2Y + Math.round(rasterPx * 0.5) + zonePad;
        x0 = Math.max(0, Math.floor(introRanX - pad));
        x1 = Math.min(W, Math.ceil(introSongX + pad));
        y0 = Math.max(0, Math.floor(cy - rasterPx - pad));
        y1 = Math.min(H, Math.ceil(line2Y + rasterPx * 0.45 + pad));
      }
      oneselfZone.x1 = -99999;
      oneselfZone.y1 = -99999;
      oneselfZone.x2 = -99998;
      oneselfZone.y2 = -99998;
      if (portrait) portrait.style.opacity = '0';
    } else {
      if (quoteLayout) {
        refreshParticleInk();
        blitGlyphInk(
          octx,
          becomingGlyphImg,
          startX,
          quoteLayout.top,
          quoteLayout.w,
          quoteLayout.h,
          particleDotInk,
          quoteLayout.b
        );
        var lineSplitY = quoteLayout.top + Math.round(quoteLayout.h * 0.46);
        oneselfZone.x1 = startX + Math.round(quoteLayout.w * 0.34);
        oneselfZone.x2 = startX + quoteLayout.w - 6;
        oneselfZone.y1 = quoteLayout.top;
        oneselfZone.y2 = lineSplitY;
        x0 = Math.max(0, Math.floor(startX - pad));
        x1 = Math.min(W, Math.ceil(startX + quoteLayout.w + pad));
        y0 = Math.max(0, Math.floor(quoteLayout.top - pad));
        y1 = Math.min(H, Math.ceil(quoteLayout.top + quoteLayout.h + pad));
      } else {
        octx.fillStyle = particleDotInk;
        octx.font = introMonoFont(QUOTE_FONT_SIZE);
        octx.fillText(LINE1, startX, cy);
        octx.fillText(LINE2, startX, line2Y);

        var beforeW = octx.measureText('Becoming ').width;
        var oneselfW = octx.measureText('oneself').width;
        oneselfZone.x1 = startX + beforeW;
        oneselfZone.x2 = startX + beforeW + oneselfW;
        oneselfZone.y1 = cy - QUOTE_FONT_SIZE;
        oneselfZone.y2 = cy + 10;

        var w1 = octx.measureText(LINE1).width;
        var w2 = octx.measureText(LINE2).width;
        x0 = Math.max(0, Math.floor(startX - pad));
        x1 = Math.min(W, Math.ceil(startX + Math.max(w1, w2) + pad));
        y0 = Math.max(0, Math.floor(cy - QUOTE_FONT_SIZE - pad));
        y1 = Math.min(H, Math.ceil(line2Y + QUOTE_FONT_SIZE * 0.45 + pad));
      }

      if (portrait) {
        var gapPx = 10;
        var padPx = 8;
        var pw = portrait.offsetWidth;
        if (!pw) pw = Math.round(Math.min(168, Math.max(88, container.offsetWidth * 0.11)));
        var ph = Math.round(pw * 0.75);
        var targetRight = oneselfZone.x2 + 6;
        var leftPx = Math.round(targetRight - pw);
        if (leftPx < padPx) leftPx = padPx;
        if (targetRight > W - padPx && leftPx + pw > W - padPx) {
          leftPx = Math.max(padPx, W - pw - padPx);
        }
        var topPx = Math.round(oneselfZone.y1 - gapPx - ph);
        if (topPx < padPx) topPx = padPx;
        portrait.style.left = leftPx + 'px';
        portrait.style.top = topPx + 'px';
        portrait.style.right = 'auto';
        portrait.style.transform = 'none';
      }
    }

    var iw = x1 - x0;
    var ih = y1 - y0;
    var data = octx.getImageData(x0, y0, iw, ih).data;
    var introTagSplitY =
      phase === 'intro'
        ? introLayout
          ? introLayout.ranTop + introLayout.ranH + Math.round(introLayout.gap * 0.45)
          : line2Y - Math.round(rasterPx * 0.28)
        : 0;
    var textSample = phase === 'quote' && quoteLayout ? 2 : SAMPLE;
    textParticles = [];
    for (var sx = 0; sx < iw; sx += textSample) {
      for (var sy = 0; sy < ih; sy += textSample) {
        var ii = (sy * iw + sx) * 4;
        if (data[ii + 3] > 100) {
          var pTag = null;
          if (phase === 'intro') pTag = y0 + sy < introTagSplitY ? 'ran' : 'song';
          textParticles.push(makeParticle(x0 + sx, y0 + sy, 'text', 1, pTag));
        }
      }
    }

    if (heroMorphIn) {
      for (var ti = 0; ti < textParticles.length; ti++) {
        var tp = textParticles[ti];
        tp.cx = (Math.random() - 0.5) * 64;
        tp.cy = (Math.random() - 0.5) * 36;
      }
    }

    appendBackgroundParticles();

    var panelHome = document.getElementById('panel-home');
    if (panelHome) {
      var copyPad = SAMPLE * 3;
      if (phase === 'intro') {
        var songBottomY = introLayout
          ? Math.ceil(introLayout.songTop + introLayout.songH + copyPad)
          : Math.ceil(line2Y + rasterPx * 0.45 + copyPad);
        navTopPx =
          songBottomY + HOME_NAV_MENU_LINE_PX * HOME_NAV_MENU_LINE_GAP;
        panelHome.setAttribute('data-home-nav-align', 'right');
        panelHome.style.setProperty('--home-nav-top', Math.round(navTopPx) + 'px');
        panelHome.style.setProperty(
          '--home-nav-right',
          Math.round(W - introSongX) + 'px'
        );
        panelHome.style.removeProperty('--home-nav-left');
        panelHome.style.removeProperty('--home-nav-width');
      } else {
        var quoteBottomY = quoteLayout
          ? Math.ceil(quoteLayout.top + quoteLayout.h + copyPad)
          : Math.ceil(line2Y + QUOTE_FONT_SIZE * 0.45 + copyPad);
        navTopPx = quoteLayout
          ? quoteBottomY + HOME_NAV_MENU_LINE_PX * HOME_NAV_MENU_LINE_GAP
          : quoteBottomY + QUOTE_FONT_SIZE * (HOME_NAV_MENU_LINE_GAP - 1);
        var quoteRightPx = quoteLayout
          ? startX + quoteLayout.w
          : startX +
            Math.max(
              octx.measureText(LINE1).width,
              octx.measureText(LINE2).width
            );
        if (!quoteLayout) {
          octx.font = introMonoFont(QUOTE_FONT_SIZE);
        }
        panelHome.setAttribute('data-home-nav-align', 'right');
        panelHome.style.setProperty('--home-nav-top', Math.round(navTopPx) + 'px');
        panelHome.style.setProperty(
          '--home-nav-right',
          Math.round(W - quoteRightPx) + 'px'
        );
        panelHome.style.removeProperty('--home-nav-left');
        panelHome.style.removeProperty('--home-nav-width');
      }
    }

    if (HOME_HERO_PHASE === 'intro') {
      container.setAttribute(
        'aria-label',
        'RAN opens About, SONG opens Observer, open space or Enter shows quote'
      );
    } else {
      container.setAttribute(
        'aria-label',
        'Hover oneself for portrait, click open space or Enter to return to RAN SONG'
      );
    }
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'button');
    syncHomeChrome();
  }

  function advanceHeroMorph() {
    if (!heroMorph) return { out: 0, in: 1, morph: null };
    var u = Math.min(1, (performance.now() - heroMorph.t0) / HERO_MORPH_MS);
    if (heroMorph.phase === 'out') {
      if (u >= 0.46 && !heroMorph.swapped) {
        heroMorph.swapped = true;
        HOME_HERO_PHASE = HOME_HERO_PHASE === 'intro' ? 'quote' : 'intro';
        heroMorph.phase = 'in';
        heroMorph.t0 = performance.now();
        heroMorphIn = true;
        buildParticles();
        heroMorphIn = false;
        return { out: 0, in: 0, morph: heroMorph };
      }
      return { out: easeOutCubic(u), in: 0, morph: heroMorph };
    }
    var inU = easeInCubic(u);
    if (u >= 1) {
      heroMorph = null;
      var panelHome = document.getElementById('panel-home');
      if (panelHome) panelHome.classList.remove('home-hero-morphing');
    }
    return { out: 0, in: inU, morph: heroMorph };
  }

  function stepParticle(p, opts) {
    var RADIUS = opts.radius;
    var DRAG = opts.drag;
    var SPRING = opts.spring;
    var DAMPING = opts.damping;
    var MAX_DRAG = opts.maxDrag;
    var ambScale = opts.ambScale;

    var ambX = Math.sin(t * p.speed + p.phase) * p.amp * ambScale;
    var ambY = Math.cos(t * p.speed * 0.7 + p.phase + 1.2) * p.amp * ambScale;

    if (mouseActive) {
      var dx = p.ox + p.cx - mouseX;
      var dy = p.oy + p.cy - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < RADIUS && dist > 0) {
        var influence = Math.pow(1 - dist / RADIUS, 2.8);
        var mdx = Math.max(-26, Math.min(26, mouseDX));
        var mdy = Math.max(-26, Math.min(26, mouseDY));
        p.vx += mdx * DRAG * influence * opts.mousePull;
        p.vy += mdy * DRAG * influence * opts.mousePullY;
        p.vx += (dx / dist) * influence * opts.mouseRepel;
        p.vy += (dy / dist) * influence * opts.mouseRepelY;
      }
    }

    p.vx += -p.cx * SPRING;
    p.vy += -p.cy * SPRING;
    p.vx *= DAMPING;
    p.vy *= DAMPING;
    p.vx = Math.max(-36, Math.min(36, p.vx));
    p.vy = Math.max(-36, Math.min(36, p.vy));
    p.cx += p.vx;
    p.cy += p.vy;

    var dmag = Math.sqrt(p.cx * p.cx + p.cy * p.cy);
    if (dmag > MAX_DRAG) {
      var sc = MAX_DRAG / dmag;
      p.cx *= sc;
      p.cy *= sc;
    }

    return { ambX: ambX, ambY: ambY };
  }

  function drawParticleLayer(list, opts) {
    var k;
    var p;
    var motion;
    var alphaMult = opts.alphaMult;
    for (k = 0; k < list.length; k++) {
      p = list[k];
      motion = stepParticle(p, opts);
      var alpha =
        (opts.alphaBase + opts.alphaRange * Math.sin(t * opts.alphaSpeed + p.phase)) *
        (p.weight == null ? 1 : p.weight);
      if (typeof alphaMult === 'function') alpha = alphaMult(p, alpha);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = opts.ink;
      ctx.fillRect(
        p.ox + p.cx + motion.ambX - opts.dot / 2,
        p.oy + p.cy + motion.ambY - opts.dot / 2,
        opts.dot,
        opts.dot
      );
    }
  }

  function draw() {
    var panelHomeEl = document.getElementById('panel-home');
    if (!panelHomeEl || !panelHomeEl.classList.contains('panel--active')) {
      raf = null;
      return;
    }
    ctx.clearRect(0, 0, W, H);
    t += 0.018;

    refreshParticleInk();

    var morphState = advanceHeroMorph();
    if (
      morphState.morph &&
      morphState.morph.phase === 'out' &&
      !morphState.morph.swapped &&
      !reducedMotion
    ) {
      for (var si = 0; si < textParticles.length; si++) {
        var sp = textParticles[si];
        sp.vx += (Math.random() - 0.5) * 0.9;
        sp.vy += (Math.random() - 0.5) * 0.9;
      }
    }

    var isDarkTheme = isHomeDarkTheme();
    var textAlphaBase = isDarkTheme ? 0.88 : 0.88;
    var textAlphaRange = isDarkTheme ? 0.12 : 0.12;

    function textAlphaMult(p, alpha) {
      var a = alpha;
      if (morphState.morph && morphState.morph.phase === 'out' && !morphState.morph.swapped) {
        a *= 1 - morphState.out * 0.92;
      } else if (morphState.morph && morphState.morph.phase === 'in') {
        a *= morphState.in;
      }
      if (!reducedMotion && HOME_HERO_PHASE === 'intro') {
        if (p.tag === 'ran' && hoverRan) a *= 1.2;
        if (p.tag === 'song' && hoverSong) a *= 1.2;
      }
      return a;
    }

    var ambScaleBg = reducedMotion ? 0.18 : 0.32;
    var ambScaleText = reducedMotion ? 0.22 : 0.42;

    drawParticleLayer(bgParticles, {
      ink: particleBgInk,
      dot: BG_DOT,
      radius: 64,
      drag: 1.1,
      spring: 0.038,
      damping: 0.82,
      maxDrag: 14,
      ambScale: ambScaleBg,
      mousePull: 0.35,
      mousePullY: 0.28,
      mouseRepel: 0.08,
      mouseRepelY: 0.06,
      alphaBase: 0.58,
      alphaRange: 0.38,
      alphaSpeed: 2.2,
    });

    var drawTextDot =
      HOME_HERO_PHASE === 'quote' && becomingGlyphReady ? 5 : DOT;

    drawParticleLayer(textParticles, {
      ink: particleDotInk,
      dot: drawTextDot,
      radius: 76,
      drag: 2.35,
      spring: 0.045,
      damping: 0.795,
      maxDrag: 28,
      ambScale: ambScaleText,
      mousePull: 0.9,
      mousePullY: 0.74,
      mouseRepel: 0.22,
      mouseRepelY: 0.18,
      alphaBase: textAlphaBase,
      alphaRange: textAlphaRange,
      alphaSpeed: 3,
      alphaMult: textAlphaMult,
    });

    ctx.globalAlpha = 1;
    mouseDX *= 0.78;
    mouseDY *= 0.78;
    raf = requestAnimationFrame(draw);
  }

  // Mouse tracking: drag physics + oneself → portrait
  container.addEventListener('mousemove', function(e) {
    var rect = container.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    if (prevMX > -9000) {
      mouseDX = mx - prevMX;
      mouseDY = my - prevMY;
    }
    prevMX = mx; prevMY = my;
    mouseX = mx; mouseY = my;
    mouseActive = true;

    // Portrait reveal on "oneself" zone
    var inZone = mx >= oneselfZone.x1 && mx <= oneselfZone.x2 &&
                 my >= oneselfZone.y1 && my <= oneselfZone.y2;
    if (portrait) portrait.style.opacity = inZone ? '0.75' : '0';

    hoverRan = false;
    hoverSong = false;
    var introHit = hitIntroZone(mx, my);
    if (introHit === 'ran') hoverRan = true;
    if (introHit === 'song') hoverSong = true;
    if (introHit) container.setAttribute('data-hover-zone', introHit);
    else container.removeAttribute('data-hover-zone');
    tryRevealHomeNav(mx, my);
  });
  container.addEventListener('mouseleave', function() {
    mouseActive = false;
    mouseDX = 0; mouseDY = 0;
    prevMX = -9999; prevMY = -9999;
    if (portrait) portrait.style.opacity = '0';
    hoverRan = false;
    hoverSong = false;
    container.removeAttribute('data-hover-zone');
  });

  var togglePtrDown = false;
  var togglePtrStart = null;
  var toggleMovedTooMuch = false;
  var TOGGLE_MAX_MOVE = 14;
  container.addEventListener('pointerdown', function(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    togglePtrDown = true;
    toggleMovedTooMuch = false;
    togglePtrStart = { x: e.clientX, y: e.clientY };
  });
  container.addEventListener('pointermove', function(e) {
    if (!togglePtrDown || !togglePtrStart || toggleMovedTooMuch) return;
    var d = Math.abs(e.clientX - togglePtrStart.x) + Math.abs(e.clientY - togglePtrStart.y);
    if (d > TOGGLE_MAX_MOVE) toggleMovedTooMuch = true;
  });
  container.addEventListener('pointerup', function(e) {
    if (!togglePtrDown) return;
    var start = togglePtrStart;
    var moved = toggleMovedTooMuch;
    togglePtrDown = false;
    togglePtrStart = null;
    toggleMovedTooMuch = false;
    if (!start || moved) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var d = Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y);
    if (d > TOGGLE_MAX_MOVE) return;
    var rect = container.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    if (HOME_HERO_PHASE === 'intro') {
    } else if (
      mx >= oneselfZone.x1 &&
      mx <= oneselfZone.x2 &&
      my >= oneselfZone.y1 &&
      my <= oneselfZone.y2
    ) {
      return;
    }
    beginHeroMorph();
  });
  container.addEventListener('pointercancel', function() {
    togglePtrDown = false;
    togglePtrStart = null;
    toggleMovedTooMuch = false;
  });

  container.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    beginHeroMorph();
  });

  HOME_HERO_PARTICLE_REBUILD = buildParticles;
  HOME_HERO_STOP_DRAW = function () {
    if (raf != null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };
  HOME_HERO_RESUME_DRAW = function () {
    var ph = document.getElementById('panel-home');
    if (!ph || !ph.classList.contains('panel--active')) return;
    if (raf != null) return;
    raf = requestAnimationFrame(draw);
  };

  HOME_NAV_CANCEL_REVEAL = function () {
    if (navRevealTimer) {
      clearTimeout(navRevealTimer);
      navRevealTimer = null;
    }
    navRevealDone = false;
    navRevealAnchor = null;
  };

  buildParticles();
  HOME_HERO_RESUME_DRAW();

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildParticles, 200);
  });

  window.addEventListener('ransong-theme-change', buildParticles);
}

/* ────────────────────────────────────────────────────
   SECTION NAVIGATION
   ──────────────────────────────────────────────────── */
function showSection(id) {
  if (id !== 'home' && typeof HOME_HERO_STOP_DRAW === 'function') HOME_HERO_STOP_DRAW();
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('panel--active'); });
  var panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('panel--active');

  var panelHome = document.getElementById('panel-home');
  if (panelHome && id !== 'home') {
    if (typeof HOME_NAV_CANCEL_REVEAL === 'function') HOME_NAV_CANCEL_REVEAL();
    panelHome.classList.remove('home-hero-morphing', 'home-nav-reveal', 'home-hero-hint-on');
  }

  var nav = document.getElementById('global-nav');
  if (id === 'home') {
    HOME_HERO_PHASE = 'intro';
    if (typeof HOME_HERO_PARTICLE_REBUILD === 'function') HOME_HERO_PARTICLE_REBUILD();
    nav.classList.remove('visible');
    if (typeof HOME_HERO_RESUME_DRAW === 'function') HOME_HERO_RESUME_DRAW();
  } else {
    nav.classList.add('visible');
    document.querySelectorAll('.gnav-link').forEach(function(l) {
      l.classList.toggle('active', l.dataset.section === id);
    });
    document.getElementById('view-toggle').classList.toggle('gnav-hidden', id !== 'observer');
  }

  if (id !== 'home') {
    var homeLink = document.querySelector('.nav-link[data-section="' + id + '"]');
    if (homeLink) homeLink.classList.add('visited');
  }

  if (id !== 'observer') closeSheet();
  if (activeSection === 'builder' && id !== 'builder') closeBuilderDetail();
  if (id === 'builder' && !builderOnDetail) renderBuilderIndex();
  activeSection = id;
}

document.addEventListener('click', function(e) {
  var target = e.target.closest('[data-section]');
  if (!target) return;
  e.preventDefault();
  showSection(target.dataset.section);
});


/* ────────────────────────────────────────────────────
   OBSERVER — GRID (book spread · gutter-hug) + CAROUSEL
   ──────────────────────────────────────────────────── */
function buildGridColumns() {
  var wrap = document.getElementById('obs-grid-root');
  if (!wrap || wrap.querySelector('.obs-flow-card')) return;

  wrap.innerHTML =
    '<div class="obs-flow-col obs-flow-col--verso"></div>' +
    '<div class="obs-flow-col obs-flow-col--recto"></div>';
  var colV = wrap.querySelector('.obs-flow-col--verso');
  var colR = wrap.querySelector('.obs-flow-col--recto');
  var split = Math.ceil(ITEMS.length / 2);

  ITEMS.forEach(function(item, origIdx) {
    var col;
    if (item.col === 'verso') col = colV;
    else if (item.col === 'recto') col = colR;
    else col = origIdx < split ? colV : colR;

    var a = document.createElement('a');
    a.href = '#';
    a.className =
      'obs-flow-card' +
      (item.wide ? ' obs-flow-card--wide' : '') +
      (item.edge === 'outer' ? ' obs-flow-card--outer' : '');

    var visual = document.createElement('div');
    visual.className = 'obs-flow-visual';

    var img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    img.loading = 'lazy';

    var cap = document.createElement('div');
    cap.className = 'obs-flow-cap';
    var line = document.createElement('span');
    line.className = 'obs-flow-cap-line';
    line.textContent = item.title;
    cap.appendChild(line);

    visual.appendChild(img);
    visual.appendChild(cap);
    a.appendChild(visual);
    a.addEventListener('click', (function(idx) {
      return function(e) {
        e.preventDefault();
        openLightbox(idx);
      };
    })(origIdx));

    col.appendChild(a);
  });
}

var carIndex = 0;
var carouselWheelLockedUntil = 0;

function renderCarousel(idx) {
  carIndex = ((idx % ITEMS.length) + ITEMS.length) % ITEMS.length;
  var item = ITEMS[carIndex];
  var img = document.getElementById('carousel-img');
  if (img) {
    img.src = item.src;
    img.alt = item.title;
  }
  var c = document.getElementById('carousel-counter');
  if (c) {
    var total = ITEMS.length;
    c.textContent =
      String(carIndex + 1).padStart(String(total).length, '0') +
      ' / ' +
      String(total).padStart(String(total).length, '0');
  }
}

document.getElementById('carousel-prev').addEventListener('click', function() {
  renderCarousel(carIndex - 1);
});
document.getElementById('carousel-next').addEventListener('click', function() {
  renderCarousel(carIndex + 1);
});
document.getElementById('carousel-stage').addEventListener('click', function() {
  openLightbox(carIndex);
});

/* ────────────────────────────────────────────────────
   OBSERVER — LIGHTBOX (2-click: image → caption)
   ──────────────────────────────────────────────────── */
var lbState = 0;
var lbIndex = 0;

function openLightbox(idx) {
  lbIndex = idx; lbState = 1;
  carIndex = idx;
  applyLightbox();
  var lb = document.getElementById('obs-lightbox');
  lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
}

function applyLightbox() {
  var item = ITEMS[lbIndex];
  document.getElementById('lb-img').src = item.src;
  document.getElementById('lb-img').alt = item.title;
  document.getElementById('lb-caption').innerHTML =
      '<div class="lb-caption-left">' +
      '<p class="lb-cap-num">' + String(lbIndex + 1).padStart(2,'0') + '</p>' +
      '<p class="lb-cap-cat">'  + item.cat  + '</p>' +
    '</div>' +
    '<div class="lb-caption-right">' +
      '<p class="lb-cap-title">' + item.title + '</p>' +
      '<p class="lb-cap-loc">'   + item.loc   + '</p>' +
      '<p class="lb-cap-desc">'  + item.desc  + '</p>' +
    '</div>';
  var caption = document.getElementById('lb-caption');
  var hint    = document.getElementById('lb-tap-hint');
  var zone    = document.getElementById('lb-img-zone');
  caption.classList.toggle('visible', lbState === 2);
  hint.classList.toggle('hidden',     lbState === 2);
  zone.classList.toggle('shifted',    lbState === 2);
}

function closeLightbox() {
  document.getElementById('obs-lightbox').classList.remove('open');
  document.getElementById('obs-lightbox').setAttribute('aria-hidden', 'true');
  lbState = 0;
  renderCarousel(lbIndex);
}

document.getElementById('lb-img-zone').addEventListener('click', function() {
  lbState = (lbState === 1) ? 2 : 1;
  applyLightbox();
});
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', function(e) {
  e.stopPropagation(); lbIndex = (lbIndex - 1 + ITEMS.length) % ITEMS.length; lbState = 1; applyLightbox();
});
document.getElementById('lb-next').addEventListener('click', function(e) {
  e.stopPropagation(); lbIndex = (lbIndex + 1) % ITEMS.length; lbState = 1; applyLightbox();
});
document.addEventListener('keydown', function(e) {
  if (lbState !== 0) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % ITEMS.length; lbState = 1; applyLightbox(); }
    if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + ITEMS.length) % ITEMS.length; lbState = 1; applyLightbox(); }
    return;
  }
  if (activeView === 'carousel') {
    if (e.key === 'ArrowRight') { e.preventDefault(); renderCarousel(carIndex + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); renderCarousel(carIndex - 1); }
  }
});

document.getElementById('panel-observer').addEventListener('wheel', function(e) {
  if (activeView !== 'carousel' || lbState !== 0) return;
  var now = Date.now();
  if (now < carouselWheelLockedUntil) return;
  var dy = e.deltaY;
  if (Math.abs(dy) < 14) return;
  e.preventDefault();
  carouselWheelLockedUntil = now + 520;
  if (dy > 0) renderCarousel(carIndex + 1);
  else renderCarousel(carIndex - 1);
}, { passive: false });


/* ────────────────────────────────────────────────────
   OBSERVER — LIST
   ──────────────────────────────────────────────────── */
function buildList() {
  var wrap = document.getElementById('obs-list-wrap');
  wrap.innerHTML =
    '<div class="obs-list-header">' +
      '<span>#</span><span></span><span>TITLE</span>' +
      '<span style="text-align:right">CATEGORY</span>' +
    '</div>';
  ITEMS.forEach(function(item, i) {
    var row  = document.createElement('div');
    row.className = 'obs-list-item';
    row.innerHTML =
      '<span class="obs-list-n">' + String(i + 1).padStart(2,'0') + '</span>' +
      '<div class="obs-list-thumb"><img src="' + item.src + '" loading="lazy" alt=""/></div>' +
      '<span class="obs-list-title">' + item.title + '</span>' +
      '<span class="obs-list-cat">'   + item.cat   + '</span>';
    row.addEventListener('click', function() { openSheet(item); });
    wrap.appendChild(row);
  });
}

/* ────────────────────────────────────────────────────
   OBSERVER — VIEW TOGGLE
   Use class toggling — inline style can't override !important
   ──────────────────────────────────────────────────── */
document.querySelectorAll('.vt-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var v = btn.dataset.view;
    document.querySelectorAll('.vt-btn').forEach(function(b) { b.classList.remove('vt-active'); });
    btn.classList.add('vt-active');
    activeView = v;
    document.getElementById('obs-carousel-view').classList.toggle('obs-view--off', v !== 'carousel');
    document.getElementById('obs-grid-view').classList.toggle('obs-view--off', v !== 'grid');
    document.getElementById('obs-list-view').classList.toggle('obs-view--off',     v !== 'list');
    if (v === 'list' && !document.getElementById('obs-list-wrap').children.length) buildList();
  });
});

/* ────────────────────────────────────────────────────
   IMAGE SHEET
   ──────────────────────────────────────────────────── */
function openSheet(item) {
  document.getElementById('sheet-meta').innerHTML =
    '<p class="sheet-cat">'   + item.cat   + '</p>' +
    '<p class="sheet-title">' + item.title + '</p>' +
    '<p class="sheet-loc">'   + item.loc   + '</p>' +
    '<p class="sheet-desc">'  + item.desc  + '</p>';
  var el = document.getElementById('img-sheet');
  el.classList.add('open'); el.setAttribute('aria-hidden','false');
}
function closeSheet() {
  var el = document.getElementById('img-sheet');
  el.classList.remove('open'); el.setAttribute('aria-hidden','true');
}
document.getElementById('close-sheet').addEventListener('click', closeSheet);

/* ────────────────────────────────────────────────────
   BUILDER — case study video (shared hero + inline sections)
   ──────────────────────────────────────────────────── */
function youtubeVideoIdFromUrl(src) {
  if (!src) return null;
  var s = String(src).trim();
  var m = s.match(/(?:youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/i);
  if (m) return m[1];
  m = s.match(/[?&]v=([A-Za-z0-9_-]{6,})/i);
  if (m) return m[1];
  if (/^https?:\/\//i.test(s)) {
    try {
      var u = new URL(s);
      var h = u.hostname.replace(/^www\./, '');
      if (h === 'youtu.be') {
        var id = u.pathname.replace(/^\//, '').split('/')[0];
        return id && /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : null;
      }
      if (h === 'youtube.com' || h === 'm.youtube.com') {
        if (u.pathname.indexOf('/embed/') === 0) {
          return u.pathname.slice(7).split('/')[0] || null;
        }
        var v = u.searchParams.get('v');
        return v && /^[A-Za-z0-9_-]{6,}$/.test(v) ? v : null;
      }
    } catch (_e) {}
  }
  return null;
}

function caseStudyVideoHtml(src) {
  var s = String(src || '');

  // ── Vimeo ──────────────────────────────────────────
  if (/vimeo\.com/i.test(s)) {
    return (
      '<div class="cs-vid-container cs-vid-container--vimeo">' +
        '<div class="cs-yt-aspect" style="position:relative;padding-bottom:75%;height:0;overflow:hidden;">' +
          '<iframe class="cs-vimeo-embed" src="' + s.replace(/"/g, '&quot;') + '" frameborder="0"' +
          ' allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"' +
          ' referrerpolicy="strict-origin-when-cross-origin"' +
          ' style="position:absolute;top:0;left:0;width:100%;height:100%;"' +
          ' title="AI Governance Dashboard"></iframe>' +
          '<div class="cs-vimeo-mask"></div>' +
        '</div>' +
        '<div class="vid-bar">' +
          '<button type="button" class="vid-playpause">[ PLAY ]</button>' +
          '<div class="vid-progress-wrap">' +
            '<input type="range" class="vid-seek" min="0" max="1000" value="0" aria-label="Playback position" />' +
          '</div>' +
          '<span class="vid-time">0:00 / 0:00</span>' +
          '<div class="vid-speeds">' +
            '<button type="button" class="vid-spd" data-spd="0.5">×0.5</button>' +
            '<button type="button" class="vid-spd vid-spd--active" data-spd="1">×1</button>' +
            '<button type="button" class="vid-spd" data-spd="1.5">×1.5</button>' +
            '<button type="button" class="vid-spd" data-spd="2">×2</button>' +
          '</div>' +
          '<button type="button" class="vid-fullscreen" aria-label="Full screen video">[ FULL ]</button>' +
          '<div class="vid-vol-group">' +
            '<button type="button" class="vid-mute">[ SOUND ]</button>' +
            '<input type="range" class="vid-vol-slider" min="0" max="1" step="0.05" value="1" aria-label="Volume" />' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // ── YouTube ────────────────────────────────────────
  var ytId = youtubeVideoIdFromUrl(src);
  var isYoutubeish = /youtu\.be|youtube\.com/i.test(s);
  if (ytId || isYoutubeish) {
    if (!ytId) {
      return (
        '<div class="cs-vid-container cs-vid-container--youtube cs-vid-container--youtube-fallback">' +
          '<p class="cs-yt-fallback">Video link could not be embedded.</p>' +
          '<p><a href="' +
          s.replace(/"/g, '&quot;') +
          '" class="text-link" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>' +
        '</div>'
      );
    }
    var watchUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(ytId);
    var embedSrc =
      'https://www.youtube.com/embed/' +
      encodeURIComponent(ytId) +
      '?controls=1&modestbranding=1&rel=0&showinfo=0';
    return (
      '<div class="cs-vid-container cs-vid-container--youtube">' +
        '<div class="cs-yt-aspect" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">' +
          '<iframe src="' +
          embedSrc +
          '" width="100%" height="100%" frameborder="0" allowfullscreen' +
          ' style="position:absolute;top:0;left:0;width:100%;height:100%;"' +
          ' title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>' +
        '</div>' +
        '<p class="cs-yt-watch"><a href="' +
        watchUrl +
        '" class="text-link" target="_blank" rel="noopener noreferrer">Open on YouTube</a></p>' +
      '</div>'
    );
  }
  return (
    '<div class="cs-vid-container">' +
      '<video class="cs-vid" src="' +
      src +
      '" preload="metadata" playsinline loop></video>' +
      '<div class="vid-bar">' +
        '<button type="button" class="vid-playpause">[ PLAY ]</button>' +
        '<div class="vid-progress-wrap">' +
          '<input type="range" class="vid-seek" min="0" max="1000" value="0" aria-label="Playback position" />' +
        '</div>' +
        '<span class="vid-time"></span>' +
        '<div class="vid-speeds">' +
          '<button type="button" class="vid-spd" data-spd="0.5">×0.5</button>' +
          '<button type="button" class="vid-spd vid-spd--active" data-spd="1">×1</button>' +
          '<button type="button" class="vid-spd" data-spd="1.5">×1.5</button>' +
          '<button type="button" class="vid-spd" data-spd="2">×2</button>' +
        '</div>' +
        '<button type="button" class="vid-fullscreen" aria-label="Full screen video">[ FULL ]</button>' +
        '<div class="vid-vol-group">' +
          '<button type="button" class="vid-mute">[ MUTE ]</button>' +
          '<input type="range" class="vid-vol-slider" min="0" max="1" step="0.05" value="0" aria-label="Volume" />' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function governanceCaseStudyHtml(proj) {
  var vid = caseStudyVideoHtml(proj.heroVideo);
  var mail =
    'mailto:ran@ran-song.com?subject=' + encodeURIComponent('AI governance dashboard trial');
  return (
    '<article class="gov-case">' +
      '<header class="cs-header">' +
        '<p class="cs-header-num">Independent Research &amp; Build · 2026</p>' +
        '<h1 class="cs-header-title">AI Governance Dashboard</h1>' +
        '<p class="cs-header-solo">Solo build</p>' +
        '<p class="cs-header-desc">EU AI Act Articles 10, 11, 13, 14, 15</p>' +
        '<p class="cs-header-tech">React · Tailwind CSS · Flask · Python (SciPy / Pandas)</p>' +
      '</header>' +
      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +

      '<h2 class="gov-h2"><span class="gov-h2-num">1.</span> Context &amp; Challenge</h2>' +
      '<p class="gov-p">High-risk algorithmic pricing models operate as proprietary black boxes. Under the EU AI Act, enterprises are now required to audit these systems for demographic and device-based discrimination — without access to the underlying training infrastructure.</p>' +
      '<p class="gov-p">This project addresses the tooling gap: a forensic audit interface built to make automated pricing decisions observable, accountable, and regulator-ready.</p>' +

      '<div class="gov-vid-slot">' +
        vid +
      '</div>' +

      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +

      '<h2 class="gov-h2"><span class="gov-h2-num">2.</span> Approach &amp; System Architecture</h2>' +
      '<p class="gov-p">Rather than simulating governance in isolation, the dashboard treats a live production pricing model as an API endpoint — ingesting real-time transaction streams and mapping four EU AI Act requirements into functional engineering behaviour.</p>' +

      '<figure class="gov-figure gov-figure--sm">' +
        '<button type="button" class="gov-fig-hit" data-gov-zoom="compliance_architecture.svg" aria-label="Open diagram: compliance architecture">' +
          '<img src="compliance_architecture.svg" alt="Compliance architecture diagram" loading="lazy"/>' +
        '</button>' +
        '<figcaption class="gov-fig-caption">Compliance Architecture &amp; Regulatory Mapping</figcaption>' +
      '</figure>' +

      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +

      '<h2 class="gov-h2"><span class="gov-h2-num">3.</span> Core System Pillars</h2>' +

      '<h3 class="gov-h3">Bias Detection · Articles 10 &amp; 13</h3>' +
      '<p class="gov-p">An intersectional disparity matrix monitors transaction logs across device profiles (iOS vs Android) and geographic cohorts, surfacing selection rate disparities at scale. A dynamic threshold interface allows compliance teams to adjust the sensitivity ceiling and evaluate how policy constraints affect pass/fail classification in real-time. Tested on batch streams of up to 2,000 records.</p>' +

      '<h3 class="gov-h3">Human Oversight · Article 14</h3>' +
      '<p class="gov-p">When raw bias ratios exceed defined limits, the system enters a mandatory restricted workflow: sensitive logs are sealed, model execution is suspended, and the reviewing auditor must submit a 20-character structural justification alongside a full electronic signature before operations resume. Accountability is enforced at the system level, not left to process.</p>' +

      '<h3 class="gov-h3">Audit Trail Integrity · Article 11</h3>' +
      '<p class="gov-p">On-demand PDF generation produces regulator-ready technical documentation. Each report is SHA-256 fingerprinted against the exact data state and human sign-off log at the moment of generation, providing immutable evidence of the decision context and preventing post-incident modification.</p>' +

      '<h3 class="gov-h3">Automated Containment · Article 15</h3>' +
      '<p class="gov-p">A simulated adversarial injection pushes bias to a critical threshold of 1.95x. The Flask backend responds with an automatic API lockdown; an Emergency Brake routine then isolates the compromised inference model entirely and degrades gracefully to a static, non-algorithmic fallback — execution to resolution in milliseconds.</p>' +

      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +

      '<h2 class="gov-h2"><span class="gov-h2-num">4.</span> Compliance User Flow</h2>' +
      '<p class="gov-p">This user flow maps how an auditor interacts with an algorithmic anomaly at runtime, shifting the system seamlessly from automated passive monitoring to active human remediation:</p>' +

      '<figure class="gov-figure gov-figure--sm gov-figure--flow">' +
        '<button type="button" class="gov-fig-hit" data-gov-zoom="user_flow.svg" aria-label="Open diagram: auditor crisis response loop">' +
          '<img src="user_flow.svg" alt="Auditor crisis response user flow" loading="lazy"/>' +
        '</button>' +
        '<figcaption class="gov-fig-caption">The Auditor\'s Crisis Response Loop</figcaption>' +
      '</figure>' +

      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +

      '<h2 class="gov-h2"><span class="gov-h2-num">5.</span> Product Lifecycle Roadmap</h2>' +
      '<p class="gov-p">The strategic product roadmap outlines the lifecycle evolution of the dashboard, deliberately aligned with the staggered legislative enforcement timelines of the EU AI Act:</p>' +

      '<figure class="gov-figure gov-figure--sm">' +
        '<button type="button" class="gov-fig-hit" data-gov-zoom="roadmap.svg" aria-label="Open diagram: roadmap timeline">' +
          '<img src="roadmap.svg" alt="Product roadmap timeline" loading="lazy"/>' +
        '</button>' +
        '<figcaption class="gov-fig-caption">Agile Release Roadmap vs EU AI Act Deadlines</figcaption>' +
      '</figure>' +

      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +

      '<h2 class="gov-h2"><span class="gov-h2-num">6.</span> Outcome &amp; Key Takeaway</h2>' +
      '<p class="gov-p">A working prototype that translates the abstract compliance language of the EU AI Act into deterministic system behaviour — demonstrating that AI governance is an engineering problem as much as a policy one.</p>' +
      '<p class="gov-p">Role: Solo build — product, design, engineering</p>' +

      '<footer class="gov-footer">' +
        '<h2 class="gov-h2 gov-h2--footer"><span class="gov-h2-num">7.</span> Want to run a live audit session?</h2>' +
        '<p class="gov-p gov-p--footer"><a class="gov-mail" href="' + mail + '">Get in touch &#8594;</a></p>' +
      '</footer>' +
    '</article>'
  );
}

function playceVideoPlaceholderHtml() {
  return (
    '<div class="gov-vid-slot">' +
      '<div class="gov-vid-placeholder" role="note">' +
        '<span class="gov-vid-placeholder-label">[ Video Demo ]</span>' +
        '<span class="gov-vid-placeholder-sub">Coming soon</span>' +
      '</div>' +
    '</div>'
  );
}

function playceHowWorksStepHtml(n, title, desc, imgAlt) {
  var nn = n < 10 ? '0' + n : String(n);
  return (
    '<div class="playce-how__step">' +
      '<span class="playce-how__step-num">' +
      nn +
      '</span>' +
      '<div class="playce-how__step-copy">' +
      '<h3 class="playce-how__step-title">' +
      title +
      '</h3>' +
      '<p class="playce-how__step-desc">' +
      desc +
      '</p>' +
      '</div>' +
      '<figure class="playce-how__step-fig">' +
      '<div class="playce-how__shot">' +
      '<span class="playce-how__shot-ph" aria-hidden="true">Screenshot</span>' +
      '<img class="step-img playce-how__step-img" src="" alt="' +
      (imgAlt || '') +
      '" loading="lazy" style="width:100%;display:block">' +
      '</div>' +
      '</figure>' +
      '</div>'
  );
}

function playceCaseStudyHtml(proj) {
  var mail = 'mailto:ran@ran-song.com?subject=' + encodeURIComponent('PLAYCE demo');
  var vid = playceVideoPlaceholderHtml();
  return (
    '<article class="gov-case">' +
      '<header class="cs-header">' +
        '<p class="cs-header-num">' +
        proj.type +
        ' · ' +
        proj.year +
        '</p>' +
        '<h1 class="cs-header-title">PLAYCE — Sports Travel Decision</h1>' +
        '<p class="cs-header-solo">Solo build</p>' +
      '</header>' +
      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +
      '<h2 class="gov-h2"><span class="gov-h2-num">1.</span> The problem</h2>' +
      '<p class="gov-p">The idea came from a recurring frustration. As someone who travels around sport — to ski, to run, to watch races — the planning process is consistently broken. Finding a marathon in a city you want to visit, checking if the season is right for a specific trail, understanding whether a destination has the infrastructure for what you actually want to do: none of this lives in one place. You cross-reference sport community forums, check race calendars on separate sites, then switch to a booking platform for hotels and transport. When you ask a general AI assistant, it confidently returns wrong dates, cancelled events, and venues that no longer exist.</p>' +
      '<p class="gov-p">The problem isn&rsquo;t a lack of information. It&rsquo;s that no tool understands sport as the primary variable in a travel decision — the thing everything else is planned around.</p>' +
      '<p class="gov-p">PLAYCE is built to close that gap. A planning tool for travellers who move: surfers, climbers, skiers, runners, hikers, yoga practitioners — anyone who goes somewhere to do something, not just to see it. The solo travel layer addresses a secondary but structurally important question: not whether a destination is safe in a generic sense, but whether it&rsquo;s open — whether you&rsquo;ll find partners, infrastructure, and a local scene that works for an individual arriving alone.</p>' +
      '<p class="gov-p">The core design decision: one recommendation, fully reasoned. Not a list. A committed answer.</p>' +
      vid +
      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +
      '<h2 class="gov-h2"><span class="gov-h2-num">2.</span> Traveller journey</h2>' +
      '<section class="playce-how" aria-label="Traveller journey steps">' +
      '<div class="playce-how__steps">' +
      playceHowWorksStepHtml(
        1,
        'Describe your move',
        'Type your intent in natural language &mdash; a sport, a vibe, a level of difficulty. No categories. No filters. Just what you want to do.',
        ''
      ) +
      playceHowWorksStepHtml(
        2,
        'We match your level',
        'PLAYCE returns three destinations calibrated to Novice, Intermediate, and Pro. Select your tier &mdash; everything else follows.',
        ''
      ) +
      playceHowWorksStepHtml(
        3,
        'Check the Vibe Index',
        'Every destination is scored across six dimensions: Women-friendly rating, Solo index, Night safety, Harassment risk, Community density, Infrastructure. One number that tells you if this place works for you.',
        ''
      ) +
      playceHowWorksStepHtml(
        4,
        'Get your full brief',
        'A flat, day-by-day itinerary with gear checklist, local transport, dining areas, and booking links. Export as PDF.',
        ''
      ) +
      playceHowWorksStepHtml(
        5,
        'Refine with AI',
        'Paste links, adjust constraints, add dates. The AI Strategic Advisor operates on your existing plan &mdash; not a blank slate.',
        ''
      ) +
      '</div>' +
      '</section>' +
      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +
      '<h2 class="gov-h2"><span class="gov-h2-num">3.</span> Product decisions</h2>' +
      '<h3 class="gov-h3">Intent capture over category browsing</h3>' +
      '<p class="gov-p">Users describe what they want in natural language — &ldquo;relaxing oceanfront yoga retreat,&rdquo; &ldquo;advanced alpine climbing,&rdquo; &ldquo;trail running at altitude.&rdquo; The system interprets intent, infers difficulty, and maps it to geography. This eliminates the category-browsing pattern that works for leisure travel but fails for sport-specific queries where terrain, season, and skill level are interdependent.</p>' +
      '<h3 class="gov-h3">Adaptive difficulty segmentation</h3>' +
      '<p class="gov-p">When a user doesn&rsquo;t specify their level, PLAYCE distributes across three tiers — Novice, Intermediate, and Pro — rather than defaulting to a generic match. A Portugal surf query returns Peniche, Lagos, and Nazaré as distinct options with distinct technical profiles. The user selects their tier; subsequent steps inherit that parameter silently, removing a third of legacy form inputs.</p>' +
      '<h3 class="gov-h3">Vibe Index</h3>' +
      '<p class="gov-p">The most structurally complex product decision. Solo travel compatibility data is scattered across Reddit threads, TripAdvisor reviews, and community forums — qualitative, inconsistent, and hard to aggregate. The Vibe Index distils this into a scored profile per destination across six dimensions: Women-friendly rating, Solo index, Night safety, Harassment risk, Community density, and Infrastructure quality. The challenge was deciding what to measure, how to weight conflicting signals, and how to present a confidence level without undermining the recommendation. Women-friendly is included not as a niche filter but as a quality signal relevant to any solo traveller evaluating openness and safety. Scores are indicative — the disclaimer is built into the interface.</p>' +
      '<h3 class="gov-h3">Flattened itinerary</h3>' +
      '<p class="gov-p">The original UI used nested accordions. With ten days of content, users had to click through ten separate panels to read a complete itinerary — engagement dropped sharply after day four. Replacing every nested component with a flat, continuous waterfall timeline meant users could scan an entire trip&rsquo;s physical rhythm — morning sessions, afternoon recovery, rest days — in under two seconds. Post-change feedback consistently described the AI&rsquo;s output as more capable, even though the underlying content was identical. Presentation was the variable.</p>' +
      '<h3 class="gov-h3">Geographic supply guardrails</h3>' +
      '<p class="gov-p">Logistics localisation was enforced at the prompt layer. A user selecting Tulum receives Uber, Didi, and ADO bus recommendations — not a generic shuttle placeholder, and not the Indonesian transport options that a hallucinating model might default to. This was a deliberate product constraint: the system commits to local operational reality rather than generating plausible-sounding logistics.</p>' +
      '<h3 class="gov-h3">Mission briefing layer</h3>' +
      '<p class="gov-p">After confirming a destination, users receive an operational brief: gear checklist (pack vs. rent), context-aware transport, dining areas, booking links, and a PDF export. This moves PLAYCE from discovery to execution.</p>' +
      '<h3 class="gov-h3">AI Strategic Advisor</h3>' +
      '<p class="gov-p">A persistent chat layer allows users to refine after generation — pasting links, adjusting constraints, adding dates. Designed as an intelligence layer operating on existing plan context rather than a general-purpose chatbot restarting from scratch.</p>' +
      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +
      '<h2 class="gov-h2"><span class="gov-h2-num">4.</span> Technical challenges</h2>' +
      '<h3 class="gov-h3">Model selection and cost architecture</h3>' +
      '<p class="gov-p">Grok was chosen as the primary inference engine for two reasons: cost and real-time data advantage. At the MVP stage, running on Grok&rsquo;s free tier allowed full product validation without API spend — a deliberate decision to test market fit before committing to infrastructure costs. The real-time data capability also addresses a structural limitation of static training cutoffs: sports events, seasonal conditions, and community activity are time-sensitive inputs that a fixed knowledge base cannot handle reliably — precisely the failure mode that motivated the product in the first place. As PLAYCE scales toward market deployment, the model layer is explicitly designed to be swappable. Benchmarking against higher-accuracy alternatives is part of the Phase 2 roadmap, with selection criteria weighted toward output consistency on long-tail sport queries rather than general capability.</p>' +
      '<h3 class="gov-h3">Prompt architecture as backend architecture</h3>' +
      '<p class="gov-p">The core engineering insight was treating prompt design as backend scoping. The original system prompt ran to approximately 1,800 tokens — loaded with UI formatting instructions, HTML structure simulation, and accordion rendering logic. Stripping all presentation concerns back to Tailwind components and refocusing the prompt on raw structured data synthesis compressed it to around 1,000 tokens, a 45% reduction. This kept generation consistently below Grok&rsquo;s free-tier 6,000 TPM threshold and brought average itinerary render time to 5–8 seconds.</p>' +
      '<h3 class="gov-h3">Rate-limit resilience</h3>' +
      '<p class="gov-p">Generating comprehensive itineraries on long-tail queries regularly hit token limits, freezing the UI mid-render. The solution was a three-layer fallback: compressed system prompt, automated model fallback loop, and a three-retry recovery mechanism with user-visible state. Hard crash rate dropped from approximately 30% on extended itineraries to under 3%. The app degrades gracefully rather than failing silently.</p>' +
      '<h3 class="gov-h3">Runtime data validation</h3>' +
      '<p class="gov-p">LLM outputs drop JSON keys unpredictably on complex queries. A Zod v3.24.1 validation schema enforced strict binding on structural keys — riskIndex, soloIndex, difficulty tier — while treating secondary narrative fields as optional. This built a resilient firewall that catches data anomalies before they reach the UI layer, preventing client-side hydration failures and white-screen crashes.</p>' +
      '<h3 class="gov-h3">Dependency isolation and styling architecture</h3>' +
      '<p class="gov-p">During intensive iteration, conflicting workspace lockfiles triggered an 82GB memory allocation loop, breaking the compilation pipeline with deep CSS resolution errors. A full environment reset with pnpm&rsquo;s strict dependency isolation eliminated package manager collisions permanently. The styling architecture was simultaneously realigned to Tailwind CSS v4&rsquo;s CSS-first specification, separating micro-interaction animation concerns from core layout:</p>' +
      '<pre class="gov-pre">' +
      '@import "tailwindcss";\n@plugin "tailwindcss-animate";' +
      '</pre>' +
      '<h3 class="gov-h3">Zero-cost image pipeline</h3>' +
      '<p class="gov-p">Without budget for paid image APIs, standard dynamic URLs pulled irrelevant or duplicated assets across destination cards. A deterministic index parameter appended to each Unsplash request — combined with LLM-generated environmental modifiers in the search term — produced unique, contextually relevant photography at zero asset-hosting cost:</p>' +
      '<pre class="gov-pre">' +
      'src={`https://images.unsplash.com/featured/800x1200?\n${encodeURIComponent(location.imageSearchTerm)}&amp;sig=${index}`}' +
      '</pre>' +
      '<h3 class="gov-h3">Test coverage</h3>' +
      '<p class="gov-p">Across the full iteration cycle, approximately 200–250 structured itineraries were generated, including 40–50 complete end-to-end flows and 30+ dedicated edge-case tests on long-form outputs. The system was validated across five sport categories — surfing, skiing, climbing, hiking, yoga — and fifteen destinations including Peniche, Niseko, Chamonix, Tulum, and Bali.</p>' +
      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +
      '<h2 class="gov-h2"><span class="gov-h2-num">5.</span> Regulatory-driven product strategy</h2>' +
      '<figure class="gov-figure gov-figure--sm">' +
        '<button type="button" class="gov-fig-hit" data-gov-zoom="playce_roadmap.svg" aria-label="Open diagram: PLAYCE roadmap">' +
        '<img src="playce_roadmap.svg" alt="PLAYCE product roadmap timeline" loading="lazy"/>' +
        '</button>' +
        '<figcaption class="gov-fig-caption">PLAYCE roadmap</figcaption>' +
      '</figure>' +
      '<div class="gov-rule" role="separator" aria-hidden="true"></div>' +
      '<h2 class="gov-h2"><span class="gov-h2-num">6.</span> Outcome</h2>' +
      '<p class="gov-p">A full-stack AI travel product built solo from brief to deployment. PLAYCE demonstrates end-to-end product ownership — problem framing, information architecture, prompt engineering, resilience design, and visual execution — across a use case with real structural complexity: personalised, context-aware recommendations where sport, season, skill level, and solo compatibility are all interdependent variables. The model layer is designed to scale — what ships on Grok today is an architecture built to run on whatever inference engine best serves the product tomorrow.</p>' +
      '<p class="gov-p">Role: Solo build — product, design, engineering</p>' +
      '<footer class="gov-footer">' +
      '<h2 class="gov-h2 gov-h2--footer"><span class="gov-h2-num">7.</span> Want to see it live?</h2>' +
      '<p class="gov-p gov-p--footer"><a class="gov-mail" href="' +
      mail +
      '">Get in touch &#8594;</a></p>' +
      '</footer>' +
    '</article>'
  );
}

(function govFigureZoomModule() {
  var overlayEl;
  var lastFocus;

  function closeGovFigureZoom() {
    if (!overlayEl || !overlayEl.classList.contains('open')) return;
    overlayEl.classList.remove('open');
    overlayEl.setAttribute('aria-hidden', 'true');
    var lg = overlayEl.querySelector('.gov-figure-zoom__img');
    if (lg) {
      lg.removeAttribute('src');
      lg.alt = '';
    }
    document.removeEventListener('keydown', onEsc);
    document.documentElement.classList.remove('gov-figure-zoom-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try {
        lastFocus.focus();
      } catch (err) {}
    }
    lastFocus = null;
  }

  function onEsc(ev) {
    if (ev.key === 'Escape') closeGovFigureZoom();
  }

  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    var root = document.createElement('div');
    root.id = 'gov-figure-zoom';
    root.className = 'gov-figure-zoom';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Figure');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="gov-figure-zoom__backdrop" data-gov-zoom-dismiss="1"></div>' +
      '<button type="button" class="gov-figure-zoom__close">CLOSE</button>' +
      '<div class="gov-figure-zoom__frame">' +
        '<img class="gov-figure-zoom__img" alt="" draggable="false" decoding="async"/>' +
      '</div>';
    document.body.appendChild(root);
    root.addEventListener(
      'click',
      function(ev) {
        if (ev.target && ev.target.getAttribute && ev.target.getAttribute('data-gov-zoom-dismiss')) {
          closeGovFigureZoom();
        }
      },
      false
    );
    root.querySelector('.gov-figure-zoom__close').addEventListener('click', closeGovFigureZoom);
    root.querySelector('.gov-figure-zoom__img').addEventListener('click', function(ev) {
      ev.stopPropagation();
      closeGovFigureZoom();
    });
    overlayEl = root;
    return root;
  }

  function openGovFigureZoom(src, altText, focusReturnEl) {
    var root = ensureOverlay();
    var img = root.querySelector('.gov-figure-zoom__img');
    lastFocus = focusReturnEl || document.activeElement;
    var resolved = src;
    try {
      resolved = new URL(src, window.location.href).href;
    } catch (e0) {}
    /* <object> often caches the previous SVG when only mutating data=; <img> + bust forces correct file */
    var busted = resolved;
    if (typeof window.location !== 'undefined' && window.location.protocol !== 'file:') {
      var sep = resolved.indexOf('?') >= 0 ? '&' : '?';
      busted = resolved + sep + 'govFig=' + encodeURIComponent(src) + '&t=' + String(Date.now());
    }
    img.alt = altText || '';
    img.removeAttribute('src');
    img.src = busted;
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('gov-figure-zoom-open');
    document.addEventListener('keydown', onEsc);
    setTimeout(function() {
      try {
        root.querySelector('.gov-figure-zoom__close').focus();
      } catch (e1) {}
    }, 10);
  }

  window.closeGovFigureZoom = closeGovFigureZoom;
  window.openGovFigureZoom = openGovFigureZoom;
})();

function initGovernanceFigureZoom(container) {
  container.querySelectorAll('.gov-fig-hit[data-gov-zoom]').forEach(function(btn) {
    btn.addEventListener('click', function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var src = btn.getAttribute('data-gov-zoom');
      if (!src) return;
      var im = btn.querySelector('img');
      var alt = im ? im.alt : '';
      window.openGovFigureZoom(src, alt, btn);
    });
  });
}

function fmtVidTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

/* ────────────────────────────────────────────────────
   BUILDER
   ──────────────────────────────────────────────────── */
function builderCategoryLabel(cat) {
  if (cat === 'build') return 'Build';
  if (cat === 'design') return 'Design';
  if (cat === 'strategy') return 'Strategy';
  if (cat === 'field') return 'Field';
  return cat;
}

function builderCardArtHtml(key) {
  return BUILDER_CARD_ART[key] || '';
}

function builderCardHtml(p, i) {
  var art = p.cardArt ? builderCardArtHtml(p.cardArt) : '';
  var tags = (p.tags || [])
    .map(function (t) {
      return '<span class="builder-card-tag">' + t + '</span>';
    })
    .join('');
  return (
    '<article class="builder-card" data-proj="' +
    i +
    '" tabindex="0" role="button" aria-label="Open case study: ' +
    p.title +
    '">' +
    '<div class="builder-card-preview">' +
    art +
    '</div>' +
    '<p class="builder-card-badge">' +
    builderCategoryLabel(p.category) +
    ' · ' +
    p.year +
    '</p>' +
    '<h3 class="builder-card-title">' +
    p.title +
    '</h3>' +
    '<p class="builder-card-desc">' +
    (p.cardDesc || p.desc) +
    '</p>' +
    '<div class="builder-card-tags">' +
    tags +
    '</div>' +
    '<p class="builder-card-cta">Case study &rarr;</p>' +
    '</article>'
  );
}

function builderWorkRowHtml(p, i) {
  return (
    '<button type="button" class="builder-work-row" data-proj="' +
    i +
    '">' +
    '<span class="builder-work-num">' +
    p.num +
    '</span>' +
    '<span class="builder-work-title">' +
    p.title +
    '</span>' +
    '<span class="builder-work-tag builder-work-tag--' +
    p.category +
    '">' +
    builderCategoryLabel(p.category) +
    '</span>' +
    '<span class="builder-work-year">' +
    p.year +
    '</span>' +
    '</button>'
  );
}

function filteredBuilderProjects() {
  if (builderFilter === 'all') return PROJECTS;
  return PROJECTS.filter(function (p) {
    return p.category === builderFilter;
  });
}

function bindBuilderOpenHandlers(root) {
  if (!root) return;
  root.querySelectorAll('[data-proj]').forEach(function (el) {
    el.addEventListener('click', function () {
      openBuilderProject(parseInt(el.getAttribute('data-proj'), 10));
    });
    el.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openBuilderProject(parseInt(el.getAttribute('data-proj'), 10));
      }
    });
  });
}

function renderBuilderIndex() {
  var root = document.getElementById('builder-index');
  if (!root) return;

  var featured = PROJECTS.filter(function (p) {
    return p.featured;
  });
  var featuredHtml = featured
    .map(function (p) {
      return builderCardHtml(p, PROJECTS.indexOf(p));
    })
    .join('');

  var filtersHtml = BUILDER_FILTERS.map(function (f) {
    return (
      '<button type="button" class="builder-filter' +
      (builderFilter === f.id ? ' builder-filter--active' : '') +
      '" data-filter="' +
      f.id +
      '">' +
      f.label +
      '</button>'
    );
  }).join('');

  var listHtml = filteredBuilderProjects()
    .map(function (p) {
      return builderWorkRowHtml(p, PROJECTS.indexOf(p));
    })
    .join('');

  root.innerHTML =
    '<div class="builder-page-inner">' +
    '<section class="builder-section builder-section--first" aria-labelledby="builder-recent-label">' +
    '<h2 class="builder-section-label" id="builder-recent-label">Recent</h2>' +
    '<div class="builder-recent">' +
    featuredHtml +
    '</div>' +
    '</section>' +
    '<section class="builder-section" aria-labelledby="builder-all-label">' +
    '<h2 class="builder-section-label" id="builder-all-label">All work</h2>' +
    '<div class="builder-filters" role="tablist" aria-label="Filter work by type">' +
    filtersHtml +
    '</div>' +
    '<div class="builder-work-list">' +
    listHtml +
    '</div>' +
    '</section>' +
    '</div>';

  root.querySelectorAll('.builder-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      builderFilter = btn.getAttribute('data-filter');
      renderBuilderIndex();
    });
  });

  bindBuilderOpenHandlers(root);
}

function renderBuilderDetailContent(proj) {
  var body = document.getElementById('builder-detail-body');
  if (!body) return;
  if (typeof window.closeGovFigureZoom === 'function') window.closeGovFigureZoom();
  if (proj.governanceCaseStudy) {
    body.innerHTML = governanceCaseStudyHtml(proj);
    initVideoControls(body);
    initGovernanceFigureZoom(body);
    return;
  }
  if (proj.playceCaseStudy) {
    body.innerHTML = playceCaseStudyHtml(proj);
    initVideoControls(body);
    initGovernanceFigureZoom(body);
    return;
  }
  var html =
    '<div class="cs-header">' +
    '<p class="cs-header-num">' +
    proj.num +
    ' — ' +
    proj.type +
    ' · ' +
    proj.year +
    '</p>' +
    '<h1 class="cs-header-title">' +
    proj.title +
    '</h1>' +
    '<p class="cs-header-desc">' +
    proj.desc +
    '</p>' +
    (proj.tech ? '<p class="cs-header-tech">' + proj.tech + '</p>' : '') +
    '</div>';
  if (proj.heroVideo) {
    html += '<div class="cs-hero cs-hero--video">' + caseStudyVideoHtml(proj.heroVideo) + '</div>';
  } else if (proj.hero) {
    html += '<div class="cs-hero"><img src="' + proj.hero + '" alt="" loading="lazy"/></div>';
  }
  html += '<div class="cs-body">';
  (proj.sections || []).forEach(function (s) {
    if (s.type === 'text') {
      html += '<p class="cs-text">' + s.content + '</p>';
    } else if (s.type === 'h3') {
      html += '<h3 class="cs-case-h">' + s.content + '</h3>';
    } else if (s.type === 'image') {
      html +=
        '<div class="cs-section"><div class="cs-img-wrap"><img src="' +
        s.src +
        '" alt="" loading="lazy"/></div><p class="cs-caption">' +
        s.caption +
        '</p></div>';
    } else if (s.type === 'video') {
      html +=
        '<div class="cs-section cs-video-section">' +
        caseStudyVideoHtml(s.src) +
        (s.caption ? '<p class="cs-caption">' + s.caption + '</p>' : '') +
        '</div>';
    } else if (s.type === 'imgrow') {
      html +=
        '<div class="cs-section"><div class="cs-img-row">' +
        s.srcs
          .map(function (src, ii) {
            return (
              '<div><div class="cs-img-wrap"><img src="' +
              src +
              '" alt="" loading="lazy"/></div><p class="cs-caption">' +
              s.captions[ii] +
              '</p></div>'
            );
          })
          .join('') +
        '</div></div>';
    }
  });
  html += '</div>';
  body.innerHTML = html;
  initVideoControls(body);
}

function openBuilderProject(i) {
  if (i < 0 || i >= PROJECTS.length) return;
  activeProj = i;
  builderOnDetail = true;
  var indexEl = document.getElementById('builder-index');
  var detailEl = document.getElementById('builder-detail');
  if (indexEl) indexEl.classList.add('builder-view--off');
  if (detailEl) {
    detailEl.classList.remove('builder-view--off');
    detailEl.scrollTop = 0;
  }
  renderBuilderDetailContent(PROJECTS[i]);
  var panel = document.getElementById('panel-builder');
  if (panel) panel.scrollTop = 0;
}

function closeBuilderDetail() {
  builderOnDetail = false;
  if (typeof window.closeGovFigureZoom === 'function') window.closeGovFigureZoom();
  var indexEl = document.getElementById('builder-index');
  var detailEl = document.getElementById('builder-detail');
  if (indexEl) indexEl.classList.remove('builder-view--off');
  if (detailEl) detailEl.classList.add('builder-view--off');
}

function initBuilderNav() {
  var back = document.getElementById('builder-back');
  if (back && !back.dataset.bound) {
    back.dataset.bound = '1';
    back.addEventListener('click', closeBuilderDetail);
  }
}

function initGovVideoFullscreen(wrap) {
  var fsBtn = wrap.querySelector('.vid-fullscreen');
  if (!fsBtn) return;

  function docFsEl() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      null
    );
  }

  function updateFsBtn() {
    var fe = docFsEl();
    var inFs = fe && (fe === wrap || wrap.contains(fe));
    fsBtn.textContent = inFs ? '[ EXIT FULL ]' : '[ FULL ]';
    fsBtn.setAttribute('aria-label', inFs ? 'Exit full screen' : 'Full screen video');
  }

  function reqFs(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    return Promise.reject();
  }

  function exitFs() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    return Promise.resolve();
  }

  fsBtn.addEventListener('click', function() {
    var fe = docFsEl();
    var inFs = fe && (fe === wrap || wrap.contains(fe));
    if (!inFs) {
      reqFs(wrap).catch(function() {});
    } else {
      exitFs().catch(function() {});
    }
  });

  ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach(function(evName) {
    document.addEventListener(evName, updateFsBtn);
  });
  updateFsBtn();
}

function initVideoControls(container) {
  container.querySelectorAll('.cs-vid-container').forEach(function(wrap) {
    var video     = wrap.querySelector('.cs-vid');
    var playBtn   = wrap.querySelector('.vid-playpause');
    var muteBtn   = wrap.querySelector('.vid-mute');
    var spdBtns   = wrap.querySelectorAll('.vid-spd');
    var volSlider = wrap.querySelector('.vid-vol-slider');
    var seek      = wrap.querySelector('.vid-seek');
    var timeEl    = wrap.querySelector('.vid-time');
    if (!video) return;

    video.muted = true;
    video.volume = parseFloat(volSlider.value) || 0;

    var scrubbing = false;

    function duration() {
      return video.duration && isFinite(video.duration) ? video.duration : 0;
    }

    function updateTimeDisp() {
      if (!timeEl) return;
      var d = duration();
      timeEl.textContent = fmtVidTime(video.currentTime) + ' / ' + fmtVidTime(d);
    }

    function syncSeekFromVideo() {
      if (!seek || scrubbing) return;
      var d = duration();
      if (d > 0) seek.value = String(Math.round((video.currentTime / d) * 1000));
      updateTimeDisp();
    }

    playBtn.textContent = video.paused ? '[ PLAY ]' : '[ PAUSE ]';
    updateTimeDisp();

    playBtn.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        playBtn.textContent = '[ PAUSE ]';
      } else {
        video.pause();
        playBtn.textContent = '[ PLAY ]';
      }
    });

    spdBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        video.playbackRate = parseFloat(btn.dataset.spd);
        spdBtns.forEach(function(b) {
          b.classList.remove('vid-spd--active');
        });
        btn.classList.add('vid-spd--active');
      });
    });

    muteBtn.addEventListener('click', function() {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '[ MUTE ]' : '[ SOUND ]';
      if (!video.muted) {
        video.volume = volSlider.value > 0 ? parseFloat(volSlider.value) : 0.7;
        volSlider.value = String(video.volume);
      }
    });

    volSlider.addEventListener('input', function() {
      video.volume = parseFloat(volSlider.value);
      video.muted = video.volume === 0;
      muteBtn.textContent = video.muted ? '[ MUTE ]' : '[ SOUND ]';
    });

    if (seek) {
      seek.addEventListener('pointerdown', function() {
        scrubbing = true;
      });
      ['pointerup', 'pointercancel'].forEach(function(ev) {
        seek.addEventListener(ev, function() {
          scrubbing = false;
          syncSeekFromVideo();
        });
      });
      seek.addEventListener('input', function() {
        var d = duration();
        if (d > 0) video.currentTime = (parseFloat(seek.value) / 1000) * d;
        updateTimeDisp();
      });
    }

    video.addEventListener('loadedmetadata', syncSeekFromVideo);
    video.addEventListener('timeupdate', syncSeekFromVideo);
    video.addEventListener('ended', function() {
      playBtn.textContent = '[ PLAY ]';
    });
    video.addEventListener('play', function() {
      playBtn.textContent = '[ PAUSE ]';
    });
    video.addEventListener('pause', function() {
      playBtn.textContent = '[ PLAY ]';
    });

    initGovVideoFullscreen(wrap);
  });

  // ── Vimeo embeds ─────────────────────────────────────
  container.querySelectorAll('.cs-vid-container--vimeo').forEach(function(wrap) {
    if (wrap.dataset.vimeoInit) return;
    wrap.dataset.vimeoInit = '1';

    var iframe   = wrap.querySelector('.cs-vimeo-embed');
    var playBtn  = wrap.querySelector('.vid-playpause');
    var muteBtn  = wrap.querySelector('.vid-mute');
    var spdBtns  = wrap.querySelectorAll('.vid-spd');
    var volSlider = wrap.querySelector('.vid-vol-slider');
    var seek     = wrap.querySelector('.vid-seek');
    var timeEl   = wrap.querySelector('.vid-time');
    if (!iframe || typeof window.Vimeo === 'undefined') return;

    if (typeof window.Vimeo === 'undefined' || typeof window.Vimeo.Player === 'undefined') {
      // Retry once Vimeo Player.js finishes loading
      var retryId = setInterval(function() {
        if (typeof window.Vimeo !== 'undefined' && typeof window.Vimeo.Player !== 'undefined') {
          clearInterval(retryId);
          delete wrap.dataset.vimeoInit;
          initVideoControls(wrap.closest('.gov-case') || wrap.parentElement || document);
        }
      }, 200);
      return;
    }

    var player = new window.Vimeo.Player(iframe);
    var dur = 0;
    var scrubbing = false;

    function fmtV(s) { return fmtVidTime(s); }

    function updateTimeDisp(cur) {
      if (!timeEl || !dur) return;
      timeEl.textContent = fmtV(cur) + ' / ' + fmtV(dur);
    }

    player.getDuration().then(function(d) { dur = d; updateTimeDisp(0); });

    player.on('timeupdate', function(data) {
      if (!scrubbing) {
        if (!dur && data.duration) { dur = data.duration; }
        updateTimeDisp(data.seconds);
        if (seek && dur) seek.value = String(Math.round((data.seconds / dur) * 1000));
      }
    });
    player.on('play',  function() { playBtn.textContent = '[ PAUSE ]'; });
    player.on('pause', function() { playBtn.textContent = '[ PLAY ]'; });
    player.on('ended', function() { playBtn.textContent = '[ PLAY ]'; });

    playBtn.addEventListener('click', function() {
      player.getPaused().then(function(paused) {
        if (paused) { player.play(); } else { player.pause(); }
      });
    });

    muteBtn.addEventListener('click', function() {
      player.getMuted().then(function(muted) {
        player.setMuted(!muted);
        muteBtn.textContent = muted ? '[ MUTE ]' : '[ SOUND ]';
        if (muted) {
          var v = parseFloat(volSlider.value) || 0.7;
          player.setVolume(v);
          volSlider.value = String(v);
        }
      });
    });

    volSlider.addEventListener('input', function() {
      var v = parseFloat(volSlider.value);
      player.setVolume(v);
      player.setMuted(v === 0);
      muteBtn.textContent = v === 0 ? '[ MUTE ]' : '[ SOUND ]';
    });

    // start un-muted at full volume
    player.setMuted(false);
    player.setVolume(1);

    spdBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        player.setPlaybackRate(parseFloat(btn.dataset.spd));
        spdBtns.forEach(function(b) { b.classList.remove('vid-spd--active'); });
        btn.classList.add('vid-spd--active');
      });
    });

    if (seek) {
      seek.addEventListener('pointerdown', function() { scrubbing = true; });
      ['pointerup', 'pointercancel'].forEach(function(ev) {
        seek.addEventListener(ev, function() { scrubbing = false; });
      });
      seek.addEventListener('input', function() {
        if (dur) {
          var t = (parseFloat(seek.value) / 1000) * dur;
          player.setCurrentTime(t);
          updateTimeDisp(t);
        }
      });
    }

    initGovVideoFullscreen(wrap);
  });
}

/* ────────────────────────────────────────────────────
   PLAYER — compact 2×2 card grid
   ──────────────────────────────────────────────────── */
function renderPlayerGrid() {
  var grid = document.getElementById('player-grid');
  grid.innerHTML = '';
  GAMES.forEach(function(g, i) {
    var cell = document.createElement('div');
    cell.className = 'player-cell';
    cell.innerHTML =
      '<div class="pc-top"><span class="pc-num">' + g.num + ' · ' + g.status + '</span></div>' +
      '<div class="pc-art-box" aria-hidden="true">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + g.artVB + '" preserveAspectRatio="xMidYMid meet">' + g.art + '</svg>' +
      '</div>' +
      '<h2 class="pc-title">' + g.title + '</h2>' +
      '<p class="pc-desc">' + g.desc + '</p>' +
      '<div class="pc-footer">' +
        '<button type="button" class="pc-play">[ PLAY ]</button>' +
      '</div>';
    cell.addEventListener('click', (function(idx) {
      return function() { openGameFullscreen(idx); };
    })(i));
    grid.appendChild(cell);
  });
}

function openGameFullscreen(i) {
  ranGameFullscreenClosePrep();
  var g = GAMES[i];
  var host = document.getElementById('gfs-body');
  if (g.kind === 'sudoku') {
    sudokuFullscreenMount(host);
  } else if (g.kind === 'memory-grid') {
    memoryFullscreenMount(host);
  } else if (g.kind === 'word-drift' && typeof wordDriftFullscreenMount === 'function') {
    wordDriftFullscreenMount(host);
  } else if (g.kind === 'type-speed' && typeof typeSpeedFullscreenMount === 'function') {
    typeSpeedFullscreenMount(host);
  } else {
    host.className = 'gfs-body';
    host.innerHTML =
      '<p class="gfs-title">' + g.title + '</p>' +
      '<p class="gfs-desc">' + g.desc + '</p>' +
      '<p class="gfs-soon">[ COMING SOON ]</p>';
  }
  var fs = document.getElementById('game-fullscreen');
  fs.classList.add('open'); fs.setAttribute('aria-hidden', 'false');
}
document.getElementById('gfs-close').addEventListener('click', function() {
  ranGameFullscreenClosePrep();
  var fs = document.getElementById('game-fullscreen');
  var bod = document.getElementById('gfs-body');
  bod.className = 'gfs-body';
  bod.innerHTML = '';
  fs.classList.remove('open'); fs.setAttribute('aria-hidden', 'true');
});

/* ────────────────────────────────────────────────────
   THINKER — left list + right pure text content
   ──────────────────────────────────────────────────── */
/* ── Thinker: centred reader ── */
function renderThinkerReader() {
  var reader = document.getElementById('tk-reader');
  var t = THOUGHTS[activeThought];
  var html =
    '<div class="tk-reader-inner">' +
      '<p class="tk-body-num">' + t.num + '</p>' +
      '<p class="tk-body-date">' + t.date + '</p>' +
      '<p class="tk-body-cat">'  + t.cat  + '</p>' +
      '<h2 class="tk-body-title">' + t.title + '</h2>';
  t.body.forEach(function(para) { html += '<p class="tk-body-p">' + para + '</p>'; });
  html += '</div>';
  reader.innerHTML = html;
  reader.scrollTop = 0;
  // update bottom bar
  document.getElementById('tk-bar-info').textContent =
    String(activeThought + 1).padStart(2, '0') + ' / ' + String(THOUGHTS.length).padStart(2, '0') + '  —  ' + t.title;
  // refresh active state in drawer if open
  document.querySelectorAll('.tk-drawer-row').forEach(function(r) {
    r.classList.toggle('active', parseInt(r.dataset.thought, 10) === activeThought);
  });
}

function renderThinkerDrawer() {
  var list = document.getElementById('tk-drawer-list');
  var html = '';
  THOUGHTS.forEach(function(t, i) {
    html +=
      '<div class="tk-drawer-row' + (i === activeThought ? ' active' : '') + '" data-thought="' + i + '">' +
        '<span class="tk-date">' + t.num + '</span>' +
        '<div>' +
          '<p class="tk-title">' + t.title + '</p>' +
          '<p class="tk-desc">'  + t.desc  + '</p>' +
        '</div>' +
        '<span class="tk-tag">' + t.cat + '</span>' +
      '</div>';
  });
  list.innerHTML = html;
  list.querySelectorAll('.tk-drawer-row').forEach(function(row) {
    row.addEventListener('click', function() {
      activeThought = parseInt(row.dataset.thought, 10);
      renderThinkerReader();
      closeThinkerDrawer();
    });
  });
}

function openThinkerDrawer() {
  var d = document.getElementById('tk-drawer');
  d.classList.add('open'); d.setAttribute('aria-hidden', 'false');
  document.getElementById('tk-index-btn').textContent = '[ INDEX ↓ ]';
  renderThinkerDrawer();
}
function closeThinkerDrawer() {
  var d = document.getElementById('tk-drawer');
  d.classList.remove('open'); d.setAttribute('aria-hidden', 'true');
  document.getElementById('tk-index-btn').textContent = '[ INDEX ↑ ]';
}

document.getElementById('tk-index-btn').addEventListener('click', function() {
  var d = document.getElementById('tk-drawer');
  if (d.classList.contains('open')) { closeThinkerDrawer(); } else { openThinkerDrawer(); }
});
document.getElementById('tk-drawer-close').addEventListener('click', closeThinkerDrawer);

document.getElementById('tk-prev').addEventListener('click', function() {
  if (activeThought > 0) { activeThought--; renderThinkerReader(); }
});
document.getElementById('tk-next').addEventListener('click', function() {
  if (activeThought < THOUGHTS.length - 1) { activeThought++; renderThinkerReader(); }
});

/* ────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────── */
// Observer: FLOW (columns) default; editorial GRID + LIST on toggle

buildGridColumns();
renderCarousel(0);
renderBuilderIndex();
initBuilderNav();
renderPlayerGrid();
renderThinkerReader();
bindSiteThemeToggle();
initTextParticles();

(function initDeepLinkHash() {
  var raw = String(window.location.hash || '').replace(/^#/, '');
  if (!raw || typeof showSection !== 'function') return;
  var sections = ['home', 'observer', 'builder', 'player', 'writing', 'about'];
  var id = sections.indexOf(raw) >= 0 ? raw : '';
  if (id) showSection(id);
})();
