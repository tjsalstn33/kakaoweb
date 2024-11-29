// Utility Functions
function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    });
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
}
// Constants and Global Variables
const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
};
let heroImg, enemyImg, laserImg, canvas, ctx, gameObjects = [], hero, eventEmitter = new EventEmitter();

// Classes
class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false; // 객체가 파괴되었는지 여부
        this.type = ""; // 객체 타입 (영웅/적)
        this.width = 0; // 객체의 폭
        this.height = 0; // 객체의 높이
        this.img = undefined; // 객체의 이미지
    }
    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        };
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 캔버스에 이미지 그리기
    }
}
function intersectRect(r1,r2) {
    return !(
        r2.left > r1.right ||
        r2.righth < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = "Hero";
        this.cooldown = 0; // 쿨다운 초기화
        this.sideHeroes = [
            new SideHero(this.x - 50, this.y + 20), // 왼쪽 보조 Hero
            new SideHero(this.x + this.width + 10, this.y + 20), // 오른쪽 보조 Hero
        ];
    }

    updateSideHeroes() {
        // 메인 Hero의 위치를 기준으로 보조 Hero 위치 업데이트
        this.sideHeroes[0].x = this.x - 50;
        this.sideHeroes[0].y = this.y + 20;
        this.sideHeroes[1].x = this.x + this.width + 10;
        this.sideHeroes[1].y = this.y + 20;
    }

    destroy() {
        this.sideHeroes.forEach((sideHero) => sideHero.destroy()); // 보조 Hero 제거
        this.dead = true;
    }

    fire() {
        if (this.canFire()) {
            gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 메인 Hero 레이저 발사
            this.cooldown = 500;
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id);
                }
            }, 100);
        }
    }

    canFire() {
        return this.cooldown === 0; // 쿨다운 상태 확인
    }

    draw(ctx) {
        super.draw(ctx); // 메인 Hero 그리기
        this.sideHeroes.forEach((sideHero) => sideHero.draw(ctx)); // 보조 Hero 그리기
    }
}

class SideHero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 50; // 보조 Hero 크기
        this.height = 40;
        this.type = "SideHero";
        this.img = heroImg; // 메인 Hero와 동일한 이미지 사용

        // 0.1초 간격으로 레이저 자동 발사
        this.laserInterval = setInterval(() => {
            if (!this.dead) { // 보조 Hero가 제거되지 않은 경우
                gameObjects.push(new Laser(this.x + this.width / 2, this.y - 10));
            }
        }, 100);
    }

    destroy() {
        clearInterval(this.laserInterval); // 보조 Hero 제거 시 발사 중단
        this.dead = true;
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
                this.y += 15;
            } else {
                console.log('Stopped at', this.y);
                clearInterval(id);
            }
        }, 300);
    }
}
class Laser extends GameObject {
    constructor(x, y) {
    super(x,y);
    (this.width = 9), (this.height = 33);
    this.type = 'Laser';
    this.img = laserImg;
    let id = setInterval(() => {
    if (this.y > 0) {
    this.y -= 30;
    } else {
    
    this.dead = true;
    
    clearInterval(id);
    }
    }, 100)
    }
    }


// Initialization Functions
function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
    hero.y -=20 ;
    hero.updateSideHeroes();
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 20;
    hero.updateSideHeroes();

    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 20;
    hero.updateSideHeroes();

    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 20;
    hero.updateSideHeroes();

    });
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
    hero.fire();
    }
    });
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
    second.img = deadImg;
    
    setTimeout(() => {
        gameObjects = gameObjects.filter((go) => go!== second);

    },500);
    });
    }

function createEnemies() {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;

    for (let x = START_X; x < START_X + MONSTER_WIDTH; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

function createHero() {
    hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
    hero.img = heroImg;
    gameObjects.push(hero); // 메인 Hero 추가
    hero.sideHeroes.forEach((sideHero) => gameObjects.push(sideHero)); // 보조 Hero 추가
}


function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    lasers.forEach((l) => {
    enemies.forEach((m) => {
    if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
    eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
    first: l,
    second: m,
    });
    }
    });
    });
   

    gameObjects = gameObjects.filter((go) => !go.dead || go.type ==="Enemy");
    }

// Game Loop and Rendering
function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

// Event Listeners
let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37: // 왼쪽 화살표
        case 39: // 오른쪽 화살표
        case 38: // 위쪽 화살표
        case 40: // 아래쪽 화살표
        case 32: // 스페이스바
            e.preventDefault();
            break;
        default:
            break;
    }
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if(evt.keyCode === 32) {
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
    });

// Main Game Execution
window.onload = async () => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    heroImg = await loadTexture("assets/player.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    deadImg = await loadTexture("assets/laserGreenShot.png")
    initGame();
    let gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
    }, 100);
    };
