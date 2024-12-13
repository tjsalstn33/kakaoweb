class GameObject {
	constructor(x, y, type, width, height, imgPath) {
	  this.x = x;
	  this.y = y;
	  this.dead = false;
	  this.type = type;
	  this.width = width;
	  this.height = height;
	  this.img = undefined;
	}
  
	draw(ctx) {
	  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}
  
	rectFromGameObject() {
	  return {
		top: this.y,
		left: this.x,
		bottom: this.y + this.height,
		right: this.x + this.width,
	  };
	}
}

class Hero extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.width = 99;
	  this.height = 75;
	  this.type = "Hero";
	  this.speed = { x: 0, y: 0 };
	  this.cooldown = 0;
	  this.life = 3;
	  this.points = 0;
	  this.shield = 0; 
	}
  
	fire() {
	  gameObjects.push(new Laser(this.x + 45, this.y - 10));
	  this.cooldown = 500;
  
	  let id = setInterval(() => {
		if (this.cooldown > 0) {
		  this.cooldown -= 100;
		} else {
		  clearInterval(id);
		}
	  }, 200);
	}
  
	canFire() {
	  return this.cooldown === 0;
	}
  
	decrementLife() {
	  if (this.shield > 0) {
		this.shield--;
		return;
	  }
  
	  this.life--;
	  if (this.life === 0) {
		this.dead = true;
	  }
	}
  
	incrementPoints(value = 100) {
	  this.points += value;
	}
  
	fireChargedShot() {
	  gameObjects.push(new ChargedLaser(this.x + 45, this.y - 10));
	  this.cooldown = 1000;
	}
}

// 서브독 클래스: 히어로 양옆에 위치하며 자동으로 일정 간격으로 레이저 발사
class Subdog extends GameObject {
	constructor(x, y, offsetX) {
	  super(x, y, "Subdog", 50, 50);
	  this.offsetX = offsetX; 
	  this.fireInterval = null;
	  this.startFiring();
	}

	startFiring() {
	  // 1초마다 자동 발사
	  this.fireInterval = setInterval(() => {
		if (!this.dead) {
		  // 서브독 레이저: 히어로 레이저와 동일한 형태
		  gameObjects.push(new Laser(this.x + this.width / 2 - 4, this.y - 10));
		} else {
		  clearInterval(this.fireInterval);
		}
	  }, 100);
	}
}

class Enemy extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.width = 98;
	  this.height = 50;
	  this.type = "Enemy";
	  let id = setInterval(() => {
		if (this.y < canvas.height - this.height) {
		  this.y += 5;
		} else {
		  clearInterval(id);
		}
	  }, 300);
	}
}

class Boss extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.type = "Boss";
	  this.width = 200;
	  this.height = 100;
	  this.hp = 50;
	  this.img = bossImg; 
	  this.moveDirection = 1;
	  this.attackCooldown = 2000;
	  this.startAttackPattern();
	}
  
	startAttackPattern() {
	  let moveId = setInterval(() => {
		if (this.dead) {
		  clearInterval(moveId);
		  return;
		}
		this.x += this.moveDirection * 10;
		if (this.x < 0 || this.x + this.width > canvas.width) {
		  this.moveDirection *= -1;
		}
	  }, 300);
  
	  let attackId = setInterval(() => {
		if (this.dead) {
		  clearInterval(attackId);
		  return;
		}
		gameObjects.push(new BossLaser(this.x + this.width / 2, this.y + this.height));
	  }, this.attackCooldown);
	}
  
	hitByLaser() {
	  this.hp -= 1;
	  if (this.hp <= 0) {
		this.dead = true;
	  }
	}
}

class Laser extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.width = 9;
	  this.height = 33;
	  this.type = 'Laser';
	  this.img = laserImg;
	  let id = setInterval(() => {
		if (this.y > 0) {
		  this.y -= 15;
		} else {
		  this.dead = true;
		  clearInterval(id);
		}
	  }, 100);
	}
}

class BossLaser extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.type = 'BossLaser';
	  this.width = 20;
	  this.height = 40;
	  this.img = bossLaserImg;
	  let id = setInterval(() => {
		if (this.dead) {
		  clearInterval(id);
		  return;
		}
		this.y += 10;
		if (this.y > canvas.height) {
		  this.dead = true;
		  clearInterval(id);
		}
	  }, 100);
	}
}

class ShieldItem extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.type = 'ShieldItem';
	  this.width = 30;
	  this.height = 30;
	  this.img = shieldImg;
	  let id = setInterval(() => {
		if (this.dead) {
		  clearInterval(id);
		  return;
		}
		this.y += 5;
		if (this.y > canvas.height) {
		  this.dead = true;
		  clearInterval(id);
		}
	  }, 100);
	}
}

