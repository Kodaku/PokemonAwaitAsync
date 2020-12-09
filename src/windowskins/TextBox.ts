import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import { Reference } from '~/types/myTypes';
import Box from './Box';

export default class TextBox extends Box {
  constructor(public scene: Phaser.Scene, public reference: Reference) {
    super(scene, reference);
  }

  public doAction() {
    this.waitDestroy = true;
    this.waitA = true;
  }

  public setSentence(text: string) {
    super.setSentence(text);
    this.scene.input.keyboard.on('keydown-A', () => {
      if (this.waitA) {
        this.texts.forEach((el) => el.destroy());
        console.log('A pressed');
        this.texts = [];
        this.pause.setVisible(false);
        this.textY = this.startY;
        this.textX = this.startX;
        if (this.waitDestroy && this.waitA) {
          sceneEvents.emit('end-text');
          this.destroyBox();
        }
        this.waitA = false;
      }
    });
  }
}
