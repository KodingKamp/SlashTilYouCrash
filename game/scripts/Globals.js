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
            <div id="stats-display"></div>
            <p id="activity-display"></p>
            <div id="button-container"></div>
        </div>`;
}

function generateMainMenu() {
    let message = `<h1>STYC</h1>
    STYC, Slash Til You Crash, is text-based hack & slash adventure game.
    <br>Something Something
    <br>blah blah blah
    <br>
    <br>Click "New Game" to being!`;
    appendToDisplay(message);
    document.getElementById("button-container").innerHTML =
        `<button class="btn-100 game-btn menu-btn"
        onclick="setNewGame()">New Game</button>`;
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