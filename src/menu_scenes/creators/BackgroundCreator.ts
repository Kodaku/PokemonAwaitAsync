import Phaser from 'phaser';

export default class BackgroundCreator {
  public createBackground(scene: Phaser.Scene, texture: string) {
    const menu = scene.add.image(0, 0, texture).setOrigin(0, 0);
    menu.height = scene.game.config.height as number;
    menu.width = scene.game.config.width as number;
    menu.displayHeight = menu.height;
    menu.displayWidth = menu.width;
    return menu;
  }
}
