import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import BattleBag from './BattleBag';
import BattleItemDescription from './BattleItemDescription';
import axios from 'axios';
import menu from '~/menu';

enum ItemCursorPosition {
  ARROWLEFT = 6,
  ARROWRIGHT = 7,
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

export default class BattleItemMenu extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  constructor() {
    super('battle-item-menu');
  }

  create(data: { sceneToRemove: string; bPressedCount: number }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.cursor = -1;
    //Background
    const bg = this.createBackground();
    //Items icons
    let itemX = 10;
    let itemY = 13;
    for (let i = 0; i < 6; i++) {
      //Panel and selector
      const menuItem = this.createMenuItem(itemX, itemY);
      const menuItemSelector = this.createMenuItemSelector(itemX, itemY);
      this.panels.push(menuItem);
      this.selectors.push(menuItemSelector);
      //Item text
      this.createItemNameAndQuantity(itemX, itemY);
      // Item image
      const itemImage = this.createItemImage(itemX, itemY);

      itemX += menuItem.width + 10;
      if (itemX + 20 > (this.game.config.width as number)) {
        itemX = 13;
        itemY += menuItem.height + 5;
      }
    }
    // Menu Info Panel
    const menuInfo = this.createMenuInfo();
    // Menu Info text
    const menuInfoText = this.createMenuInfoText();
    // Page Text
    const pageText = this.createPageText();
    // Left arrow and left arrow selector
    const leftArrow = this.createLeftArrow();
    const leftArrowSelector = this.createLeftArrowSelector();
    this.panels.push(leftArrow);
    this.selectors.push(leftArrowSelector);
    // Right arrow and right arrow selector
    const rightArrow = this.createRightArrow();
    const rightArrowSelector = this.createRightArrowSelector();
    this.panels.push(rightArrow);
    this.selectors.push(rightArrowSelector);
    // Back Image
    const backImage = this.createBackImage();
    //TODO: Input keyboard
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
          this.scene.add('battle-bag', BattleBag, true, {
            sceneToRemove: 'battle-item-menu',
            bPressedCount: -1,
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
      case ItemCursorPosition.ARROWLEFT: {
        break;
      }
      case ItemCursorPosition.ARROWRIGHT: {
        break;
      }
      default: {
        this.switchOff();
        this.scene.add('battle-item-description', BattleItemDescription, true, {
          sceneToRemove: 'battle-item-menu',
          bPressedCount: 0,
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

  private createMenuItem(itemX: number, itemY: number) {
    const menuItem = this.add
      .image(itemX, itemY, 'menu-item-unselected')
      .setOrigin(0, 0);
    menuItem.width = 150;
    menuItem.height = 60;
    menuItem.displayWidth = menuItem.width;
    menuItem.displayHeight = menuItem.height;
    return menuItem;
  }

  private createMenuItemSelector(itemX: number, itemY: number) {
    const menuItemSelector = this.add
      .image(itemX, itemY, 'selector')
      .setOrigin(0, 0);
    menuItemSelector.width = 150;
    menuItemSelector.height = 60;
    menuItemSelector.displayWidth = menuItemSelector.width;
    menuItemSelector.displayHeight = menuItemSelector.height;
    menuItemSelector.visible = false;
    return menuItemSelector;
  }

  private createItemNameAndQuantity(itemX: number, itemY: number) {
    const itemText = this.add
      .text(itemX + 35, itemY + 10, 'Template Item', {
        fontSize: 12,
        align: 'center',
      })
      .setOrigin(0, 0);
    const itemQuantity = this.add
      .text(itemX + 60, itemY + 35, 'xSomeQt.', {
        fontSize: 12,
        align: 'center',
      })
      .setOrigin(0, 0);
  }

  private createItemImage(itemX: number, itemY: number) {
    const itemImage = this.add
      .image(itemX + 15, itemY + 28, '')
      .setOrigin(0, 0);
    itemImage.width = 30;
    itemImage.height = 30;
    itemImage.displayWidth = itemImage.width;
    itemImage.displayHeight = itemImage.height;
    return itemImage;
  }

  private createMenuInfo() {
    const menuInfo = this.add.image(110, 225, 'menu-info').setOrigin(0, 0);
    menuInfo.width = 170;
    menuInfo.height = 60;
    menuInfo.displayWidth = menuInfo.width;
    menuInfo.displayHeight = menuInfo.height;
    return menuInfo;
  }

  private createMenuInfoText() {
    this.add
      .text(130, 240, 'HP/PP\nRESTORE', { fontSize: 20, align: 'center' })
      .setOrigin(0, 0);
  }

  private createPageText() {
    this.add
      .text(230, 250, '1/3', { fontSize: 20, align: 'center' })
      .setOrigin(0, 0);
  }

  private createLeftArrow() {
    const leftArrow = this.add.image(5, 248, 'left-arrow').setOrigin(0, 0);
    leftArrow.width = 40;
    leftArrow.height = 40;
    leftArrow.displayWidth = leftArrow.width;
    leftArrow.displayHeight = leftArrow.height;
    return leftArrow;
  }

  private createLeftArrowSelector() {
    const leftArrowSelector = this.add
      .image(5, 248, 'selector')
      .setOrigin(0, 0);
    leftArrowSelector.width = 40;
    leftArrowSelector.height = 40;
    leftArrowSelector.displayWidth = leftArrowSelector.width;
    leftArrowSelector.displayHeight = leftArrowSelector.height;
    leftArrowSelector.visible = false;
    return leftArrowSelector;
  }

  private createRightArrow() {
    const rightArrow = this.add.image(63, 248, 'right-arrow').setOrigin(0, 0);
    rightArrow.width = 40;
    rightArrow.height = 40;
    rightArrow.displayWidth = rightArrow.width;
    rightArrow.displayHeight = rightArrow.height;
    return rightArrow;
  }

  private createRightArrowSelector() {
    const rightArrowSelector = this.add
      .image(63, 248, 'selector')
      .setOrigin(0, 0);
    rightArrowSelector.width = 40;
    rightArrowSelector.height = 40;
    rightArrowSelector.displayWidth = rightArrowSelector.width;
    rightArrowSelector.displayHeight = rightArrowSelector.height;
    rightArrowSelector.visible = false;
    return rightArrowSelector;
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
