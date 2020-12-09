import Phaser from 'phaser';
import { itemsText } from '~/constants/Constants';
import { BagState, PartyMenuState } from '~/enums/depthLevels';
import { sceneEvents } from '~/events/EventCenter';
import {
  getItemsPromise,
  requestTextAndDescription,
} from '~/promises/itemsDatabasePromises';
import Game from '~/scenes/Game';
import { Item, ItemToString, User } from '~/types/myTypes';
import PartyMenuUp from '../party_menu/PartyMenuUp';

export default class BagMenuUp extends Phaser.Scene {
  private state: BagState = BagState.DISPLAY;
  private user!: User;
  private keyPressed!: number;
  private animsCursor: number = 0;
  private commandCursor: number = 0;
  private itemsCursor: number[] = [0, 0, 0, 0, 0];
  private items: Item[][] = [];
  private itemsImagesIndex: string[][] = [];
  private itemNames: string[][] = [];
  private itemDescriptions: string[][] = [];
  private itemQuantities: number[][] = [];
  private itemImage!: Phaser.GameObjects.Image;
  private itemName!: Phaser.GameObjects.Text;
  private itemDescription!: Phaser.GameObjects.Text;
  private itemQuantity!: Phaser.GameObjects.Text;
  private itemNamesDescription: ItemToString[][] = [];
  constructor() {
    super('bag-menu-up');
  }

  preload() {}

  async create(data: { user: User; sceneName: string }) {
    this.user = data.user;
    this.scene.remove(data.sceneName);
    const newItems = await getItemsPromise(this.user.userID, 'up');
    const pokeBalls: Item[] = newItems.pokeBalls;
    const increaseStats: Item[] = newItems.increaseStats;
    const increaseHealth: Item[] = newItems.increaseHealth;
    const cures: Item[] = newItems.cures;
    const tmpItems = [pokeBalls, increaseStats, increaseHealth, cures];
    this.items = this.parseData(tmpItems);
    this.itemNamesDescription = await this.requestAllTexts(this.items);
    const bgBottom = this.add.image(0, 0, 'bg-up-m').setOrigin(0, 0);
    bgBottom.width = this.game.config.width as number;
    bgBottom.height = this.game.config.height as number;
    bgBottom.displayWidth = bgBottom.width;
    bgBottom.displayHeight = bgBottom.height;

    const bgTop = this.add.image(0, 0, 'bg-item-m').setOrigin(0, 0);
    bgTop.width = this.game.config.width as number;
    bgTop.height = this.game.config.height as number;
    bgTop.displayWidth = bgTop.width;
    bgTop.displayHeight = bgTop.height;

    for (let i = 0; i < this.items.length; i++) {
      const indexes: string[] = [];
      const names: string[] = [];
      const descriptions: string[] = [];
      const quantities: number[] = [];
      for (let j = 0; j < this.items[i].length; j++) {
        const item = this.items[i][j];
        indexes[j] = item.index;
        names[j] = this.itemNamesDescription[i][j].name;
        descriptions[j] = this.itemNamesDescription[i][j].description;
        quantities[j] = item.quantity;
      }
      this.itemsImagesIndex.push(indexes);
      this.itemNames.push(names);
      this.itemDescriptions.push(descriptions);
      this.itemQuantities.push(quantities);
    }

    this.itemImage = this.add
      .image(152, 97, `item${this.itemsImagesIndex[0][0]}`)
      .setOrigin(0, 0);
    this.itemImage.width = 40;
    this.itemImage.height = 40;
    this.itemImage.displayWidth = this.itemImage.width;
    this.itemImage.displayHeight = this.itemImage.height;

    this.itemName = this.add
      .text(this.itemImage.x - 31, this.itemImage.y - 20, this.itemNames[0][0])
      .setOrigin(0, 0);

    this.itemDescription = this.add.text(
      this.itemImage.x - 135,
      this.itemImage.y + 50,
      this.itemDescriptions[0][0]
    );
    this.itemQuantity = this.add
      .text(
        this.itemImage.x + 55,
        this.itemImage.y + 10,
        `x${this.items[0][0].quantity}`
      )
      .setOrigin(0, 0);

    this.input.keyboard.on('keydown-X', () => {
      this.turnOffEvents();
      this.scene.add('game', Game, true, {
        user: this.user,
        sceneName: 'bag-menu-up',
      });
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
    this.input.keyboard.on('keydown-A', () => {
      if (this.state === BagState.DISPLAY) {
        this.state = BagState.COMMAND;
      } else if (this.state === BagState.COMMAND) {
        //TODO: manage the user choice between Use, Hold or Quit
        switch (this.commandCursor) {
          case 0:
            this.turnOffEvents();
            this.scene.add('party-menu-up', PartyMenuUp, true, {
              user: this.user,
              sceneName: 'bag-menu-up',
              state: PartyMenuState.ASSIGN_ITEM,
              itemToGive: this.itemNamesDescription[this.animsCursor][
                this.itemsCursor[this.animsCursor]
              ],
            });
            break;
          case 1:
            this.state = BagState.DISPLAY;
            break;
        }
      }
    });
    this.input.keyboard.on('keydown-B', () => {
      if (this.state === BagState.COMMAND) {
        this.state = BagState.DISPLAY;
      }
    });
    sceneEvents.on('update-image', this.updateImage, this);
  }

  private turnOffEvents() {
    this.input.keyboard.off('keydown-X');
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-A');
    this.input.keyboard.off('keydown-B');
    sceneEvents.off('update-image');
  }

  private parseData(items: Item[][]) {
    console.log(items);
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
        const text = await requestTextAndDescription(items[i][j]);
        strings[j] = text;
      }
      texts[i] = strings;
    }
    return texts;
  }

