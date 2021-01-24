import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import BattleItemMenu from '../battle_item_menu/BattleItemMenu';
import BattlePartyMenu, {
  BattlePartyState,
} from '../battle_party_menu/BattlePartyMenu';
import axios from 'axios';
import BattleItemDescriptionGraphicsManager from './BattleItemDescriptionGraphicsManager';
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

export default class BattleItemDescription extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  private userID!: number;
  private itemIndex!: number;
  private item!: ItemToString;
  constructor() {
    super('battle-item-description');
  }

  create(data: {
    sceneToRemove: string;
    bPressedCount: number;
    userID: number;
    items: Item[];
    itemNames: ItemToString[];
    itemsToParse: Item[][];
    itemIndex: number;
    itemToString: ItemToString;
  }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.userID = data.userID;
    this.item = data.itemToString;
    this.itemIndex = data.itemIndex;
    this.cursor = -1;
    const menuSelectSound = this.sound.add("menu-select-sound");
    const menuChooseSound = this.sound.add("menu-choose-sound");
    const menuCancel = this.sound.add("cancel-sound");
    const graphicsManager = new BattleItemDescriptionGraphicsManager(this);
    //BG
    const bg = graphicsManager.createBackground();
    // Item info
    const itemInfo = graphicsManager.createItemInfo();
    //Use panel and its selector
    const usePanel = graphicsManager.createUsePanel();
    const usePanelSelector = graphicsManager.createUsePanelSelector();
    this.panels.push(usePanel);
    this.selectors.push(usePanelSelector);
    // Use Text
    const useText = this.add
      .text(
        screen.width * 0.0878477306,
        screen.width * 0.1866764275256222,
        'USE',
        {
          fontSize: screen.width * 0.0146412884,
          align: 'center',
        }
      )
      .setOrigin(0, 0);
    // Item Image
    const itemImage = graphicsManager.createItemImage(
      data.items[this.itemIndex].index
    );
    // Item text information
    graphicsManager.createItemInformations(
      this.item,
      data.items[this.itemIndex].quantity
    );
    // Back Image
    const backImage = graphicsManager.createBackImage();
    // Input Keyboards
    this.input.keyboard.on('keydown-R', () => {
      menuSelectSound.play();
      this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
      this.updateCursor();
      this.renderAll();
    });
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        menuChooseSound.play();
        if (this.cursor !== -1) {
          let partyState = 0;
          console.log(data.items[this.itemIndex]);
          switch (data.items[this.itemIndex].type) {
            case 'IncreaseHealth':
              partyState = BattlePartyState.CURE_HEALTH;
              break;
            case 'Cure':
              partyState = BattlePartyState.CURE_STATUS;
              break;
            case 'PokeBall':
              partyState = BattlePartyState.POKE_BALL_STATUS;
              break;
            case 'IncreaseStats': {
              partyState = BattlePartyState.INCREASE_STATS_STATUS;
              break;
            }
          }
          this.notifyUpperScreen();
          this.scene.add('battle-party-menu', BattlePartyMenu, true, {
            sceneToRemove: 'battle-item-description',
            bPressedCount: 0,
            state: partyState,
            userID: this.userID,
            item: data.items[this.itemIndex],
          });
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
          this.scene.add('battle-item-menu', BattleItemMenu, true, {
            sceneToRemove: 'battle-item-description',
            bPressedCount: -1,
            userID: this.userID,
            items: data.items,
            itemNames: data.itemNames,
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
