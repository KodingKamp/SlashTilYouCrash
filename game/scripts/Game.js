class Game {
    constructor() {
        this.score = 0;
        this.numberOfEnemiesSlain = 0;
        this.numberOfTimesRan = 0;
        this.player = new Player();
        this.enemy;
        this.gameState = 0;
        this.generateNewEncounter();
    }

    /**
     * Game states: 0 = Main Menu
     *                  new game => game = new Game();
     *              1 = In Battle
     *                  attack => game.runCombat();
     *                  drink potion => game.player.heal();
     *                  run => game.runEvade();
     *              2 = Post Battle
     *                  continue => game.generateNewEncounter();
     *                  exit game => game.runGameOver();
     */
    changeGameState(s) {
        this.gameState = s;
        let btnContainer = document.getElementById("button-container");
        switch (s) {
            case 0:
                btnContainer.innerHTML =
                    '<button class="btn-100 game-btn menu-btn" \
                    onclick="setNewGame()">New Game</button>';
                break;
            case 1:
                btnContainer.innerHTML =
                    '<button class="btn-33 game-btn combat-btn" onclick="game.runCombat()">\
                    <img class="game-btn-icon" src="icons/attack.png">Attack</button>\
                    <button class="btn-33 game-btn combat-btn" onclick="game.runDrinkPotion()">\
                    <img class="game-btn-icon" src="icons/potion.png">Potion<span id="numOfPots"></span></button>\
                    <button class="btn-33 game-btn combat-btn" onclick="game.runEvade()">\
                    <img class="game-btn-icon" src="icons/run.png">Run</button>';
                break;
            case 2:
                btnContainer.innerHTML =
                    '<button class="btn-50 game-btn ooc-btn" onclick="game.generateNewEncounter()">Continue</button>\
                    <button class="btn-50 game-btn ooc-btn" onclick="game.runGameOver(false)">End Game</button>';
                break;
            default:
                break;
        }
    }

    generateNewEncounter() {    // beginning of game loop
        if (this.gameState !== 1) {
            this.changeGameState(1);
        }
        this.enemy = new Enemy(this.player.lvl);
        updateStats(this.score, this.player, this.enemy);
        appendToDisplay("<br>What would you like to do?");
    }

    runCombat() {
        this.enemy.takeDamage(this.player.power());
        this.player.takeDamage(this.enemy.power());

        // If both you and the enemy dies.
        if (this.player.hp === 0 && this.enemy.hp === 0) {
            this.numberOfEnemiesSlain++;
            this.score += 200;
            this.runGameOver();
        }
        // If only player dies
        else if (this.player.hp === 0) {
            appendToDisplay("<br>You've taken too much damage, you are too weak to go on!");
            this.runGameOver();
        }
        // If only enemy dies
        else if (this.enemy.hp === 0) {
            this.numberOfEnemiesSlain++;
            this.score += 200;
            this.player.levelUp();
            appendToDisplay("<br>The <bad-guy>" + this.enemy.name + "</bad-guy> was defeated!");
            this.runDropChance();
            this.runContinue();
        }
        updateStats(this.score, this.player, this.enemy, true);
    }

    runDrinkPotion() {
        this.player.heal();
        updateStats(this.score, this.player, this.enemy);
    }

    runDropChance() {
        if (Math.floor(Math.random() * 100) < potionDropChance) {
            appendToDisplay("<br>The <bad-guy>" + this.enemy.name + "</bad-guy> dropped a potion of healing!");
            this.player.gainPotion();
        }
    }

    runEvade() {
        this.numberOfTimesRan++;
        // Score Underflow Protection
        if ((this.score -= 75) < 0) this.score = 0;

        // Unsuccessful run attempt
        if (Math.random() * 100 < runChance) {
            appendToDisplay("<hr>You were unsuccessful in trying to flee.");
            this.player.takeDamage(this.enemy.attack());
            updateStats(this.score, this.player, this.enemy);
            if (this.player.hp === 0) {
                appendToDisplay("<br>You've taken too much damage, you are too weak to go on!");
                this.runGameOver();
            }
        } else { // Successful run attempt
            this.generateNewEncounter();
        }
    }

    runGameOver(died = true) {
        this.changeGameState(0);
        let message = "<hr>Ending Score: " + this.score +
            "<br>Number of Enemies Slain: " + this.numberOfEnemiesSlain +
            "<br>Number of Times ran: " + this.numberOfTimesRan +
            "<br><br> ~~~~~~~~~ Thanks for playing ~~~~~~~~~";
        if (died) message = "<hr>You limp out of the dungeon, weak from battle." + message;
        appendToDisplay(message);
    }

    runContinue() {
        this.changeGameState(2);
        appendToDisplay("<hr>What would you like to do now?");
    }
}