// Global Game variable
var enemyHealth, enemy;
var score = numberOfEnemiesSlain = numberOfTimesRan = 0;

/**
 * Game states: 0 = Main Menu
 *              1 = In Battle
 *              2 = Post Battle
*/
function changeButtons(gameState) {
    switch (gameState) {
        case 0: // Show Start Game button
        break;
        case 1: // Show attack, drink potion, run buttons
        break;
        case 2: // Show continue or exit game buttons
        break;
        default: // Display error game state
    }
}
function createEnemy() {
    enemyHealth = Math.ceil(Math.random() * maxEnemyHealth + playerLevel * 4);
    enemy = enemies[Math.floor(Math.random() * enemies.length)];
    // Display: "${enemy} has appeared!";
}

function displayStats() {
    // Display: "\tYour HP: ${playerHealth}";
    // Display: "\t{0}'s HP: {1}".format(enemy, enemyHealth);
}

function cueGameOver(died){
    if (died) {
        // Display: "You limp out of the dungeon, weak from battle.";
        changeButtons(0);
    }
    else {
        // Display: Ending Score, Number of Enemies Slain, Number of Times ran
        // Display: Thanks for playing
    }
    // Get score from database
    // if score > dbscore {
    //      Update Database with new score
    //      Display: "New Highscore!";
    // }
}

function cuePostBattleScript() {
    changeButtons(2);
    // Display: "What would you like to do now?\n" + "1. Continue fighting\n" + "2. Exit dungeon");
    // Continue fight's button would just runGameLoop();
    // Exit Dungeon's button would cueGameOver(false);
}

function clickedAttack() {

    let damageDealt = Math.floor(Math.random() * playerAttackDamage);
    let damageTaken = rand.nextInt(enemyAttackDamage);

    enemyHealth -= damageDealt;
    playerHealth -= damageTaken;

    // Display: "You strike the {0} for {1} damage.".format(enemy, damageDealt);
    // Display: "You recieve ${damageTaken} in retalization!";
    
    if (playerHealth < 1) {
        // Display: "You have taken too much damage, you are too weak to go on!";
        cueGameOver();
    }
    if (enemyHealth < 1) {
        numberOfEnemiesSlain++;
        playerLevel++;
        score += 200;
        // Display: "The ${enemy} was defeated!;
        // Display: "You have ${playerHealth} HP left.";
        if (Math.floor(Math.random() * 100) < healthPotionDropChance) {
            numHealthPotions++;
            // Display: "The ${enemy} dropped a health potion!";
            // Display: "You now have ${numHealthPotions} health potion(s).";
        }
        cuePostBattleScript();
    }
}

function clickedDrinkPotion() {

    if (numHealthPotions > 0) {
        playerHealth += healthPotionHealAmount;
        numHealthPotions--;
        // Display: "You drink a health potion, healing yourself for ${healthPotionHealAmount}";
        // Display: "You have ${numHealthPotions} health potions left.";
    } else {
        // Display: "You have no health potions left! Defeat enemies for a chance to get one!";
    }
}

function clickedRun() {
    score -= 75;
    numberOfTimesRan++;
    // Display: "You ran away from the ${enemy}";
    runGameLoop();
}

function runGameLoop() {
    changeButtons(1); // Argument represents a boolean = if game is running
    createEnemy();
    displayStats();
    // Display: "\tWhat would you like to do?";
    // Display: "\t1. Attack";
    // Display: "\t2. Drink health potion";
    // Display: "\t3. Run!"";
}

function startGame() {
    // playerHealth += %highscore;
    // playerAttackDamage += %highscore;

    // Display: "Welcome to the Dungeon!"
    runGameLoop();
}