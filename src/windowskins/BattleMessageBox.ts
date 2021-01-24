import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import Box from './Box';

export default class BattleMessageBox extends Box {
  constructor(public scene: Phaser.Scene) {
    super(scene, { height: 0, referenceName: '', width: 0, x: 0, y: 0 });
    this.box.setOrigin(0, 0);
    this.box.setX(0);
    this.box.setY((scene.game.config.height as number) * (3 / 4));
    this.box.width = scene.game.config.width as number;
    this.box.height = (scene.game.config.height as number) / 4;
    this.box.displayWidth = this.box.width;
    this.box.displayHeight = this.box.height;
  }

  public destroyBox() {
    sceneEvents.off('new-text');
  }

  public setSentence(text: string) {
    this.sentence = text;
    this.texts = [];
    this.counter = 0;
    this.waitA = false;
    this.startX = (10 / 1366) * screen.width;
    this.startY = this.box.y + (10 / 768) * screen.height;
    this.textX = this.startX;
    this.textY = this.startY;
    sceneEvents.on('new-text', () => {
      this.texts.forEach((el) => el.destroy());
      this.texts = [];
      this.textY = this.startY;
      this.textX = this.startX;
      sceneEvents.emit('end-text');
    });
  }
}
