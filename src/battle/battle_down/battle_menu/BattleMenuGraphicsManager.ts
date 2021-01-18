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
      .image(screen.width * 0.0768667643, screen.height * 0.1171875, 'selector')
      .setOrigin(0, 0);
    fightSelector.width = screen.width * 0.0951683748;
    fightSelector.height = screen.height * 0.1302083333;
    fightSelector.displayWidth = fightSelector.width;
    fightSelector.displayHeight = fightSelector.height;
    fightSelector.visible = false;
    return fightSelector;
  }

  public createBagOption() {
    const bagOption = this.scene.add
      .image(0, screen.height * 0.2864583333, 'bag-option')
      .setOrigin(0, 0);
    bagOption.width = screen.width * 0.0732064422;
    bagOption.height = screen.height * 0.0911458333;
    bagOption.displayWidth = bagOption.width;
    bagOption.displayHeight = bagOption.height;
    return bagOption;
  }

  public createBagOptionSelector() {
    const bagSelector = this.scene.add
      .image(0, screen.height * 0.2864583333, 'selector')
      .setOrigin(0, 0);
    bagSelector.width = screen.width * 0.0732064422;
    bagSelector.height = screen.height * 0.0911458333;
    bagSelector.displayWidth = bagSelector.width;
    bagSelector.displayHeight = bagSelector.height;
    bagSelector.visible = false;
    return bagSelector;
  }

  public createRunOption() {
    const runOption = this.scene.add
      .image(screen.width * 0.0951683748, screen.height * 0.3125, 'run-option')
      .setOrigin(0, 0);
    runOption.width = screen.width * 0.0585651537;
    runOption.height = screen.height * 0.0651041667;
    runOption.displayWidth = runOption.width;
    runOption.displayHeight = runOption.height;
    return runOption;
  }

  public createRunOptionSelector() {
    const runSelector = this.scene.add
      .image(screen.width * 0.0951683748, screen.height * 0.3125, 'selector')
      .setOrigin(0, 0);
    runSelector.width = screen.width * 0.0585651537;
    runSelector.height = screen.height * 0.0651041667;
    runSelector.displayWidth = runSelector.width;
    runSelector.displayHeight = runSelector.height;
    runSelector.visible = false;
    return runSelector;
  }

  public createPokemonOption() {
    const pokemonOption = this.scene.add
      .image(
        screen.width * 0.1756954612,
        screen.height * 0.2864583333,
        'pokemon-option'
      )
      .setOrigin(0, 0);
    pokemonOption.width = screen.width * 0.0732064422;
    pokemonOption.height = screen.height * 0.0911458333;
    pokemonOption.displayWidth = pokemonOption.width;
    pokemonOption.displayHeight = pokemonOption.height;
    return pokemonOption;
  }

  public createPokemonOptionSelector() {
    const pokemonSelector = this.scene.add
      .image(
        screen.width * 0.1756954612,
        screen.height * 0.2864583333,
        'selector'
      )
      .setOrigin(0, 0);
    pokemonSelector.width = screen.width * 0.0732064422;
    pokemonSelector.height = screen.height * 0.0911458333;
    pokemonSelector.displayWidth = pokemonSelector.width;
    pokemonSelector.displayHeight = pokemonSelector.height;
    pokemonSelector.visible = false;
    return pokemonSelector;
  }

  public createPlayerPokeBall(playerPokeBallX: number, ps: number) {
    let texture = '';
    if (ps > 0) {
      texture = 'battle-ball-normal';
    } else {
      texture = 'battle-ball-fainted';
    }
    return this.scene.add
      .image(playerPokeBallX, screen.height * 0.2473958333, texture)
      .setOrigin(0, 0);
  }

  public createOpponentPokeBall(enemyPokeBallX: number, ps: number) {
    let texture = '';
    if (ps > 0) {
      texture = 'battle-ball-normal';
    } else {
      texture = 'battle-ball-fainted';
    }
    const enemyPokeBall = this.scene.add
      .image(enemyPokeBallX, screen.height * 0.078125, texture)
      .setOrigin(0, 0);
    enemyPokeBall.width = screen.width * 0.0146412884;
    enemyPokeBall.height = screen.height * 0.0260416667;
    enemyPokeBall.displayWidth = enemyPokeBall.width;
    enemyPokeBall.displayHeight = enemyPokeBall.height;
    return enemyPokeBall;
  }
}