class ChargedLaser extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.type = 'ChargedLaser';
	  this.width = 30;
	  this.height = 60;
	  this.img = chargedLaserImg;
	  let id = setInterval(() => {
		if (this.dead) {
		  clearInterval(id);
		  return;
		}
		this.y -= 20;
		if (this.y < 0) {
		  this.dead = true;
		  clearInterval(id);
		}
	  }, 100);
	}
}

class Meteor extends GameObject {
	constructor(x, y) {
	  super(x, y);
	  this.type = 'Meteor';
	  this.width = 100;
	  this.height = 100;
	  this.img = meteorImg;
	  let id = setInterval(() => {
		if (this.dead) {
		  clearInterval(id);
		  return;
		}
		this.y += 30;
		if (this.y > canvas.height) {
		  this.dead = true;
		  // 메테오가 화면 하단 도달 시 적, 보스 제거
		  gameObjects.forEach(o => {
			if (o.type === 'Enemy' || o.type === 'Boss') {
			  o.dead = true;
			}
		  });
		  clearInterval(id);
		}
	  }, 100);
	}
}

class EventEmitter {
	constructor() {
	  this.listeners = {};
	}
  
	on(message, listener) {
	  if (!this.listeners[message]) {
		this.listeners[message] = [];
	  }
	  this.listeners[message].push(listener);
	}
  
	emit(message, payload = null) {
	  if (this.listeners[message]) {
		this.listeners[message].forEach((l) => l(message, payload));
	  }
	}
	clear() {
	  this.listeners = {};
	}
}

const Messages = {
	KEY_EVENT_UP: 'KEY_EVENT_UP',
	KEY_EVENT_DOWN: 'KEY_EVENT_DOWN',
	KEY_EVENT_LEFT: 'KEY_EVENT_LEFT',
	KEY_EVENT_RIGHT: 'KEY_EVENT_RIGHT',
	KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
	COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
	COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
	COLLISION_BOSS_LASER_HERO: "COLLISION_BOSS_LASER_HERO",
	COLLISION_CHARGED_BOSS: "COLLISION_CHARGED_BOSS",
	GAME_END_LOSS: "GAME_END_LOSS",
	GAME_END_WIN: "GAME_END_WIN",
	KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
	HERO_MOVE_LEFT: "HERO_MOVE_LEFT",
};

let heroImg,
	enemyImg,
	laserImg,
	lifeImg,
	bossImg,
	bossLaserImg,
	shieldImg,
	chargedLaserImg,
	meteorImg,
	canvas, ctx,
	gameObjects = [],
	hero,
	eventEmitter = new EventEmitter(),
	gameLoopId;

let currentStage = 1;
let chargeTime = 0;
let isCharging = false;
let meteorAvailable = 0;
let subdogs = []; 

// 히어로 이동 상태: 키를 누르고 있는 동안 이동
let heroMovement = {
	up: false,
	down: false,
	left: false,
	right: false
};

function loadAsset(path) {
  return new Promise((resolve) => {
	const img = new Image();
	img.src = path;
	img.onload = () => resolve(img);
  });
}

async function loadAssets() {
	heroImg = await loadAsset('assets/dog_player.png');
	enemyImg = await loadAsset('assets/cat_enemy.png');
	laserImg = await loadAsset('assets/chur_laser.png');
	lifeImg = await loadAsset('assets/life.png');
	bossImg = await loadAsset('assets/bigcat_boss.png');
	bossLaserImg = await loadAsset('assets/chur_boss.png');
	shieldImg = await loadAsset('assets/shield.png');
	chargedLaserImg = await loadAsset('assets/chur_charged.png');
	meteorImg = await loadAsset('assets/meteor.png');
}

function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function endGame(win) {
  clearInterval(gameLoopId);
  setTimeout(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if (win) {
	  displayMessage("Victory!!! - Press [Enter] to restart", "green");
	} else {
	  displayMessage("You died !!! Press [Enter] to restart");
	}
  }, 200);
}

function resetGame() {
  if (gameLoopId) {
	clearInterval(gameLoopId);
	eventEmitter.clear();
	currentStage = 1;
	meteorAvailable = 0;
	initGame();
	gameLoopId = setInterval(gameLoop, 100);
  }
}

function setupCanvas() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
}

function isHeroDead() {
  return hero.life <= 0;
}

function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => (go.type === "Enemy" || go.type === "Boss") && !go.dead);
  return enemies.length === 0;
}

function createHero() {
  hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
  hero.img = heroImg;
  gameObjects.push(hero);

  // 서브독 생성 (왼쪽, 오른쪽)
  let leftSubdog = new Subdog(hero.x - 60, hero.y, -60);
  leftSubdog.img = heroImg; // 서브독에 별도 이미지 사용 가능
  let rightSubdog = new Subdog(hero.x + hero.width + 10, hero.y, hero.width + 10);
  rightSubdog.img = heroImg;
  subdogs = [leftSubdog, rightSubdog];
  gameObjects.push(...subdogs);
}

