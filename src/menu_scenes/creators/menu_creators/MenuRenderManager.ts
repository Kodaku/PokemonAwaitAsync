import Phaser from 'phaser';
import { iconsSelected, iconsUnselected } from '~/constants/Constants';

export default class MenuRenderManager {
  private iconsText: Phaser.GameObjects.Text[] = [];
  public panels: Phaser.GameObjects.Image[] = [];
  public icons: Phaser.GameObjects.Image[] = [];

  public pushPanel(panel: Phaser.GameObjects.Image, index: number) {
    this.panels[index] = panel;
  }

  public pushIcon(icon: Phaser.GameObjects.Image, index: number) {
    this.icons[index] = icon;
  }

  public pushIconText(iconText: Phaser.GameObjects.Text, index: number) {
    this.iconsText[index] = iconText;
  }

  public renderAll(cursorPosition: number) {
    for (let i = 0; i < this.panels.length; i++) {
      if (i === cursorPosition) {
        this.panels[i].setTexture('panel-selected');
        this.icons[i].setTexture(iconsSelected[i]);
      } else {
        this.panels[i].setTexture('panel-unselected');
        this.icons[i].setTexture(iconsUnselected[i]);
      }
    }
  }
}
