/*
http://opengameart.org/content/desert-tilesets - background image
http://opengameart.org/content/yellow-starship - enemy ship
*/
// Boolean values for updating the score.
var up = false;
var collide = false;
var hasGem = false;

// Sets the edges of the gems and enemy bugs.
function Edges() {
    this.halfBoxHeight = 60;
    this.halfBoxWidth = 100;
    this.boxUp = this.y - this.halfBoxHeight;
    this.boxDown = this.y + this.halfBoxHeight;
    this.boxLeft = this.x - this.halfBoxWidth;
    this.boxRight = this.x + this.halfBoxWidth;
}

// This will be multiplied with a random number between 1 and 10 to set the speed of the enemy.
// Change this number to increase or lower difficulty.
var speedMultiply = 80;

// Enemies our player must avoid
var Enemy = function(enemyX, enemyY, speed) {
    this.x = enemyX;
    this.y = enemyY;
    this.speed = speed;

    this.sprite = 'images/enemyShip.png';
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x -= this.speed * dt;

    var canvasWidth = 800;

    // Resets enemy with a new speed after it goes off canvas.
    if (this.x < -140) {
        this.x = 905;
        this.speedGenerator();
    }

    Edges.call(this);
    // Detects if the player collides with the enemy.
    if (player.y > this.boxUp && player.y < this.boxDown && player.x > this.boxLeft && player.x < this.boxRight) {
        collide = true;
        player.updateScore();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Sets a random speed to the enemy.
Enemy.prototype.speedGenerator = function() {
    this.speed = speedMultiply * (Math.floor(Math.random() * 5) + 1);
};

// The player character
var Player = function() {
    // Edges of the game screen.
    // Modify these values if another row or column is to be added to the game.
    this.gameTopEdge = 20;
    this.gameLeftEdge = 19;
    this.gameRightEdge = 650;

    // The starting position of our character.
    this.startingX = 219;
    this.startingY = 450;
    this.x = this.startingX;
    this.y = this.startingY;

    // The movement in pixels.
    this.moveVertical = 85;
    this.moveHorizontal = 100;

    this.score = 0;

    this.sprite = 'images/space.png';
};

// Draw the player on the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = '30pt Courier New';
    ctx.fillStyle = 'orange';
    ctx.fillText('Score' + ' ' + this.score, 0, 30);
};

// Moves the player character.
Player.prototype.handleInput = function(keyDown) {
    // Moves the player character and makes sure it doesn't go out of bounds.
    // If player moves up in the water, updates score and resets with player.updateScore().
    switch (keyDown) {
        case 'up':
            if (this.y <= this.gameTopEdge) {
                up = true;
                player.updateScore();
            } else {
                this.y -= 50;
            }
            break;
        case 'down':
            if (this.y === this.startingY) {
                return null;
            } else {
                this.y += 50;
            }
            break;
        case 'left':
            if (this.x === this.gameLeftEdge) {
                return null;
            } else {
                this.x -= this.moveHorizontal;
            }
            break;
        case 'right':
            if (this.x >= this.gameRightEdge) {
                return null;
            } else {
                this.x += this.moveHorizontal ;
            }
            break;
        default:
            return null;
    }
};

// Updates the score.
Player.prototype.updateScore = function() {
    ctx.clearRect(0, 0, 500, 500);
    // If the player reaches the water with a gem, update score accordingly.
    if (up === true && hasGem === true) {
        this.score += gem.value;
        up = false;
        hasGem = false;
        //this.playerReset();
        ctx.clearRect(0, 600, 500, 500);
        gem.setGemLocation();
    }
    // If the player reaches the water without a gem, increase score by 1.
    else if (up === true) {
        this.score = this.score + 10;
        up = false;
       // this.playerReset();
    }

    // If player has collision with enemy, reduce score by value of the gem carried.
    // If not carryin a gem, reduce score by gem value / 2.
    if (collide === true) {
        if (hasGem === true) {
            ctx.clearRect(0, 600, 500, 500);
            this.score -= gem.value;
            hasGem = false;
        } else {
            this.score -= gem.value / 2;
        }
        collide = false;
        gem.setGemLocation();
       // this.playerReset();
    }
};

// When called, resets player character to original position.
Player.prototype.playerReset = function() {
    this.x = this.startingX;
    this.y = this.startingY;
};

// Creates a gem and places it on a random stone block with setGemLocation().
var Gem = function() {
    this.setGemLocation();
};

// Sets the location of the gem when called in setGemLocation.
function gemLocation() {
    this.x = (Math.floor(Math.random() * 5)) * 100 + 25;
    this.y = (Math.floor(Math.random() * 3) + 1) * 85 + 60;
}

// Sets the location of a gem.
// Blue will appear most often, then green, then orange.
Gem.prototype.setGemLocation = function() {
    var random = Math.floor(Math.random() * 100) + 1;

    if (random >= 60) {
        this.sprite = 'images/Gem Blue.png';
        gemLocation.call(this);
        this.value = 20;
    } else if (random < 60 && random > 10) {
        this.sprite = 'images/Gem Green.png';
        gemLocation.call(this);
        this.value = 50;
    } else {
        this.sprite = 'images/Gem Orange.png';
        gemLocation.call(this);
        this.value = 100;
    }
};

// Detects if the player has caught a gem.
Gem.prototype.update = function() {
    Edges.call(this);
    if (player.y > this.boxUp && player.y < this.boxDown && player.x > this.boxLeft && player.x < this.boxRight) {
        hasGem = true;
        this.x = 0;
        this.y = 600;
    }
};

// Draw the gem on the screen.
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var allEnemies = [];

// Sets maximum number of enemies on screen to 3 (number of rows of rock).
// Be sure to change this if another row of rocks and enemies is to be added.
for (var i = 0; i < 4; i++) {
    var initialSpeed = speedMultiply * (Math.floor(Math.random() * 10) + 1);
    allEnemies.push(new Enemy(-105, 135 + 40 * i , initialSpeed));
}

// Creates the player character.
var player = new Player();

// Creates the gem.
var gem = new Gem();

// This listens for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Prevents the window from scrolling up and down when the arrow keys are pressed.
window.addEventListener("keydown", function(e) {
    if ([38, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);