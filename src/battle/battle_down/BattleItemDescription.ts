import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import BattleItemMenu from './BattleItemMenu';
import BattlePartyMenu, { BattlePartyState } from './BattlePartyMenu';
import axios from 'axios';

const notifyUpperPromise = () => {
  return new Promise((resolve: (value: string) => void) => {
    axios.get(`${url}/real-time/notify-upper`).then((response) => {
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
  constructor() {
    super('battle-item-description');
  }

  create(data: { sceneToRemove: string; bPressedCount: number }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.cursor = -1;
    //BG
    const bg = this.createBackground();
    // Item info
    const itemInfo = this.createItemInfo();
    //Use panel and its selector
    const usePanel = this.createUsePanel();
    const usePanelSelector = this.createUsePanelSelector();
    this.panels.push(usePanel);
    this.selectors.push(usePanelSelector);
    // Use Text
    const useText = this.add
      .text(120, 255, 'USE', { fontSize: 20, align: 'center' })
      .setOrigin(0, 0);
    // Item Image
    const itemImage = this.createItemImage();
    // Item text information
    this.createItemInformations();
    // Back Image
    const backImage = this.createBackImage();
    // Input Keyboards
    this.input.keyboard.on('keydown-R', () => {
      this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
      this.updateCursor();
      this.renderAll();
    });
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.cursor !== -1) {
          this.notifyUpperScreen();
          this.scene.add('battle-party-menu', BattlePartyMenu, true, {
            sceneToRemove: 'battle-item-description',
            bPressedCount: 0,
            state: BattlePartyState.CURE_STATUS,
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
          this.scene.add('battle-item-menu', BattleItemMenu, true, {
            sceneToRemove: 'battle-item-description',
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
    }
  }

  private switchOff() {
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-B');
  }

  private createBackground() {
    const bg = this.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.game.config.width as number;
    bg.height = this.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  private createItemInfo() {
    const itemInfo = this.add.image(5, 30, 'item-description').setOrigin(0, 0);
    itemInfo.width = 330;
    itemInfo.height = 150;
    itemInfo.displayWidth = itemInfo.width;
    itemInfo.displayHeight = itemInfo.height;
    return itemInfo;
  }

  private createUsePanel() {
    const usePanel = this.add.image(5, 245, 'last-item-full').setOrigin(0, 0);
    usePanel.width = 270;
    usePanel.height = 40;
    usePanel.displayWidth = usePanel.width;
    usePanel.displayHeight = usePanel.height;
    return usePanel;
  }

  private createUsePanelSelector() {
    const usePanelSelector = this.add.image(5, 245, 'selector').setOrigin(0, 0);
    usePanelSelector.width = 270;
    usePanelSelector.height = 40;
    usePanelSelector.displayWidth = usePanelSelector.width;
    usePanelSelector.displayHeight = usePanelSelector.height;
    usePanelSelector.visible = false;
    return usePanelSelector;
  }

  private createItemImage() {
    const itemImage = this.add.image(50, 45, '').setOrigin(0, 0);
    itemImage.width = 30;
    itemImage.height = 30;
    itemImage.displayWidth = itemImage.width;
    itemImage.displayHeight = itemImage.height;
    return itemImage;
  }

  private createItemInformations() {
    const itemName = this.add
      .text(90, 55, 'Template Name', { fontSize: 12, align: 'center' })
      .setOrigin(0, 0);

    const itemQuantity = this.add
      .text(220, 55, 'xTemplateQt.', { fontSize: 12, align: 'center' })
      .setOrigin(0, 0);

    const itemDescription = this.add
      .text(30, 95, 'Template Description', {
        fontSize: 12,
      })
      .setOrigin(0, 0);
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
