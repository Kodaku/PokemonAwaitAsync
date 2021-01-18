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
    menuItem.width = screen.width * 0.1098096633;
    menuItem.height = screen.width * 0.0439238653;
    menuItem.displayWidth = menuItem.width;
    menuItem.displayHeight = menuItem.height;
    return menuItem;
  }

  public createMenuItemSelector(itemX: number, itemY: number) {
    const menuItemSelector = this.scene.add
      .image(itemX, itemY, 'selector')
      .setOrigin(0, 0);
    menuItemSelector.width = screen.width * 0.1098096633;
    menuItemSelector.height = screen.width * 0.0439238653;
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
      .text(
        itemX + screen.width * 0.0256222548,
        itemY + screen.width * 0.0073206442,
        itemName,
        {
          fontSize: screen.width * 0.0087847731,
          align: 'center',
        }
      )
      .setOrigin(0, 0);
    const itemQuantity = this.scene.add
      .text(
        itemX + screen.width * 0.0439238653,
        itemY + screen.width * 0.0256222548,
        `x${quantity}`,
        {
          fontSize: screen.width * 0.0087847731,
          align: 'center',
        }
      )
      .setOrigin(0, 0);
    return {
      itemName: itemText,
      itemQuantity: itemQuantity,
    };
  }

  public createItemImage(itemX: number, itemY: number, itemIndex: string) {
    const itemImage = this.scene.add
      .image(
        itemX + screen.width * 0.0109809663,
        itemY + screen.width * 0.0204978038,
        `item${itemIndex}`
      )
      .setOrigin(0, 0);
    itemImage.width = screen.width * 0.0219619327;
    itemImage.height = screen.width * 0.0219619327;
    itemImage.displayWidth = itemImage.width;
    itemImage.displayHeight = itemImage.height;
    return itemImage;
  }

  public createMenuInfo() {
    const menuInfo = this.scene.add
      .image(
        screen.width * 0.0805270864,
        screen.width * 0.1647144949,
        'menu-info'
      )
      .setOrigin(0, 0);
    menuInfo.width = screen.width * 0.1244509517;
    menuInfo.height = screen.width * 0.0439238653;
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
      .text(screen.width * 0.0951683748, screen.width * 0.1756954612, text, {
        fontSize: screen.width * 0.0131771596,
        align: 'center',
      })
      .setOrigin(0, 0);
  }

  public createPageText(pageIndex: number, totalPages: number) {
    return this.scene.add
      .text(
        screen.width * 0.168374817,
        screen.width * 0.1830161054,
        `${pageIndex}/${totalPages}`,
        {
          fontSize: screen.width * 0.0131771596,
          align: 'center',
        }
      )
      .setOrigin(0, 0);
  }

  public createLeftArrow() {
    const leftArrow = this.scene.add
      .image(
        screen.width * 0.0036603221,
        screen.width * 0.1815519766,
        'left-arrow'
      )
      .setOrigin(0, 0);
    leftArrow.width = screen.width * 0.0292825769;
    leftArrow.height = screen.width * 0.0292825769;
    leftArrow.displayWidth = leftArrow.width;
    leftArrow.displayHeight = leftArrow.height;
    return leftArrow;
  }

  public createLeftArrowSelector() {
    const leftArrowSelector = this.scene.add
      .image(
        screen.width * 0.0036603221,
        screen.width * 0.1815519766,
        'selector'
      )
      .setOrigin(0, 0);
    leftArrowSelector.width = screen.width * 0.0292825769;
    leftArrowSelector.height = screen.width * 0.0292825769;
    leftArrowSelector.displayWidth = leftArrowSelector.width;
    leftArrowSelector.displayHeight = leftArrowSelector.height;
    leftArrowSelector.visible = false;
    return leftArrowSelector;
  }

  public createRightArrow() {
    const rightArrow = this.scene.add
      .image(
        screen.width * 0.0461200586,
        screen.width * 0.1815519766,
        'right-arrow'
      )
      .setOrigin(0, 0);
    rightArrow.width = screen.width * 0.0292825769;
    rightArrow.height = screen.width * 0.0292825769;
    rightArrow.displayWidth = rightArrow.width;
    rightArrow.displayHeight = rightArrow.height;
    return rightArrow;
  }

  public createRightArrowSelector() {
    const rightArrowSelector = this.scene.add
      .image(
        screen.width * 0.0461200586,
        screen.width * 0.1815519766,
        'selector'
      )
      .setOrigin(0, 0);
    rightArrowSelector.width = screen.width * 0.0292825769;
    rightArrowSelector.height = screen.width * 0.0292825769;
    rightArrowSelector.displayWidth = rightArrowSelector.width;
    rightArrowSelector.displayHeight = rightArrowSelector.height;
    rightArrowSelector.visible = false;
    return rightArrowSelector;
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
