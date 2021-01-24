import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import BattleBag from '../battle_bag/BattleBag';
import BattleItemDescription from '../battle_item_description/BattleItemDescription';
import axios from 'axios';
import BattleItemMenuGraphicsManager from './BattleItemMenuGraphicsManager';
import { Item, ItemToString } from '~/types/myTypes';

const notifyUpperPromise = (id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.get(`${url}/real-time/notify-upper/${id}`).then((response) => {
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
  private itemImages: Phaser.GameObjects.Image[] = [];
  private itemNamesText: Phaser.GameObjects.Text[] = [];
  private itemQuantitiesText: Phaser.GameObjects.Text[] = [];
  private pageTexts: Phaser.GameObjects.Text[] = [];
  private userID!: number;
  private items!: Item[];
  private itemNames!: ItemToString[];
  private itemsToParse!: Item[][];
  private pageIndex: number = 1;
  private totalPages!: number;
  constructor() {
    super('battle-item-menu');
  }

  create(data: {
    sceneToRemove: string;
    bPressedCount: number;
    userID: number;
    items: Item[];
    itemNames: ItemToString[];
    itemsToParse: Item[][];
  }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.userID = data.userID;
    this.items = data.items;
    this.itemNames = data.itemNames;
    this.itemsToParse = data.itemsToParse;
    this.totalPages = Math.ceil(this.items.length / 6);
    this.cursor = -1;
    const menuSelectSound = this.sound.add("menu-select-sound");
    const menuChooseSound = this.sound.add("menu-choose-sound");
    const menuCancel = this.sound.add("cancel-sound");
    const graphicsManager = new BattleItemMenuGraphicsManager(this);
    //Background
    const bg = graphicsManager.createBackground();
    //Items icons
    let itemX = screen.width * 0.0073206442;
    let itemY = screen.width * 0.0095168375;
    for (let i = 0; i < this.items.length; i++) {
      //Panel and selector
      if (i > 5 && i % 6 == 0) {
        itemX = screen.width * 0.0073206442;
        itemY = screen.width * 0.0095168375;
      }
      const menuItem = graphicsManager.createMenuItem(itemX, itemY);
      const menuItemSelector = graphicsManager.createMenuItemSelector(
        itemX,
        itemY
      );
      //Item text
      const obj = graphicsManager.createItemNameAndQuantity(
        itemX,
        itemY,
        this.itemNames[i].name,
        this.items[i].quantity
      );
      // Page Text
      if (i % 6 === 0) {
        const pageText = graphicsManager.createPageText(
          this.pageIndex++,
          this.totalPages
        );
        if (this.pageIndex > 1) {
          pageText.visible = false;
        }
        this.pageTexts.push(pageText);
      }
      // Item image
      const itemImage = graphicsManager.createItemImage(
        itemX,
        itemY,
        this.items[i].index
      );

      if (i > 5) {
        menuItem.visible = false;
        menuItemSelector.visible = false;
        itemImage.visible = false;
        obj.itemName.visible = false;
        obj.itemQuantity.visible = false;
      }

      itemX += menuItem.width + screen.width * 0.0073206442;
      if (itemX + 20 > (this.game.config.width as number)) {
        itemX = screen.width * 0.0095168375;
        itemY += menuItem.height + screen.width * 0.0036603221;
      }
      this.panels.push(menuItem);
      this.selectors.push(menuItemSelector);
      this.itemImages.push(itemImage);
      this.itemNamesText.push(obj.itemName);
      this.itemQuantitiesText.push(obj.itemQuantity);
    }
    // Menu Info Panel
    const menuInfo = graphicsManager.createMenuInfo();
    // Menu Info text
    const menuInfoText = graphicsManager.createMenuInfoText(this.items[0].type);
    // Left arrow and left arrow selector
    const leftArrow = graphicsManager.createLeftArrow();
    const leftArrowSelector = graphicsManager.createLeftArrowSelector();
    // this.panels.push(leftArrow);
    // this.selectors.push(leftArrowSelector);
    // Right arrow and right arrow selector
    const rightArrow = graphicsManager.createRightArrow();
    const rightArrowSelector = graphicsManager.createRightArrowSelector();
    // this.panels.push(rightArrow);
    // this.selectors.push(rightArrowSelector);
    // Back Image
    const backImage = graphicsManager.createBackImage();
    //TODO: Input keyboard
    this.input.keyboard.on(
      'keydown-R',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-L',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.L;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-U',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.U;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-D',
      () => {
        menuSelectSound.play();
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
          menuChooseSound.play();
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
          menuCancel.play();
          this.scene.add('battle-bag', BattleBag, true, {
            sceneToRemove: 'battle-item-menu',
            bPressedCount: -1,
            userID: this.userID,
            itemsToParse: data.itemsToParse,
          });
        }
      },
      this
    );
  }

  private async notifyUpperScreen() {
    await notifyUpperPromise(this.userID);
  }

  private renderAll(): void {
    let cursorStart = this.cursor - (this.cursor % 6);
    for (
      let i = cursorStart;
      i < cursorStart + 6 && i < this.panels.length;
      i++
    ) {
      if (i == this.cursor) {
        this.selectors[i].visible = true;
      } else {
        this.selectors[i].visible = false;
      }
    }
  }

  private renderNextItems() {
    this.selectors[this.cursor - 1].visible = false;
    let j = this.cursor - 6;
    const newPageIndex = this.cursor / 6;
    const oldPageIndex = this.cursor / 6 - 1;
    for (
      let i = this.cursor;
      i < this.cursor + 6 && i < this.items.length;
      i++, j++
    ) {
      this.itemImages[i].visible = true;
      this.itemNamesText[i].visible = true;
      this.itemQuantitiesText[i].visible = true;
      this.itemImages[j].visible = false;
      this.itemNamesText[j].visible = false;
      this.itemQuantitiesText[j].visible = false;
    }
    for (; j < this.cursor; j++) {
      this.itemImages[j].visible = false;
      this.itemNamesText[j].visible = false;
      this.itemQuantitiesText[j].visible = false;
    }
    this.pageTexts[newPageIndex].visible = true;
    this.pageTexts[oldPageIndex].visible = false;
  }

  private renderPreviousItems() {
    this.selectors[this.cursor + 1].visible = false;
    let j = this.cursor + 6;
    if (j >= this.items.length - 1) {
      j = this.items.length - 1;
    }
    let i = this.cursor;
    const newPageIndex = Math.floor(this.cursor / 6);
    const oldPageIndex = Math.floor(this.cursor / 6) + 1;
    for (; j > this.cursor && i >= 0 && i >= this.cursor - 5; i--, j--) {
      this.itemImages[i].visible = true;
      this.itemNamesText[i].visible = true;
      this.itemQuantitiesText[i].visible = true;
      this.itemImages[j].visible = false;
      this.itemNamesText[j].visible = false;
      this.itemQuantitiesText[j].visible = false;
    }
    for (; i >= 0 && i >= this.cursor - 5; i--) {
      this.itemImages[i].visible = true;
      this.itemNamesText[i].visible = true;
      this.itemQuantitiesText[i].visible = true;
    }
    this.pageTexts[newPageIndex].visible = true;
    this.pageTexts[oldPageIndex].visible = false;
  }

  private updateCursor(): void {
    switch (this.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.R: {
        this.cursor++;
        if (this.cursor >= this.items.length) {
          this.cursor--;
        } else if (this.cursor >= 6) {
          if (this.cursor > 5 && this.cursor % 6 == 0) {
            this.renderNextItems();
          } else if (this.cursor >= this.items.length) {
            this.cursor--;
          }
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.L: {
        if (this.cursor % 6 === 0) {
          if (this.cursor > 0) {
            this.cursor--;
            this.renderPreviousItems();
          } else {
            this.cursor = 0;
          }
        } else {
          this.cursor--;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.U: {
        if (this.cursor % 6 === 0) {
          if (this.cursor > 0) {
            this.cursor--;
            this.renderPreviousItems();
          } else {
            this.cursor = 0;
          }
        } else {
          this.cursor -= 2;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.D: {
        this.cursor += 2;
        if (this.cursor >= this.items.length) {
          this.cursor--;
        } else if (this.cursor >= 6) {
          if (this.cursor > 5 && this.cursor % 6 == 0) {
            this.cursor -= 1;
            this.renderNextItems();
          } else if (this.cursor >= this.items.length) {
            this.cursor -= 2;
          }
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
      default: {
        this.switchOff();
        this.scene.add('battle-item-description', BattleItemDescription, true, {
          sceneToRemove: 'battle-item-menu',
          bPressedCount: 0,
          userID: this.userID,
          items: this.items,
          itemNames: this.itemNames,
          itemsToParse: this.itemsToParse,
          itemIndex: this.cursor,
          itemToString: this.itemNames[this.cursor],
        });
        break;
      }
    }
  }
}
