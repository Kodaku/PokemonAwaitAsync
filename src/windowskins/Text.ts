import Phaser from 'phaser';

export default class Text {
  private textComponent: Phaser.GameObjects.Text;
  constructor(
    public scene: Phaser.Scene,
    public text: string,
    public offsetX: number,
    public offsetY: number
  ) {
    this.textComponent = scene.add.text(0, 0, text, {
      color: '#ffffff',
      fontSize: 15,
      //   align: 'center',
    });
    this.textComponent.setDepth(100);
  }

  setTextPosition(x: number, y: number) {
    this.textComponent.setX(x + this.offsetX - this.textComponent.width / 2);
    this.textComponent.setY(y + this.offsetY);
  }
}
