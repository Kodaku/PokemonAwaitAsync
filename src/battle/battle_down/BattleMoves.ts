import Phaser from 'phaser';
import { pokemon_types, url } from '~/constants/Constants';
import BattleMenu from './BattleMenu';
import axios from 'axios';
import { sceneEvents } from '~/events/EventCenter';
import BattlePartyMenu, { BattlePartyState } from './BattlePartyMenu';
import { PartyMenuState } from '~/enums/depthLevels';

const notifyUpperAttackPromise = () => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/attack/${'Template Attack'}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

export default class BattleMoves extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  private shouldPressKey: boolean = true;
  constructor() {
    super('battle-moves-menu');
  }

  create(data: { sceneToRemove: string }) {
    this.scene.remove(data.sceneToRemove);
    this.cursor = -1;
    let indexes: number[] = [];
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * pokemon_types.length);
      indexes.push(index);
    }
    const bg = this.createBackground();

    let boxX = 0;
    let boxY = 50;
    for (let i = 0; i < 4; i++) {
      // Move Box and selector
      const moveBox = this.createMoveBox(boxX, boxY, indexes, i);
      const moveBoxSelector = this.createMoveBoxSelector(boxX, boxY, moveBox);
      this.panels.push(moveBox);
      this.selectors.push(moveBoxSelector);
      // Move Text
      this.createMoveText(boxX, boxY);
      // Move type image
      const moveTypeImage = this.createMoveTypeImage(boxX, boxY, indexes, i);

      boxX += moveBox.width;
      if (boxX + 20 > (this.game.config.width as number)) {
        boxX = 0;
        boxY += moveBox.height + 5;
      }
    }
    //Player poke balls
    this.createPlayerPokeBalls();
    // Back Image
    const backImage = this.createBackImage();
    //TODO: Input keyboards
    this.input.keyboard.on(
      'keydown-R',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-L',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.L;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-U',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.U;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-D',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.D;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.cursor !== -1) {
          if (this.shouldPressKey) {
            this.shouldPressKey = false;
            this.notifyUpperScreen();
          }
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-B',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.B;
          this.switchOff();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-moves-menu',
          });
        }
      },
      this
    );

    sceneEvents.on(
      'can-press-key',
      () => {
        this.shouldPressKey = true;
      },
      true
    );
    sceneEvents.on('manage-move-action', this.manageReply, this);
  }

  private async notifyUpperScreen() {
    await notifyUpperAttackPromise();
    this.createSSE();
  }

  private createSSE() {
    const sse = new EventSource(`${url}/delayed/notify-lower`);
    sse.addEventListener('message', async function (ev) {
      console.log(ev.data);
      sceneEvents.emit('manage-move-action', ev.data);
      sse.close();
    });
  }

  private manageReply(reply: string) {
    switch (reply) {
      case 'FAINTED': {
        this.switchOff();
        this.scene.add('battle-party-menu', BattlePartyMenu, true, {
          sceneToRemove: 'battle-moves-menu',
          bPressedCount: 0,
          state: BattlePartyState.SWITCH_FAINTED,
        });
        break;
      }
      default: {
        sceneEvents.emit('can-press-key');
        break;
      }
    }
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
    sceneEvents.off('can-press-key');
    sceneEvents.off('manage-move-action');
  }

  private createBackground() {
    const bg = this.add.image(0, 0, 'battle-moves-bg').setOrigin(0, 0);
    bg.width = this.game.config.width as number;
    bg.height = this.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  private createMoveBox(
    boxX: number,
    boxY: number,
    indexes: number[],
    index: number
  ) {
    const moveBox = this.add
      .image(boxX, boxY, `move-${pokemon_types[indexes[index]]}`)
      .setOrigin(0, 0);
    moveBox.width = 171;
    moveBox.height = 60;
    moveBox.displayWidth = moveBox.width;
    moveBox.displayHeight = moveBox.height;
    return moveBox;
  }

  private createMoveBoxSelector(
    boxX: number,
    boxY: number,
    moveBox: Phaser.GameObjects.Image
  ) {
    const moveBoxSelector = this.add
      .image(boxX, boxY, 'selector')
      .setOrigin(0, 0);
    moveBoxSelector.width = moveBox.width;
    moveBoxSelector.height = moveBox.height;
    moveBoxSelector.displayWidth = moveBoxSelector.width;
    moveBoxSelector.displayHeight = moveBoxSelector.height;
    moveBoxSelector.visible = false;
    return moveBoxSelector;
  }

  private createMoveText(boxX: number, boxY: number) {
    const moveName = this.add
      .text(boxX + 36, boxY + 10, 'Flamethrower', {
        fontSize: 16,
      })
      .setOrigin(0, 0);
    moveName.setAlign('center');

    const ppText = this.add
      .text(boxX + 72, boxY + 40, 'PP', {
        fontSize: 16,
      })
      .setOrigin(0, 0);
    ppText.setAlign('center');

    const ppQuantity = this.add
      .text(boxX + 102, boxY + 40, `${20}/${20}`, {
        fontSize: 16,
      })
      .setOrigin(0, 0);
    ppQuantity.setAlign('center');
  }

  private createMoveTypeImage(
    boxX: number,
    boxY: number,
    indexes: number[],
    index: number
  ) {
    const moveTypeImage = this.add
      .image(boxX + 24, boxY + 33, `${pokemon_types[indexes[index]]}`)
      .setOrigin(0, 0);
    moveTypeImage.width = 45;
    moveTypeImage.height = 20;
    moveTypeImage.displayWidth = moveTypeImage.width;
    moveTypeImage.displayHeight = moveTypeImage.height;
    return moveTypeImage;
  }

  private createPlayerPokeBalls() {
    let playerPokeBallX = 85;
    for (let i = 0; i < 6; i++, playerPokeBallX += 28) {
      const playerPokeBall = this.add
        .image(playerPokeBallX, 190, 'battle-ball-normal')
        .setOrigin(0, 0);
      playerPokeBall.width = 25;
      playerPokeBall.height = 25;
      playerPokeBall.displayWidth = playerPokeBall.width;
      playerPokeBall.displayHeight = playerPokeBall.height;
    }
  }

  private createBackImage() {
    const backImage = this.add.image(235, 218, 'battle-return').setOrigin(0, 0);
    backImage.width = 100;
    backImage.height = 60;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
