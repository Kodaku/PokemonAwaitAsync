import Phaser from 'phaser';
import { itemOptions, itemsText } from '~/constants/Constants';

export default class BagDownGraphicManager {
  constructor(public scene: Phaser.Scene) {}

  public createBagType1(
    bagX: number,
    bagY: number
  ): Phaser.Physics.Arcade.Sprite {
    const bagType1 = this.scene.physics.add.sprite(bagX, bagY, '');
    bagType1.width = screen.width * 0.0146412884;
    bagType1.height = screen.height * 0.0260416667;
    bagType1.displayHeight = bagType1.height;
    bagType1.displayWidth = bagType1.width;
    bagType1.anims.play(`bag1-m-move`);
    return bagType1;
  }

  public createBagType2(
    bagX: number,
    bagY: number,
    bagType1: Phaser.Physics.Arcade.Sprite
  ) {
    const bagType2 = this.scene.physics.add.sprite(
      bagX - screen.width * 0.0109809663,
      bagY + bagType1.height / 2,
      ''
    );
    bagType2.width = screen.width * 0.0146412884;
    bagType2.height = screen.height * 0.0260416667;
    bagType2.displayHeight = bagType2.height;
    bagType2.displayWidth = bagType2.width;
    bagType2.anims.play(`bag2-m-idle`);
    return bagType2;
  }

  public createBagType3(
    bagX: number,
    bagY: number,
    bagType1: Phaser.Physics.Arcade.Sprite
  ) {
    const bagType3 = this.scene.physics.add.sprite(
      bagX + screen.width * 0.0204978038,
      bagY + bagType1.height / 2 + screen.height * 0.0065104167,
      ''
    );
    bagType3.width = screen.width * 0.0146412884;
    bagType3.height = screen.height * 0.0260416667;
    bagType3.displayHeight = bagType3.height;
    bagType3.displayWidth = bagType3.width;
    bagType3.anims.play(`bag3-m-idle`);
    return bagType3;
  }

  public createBagType4(
    bagX: number,
    bagY: number,
    bagType1: Phaser.Physics.Arcade.Sprite
  ) {
    const bagType4 = this.scene.physics.add.sprite(
      bagX + screen.width * 0.0534407028,
      bagY + bagType1.height / 2 - screen.height * 0.0299479167,
      ''
    );
    bagType4.width = screen.width * 0.0146412884;
    bagType4.height = screen.height * 0.0260416667;
    bagType4.displayHeight = bagType4.height;
    bagType4.displayWidth = bagType4.width;
    bagType4.anims.play(`bag4-m-idle`);
    return bagType4;
  }

  public createBagType5(bagX: number, bagY: number) {
    const bagType5 = this.scene.physics.add.sprite(bagX + screen.width * 0.0512445095, bagY - screen.height * 0.0065104167, '');
    bagType5.width = screen.width * 0.0146412884;
    bagType5.height = screen.height * 0.0260416667;
    bagType5.displayHeight = bagType5.height;
    bagType5.displayWidth = bagType5.width;
    bagType5.anims.play(`bag5-m-idle`);
    return bagType5;
  }

  public createLeftLightArrow(leftArrowX: number, leftArrowY: number) {
    const leftLightArrow = this.scene.physics.add.sprite(
      leftArrowX,
      leftArrowY,
      ''
    );
    leftLightArrow.width = screen.width * 0.0183016105;
    leftLightArrow.height = screen.height * 0.0325520833;
    leftLightArrow.displayHeight = leftLightArrow.height;
    leftLightArrow.displayWidth = leftLightArrow.width;
    leftLightArrow.anims.play(`left-light-arrow-idle`);

    return leftLightArrow;
  }

  public createRightLightArrow(rightArrowX: number, rightArrowY: number) {
    const rightLightArrow = this.scene.physics.add.sprite(
      rightArrowX,
      rightArrowY,
      ''
    );
    rightLightArrow.width = screen.width * 0.0183016105;
    rightLightArrow.height = screen.height * 0.0325520833;
    rightLightArrow.displayHeight = rightLightArrow.height;
    rightLightArrow.displayWidth = rightLightArrow.width;
    rightLightArrow.anims.play(`right-light-arrow-idle`);
    return rightLightArrow;
  }

  public createItemsText(
    leftArrowX: number,
    leftArrowY: number,
    rightArrowX: number
  ) {
    let texts: Phaser.GameObjects.Text[] = [];
    for (let i = 0; i < itemsText.length; i++) {
      const text = this.scene.add.text(
        leftArrowX + screen.width * 0.0292825769,
        leftArrowY - screen.height * 0.0104166667,
        itemsText[i],
        {
          fontSize: screen.width * 0.0146412884,
        }
      );
      if (text.x + text.width > rightArrowX - leftArrowX) {
        text.setFontSize(screen.width * 0.0109809663);
      }
      if (i > 0) {
        text.visible = false;
      }
      texts.push(text);
    }
    return texts;
  }

  public createItemPanel(itemX: number, itemY: number) {
    const itemPanel = this.scene.add.image(itemX, itemY, 'item-unselected');
    itemPanel.width = screen.width * 0.1134699854;
    itemPanel.height = screen.height * 0.0455729167;
    itemPanel.displayWidth = itemPanel.width;
    itemPanel.displayHeight = itemPanel.height;
    return itemPanel;
  }

  public createCommandUnsel(bg: Phaser.GameObjects.Image, y: number) {
    const commandUnsel = this.scene.add
      .image(bg.width - screen.width * 0.2196193265, y, 'command-unsel')
      .setDepth(2)
      .setOrigin(0, 0);
    commandUnsel.height = screen.width * 0.0219619327;
    commandUnsel.width = screen.height * 0.15625;
    commandUnsel.displayHeight = commandUnsel.height;
    commandUnsel.displayWidth = commandUnsel.width;
    commandUnsel.visible = false;

    return commandUnsel;
  }

  public createCommandText(
    commandUnsel: Phaser.GameObjects.Image,
    index: number
  ) {
    const commandText = this.scene.add
      .text(commandUnsel.x + screen.width * 0.0073206442, commandUnsel.y + screen.height * 0.0078125, itemOptions[index], {
        fontSize: screen.width * 0.0131771596,
      })
      .setDepth(2)
      .setOrigin(0, 0);
    commandText.visible = false;

    return commandText;
  }
}
