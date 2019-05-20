// Player variables
var playerLevel = 1;
var playerMaxHealth = 100 + (playerLevel - 1) * 3;
var playerHealth = playerMaxHealth;
var playerAttackDamage = 40 + (playerLevel - 1) * 3;
var numHealthPotions = 3;
var healthPotionHealAmount = 30;
var healthPotionDropChance = 25; // Percentage