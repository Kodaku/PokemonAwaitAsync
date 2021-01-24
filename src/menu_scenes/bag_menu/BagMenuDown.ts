import Phaser from 'phaser';
import { itemsText, sex, url } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';
import { createBagAnims } from '~/scenes/animations/bagAnims';
import { createBagArrowAnims } from '~/scenes/animations/bagArrowAnims';
import BackgroundCreator from '../creators/BackgroundCreator';
import BagDownCursorManager from '../creators/bag_down_creators/BagDownCursorManager';
import BagDownEventManager from '../creators/bag_down_creators/BagDownEventManager';
import BagDownGraphicManager from '../creators/bag_down_creators/BagDownGraphicManager';
import BagDownRenderManager from '../creators/bag_down_creators/BagDownRenderManager';
import EmptyMenu from '../EmptyMenu';
import { Item, ItemToString } from '~/types/myTypes';
import {
  getItemsPromise,
  requestTextAndDescription,
} from '~/promises/itemsDatabasePromises';
import { BagState, PartyMenuState } from '~/enums/depthLevels';
import PartyMenu from '../party_menu/PartyMenu';

export default class BagMenuDown extends Phaser.Scene {
  // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private state: number = BagState.DISPLAY;
  private backgroundCreator: BackgroundCreator = new BackgroundCreator();
  private cursorsManager: BagDownCursorManager = new BagDownCursorManager();
  private renderManager: BagDownRenderManager = new BagDownRenderManager();
  private keyPressed!: number;
  private eventManager!: BagDownEventManager;
  private userID!: number;
  private items!: Item[][];
  private itemsNames: ItemToString[][] = [];
  constructor() {
    super('bag-menu-down');
  }

  preload() {
    // this.cursors = this.input.keyboard.createCursorKeys();
  }

