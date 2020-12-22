import Phaser from 'phaser';
import BattleBag from './BattleBag';

export default class BattleBackground extends Phaser.Scene {
  constructor() {
    super('battle-background');
  }

  create(data: { sceneToRemove: string }) {
    this.scene.remove(data.sceneToRemove);
    const bg = this.add.image(0, 0, 'battle-bg').setOrigin(0, 0);
    bg.width = this.game.config.width as number;
    bg.height = this.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    this.scene.add('battle-bag', BattleBag, true, {
      sceneToRemove: 'battle-background',
    });
  }
}
