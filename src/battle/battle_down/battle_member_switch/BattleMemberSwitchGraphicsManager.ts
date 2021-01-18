import Phaser from 'phaser';
import { PokeBall, Pokemon } from '~/types/myTypes';

export default class BattleMemberSwitchGraphicsManager {
  constructor(public scene: Phaser.Scene) {}

  public createBackground() {
    const bg = this.scene.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = this.scene.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createBigBox() {
    const bigBox = this.scene.add
      .image(screen.width * 0.0439238653, screen.height * 0.0390625, 'big-box')
      .setOrigin(0, 0);
    bigBox.width = screen.width * 0.168374817;
    bigBox.height = screen.height * 0.2213541667;
    bigBox.displayWidth = bigBox.width;
    bigBox.displayHeight = bigBox.height;
    return bigBox;
  }

  public createBigBoxSelector() {
    const bigBoxSelector = this.scene.add
      .image(screen.width * 0.0439238653, screen.height * 0.0390625, 'selector')
      .setOrigin(0, 0);
    bigBoxSelector.width = screen.width * 0.168374817;
    bigBoxSelector.height = screen.height * 0.2213541667;
    bigBoxSelector.displayWidth = bigBoxSelector.width;
    bigBoxSelector.displayHeight = bigBoxSelector.height;
    bigBoxSelector.visible = false;
    return bigBoxSelector;
  }

  public createPokemonSprite() {
    const pokemonSprite = this.scene.add
      .sprite(screen.width * 0.1134699854, screen.height * 0.1171875, '')
      .setOrigin(0, 0);
    pokemonSprite.width = screen.width * 0.0219619327;
    pokemonSprite.height = screen.height * 0.0390625;
    pokemonSprite.displayWidth = pokemonSprite.width;
    pokemonSprite.displayHeight = pokemonSprite.height;
    return pokemonSprite;
  }

  public createPokemonName(pokemon: Pokemon) {
    this.scene.add
      .text(
        screen.width * 0.0841874085,
        screen.height * 0.0716145833,
        `${pokemon.name}`,
        {
          fontSize: screen.width * 0.0102489019,
          align: 'center',
        }
      )
      .setOrigin(0, 0);
  }

  public createInBattleText(inBattleIndex: number) {
    let text = '';
    if (inBattleIndex === 0) {
      text = 'IN BATTLE';
    } else {
      text = 'SWITCH';
    }
    this.scene.add
      .text(screen.width * 0.0841874085, screen.height * 0.1953125, text, {
        fontSize: screen.width * 0.0131771596,
        align: 'center',
      })
      .setOrigin(0, 0);
  }

  public createBackImage() {
    const backImage = this.scene.add
      .image(
        screen.width * 0.2086383602,
        screen.height * 0.3229166667,
        'back-arrow'
      )
      .setOrigin(0, 0);
    backImage.width = screen.width * 0.0292825769;
    backImage.height = screen.height * 0.0520833333;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
