const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 8, // Increased player's horizontal velocity
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 1000,
        y: 100
    },
    velocity: {
        x: 2, // Decreased enemy's horizontal velocity
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -6; // Increased player's leftward velocity
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 6; // Increased player's rightward velocity
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    // Restrict player movement within canvas boundaries
    if (player.position.x <= 0) {
        player.position.x = 0;
    } else if (player.position.x >= canvas.width - player.width) {
        player.position.x = canvas.width - player.width;
    }

    if (player.position.y <= 0) {
        player.position.y = 0;
    } else if (player.position.y >= canvas.height - player.height) {
        player.position.y = canvas.height - player.height;
    }

    // Player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -6; // Decreased enemy's leftward velocity
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 6; // Decreased enemy's rightward velocity
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    // Restrict enemy movement within canvas boundaries
    if (enemy.position.x <= 0) {
        enemy.position.x = 0;
    } else if (enemy.position.x >= canvas.width - enemy.width) {
        enemy.position.x = canvas.width - enemy.width;
    }

    if (enemy.position.y <= 0) {
        enemy.position.y = 0;
    } else if (enemy.position.y >= canvas.height - enemy.height) {
        enemy.position.y = canvas.height - enemy.height;
    }

    // Enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Detect collision & enemy gets hit when player is attacking
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        });
    }

    // If player misses
    if (player.isAttacking) {
        player.isAttacking = false;
    }

    // Player gets hit
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealth', {
            width: player.health + '%'
        });
    }

    // If enemy misses
    if (enemy.isAttacking) {
        enemy.isAttacking = false;
    }

    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

function resetGame() {
    player.reset();
    enemy.reset();
    animate();
  }
  

animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -20;
                break;
            case 's':
                player.attack();
                player.isAttacking = true; // Set isAttacking to true when player attacks
                break;
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
            case 'ArrowDown':
                enemy.attack();
                enemy.isAttacking = true; // Set isAttacking to true when enemy attacks
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }

    // Enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});