  private updateImage() {
    this.itemImage.setTexture(
      `item${
        this.itemsImagesIndex[this.animsCursor][
          this.itemsCursor[this.animsCursor]
        ]
      }`
    );
    this.itemDescription.setText(
      this.itemDescriptions[this.animsCursor][
        this.itemsCursor[this.animsCursor]
      ]
    );
    this.itemName.setText(
      this.itemNames[this.animsCursor][this.itemsCursor[this.animsCursor]]
    );
    this.itemQuantity.setText(
      `x${
        this.itemQuantities[this.animsCursor][
          this.itemsCursor[this.animsCursor]
        ]
      }`
    );
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
      this.incrementItemCursor();
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.decrementItemCursor();
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.R) {
      this.incrementAnimsCursor(this.items.length);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.L) {
      this.decrementAnimsCursor();
      this.keyPressed = -3;
    }
  }

  private displayCommand() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.incrementCommandCursor(2);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.decrementCommandCursor();
      this.keyPressed = -3;
    }
  }

  private incrementItemCursor() {
    this.itemsCursor[this.animsCursor]++;
    if (
      this.itemsCursor[this.animsCursor] >= this.items[this.animsCursor].length
    ) {
      this.itemsCursor[this.animsCursor]--;
    } else {
      sceneEvents.emit('update-image');
    }
  }

  public decrementItemCursor() {
    this.itemsCursor[this.animsCursor]--;
    if (this.itemsCursor[this.animsCursor] < 0) {
      this.itemsCursor[this.animsCursor]++;
    } else {
      sceneEvents.emit('update-image');
    }
  }

  public incrementAnimsCursor(maxLength: number) {
    this.animsCursor++;
    if (this.animsCursor >= maxLength) {
      this.animsCursor--;
    } else {
      sceneEvents.emit('update-image');
    }
  }

  public decrementAnimsCursor() {
    this.animsCursor--;
    if (this.animsCursor < 0) {
      this.animsCursor++;
    } else {
      sceneEvents.emit('update-image');
    }
  }

  public incrementCommandCursor(maxLenght: number) {
    this.commandCursor++;
    if (this.commandCursor >= maxLenght) {
      this.commandCursor--;
    } else {
    }
  }

  public decrementCommandCursor() {
    this.commandCursor--;
    if (this.commandCursor < 0) {
      this.commandCursor++;
    } else {
    }
  }
}
