import Phaser from 'phaser';
import { Pokemon } from '~/types/myTypes';

export default class BattlePartyMenuGraphicsManager {
  private maxHealths: number[] = [];
  constructor(public scene: Phaser.Scene) {}

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

  public createBackground() {
    const bg = this.scene.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = this.scene.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createPartyMemberBox(boxX: number, boxY: number) {
    const partyMemberBox = this.scene.add
      .image(boxX, boxY, 'inactive-box')
      .setOrigin(0, 0);
    partyMemberBox.width = 171;
    partyMemberBox.height = 70;
    partyMemberBox.displayWidth = partyMemberBox.width;
    partyMemberBox.displayHeight = partyMemberBox.height;
    return partyMemberBox;
  }

  public createPartyMemberBoxSelector(
    boxX: number,
    boxY: number,
    partyMemberBox: Phaser.GameObjects.Image
  ) {
    const partyMemberBoxSelector = this.scene.add
      .image(boxX, boxY, 'selector')
      .setOrigin(0, 0);
    partyMemberBoxSelector.width = partyMemberBox.width;
    partyMemberBoxSelector.height = partyMemberBox.height;
    partyMemberBoxSelector.displayWidth = partyMemberBoxSelector.width;
    partyMemberBoxSelector.displayHeight = partyMemberBoxSelector.height;
    partyMemberBoxSelector.visible = false;
    return partyMemberBoxSelector;
  }

  public createMemberText(boxX: number, boxY: number, pokemon: Pokemon) {
    const pokemonName = this.scene.add
      .text(boxX + 40, boxY + 8, `${pokemon.name}`, {
        fontSize: 12,
        align: 'center',
      })
      .setOrigin(0, 0);
    const memberLevel = this.scene.add
      .text(boxX + 10, boxY + 45, 'Lv.50', {
        fontSize: 12,
        align: 'center',
      })
      .setOrigin(0, 0);
  }

  public createPartyMemberSprite(boxX: number, boxY: number) {
    const partyMemberSprite = this.scene.add
      .sprite(boxX + 4, boxY + 15, '')
      .setOrigin(0, 0);
    partyMemberSprite.width = 20;
    partyMemberSprite.height = 20;
    partyMemberSprite.displayWidth = partyMemberSprite.width;
    partyMemberSprite.displayHeight = partyMemberSprite.height;
    return partyMemberSprite;
  }

  public createHpBar(boxX: number, boxY: number) {
    const hpBar = this.scene.add
      .image(boxX + 40, boxY + 30, 'hp-bar')
      .setOrigin(0, 0);
    hpBar.width = 100;
    hpBar.height = hpBar.height;
    hpBar.displayWidth = hpBar.width;
    hpBar.displayHeight = hpBar.height;
    return hpBar;
  }

  public createHpRect(
    boxX: number,
    boxY: number,
    currentHealth: number,
    hpBar: Phaser.GameObjects.Image,
    maxWidth: number,
    pokemon: Pokemon
  ) {
    const maxHealth = pokemon.maxPs;
    this.maxHealths.push(maxHealth);
    const rectWidth = this.computeRectWidth(currentHealth, maxHealth, maxWidth);
    const hpRect = this.scene.add
      .rectangle(
        boxX + 64.5,
        boxY + 36,
        rectWidth,
        hpBar.height / 3.1,
        0x00ff4a
      )
      .setOrigin(0, 0);
    if (
      pokemon.ps < pokemon.maxPs * (40 / 100) &&
      pokemon.ps >= pokemon.maxPs * (15 / 100)
    ) {
      hpRect.fillColor = 0xf7b500;
    } else if (pokemon.ps < pokemon.maxPs * (15 / 100)) {
      hpRect.fillColor = 0xe71410;
    } else {
      hpRect.fillColor = 0x00bf37;
    }
    return hpRect;
  }

  public createHpText(
    boxX: number,
    boxY: number,
    pokemon: Pokemon,
    index: number
  ) {
    const hpText = this.scene.add
      .text(boxX + 70, boxY + 45, `${pokemon.ps}/${this.maxHealths[index]}`, {
        fontSize: 14,
        align: 'center',
      })
      .setOrigin(0, 0);
    return hpText;
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
