/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        bgwidth = 7200,
        bgposition1 = 0,
        bgposition2 = 8000,
        audio3 = new Audio('applause.wav'),
        lastTime = Date.now();

    canvas.width = 800;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
                  dt = (now - lastTime) / 1000.0;
                  bgposition1 += -1000 * dt;
        bgposition2 += -1000 * dt;
        renderBackground();

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        // Start game over screen if the players health drops below 25.
        if(health < 25){
            game_over();
        }
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        // Load the background.  If you wanted multiple backgrounds, you
        // could store images in different indexes of the array.
        var rowImages = [
                'images/view.png' 
            ]
        renderBackground();
        renderEntities();
    }

    // This function renders the entities created in the app.js.
    function renderEntities() {
        // Render each enemy stored in the array.
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        //Render the player and health.
        player.render();
        score.render();
    }
    // This function renders the background.
    function renderBackground() {
      
    if (bgposition1 <= -bgwidth) {
            bgposition1 = 0;
        };
        ctx.drawImage(Resources.get('images/view.png'), bgposition1, 0);
    };

    // This function determines if the player has pressed the enter key to start a new game.
    var Over = function(){
      document.addEventListener('keydown', function(e) {
          var allowedKeys = {
        13: 'enter'
    };
   
        handleInput(allowedKeys[e.keyCode]);
      });
    }
    // This function starts the game over screen once the players health has dropped
    // below 25.
    function game_over() {
        renderBackground();
        // Font size and type
        ctx.font = "36pt Impact"; 
        // Font color
        ctx.fillStyle = "red";
        // Display the text and set the coordinates.
        ctx.fillText("Game Over!", 240, 250);
        // Draw the outline of the text
        ctx.strokeStyle = "black";
        ctx.lineWidth = "3";
        ctx.strokeText("Game Over!", 240, 250);
        ctx.fillText("Please press ENTER to play again", 110, 350);
        ctx.strokeText("Please press ENTER to play again", 110, 350);
        // Play applause sound.
        audio3.play();
        // Determine if the player has pressed enter to start a new game.
        Over();
    };

    handleInput = function(keyDown) {
    // Reload the screen if enter was pressed.
    switch (keyDown) {
        case 'enter':
               window.location.reload();
            break;
        default:
            return null;
    }

};
// Load the images used in the game.
    Resources.load([
 
        'images/view.png',
        'images/enemyShip.png',
        'images/space.png',
        'images/healthBar/fullHealth.png',
        'images/healthBar/almostFull.png',
        'images/healthBar/halfHealth.png',
        'images/healthBar/lastHealth.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
