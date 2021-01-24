import Phaser from 'phaser';
import Box from './Box';
import { sceneEvents } from '~/events/EventCenter';
import { Reference } from '~/types/myTypes';

export default class YesNoBox extends Box {
  private waitForYesNo!: boolean;
  private canChoose!: boolean;
  private yesNoBox!: Phaser.GameObjects.Image;
  private arrow!: Phaser.GameObjects.Image;
  private textYes!: Phaser.GameObjects.Text;
  private textNo!: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private pressCounter!: number;
  private reply!: string;
  constructor(public scene: Phaser.Scene, public reference: Reference) {
    super(scene, reference);
  }

  public doAction() {
    this.waitForYesNo = true;
    this.waitA = true;
  }

  public setSentence(text: string) {
    super.setSentence(text);
    this.waitForYesNo = false;
    this.pressCounter = 0;
    this.canChoose = false;
    this.reply = '';
    sceneEvents.on('choose', this.handleChoose, this);
    this.scene.input.keyboard.on('keydown-A', () => {
      if (this.waitA) {
        this.pause.setVisible(false);
        this.textY = this.startY;
        this.textX = this.startX;
        if (this.waitForYesNo && this.waitA) {
          //we don't want to press A another time and redraw all
          if (this.pressCounter < 1) {
            this.pressCounter++;
            this.yesNoBox = this.scene.add.image(0, 0, 'yes-no-box');
            this.yesNoBox.setDepth(100);
            this.yesNoBox.width = 60;
            this.yesNoBox.height = 60;
            this.yesNoBox.displayWidth = 60;
            this.yesNoBox.displayHeight = 60;
            this.yesNoBox.setX(this.box.x + this.box.width / 2 - (48 / 1366) * screen.width);
            this.yesNoBox.setY(this.box.y - (48 / 768) * screen.height);
            this.arrow = this.scene.add
              .image(0, 0, 'pause-img')
              .setRotation(-1.5708);
            // this.scene.add.circle(
            //   this.yesNoBox.x,
            //   this.yesNoBox.y,
            //   5,
            //   0x000000
            // );
            this.textYes = this.scene.add
              .text(this.yesNoBox.x - (10 / 1366) * screen.width, this.yesNoBox.y - (15 / 768) * screen.height, 'YES', {
                color: '000000',
              })
              .setDepth(101);
            this.textNo = this.scene.add
              .text(this.yesNoBox.x - (5 / 1366) * screen.width, this.yesNoBox.y + (5 / 768) * screen.height, 'NO', {
                color: '000000',
              })
              .setDepth(101);
            this.arrow.setX(this.textYes.x - (5 / 1366) * screen.width);
            this.arrow.setY(this.textYes.y + (5 / 768) * screen.height);
            this.arrow.setDepth(101);
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            setInterval(() => {
              this.canChoose = true;
              if (this.cursors.down?.isDown) {
                this.arrow.setY(this.textNo.y + (5 / 768) * screen.height);
              } else if (this.cursors.up?.isDown) {
                this.arrow.setY(this.textYes.y + (5 / 768) * screen.height);
              }
            }, 50);
            //go into this code when pressing A and showing the YES NO Box
          } else if (this.canChoose) {
            if (this.arrow.y == this.textYes.y + (5 / 768) * screen.height) {
              this.reply = 'YES';
              sceneEvents.emit('choose');
            } else if (this.arrow.y == this.textNo.y + (5 / 768) * screen.height) {
              this.reply = 'NO';
              sceneEvents.emit('choose');
            }
          }
        } else {
          this.texts.forEach((el) => el.destroy());
          this.texts = [];
        }
        this.waitA = false;
      }
    });
  }

  private async handleChoose() {
    // await this.sendReply();
    this.destroyBox();
    sceneEvents.emit('get-my-reply', this.reply, this.reference);
    sceneEvents.emit('end-text');
    sceneEvents.off('choose');
  }

  private async sendReply() {
    // await postReplyPromise(this.reply, this.reference);
  }

  public destroyBox() {
    super.destroyBox();
    this.yesNoBox.destroy();
    this.arrow.destroy();
    this.pause.destroy();
    this.textNo.destroy();
    this.textYes.destroy();
    this.texts.forEach((el) => el.destroy());
    this.texts = [];
  }

  public getReply(): string {
    return this.reply;
  }
}
