class Player {
    constructor() {
        this.level = 1;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.attack = 35;
        this.potions = 3;        
        console.log("Player's Attack: " + this.attack);
    }

    get lvl() {
        return this.level;
    }

    get maxHP() {
        return this.maxHealth;
    }

    get hp() {
        return this.health;
    }

    get numOfPotions() {
        return this.potions;
    }

    hpCheckOverflow() {
        this.health = (this.health > this.maxHealth) ? 
            this.maxHealth : this.health;
    }

    levelUp(n = 1) {
        this.level += n;
        this.attack += this.level * 2.5;
        this.maxHealth += this.level * 3;
        this.heal(Math.ceil(Math.pow(this.level, 1.5)));
        console.log("Player's Attack: " + this.attack);
    }

    gainPotion() {
        this.potions++;
        appendToDisplay("<br>You now have " + this.potions + " potion(s) of healing.");
    }

    heal(x = -1) {
        if (x !== -1) {
            this.health += x;
        }
        // Does not have potions
        else if (this.potions <= 0) {
            appendToDisplay("<br>You have no potions of healing left!<br>Defeat enemies for a chance to get one!");
        }
        // Has potions but at max health
        else if (this.potions > 0 && this.health === this.maxHealth) {
            appendToDisplay("<br>You are already at max health");
        }
        // Has potions but less than max health
        else if (this.potions > 0 && this.health < this.maxHealth){ // Has potions and NOT at max health
            this.potions--;
            this.health += potionHealAmount;
            appendToDisplay("<hr>You drink a potion of healing, healing for <hp-pot>" + potionHealAmount + "</hp-pot>.");
        }
        // Has potions but greater than max health.
        else {
            appendToDisplay("You've been caught cheating! error h001", true);
            // Stop Game Loop
            game = null;
        }
        // Correct health overflow when healing.
        this.hpCheckOverflow();
    }

    power() {
        return Math.floor(Math.random() * this.attack);
    }

    takeDamage(damage) {
        if (damage < 0) {
            appendToDisplay("You've been caught cheating! error d001", true);
            // Stop Game Loop
            game = null;
        }
        // Correct health underflow when taking damage.
        if ((this.health -= damage) < 0) this.health = 0;
        appendToDisplay("<br>You recieve <dmg-taken>" + damage + "</dmg-taken> in retalization!");
    }
}