class Game {
    constructor() {
        this.score = 0;
        this.numberOfEnemiesSlain = 0;
        this.numberOfTimesRan = 0;
        this.player = new Player();
        this.enemy;
        this.gameState = 0;
        this.potionPrice = 150;
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
                    `<button class="btn-100 game-btn menu-btn"
                    onclick="setNewGame()">New Game</button>`;
                break;
            case 1:
                btnContainer.innerHTML =
                    `<button class="btn-33 game-btn combat-btn" onclick="game.runCombat()">
                    <img class="game-btn-icon" src="assets/images/game/attack.png">Attack</button>
                    <button class="btn-33 game-btn combat-btn" onclick="game.runDrinkPotion()">
                    <img class="game-btn-icon" src="assets/images/game/potion.png">Potion<span id="numOfPots"></span></button>
                    <button class="btn-33 game-btn combat-btn" onclick="game.runEvade()">
                    <img class="game-btn-icon" src="assets/images/game/run.png">Run</button>`;
                break;
            case 2:
                btnContainer.innerHTML =
                    `<button class="btn-50 game-btn ooc-btn" onclick="game.generateNewEncounter()">Continue</button>
                    <button class="btn-50 game-btn ooc-btn" onclick="game.runGameOver(false)">End Game</button>`;
                break;
            case 3:
                btnContainer.innerHTML = 
                    `<button class="btn-33 game-btn ooc-btn" onclick="game.generateNewEncounter()">Continue</button>
                    <button class="btn-33 game-btn ooc-btn" onclick="game.runBuyPotion()">Buy Potion</button>
                    <button class="btn-33 game-btn ooc-btn" onclick="game.runGameOver(false)">End Game</button>`;
                break;
            default:
                break;
        }
    }

    runStatsUpdate(postbattle){
        if (postbattle)
            updateStats(this.score, this.player, this.enemy, true);
        else 
            updateStats(this.score, this.player, this.enemy);
    }

    generateNewEncounter() {    // beginning of game loop
        if (this.gameState !== 1)
            this.changeGameState(1);

        this.enemy = new Enemy(this.player.lvl);
        this.runStatsUpdate();
        appendToDisplay("<br>What would you like to do?");
    }

    runCombat() {
        this.enemy.takeDamage(this.player.power());

        // Adding small change of player dodging atttack.
        if (Math.floor(Math.random() * 20) == 0) {
            appendToDisplay("<br>You managed to dodge the attack!")
        }
        else
            this.player.takeDamage(this.enemy.power());
        this.runStatsUpdate(true);

        // If enemy dies, add score
        if (this.enemy.hp === 0) {
            this.numberOfEnemiesSlain++;
            this.score += 200;
            appendToDisplay(`<br>The <bad-guy>${this.enemy.name}</bad-guy> was defeated!`);
            // If the player also died, end the game,
            if (this.player.hp === 0) {
                this.runStatsUpdate(true);
                this.runPlayerDied();
            }
            // but if player still alive, continue.
            else {
                this.player.levelUp();
                this.runDropChance();
                this.runStatsUpdate(true);
                if ((this.player.lvl - 1) % 5 === 0 && this.score >= this.potionPrice) {
                    this.runMerchantAppears();
                } 
                else 
                    this.runContinue();
            }
        }
        // If only player dies, end the game.
        else if (this.player.hp === 0)
            this.runPlayerDied();
    }

    runPlayerDied() {
        appendToDisplay("<br>You've taken too much damage, you are too weak to go on!");
        this.runGameOver();
    }

    runDrinkPotion() {
        this.player.heal();
        this.runStatsUpdate();
    }

    runDropChance() {
        if (Math.floor(Math.random() * 100) < potionDropChance) {
            appendToDisplay(`<br>The <bad-guy>${this.enemy.name}</bad-guy> dropped a potion of healing!`);
            this.player.gainPotion();
        }
    }

    runEvade() {
        this.numberOfTimesRan++;
        // Score Underflow Protection
        if ((this.score -= 75) < 0) 
            this.score = 0;

        // Unsuccessful run attempt
        if (Math.random() * 100 < runChance) {
            appendToDisplay("<hr>You were unsuccessful in trying to flee.");
            this.player.takeDamage(this.enemy.attack());
            this.runStatsUpdate();
            if (this.player.hp === 0) this.runPlayerDied();
        }
        // Successful run attempt
        else
            this.generateNewEncounter();
    }

    runGameOver(died = true) {
        this.changeGameState(0);
        let message = "<hr>";
        if (died) message += "You limp out of the dungeon, weak from battle.<br>";
        message += `Ending Score: ${this.score}
            <br>Number of Enemies Slain: ${this.numberOfEnemiesSlain}
            <br>Number of Times ran: ${this.numberOfTimesRan}
            <br><br> ~~~~~~~~~ Thanks for playing ~~~~~~~~~`;
        appendToDisplay(message);

        // create a database object to send new score that will post to the database.
        let database = new Database();
        database.sendScoreToDatabase(this.score);
    }

    runContinue() {
        this.changeGameState(2);
        appendToDisplay("<hr>What would you like to do now?");
    }

    runMerchantAppears() {
        this.changeGameState(3);
        appendToDisplay(`<hr>You spot a merchant selling potions!
            <br>"Would you like to purchase some potions for ${this.potionPrice} points?`);
    }

    runBuyPotion() {
        if (this.score < this.potionPrice) {
            appendToDisplay("<br>You do not have enough points.");
            this.runContinue();
        } else {
            let message = `<hr>You bought a potion!`;
            appendToDisplay(message);
            this.player.gainPotion();
            this.score -= this.potionPrice;
            this.runStatsUpdate();
        }
    }
}