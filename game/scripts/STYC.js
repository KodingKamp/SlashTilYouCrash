/**
 * Script load order:
 *      Globals.js
 *      Player.js
 *      Enemy.js
 *      Databse.js
 *      Game.js
 *      STYC.js (this)
 */
var game;
window.onload = () => {
    createGameFrame();
    generateMainMenu();
}