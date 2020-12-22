import Phaser from 'phaser';

const hpRectMaxWidth = 69;

export default class BattleSceneHealthManager {
  private pokemonMaxHealth: number = 555;
  private pokemonCurrentHealth: number;
  private hpRect!: Phaser.GameObjects.Rectangle;
  private healthText!: Phaser.GameObjects.Text;
  constructor(public scene: Phaser.Scene) {
    this.pokemonCurrentHealth = this.pokemonMaxHealth;
  }

  public setPokemonCurrentHealth(pokemonCurrentHealth: number) {
    this.pokemonCurrentHealth = pokemonCurrentHealth;
  }

  public setPokemonMaxHealth(pokemonMaxHealth: number) {
    this.pokemonMaxHealth = pokemonMaxHealth;
  }

  public setHPRect(hpRect: Phaser.GameObjects.Rectangle) {
    this.hpRect = hpRect;
  }

  public setHealthText(healthText: Phaser.GameObjects.Text) {
    this.healthText = healthText;
  }

  public getPokemonCurrentHealth() {
    return this.pokemonCurrentHealth;
  }

  private computeRectWidth(
    currentHealth: number,
    maxHealth: number,
    maxRectWidth: number
  ) {
    let new_width = maxRectWidth * (currentHealth / maxHealth);
    if (new_width >= maxRectWidth) {
      new_width = maxRectWidth;
    }
    return new_width;
  }

  public increaseHealth() {
    this.pokemonCurrentHealth++;
    if (this.pokemonCurrentHealth >= this.pokemonMaxHealth) {
      this.pokemonCurrentHealth = this.pokemonMaxHealth;
    }
    this.hpRect.width = this.computeRectWidth(
      this.pokemonCurrentHealth,
      this.pokemonMaxHealth,
      hpRectMaxWidth
    );
    this.hpRect.displayWidth = this.hpRect.width;
    if (this.healthText) {
      this.healthText.setText(`${this.pokemonCurrentHealth}/${555}`);
    }
  }

  public decreaseHealth() {
    this.pokemonCurrentHealth--;
    if (this.pokemonCurrentHealth <= 0) {
      this.pokemonCurrentHealth = 0;
    }
    this.hpRect.width = this.computeRectWidth(
      this.pokemonCurrentHealth,
      this.pokemonMaxHealth,
      hpRectMaxWidth
    );
    this.hpRect.displayWidth = this.hpRect.width;
    if (this.healthText) {
      this.healthText.setText(`${this.pokemonCurrentHealth}/${555}`);
    }
    if (
      this.pokemonCurrentHealth < this.pokemonMaxHealth * (40 / 100) &&
      this.pokemonCurrentHealth >= this.pokemonMaxHealth * (15 / 100)
    ) {
      this.hpRect.fillColor = 0xf7b500;
    } else if (this.pokemonCurrentHealth < this.pokemonMaxHealth * (15 / 100)) {
      this.hpRect.fillColor = 0xe71410;
    } else {
      this.hpRect.fillColor = 0x00bf37;
    }
  }
}
