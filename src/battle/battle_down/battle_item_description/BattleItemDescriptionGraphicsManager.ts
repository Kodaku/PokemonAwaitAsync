import Phaser from 'phaser';
import { ItemToString } from '~/types/myTypes';

export default class BattleItemDescriptionGraphicsManager {
  constructor(public scene: Phaser.Scene) {}

  public createBackground() {
    const bg = this.scene.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = this.scene.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createItemInfo() {
    const itemInfo = this.scene.add
      .image(5, 30, 'item-description')
      .setOrigin(0, 0);
    itemInfo.width = 330;
    itemInfo.height = 150;
    itemInfo.displayWidth = itemInfo.width;
    itemInfo.displayHeight = itemInfo.height;
    return itemInfo;
  }

  public createUsePanel() {
    const usePanel = this.scene.add
      .image(5, 245, 'last-item-full')
      .setOrigin(0, 0);
    usePanel.width = 270;
    usePanel.height = 40;
    usePanel.displayWidth = usePanel.width;
    usePanel.displayHeight = usePanel.height;
    return usePanel;
  }

  public createUsePanelSelector() {
    const usePanelSelector = this.scene.add
      .image(5, 245, 'selector')
      .setOrigin(0, 0);
    usePanelSelector.width = 270;
    usePanelSelector.height = 40;
    usePanelSelector.displayWidth = usePanelSelector.width;
    usePanelSelector.displayHeight = usePanelSelector.height;
    usePanelSelector.visible = false;
    return usePanelSelector;
  }

  public createItemImage(itemIndex: string) {
    console.log(itemIndex);
    const itemImage = this.scene.add
      .image(50, 45, `item${itemIndex}`)
      .setOrigin(0, 0);
    itemImage.width = 30;
    itemImage.height = 30;
    itemImage.displayWidth = itemImage.width;
    itemImage.displayHeight = itemImage.height;
    return itemImage;
  }

  public createItemInformations(item: ItemToString, quantity: number) {
    const itemName = this.scene.add
      .text(90, 55, item.name, { fontSize: 12, align: 'center' })
      .setOrigin(0, 0);

    const itemQuantity = this.scene.add
      .text(220, 55, `x${quantity}`, { fontSize: 12, align: 'center' })
      .setOrigin(0, 0);

    const itemDescription = this.scene.add
      .text(30, 95, item.description, {
        fontSize: 12,
      })
      .setOrigin(0, 0);
  }

  public createBackImage() {
    const backImage = this.scene.add
      .image(285, 248, 'back-arrow')
      .setOrigin(0, 0);
    backImage.width = 40;
    backImage.height = 40;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
