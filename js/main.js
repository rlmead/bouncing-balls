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

function Ball(x, y, velX, velY, color, size, display) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.display = display;
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
        if (balls[j].display) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].display = false; // stop drawing balls once they've been eaten by the hungry ball
                this.size += 1;
                if (this.size > 7 && this.size % 3 === 0) {
                    hungry_ball_speed -= 1; // hungry_ball starts losing speed at a regular rate after it reaches a certain size
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
        size,
        true
    );

    balls.push(ball);
}

let hungry_ball = new Ball(
    40,
    40,
    0,
    0,
    'rgb(80,0,150)',
    3,
    true
);

let hungry_ball_speed = 15;

document.addEventListener("keydown", event => {
    if (event.keyCode === 37) {
        hungry_ball.x -= hungry_ball_speed;
    } else if (event.keyCode === 38) {
        hungry_ball.y -= hungry_ball_speed;
    } else if (event.keyCode === 39) {
        hungry_ball.x += hungry_ball_speed;
    } else if (event.keyCode === 40) {
        hungry_ball.y += hungry_ball_speed;
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
        if (balls[i].display) {
            balls[i].draw();
            balls[i].update();
        }
    }

    hungry_ball.draw();
    hungry_ball.collisionDetect();

    requestAnimationFrame(loop);
}

loop();
