import Phaser from 'phaser';
import { pokemon_types } from '~/constants/Constants';
import { Pokemon } from '~/types/myTypes';

export default class BattleMovesGraphicsManager {
  constructor(public scene: Phaser.Scene) {}

  public createBackground() {
    const bg = this.scene.add.image(0, 0, 'battle-moves-bg').setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = this.scene.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createMoveBox(
    boxX: number,
    boxY: number,
    moveType: string
  ) {
    const moveBox = this.scene.add
      .image(boxX, boxY, `move-${moveType}`)
      .setOrigin(0, 0);
    moveBox.width = screen.width * 0.1251830161;
    moveBox.height = screen.height * 0.078125;
    moveBox.displayWidth = moveBox.width;
    moveBox.displayHeight = moveBox.height;
    return moveBox;
  }

  public createMoveBoxSelector(
    boxX: number,
    boxY: number,
    moveBox: Phaser.GameObjects.Image
  ) {
    const moveBoxSelector = this.scene.add
      .image(boxX, boxY, 'selector')
      .setOrigin(0, 0);
    moveBoxSelector.width = moveBox.width;
    moveBoxSelector.height = moveBox.height;
    moveBoxSelector.displayWidth = moveBoxSelector.width;
    moveBoxSelector.displayHeight = moveBoxSelector.height;
    moveBoxSelector.visible = false;
    return moveBoxSelector;
  }

  public createMoveText(boxX: number, boxY: number, name: string, pp: number, maxPP: number) {
    const moveName = this.scene.add
      .text(boxX + screen.width * 0.0263543192, boxY + screen.height * 0.0130208333, `${name}`, {
        fontSize: screen.width * 0.0117130307,
      })
      .setOrigin(0, 0);
    moveName.setAlign('center');

    const ppText = this.scene.add
      .text(boxX + screen.width * 0.0527086384, boxY + screen.height * 0.0520833333, 'PP', {
        fontSize: screen.width * 0.0117130307,
      })
      .setOrigin(0, 0);
    ppText.setAlign('center');

    const ppQuantity = this.scene.add
      .text(boxX + screen.width * 0.074670571, boxY + screen.height * 0.0520833333, `${pp}/${maxPP}`, {
        fontSize: screen.width * 0.0117130307,
      })
      .setOrigin(0, 0);
    ppQuantity.setAlign('center');
  }

  public createMoveTypeImage(
    boxX: number,
    boxY: number,
    moveType: string
  ) {
    const moveTypeImage = this.scene.add
      .image(boxX + screen.width * 0.0175695461, boxY + screen.height * 0.04296875, `${moveType}`)
      .setOrigin(0, 0);
    moveTypeImage.width = screen.width * 0.032942899;
    moveTypeImage.height = screen.height * 0.0260416667;
    moveTypeImage.displayWidth = moveTypeImage.width;
    moveTypeImage.displayHeight = moveTypeImage.height;
    return moveTypeImage;
  }

  public createPlayerPokeBalls(pokemons: Pokemon[]) {
    let playerPokeBallX = screen.width * 0.0622254758;
    for (let i = 0; i < 6; i++, playerPokeBallX += screen.width * 0.0204978038) {
      let texture = '';
      if (pokemons[i].ps > 0) {
        texture = 'battle-ball-normal';
      } else {
        texture = 'battle-ball-fainted';
      }
      const playerPokeBall = this.scene.add
        .image(playerPokeBallX, screen.height * 0.2473958333, texture)
        .setOrigin(0, 0);
      playerPokeBall.width = screen.width * 0.0183016105;
      playerPokeBall.height = screen.height * 0.0325520833;
      playerPokeBall.displayWidth = playerPokeBall.width;
      playerPokeBall.displayHeight = playerPokeBall.height;
    }
  }

  public createBackImage() {
    const backImage = this.scene.add
      .image(screen.width * 0.1720351391, screen.height * 0.2838541667, 'battle-return')
      .setOrigin(0, 0);
    backImage.width = screen.width * 0.0732064422;
    backImage.height = screen.height * 0.078125;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
