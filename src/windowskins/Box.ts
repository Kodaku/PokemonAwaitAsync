import Phaser from 'phaser';
import { createPauseAnims } from '~/scenes/animations/pauseAnims';
import { Reference } from '~/types/myTypes';

export default class Box {
  protected box: Phaser.GameObjects.Image;
  protected counter!: number;
  protected sentence!: string;
  protected textX!: number;
  protected textY!: number;
  protected startX!: number;
  protected startY!: number;
  protected pause!: Phaser.GameObjects.Sprite;
  protected texts!: Phaser.GameObjects.Text[];
  protected waitA!: boolean;
  protected cannotMove!: boolean;
  protected waitDestroy!: boolean;
  constructor(public scene: Phaser.Scene, public reference: Reference) {
    this.box = this.scene.add.image(reference.x, reference.y, 'box');
    this.box.width = 350;
    this.box.height = 60;
    this.box.displayHeight = 60;
    this.box.displayWidth = 350;
    this.box.setX(this.box.x + this.reference.width / 2);
    this.box.setY(this.box.y + 2 * this.reference.height);
    this.box.setDepth(100);
  }

  public destroyBox() {
    this.scene.input.keyboard.off('keydown-A');
    this.box.destroy();
  }

  public async displayText() {
    if (this.counter < this.sentence.length) {
      this.showText();
    } else {
      this.doAction();
    }
  }

  protected doAction() {}

  public setSentence(text: string) {
    this.setBox(text);
  }

  public getCanMove(): boolean {
    return this.cannotMove;
  }

  private showText() {
    this.textX += 8;
    if (this.textX > this.startX + this.box.width - 30) {
      this.textX = this.startX;
      this.textY += this.box.height / 2 - this.box.height / 6;
      if (this.textY > this.box.height / 2 + this.startY && !this.waitA) {
        this.waitA = true;
        this.pause.setVisible(true);
        this.pause.anims.play('pause_anim');
      }
    } else if (!this.waitA) {
      const letter = this.scene.add
        .text(this.textX, this.textY, this.sentence.charAt(this.counter++), {
          color: '000000',
        })
        .setDepth(101);
      this.texts.push(letter);
    }
  }

  private setBox(text: string) {
    this.sentence = text;
    this.texts = [];
    this.waitA = false;
    this.waitDestroy = false;
    this.cannotMove = true;
    this.startX = this.box.x - this.box.width / 2 + this.box.width / 35;
    this.startY = this.box.y - this.box.height / 2 + this.box.height / 5;
    this.textX = this.startX;
    this.textY = this.startY;
    this.counter = 0;
    this.pause = this.scene.add.sprite(
      this.box.x + this.box.width / 2 - 10,
      this.box.y + this.box.height / 2 - 10,
      'pause-img'
    );
    this.pause.setDepth(101);
    this.pause.visible = false;
    createPauseAnims(this.scene.anims);
  }

  public reset() {}
}
