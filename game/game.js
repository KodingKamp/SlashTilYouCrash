// Global Game variable
var game, started = false;

// Functions to run on load.
window.onload = () => {
    createGameFrame();
    game = new Game();
    game.changeButtons(0);
    displayMainMenu();
}

// Main Menu text
function displayMainMenu() {
    document.getElementById("activity-display").innerHTML = '<h1>STYC</h1>\
        STYC, Slash Til You Crash, is text-based hack & slash adventure game.\
        <br>Something Something\
        <br>blah blah blah\
        <br>Click "New Game" to being!';
}

// Game Object
function Game() {
    var enemyHealth, enemy, score, numberOfEnemiesSlain, numberOfTimesRan, enemyTempMax;
    var gameState = 0;
    var display = document.getElementById("activity-display");

    enemyAttackDamage += (playerLevel * 1.5);

    this.resetDefaults = () => {
        playerLevel = 1;
        playerMaxHealth = 100;
        playerHealth = playerMaxHealth;
        playerAttackDamage = 40;
        numHealthPotions = 3;
        healthPotionHealAmount = 30;
        healthPotionDropChance = 25; // Percentage
        score = 0;
        numberOfEnemiesSlain = 0;
        numberOfTimesRan = 0;
    };

    /**
     * Game states: 0 = Main Menu
     *              1 = In Battle
     *              2 = Post Battle
     */
    this.changeButtons = () => {
        let mb = document.getElementsByClassName("menu-btn");
        let gb = document.getElementsByClassName("combat-btn");
        let cb = document.getElementsByClassName("ooc-btn");

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

    // Function for toggling array of button elements' displays (hide/unhide)
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
        this.resetDefaults();
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
        enemyHealth = Math.ceil(Math.random() * maxEnemyHealth + playerLevel * 2.5);
        enemyTempMax = enemyHealth;
        enemy = enemies[Math.floor(Math.random() * enemies.length)];
        display.innerHTML += "<hr>" + enemy + " has appeared!";
    }

    // Function for displaying current game stats, ran at the beginning of the game loop.
    this.displayStats = () => {
        display.innerHTML += "<hr> >  Your HP: <player-hp>" + playerHealth + "</player-hp>/<player-hp>" + playerMaxHealth + "</player-hp>";
        display.innerHTML += "<br> >  " + enemy + "'s HP: <enemy-hp>" + enemyHealth + "</enemy-hp>/<enemy-hp>" + enemyTempMax + "</enemy-hp>";
        document.getElementById("numOfPots").innerText = numHealthPotions;
        updateScroll();
    }

    // Function runs when user clicks the attack button.
    this.clickedAttack = () => {

        let damageDealt = Math.floor(Math.random() * playerAttackDamage + (playerLevel - 1) * 3);
        let damageTaken = Math.floor(Math.random() * enemyAttackDamage + (playerLevel - 1) * 2.5);

        enemyHealth -= damageDealt;
        if (enemyHealth < 0) {
            enemyHealth = 0;
            numberOfEnemiesSlain++;
            score += 200;
        }
        playerHealth -= damageTaken;
        if (playerHealth < 0) playerHealth = 0;

        display.innerHTML += "<hr>You strike the <bad-guy>" + enemy + "</bad-guy> for <dmg-taken>" + damageDealt + "</dmg-taken> damage.";
        display.innerHTML += "<br>You recieve <dmg-dealt>" + damageTaken + "</dmg-dealt> in retaliation!";

        this.displayStats();
        if (playerHealth == 0) {
            display.innerHTML += "<hr>You have taken too much damage, you are too weak to go on!";
            this.cueGameOver();
        }
        else if (enemyHealth == 0) {
            playerLevel++;
            playerMaxHealth += ((playerLevel - 1) * 3);
            playerHealth += 3;
            display.innerHTML += "<hr>The <bad-guy>" + enemy + "</bad-guy> was defeated!";
            if (Math.floor(Math.random() * 100) < healthPotionDropChance) {
                numHealthPotions++;
                display.innerHTML += "<br>The <bad-guy>" + enemy + "</bad-guy> dropped a health potion!";
                display.innerHTML += "<br>You now have " + numHealthPotions + " health potion(s).";
            }
            gameState = 2;
            this.cuePostBattleScript();
        }
        updateScroll();
    }

    // Function runs when user clicks the potion button.
    this.clickedDrinkPotion = () => {
        if (playerHealth === playerMaxHealth)
            display.innerHTML += "<br>You are already at max health";
        else if (numHealthPotions > 0 && playerHealth < playerMaxHealth) {
            playerHealth += healthPotionHealAmount;
            numHealthPotions--;
            display.innerHTML += "<hr>You drink a health potion, healing for <hp-pot>" + healthPotionHealAmount + "</hp-pot>.";
            display.innerHTML += "<br>You have " + numHealthPotions + " health potions left.";
            if (playerHealth > playerMaxHealth)
                playerHealth = playerMaxHealth;
        }
        else
            display.innerHTML += "<br>You have no health potions left! Defeat enemies for a chance to get one!";
        this.displayStats();
        updateScroll();
    }

    // Function runs when user clicks the run button.
    this.clickedRun = () => {
        numberOfTimesRan++;
        if (score == 0) {
            display.innerHTML += "<small>At this point, you might as well start over.</small>"
        }
        score -= 75;
        if (score < 0) score = 0;
        this.runGameLoop();
        updateScroll();
    }

    // Function gets called when the player dies (true) or when they decide to quit (false).
    this.cueGameOver = (died) => {
        gameState = 0;
        this.changeButtons(gameState);
        display.innerHTML += (died) ? "<hr>You limp out of the dungeon, weak from battle."
            : "<hr>Ending Score: " + score + "<br>Number of Enemies Slain: " +
            numberOfEnemiesSlain + "<br>Number of Times ran: " +
            numberOfTimesRan;
        // Get score from database
        // if score > dbscore {
        //      Update Database with new score
        //      Display: "New Highscore!";
        // }
        display.innerHTML += "<br><br> ~~~~~~~~~ Thanks for playing ~~~~~~~~~";
        updateScroll();
    }

    // Function gets called when the player defeats an enemy.
    this.cuePostBattleScript = () => {
        this.changeButtons(2);
        // Display: "What would you like to do now?\n" + "1. Continue fighting\n" + "2. Exit dungeon");
        // Continue fight's button would just runGameLoop();
        // Exit Dungeon's button would cueGameOver(false);
    }
}

