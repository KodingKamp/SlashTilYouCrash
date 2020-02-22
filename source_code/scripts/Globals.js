// Global Variables.
let potionHealAmount = 30;
let potionDropChance = 25; // int as percentage e.g. 25 = 25% chance
let runChance = 50; // int as percentage
let enemyStartingMaxHealth = 75;
let enemyStartingMaxAttack = 30;
this.enemyList = [
    "Skeleton",
    "Zombie",
    "Deadly Assassin",
    "Wolf",
    "Bear",
    "Ghostly Figure",
    "Night Hag",
    "Discontent Beggar",
    "Member of the in-laws",
    "Restaurant Health Inspector"
];

function createGameFrame() {
    document.getElementById("game-container").innerHTML =
        `<div id="game-frame">
            <div class="game-frame-section gfs-large">
                <p id="activity-display"></p>
            </div>
            <div class="game-frame-section gfs-small">
                <div id="stats-display"></div>
                <div id="button-container"></div>
            </div>
        </div>`;
}

function generateMainMenu() {
    let message = `<lore-text><bigger-letter>S</bigger-letter>&nbsp;&nbsp;TYC is a hack-n-slash adventure game 
                    where you are trying to rip through as many enemies as you can before you fall in battle, 
                    leaving your village open to extinction.
                    <br>
                    <br>Two neighboring villages have been at peace for 1,000 years after the Great-300-Year, 
                    G3Y, war that ended the feud. However, unknown to those who reside in Hakiboro Village, 
                    the tribe of Junditar have been growing in numbers: passively waiting for the perfect time 
                    to strike! And on this beautiful day, as you are tending to your crops, you feel the ground 
                    start to tremble. You look up to see an onslaught of Junditarians charging towards your 
                    village.</lore-text>`;
    appendToDisplay(message, true);
    document.getElementById("stats-display").innerHTML =
        `<lore-text>Then, the war trumpets sing as you tighten your grip on your farm tool and widen your stance.
            You and your farm mates are the only defensive line to this village so you must hold off as many
            Jundis as you can!</lore-text>
        <br><br>
        Click "&gt; To Battle!" to begin.
        <br><br><br><br>
        <div class="game-btn menu-btn"
            onclick="setNewGame()">&gt; To Battle!</div>
        <div class="game-btn menu btn"
            onclick="displayHowToPlay()">&gt; How to Play Chapter</div>`;
    document.getElementById("button-container").innerHTML = "";
}

const displayHowToPlay = () => {
    appendToDisplay(`<big-letter>C</big-letter>hapter 0: How to play<br>The attack <img class="game-btn-icon" 
                src="assets/images/game/attack.png" width="16px" height="16px"> button will do damage 
                to the enemy. Slaying enemies will increase your score and level.<br><br>
            The potion <img class="game-btn-icon" src="assets/images/game/potion.png" 
                width="16px" height="16px"> button to recover health. Slain enemies have a small chance 
                of dropping a healing potion when they are defeated.<br><br>
            The run <img class="game-btn-icon" src="assets/images/game/run.png" width="16px" 
                height="16px"> button to try and run from the currrent enemy. Running decreases your 
                score by 75 points and is only has a 50% success rate. Failing could result in taking 
                damage.<br><br>
            After every 5th level, a Potion Merchant will appear where you can buy potions for 150 points.<br><br>
            At the end of combat, you can continue to fight or embrace defeat. Dying will result in 
            ending the game.`, 
        true);

    document.getElementById("stats-display").innerHTML = `You have friends to help you, so don’t feel like you must personally defeat every enemy coming your way. 
        You can attempt to dodge them as they come rushing in, leaving them up to your companions as you try to 
        defeat the next incoming threat!<br>
        <br>
        Worry not if you are slain, your name will go down in history as being the greatest heroes who died 
        defending this village against a plethora of enemies. Children of the future will read about how many 
        you were able to stop before you fell! So let's see how many you can slash until you crash!
        <br><br>
        <div class="game-btn menu btn"
            onclick="generateMainMenu()">&gt; Back to Main</div>`;
    document.getElementById("button-container").innerHTML = "";
}

function setNewGame() {
    game = new Game();
}

// Function that gets called at the end of the game loop to scroll the element to the bottom.
// function scrollToBottom() {
//     display.scrollTop = display.scrollHeight;
// }

// Function for displaying current game stats, ran at the beginning of the game loop.
function updateStats(s, p, e) {
    let statsDisplay = document.getElementById("stats-display");
    statsDisplay.innerHTML = `Score: ${s}`;
    statsDisplay.innerHTML += `<br>Level: ${p.lvl}`
    statsDisplay.innerHTML += `<br>Your HP: 
        <player-hp>${p.hp}</player-hp>/<player-hp>${p.maxHP}</player-hp>`;
    statsDisplay.innerHTML += `<br><bad-guy>${e.name}</bad-guy>'s HP: 
        <enemy-hp>${e.hp}</enemy-hp>/<enemy-hp>${e.maxHP}</enemy-hp>`;
    statsDisplay.innerHTML += `<br>Number of Potions: ${p.numOfPotions}`;
}

function appendToDisplay(message, clearDisplay = false) {
    let display = document.getElementById("activity-display");
    // If clear display required, replace message, otherwise append
    (clearDisplay) ? display.innerHTML = message : display.innerHTML += message;
    // Scroll the display to the bottom of the element after each append.    
    display.scrollTop = display.scrollHeight;
}