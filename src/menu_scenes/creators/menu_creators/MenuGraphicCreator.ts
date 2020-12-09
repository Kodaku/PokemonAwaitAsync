import Phaser from 'phaser';
import { iconsUnselected, iconText } from '~/constants/Constants';

export default class MenuGraphicCreator {
  constructor(public scene: Phaser.Scene) {}

  public createPanel(
    panelX: number,
    panelY: number,
    menu: Phaser.GameObjects.Image
  ): Phaser.GameObjects.Image {
    const panel = this.scene.add
      .image(panelX, panelY, 'panel-unselected')
      .setOrigin(0, 0);
    panel.width = menu.width / 2;
    panel.height = menu.height / 5;
    panel.displayWidth = panel.width;
    panel.displayHeight = panel.height;
    return panel;
  }

  public createIcon(
    panelX: number,
    panelY: number,
    panel: Phaser.GameObjects.Image,
    index: number
  ): Phaser.GameObjects.Image {
    const icon = this.scene.add
      .image(panelX + 3, panelY + panel.height / 4 - 5, iconsUnselected[index])
      .setOrigin(0, 0);
    icon.width = 30;
    icon.height = 35;
    icon.displayWidth = icon.width;
    icon.displayHeight = icon.height;
    return icon;
  }

  public createText(
    panelX: number,
    panelY: number,
    panel: Phaser.GameObjects.Image,
    index: number
  ) {
    const text = this.scene.add.text(
      panelX + panel.width / 3,
      panelY + panel.height / 2 - 5,
      iconText[index]
    );
    return text;
  }

  public createExit(menu: Phaser.GameObjects.Image) {
    const exit = this.scene.add
      .image(menu.width / 1.1, menu.height / 1.15, 'exit-1')
      .setOrigin(0, 0);
    exit.width = 30;
    exit.height = 30;
    exit.displayWidth = exit.width;
    exit.displayHeight = exit.height;
    return exit;
  }
}
