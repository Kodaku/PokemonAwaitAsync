import Phaser from 'phaser';
import BattlePartyMenu from './BattlePartyMenu';

export default class BattleMemberSwitch extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  constructor() {
    super('battle-member-switch');
  }

  create(data: { sceneToRemove: string; bPressedCount: number }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.cursor = -1;
    const bg = this.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.game.config.width as number;
    bg.height = this.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;

    const bigBox = this.add.image(60, 30, 'big-box').setOrigin(0, 0);
    bigBox.width = 230;
    bigBox.height = 170;
    bigBox.displayWidth = bigBox.width;
    bigBox.displayHeight = bigBox.height;

    const bigBoxSelector = this.add.image(60, 30, 'selector').setOrigin(0, 0);
    bigBoxSelector.width = 230;
    bigBoxSelector.height = 170;
    bigBoxSelector.displayWidth = bigBoxSelector.width;
    bigBoxSelector.displayHeight = bigBoxSelector.height;
    bigBoxSelector.visible = false;

    this.panels.push(bigBox);
    this.selectors.push(bigBoxSelector);

    const pokemonSprite = this.add.sprite(155, 90, '').setOrigin(0, 0);
    pokemonSprite.width = 30;
    pokemonSprite.height = 30;
    pokemonSprite.displayWidth = pokemonSprite.width;
    pokemonSprite.displayHeight = pokemonSprite.height;

    const pokemonName = this.add
      .text(115, 55, 'Template Name', { fontSize: 14, align: 'center' })
      .setOrigin(0, 0);

    const inBattle = this.add
      .text(115, 150, 'IN BATTLE?', { fontSize: 18, align: 'center' })
      .setOrigin(0, 0);

    const backImage = this.add.image(285, 248, 'back-arrow').setOrigin(0, 0);
    backImage.width = 40;
    backImage.height = 40;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    this.input.keyboard.on(
      'keydown-R',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.cursor !== -1) {
          console.log('hello from member switch');
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-B',
      () => {
        this.bPressedCount++;
        console.log(this.bPressedCount);
        if (this.bPressedCount > 0) {
          this.switchOff();
          this.scene.add('battle-party-menu', BattlePartyMenu, true, {
            sceneToRemove: 'battle-member-switch',
            bPressedCount: -1,
          });
        }
      },
      this
    );
  }

  private renderAll(): void {
    for (let i = 0; i < this.panels.length; i++) {
      if (i == this.cursor) {
        this.selectors[i].visible = true;
      } else {
        this.selectors[i].visible = false;
      }
    }
  }

  private updateCursor(): void {
    switch (this.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.R: {
        this.cursor++;
        if (this.cursor >= this.panels.length) {
          this.cursor--;
        }
        break;
      }
    }
  }

  private switchOff() {
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-B');
  }
}