function createBasicEnemies() {
  const MONSTER_TOTAL = 10;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = Math.random() * (canvas.width - MONSTER_WIDTH);
  for (let i = 0; i < MONSTER_TOTAL; i++) {
	const enemy = new Enemy(
	  START_X + i * 98,
	  Math.random() * (canvas.height / 4)
	);
	enemy.img = enemyImg;
	gameObjects.push(enemy);

	if (Math.random() < 0.1) {
	  let item = new ShieldItem(START_X + i * 98, 0);
	  item.img = shieldImg;
	  gameObjects.push(item);
	}
  }
}

function createFastEnemies() {
  const MONSTER_TOTAL = 12;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = Math.random() * (canvas.width - MONSTER_WIDTH);
  for (let i = 0; i < MONSTER_TOTAL; i++) {
	const enemy = new Enemy(
	  START_X + i * 98,
	  Math.random() * (canvas.height / 4)
	);
	enemy.img = enemyImg;
	let originalInterval = 300;
	let id = setInterval(() => {
	  if (enemy.dead) {
		clearInterval(id);
		return;
	  }
	  if (enemy.y < canvas.height - enemy.height) {
		enemy.y += 10; 
	  } else {
		clearInterval(id);
	  }
	}, originalInterval / 2);

	gameObjects.push(enemy);

	if (Math.random() < 0.15) {
	  let item = new ShieldItem(START_X + i * 98, 0);
	  item.img = shieldImg;
	  gameObjects.push(item);
	}
  }
}

function createBoss() {
  let boss = new Boss(canvas.width / 2 - 100, 50);
  boss.img = bossImg;
  gameObjects.push(boss);

  if (Math.random() < 0.05) {
	let item = new ShieldItem(canvas.width / 2, 0);
	item.img = shieldImg;
	gameObjects.push(item);
  }
}

function startStage(stageNumber) {
  // 히어로와 서브독 제외하고 나머지 제거
  let heroAndSubs = gameObjects.filter(o => o.type === 'Hero' || o.type === 'Subdog');
  gameObjects = [...heroAndSubs];

  if (stageNumber === 1) {
	createBasicEnemies();
  } else if (stageNumber === 2) {
	createFastEnemies();
  } else if (stageNumber === 3) {
	createBoss();
  }
}

function checkStageClear() {
  if (isEnemiesDead()) {
	currentStage++;
	if (currentStage > 3) {
	  eventEmitter.emit(Messages.GAME_END_WIN);
	} else {
	  startStage(currentStage);
	}
  }
}

function applyHeroMovement() {
  if (heroMovement.up) hero.y -= 20;
  if (heroMovement.down) hero.y += 20;
  if (heroMovement.left) hero.x -= 50;
  if (heroMovement.right) hero.x += 50;

  // 맵 이탈 방지
  if (hero.x < 0) hero.x = 0;
  if (hero.x + hero.width > canvas.width) hero.x = canvas.width - hero.width;
  if (hero.y < 0) hero.y = 0;
  if (hero.y + hero.height > canvas.height) hero.y = canvas.height - hero.height;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 히어로 이동 적용
  applyHeroMovement();

  // 서브독 위치 갱신
  subdogs.forEach((sd) => {
	sd.x = hero.x + sd.offsetX;
	sd.y = hero.y;
  });

  drawPoints();
  drawLife();
  drawShieldGauge();
  drawMeteorGauge();
  updateGameObjects();
  drawGameObjects(ctx);

  if (isHeroDead()) {
	eventEmitter.emit(Messages.GAME_END_LOSS);
  }

  checkStageClear();

  if (isHeroDead()) {
	clearInterval(gameLoopId);
  }
}

function setupEventListeners() {
  window.addEventListener('keydown', (evt) => {
	switch (evt.key) {
	  case 'ArrowUp':
		heroMovement.up = true;
		break;
	  case 'ArrowDown':
		heroMovement.down = true;
		break;
	  case 'ArrowLeft':
		heroMovement.left = true;
		break;
	  case 'ArrowRight':
		heroMovement.right = true;
		break;
	  case ' ':
		// 스페이스 눌렀을 때 차지 시작
		if (hero.canFire() && !isCharging) {
		  isCharging = true;
		  chargeTime = Date.now();
		}
		break;
	  case 'm':
	  case 'M':
		tryUseMeteor();
		break;
	  case 'Enter':
		eventEmitter.emit(Messages.KEY_EVENT_ENTER);
		break;
	}
  });

  window.addEventListener('keyup', (evt) => {
	switch (evt.key) {
	  case 'ArrowUp':
		heroMovement.up = false;
		break;
	  case 'ArrowDown':
		heroMovement.down = false;
		break;
	  case 'ArrowLeft':
		heroMovement.left = false;
		break;
	  case 'ArrowRight':
		heroMovement.right = false;
		break;
	  case ' ':
		if (isCharging) {
		  let elapsed = Date.now() - chargeTime;
		  if (elapsed > 1000) {
			hero.fireChargedShot();
		  } else {
			hero.fire();
		  }
		  isCharging = false;
		}
		break;
	}
  });
}

