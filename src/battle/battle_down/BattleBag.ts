import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import BattleItemMenu from './BattleItemMenu';
import BattleMenu from './BattleMenu';
import axios from 'axios';

enum BagCursorPosition {
  HPRESTORE = 0,
  POKEBALLS = 1,
  STATUSRESTORE = 2,
  BATTLEITEMS = 3,
}
const notifyUpperPromise = () => {
  return new Promise((resolve: (value: string) => void) => {
    axios.get(`${url}/real-time/notify-upper`).then((response) => {
      console.log('Successfully sent');
      console.log(response.data);
      resolve('success');
    });
  });
};
export default class BattleBag extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  constructor() {
    super('battle-bag');
  }

  create(data: { sceneToRemove: string; bPressedCount: number }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.cursor = -1;
    const bg = this.createBackground();
    //Hp restore icon and selector
    const hpRestore = this.createHpRestore();
    const hpRestoreSelector = this.createHpRestoreSelector();
    this.panels.push(hpRestore);
    this.selectors.push(hpRestoreSelector);
    // Poke Balls icon and selector
    const pokeBalls = this.createPokeBalls();
    const pokeBallsSelector = this.createPokeBallsSelector();
    this.panels.push(pokeBalls);
    this.selectors.push(pokeBallsSelector);
    // Status Restore icon and selector
    const statusRestore = this.createStatusRestore();
    const statusRestoreSelector = this.createStatusRestoreSelector();
    this.panels.push(statusRestore);
    this.selectors.push(statusRestoreSelector);
    // Battle Items icon and selector
    const battleItems = this.createBattleItems();
    const battleItemsSelector = this.createBattleItemsSelector();
    this.panels.push(battleItems);
    this.selectors.push(battleItemsSelector);
    // Icons text
    this.createIconsText();
    // Last item used(not available as a functionality in game)
    const lastItemEmpty = this.createLastItemUsed();
    // Back Image
    const backImage = this.createBackImage();

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
          this.notifyUpperScreen();
          this.switchOff();
          this.switchScene();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-B',
      () => {
        this.bPressedCount++;
        if (this.bPressedCount > 0) {
          this.switchOff();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-bag',
            bPressedCount: 0,
          });
        }
      },
      this
    );
  }

  private async notifyUpperScreen() {
    await notifyUpperPromise();
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

  private switchScene() {
    switch (this.cursor) {
      case BagCursorPosition.HPRESTORE: {
        this.scene.add('battle-item-menu', BattleItemMenu, true, {
          sceneToRemove: 'battle-bag',
        });
        break;
      }
      case BagCursorPosition.POKEBALLS: {
        this.scene.add('battle-item-menu', BattleItemMenu, true, {
          sceneToRemove: 'battle-bag',
        });
        break;
      }
      case BagCursorPosition.STATUSRESTORE: {
        this.scene.add('battle-item-menu', BattleItemMenu, true, {
          sceneToRemove: 'battle-bag',
        });
        break;
      }
      case BagCursorPosition.BATTLEITEMS: {
        this.scene.add('battle-item-menu', BattleItemMenu, true, {
          sceneToRemove: 'battle-bag',
        });
        break;
      }
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

  private createHpRestore() {
    const hpRestore = this.add.image(0, 20, 'hp-restore').setOrigin(0, 0);
    hpRestore.width = (this.game.config.width as number) / 2;
    hpRestore.height = (this.game.config.height as number) / 3.5;
    hpRestore.displayWidth = hpRestore.width;
    hpRestore.displayHeight = hpRestore.height;
    return hpRestore;
  }

  private createHpRestoreSelector() {
    const hpRestoreSelector = this.add.image(0, 20, 'selector').setOrigin(0, 0);
    hpRestoreSelector.width = (this.game.config.width as number) / 2;
    hpRestoreSelector.height = (this.game.config.height as number) / 3.5;
    hpRestoreSelector.displayWidth = hpRestoreSelector.width;
    hpRestoreSelector.displayHeight = hpRestoreSelector.height;
    hpRestoreSelector.visible = false;
    return hpRestoreSelector;
  }

  private createPokeBalls() {
    const pokeBalls = this.add
      .image((this.game.config.width as number) / 2, 20, 'poke-balls-menu')
      .setOrigin(0, 0);
    pokeBalls.width = (this.game.config.width as number) / 2;
    pokeBalls.height = (this.game.config.height as number) / 3.5;
    pokeBalls.displayWidth = pokeBalls.width;
    pokeBalls.displayHeight = pokeBalls.height;
    return pokeBalls;
  }

  private createPokeBallsSelector() {
    const pokeBallsSelector = this.add
      .image((this.game.config.width as number) / 2, 20, 'selector')
      .setOrigin(0, 0);
    pokeBallsSelector.width = (this.game.config.width as number) / 2;
    pokeBallsSelector.height = (this.game.config.height as number) / 3.5;
    pokeBallsSelector.displayWidth = pokeBallsSelector.width;
    pokeBallsSelector.displayHeight = pokeBallsSelector.height;
    pokeBallsSelector.visible = false;
    return pokeBallsSelector;
  }

  private createStatusRestore() {
    const statusRestore = this.add
      .image(0, (this.game.config.height as number) / 2.2, 'status-restore')
      .setOrigin(0, 0);
    statusRestore.width = (this.game.config.width as number) / 2;
    statusRestore.height = (this.game.config.height as number) / 3.5;
    statusRestore.displayWidth = statusRestore.width;
    statusRestore.displayHeight = statusRestore.height;
    return statusRestore;
  }

  private createStatusRestoreSelector() {
    const statusRestoreSelector = this.add
      .image(0, (this.game.config.height as number) / 2.2, 'selector')
      .setOrigin(0, 0);
    statusRestoreSelector.width = (this.game.config.width as number) / 2;
    statusRestoreSelector.height = (this.game.config.height as number) / 3.5;
    statusRestoreSelector.displayWidth = statusRestoreSelector.width;
    statusRestoreSelector.displayHeight = statusRestoreSelector.height;
    statusRestoreSelector.visible = false;
    return statusRestoreSelector;
  }

  private createBattleItems() {
    const battleItems = this.add
      .image(
        (this.game.config.width as number) / 2,
        (this.game.config.height as number) / 2.2,
        'battle-items'
      )
      .setOrigin(0, 0);
    battleItems.width = (this.game.config.width as number) / 2;
    battleItems.height = (this.game.config.height as number) / 3.5;
    battleItems.displayWidth = battleItems.width;
    battleItems.displayHeight = battleItems.height;
    return battleItems;
  }

  private createBattleItemsSelector() {
    const battleItemsSelector = this.add
      .image(
        (this.game.config.width as number) / 2,
        (this.game.config.height as number) / 2.2,
        'selector'
      )
      .setOrigin(0, 0);
    battleItemsSelector.width = (this.game.config.width as number) / 2;
    battleItemsSelector.height = (this.game.config.height as number) / 3.5;
    battleItemsSelector.displayWidth = battleItemsSelector.width;
    battleItemsSelector.displayHeight = battleItemsSelector.height;
    battleItemsSelector.visible = false;
    return battleItemsSelector;
  }

  private createIconsText() {
    const hpText = this.add.text(45, 60, 'HP/PP\nRESTORE', {
      fontSize: 19,
      align: 'center',
    });
    const pokeBallText = this.add.text(
      40 + (this.game.config.width as number) / 2,
      60,
      'POKE BALLS',
      {
        fontSize: 19,
        align: 'center',
      }
    );
    const restoreText = this.add.text(
      45,
      40 + (this.game.config.height as number) / 2.2,
      'STATUS\nRESTORE',
      {
        fontSize: 19,
        align: 'center',
      }
    );
    const battleItemText = this.add.text(
      25 + (this.game.config.width as number) / 2,
      40 + (this.game.config.height as number) / 2.2,
      'BATTLE ITEMS',
      {
        fontSize: 19,
        align: 'center',
      }
    );
  }

  private createLastItemUsed() {
    const lastItemEmpty = this.add
      .image(5, 252, 'last-item-empty')
      .setOrigin(0, 0);
    lastItemEmpty.width = 270;
    lastItemEmpty.height = 30;
    lastItemEmpty.displayWidth = lastItemEmpty.width;
    lastItemEmpty.displayHeight = lastItemEmpty.height;
    return lastItemEmpty;
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
