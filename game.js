(() => {
  'use strict';

  const W = 640, H = 480, COLS = 16, ROWS = 12, TILE = 40;
  const SAVE_KEY = 'farm-defense-3.autosave.v1';
  const RECORD_KEY = 'farm-defense-3.records.v1';
  const SETTINGS_KEY = 'farm-defense-3.settings.v1';
  const BASE = { x: 340, y: 455, gateX: 340, gateY: 420, col: 8, row: 10 };
  const CROP_SITES = [
    { col: 2, row: 6, kind: 'strawberry' }, { col: 5, row: 7, kind: 'apple' },
    { col: 11, row: 6, kind: 'grape' }, { col: 13, row: 7, kind: 'corn' },
  ];
  const FARM_PLOTS = [
    { kind: 'strawberry', col: 0, row: 5, cols: 3, rows: 3 },
    { kind: 'apple', col: 4, row: 6, cols: 3, rows: 3 },
    { kind: 'grape', col: 9, row: 5, cols: 3, rows: 3 },
    { kind: 'corn', col: 13, row: 6, cols: 3, rows: 3 },
  ];
  const CROP_STYLES = {
    strawberry: { label: '딸기밭', accent: '#e85d69' },
    apple: { label: '사과밭', accent: '#d95543' },
    grape: { label: '포도밭', accent: '#9a70c3' },
    corn: { label: '옥수수밭', accent: '#dcbf4f' },
  };
  const MAP_ROWS = [
    '................',
    '..bb....bb....bb',
    '...s..b..b..s...',
    '....bb....bb....',
    '...g..w..w..g...',
    '.b....w..w....b.',
    '.s....b..b....s.',
    '...bb......bb...',
    '......b..b......',
    '....bb....bb....',
    '......b..b......',
    '......b..b......',
  ];
  const ENEMIES = {
    mole: { name: '두더지', img: 'mole.svg', hp: 30, speed: 62, damage: 7, score: 80, fruit: 2, xp: 12, color: '#c79569' },
    rabbit: { name: '토끼', img: 'rabbit.svg', hp: 28, speed: 91, damage: 6, score: 110, fruit: 3, xp: 16, color: '#eadbbf' },
    crow: { name: '까마귀', img: 'crow.svg', hp: 23, speed: 104, damage: 5, score: 100, fruit: 2, xp: 14, color: '#8497b1', flying: true },
    boar: { name: '멧돼지', img: 'boar.svg', hp: 66, speed: 53, damage: 11, score: 230, fruit: 5, xp: 30, color: '#b67852' },
    mouse: { name: '들쥐', img: 'mouse.svg', hp: 18, speed: 132, damage: 4, score: 75, fruit: 2, xp: 10, color: '#b7a1a0', visualScale: 0.74 },
    wolf: { name: '늑대', img: 'wolf.svg', hp: 105, speed: 72, damage: 14, score: 350, fruit: 7, xp: 42, color: '#87929a' },
    fox: { name: '여우', img: 'fox.svg', hp: 48, speed: 112, damage: 8, score: 180, fruit: 4, xp: 24, color: '#e18d4b' },
    raccoon: { name: '너구리', img: 'raccoon.svg', hp: 78, speed: 64, damage: 10, score: 260, fruit: 6, xp: 34, color: '#858078' },
    deer: { name: '사슴', img: 'deer.svg', hp: 92, speed: 96, damage: 12, score: 320, fruit: 6, xp: 38, color: '#c28b5c' },
    kingBoar: { name: '왕멧돼지', img: 'king-boar.svg', hp: 360, speed: 46, damage: 20, score: 850, fruit: 16, xp: 85, color: '#df9953', elite: true },
    tiger: { name: '호랑이 대왕', img: 'tiger.svg', hp: 980, speed: 40, damage: 30, score: 3000, fruit: 40, xp: 180, color: '#f0a547', boss: true },
  };
  const ENEMY_ROSTER = ['mole', 'rabbit', 'crow', 'boar', 'mouse', 'wolf', 'fox', 'raccoon', 'deer'];
  const AMMO = {
    bb: { name: 'BB탄', speed: 390, damage: 18, countKey: 'bb', color: '#ffefc7', cost: 15, refill: 50 },
    steel: { name: '강철탄', speed: 470, damage: 38, countKey: 'steel', color: '#a9dbef', cost: 20, refill: 12 },
    stone: { name: '돌멩이', speed: 320, damage: 56, countKey: 'stone', color: '#e2c29f', cost: 25, refill: 5 },
  };
  const UPGRADES = [
    { key: 'power', name: '새총 위력', icon: '🎯', desc: '탄환 피해량 +12%', cost: 18 },
    { key: 'rapid', name: '새총 연사', icon: '⚡', desc: '발사 속도 +8%', cost: 22 },
    { key: 'speed', name: '가벼운 장화', icon: '👢', desc: '이동 속도 +18', cost: 16 },
    { key: 'armor', name: '튼튼한 앞치마', icon: '🛡️', desc: '받는 피해 -8%', cost: 20 },
    { key: 'vitality', name: '든든한 새참', icon: '🍲', desc: '최대 체력 +20', cost: 24 },
    { key: 'fence', name: '튼튼한 울타리', icon: '🪵', desc: '헛간 피해 -8%', cost: 20 },
  ];
  const PETS = {
    nuni: { name: '누니', img: 'pet-nuni.png', price: 40, desc: '본진 근처를 지키며 다가온 적을 막아요.', role: 'guard', hp: 82, damage: 14, cooldown: 0.82, speed: 150, range: 185 },
    yangi: { name: '양이', img: 'pet-yangi.png', price: 60, desc: '멀리 떨어진 침입자도 긴 사거리로 공격해요.', role: 'sniper', hp: 56, damage: 12, cooldown: 0.92, speed: 160, range: 430 },
    maru: { name: '마루', img: 'pet-maru.png', price: 75, desc: '주기적으로 주변 고양이의 체력을 회복해요.', role: 'healer', hp: 64, heal: 13, healCooldown: 1.35, healRange: 270, speed: 142 },
  };
  const PET_ORDER = ['nuni', 'yangi', 'maru'];
  const GROWTH_NAMES = { 1: '아기 효린이', 2: '어린이 효린이', 3: '청소년 효린이', 4: '성인 효린이' };
  const SEASONS = [
    { name: '봄 작전', ground: '#7e9f5d', light: '#8cac65', dark: '#719251', plot: '#866441' },
    { name: '여름 작전', ground: '#91a75b', light: '#a0b767', dark: '#819650', plot: '#896744' },
    { name: '가을 작전', ground: '#9b9555', light: '#aaa05e', dark: '#8a854c', plot: '#8c6342' },
    { name: '겨울 작전', ground: '#748f79', light: '#87a38a', dark: '#6b8572', plot: '#7a654e' },
  ];
  const $ = (id) => document.getElementById(id);
  const canvas = $('board');
  const ctx = canvas.getContext('2d');
  const stageFrame = $('stageFrame');
  const unitsLayer = $('unitsLayer');
  let game = null;
  let lastFrame = 0;
  let lastSave = 0;
  let toastTimer = 0;
  let popTimer = 0;
  let audioContext = null;
  let soundOn = readSetting('sound') !== false;
  const keys = new Set();
  const touchDirs = new Set();
  let touchFire = false;
  let mouseFire = false;
  const unitNodes = new Map();
  let playerNode = null;

  function readSetting(key) {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')[key]; } catch { return undefined; }
  }

  function setSetting(key, value) {
    try {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      settings[key] = value;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch { /* Browser storage may be unavailable. */ }
  }

  function beep(freq = 500, duration = 0.06, type = 'square', volume = 0.025) {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
    } catch { /* Sound is a small optional browser extra. */ }
  }

  function showToast(text, ms = 1700) {
    const node = $('toast');
    node.textContent = text;
    node.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('visible'), ms);
  }

  function popText(text, ms = 1500) {
    const node = $('stagePop');
    node.textContent = text;
    node.classList.add('visible');
    clearTimeout(popTimer);
    popTimer = setTimeout(() => node.classList.remove('visible'), ms);
  }

  function makeGrid(level) {
    const rows = MAP_ROWS.map((row) => row.split(''));
    if (level % 3 === 2) {
      rows[5][5] = 'b'; rows[5][10] = 'b'; rows[6][4] = 'g'; rows[6][11] = 'g';
    } else if (level % 3 === 0) {
      rows[4][5] = 'b'; rows[4][10] = 'b'; rows[6][3] = 's'; rows[6][12] = 's';
    }
    return rows.map((row) => row.map((kind) => ({ kind, hp: kind === 'b' ? 48 : kind === 's' ? -1 : 0 })));
  }

  function freshGame() {
    return {
      schema: 1, phase: 'playing', resumePhase: 'playing', level: 1, rank: 1,
      xp: 0, xpNext: 100, score: 0, coins: 20, kills: 0, wavesCleared: 0,
      hp: 100, maxHp: 100, barnHp: 120, barnMax: 120,
      ammo: 'bb', ammoCounts: { bb: 60, steel: 16, stone: 5 },
      upgrades: { power: 0, rapid: 0, speed: 0, armor: 0, vitality: 0, fence: 0 },
      boulderUnlocked: false, specialCooldown: 0, playerInvulnerable: 0,
      player: { x: 340, y: 374, dir: 'up', fireCooldown: 0 },
      milk: null,
      crops: CROP_SITES.map((site) => ({ ...site, hp: 80, maxHp: 80 })),
      grid: makeGrid(1), enemies: [], bullets: [], pets: [], effects: [], petShots: [],
      spawned: 0, total: 0, spawnTimer: 0.5, waveTime: 0,
    };
  }

  function saveGame() {
    if (!game || !['playing', 'paused', 'shop'].includes(game.phase)) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)); } catch { /* Game remains playable without autosave. */ }
  }

  function loadGame() {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (!value || value.schema !== 1 || !value.player || !Array.isArray(value.grid) || !Array.isArray(value.enemies)) return null;
      if (value.grid.length !== ROWS || value.grid.some((row) => !Array.isArray(row) || row.length !== COLS)) return null;
      value.phase = value.phase === 'shop' ? 'shop' : 'playing';
      value.resumePhase = value.phase;
      value.effects = [];
      value.petShots = [];
      value.bullets ||= [];
      value.pets ||= [];
      value.pets = value.pets.map((pet) => {
        const info = PETS[pet.type];
        if (!info) return null;
        pet.hpMax ||= info.hp;
        pet.hp = Number.isFinite(pet.hp) ? Math.max(0, Math.min(pet.hpMax, pet.hp)) : pet.hpMax;
        pet.healCooldown = Number.isFinite(pet.healCooldown) ? pet.healCooldown : 0.4;
        return pet;
      }).filter((pet) => pet && pet.hp > 0);
      value.crops ||= CROP_SITES.map((site) => ({ ...site, hp: 80, maxHp: 80 }));
      value.crops = value.crops.map((crop, index) => ({ ...crop, kind: crop.kind || CROP_SITES[index]?.kind || 'strawberry' }));
      if (!Object.prototype.hasOwnProperty.call(value, 'milk')) value.milk = value.phase === 'playing' ? createMilkPickup(value) : null;
      value.ammoCounts ||= { bb: 60, steel: 16, stone: 5 };
      value.upgrades ||= { power: 0, rapid: 0, speed: 0, armor: 0, vitality: 0, fence: 0 };
      return value;
    } catch { return null; }
  }

  function showHome() {
    $('gameScreen').hidden = true;
    $('homeScreen').hidden = false;
    $('pauseModal').hidden = true;
    $('shopModal').hidden = true;
    $('gameOverModal').hidden = true;
    unitsLayer.replaceChildren();
    unitNodes.clear(); playerNode = null;
    updateHome();
  }

  function showGame() {
    $('homeScreen').hidden = true;
    $('gameScreen').hidden = false;
    $('pauseModal').hidden = true;
    $('gameOverModal').hidden = true;
    resizeActors();
    ensurePlayerNode();
    if (game && game.phase === 'shop') openShop(true);
    else {
      $('shopModal').hidden = true;
      game.phase = 'playing';
      popText(game.milk ? `제${game.level}레벨 방어 작전! 초코우유를 찾아요` : `제${game.level}레벨 방어 작전!`);
    }
    saveGame();
    updateHud();
  }

  function updateHome() {
    const saved = loadGame();
    $('continueGame').hidden = !saved;
    const records = readRecords();
    const best = records.reduce((acc, row) => row.score > acc.score ? row : acc, { score: 0, level: 1 });
    $('bestRecord').textContent = `${best.score.toLocaleString()}점 · Lv.${best.level}`;
    $('soundToggle').textContent = soundOn ? '🔊' : '🔇';
    $('soundToggle').setAttribute('aria-label', soundOn ? '효과음 끄기' : '효과음 켜기');
  }

  function readRecords() {
    try {
      const rows = JSON.parse(localStorage.getItem(RECORD_KEY) || '[]');
      return Array.isArray(rows) ? rows.filter((row) => Number.isFinite(row.score) && Number.isFinite(row.level)) : [];
    } catch { return []; }
  }

  function beginNewGame() {
    game = freshGame();
    startWave(true);
    showGame();
    beep(520, 0.1);
  }

  function continueGame() {
    const loaded = loadGame();
    if (!loaded) { showToast('이어할 작전이 없어요. 새 게임을 시작해 주세요.'); return; }
    game = loaded;
    if (game.phase === 'shop') showGame();
    else { game.phase = 'playing'; showGame(); }
    beep(420, 0.08);
  }

  function startWave(initial = false) {
    game.grid = makeGrid(game.level);
    freeActorsFromNewWalls();
    game.milk = createMilkPickup(game);
    game.enemies = [];
    game.bullets = [];
    game.petShots = [];
    game.spawned = 0;
    game.total = Math.min(6 + Math.floor(game.level * 1.25), 14);
    if (game.level % 5 === 0) game.total += 2;
    game.spawnTimer = initial ? 0.55 : 0.85;
    game.waveTime = 0;
    game.phase = 'playing';
    game.specialCooldown = Math.max(0, game.specialCooldown || 0);
    game.player.fireCooldown = 0;
    const season = SEASONS[(game.level - 1) % SEASONS.length];
    $('seasonLabel').textContent = season.name;
    $('sectorText').textContent = `${String.fromCharCode(65 + ((game.level - 1) % 5))}-${String(game.level).padStart(2, '0')}`;
    $('missionText').textContent = `제${game.level}레벨 · 헛간 방어`;
    $('phasePill').textContent = '전투 중';
    if (!initial) {
      const levelMessage = game.level % 5 === 0 ? `보스 출현! 제${game.level}레벨` : `제${game.level}레벨 시작!`;
      popText(game.milk ? `${levelMessage} · 초코우유가 놓였어요` : levelMessage);
      beep(650, 0.11, 'triangle');
    }
    saveGame();
    updateHud();
  }

  function createMilkPickup(state) {
    if (!state || !Array.isArray(state.grid)) return null;
    const candidates = [];
    for (let row = 1; row < ROWS - 1; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const tile = state.grid[row][col];
        if (!tile || ['b', 's', 'w'].includes(tile.kind)) continue;
        const x = col * TILE + TILE / 2, y = row * TILE + TILE / 2;
        if (Math.hypot(x - state.player.x, y - state.player.y) < 95 || Math.hypot(x - BASE.x, y - BASE.y) < 100) continue;
        if (state.crops?.some((crop) => Math.hypot(x - (crop.col * TILE + TILE / 2), y - (crop.row * TILE + TILE / 2)) < 31)) continue;
        candidates.push({ x, y, fullNotice: false });
      }
    }
    return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
  }

  function selectAmmo(kind) {
    if (!AMMO[kind]) return;
    game && (game.ammo = kind);
    document.querySelectorAll('.ammo-option').forEach((button) => button.classList.toggle('selected', button.dataset.ammo === kind));
    if (game) updateHud();
  }

  function directionVector(dir) {
    return dir === 'up' ? { x: 0, y: -1 } : dir === 'down' ? { x: 0, y: 1 } : dir === 'left' ? { x: -1, y: 0 } : { x: 1, y: 0 };
  }

  function rotationFor(dir) {
    return dir === 'down' ? 0 : dir === 'left' ? -90 : dir === 'up' ? 180 : 90;
  }

  function setDirectionFromVector(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) game.player.dir = dx < 0 ? 'left' : 'right';
    else if (dy) game.player.dir = dy < 0 ? 'up' : 'down';
  }

  function growthStageForHealth(hp, maxHp) {
    const ratio = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 0;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  function playerSlingDistance() {
    const heights = { 1: 36, 2: 42.5, 3: 49, 4: 55 };
    return heights[growthStageForHealth(game.hp, game.maxHp)] * 0.55 + 6;
  }

  function collectMilkIfNearby() {
    if (!game?.milk || Math.hypot(game.player.x - game.milk.x, game.player.y - game.milk.y) > 19) return;
    if (game.hp >= game.maxHp) {
      if (!game.milk.fullNotice) {
        game.milk.fullNotice = true;
        showToast('체력이 가득 차 있어요. 다친 뒤 초코우유를 마실 수 있어요.');
      }
      return;
    }
    const before = game.hp;
    game.hp = Math.min(game.maxHp, game.hp + 35);
    const restored = Math.ceil(game.hp - before);
    const { x, y } = game.milk;
    game.milk = null;
    addEffect(x, y - 12, `+${restored} HP`, 0.8, '#ffe6a3');
    showToast(`종이곽 초코우유를 마셨어요! 체력 +${restored}`);
    beep(720, 0.14, 'sine', 0.03);
    updateHud();
    saveGame();
  }

  function getTileAt(x, y) {
    const col = Math.floor(x / TILE), row = Math.floor(y / TILE);
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return { kind: 's', hp: -1 };
    return game.grid[row][col];
  }

  function isBlocked(x, y, flying = false, canCrossFences = false) {
    const kind = getTileAt(x, y).kind;
    if (kind === 's') return true;
    if (flying) return false;
    return kind === 'w' || (kind === 'b' && !canCrossFences);
  }

  function canOccupy(x, y, radius = 10, flying = false, canCrossFences = false) {
    return !isBlocked(x - radius, y - radius, flying, canCrossFences) && !isBlocked(x + radius, y - radius, flying, canCrossFences)
      && !isBlocked(x - radius, y + radius, flying, canCrossFences) && !isBlocked(x + radius, y + radius, flying, canCrossFences);
  }

  function moveEntity(entity, dx, dy, radius, flying = false, canCrossFences = false) {
    let moved = false;
    const startX = entity.x, startY = entity.y;
    const nx = Math.max(radius + 2, Math.min(W - radius - 2, entity.x + dx));
    const ny = Math.max(radius + 2, Math.min(H - radius - 2, entity.y + dy));
    if (canOccupy(nx, entity.y, radius, flying, canCrossFences)) { moved ||= nx !== entity.x; entity.x = nx; }
    if (canOccupy(entity.x, ny, radius, flying, canCrossFences)) { moved ||= ny !== entity.y; entity.y = ny; }
    if (moved) {
      const movedX = entity.x - startX, movedY = entity.y - startY;
      entity.lastMoveDir = Math.abs(movedX) > Math.abs(movedY) ? (movedX < 0 ? 'left' : 'right') : (movedY < 0 ? 'up' : 'down');
    }
    return moved;
  }

  function freeActorsFromNewWalls() {
    if (!game) return;
    ejectFromNewWall(game.player, 12);
    for (const pet of game.pets) ejectFromNewWall(pet, 9, true);
  }

  function ejectFromNewWall(entity, radius, canCrossFences = false) {
    if (canOccupy(entity.x, entity.y, radius, false, canCrossFences)) return;
    const reverse = { up: 'down', down: 'up', left: 'right', right: 'left' };
    const enteredDirection = entity.lastMoveDir || entity.dir || 'up';
    const escapeDirection = reverse[enteredDirection] || 'down';
    const vector = directionVector(escapeDirection);

    // First back out along the path the actor just used to enter this spot.
    for (let distance = 2; distance <= TILE * 3; distance += 2) {
      const x = entity.x + vector.x * distance, y = entity.y + vector.y * distance;
      if (canOccupy(x, y, radius, false)) {
        entity.x = x; entity.y = y;
        entity.dir = escapeDirection; entity.lastMoveDir = escapeDirection;
        return;
      }
    }

    // If that route is blocked too, pick the nearest open tile while preferring the entry side.
    const openTiles = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const x = col * TILE + TILE / 2, y = row * TILE + TILE / 2;
        if (!canOccupy(x, y, radius, false, canCrossFences)) continue;
        const dx = x - entity.x, dy = y - entity.y, distance = Math.hypot(dx, dy);
        const alignment = distance ? (dx * vector.x + dy * vector.y) / distance : 0;
        openTiles.push({ x, y, score: distance + (1 - alignment) * TILE * 2 });
      }
    }
    openTiles.sort((a, b) => a.score - b.score);
    if (openTiles.length) {
      entity.x = openTiles[0].x; entity.y = openTiles[0].y;
      entity.dir = escapeDirection; entity.lastMoveDir = escapeDirection;
    }
  }

  function chooseEnemyKind() {
    if (game.level % 5 === 0 && game.spawned === game.total - 1) return 'tiger';
    if (game.level % 5 === 0 && game.spawned === game.total - 2) return 'kingBoar';
    const unlocked = Math.min(ENEMY_ROSTER.length, 4 + Math.floor((game.level - 1) / 2));
    const roster = ENEMY_ROSTER.slice(0, unlocked);
    const offset = (game.level - 1) % roster.length;
    return roster[(game.spawned + offset) % roster.length];
  }

  function spawnEnemy() {
    const kind = chooseEnemyKind();
    const info = ENEMIES[kind];
    const lane = [60, 300, 580][Math.floor(Math.random() * 3)];
    const scale = 1 + (game.level - 1) * 0.045;
    const availableCrops = game.crops.map((crop, index) => crop.hp > 0 ? index : -1).filter((index) => index >= 0);
    const targetCrop = availableCrops.length && Math.random() < 0.4 ? availableCrops[Math.floor(Math.random() * availableCrops.length)] : null;
    game.enemies.push({
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      kind, x: lane, y: 18, hp: Math.round(info.hp * scale), maxHp: Math.round(info.hp * scale),
      speed: info.speed * Math.min(1.25, 1 + (game.level - 1) * 0.012), damage: info.damage * scale,
      attackCd: 0.5 + Math.random() * 0.8, pathCd: 0, slow: 0, dir: 'down', targetCrop,
      burrow: kind === 'mole' ? 0.75 : 0, moleTimer: 3.8 + Math.random() * 1.8,
      charge: 0, chargeTimer: 2.2 + Math.random() * 1.5,
      petAttackCd: 0.45 + Math.random() * 0.4,
    });
    game.spawned += 1;
    if (info.boss) { popText('🐯 호랑이 대왕 등장! 농장의 최종 보스!', 2600); beep(110, 0.34, 'sawtooth', 0.045); }
  }

  function tilePassable(col, row, flying = false) {
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return false;
    const kind = game.grid[row][col].kind;
    if (kind === 's') return false;
    if (flying) return true;
    return kind !== 'b' && kind !== 'w';
  }

  function findNextCell(fromCol, fromRow, toCol, toRow, flying = false) {
    const start = fromRow * COLS + fromCol, goal = toRow * COLS + toCol;
    if (start === goal) return null;
    const prev = new Int16Array(COLS * ROWS); prev.fill(-2); prev[start] = -1;
    const queue = new Int16Array(COLS * ROWS); let head = 0, tail = 0; queue[tail++] = start;
    const dirs = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    while (head < tail && prev[goal] === -2) {
      const at = queue[head++], col = at % COLS, row = Math.floor(at / COLS);
      for (const [dx, dy] of dirs) {
        const nx = col + dx, ny = row + dy, ni = ny * COLS + nx;
        if (!tilePassable(nx, ny, flying) || prev[ni] !== -2) continue;
        prev[ni] = at; queue[tail++] = ni;
        if (ni === goal) break;
      }
    }
    if (prev[goal] === -2) return null;
    let at = goal;
    while (prev[at] !== start && prev[at] !== -1) at = prev[at];
    return { col: at % COLS, row: Math.floor(at / COLS) };
  }

  function enemyGoal(enemy) {
    const crop = Number.isInteger(enemy.targetCrop) ? game.crops[enemy.targetCrop] : null;
    if (crop && crop.hp > 0) return { x: crop.col * TILE + TILE / 2, y: crop.row * TILE + TILE / 2, crop };
    enemy.targetCrop = null;
    return { x: BASE.gateX, y: BASE.gateY, crop: null };
  }

  function attackCrop(enemy, crop) {
    enemy.attackCd -= 1 / 60;
    if (enemy.attackCd > 0) return;
    enemy.attackCd = 1.05;
    const hit = Math.max(3, Math.round(enemy.damage * 0.7));
    crop.hp = Math.max(0, crop.hp - hit);
    addEffect(crop.col * TILE + 20, crop.row * TILE + 18, '🌱', 0.55, '#f4d078');
    beep(220, 0.07, 'triangle', 0.018);
    if (crop.hp <= 0) showToast('작물 밭 하나가 망가졌어요! 헛간을 지켜 주세요.');
  }

  function updateEnemies(dt) {
    const alive = [];
    for (const enemy of game.enemies) {
      const info = ENEMIES[enemy.kind];
      enemy.attackCd = Math.max(0, enemy.attackCd - dt);
      enemy.pathCd = Math.max(0, enemy.pathCd - dt);
      enemy.slow = Math.max(0, enemy.slow - dt);
      enemy.burrow = Math.max(0, (enemy.burrow || 0) - dt);
      enemy.moleTimer = (enemy.moleTimer || 0) - dt;
      enemy.charge = Math.max(0, (enemy.charge || 0) - dt);
      enemy.chargeTimer = (enemy.chargeTimer || 0) - dt;
      enemy.petAttackCd = Math.max(0, (enemy.petAttackCd || 0) - dt);
      if (enemy.kind === 'mole' && enemy.moleTimer <= 0) { enemy.burrow = 0.65; enemy.moleTimer = 4.5 + Math.random() * 2.5; }
      if ((enemy.kind === 'boar' || enemy.kind === 'deer' || enemy.kind === 'tiger') && enemy.chargeTimer <= 0) {
        enemy.charge = enemy.kind === 'tiger' ? 1 : 0.72;
        enemy.chargeTimer = enemy.kind === 'tiger' ? 4.1 : 3.8 + Math.random() * 1.4;
        if (enemy.kind === 'tiger') popText('호랑이 대왕이 포효하며 돌진해요!', 1600);
        else if (enemy.kind === 'deer') popText('사슴이 밭을 향해 뛰어들어요!');
        else popText('멧돼지가 돌진해요!');
      }
      const goal = enemyGoal(enemy);
      const distance = Math.hypot(goal.x - enemy.x, goal.y - enemy.y);
      if (goal.crop && distance < 21) {
        if (enemy.attackCd <= 0) {
          const hit = Math.max(3, Math.round(enemy.damage * 0.7));
          goal.crop.hp = Math.max(0, goal.crop.hp - hit);
          enemy.attackCd = 1.05;
          addEffect(goal.x, goal.y, '✦', 0.4, '#f6d87b');
          if (goal.crop.hp <= 0) showToast('작물 밭 하나가 망가졌어요! 헛간을 지켜 주세요.');
        }
      } else if (!goal.crop && Math.hypot(BASE.x - enemy.x, BASE.y - enemy.y) < 40) {
        if (enemy.attackCd <= 0) {
          const reduction = 1 - game.upgrades.fence * 0.08;
          game.barnHp = Math.max(0, game.barnHp - Math.max(1, Math.round(enemy.damage * reduction)));
          enemy.attackCd = 1.0;
          addEffect(BASE.x, BASE.y - 16, '💥', 0.45, '#f28c5e');
          beep(100, 0.08, 'square', 0.024);
        }
      } else if (enemy.pathCd <= 0 || !enemy.nextCell) {
        const col = Math.max(0, Math.min(COLS - 1, Math.floor(enemy.x / TILE)));
        const row = Math.max(0, Math.min(ROWS - 1, Math.floor(enemy.y / TILE)));
        const goalCol = Math.max(0, Math.min(COLS - 1, Math.floor(goal.x / TILE)));
        const goalRow = Math.max(0, Math.min(ROWS - 1, Math.floor(goal.y / TILE)));
        enemy.nextCell = findNextCell(col, row, goalCol, goalRow, info.flying);
        enemy.pathCd = 0.22;
        if (enemy.nextCell) {
          const dx = enemy.nextCell.col * TILE + TILE / 2 - enemy.x;
          const dy = enemy.nextCell.row * TILE + TILE / 2 - enemy.y;
          if (Math.abs(dx) > Math.abs(dy)) enemy.dir = dx < 0 ? 'left' : 'right';
          else if (dy) enemy.dir = dy < 0 ? 'up' : 'down';
        }
      }

      if (distance > 21 || !goal.crop) {
        if (enemy.nextCell) {
          const tx = enemy.nextCell.col * TILE + TILE / 2, ty = enemy.nextCell.row * TILE + TILE / 2;
          const dx = tx - enemy.x, dy = ty - enemy.y, length = Math.hypot(dx, dy);
          if (length > 1) {
            const step = enemy.speed * (enemy.slow > 0 ? 0.45 : 1) * (enemy.charge > 0 ? 1.7 : 1) * dt;
            const moved = moveEntity(enemy, dx / length * Math.min(step, length), dy / length * Math.min(step, length), info.boss ? 18 : info.elite ? 15 : 11, info.flying);
            if (moved && Math.abs(dx) > Math.abs(dy)) enemy.dir = dx < 0 ? 'left' : 'right';
            else if (moved && dy) enemy.dir = dy < 0 ? 'up' : 'down';
            if (!moved && !info.flying) damageFrontFence(enemy, dt);
          }
        }
      }

      if (Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y) < 22 && game.playerInvulnerable <= 0) {
        const hurt = Math.max(1, Math.round(7 * (1 - game.upgrades.armor * 0.08)));
        game.hp = Math.max(0, game.hp - hurt);
        game.playerInvulnerable = 0.8;
        addEffect(game.player.x, game.player.y - 16, '!', 0.42, '#ff8c69');
        beep(125, 0.1, 'sawtooth', 0.025);
      }
      const nearbyPet = game.pets.find((pet) => pet.hp > 0 && Math.hypot(enemy.x - pet.x, enemy.y - pet.y) < 24);
      if (nearbyPet && enemy.petAttackCd <= 0) {
        const hurt = Math.max(2, Math.round(enemy.damage * 0.58));
        nearbyPet.hp = Math.max(0, nearbyPet.hp - hurt);
        enemy.petAttackCd = 1.05;
        addEffect(nearbyPet.x, nearbyPet.y - 12, '!', 0.38, '#ff9976');
        if (nearbyPet.hp <= 0) showToast(`${PETS[nearbyPet.type].name}가 잠시 쉬러 돌아갔어요.`);
      }
      alive.push(enemy);
    }
    game.enemies = alive;
  }

  function damageFrontFence(enemy, dt) {
    enemy.wallTimer = (enemy.wallTimer || 0) - dt;
    if (enemy.wallTimer > 0) return;
    enemy.wallTimer = 0.7;
    const v = directionVector(enemy.dir);
    const tile = getTileAt(enemy.x + v.x * 20, enemy.y + v.y * 20);
    if (tile.kind === 'b') {
      tile.hp -= enemy.damage * (enemy.charge > 0 ? 2.8 : 1.2);
      if (tile.hp <= 0) tile.kind = '.';
      addEffect(enemy.x + v.x * 16, enemy.y + v.y * 16, '✦', 0.28, '#ecc170');
    }
  }

  function firePlayer() {
    const kind = game.ammo;
    if (game.ammoCounts[kind] <= 0) {
      const next = ['bb', 'steel', 'stone'].find((item) => game.ammoCounts[item] > 0);
      if (!next) { showToast('탄환이 모두 떨어졌어요. 정비 시간에 보충해 주세요.'); game.player.fireCooldown = 0.55; return; }
      game.ammo = next; selectAmmo(next);
    }
    const type = game.ammo, info = AMMO[type], v = directionVector(game.player.dir);
    const power = 1 + game.upgrades.power * 0.12;
    const launchDistance = playerSlingDistance() + 3;
    const launchX = Math.max(1, Math.min(W - 1, game.player.x + v.x * launchDistance));
    const launchY = Math.max(1, Math.min(H - 1, game.player.y + v.y * launchDistance));
    game.bullets.push({ x: launchX, y: launchY, vx: v.x, vy: v.y, speed: info.speed, damage: info.damage * power, type, color: info.color });
    game.ammoCounts[type] -= 1;
    const haste = 1 + (game.rank - 1) * 0.01 + game.upgrades.rapid * 0.08;
    game.player.fireCooldown = 0.42 / haste;
    beep(type === 'steel' ? 690 : type === 'stone' ? 210 : 530, type === 'stone' ? 0.12 : 0.055, type === 'stone' ? 'triangle' : 'square', type === 'stone' ? 0.035 : 0.02);
    updateHud();
  }

  function updateBullets(dt) {
    const remaining = [];
    for (const bullet of game.bullets) {
      bullet.x += bullet.vx * bullet.speed * dt;
      bullet.y += bullet.vy * bullet.speed * dt;
      if (bullet.x < 0 || bullet.y < 0 || bullet.x >= W || bullet.y >= H) continue;
      const tile = getTileAt(bullet.x, bullet.y);
      if (tile.kind === 'b') {
        tile.hp -= bullet.type === 'steel' ? bullet.damage * 0.9 : bullet.damage * 0.65;
        addEffect(bullet.x, bullet.y, '✦', 0.25, bullet.color);
        if (tile.hp <= 0) tile.kind = '.';
        continue;
      }
      if (tile.kind === 's' || tile.kind === 'w') { addEffect(bullet.x, bullet.y, '·', 0.18, '#d9e6d0'); continue; }
      const hit = game.enemies.find((enemy) => Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) < (ENEMIES[enemy.kind].boss ? 38 : ENEMIES[enemy.kind].elite ? 27 : 15));
      if (hit) {
        hit.hp -= bullet.damage;
        addEffect(bullet.x, bullet.y, '✦', 0.28, bullet.color);
        if (bullet.type === 'stone') { hit.slow = Math.max(hit.slow, 1.15); hit.x += bullet.vx * 13; hit.y += bullet.vy * 13; }
        if (hit.hp <= 0) defeatEnemy(hit);
        continue;
      }
      remaining.push(bullet);
    }
    game.bullets = remaining;
    game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
  }

  function defeatEnemy(enemy) {
    const info = ENEMIES[enemy.kind];
    game.kills += 1;
    game.score += info.score * Math.min(2, 1 + Math.floor((game.level - 1) / 5) * 0.1);
    game.coins += info.fruit;
    game.xp += info.xp;
    addEffect(enemy.x, enemy.y, enemy.kind === 'tiger' ? '🐯' : enemy.kind === 'kingBoar' ? '🐗' : '✦', 0.75, info.color);
    if (enemy.kind === 'tiger') { game.score += 1000; showToast('호랑이 대왕 격퇴! 농장을 지켜냈어요!'); beep(840, 0.32, 'triangle', 0.05); }
    else if (enemy.kind === 'kingBoar') { showToast('왕멧돼지 격퇴! 열매 포인트 +16'); beep(760, 0.2, 'triangle', 0.035); }
    else beep(740, 0.045, 'square', 0.018);
    while (game.xp >= game.xpNext) {
      game.xp -= game.xpNext;
      game.rank += 1;
      game.xpNext = Math.round(100 + (game.rank - 1) * 44);
      popText(`레벨 업! 수비대 Lv.${game.rank} · 공격 속도 +1%`, 1900);
      beep(960, 0.12, 'triangle', 0.035);
    }
  }

  function updatePets(dt) {
    for (const pet of game.pets) {
      const info = PETS[pet.type];
      const home = info.role === 'guard'
        ? { x: BASE.x, y: BASE.gateY - 12 }
        : { x: game.player.x + (pet.type === 'maru' ? 40 : 0), y: game.player.y + 30 };
      let target = null;
      if (info.role === 'guard' || info.role === 'sniper') {
        pet.cooldown = Math.max(0, pet.cooldown - dt);
        const targets = game.enemies.filter((enemy) => {
          if (enemy.hp <= 0 || Math.hypot(enemy.x - pet.x, enemy.y - pet.y) > info.range) return false;
          return info.role !== 'guard' || Math.hypot(enemy.x - BASE.x, enemy.y - BASE.y) <= 205;
        }).sort((a, b) => {
          const da = info.role === 'guard' ? Math.hypot(a.x - BASE.x, a.y - BASE.y) : Math.hypot(a.x - pet.x, a.y - pet.y);
          const db = info.role === 'guard' ? Math.hypot(b.x - BASE.x, b.y - BASE.y) : Math.hypot(b.x - pet.x, b.y - pet.y);
          return da - db;
        });
        target = targets[0];
      }
      const dx = home.x - pet.x, dy = home.y - pet.y, distance = Math.hypot(dx, dy);
      if (info.role === 'healer') {
        pet.healCooldown = Math.max(0, (pet.healCooldown || 0) - dt);
        const wounded = game.pets.filter((ally) => ally.hp > 0 && ally.hp < ally.hpMax && Math.hypot(ally.x - pet.x, ally.y - pet.y) <= info.healRange)
          .sort((a, b) => a.hp / a.hpMax - b.hp / b.hpMax);
        if (wounded.length && pet.healCooldown <= 0) {
          const ally = wounded[0];
          const before = ally.hp;
          ally.hp = Math.min(ally.hpMax, ally.hp + info.heal);
          pet.healCooldown = info.healCooldown;
          game.petShots.push({ type: 'heal', x0: pet.x, y0: pet.y, x1: ally.x, y1: ally.y, life: 0.24, maxLife: 0.24, color: '#9be58d' });
          addEffect(ally.x, ally.y - 13, `+${Math.round(ally.hp - before)}`, 0.55, '#a6ed91');
          beep(620, 0.075, 'sine', 0.018);
        }
      } else if (target) {
        if (Math.abs(target.x - pet.x) > Math.abs(target.y - pet.y)) pet.dir = target.x < pet.x ? 'left' : 'right';
        else pet.dir = target.y < pet.y ? 'up' : 'down';
        if (pet.cooldown <= 0) {
          pet.cooldown = info.cooldown;
          const aimX = target.x - pet.x, aimY = target.y - pet.y, aimLength = Math.hypot(aimX, aimY) || 1;
          const vx = aimX / aimLength, vy = aimY / aimLength;
          game.petShots.push({
            type: 'paw', x: pet.x + vx * 11, y: pet.y + vy * 11, vx, vy,
            speed: 350, range: aimLength + 24, travelled: 0, life: 2,
            damage: info.damage * (1 + game.upgrades.power * 0.06), angle: Math.atan2(vy, vx),
          });
          beep(560, 0.055, 'triangle', 0.014);
        }
      }
      if (distance > 14) {
        const speed = info.speed * Math.min(1, distance / 52) * dt;
        moveEntity(pet, dx / distance * Math.min(speed, distance), dy / distance * Math.min(speed, distance), 9, false, true);
      }
    }
    game.pets = game.pets.filter((pet) => pet.hp > 0);
    game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
  }

  function updatePetShots(dt) {
    const remaining = [];
    for (const shot of game.petShots) {
      if (shot.type === 'heal') {
        shot.life -= dt;
        if (shot.life > 0) remaining.push(shot);
        continue;
      }
      shot.life -= dt;
      if (shot.life <= 0 || shot.travelled >= shot.range) continue;
      const distance = Math.min(shot.speed * dt, shot.range - shot.travelled);
      shot.x += shot.vx * distance;
      shot.y += shot.vy * distance;
      shot.travelled += distance;
      const hit = game.enemies.find((enemy) => enemy.hp > 0 && Math.hypot(enemy.x - shot.x, enemy.y - shot.y) < (ENEMIES[enemy.kind].boss ? 38 : ENEMIES[enemy.kind].elite ? 27 : 18));
      if (hit) {
        hit.hp -= shot.damage;
        game.effects.push({ type: 'claw', x: hit.x, y: hit.y - 2, angle: shot.angle, life: 0.34, maxLife: 0.34, color: '#fff0dc' });
        addEffect(hit.x, hit.y - 11, '✦', 0.3, '#f4b7ca');
        if (hit.hp <= 0) defeatEnemy(hit);
        continue;
      }
      if (shot.travelled < shot.range && shot.x >= 0 && shot.y >= 0 && shot.x < W && shot.y < H) remaining.push(shot);
    }
    game.petShots = remaining;
    game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
  }

  function autoBoulder() {
    if (!game || game.phase !== 'playing' || !game.boulderUnlocked || game.specialCooldown > 0) return;
    const targets = game.enemies.filter((enemy) => Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y) <= 128);
    if (!targets.length) return;
    for (const enemy of targets) { enemy.hp -= 48 * (1 + game.upgrades.power * 0.08); enemy.slow = Math.max(enemy.slow, 1.5); addEffect(enemy.x, enemy.y, '💥', 0.45, '#ffc36d'); if (enemy.hp <= 0) defeatEnemy(enemy); }
    game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
    game.specialCooldown = 8;
    beep(90, 0.24, 'sawtooth', 0.04);
    popText(`바위 강타! ${targets.length}마리에게 충격!`);
  }

  function addEffect(x, y, text, life = 0.4, color = '#fff0c3') {
    if (!game.effects) game.effects = [];
    game.effects.push({ x, y, text, life, maxLife: life, color });
  }

  function clearWave() {
    if (game.phase !== 'playing') return;
    game.phase = 'shop';
    game.petShots = [];
    game.wavesCleared += 1;
    const reward = 12 + Math.min(20, game.level * 2);
    game.coins += reward;
    game.score += game.level * 350;
    game.barnHp = Math.min(game.barnMax, game.barnHp + 8);
    game.crops.forEach((crop) => { crop.hp = Math.min(crop.maxHp, crop.hp + 8); });
    $('shopTitle').textContent = `제${game.level}레벨 방어 성공!`;
    $('shopSummary').textContent = `침입자 ${game.total}마리를 막고 열매 포인트 ${reward}개를 받았어요. 효린이 체력은 초코우유를 마셔야 회복돼요.`;
    $('rewardText').textContent = reward;
    $('phasePill').textContent = '정비 시간';
    $('missionText').textContent = '방어 성공 · 정비 시간';
    renderShop();
    $('shopModal').hidden = false;
    saveGame(); updateHud();
    beep(780, 0.12, 'triangle', 0.035);
  }

  function upgradeCost(def, level) { return Math.round(def.cost + def.cost * level * 0.65); }

  function renderShop() {
    if (!game) return;
    const cropsHp = game.crops.reduce((sum, crop) => sum + crop.hp, 0);
    const cropsMaxHp = game.crops.reduce((sum, crop) => sum + crop.maxHp, 0);
    $('shopBarnHpText').textContent = `${Math.ceil(game.barnHp)} / ${game.barnMax}`;
    $('shopBarnHpBar').style.width = `${Math.max(0, game.barnHp / game.barnMax * 100)}%`;
    $('shopCropHpText').textContent = `${Math.ceil(cropsHp)} / ${cropsMaxHp} · ${game.crops.filter((crop) => crop.hp > 0).length}/${game.crops.length} 밭 유지`;
    $('shopCropHpBar').style.width = `${cropsMaxHp ? Math.max(0, cropsHp / cropsMaxHp * 100) : 0}%`;
    $('upgradeGrid').innerHTML = UPGRADES.map((def) => {
      const level = game.upgrades[def.key] || 0;
      const cost = upgradeCost(def, level);
      const maxed = level >= 5;
      return `<button class="shop-card" type="button" data-upgrade="${def.key}" ${maxed || game.coins < cost ? 'disabled' : ''}><span class="shop-icon">${def.icon}</span><span class="shop-copy"><b>${def.name}</b><small>${maxed ? '최대 단계 달성!' : def.desc}</small></span><span class="shop-price">${maxed ? 'MAX' : `🍓 ${cost}`}</span><span class="shop-level">Lv.${level}</span></button>`;
    }).join('');
    $('petShopGrid').innerHTML = PET_ORDER.map((type) => {
      const pet = PETS[type], owned = game.pets.some((item) => item.type === type);
      return `<button class="pet-card ${owned ? 'owned' : ''}" type="button" data-pet="${type}" ${owned || game.coins < pet.price ? 'disabled' : ''}><img src="assets/${pet.img}" alt=""><span><b>${pet.name}${owned ? ' · 출동 중' : ''}</b><small>${pet.desc}</small></span><span class="pet-price">${owned ? '완료' : `🍓 ${pet.price}`}</span></button>`;
    }).join('');
    const supplies = [
      { id: 'bb', label: 'BB탄 +50', price: AMMO.bb.cost },
      { id: 'steel', label: '강철탄 +12', price: AMMO.steel.cost },
      { id: 'stone', label: '돌멩이 +5', price: AMMO.stone.cost },
      { id: 'repair', label: '농장 수리', price: 20 },
      { id: 'boulder', label: game.boulderUnlocked ? '바위 강타 해금 완료' : '바위 강타 해금', price: 35 },
    ];
    $('supplyRow').innerHTML = supplies.map((item) => {
      const disabled = (item.id === 'boulder' && game.boulderUnlocked) || game.coins < item.price || (item.id === 'repair' && game.barnHp >= game.barnMax && game.crops.every((crop) => crop.hp >= crop.maxHp));
      let label = item.label;
      if (item.id === 'repair') {
        const barnRestore = Math.max(0, Math.min(24, game.barnMax - game.barnHp));
        const cropRestore = game.crops.reduce((sum, crop) => sum + Math.max(0, Math.min(16, crop.maxHp - crop.hp)), 0);
        label = `농장 +${Math.ceil(barnRestore)} · 밭 +${Math.ceil(cropRestore)}`;
      }
      return `<button class="supply-button" type="button" data-supply="${item.id}" ${disabled ? 'disabled' : ''}><span>${label}</span><b>${item.id === 'boulder' && game.boulderUnlocked ? '완료' : `🍓 ${item.price}`}</b></button>`;
    }).join('');
    $('catCount').textContent = `${game.pets.length} / 3 출동`;
  }

  function openShop(show = true) {
    renderShop();
    $('shopModal').hidden = !show;
    $('phasePill').textContent = '정비 시간';
    if (show) $('nextWaveButton').focus({ preventScroll: true });
  }

  function buyUpgrade(key) {
    const def = UPGRADES.find((item) => item.key === key);
    if (!def) return;
    const level = game.upgrades[key] || 0, cost = upgradeCost(def, level);
    if (level >= 5 || game.coins < cost) return;
    game.coins -= cost; game.upgrades[key] = level + 1;
    if (key === 'vitality') game.maxHp += 20;
    showToast(`${def.name} 강화 완료! · ${level + 1}단계`);
    beep(620, 0.09, 'triangle');
    renderShop(); updateHud(); saveGame();
  }

  function buyPet(type) {
    const def = PETS[type];
    if (!def || game.pets.some((pet) => pet.type === type) || game.coins < def.price) return;
    game.coins -= def.price;
    const offset = type === 'nuni' ? -35 : type === 'yangi' ? 0 : 35;
    game.pets.push({ type, x: game.player.x + offset, y: game.player.y + 25, hp: def.hp, hpMax: def.hp, cooldown: 0.4, healCooldown: 0.6, hitCooldown: 0 });
    showToast(`${def.name} 출동! 농장 수비대에 합류했어요.`);
    beep(800, 0.1, 'triangle'); renderShop(); updateHud(); saveGame();
  }

  function buySupply(id) {
    let price = 0;
    if (id === 'bb' || id === 'steel' || id === 'stone') {
      const def = AMMO[id]; price = def.cost;
      if (game.coins < price) return;
      game.coins -= price; game.ammoCounts[id] += def.refill;
      showToast(`${def.name} ${def.refill}발 보충!`);
      selectAmmo(id);
    } else if (id === 'repair') {
      price = 20;
      if (game.coins < price) return;
      game.coins -= price;
      const barnBefore = game.barnHp;
      game.barnHp = Math.min(game.barnMax, barnBefore + 24);
      const cropBefore = game.crops.reduce((sum, crop) => sum + crop.hp, 0);
      game.crops.forEach((crop) => { crop.hp = Math.min(crop.maxHp, crop.hp + 16); });
      const cropAfter = game.crops.reduce((sum, crop) => sum + crop.hp, 0);
      showToast(`농장 본진 +${Math.ceil(game.barnHp - barnBefore)} (${Math.ceil(game.barnHp)}/${game.barnMax}) · 밭 +${Math.ceil(cropAfter - cropBefore)}`);
    } else if (id === 'boulder') {
      price = 35;
      if (game.coins < price || game.boulderUnlocked) return;
      game.coins -= price; game.boulderUnlocked = true;
      showToast('바위 강타 해금! 적이 가까이 오면 자동 발동해요.');
    }
    beep(570, 0.08, 'triangle'); renderShop(); updateHud(); saveGame();
  }

  function nextWave() {
    if (!game || game.phase !== 'shop') return;
    $('shopModal').hidden = true;
    game.level += 1;
    startWave();
  }

  function pauseGame() {
    if (!game) return;
    if (game.phase === 'playing') {
      game.resumePhase = 'playing'; game.phase = 'paused';
      $('pauseModal').hidden = false; $('resumeButton').focus({ preventScroll: true });
      saveGame(); updateHud();
    } else if (game.phase === 'paused') resumeGame();
  }

  function resumeGame() {
    if (!game || game.phase !== 'paused') return;
    game.phase = game.resumePhase === 'shop' ? 'shop' : 'playing';
    $('pauseModal').hidden = true;
    if (game.phase === 'shop') openShop(true);
    updateHud();
  }

  function returnToTitle() {
    if (game) { game.resumePhase = game.phase === 'shop' ? 'shop' : 'playing'; game.phase = 'paused'; saveGame(); }
    showHome();
  }

  function endGame() {
    if (!game || game.phase === 'gameover') return;
    game.phase = 'gameover';
    const records = readRecords();
    records.push({ score: Math.round(game.score), level: game.level, kills: game.kills, playedAt: Date.now() });
    records.sort((a, b) => b.score - a.score);
    try { localStorage.setItem(RECORD_KEY, JSON.stringify(records.slice(0, 12))); localStorage.removeItem(SAVE_KEY); } catch { /* Keep the result visible even when storage is full. */ }
    $('resultLevel').textContent = `Lv.${game.level}`;
    $('resultScore').textContent = Math.round(game.score).toLocaleString();
    $('resultKills').textContent = game.kills;
    $('gameOverSummary').textContent = `효린이와 고양이 ${game.pets.length}마리가 함께 지켜낸 작전 기록이에요.`;
    $('shopModal').hidden = true; $('pauseModal').hidden = true; $('gameOverModal').hidden = false;
    $('homeScreen').hidden = true; $('gameScreen').hidden = false;
    $('retryButton').focus({ preventScroll: true });
    beep(95, 0.4, 'sawtooth', 0.035);
  }

  function updateGame(dt, now) {
    if (!game || game.phase !== 'playing') return;
    game.waveTime += dt;
    game.player.fireCooldown = Math.max(0, game.player.fireCooldown - dt);
    game.playerInvulnerable = Math.max(0, game.playerInvulnerable - dt);
    game.specialCooldown = Math.max(0, game.specialCooldown - dt);
    const up = keys.has('up') || touchDirs.has('up');
    const down = keys.has('down') || touchDirs.has('down');
    const left = keys.has('left') || touchDirs.has('left');
    const right = keys.has('right') || touchDirs.has('right');
    let dx = Number(right) - Number(left), dy = Number(down) - Number(up);
    const length = Math.hypot(dx, dy);
    if (length) {
      dx /= length; dy /= length;
      setDirectionFromVector(dx, dy);
      const speed = (156 + game.upgrades.speed * 18) * dt;
      moveEntity(game.player, dx * speed, dy * speed, 12, false);
    }
    collectMilkIfNearby();
    const attackHeld = keys.has('attack') || touchFire || mouseFire;
    if (attackHeld && game.player.fireCooldown <= 0) firePlayer();
    if (game.spawned < game.total) {
      game.spawnTimer -= dt;
      if (game.spawnTimer <= 0 && game.enemies.length < 8) {
        spawnEnemy();
        game.spawnTimer = Math.max(0.68, 1.48 - game.level * 0.028);
      }
    }
    updateEnemies(dt);
    autoBoulder();
    updatePets(dt);
    updateBullets(dt);
    for (const effect of game.effects) effect.life -= dt;
    game.effects = game.effects.filter((effect) => effect.life > 0);
    updatePetShots(dt);
    if (game.barnHp <= 0 || game.hp <= 0) { endGame(); return; }
    if (game.spawned >= game.total && game.enemies.length === 0) clearWave();
    if (now - lastSave > 15000) { saveGame(); lastSave = now; }
  }

  function drawGround() {
    const season = SEASONS[((game?.level || 1) - 1) % SEASONS.length];
    ctx.fillStyle = season.ground; ctx.fillRect(0, 0, W, H);
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        ctx.fillStyle = (row + col) % 2 ? season.light : season.dark;
        ctx.globalAlpha = 0.11;
        ctx.fillRect(col * TILE, row * TILE, TILE, TILE);
        ctx.globalAlpha = 1;
        if ((col * 3 + row * 7) % 13 === 0) {
          ctx.fillStyle = '#d6d98a55'; ctx.fillRect(col * TILE + 8, row * TILE + 27, 2, 2); ctx.fillRect(col * TILE + 26, row * TILE + 9, 2, 2);
        }
      }
    }
    drawFarmPlots(season);
  }

  function drawFarmPlots(season) {
    for (const plot of FARM_PLOTS) {
      const x = plot.col * TILE + 2, y = plot.row * TILE + 2;
      const width = plot.cols * TILE - 4, height = plot.rows * TILE - 4;
      ctx.fillStyle = '#54412f'; ctx.fillRect(x, y, width, height);
      ctx.fillStyle = season.plot; ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
      ctx.fillStyle = '#bd9660';
      for (let row = y + 10; row < y + height - 5; row += 13) ctx.fillRect(x + 7, row, width - 14, 2);
      ctx.fillStyle = '#634a34';
      for (let row = y + 14; row < y + height - 3; row += 13) ctx.fillRect(x + 7, row, width - 14, 2);
      ctx.fillStyle = CROP_STYLES[plot.kind].accent;
      ctx.fillRect(x + 2, y + 2, width - 4, 3);
      ctx.fillStyle = '#d9bb82';
      for (let post = x + 8; post < x + width; post += 20) {
        ctx.fillRect(post, y + height - 4, 2, 4);
      }
    }
  }

  function drawTiles() {
    if (!game) return;
    const season = SEASONS[(game.level - 1) % SEASONS.length];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const tile = game.grid[row][col], x = col * TILE, y = row * TILE;
        if (tile.kind === 'b') drawFence(x, y, tile.hp);
        else if (tile.kind === 's') drawSteel(x, y);
        else if (tile.kind === 'w') drawWater(x, y);
        else if (tile.kind === 'g') drawFieldRow(x, y);
      }
    }
    game.crops.forEach((crop) => { if (crop.hp > 0) drawCrop(crop, season); });
    drawBarn();
    drawMilkPickup();
  }

  function drawMilkPickup() {
    if (!game?.milk) return;
    const x = game.milk.x, y = game.milk.y + Math.sin(game.waveTime * 4) * 1.4;
    ctx.save();
    ctx.fillStyle = '#1d281c88'; ctx.beginPath(); ctx.ellipse(x, y + 11, 10, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#492f24';
    ctx.beginPath(); ctx.moveTo(x - 8, y - 9); ctx.lineTo(x - 5, y - 15); ctx.lineTo(x + 4, y - 15); ctx.lineTo(x + 8, y - 9); ctx.lineTo(x + 8, y + 9); ctx.lineTo(x - 8, y + 9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f2e8cf';
    ctx.beginPath(); ctx.moveTo(x - 6, y - 9); ctx.lineTo(x - 4, y - 13); ctx.lineTo(x + 3, y - 13); ctx.lineTo(x + 6, y - 9); ctx.lineTo(x + 6, y + 7); ctx.lineTo(x - 6, y + 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8b573b'; ctx.fillRect(x - 6, y - 1, 12, 8);
    ctx.fillStyle = '#fff2d6'; ctx.fillRect(x - 5, y, 10, 5);
    ctx.fillStyle = '#693c2a'; ctx.font = 'bold 5px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('초코', x, y + 2.5);
    ctx.fillStyle = '#b44b3d'; ctx.fillRect(x + 1, y - 19, 3, 7); ctx.fillStyle = '#f1d5a3'; ctx.fillRect(x + 2, y - 18, 1, 5);
    const glint = 0.55 + Math.sin(game.waveTime * 6) * 0.25;
    ctx.globalAlpha = glint; ctx.fillStyle = '#fff1a9';
    ctx.fillRect(x - 13, y - 7, 2, 2); ctx.fillRect(x + 11, y - 13, 2, 2); ctx.fillRect(x + 10, y + 3, 2, 2);
    ctx.restore();
  }

  function drawFence(x, y, hp) {
    // Breakable map blocks look like farm fencing over the field instead of brick walls.
    ctx.fillStyle = '#463523'; ctx.fillRect(x + 2, y + 10, TILE - 4, 22);
    ctx.fillStyle = '#9b6a3c'; ctx.fillRect(x + 2, y + 9, TILE - 4, 6); ctx.fillRect(x + 2, y + 25, TILE - 4, 6);
    ctx.fillStyle = '#d5a66a'; ctx.fillRect(x + 3, y + 9, TILE - 6, 2); ctx.fillRect(x + 3, y + 25, TILE - 6, 2);
    for (const px of [x + 5, x + 17, x + 29]) {
      ctx.fillStyle = '#603d27'; ctx.fillRect(px, y + 4, 6, 32);
      ctx.fillStyle = '#bd8450'; ctx.fillRect(px + 1, y + 5, 4, 29);
      ctx.fillStyle = '#e2b778'; ctx.fillRect(px + 1, y + 5, 2, 27);
      ctx.fillStyle = '#6a442a'; ctx.fillRect(px + 2, y + 7, 1, 2);
    }
    if (hp < 27) {
      ctx.fillStyle = '#49301f'; ctx.fillRect(x + 17, y + 17, 6, 3);
      ctx.fillRect(x + 21, y + 19, 3, 4);
      ctx.fillStyle = '#d5a66a'; ctx.fillRect(x + 24, y + 19, 4, 2);
    }
  }

  function drawSteel(x, y) {
    ctx.fillStyle = '#596d78'; ctx.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
    ctx.fillStyle = '#9eb5b7'; ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
    ctx.fillStyle = '#6f8a8e'; ctx.fillRect(x + 8, y + 8, TILE - 16, TILE - 16);
    ctx.fillStyle = '#d7e1cb'; ctx.fillRect(x + 7, y + 6, 7, 3); ctx.fillRect(x + 30, y + 6, 4, 3); ctx.fillRect(x + 7, y + 31, 4, 3); ctx.fillRect(x + 30, y + 31, 4, 3);
    ctx.strokeStyle = '#4a6066'; ctx.lineWidth = 2; ctx.strokeRect(x + 6, y + 6, TILE - 12, TILE - 12);
  }

  function drawWater(x, y) {
    ctx.fillStyle = '#427d82'; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = '#5a9b97'; ctx.fillRect(x + 3, y + 5, TILE - 6, 8); ctx.fillRect(x + 7, y + 25, TILE - 13, 7);
    ctx.fillStyle = '#9bc7a0'; ctx.fillRect(x + 8, y + 7, 12, 2); ctx.fillRect(x + 23, y + 27, 9, 2);
    ctx.fillStyle = '#2f666f'; ctx.fillRect(x, y + 17, TILE, 2);
  }

  function drawFieldRow(x, y) {
    // Neat planted rows make these green map tiles read as cultivated beds, not wild forest.
    ctx.fillStyle = '#5d432e'; ctx.fillRect(x + 2, y + 21, 36, 17);
    ctx.fillStyle = '#a77b4d'; ctx.fillRect(x + 4, y + 23, 32, 11);
    ctx.fillStyle = '#6e5035'; ctx.fillRect(x + 4, y + 26, 32, 2); ctx.fillRect(x + 4, y + 32, 32, 2);
    for (let plant = 0; plant < 4; plant += 1) {
      const px = x + 7 + plant * 8;
      ctx.fillStyle = '#426b3d'; ctx.fillRect(px + 2, y + 13, 2, 13);
      ctx.fillStyle = '#76a84c'; ctx.fillRect(px - 1, y + 13, 5, 3); ctx.fillRect(px + 2, y + 10, 5, 3);
      ctx.fillStyle = plant % 2 ? '#d65b47' : '#e2ba4b'; ctx.fillRect(px + 2, y + 17, 4, 4);
      ctx.fillStyle = '#f0d18c'; ctx.fillRect(px + 3, y + 18, 1, 1);
    }
  }

  function drawCrop(crop, season) {
    const x = crop.col * TILE + 2, y = crop.row * TILE + 2;
    const style = CROP_STYLES[crop.kind] || CROP_STYLES.strawberry;
    ctx.fillStyle = '#493628'; ctx.fillRect(x, y, 36, 36);
    ctx.fillStyle = season.plot; ctx.fillRect(x + 2, y + 10, 32, 24);
    ctx.fillStyle = style.accent; ctx.fillRect(x + 2, y + 2, 32, 8);
    ctx.fillStyle = '#fff2d1'; ctx.font = 'bold 6px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(style.label, x + 18, y + 8);
    for (const furrow of [y + 16, y + 24, y + 32]) {
      ctx.fillStyle = '#674931'; ctx.fillRect(x + 3, furrow, 30, 2);
      ctx.fillStyle = '#c59a61'; ctx.fillRect(x + 3, furrow + 2, 30, 1);
    }
    for (let plant = 0; plant < 3; plant += 1) {
      const px = x + 8 + plant * 10;
      ctx.fillStyle = '#426b3e'; ctx.fillRect(px, y + 16, 2, 13);
      ctx.fillStyle = '#7ead50'; ctx.fillRect(px - 3, y + 17, 4, 3); ctx.fillRect(px + 1, y + 14, 5, 3);
      if (crop.kind === 'strawberry') {
        ctx.fillStyle = '#e84f57'; ctx.beginPath(); ctx.moveTo(px - 1, y + 22); ctx.lineTo(px + 2, y + 20); ctx.lineTo(px + 5, y + 22); ctx.lineTo(px + 3, y + 27); ctx.lineTo(px + 1, y + 27); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#f8df9c'; ctx.fillRect(px + 1, y + 23, 1, 1); ctx.fillRect(px + 3, y + 25, 1, 1);
      } else if (crop.kind === 'apple') {
        ctx.fillStyle = '#d9483e'; ctx.beginPath(); ctx.arc(px - 1, y + 23, 3, 0, Math.PI * 2); ctx.arc(px + 5, y + 25, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d9dc74'; ctx.fillRect(px + 1, y + 19, 3, 1);
      } else if (crop.kind === 'grape') {
        ctx.fillStyle = '#7042a1';
        for (const [gx, gy] of [[px + 1, y + 22], [px + 4, y + 22], [px, y + 25], [px + 3, y + 25], [px + 2, y + 28]]) {
          ctx.beginPath(); ctx.arc(gx, gy, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#ccb0e9'; ctx.fillRect(px, y + 22, 1, 1);
      } else {
        ctx.fillStyle = '#e7c443'; ctx.fillRect(px, y + 20, 5, 9);
        ctx.fillStyle = '#f3db70'; ctx.fillRect(px + 1, y + 21, 1, 7); ctx.fillRect(px + 3, y + 21, 1, 7);
        ctx.fillStyle = '#4c8045'; ctx.fillRect(px - 2, y + 22, 3, 7); ctx.fillRect(px + 4, y + 23, 3, 6);
      }
      if (crop.hp < crop.maxHp * 0.45 && plant % 2 === 0) {
        ctx.fillStyle = '#65482f'; ctx.fillRect(px - 1, y + 16, 5, 12);
      }
    }
  }

  function drawBarn() {
    const x = BASE.x - 40, y = BASE.y - 61;
    ctx.fillStyle = '#5f5438'; ctx.beginPath(); ctx.ellipse(BASE.x, BASE.y - 1, 62, 13, 0, 0, Math.PI * 2); ctx.fill();
    // A small round silo sits beside a red, white-trimmed barn.
    ctx.fillStyle = '#718286'; ctx.fillRect(x + 70, y + 23, 18, 35);
    ctx.beginPath(); ctx.ellipse(x + 79, y + 23, 9, 5, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a9b9b0'; ctx.fillRect(x + 73, y + 28, 3, 26); ctx.fillRect(x + 70, y + 39, 18, 2); ctx.fillRect(x + 70, y + 50, 18, 2);
    ctx.fillStyle = '#49352b'; ctx.fillRect(x - 3, y + 25, 80, 36);
    ctx.fillStyle = '#b8493c'; ctx.fillRect(x, y + 22, 74, 37);
    ctx.fillStyle = '#f1e7c8'; ctx.beginPath(); ctx.moveTo(x - 6, y + 24); ctx.lineTo(x + 37, y - 2); ctx.lineTo(x + 80, y + 24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9b3e34'; ctx.beginPath(); ctx.moveTo(x - 2, y + 22); ctx.lineTo(x + 37, y + 1); ctx.lineTo(x + 76, y + 22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e9dfbd'; ctx.fillRect(x + 5, y + 23, 4, 35); ctx.fillRect(x + 65, y + 23, 4, 35); ctx.fillRect(x + 11, y + 24, 3, 34);
    ctx.fillStyle = '#74463a'; ctx.fillRect(x + 25, y + 39, 26, 20);
    ctx.strokeStyle = '#f1e7c8'; ctx.lineWidth = 2; ctx.strokeRect(x + 25, y + 39, 26, 20);
    ctx.beginPath(); ctx.moveTo(x + 27, y + 41); ctx.lineTo(x + 49, y + 57); ctx.moveTo(x + 49, y + 41); ctx.lineTo(x + 27, y + 57); ctx.stroke();
    ctx.fillStyle = '#49352b'; ctx.fillRect(x + 32, y + 26, 11, 8);
    ctx.fillStyle = '#f4e8c3'; ctx.fillRect(x + 31, y + 25, 13, 2); ctx.fillRect(x + 36, y + 25, 2, 10);
    ctx.fillStyle = '#f0d077'; ctx.fillRect(x + 34, y + 13, 8, 7); ctx.fillStyle = '#6c4834'; ctx.font = 'bold 5px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('FARM', x + 38, y + 19);
    // Short white fences frame the farmyard without closing the base entrance.
    ctx.fillStyle = '#eee3c2';
    for (let post = 0; post < 3; post += 1) { ctx.fillRect(x - 19 + post * 8, y + 49, 3, 13); ctx.fillRect(x + 87 + post * 8, y + 49, 3, 13); }
    ctx.fillRect(x - 19, y + 52, 19, 2); ctx.fillRect(x + 87, y + 52, 19, 2);
    if (game.barnHp < game.barnMax * 0.45) {
      ctx.fillStyle = '#33352c'; ctx.fillRect(x + 5, y + 24, 17, 8); ctx.fillRect(x + 54, y + 35, 12, 12);
      ctx.fillStyle = '#ec9157'; ctx.fillRect(x + 11, y + 25, 3, 4); ctx.fillRect(x + 58, y + 37, 4, 4);
    }
  }

  function drawBullets() {
    if (!game) return;
    for (const bullet of game.bullets) {
      ctx.fillStyle = '#223026'; ctx.fillRect(bullet.x - 4, bullet.y - 4, 8, 8);
      ctx.fillStyle = bullet.color; ctx.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
      ctx.fillStyle = '#fff6d9'; ctx.fillRect(bullet.x - 1, bullet.y - 1, 2, 2);
    }
    for (const shot of game.petShots || []) {
      ctx.globalAlpha = Math.max(0, shot.life / shot.maxLife);
      if (shot.type === 'heal') {
        ctx.strokeStyle = shot.color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(shot.x0, shot.y0); ctx.lineTo(shot.x1, shot.y1); ctx.stroke();
        ctx.fillStyle = '#fff3ce'; ctx.fillRect(shot.x1 - 3, shot.y1 - 3, 6, 6);
        ctx.globalAlpha = 1;
        continue;
      }
      ctx.save();
      ctx.translate(shot.x, shot.y); ctx.rotate(shot.angle); ctx.lineWidth = 1.4; ctx.strokeStyle = '#683b4a'; ctx.fillStyle = '#f5a8bf';
      for (const [toeX, toeY, rx, ry] of [[3, -5, 2.1, 2.8], [7, -3, 2.2, 2.8], [7, 3, 2.2, 2.8], [3, 5, 2.1, 2.8]]) {
        ctx.beginPath(); ctx.ellipse(toeX, toeY, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.beginPath(); ctx.ellipse(-2, 0, 5.3, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffe0e8'; ctx.fillRect(-4, -2, 2, 1);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  function drawEffects(dt) {
    if (!game) return;
    for (const effect of game.effects) {
      const alpha = Math.max(0, Math.min(1, effect.life / effect.maxLife));
      const rise = (effect.maxLife - effect.life) * 18;
      if (effect.type === 'claw') {
        ctx.save(); ctx.globalAlpha = alpha; ctx.translate(effect.x, effect.y - rise); ctx.rotate(effect.angle + Math.PI / 4);
        ctx.lineCap = 'round'; ctx.strokeStyle = '#873f50'; ctx.lineWidth = 4;
        for (let slash = -1; slash <= 1; slash += 1) { ctx.beginPath(); ctx.moveTo(slash * 5 - 1, -7); ctx.lineTo(slash * 5 + 1, 7); ctx.stroke(); }
        ctx.strokeStyle = effect.color; ctx.lineWidth = 2;
        for (let slash = -1; slash <= 1; slash += 1) { ctx.beginPath(); ctx.moveTo(slash * 5 - 1, -7); ctx.lineTo(slash * 5 + 1, 7); ctx.stroke(); }
        ctx.restore();
        continue;
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = effect.color;
      ctx.font = 'bold 15px monospace'; ctx.textAlign = 'center';
      ctx.fillText(effect.text, effect.x, effect.y - rise);
      ctx.globalAlpha = 1;
    }
  }

  function ensurePlayerNode() {
    if (playerNode) return;
    playerNode = document.createElement('div');
    playerNode.className = 'unit unit-player';
    const sprite = document.createElement('div'); sprite.className = 'player-sprite';
    const slingshot = document.createElement('span'); slingshot.className = 'player-slingshot'; slingshot.setAttribute('aria-hidden', 'true');
    slingshot.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path class="sling-band" d="M8 4L16 4"/><path class="sling-wood" d="M12 22L12 9M12 9L7 3M12 9L17 3"/></svg>';
    playerNode.append(sprite, slingshot); playerNode._sprite = sprite; playerNode._slingshot = slingshot; unitsLayer.append(playerNode);
  }

  function getUnitNode(key, className, imagePath) {
    if (unitNodes.has(key)) return unitNodes.get(key);
    const node = document.createElement('div'); node.className = `unit ${className}`;
    if (className.includes('enemy')) {
      const hp = document.createElement('span'); hp.className = 'unit-hp'; const fill = document.createElement('i'); hp.append(fill); node.append(hp); node._hpFill = fill;
    }
    const img = document.createElement('img'); img.src = `assets/${imagePath}`; img.alt = '';
    node.append(img); unitsLayer.append(node);
    const item = { node, img };
    unitNodes.set(key, item);
    return item;
  }

  function positionUnit(node, x, y, width, height, dir = 'down') {
    node.style.left = `${x / W * 100}%`;
    node.style.top = `${y / H * 100}%`;
    node.style.width = `${width}px`; node.style.height = `${height}px`;
    node.style.transform = `translate(-50%,-50%) rotate(${rotationFor(dir)}deg)`;
  }

  function resizeActors() {
    const scale = (canvas.clientWidth || W) / W;
    unitsLayer.style.width = '100%'; unitsLayer.style.height = '100%';
    if (game && playerNode) positionUnit(playerNode, game.player.x, game.player.y, 52 * scale, 55 * scale, 'down');
  }

  function drawUnits() {
    if (!game || $('gameScreen').hidden) return;
    ensurePlayerNode();
    const scale = (canvas.clientWidth || W) / W;
    const playerSizes = { 1: [34, 36], 2: [40, 42.5], 3: [46, 49], 4: [52, 55] };
    const growthStage = growthStageForHealth(game.hp, game.maxHp);
    const [playerWidth, playerHeight] = playerSizes[growthStage];
    positionUnit(playerNode, game.player.x, game.player.y, playerWidth * scale, playerHeight * scale, 'down');
    playerNode._sprite.style.transform = game.player.dir === 'left' ? 'scaleX(-1)' : 'none';
    const slingAim = { up: 0, right: 90, down: 180, left: 270 }[game.player.dir] || 0;
    const aim = directionVector(game.player.dir);
    const slingDistance = playerSlingDistance() * scale;
    playerNode._slingshot.style.setProperty('--sling-rotation', `${slingAim}deg`);
    playerNode._slingshot.style.setProperty('--sling-x', `${aim.x * slingDistance}px`);
    playerNode._slingshot.style.setProperty('--sling-y', `${aim.y * slingDistance}px`);
    playerNode._slingshot.style.setProperty('--sling-size', `${18 * scale}px`);
    playerNode.style.opacity = '1';
    playerNode.classList.toggle('is-hit', game.playerInvulnerable > 0);
    const active = new Set();
    if (playerNode.dataset.stage !== String(growthStage)) {
      playerNode.dataset.stage = String(growthStage);
      playerNode._sprite.style.backgroundImage = `url("assets/stage-${growthStage}-idle.png")`;
    }
    for (const enemy of game.enemies) {
      const info = ENEMIES[enemy.kind], key = `enemy-${enemy.id}`;
      active.add(key);
      const item = getUnitNode(key, `unit-enemy${info.boss ? ' unit-boss' : info.elite ? ' unit-elite' : ''}`, info.img);
      const sizeScale = info.visualScale || 1;
      const enemySize = info.boss ? [74, 68] : info.elite ? [54, 50] : [35 * sizeScale, 38 * sizeScale];
      positionUnit(item.node, enemy.x, enemy.y, enemySize[0] * scale, enemySize[1] * scale, enemy.dir);
      if (item.node._hpFill) item.node._hpFill.style.width = `${Math.max(0, enemy.hp / enemy.maxHp * 100)}%`;
      item.node.style.opacity = enemy.kind === 'mole' && enemy.burrow > 0 ? '0.4' : '1';
    }
    for (const pet of game.pets) {
      const key = `pet-${pet.type}`; active.add(key);
      const item = getUnitNode(key, 'unit-pet', PETS[pet.type].img);
      positionUnit(item.node, pet.x, pet.y, 39 * scale, 31 * scale, pet.dir || 'down');
      if (!item.node._hpFill) {
        const hp = document.createElement('span'); hp.className = 'unit-hp pet-hp'; const fill = document.createElement('i'); hp.append(fill); item.node.append(hp); item.node._hpFill = fill;
      }
      item.node._hpFill.style.width = `${Math.max(0, pet.hp / pet.hpMax * 100)}%`;
    }
    for (const [key, item] of unitNodes) if (!active.has(key)) { item.node.remove(); unitNodes.delete(key); }
  }

  function updateHud() {
    if (!game) return;
    const pctHp = Math.max(0, game.hp / game.maxHp * 100), pctBarn = Math.max(0, game.barnHp / game.barnMax * 100), pctXp = Math.max(0, game.xp / game.xpNext * 100);
    $('playerHpBar').style.width = `${pctHp}%`; $('barnHpBar').style.width = `${pctBarn}%`; $('xpBar').style.width = `${pctXp}%`;
    $('playerHpText').textContent = `${Math.ceil(game.hp)} / ${game.maxHp}`; $('barnHpText').textContent = `${Math.ceil(game.barnHp)} / ${game.barnMax}`;
    const growthStage = growthStageForHealth(game.hp, game.maxHp);
    $('growthStageText').textContent = GROWTH_NAMES[growthStage];
    $('growthMeter').dataset.stage = String(growthStage);
    $('rankText').textContent = game.rank; $('xpText').textContent = `${Math.floor(game.xp)} / ${game.xpNext} XP`;
    $('levelText').textContent = game.level; $('scoreText').textContent = Math.round(game.score).toString().padStart(5, '0');
    $('coinText').textContent = game.coins; $('killsText').textContent = game.kills;
    $('ammoBb').textContent = `${game.ammoCounts.bb}발`; $('ammoSteel').textContent = `${game.ammoCounts.steel}발`; $('ammoStone').textContent = `${game.ammoCounts.stone}발`;
    $('cropCount').textContent = `${game.crops.filter((crop) => crop.hp > 0).length} / ${game.crops.length}`;
    $('enemiesLeft').textContent = Math.max(0, game.total - game.spawned) + game.enemies.length;
    const special = game.boulderUnlocked;
    $('specialButton').disabled = true;
    $('touchSpecial').disabled = true;
    $('specialText').textContent = !special ? '정비 시간에 해금' : game.specialCooldown > 0 ? `${game.specialCooldown.toFixed(1)}초 후 자동 발동` : game.phase !== 'playing' ? '전투 중 적 접근 시 자동 발동' : '적 접근 시 자동 발동';
    $('touchSpecialText').textContent = special ? '자동' : '해금';
    document.querySelectorAll('.ammo-option').forEach((button) => button.classList.toggle('selected', button.dataset.ammo === game.ammo));
    $('catCount').textContent = `${game.pets.length} / 3 출동`;
    const squad = $('squadList');
    if (squad.dataset.ready !== 'yes') {
      squad.innerHTML = PET_ORDER.map((type) => `<div class="squad-member" data-squad="${type}"><img src="assets/${PETS[type].img}" alt=""><span class="squad-copy"><b>${PETS[type].name}</b><small>${PETS[type].desc}</small><span class="squad-health"><i></i></span></span><span class="squad-state">대기</span></div>`).join('');
      squad.dataset.ready = 'yes';
    }
    PET_ORDER.forEach((type) => {
      const row = squad.querySelector(`[data-squad="${type}"]`), pet = game.pets.find((item) => item.type === type), owned = Boolean(pet);
      row.classList.toggle('off', !owned);
      row.querySelector('.squad-state').textContent = owned ? `${Math.ceil(pet.hp)}/${pet.hpMax}` : '대기';
      row.querySelector('.squad-health').hidden = !owned;
      if (owned) row.querySelector('.squad-health i').style.width = `${Math.max(0, pet.hp / pet.hpMax * 100)}%`;
    });
  }

  function render(now, dt = 0) {
    ctx.imageSmoothingEnabled = false;
    drawGround();
    if (game) { drawTiles(); drawBullets(); drawEffects(dt); drawUnits(); updateHud(); }
    else { unitsLayer.replaceChildren(); }
  }

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - (lastFrame || now)) / 1000));
    lastFrame = now;
    if (game && !$('gameScreen').hidden) updateGame(dt, now);
    render(now, dt);
    requestAnimationFrame(frame);
  }

  function setAimFromPointer(event) {
    if (!game || !stageFrame) return;
    const rect = stageFrame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * W;
    const y = (event.clientY - rect.top) / rect.height * H;
    setDirectionFromVector(x - game.player.x, y - game.player.y);
  }

  function bindControls() {
    $('startNew').addEventListener('click', beginNewGame);
    $('continueGame').addEventListener('click', continueGame);
    $('soundToggle').addEventListener('click', () => { soundOn = !soundOn; setSetting('sound', soundOn); updateHome(); if (soundOn) beep(620, 0.07); });
    $('pauseButton').addEventListener('click', pauseGame);
    $('resumeButton').addEventListener('click', resumeGame);
    $('toTitleButton').addEventListener('click', returnToTitle);
    $('nextWaveButton').addEventListener('click', nextWave);
    $('retryButton').addEventListener('click', beginNewGame);
    $('homeButton').addEventListener('click', showHome);
    $('fullscreenButton').addEventListener('click', async () => {
      try { if (!document.fullscreenElement) await $('gameScreen').requestFullscreen(); else await document.exitFullscreen(); }
      catch { showToast('전체 화면은 브라우저에서 사용할 수 없어요.'); }
    });
    document.querySelectorAll('.ammo-option').forEach((button) => button.addEventListener('click', () => selectAmmo(button.dataset.ammo)));
    $('upgradeGrid').addEventListener('click', (event) => { const button = event.target.closest('[data-upgrade]'); if (button) buyUpgrade(button.dataset.upgrade); });
    $('petShopGrid').addEventListener('click', (event) => { const button = event.target.closest('[data-pet]'); if (button) buyPet(button.dataset.pet); });
    $('supplyRow').addEventListener('click', (event) => { const button = event.target.closest('[data-supply]'); if (button) buySupply(button.dataset.supply); });

    const keyMap = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') { if (game?.phase === 'playing' || game?.phase === 'paused') { event.preventDefault(); pauseGame(); } return; }
      if (event.code === 'Space') { event.preventDefault(); keys.add('attack'); }
      if (keyMap[event.code]) { event.preventDefault(); keys.add(keyMap[event.code]); }
      if (event.code === 'Digit1') selectAmmo('bb');
      if (event.code === 'Digit2') selectAmmo('steel');
      if (event.code === 'Digit3') selectAmmo('stone');
    });
    window.addEventListener('keyup', (event) => {
      if (event.code === 'Space') keys.delete('attack');
      if (keyMap[event.code]) keys.delete(keyMap[event.code]);
    });
    window.addEventListener('blur', () => { keys.clear(); touchDirs.clear(); touchFire = false; mouseFire = false; });

    document.querySelectorAll('.dpad button').forEach((button) => {
      const dir = button.dataset.dir;
      button.addEventListener('pointerdown', (event) => { event.preventDefault(); touchDirs.add(dir); button.setPointerCapture(event.pointerId); });
      const release = () => touchDirs.delete(dir);
      button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
    });
    $('touchFire').addEventListener('pointerdown', (event) => { event.preventDefault(); touchFire = true; $('touchFire').setPointerCapture(event.pointerId); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => $('touchFire').addEventListener(type, () => { touchFire = false; }));
    stageFrame.addEventListener('pointerdown', (event) => {
      if (!game || game.phase !== 'playing' || event.pointerType === 'touch') return;
      setAimFromPointer(event); mouseFire = true; stageFrame.setPointerCapture(event.pointerId);
    });
    stageFrame.addEventListener('pointermove', (event) => { if (mouseFire) setAimFromPointer(event); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => stageFrame.addEventListener(type, () => { mouseFire = false; }));
    window.addEventListener('resize', resizeActors);
  }

  bindControls();
  updateHome();
  requestAnimationFrame(frame);
})();
