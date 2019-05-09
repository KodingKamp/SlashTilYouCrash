// Global Game variable
var enemyHealth, enemy;
var score = numberOfEnemiesSlain = numberOfTimesRan = 0;

// Functions to run on load.
window.onload = () => {
    createGameFrame();
    changeButtons(0);
}

function Game() {
    
}

/**
 * Game states: 0 = Main Menu
 *              1 = In Battle
 *              2 = Post Battle
 */
function changeButtons(gameState) {
    let mb = document.getElementsByClassName("menu-btn");
    let gb = document.getElementsByClassName("game-btn");
    let cb = document.getElementsByClassName("continue-btn");

    // For now, this will toggle the buttons' display.
    // Future edit: remove/replace buttons as states change
    switch (gameState) {
        case 0: toggleDisplay(mb, true);
            toggleDisplay(gb, false);
            toggleDisplay(cb, false);
            break;
        case 1: toggleDisplay(mb, false);
            toggleDisplay(gb, true);
            toggleDisplay(cb, false);
            break;
        case 2: toggleDisplay(mb, false);
            toggleDisplay(gb, false);
            toggleDisplay(cb, true);
            break;
        default:
            document.getElementById("activity-display").innerHTML =
                "<h1>Error, Invalid Game State Detected</h1>";
    }
}

function toggleDisplay(buttons, display) {
    for (i = 0; i < buttons.length; i++) {
        buttons[i].style.display =
            (display) ? "initial" : "none";
    }
}

function startGame() {
    // playerHealth += %highscore;
    // playerAttackDamage += %highscore;

    // Display: "Welcome to the Dungeon!"
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

function createEnemy() {
    enemyHealth = Math.ceil(Math.random() * maxEnemyHealth + playerLevel * 4);
    enemy = enemies[Math.floor(Math.random() * enemies.length)];
    // Display: "${enemy} has appeared!";
}

function displayStats() {
    // Display: "\tYour HP: ${playerHealth}";
    // Display: "\t{0}'s HP: {1}".format(enemy, enemyHealth);
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
    if (playerHealth === playerMaxHealth) {
        // Display: "You are already at max health";
    }
    else if (numHealthPotions > 0 && playerHealth < playerMaxHealth) {
        playerHealth += healthPotionHealAmount;
        numHealthPotions--;
        // Display: "You drink a health potion, healing yourself for ${healthPotionHealAmount}";
        // Display: "You have ${numHealthPotions} health potions left.";
    }
    else {
        // Display: "You have no health potions left! Defeat enemies for a chance to get one!";
    }
}

function clickedRun() {
    score -= 75;
    numberOfTimesRan++;
    // Display: "You ran away from the ${enemy}";
    runGameLoop();
}
function cueGameOver(died) {
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
function createGameFrame() {
    document.getElementById("game-frame").innerHTML =
        '<p id="activity-display"></p>\
       <div id="button-container">\
            <button class="btn-100 menu-btn" onclick="startGame()">Start Game</button>\
            <button class="btn-33 game-btn" onclick="clickedAttack()">Attack</button>\
            <button class="btn-33 game-btn" onclick="clickedDrinkPotion()">Drink Potion</button>\
            <button class="btn-33 game-btn" onclick="clickedRun()">Run</button>\
            <button class="btn-50 continue-btn" onclick="runGameLoop()">Continue</button>\
            <button class="btn-50 continue-btn" onclick="cueGameOver(false)">End Game</button>\
        </div>'
}