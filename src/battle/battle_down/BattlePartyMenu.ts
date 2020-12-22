import Phaser from 'phaser';
import BattleMemberSwitch from './BattleMemberSwitch';
import BattleMenu from './BattleMenu';
import axios from 'axios';
import { url } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';

export enum BattlePartyState {
  SWITCH,
  SWITCH_FAINTED,
  CURE_HEALTH,
  CURE_STATUS,
}

const notifyHealthUpperScreen = () => {
  console.log('sending promise');
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/increase-health/${20}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyCureUpperScreen = () => {
  console.log('sending cure promise');
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/cure/${'NONE'}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

export default class BattlePartyMenu extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  private hpRects: Phaser.GameObjects.Rectangle[] = [];
  private hpTexts: Phaser.GameObjects.Text[] = [];
  private currentHealths: number[] = [];
  private maxHpRextWidth!: number;
  private state!: BattlePartyState;
  private timeout!: number;
  private timeoutCount: number = 0;
  private zPressed: boolean = false;
  constructor() {
    super('battle-party-menu');
  }

  create(data: {
    sceneToRemove: string;
    bPressedCount: number;
    state: BattlePartyState;
  }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.state = data.state;
    this.cursor = -1;
    const bg = this.createBackground();

    let boxX = 0;
    let boxY = 13;
    for (let i = 0; i < 6; i++) {
      //: Party member box and selector
      const partyMemberBox = this.createPartyMemberBox(boxX, boxY);
      const partyMemberBoxSelector = this.createPartyMemberBoxSelector(
        boxX,
        boxY,
        partyMemberBox
      );
      this.panels.push(partyMemberBox);
      this.selectors.push(partyMemberBoxSelector);
      // Member text
      this.createMemberText(boxX, boxY);
      // Party Member Sprite
      const partyMemberSprite = this.createPartyMemberSprite(boxX, boxY);
      // Hp Bar
      const hpBar = this.createHpBar(boxX, boxY);
      const currentHealth = 300;
      const maxWidth = hpBar.width / 1.35;
      this.maxHpRextWidth = maxWidth;
      const hpRect = this.createHpRect(
        boxX,
        boxY,
        currentHealth,
        hpBar,
        maxWidth
      );
      const hpText = this.createHpText(boxX, boxY);
      this.hpRects.push(hpRect);
      this.hpTexts.push(hpText);
      this.currentHealths.push(currentHealth);

      boxX += partyMemberBox.width;
      if (boxX + 20 > (this.game.config.width as number)) {
        boxX = 0;
        boxY += partyMemberBox.height + 5;
      }
    }
    //Back image
    const backImage = this.createBackImage();
    //TODO: Keyboard input
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
          switch (this.state) {
            case BattlePartyState.SWITCH: {
              this.switchOff();
              this.scene.add('battle-member-switch', BattleMemberSwitch, true, {
                sceneToRemove: 'battle-party-menu',
                bPressedCount: 0,
                state: BattlePartyState.SWITCH,
              });
              break;
            }
            case BattlePartyState.SWITCH_FAINTED: {
              this.switchOff();
              this.scene.add('battle-member-switch', BattleMemberSwitch, true, {
                sceneToRemove: 'battle-party-menu',
                bPressedCount: 0,
                state: BattlePartyState.SWITCH_FAINTED,
              });
              break;
            }
            case BattlePartyState.CURE_HEALTH: {
              sceneEvents.emit('notify-upper-screen-health');
              break;
            }
            case BattlePartyState.CURE_STATUS: {
              sceneEvents.emit('notify-upper-screen-cure');
              break;
            }
          }
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
    sceneEvents.on(
      'notify-upper-screen-health',
      this.notifyUpperScreenForHealth,
      this
    );
    sceneEvents.on(
      'notify-upper-screen-cure',
      this.notifyUpperScreenForCure,
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
    sceneEvents.off('notify-upper-screen-health');
    sceneEvents.off('notify-upper-screen-cure');
  }

  private computeRectWidth(
    currentHealth: number,
    maxHealth: number,
    maxRectWidth: number
  ) {
    let new_width = maxRectWidth * (currentHealth / maxHealth);
    if (new_width >= maxRectWidth) {
      new_width = maxRectWidth;
    }
    return new_width;
  }

  private increaseHealth() {
    this.currentHealths[this.cursor]++;
    if (this.currentHealths[this.cursor] >= 555) {
      this.currentHealths[this.cursor] = 555;
    }
    this.hpRects[this.cursor].width = this.computeRectWidth(
      this.currentHealths[this.cursor],
      555,
      this.maxHpRextWidth
    );
    this.hpRects[this.cursor].displayWidth = this.hpRects[this.cursor].width;
    this.hpTexts[this.cursor].setText(
      `${this.currentHealths[this.cursor]}/${555}`
    );
  }

  private async notifyUpperScreenForHealth() {
    console.log('Sending health notification');
    if (
      this.hpRects[this.cursor].width < this.maxHpRextWidth &&
      !this.zPressed
    ) {
      await notifyHealthUpperScreen();
      this.zPressed = true;
      this.timeout = setInterval(() => {
        this.increaseHealth();
        this.timeoutCount++;
        if (this.timeoutCount >= 20) {
          this.timeoutCount = 0;
          this.zPressed = false;
          clearInterval(this.timeout);
        }
      }, 50);
    } else {
      //TODO: Say that is not possible to increase the health
      console.log('Health is already at its maximum value');
    }
  }

  private async notifyUpperScreenForCure() {
    console.log('Notify for cure');
    if (!this.zPressed) {
      await notifyCureUpperScreen();
    }
  }

  private createBackground() {
    const bg = this.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.game.config.width as number;
    bg.height = this.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  private createPartyMemberBox(boxX: number, boxY: number) {
    const partyMemberBox = this.add
      .image(boxX, boxY, 'inactive-box')
      .setOrigin(0, 0);
    partyMemberBox.width = 171;
    partyMemberBox.height = 70;
    partyMemberBox.displayWidth = partyMemberBox.width;
    partyMemberBox.displayHeight = partyMemberBox.height;
    return partyMemberBox;
  }

  private createPartyMemberBoxSelector(
    boxX: number,
    boxY: number,
    partyMemberBox: Phaser.GameObjects.Image
  ) {
    const partyMemberBoxSelector = this.add
      .image(boxX, boxY, 'selector')
      .setOrigin(0, 0);
    partyMemberBoxSelector.width = partyMemberBox.width;
    partyMemberBoxSelector.height = partyMemberBox.height;
    partyMemberBoxSelector.displayWidth = partyMemberBoxSelector.width;
    partyMemberBoxSelector.displayHeight = partyMemberBoxSelector.height;
    partyMemberBoxSelector.visible = false;
    return partyMemberBoxSelector;
  }

  private createMemberText(boxX: number, boxY: number) {
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
  }

  private createPartyMemberSprite(boxX: number, boxY: number) {
    const partyMemberSprite = this.add
      .sprite(boxX + 4, boxY + 15, '')
      .setOrigin(0, 0);
    partyMemberSprite.width = 30;
    partyMemberSprite.height = 30;
    partyMemberSprite.displayWidth = partyMemberSprite.width;
    partyMemberSprite.displayHeight = partyMemberSprite.height;
    return partyMemberSprite;
  }

  private createHpBar(boxX: number, boxY: number) {
    const hpBar = this.add
      .image(boxX + 40, boxY + 30, 'hp-bar')
      .setOrigin(0, 0);
    hpBar.width = 100;
    hpBar.height = hpBar.height;
    hpBar.displayWidth = hpBar.width;
    hpBar.displayHeight = hpBar.height;
    return hpBar;
  }

  private createHpRect(
    boxX: number,
    boxY: number,
    currentHealth: number,
    hpBar: Phaser.GameObjects.Image,
    maxWidth: number
  ) {
    const maxHealth = 555;
    const rectWidth = this.computeRectWidth(currentHealth, maxHealth, maxWidth);
    const hpRect = this.add
      .rectangle(
        boxX + 64.5,
        boxY + 36,
        rectWidth,
        hpBar.height / 3.1,
        0x00ff4a
      )
      .setOrigin(0, 0);
    return hpRect;
  }

  private createHpText(boxX: number, boxY: number) {
    const hpText = this.add
      .text(boxX + 70, boxY + 45, `${555}/${555}`, {
        fontSize: 14,
        align: 'center',
      })
      .setOrigin(0, 0);
    return hpText;
  }

  private createBackImage() {
    const backImage = this.add.image(285, 248, 'back-arrow').setOrigin(0, 0);
    backImage.width = 40;
    backImage.height = 40;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
