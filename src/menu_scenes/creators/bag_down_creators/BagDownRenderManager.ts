import Phaser from 'phaser';
import { sliderEndY } from '~/constants/Constants';
import { ItemToString } from '~/types/myTypes';

export default class BagDownRenderManager {
  private commandsText: Phaser.GameObjects.Text[] = [];
  private fadeRect!: Phaser.GameObjects.Rectangle;
  private bagAnims: Phaser.Physics.Arcade.Sprite[] = [];
  private bagTexts: Phaser.GameObjects.Text[][] = [];
  private sliders: Phaser.GameObjects.Image[] = [];
  private bagItems: Phaser.GameObjects.Image[][] = [];
  private commandsUnsel: Phaser.GameObjects.Image[] = [];
  private texts: Phaser.GameObjects.Text[] = [];
  private lightArrows: Phaser.Physics.Arcade.Sprite[] = [];
  private itemNames: ItemToString[][] = [];

  public pushBagAnim(bagAnim: Phaser.Physics.Arcade.Sprite) {
    this.bagAnims.push(bagAnim);
  }

  public pushBagText(bagText: Phaser.GameObjects.Text[]) {
    this.bagTexts.push(bagText);
  }

  public pushSlider(slider: Phaser.GameObjects.Image) {
    this.sliders.push(slider);
  }

  public pushBagItem(bagItem: Phaser.GameObjects.Image[]) {
    this.bagItems.push(bagItem);
  }

  public pushCommandUnsel(commandUnsel: Phaser.GameObjects.Image) {
    this.commandsUnsel.push(commandUnsel);
  }

  public setTexts(texts: Phaser.GameObjects.Text[]) {
    this.texts = texts;
  }

  public pushLightArrow(lightArrow: Phaser.Physics.Arcade.Sprite) {
    this.lightArrows.push(lightArrow);
  }

  public pushCommandText(commandText: Phaser.GameObjects.Text) {
    this.commandsText.push(commandText);
  }

  public setItemNames(itemNames: ItemToString[][]) {
    this.itemNames = itemNames;
  }

  public renderAllBag(animsCursor: number) {
    for (let i = 0; i < this.bagAnims.length; i++) {
      if (i === animsCursor) {
        this.bagAnims[i].anims.play(`bag${i + 1}-m-move`);
      } else {
        this.bagAnims[i].anims.play(`bag${i + 1}-m-idle`);
      }
    }
  }

  public async renderItems(itemsCursor: number[], animsCursor: number) {
    const itemsText = this.bagTexts[animsCursor];
    for (let i = 0, j = 5; i < 6 && j >= 0; i++, j--) {
      const text = this.itemNames[animsCursor][itemsCursor[animsCursor] - j];
      itemsText[i].setText(text.name);
    }
  }

  public selectItem(itemsCursor: number[], animsCursor: number) {
    this.sliders.forEach((slider) => {
      if (this.sliders.indexOf(slider) == animsCursor) {
        slider.setY(
          (itemsCursor[animsCursor] * sliderEndY) /
            this.itemNames[animsCursor].length +
            (screen.height * 0.0559895833)
        );
        slider.visible = true;
      } else {
        slider.visible = false;
      }
    });
    const itemsPanel = this.bagItems[animsCursor];
    itemsPanel.forEach((item) => {
      if (itemsCursor[animsCursor] > 5 && itemsPanel.indexOf(item) == 5) {
        item.setTexture('item-selected');
      } else if (
        itemsCursor[animsCursor] <= 5 &&
        itemsPanel.indexOf(item) == itemsCursor[animsCursor]
      ) {
        item.setTexture('item-selected');
      } else {
        item.setTexture('item-unselected');
      }
    });
  }

  public renderCommands(commandCursor: number) {
    for (let i = 0; i < this.commandsUnsel.length; i++) {
      if (i === commandCursor) {
        this.commandsUnsel[i].setTexture('command-sel');
      } else {
        this.commandsUnsel[i].setTexture('command-unsel');
      }
    }
  }

  public manageRightCursorPress(animsCursor: number) {
    this.texts[animsCursor - 1].visible = false;
    this.texts[animsCursor].visible = true;
    this.bagItems[animsCursor - 1].forEach((el) => (el.visible = false));
    const items = this.bagItems[animsCursor];
    items.forEach((el) => {
      if (items.indexOf(el) < 6) {
        el.visible = true;
      }
    });
    this.bagTexts[animsCursor - 1].forEach((el) => (el.visible = false));
    const texts = this.bagTexts[animsCursor];
    texts.forEach((el) => {
      if (texts.indexOf(el) < 6) {
        el.visible = true;
      }
    });
    this.lightArrows[0].anims.play('right-light-arrow-move');
    this.lightArrows[1].anims.play('left-light-arrow-idle');
  }

  public manageLeftCursorPress(animsCursor: number) {
    this.texts[animsCursor + 1].visible = false;
    this.texts[animsCursor].visible = true;
    this.bagItems[animsCursor + 1].forEach((el) => (el.visible = false));
    const items = this.bagItems[animsCursor];
    items.forEach((el) => {
      if (items.indexOf(el) < 6) {
        el.visible = true;
      }
    });
    this.bagTexts[animsCursor + 1].forEach((el) => (el.visible = false));
    const texts = this.bagTexts[animsCursor];
    texts.forEach((el) => {
      if (texts.indexOf(el) < 6) {
        el.visible = true;
      }
    });
    this.lightArrows[0].anims.play('right-light-arrow-idle');
    this.lightArrows[1].anims.play('left-light-arrow-move');
  }

  public renderVisibleCommands(
    scene: Phaser.Scene,
    bg: Phaser.GameObjects.Image
  ) {
    for (let i = 0; i < this.commandsUnsel.length; i++) {
      this.commandsUnsel[i].visible = true;
      this.commandsText[i].visible = true;
    }
    this.fadeRect = scene.add
      .rectangle(0, 0, bg.width, bg.height, 0xffffff, 0.2)
      .setOrigin(0, 0);
  }

  public renderInvisibleCommands() {
    console.log(this.commandsUnsel);
    for (let i = 0; i < this.commandsUnsel.length; i++) {
      this.commandsUnsel[i].visible = false;
      this.commandsText[i].visible = false;
    }
    this.fadeRect.destroy();
  }
}
