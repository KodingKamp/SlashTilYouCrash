// Global Game variable
var game, started = false;

// Functions to run on load.
window.onload = () => {
    createGameFrame();
    game = new Game();
    game.changeButtons(0);
    displayMainMenu();
}

function displayMainMenu(){
    document.getElementById("activity-display").innerHTML = '<h1>STYC</h1>\
        A text-based hack & slash adventure game.\
        <br>Something Something\
        <br>blah blah blah\
        <br>Click "New Game" to being!';  
}

// Game Object
function Game() {
    var enemyHealth, enemy;
    var gameState = score = numberOfEnemiesSlain = numberOfTimesRan = 0;
    var display = document.getElementById("activity-display");

    enemyAttackDamage += (playerLevel * 1.5);

    this.setPlayerDefaults = () => {
        playerLevel = 1;
        playerMaxHealth = 100 + (playerLevel - 1) * 3;
        playerHealth = playerMaxHealth;
        playerAttackDamage = 40 + (playerLevel - 1) * 3;
        numHealthPotions = 3;
        healthPotionHealAmount = 30;
        healthPotionDropChance = 25; // Percentage
    };

    /**
     * Game states: 0 = Main Menu
     *              1 = In Battle
     *              2 = Post Battle
     */
    this.changeButtons = () => {
        let mb = document.getElementsByClassName("menu-btn");
        let gb = document.getElementsByClassName("game-btn");
        let cb = document.getElementsByClassName("continue-btn");

        // For now, this will toggle the buttons' display.
        // Future edit: remove/replace buttons as states change
        switch (gameState) {
            case 0: this.toggleDisplay(mb, true);
                this.toggleDisplay(gb, false);
                this.toggleDisplay(cb, false);
                break;
            case 1: this.toggleDisplay(mb, false);
                this.toggleDisplay(gb, true);
                this.toggleDisplay(cb, false);
                break;
            case 2: this.toggleDisplay(mb, false);
                this.toggleDisplay(gb, false);
                this.toggleDisplay(cb, true);
                break;
            default:
                document.getElementById("activity-display").innerHTML =
                    "<h1>Error, Invalid Game State Detected</h1>";
        }
    }

    // Function for toggling array of elements' displays
    this.toggleDisplay = function (buttons, display) {
        for (i = 0; i < buttons.length; i++) {
            buttons[i].style.display =
                (display) ? "initial" : "none";
        }
    }

    // Function ran by clicking the "New Game" button
    this.startGame = () => {
        // DB NEEDED: playerHealth += %highscore;
        // DB NEEDED: playerAttackDamage += %highscore;
        this.setPlayerDefaults();
        this.runGameLoop();
    }

    // This function is used to start a new game round. Psesudo-loops
    this.runGameLoop = () => {
        if (gameState != 1) {
            gameState = 1;
            this.changeButtons(1); // Argument represents a boolean = if game is running
        }
        display.innerHTML = "Level: " + playerLevel + " Score: " + score;
        this.createEnemy();
        this.displayStats();
        display.innerHTML += "<br>What would you like to do?";
    }

    // Function for creating new encounter, ran at the beginning of the game loop.
    this.createEnemy = () => {
        enemyHealth = Math.ceil(Math.random() * maxEnemyHealth + playerLevel * 4);
        enemy = enemies[Math.floor(Math.random() * enemies.length)];
        display.innerHTML += "<hr>" + enemy + " has appeared!";
    }

    // Function for displaying current game stats, ran at the beginning of the game loop.
    this.displayStats = () => {
        display.innerHTML += "<hr> >  Your HP: " + playerHealth;
        display.innerHTML += "<br> >  " + enemy + "'s HP: " + enemyHealth;
        updateScroll();
    }

    // 
    this.clickedAttack = () => {

        let damageDealt = Math.floor(Math.random() * playerAttackDamage);
        let damageTaken = Math.floor(Math.random() * enemyAttackDamage);

        enemyHealth -= damageDealt;
        playerHealth -= damageTaken;
        if (enemyHealth < 0) enemyHealth = 0;

        display.innerHTML += "<hr>You strike the " + enemy + " for " + damageDealt + " damage.";
        display.innerHTML += "<br>You recieve " + damageTaken + " in retalization!";

        this.displayStats();
        if (playerHealth < 1) {
            display.innerHTML += "<hr>You have taken too much damage, you are too weak to go on!";
            this.cueGameOver();
        }
        if (enemyHealth < 1) {
            numberOfEnemiesSlain++;
            playerLevel++;
            score += 200;
            display.innerHTML += "<hr>The " + enemy + " was defeated!";
            if (Math.floor(Math.random() * 100) < healthPotionDropChance) {
                numHealthPotions++;
                display.innerHTML += "<br>The " + enemy + " dropped a health potion!";
                display.innerHTML += "<br>You now have " + numHealthPotions + " health potion(s).";
            }
            gameState = 2;
            this.cuePostBattleScript();
        }
        updateScroll();
    }

    this.clickedDrinkPotion = () => {
        if (playerHealth === playerMaxHealth)
            display.innerHTML += "<br>You are already at max health";
        else if (numHealthPotions > 0 && playerHealth < playerMaxHealth) {
            playerHealth += healthPotionHealAmount;
            numHealthPotions--;
            display.innerHTML += "<br>You drink a health potion, healing yourself for " + healthPotionHealAmount + ".";
            display.innerHTML += "You have " + numHealthPotions + " health potions left.";
        }
        else
            display.innerHTML += "<br>You have no health potions left! Defeat enemies for a chance to get one!";
        this.displayStats();
        updateScroll();
    }

    this.clickedRun = () => {
        if(score == 0){
            display.innerHTML += "<small>At this point, you might as well start over.</small>"
        }
        score -= 75; 
        if (score < 0) score = 0;
        numberOfTimesRan++;
        display.innerHTML += "<hr>You ran away from the " + enemy + ".";
        this.runGameLoop();
        updateScroll();
    }

    this.cueGameOver = (died) => {
        gameState = 0;
        this.changeButtons(gameState);
            display.innerHTML += (died) ? "<hr>You limp out of the dungeon, weak from battle." 
                : "<hr>Ending Score, Number of Enemies Slain, Number of Times ran";
        // Get score from database
        // if score > dbscore {
        //      Update Database with new score
        //      Display: "New Highscore!";
        // }
        display.innerHTML += "<br>~~~~~ Thanks for playing ~~~~~";
        updateScroll();
    }

    this.cuePostBattleScript = () => {
        this.changeButtons(2);
        // Display: "What would you like to do now?\n" + "1. Continue fighting\n" + "2. Exit dungeon");
        // Continue fight's button would just runGameLoop();
        // Exit Dungeon's button would cueGameOver(false);
    }
}

function createGameFrame() {
    document.getElementById("game-frame").innerHTML =
        '<p id="activity-display"></p>\
       <div id="button-container">\
            <button class="btn-100 menu-btn" onclick="game.startGame()">New Game</button>\
            <button class="btn-33 game-btn" onclick="game.clickedAttack()">Attack</button>\
            <button class="btn-33 game-btn" onclick="game.clickedDrinkPotion()">Drink Potion</button>\
            <button class="btn-33 game-btn" onclick="game.clickedRun()">Run</button>\
            <button class="btn-50 continue-btn" onclick="game.runGameLoop()">Continue</button>\
            <button class="btn-50 continue-btn" onclick="game.cueGameOver(false)">End Game</button>\
        </div>'
}

function updateScroll(){
    var element = document.getElementById("activity-display");
    element.scrollTop = element.scrollHeight;
}