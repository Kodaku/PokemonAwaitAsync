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
      .image(
        screen.width * 0.0036603221,
        screen.width * 0.0219619327,
        'item-description'
      )
      .setOrigin(0, 0);
    itemInfo.width = screen.width * 0.2415812592;
    itemInfo.height = screen.width * 0.1098096633;
    itemInfo.displayWidth = itemInfo.width;
    itemInfo.displayHeight = itemInfo.height;
    return itemInfo;
  }

  public createUsePanel() {
    const usePanel = this.scene.add
      .image(
        screen.width * 0.0036603221,
        screen.width * 0.1793557833,
        'last-item-full'
      )
      .setOrigin(0, 0);
    usePanel.width = screen.width * 0.1976573939;
    usePanel.height = screen.width * 0.0292825769;
    usePanel.displayWidth = usePanel.width;
    usePanel.displayHeight = usePanel.height;
    return usePanel;
  }

  public createUsePanelSelector() {
    const usePanelSelector = this.scene.add
      .image(
        screen.width * 0.0036603221,
        screen.width * 0.1793557833,
        'selector'
      )
      .setOrigin(0, 0);
    usePanelSelector.width = screen.width * 0.1976573939;
    usePanelSelector.height = screen.width * 0.0292825769;
    usePanelSelector.displayWidth = usePanelSelector.width;
    usePanelSelector.displayHeight = usePanelSelector.height;
    usePanelSelector.visible = false;
    return usePanelSelector;
  }

  public createItemImage(itemIndex: string) {
    console.log(itemIndex);
    const itemImage = this.scene.add
      .image(
        screen.width * 0.0366032211,
        screen.width * 0.032942899,
        `item${itemIndex}`
      )
      .setOrigin(0, 0);
    itemImage.width = screen.width * 0.0219619327;
    itemImage.height = screen.width * 0.0219619327;
    itemImage.displayWidth = itemImage.width;
    itemImage.displayHeight = itemImage.height;
    return itemImage;
  }

  public createItemInformations(item: ItemToString, quantity: number) {
    const itemName = this.scene.add
      .text(
        screen.width * 0.065885798,
        screen.width * 0.0402635432,
        item.name,
        {
          fontSize: screen.width * 0.0087847731,
          align: 'center',
        }
      )
      .setOrigin(0, 0);

    const itemQuantity = this.scene.add
      .text(
        screen.width * 0.1610541728,
        screen.width * 0.0402635432,
        `x${quantity}`,
        {
          fontSize: screen.width * 0.0087847731,
          align: 'center',
        }
      )
      .setOrigin(0, 0);

    const itemDescription = this.scene.add
      .text(
        screen.width * 0.0219619327,
        screen.width * 0.0695461201,
        item.description,
        {
          fontSize: screen.width * 0.0087847731,
        }
      )
      .setOrigin(0, 0);
  }

  public createBackImage() {
    const backImage = this.scene.add
      .image(
        screen.width * 0.2086383602,
        screen.width * 0.1815519766,
        'back-arrow'
      )
      .setOrigin(0, 0);
    backImage.width = screen.width * 0.0292825769;
    backImage.height = screen.width * 0.0292825769;
    backImage.displayWidth = backImage.width;
    backImage.displayHeight = backImage.height;
    return backImage;
  }
}