// Function that gets called at the end of the game loop to scroll the element to the bottom.
function updateScroll() {
    var element = document.getElementById("activity-display");
    element.scrollTop = element.scrollHeight;
}

// Function that will bring up the game instructions.
function showHowToPlay() {
    document.getElementById("htp-frame").setAttribute('src', "howToPlay.html");
}

// Function that generates the core layout of the game.
function createGameFrame() {
    document.getElementById("game-container").innerHTML =
        '<div id="game-frame">\
            <div id="stats-display"></div>\
            <p id="activity-display"></p>\
            <div id="button-container">\
                <button class="btn-50 game-btn menu-btn" onclick="game.startGame()">New Game</button>\
                <button class="btn-50 game-btn menu-btn" onclick="showHowToPlay()">How To Play</button>\
                <button class="btn-33 game-btn combat-btn" onclick="game.clickedAttack()">\
                <img class="game-btn-icon" src="icons/attack.png">Attack</button>\
                <button class="btn-33 game-btn combat-btn" onclick="game.clickedDrinkPotion()">\
                <img class="game-btn-icon" src="icons/potion.png">Potion (<span id="numOfPots"></span>)</button>\
                <button class="btn-33 game-btn combat-btn" onclick="game.clickedRun()">\
                <img class="game-btn-icon" src="icons/run.png">Run</button>\
                <button class="btn-50 game-btn ooc-btn" onclick="game.runGameLoop()">Continue</button>\
                <button class="btn-50 game-btn ooc-btn" onclick="game.cueGameOver(false)">End Game</button>\
            </div>\
        </div> <iframe id="htp-frame" src=""></iframe>';
}