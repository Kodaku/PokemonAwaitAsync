import Phaser from 'phaser';
import BattleMemberSwitch from './BattleMemberSwitch';
import BattleMenu from './BattleMenu';

export default class BattlePartyMenu extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  constructor() {
    super('battle-party-menu');
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

    let boxX = 0;
    let boxY = 13;
    for (let i = 0; i < 6; i++) {
      const partyMemberBox = this.add
        .image(boxX, boxY, 'inactive-box')
        .setOrigin(0, 0);
      partyMemberBox.width = 171;
      partyMemberBox.height = 70;
      partyMemberBox.displayWidth = partyMemberBox.width;
      partyMemberBox.displayHeight = partyMemberBox.height;

      const partyMemberBoxSelector = this.add
        .image(boxX, boxY, 'selector')
        .setOrigin(0, 0);
      partyMemberBoxSelector.width = partyMemberBox.width;
      partyMemberBoxSelector.height = partyMemberBox.height;
      partyMemberBoxSelector.displayWidth = partyMemberBoxSelector.width;
      partyMemberBoxSelector.displayHeight = partyMemberBoxSelector.height;
      partyMemberBoxSelector.visible = false;

      this.panels.push(partyMemberBox);
      this.selectors.push(partyMemberBoxSelector);

      const pokemonName = this.add
        .text(boxX + 40, boxY + 8, 'Template Name', {
          fontSize: 12,
          align: 'center',
        })
        .setOrigin(0, 0);
      const memberLevel = this.add
        .text(boxX + 10, boxY + 45, 'Lv.50', {
          fontSize: 12,
          align: 'center',
        })
        .setOrigin(0, 0);
      const partyMemberSprite = this.add
        .sprite(boxX + 4, boxY + 15, '')
        .setOrigin(0, 0);
      partyMemberSprite.width = 30;
      partyMemberSprite.height = 30;
      partyMemberSprite.displayWidth = partyMemberSprite.width;
      partyMemberSprite.displayHeight = partyMemberSprite.height;

      const hpBar = this.add
        .image(boxX + 40, boxY + 30, 'hp-bar')
        .setOrigin(0, 0);
      hpBar.width = 100;
      hpBar.height = hpBar.height;
      hpBar.displayWidth = hpBar.width;
      hpBar.displayHeight = hpBar.height;

      const hpRect = this.add
        .rectangle(
          boxX + 64.5,
          boxY + 36,
          hpBar.width / 1.35,
          hpBar.height / 3.1,
          0x00ff4a
        )
        .setOrigin(0, 0);

      const hpText = this.add
        .text(boxX + 70, boxY + 45, `${555}/${555}`, {
          fontSize: 14,
          align: 'center',
        })
        .setOrigin(0, 0);

      boxX += partyMemberBox.width;
      if (boxX + 20 > (this.game.config.width as number)) {
        boxX = 0;
        boxY += partyMemberBox.height + 5;
      }
    }

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
      'keydown-L',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.L;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-U',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.U;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-D',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.D;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.cursor !== -1) {
          this.switchOff();
          this.scene.add('battle-member-switch', BattleMemberSwitch, true, {
            sceneToRemove: 'battle-party-menu',
            bPressedCount: 0,
          });
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-B',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.B;
        this.bPressedCount++;
        if (this.bPressedCount > 0) {
          this.switchOff();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-party-menu',
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
      case Phaser.Input.Keyboard.KeyCodes.L: {
        this.cursor--;
        if (this.cursor < 0) {
          this.cursor = 0;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.U: {
        this.cursor -= 2;
        if (this.cursor < 0) {
          this.cursor += 2;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.D: {
        this.cursor += 2;
        if (this.cursor >= this.panels.length) {
          this.cursor -= 2;
        }
        break;
      }
    }
  }

  private switchOff() {
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-B');
  }
}
