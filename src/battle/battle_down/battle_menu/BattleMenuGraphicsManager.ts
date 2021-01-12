import Phaser from 'phaser';

export default class BattleMenuGraphicsManager {
  constructor(public scene: Phaser.Scene) {}

  public createBackground() {
    const bg = this.scene.add.image(0, 0, 'battle-menu-bg').setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = this.scene.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createFightOption() {
    const fightOption = this.scene.add
      .image(0, 0, 'fight-option')
      .setOrigin(0, 0);
    fightOption.width = this.scene.game.config.width as number;
    fightOption.height = this.scene.game.config.height as number;
    fightOption.displayWidth = fightOption.width;
    fightOption.displayHeight = fightOption.height;
    return fightOption;
  }

  public createFightOptionSelector() {
    const fightSelector = this.scene.add
      .image(105, 90, 'selector')
      .setOrigin(0, 0);
    fightSelector.width = 130;
    fightSelector.height = 100;
    fightSelector.displayWidth = fightSelector.width;
    fightSelector.displayHeight = fightSelector.height;
    fightSelector.visible = false;
    return fightSelector;
  }

  public createBagOption() {
    const bagOption = this.scene.add
      .image(0, 220, 'bag-option')
      .setOrigin(0, 0);
    bagOption.width = 100;
    bagOption.height = 70;
    bagOption.displayWidth = bagOption.width;
    bagOption.displayHeight = bagOption.height;
    return bagOption;
  }

  public createBagOptionSelector() {
    const bagSelector = this.scene.add
      .image(0, 220, 'selector')
      .setOrigin(0, 0);
    bagSelector.width = 100;
    bagSelector.height = 70;
    bagSelector.displayWidth = bagSelector.width;
    bagSelector.displayHeight = bagSelector.height;
    bagSelector.visible = false;
    return bagSelector;
  }

  public createRunOption() {
    const runOption = this.scene.add
      .image(130, 240, 'run-option')
      .setOrigin(0, 0);
    runOption.width = 80;
    runOption.height = 50;
    runOption.displayWidth = runOption.width;
    runOption.displayHeight = runOption.height;
    return runOption;
  }

  public createRunOptionSelector() {
    const runSelector = this.scene.add
      .image(130, 240, 'selector')
      .setOrigin(0, 0);
    runSelector.width = 80;
    runSelector.height = 50;
    runSelector.displayWidth = runSelector.width;
    runSelector.displayHeight = runSelector.height;
    runSelector.visible = false;
    return runSelector;
  }

  public createPokemonOption() {
    const pokemonOption = this.scene.add
      .image(240, 220, 'pokemon-option')
      .setOrigin(0, 0);
    pokemonOption.width = 100;
    pokemonOption.height = 70;
    pokemonOption.displayWidth = pokemonOption.width;
    pokemonOption.displayHeight = pokemonOption.height;
    return pokemonOption;
  }

  public createPokemonOptionSelector() {
    const pokemonSelector = this.scene.add
      .image(240, 220, 'selector')
      .setOrigin(0, 0);
    pokemonSelector.width = 100;
    pokemonSelector.height = 70;
    pokemonSelector.displayWidth = pokemonSelector.width;
    pokemonSelector.displayHeight = pokemonSelector.height;
    pokemonSelector.visible = false;
    return pokemonSelector;
  }

  public createPlayerPokeBall(playerPokeBallX: number) {
    return this.scene.add
      .image(playerPokeBallX, 190, 'battle-ball-normal')
      .setOrigin(0, 0);
  }

  public createOpponentPokeBall(enemyPokeBallX: number) {
    const enemyPokeBall = this.scene.add
      .image(enemyPokeBallX, 60, 'battle-ball-normal')
      .setOrigin(0, 0);
    enemyPokeBall.width = 20;
    enemyPokeBall.height = 20;
    enemyPokeBall.displayWidth = enemyPokeBall.width;
    enemyPokeBall.displayHeight = enemyPokeBall.height;
    return enemyPokeBall;
  }
}
