// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                if (balls[j].color != 'rgb(255,255,255,0)') {
                    balls[j].color = 'rgb(255,255,255,0)';
                    this.size += 1;
                }
            }
        }
    }
}

let balls = [];

while (balls.length < 40) {
    let size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(200, 255) + ',' + random(200, 255) + ',' + random(200, 255) + ')',
        size
    );

    balls.push(ball);
}

let hungry_ball = new Ball(
    40,
    40,
    0,
    0,
    'rgb(80,0,150)',
    3
);

document.addEventListener("keydown", event => {
    if (event.keyCode === 37) {
        hungry_ball.x -= 6;
    } else if (event.keyCode === 38) {
        hungry_ball.y -= 6;
    } else if (event.keyCode === 39) {
        hungry_ball.x += 6;
    } else if (event.keyCode === 40) {
        hungry_ball.y += 6;
    }

    if ((hungry_ball.x + hungry_ball.size) >= width) {
        hungry_ball.x = hungry_ball.size * 2;
    }

    if ((hungry_ball.x - hungry_ball.size) <= 0) {
        hungry_ball.x = width - hungry_ball.size;
    }

    if ((hungry_ball.y + hungry_ball.size) >= height) {
        hungry_ball.y = hungry_ball.size * 2;
    }

    if ((hungry_ball.y - hungry_ball.size) <= 0) {
        hungry_ball.y = height - hungry_ball.size;
    }
});

function loop() {
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
    }

    hungry_ball.draw();
    hungry_ball.collisionDetect();

    requestAnimationFrame(loop);
}

loop();
