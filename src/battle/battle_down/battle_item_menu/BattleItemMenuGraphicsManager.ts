import Phaser from 'phaser';
import { battleItemsText } from '~/constants/Constants';

export default class BattleItemMenuGraphicsManager {
  constructor(public scene: Phaser.Scene) {}

  public createBackground() {
    const bg = this.scene.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = this.scene.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createMenuItem(itemX: number, itemY: number) {
    const menuItem = this.scene.add
      .image(itemX, itemY, 'menu-item-unselected')
      .setOrigin(0, 0);
    menuItem.width = 150;
    menuItem.height = 60;
    menuItem.displayWidth = menuItem.width;
    menuItem.displayHeight = menuItem.height;
    return menuItem;
  }

  public createMenuItemSelector(itemX: number, itemY: number) {
    const menuItemSelector = this.scene.add
      .image(itemX, itemY, 'selector')
      .setOrigin(0, 0);
    menuItemSelector.width = 150;
    menuItemSelector.height = 60;
    menuItemSelector.displayWidth = menuItemSelector.width;
    menuItemSelector.displayHeight = menuItemSelector.height;
    menuItemSelector.visible = false;
    return menuItemSelector;
  }

  public createItemNameAndQuantity(
    itemX: number,
    itemY: number,
    itemName: string,
    quantity: number
  ) {
    const itemText = this.scene.add
      .text(itemX + 35, itemY + 10, itemName, {
        fontSize: 12,
        align: 'center',
      })
      .setOrigin(0, 0);
    const itemQuantity = this.scene.add
      .text(itemX + 60, itemY + 35, `x${quantity}`, {
        fontSize: 12,
        align: 'center',
      })
      .setOrigin(0, 0);
    return {
      itemName: itemText,
      itemQuantity: itemQuantity,
    };
  }

  public createItemImage(itemX: number, itemY: number, itemIndex: string) {
    const itemImage = this.scene.add
      .image(itemX + 15, itemY + 28, `item${itemIndex}`)
      .setOrigin(0, 0);
    itemImage.width = 30;
    itemImage.height = 30;
    itemImage.displayWidth = itemImage.width;
    itemImage.displayHeight = itemImage.height;
    return itemImage;
  }

  public createMenuInfo() {
    const menuInfo = this.scene.add
      .image(110, 225, 'menu-info')
      .setOrigin(0, 0);
    menuInfo.width = 170;
    menuInfo.height = 60;
    menuInfo.displayWidth = menuInfo.width;
    menuInfo.displayHeight = menuInfo.height;
    return menuInfo;
  }

  public createMenuInfoText(itemType: string) {
    let text = '';
    switch (itemType) {
      case battleItemsText[0]:
        text = 'HP/PP\nRESTORE';
        break;
      case battleItemsText[1]:
        text = 'POKE BALLS';
        break;
      case battleItemsText[2]:
        text = 'STATUS\nRESTORE';
        break;
      case battleItemsText[3]:
        text = 'BATTLE ITEMS';
        break;
    }
    this.scene.add
      .text(130, 240, text, { fontSize: 18, align: 'center' })
      .setOrigin(0, 0);
  }

  public createPageText(pageIndex: number, totalPages: number) {
    return this.scene.add
      .text(230, 250, `${pageIndex}/${totalPages}`, {
        fontSize: 18,
        align: 'center',
      })
      .setOrigin(0, 0);
  }

  public createLeftArrow() {
    const leftArrow = this.scene.add
      .image(5, 248, 'left-arrow')
      .setOrigin(0, 0);
    leftArrow.width = 40;
    leftArrow.height = 40;
    leftArrow.displayWidth = leftArrow.width;
    leftArrow.displayHeight = leftArrow.height;
    return leftArrow;
  }

  public createLeftArrowSelector() {
    const leftArrowSelector = this.scene.add
      .image(5, 248, 'selector')
      .setOrigin(0, 0);
    leftArrowSelector.width = 40;
    leftArrowSelector.height = 40;
    leftArrowSelector.displayWidth = leftArrowSelector.width;
    leftArrowSelector.displayHeight = leftArrowSelector.height;
    leftArrowSelector.visible = false;
    return leftArrowSelector;
  }

  public createRightArrow() {
    const rightArrow = this.scene.add
      .image(63, 248, 'right-arrow')
      .setOrigin(0, 0);
    rightArrow.width = 40;
    rightArrow.height = 40;
    rightArrow.displayWidth = rightArrow.width;
    rightArrow.displayHeight = rightArrow.height;
    return rightArrow;
  }

  public createRightArrowSelector() {
    const rightArrowSelector = this.scene.add
      .image(63, 248, 'selector')
      .setOrigin(0, 0);
    rightArrowSelector.width = 40;
    rightArrowSelector.height = 40;
    rightArrowSelector.displayWidth = rightArrowSelector.width;
    rightArrowSelector.displayHeight = rightArrowSelector.height;
    rightArrowSelector.visible = false;
    return rightArrowSelector;
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
