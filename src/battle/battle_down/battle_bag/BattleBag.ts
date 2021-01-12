import Phaser from 'phaser';
import { battleItemsText, url } from '~/constants/Constants';
import BattleItemMenu from '../battle_item_menu/BattleItemMenu';
import BattleMenu from '../battle_menu/BattleMenu';
import axios from 'axios';
import BattleBagGraphicsManager from './BattleBagGraphicsManager';
import { Item, ItemToString } from '~/types/myTypes';
import { requestTextAndDescription } from '~/promises/itemsDatabasePromises';

enum BagCursorPosition {
  HPRESTORE = 0,
  POKEBALLS = 1,
  STATUSRESTORE = 2,
  BATTLEITEMS = 3,
}
const notifyUpperPromise = (id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.get(`${url}/real-time/notify-upper/${id}`).then((response) => {
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
  private userID!: number;
  private items!: Item[][];
  private itemsNames!: ItemToString[][];
  constructor() {
    super('battle-bag');
  }

  async create(data: {
    sceneToRemove: string;
    bPressedCount: number;
    userID: number;
    itemsToParse: Item[][];
  }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.userID = data.userID;
    this.items = this.parseData(data.itemsToParse);
    this.itemsNames = await this.requestAllTexts(this.items);
    console.log('Items in Battle Bag: ', this.items);
    this.cursor = -1;
    const graphicsManager = new BattleBagGraphicsManager(this);
    const bg = graphicsManager.createBackground();
    //Hp restore icon and selector
    const hpRestore = graphicsManager.createHpRestore();
    const hpRestoreSelector = graphicsManager.createHpRestoreSelector();
    this.panels.push(hpRestore);
    this.selectors.push(hpRestoreSelector);
    // Poke Balls icon and selector
    const pokeBalls = graphicsManager.createPokeBalls();
    const pokeBallsSelector = graphicsManager.createPokeBallsSelector();
    this.panels.push(pokeBalls);
    this.selectors.push(pokeBallsSelector);
    // Status Restore icon and selector
    const statusRestore = graphicsManager.createStatusRestore();
    const statusRestoreSelector = graphicsManager.createStatusRestoreSelector();
    this.panels.push(statusRestore);
    this.selectors.push(statusRestoreSelector);
    // Battle Items icon and selector
    const battleItems = graphicsManager.createBattleItems();
    const battleItemsSelector = graphicsManager.createBattleItemsSelector();
    this.panels.push(battleItems);
    this.selectors.push(battleItemsSelector);
    // Icons text
    graphicsManager.createIconsText();
    // Last item used(not available as a functionality in game)
    const lastItemEmpty = graphicsManager.createLastItemUsed();
    // Back Image
    const backImage = graphicsManager.createBackImage();

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

  private parseData(items: Item[][]) {
    let newItems: Item[][] = [];
    for (let i = 0; i < battleItemsText.length; i++) {
      let founded = 0;
      let itemTypes: Item[] = [];
      for (let j = 0; j < items.length; j++) {
        for (let k = 0; k < items[j].length; k++) {
          if (items[j][k].type === battleItemsText[i]) {
            if (items[j][k].quantity > 0) {
              itemTypes[founded++] = items[j][k];
            }
          }
        }
      }
      newItems[i] = itemTypes;
    }
    return newItems;
  }

  private async requestAllTexts(items: Item[][]) {
    let texts: ItemToString[][] = [];
    for (let i = 0; i < items.length; i++) {
      let strings: ItemToString[] = [];
      for (let j = 0; j < items[i].length; j++) {
        if (items[i][j].quantity > 0) {
          const text = await requestTextAndDescription(items[i][j]);
          strings[j] = text;
        }
      }
      texts[i] = strings;
    }
    return texts;
  }

  private async notifyUpperScreen() {
    await notifyUpperPromise(this.userID);
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
          bPressedCount: 0,
          userID: this.userID,
          items: this.items[0],
          itemNames: this.itemsNames[0],
          itemsToParse: this.items,
        });
        break;
      }
      case BagCursorPosition.POKEBALLS: {
        this.scene.add('battle-item-menu', BattleItemMenu, true, {
          sceneToRemove: 'battle-bag',
          bPressedCount: 0,
          userID: this.userID,
          items: this.items[1],
          itemNames: this.itemsNames[1],
          itemsToParse: this.items,
        });
        break;
      }
      case BagCursorPosition.STATUSRESTORE: {
        this.scene.add('battle-item-menu', BattleItemMenu, true, {
          sceneToRemove: 'battle-bag',
          bPressedCount: 0,
          userID: this.userID,
          items: this.items[2],
          itemNames: this.itemsNames[2],
          itemsToParse: this.items,
        });
        break;
      }
      case BagCursorPosition.BATTLEITEMS: {
        this.scene.add('battle-item-menu', BattleItemMenu, true, {
          sceneToRemove: 'battle-bag',
          bPressedCount: 0,
          userID: this.userID,
          items: this.items[3],
          itemNames: this.itemsNames[3],
          itemsToParse: this.items,
        });
        break;
      }
    }
  }
}