  async create(data: { userID: number; sceneName: string }) {
    this.userID = data.userID;
    this.scene.remove(data.sceneName);
    const items = await getItemsPromise(this.userID, 'down');
    const pokeBalls: Item[] = items.pokeBalls;
    const increaseStats: Item[] = items.increaseStats;
    const increaseHealth: Item[] = items.increaseHealth;
    const cures: Item[] = items.cures;
    const tmpItems = [pokeBalls, increaseStats, increaseHealth, cures];
    this.items = this.parseData(tmpItems);
    this.itemsNames = await this.requestAllTexts(this.items);
    this.renderManager.setItemNames(this.itemsNames);
    this.cursorsManager.setItems(this.items);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < sex.length; j++) {
        createBagAnims(this.anims, i + 1, sex[j]);
      }
    }
    createBagArrowAnims(this.anims, 'right');
    createBagArrowAnims(this.anims, 'left');
    const bg = this.backgroundCreator.createBackground(this, 'bg-down-m');
    const graphicsManager = new BagDownGraphicManager(this);
    const bagX = screen.width * 0.0285505124;
    const bagY = screen.height * 0.1432291667;
    const leftArrowX = screen.width * 0.0146412884;
    const leftArrowY = bg.height - screen.height * 0.0260416667;
    const rightArrowX = screen.width * 0.1171303075;
    const rightArrowY = leftArrowY;

    const bagType1 = graphicsManager.createBagType1(bagX, bagY);
    const bagType2 = graphicsManager.createBagType2(bagX, bagY, bagType1);
    const bagType3 = graphicsManager.createBagType3(bagX, bagY, bagType1);
    const bagType4 = graphicsManager.createBagType4(bagX, bagY, bagType1);
    const bagType5 = graphicsManager.createBagType5(bagX, bagY);
    this.renderManager.pushBagAnim(bagType1);
    this.renderManager.pushBagAnim(bagType2);
    this.renderManager.pushBagAnim(bagType3);
    this.renderManager.pushBagAnim(bagType4);
    this.renderManager.pushBagAnim(bagType5);

    const leftLightArrow = graphicsManager.createLeftLightArrow(
      leftArrowX,
      leftArrowY
    );
    const rightLightArrow = graphicsManager.createRightLightArrow(
      rightArrowX,
      rightArrowY
    );
    this.renderManager.pushLightArrow(rightLightArrow);
    this.renderManager.pushLightArrow(leftLightArrow);

    const itemsTexts = graphicsManager.createItemsText(
      leftArrowX,
      leftArrowY,
      rightArrowX
    );
    this.renderManager.setTexts(itemsTexts);

    const sliderX = screen.width * 0.2423133236;
    const sliderY = screen.height * 0.0559895833;
    const sliderEndY = screen.height * 0.2135416667;

    for (let i = 0; i < this.items.length; i++) {
      const bagSet = this.items[i];
      let itemX = screen.width * 0.1756954612;
      let itemY = screen.height * 0.0520833333;
      let itemPanels: Phaser.GameObjects.Image[] = [];
      let textPanels: Phaser.GameObjects.Text[] = [];
      for (let j = 0; j < 6 && j < bagSet.length; j++, itemY += screen.height * 0.0455729167) {
        const itemPanel = graphicsManager.createItemPanel(itemX, itemY);
        if (j == 0) {
          itemPanel.setTexture('item-selected');
        }
        //request the item name
        const text = await requestTextAndDescription(bagSet[j]);
        const panelText = this.add
          .text(itemX - screen.width * 0.0512445095, itemY - screen.height * 0.0104166667, text.name)
          .setOrigin(0, 0)
          .setDepth(1);

        if (i !== 0) {
          itemPanel.visible = false;
          panelText.visible = false;
        }
        if (j > 5) {
          panelText.visible = false;
          itemPanel.visible = false;
        }
        itemPanels.push(itemPanel);
        textPanels.push(panelText);
      }
      this.renderManager.pushBagItem(itemPanels);
      this.renderManager.pushBagText(textPanels);

      const slider = this.add.image(sliderX, sliderY, 'bag-slider');
      if (i !== 0) {
        slider.visible = false;
      }
      this.renderManager.pushSlider(slider);
    }

    for (let i = 0, y = bg.height / 2 + (screen.height * 0.0260416667); i < 2; i++, y += screen.height * 0.0390625) {
      const commandUnsel = graphicsManager.createCommandUnsel(bg, y);
      const commandText = graphicsManager.createCommandText(commandUnsel, i);
      this.renderManager.pushCommandUnsel(commandUnsel);
      this.renderManager.pushCommandText(commandText);
    }
    this.eventManager = new BagDownEventManager(this);
    this.createInputEvent(bg);
    this.eventManager.createEvents(this.renderManager);
  }

  private parseData(items: Item[][]) {
    let newItems: Item[][] = [];
    for (let i = 0; i < itemsText.length; i++) {
      let founded = 0;
      let itemCategory: Item[] = [];
      for (let j = 0; j < items.length; j++) {
        for (let k = 0; k < items[j].length; k++) {
          if (items[j][k].category === itemsText[i]) {
            if (items[j][k].quantity > 0) {
              itemCategory[founded++] = items[j][k];
            }
          }
        }
      }
      newItems[i] = itemCategory;
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

  private createInputEvent(bg: Phaser.GameObjects.Image) {
    this.input.keyboard.on('keydown-A', () => {
      if (this.state === BagState.DISPLAY) {
        this.state = BagState.COMMAND;
        sceneEvents.emit('A-pressed-bag', this, bg);
      } else if (this.state === BagState.COMMAND) {
        switch (this.cursorsManager.getCommandCursor()) {
          case 0:
            this.switchOffEvents();
            this.scene.add('party-menu', PartyMenu, true, {
              userID: this.userID,
              sceneName: 'bag-menu-down',
              state: PartyMenuState.ASSIGN_ITEM,
              itemToGive: this.itemsNames[this.cursorsManager.getAnimsCursor()][
                this.cursorsManager.getItemIndex()
              ],
            });
            break;
          case 1:
            this.state = BagState.DISPLAY;
            sceneEvents.emit('B-pressed-bag');
            break;
        }
      }
    });
    this.input.keyboard.on('keydown-B', () => {
      if (this.state === BagState.COMMAND) {
        this.state = BagState.DISPLAY;
        sceneEvents.emit('B-pressed-bag');
      }
    });
    this.input.keyboard.on('keydown-R', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.R;
    });
    this.input.keyboard.on('keydown-L', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.L;
    });
    this.input.keyboard.on('keydown-U', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.U;
    });
    this.input.keyboard.on('keydown-D', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.D;
    });
    this.input.keyboard.on('keydown-X', () => {
      if (this.state == BagState.DISPLAY) {
        this.exitBag();
      }
    });
  }

  private exitBag() {
    this.switchOffEvents();
    this.scene.add('empty-menu', EmptyMenu, true, {
      userID: this.userID,
      sceneName: 'bag-menu-down',
    });
  }

  private switchOffEvents() {
    this.eventManager.destroyEvents();
    this.input.keyboard.off('keydown-A');
    this.input.keyboard.off('keydown-B');
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-X');
  }

  update() {
    switch (this.state) {
      case BagState.DISPLAY: {
        this.displayBag();
        break;
      }
      case BagState.COMMAND: {
        this.displayCommand();
        break;
      }
    }
  }

  private displayBag() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.cursorsManager.incrementItemCursor();
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.cursorsManager.decrementItemCursor();
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.R) {
      this.cursorsManager.incrementAnimsCursor(5);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.L) {
      this.cursorsManager.decrementAnimsCursor();
      this.keyPressed = -3;
    }
  }

  private displayCommand() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.cursorsManager.incrementCommandCursor(2);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.cursorsManager.decrementCommandCursor();
      this.keyPressed = -3;
    }
  }
}
