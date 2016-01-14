/**************************************
        Credits
***************************************/
/*
http://opengameart.org/content/desert-tilesets - background image
http://opengameart.org/content/yellow-starship - enemy ship
http://opengameart.org/content/adn - music
*/

/**************************************
           Variables
***************************************/
// Boolean value for determining if the player has reached the top of the screen.
var up = false;
// Boolean value for determining if the player has collided with other objects.
var collide = false;
// Value for determining the speed of the enemies, therefore the difficulty of the game.
var speedMultiply = 100;
// Sound effects for the game.
var audio = new Audio('explosion.wav');
var audio2 = new Audio('score.wav');
var audio4 = new Audio('score.ogg');
// Health of the player.
health = 100;

/**************************************
           Canvas Scene Elements
***************************************/
// This sets the boundaries of the canvas
function CanvasEdge() {
    this.halfBoxHeight = 80;
    this.halfBoxWidth = 80;
    this.boxUp = this.y - this.halfBoxHeight;
    this.boxDown = this.y + this.halfBoxHeight;
    this.boxLeft = this.x - this.halfBoxWidth;
    this.boxRight = this.x + this.halfBoxWidth;
}

// This listins for the key presses, and passes them to the handleInput method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This prevents the window from scrolling while making key presses in the game.
window.addEventListener("keydown", function(e) {
    if ([38, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

/**************************************
           Player
***************************************/
// This is the player variable.
var Player = function() {
    // These variables determine where the player will be rendered at the start
    // of the game.
    this.startingX = 219;
    this.startingY = 450;
    this.x = this.startingX;
    this.y = this.startingY;
    // These variables determine the edges of the screen for the character.
    this.gameTopEdge = 20;
    this.gameLeftEdge = 10;
    this.gameRightEdge = 650;
    // These variables determine the speed at which the player can move.
    this.moveVertical = 150;
    this.moveHorizontal = 110;
    // The starting score for the player.
    this.score = 0;
    // This assigns a sprite to the player.
    this.sprite = 'images/space.png';
};

// This draws the player, as well as the players score on the canvas.
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
   ctx.font = '30pt Impact';
   ctx.fillText('Score' + ' ' + this.score, 30, 50);
};

// This moves the player.
Player.prototype.handleInput = function(keyDown) {
    // Using the key input, determines what direction the player should move.
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
            if (this.x <= this.gameLeftEdge) {
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
// Updates the player score and health bar.
Player.prototype.updateScore = function() {
    
    ctx.clearRect(0, 0, 500, 500);
    //If the player reaches the top of the screen, update the score.
    if (up === true) {
        this.score = this.score + 10;
        if(this.score % 100 ==0){
            audio4.play();
        }
        audio2.play();
        // Reset up to false and reset the player back to his starting position.
        up = false;
        this.playerReset();
    }
    // If the player collides with an enemy, reduce their health by 25, play a sound
    // and reduce the score by 10 points.
    if (collide === true) {
        health -= 25;
        audio.play();
            this.score -= 10;
        }
        collide = false;
    switch(health){
        case 100:
            score.sprite = 'images/healthBar/fullHealth.png';
            score.render();
            break;
        case 75:
            score.sprite = 'images/healthBar/almostFull.png';
            score.render();
            break;
        case 50:
            score.sprite = 'images/healthBar/halfHealth.png';
            score.render();
            break;
        case 25:
            score.sprite = 'images/healthBar/lastHealth.png';
            score.render();
            break;
        default:
            health = 0;
    }
       
       this.playerReset();
    
};

// This resets the player to their starting position.
Player.prototype.playerReset = function() {
    this.x = this.startingX;
    this.y = this.startingY;
};

/**************************************
           Enemy
***************************************/
// Sets the enemy location and speed, and assigns a sprite to the enemy.
var Enemy = function(enemyX, enemyY, speed) {
    this.x = enemyX;
    this.y = enemyY;
    this.speed = speed;
    this.sprite = 'images/enemyShip.png';
};

Enemy.prototype.update = function(dt) {

    this.x -= this.speed * dt;
    var canvasWidth = 800;
    // Resets the enemy when they move out of view.
    if (this.x < -140) {
        this.x = 905;
    // Gives the enemy a randomly generated speed.
        this.speedGenerator();
    }
    CanvasEdge.call(this);
    // Determines wheter the player has collided with an enemy.
    if (player.y > this.boxUp && player.y < this.boxDown && player.x > this.boxLeft && player.x < this.boxRight) {
        collide = true;
        player.updateScore();
    }
};

// Draw the enemy on the canvas.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Generate a random speed for the enemy.
Enemy.prototype.speedGenerator = function() {
    this.speed = speedMultiply * (Math.floor(Math.random() * 5) + 1);
};

// Create an array to store the enemies.
var allEnemies = [];

// Instantiate 4 enemies with random locations on the canvas.
for (var i = 0; i < 4; i++) {
    var initialSpeed = speedMultiply * (Math.floor(Math.random() * 10) + 1);
    allEnemies.push(new Enemy(-105, Math.random() * 300 , initialSpeed));
}
/**************************************
           Health
***************************************/
// Creates a health bar on screen.
var Score = function(){
    this.sprite = 'images/healthBar/fullHealth.png';
}
// Renders the Health percentage for the player.
Score.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 550, 5);
    ctx.font = '18pt Impact';
    ctx.fillText('Health: ' + ' ' + health + '%', 580, 50);
}

// Creates a player character and health bar.
var player = new Player();
var score = new Score();
