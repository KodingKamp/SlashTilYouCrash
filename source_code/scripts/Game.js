class Game {
    constructor() {
        // Private variables and methods
        let score = 0;
        let highestScore = 0;
        let numberOfEnemiesSlain = 0;
        let numberOfTimesRan = 0;
        let numberOfPotionsBought = 0;
        let numberOfPotionsUsed = 0;
        let player = new Player();
        let enemy;
        let gameState = 0;
        let potionPrice = 150;

        /**
         * Game states: 0 = Main Menu
         *                  new game => game = new Game();
         *              1 = In Battle
         *                  attack => game.runCombat();
         *                  drink potion => game.DrinkPotion();
         *                  run => game.runEvade();
         *                  exit game => game.runGameOver();
         *              2 = Post Battle
         *                  continue => game.generateNewEncounter();
         *                  exit game => game.runGameOver();
         *              3 = Potion Merchant
         *                  continue => game.generateNewEncounter();
         *                  buy potion => game.runBuyPotion();
         *                  exit game =>game.runGameOver();
         */
        const changeGameState = (s) => {
            gameState = s;
            let btnContainer = document.getElementById("button-container");
            switch (s) {
                case 0:
                    btnContainer.innerHTML =
                        `<div class="game-btn menu-btn"
                            onclick="setNewGame()">&gt; New Campaign</div>
                        <div class="game-btn menu btn"
                            onclick="generateMainMenu()">&gt; Back to Main</div>`;
                    break;
                case 1:
                    btnContainer.innerHTML =
                        `<div id="attackBtn" class="game-btn combat-btn" onclick="game.runCombat()">
                        <img src="assets/images/game/attack.png" height="22px">&nbsp;Attack the enemy</div>
                        <div id="potionBtn" class="game-btn combat-btn" onclick="game.runDrinkPotion()">
                        <img src="assets/images/game/potion.png" height="22px">&nbsp;Drink a Potion</div>
                        <div id="runBtn" class="game-btn combat-btn" onclick="game.runEvade()">
                        <img src="assets/images/game/run.png" height="22px">&nbsp;Attempt to Run</div>
                        <br>
                        <div class="game-btn ooc-btn" onclick="game.runGameOver(false)">Quit Game</div>`;
                    break;
                case 2:
                    btnContainer.innerHTML =
                        `<div class="game-btn ooc-btn" onclick="game.generateNewEncounter()">Continue</div>
                        <div class="game-btn ooc-btn" onclick="game.runGameOver(false)">End Game</div>`;
                    break;
                case 3:
                    btnContainer.innerHTML = 
                        `<div class="game-btn ooc-btn" onclick="game.generateNewEncounter()">Continue</div>
                        <div class="game-btn ooc-btn" onclick="game.runBuyPotion()">Buy Potion</div>
                        <div class="game-btn ooc-btn" onclick="game.runGameOver(false)">End Game</div>`;
                    break;
                case -1:
                    document.getElementById("game-container").innerHTML = "<h1>I DON'T THINK SO, CHEATER!</h1>";
                    break;
                default:
                    break;
            }
        }

        const runStatsUpdate = () => {
            updateStats(score, player, enemy);
        }

        const runPostBattle = () => {
            changeGameState(2);
            appendToDisplay("<hr>What would you like to do now?");
        }
        
        const runPlayerDied = () => {
            appendToDisplay("<br>You've taken too much damage, you are too weak to go on!");
            this.runGameOver();
        }
        
        const runDropChance = () => {
            if (Math.floor(Math.random() * 100) < potionDropChance) {
                appendToDisplay(`<br>The <bad-guy>${enemy.name}</bad-guy> dropped a potion of healing!`);
                player.gainPotion();
            }
        }
        
        const runMerchantAppears = () => {
            changeGameState(3);
            appendToDisplay(`<hr>You spot a merchant selling potions!
            <br>"Would you like to purchase some potions for ${potionPrice} points?`);
        }
        
        const caughtCheating = () => {
            changeGameState(-1);
            console.error("Something has gone wrong!");
            confirm("An Error Has Occurred!");
        }

        this.generateNewEncounter = () => {    // beginning of game loop
            // Anti-cheat
            if (gameState === 1 ) {
                caughtCheating()
                return;
            }
            
            changeGameState(1);
            
            enemy = new Enemy(player.lvl);
            runStatsUpdate();
            appendToDisplay("<br>What would you like to do?");
        }

        // Public methods

        this.runCombat = () => {
            // Anti-cheat
            if (gameState !== 1 ) {
                caughtCheating()
                return;
            }
            
            enemy.takeDamage(player.power());
            
            // Adding small change of player dodging atttack.
            if (Math.floor(Math.random() * 20) == 0) {
                appendToDisplay("<br>You managed to dodge the attack!")
            }
            else
            player.takeDamage(enemy.power());
            runStatsUpdate();
            
            // If enemy dies, add score
            if (enemy.hp === 0) {
                numberOfEnemiesSlain++;
                score += 200 + 50 * (Math.floor(player.lvl/10));
                if (score > highestScore) {
                    highestScore = score;
                }
                appendToDisplay(`<br>The <bad-guy>${enemy.name}</bad-guy> was defeated!`);
                // If the player also died, end the game,
                if (player.hp === 0) {
                    runStatsUpdate();
                    runPlayerDied();
                }
                // but if player still alive, continue.
                else {
                    player.levelUp();
                    runDropChance();
                    runStatsUpdate();
                    if ((player.lvl - 1) % 5 === 0 && score >= potionPrice) {
                        runMerchantAppears();
                    } 
                    else 
                        runPostBattle();
                }
            }
            // If only player dies, end the game.
            else if (player.hp === 0)
                runPlayerDied();
        }

        this.runDrinkPotion = () => {
            // Anti-cheat
            if (gameState !== 1 ) {
                caughtCheating()
                return;
            }
            
            if (player.heal())
                numberOfPotionsUsed++;
                runStatsUpdate();
        }

        this.runEvade = () => {
            numberOfTimesRan++;
            // Score Underflow Protection
            if ((score -= 75) < 0) 
                score = 0;

            // Unsuccessful run attempt
            if (Math.random() * 100 < runChance) {
                appendToDisplay("<hr>You were unsuccessful in trying to flee.");
                player.takeDamage(enemy.power());
                runStatsUpdate();
                if (player.hp === 0) runPlayerDied();
            }
            // Successful run attempt
            else {
                changeGameState(-2);
                this.generateNewEncounter();
            }
        }

        this.runGameOver = (died = true) => {
            changeGameState(0);
            let message = "<hr>";
            if (died) message += "You limp out of the dungeon, weak from battle.<br><br>";
            message += `Highest Score Achieved: ${highestScore}
                <br>Number of Enemies slain: ${numberOfEnemiesSlain}
                <br>Number of Times ran: ${numberOfTimesRan}
                <br>Number of Potions used: ${numberOfPotionsUsed}
                <br>Number of Potions purchased: ${numberOfPotionsBought}
                <br><br>
                <big-letter>T</big-letter>hanks for playing!`;
            appendToDisplay(message);

            // create a database object to send new score that will post to the database.
            let database = new Database();
            database.sendStatsToDatabase(highestScore, player.lvl);
        }


        this.runBuyPotion = () => {
            // Anti-cheat
            if (gameState !== 3) {
                caughtCheating()
                return;
            }

            if (score < potionPrice) {
                appendToDisplay("<br>You do not have enough points.");
                runPostBattle();
            } else {
                let message = `<hr>You bought a potion!`;
                appendToDisplay(message);
                player.gainPotion();
                score -= potionPrice;
                numberOfPotionsBought++;
                runStatsUpdate();
            }
        }

        this.generateNewEncounter();
    }
}