function initGame() {
  eventEmitter.clear();
  currentStage = 1;
  meteorAvailable = 1; 
  createHero();
  startStage(currentStage);

  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
	first.dead = true;
	second.dead = true;
	hero.incrementPoints(100);
	if (hero.points % 500 === 0) {
	  meteorAvailable++;
	}
  });

  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
	enemy.dead = true;
	hero.decrementLife();
	if (isHeroDead()) {
	  eventEmitter.emit(Messages.GAME_END_LOSS);
	}
  });

  eventEmitter.on(Messages.COLLISION_BOSS_LASER_HERO, (_, { laser }) => {
	laser.dead = true;
	hero.decrementLife();
	if (isHeroDead()) {
	  eventEmitter.emit(Messages.GAME_END_LOSS);
	}
  });

  eventEmitter.on(Messages.COLLISION_CHARGED_BOSS, (_, { boss, laser }) => {
	laser.dead = true;
	boss.hitByLaser();
	hero.incrementPoints(200);
  });

  eventEmitter.on(Messages.GAME_END_WIN, () => {
	endGame(true);
  });

  eventEmitter.on(Messages.GAME_END_LOSS, () => {
	endGame(false);
  });

  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
	resetGame();
  });
}

function drawGameObjects() {
  gameObjects.forEach((go) => go.draw(ctx));
}

function drawLife() {
  const START_POS = canvas.width - 180;
  for (let i = 0; i < hero.life; i++) {
	ctx.drawImage(lifeImg, START_POS + (45 * (i + 1)), canvas.height - 37);
  }
}

function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height - 20);
}

function drawShieldGauge() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText("Shield: " + hero.shield, 10, canvas.height - 50);
}

function drawMeteorGauge() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "orange";
  ctx.fillText("Meteor: " + meteorAvailable, 120, canvas.height - 50);
}

function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

function updateGameObjects() {
  const enemies = gameObjects.filter((go) => go.type === 'Enemy' || go.type === 'Boss');
  const lasers = gameObjects.filter((go) => go.type === 'Laser' || go.type === 'ChargedLaser');
  const bossLasers = gameObjects.filter((go) => go.type === 'BossLaser');

  enemies.forEach((enemy) => {
	const heroRect = hero.rectFromGameObject();
	if (intersectRect(heroRect, enemy.rectFromGameObject())) {
	  eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
	}
  });

  lasers.forEach((l) => {
	enemies.forEach((m) => {
	  if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
		if (m.type === 'Boss') {
		  if (l.type === 'ChargedLaser') {
			eventEmitter.emit(Messages.COLLISION_CHARGED_BOSS, { boss: m, laser: l });
		  } else {
			m.hitByLaser();
			l.dead = true;
			hero.incrementPoints(100);
		  }
		} else {
		  eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
			first: l,
			second: m,
		  });
		}
	  }
	});
  });

  bossLasers.forEach((bl) => {
	if (intersectRect(bl.rectFromGameObject(), hero.rectFromGameObject())) {
	  eventEmitter.emit(Messages.COLLISION_BOSS_LASER_HERO, { laser: bl });
	}
  });

  checkItemCollection();
  gameObjects = gameObjects.filter((go) => !go.dead);
}

function checkItemCollection() {
  let shieldItems = gameObjects.filter(o => o.type === 'ShieldItem');
  shieldItems.forEach(item => {
	if (intersectRect(hero.rectFromGameObject(), item.rectFromGameObject())) {
	  item.dead = true;
	  hero.shield = Math.min(hero.shield + 1, 3);
	}
  });
}

function intersectRect(r1, r2) {
  return !(
	r2.left > r1.right ||
	r2.right < r1.left ||
	r2.top > r1.bottom ||
	r2.bottom < r1.top
  );
}

function tryUseMeteor() {
  if (meteorAvailable > 0) {
	meteorAvailable--;
	castMeteor();
  }
}

function castMeteor() {
  let meteor = new Meteor(canvas.width / 2 - 50, -100);
  meteor.img = meteorImg;
  gameObjects.push(meteor);
}

async function run() {
  await loadAssets();
  setupCanvas();
  initGame();
  setupEventListeners();
  gameLoopId = setInterval(gameLoop, 100);
}

window.onload = run;
