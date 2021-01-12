import Phaser from 'phaser';
import { pokemon_types } from '~/constants/Constants';

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
    indexes: number[],
    index: number
  ) {
    const moveBox = this.scene.add
      .image(boxX, boxY, `move-${pokemon_types[indexes[index]]}`)
      .setOrigin(0, 0);
    moveBox.width = 171;
    moveBox.height = 60;
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

  public createMoveText(boxX: number, boxY: number, name: string) {
    const moveName = this.scene.add
      .text(boxX + 36, boxY + 10, `${name}`, {
        fontSize: 16,
      })
      .setOrigin(0, 0);
    moveName.setAlign('center');

    const ppText = this.scene.add
      .text(boxX + 72, boxY + 40, 'PP', {
        fontSize: 16,
      })
      .setOrigin(0, 0);
    ppText.setAlign('center');

    const ppQuantity = this.scene.add
      .text(boxX + 102, boxY + 40, `${20}/${20}`, {
        fontSize: 16,
      })
      .setOrigin(0, 0);
    ppQuantity.setAlign('center');
  }

  public createMoveTypeImage(
    boxX: number,
    boxY: number,
    indexes: number[],
    index: number
  ) {
    const moveTypeImage = this.scene.add
      .image(boxX + 24, boxY + 33, `${pokemon_types[indexes[index]]}`)
      .setOrigin(0, 0);
    moveTypeImage.width = 45;
    moveTypeImage.height = 20;
    moveTypeImage.displayWidth = moveTypeImage.width;
    moveTypeImage.displayHeight = moveTypeImage.height;
    return moveTypeImage;
  }

  public createPlayerPokeBalls() {
    let playerPokeBallX = 85;
    for (let i = 0; i < 6; i++, playerPokeBallX += 28) {
      const playerPokeBall = this.scene.add
        .image(playerPokeBallX, 190, 'battle-ball-normal')
        .setOrigin(0, 0);
      playerPokeBall.width = 25;
      playerPokeBall.height = 25;
      playerPokeBall.displayWidth = playerPokeBall.width;
      playerPokeBall.displayHeight = playerPokeBall.height;
    }
  }

  public createBackImage() {
    const backImage = this.scene.add
      .image(235, 218, 'battle-return')
      .setOrigin(0, 0);
    backImage.width = 100;
    backImage.height = 60;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
