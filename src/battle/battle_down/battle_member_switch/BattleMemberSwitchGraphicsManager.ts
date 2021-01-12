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
    const bigBox = this.scene.add.image(60, 30, 'big-box').setOrigin(0, 0);
    bigBox.width = 230;
    bigBox.height = 170;
    bigBox.displayWidth = bigBox.width;
    bigBox.displayHeight = bigBox.height;
    return bigBox;
  }

  public createBigBoxSelector() {
    const bigBoxSelector = this.scene.add
      .image(60, 30, 'selector')
      .setOrigin(0, 0);
    bigBoxSelector.width = 230;
    bigBoxSelector.height = 170;
    bigBoxSelector.displayWidth = bigBoxSelector.width;
    bigBoxSelector.displayHeight = bigBoxSelector.height;
    bigBoxSelector.visible = false;
    return bigBoxSelector;
  }

  public createPokemonSprite() {
    const pokemonSprite = this.scene.add.sprite(155, 90, '').setOrigin(0, 0);
    pokemonSprite.width = 30;
    pokemonSprite.height = 30;
    pokemonSprite.displayWidth = pokemonSprite.width;
    pokemonSprite.displayHeight = pokemonSprite.height;
    return pokemonSprite;
  }

  public createPokemonName(pokemon: Pokemon) {
    this.scene.add
      .text(115, 55, `${pokemon.name}`, { fontSize: 14, align: 'center' })
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
      .text(115, 150, text, { fontSize: 18, align: 'center' })
      .setOrigin(0, 0);
  }

  public createBackImage() {
    const backImage = this.scene.add
      .image(285, 248, 'back-arrow')
      .setOrigin(0, 0);
    backImage.width = 40;
    backImage.height = 40;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
