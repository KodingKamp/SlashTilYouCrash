class Enemy {
    constructor(playerLevel) {
        this.level = playerLevel;
        this.type = enemyList[Math.floor(Math.random() * enemyList.length)];
        this.maxPossibleHealth = enemyStartingMaxHealth + 3.5 * (this.level - 1);
        this.maxHealth = Math.ceil(Math.random() * this.maxPossibleHealth);
        this.health = this.maxHealth;
        this.attack = enemyStartingMaxAttack + 1.006 * this.level * (this.level - 1);
        appendToDisplay(`A <bad-guy>${this.type}</bad-guy> has appeared!`, true);
        console.log(`Enemy's Attack: ${this.attack}`);
    }

    get name() { return this.type; }

    get maxHP() {return this.maxHealth; }

    get hp() { return this.health; }

    power() { return Math.ceil(Math.random() * this.attack); }

    takeDamage(damage) {
        // Correct health underflow when taking damage.
        if((this.health -= damage) < 0) this.health = 0;
        appendToDisplay(`<hr>You strike the <bad-guy>${this.type}</bad-guy> for <dmg-dealt>${damage}</dmg-dealt> damage.`);
    }
}