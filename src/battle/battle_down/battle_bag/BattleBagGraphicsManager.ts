import Phaser from 'phaser';

export default class BattleBagGraphicsManager {
  constructor(public scene: Phaser.Scene) {}

  public createBackground() {
    const bg = this.scene.add.image(0, 0, 'battle-bag-bg').setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = this.scene.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createHpRestore() {
    const hpRestore = this.scene.add.image(0, 20, 'hp-restore').setOrigin(0, 0);
    hpRestore.width = (this.scene.game.config.width as number) / 2;
    hpRestore.height = (this.scene.game.config.height as number) / 3.5;
    hpRestore.displayWidth = hpRestore.width;
    hpRestore.displayHeight = hpRestore.height;
    return hpRestore;
  }

  public createHpRestoreSelector() {
    const hpRestoreSelector = this.scene.add
      .image(0, 20, 'selector')
      .setOrigin(0, 0);
    hpRestoreSelector.width = (this.scene.game.config.width as number) / 2;
    hpRestoreSelector.height = (this.scene.game.config.height as number) / 3.5;
    hpRestoreSelector.displayWidth = hpRestoreSelector.width;
    hpRestoreSelector.displayHeight = hpRestoreSelector.height;
    hpRestoreSelector.visible = false;
    return hpRestoreSelector;
  }

  public createPokeBalls() {
    const pokeBalls = this.scene.add
      .image(
        (this.scene.game.config.width as number) / 2,
        20,
        'poke-balls-menu'
      )
      .setOrigin(0, 0);
    pokeBalls.width = (this.scene.game.config.width as number) / 2;
    pokeBalls.height = (this.scene.game.config.height as number) / 3.5;
    pokeBalls.displayWidth = pokeBalls.width;
    pokeBalls.displayHeight = pokeBalls.height;
    return pokeBalls;
  }

  public createPokeBallsSelector() {
    const pokeBallsSelector = this.scene.add
      .image((this.scene.game.config.width as number) / 2, 20, 'selector')
      .setOrigin(0, 0);
    pokeBallsSelector.width = (this.scene.game.config.width as number) / 2;
    pokeBallsSelector.height = (this.scene.game.config.height as number) / 3.5;
    pokeBallsSelector.displayWidth = pokeBallsSelector.width;
    pokeBallsSelector.displayHeight = pokeBallsSelector.height;
    pokeBallsSelector.visible = false;
    return pokeBallsSelector;
  }

  public createStatusRestore() {
    const statusRestore = this.scene.add
      .image(
        0,
        (this.scene.game.config.height as number) / 2.2,
        'status-restore'
      )
      .setOrigin(0, 0);
    statusRestore.width = (this.scene.game.config.width as number) / 2;
    statusRestore.height = (this.scene.game.config.height as number) / 3.5;
    statusRestore.displayWidth = statusRestore.width;
    statusRestore.displayHeight = statusRestore.height;
    return statusRestore;
  }

  public createStatusRestoreSelector() {
    const statusRestoreSelector = this.scene.add
      .image(0, (this.scene.game.config.height as number) / 2.2, 'selector')
      .setOrigin(0, 0);
    statusRestoreSelector.width = (this.scene.game.config.width as number) / 2;
    statusRestoreSelector.height =
      (this.scene.game.config.height as number) / 3.5;
    statusRestoreSelector.displayWidth = statusRestoreSelector.width;
    statusRestoreSelector.displayHeight = statusRestoreSelector.height;
    statusRestoreSelector.visible = false;
    return statusRestoreSelector;
  }

  public createBattleItems() {
    const battleItems = this.scene.add
      .image(
        (this.scene.game.config.width as number) / 2,
        (this.scene.game.config.height as number) / 2.2,
        'battle-items'
      )
      .setOrigin(0, 0);
    battleItems.width = (this.scene.game.config.width as number) / 2;
    battleItems.height = (this.scene.game.config.height as number) / 3.5;
    battleItems.displayWidth = battleItems.width;
    battleItems.displayHeight = battleItems.height;
    return battleItems;
  }

  public createBattleItemsSelector() {
    const battleItemsSelector = this.scene.add
      .image(
        (this.scene.game.config.width as number) / 2,
        (this.scene.game.config.height as number) / 2.2,
        'selector'
      )
      .setOrigin(0, 0);
    battleItemsSelector.width = (this.scene.game.config.width as number) / 2;
    battleItemsSelector.height =
      (this.scene.game.config.height as number) / 3.5;
    battleItemsSelector.displayWidth = battleItemsSelector.width;
    battleItemsSelector.displayHeight = battleItemsSelector.height;
    battleItemsSelector.visible = false;
    return battleItemsSelector;
  }

  public createIconsText() {
    const hpText = this.scene.add.text(45, 60, 'HP/PP\nRESTORE', {
      fontSize: 19,
      align: 'center',
    });
    const pokeBallText = this.scene.add.text(
      40 + (this.scene.game.config.width as number) / 2,
      60,
      'POKE BALLS',
      {
        fontSize: 19,
        align: 'center',
      }
    );
    const restoreText = this.scene.add.text(
      45,
      40 + (this.scene.game.config.height as number) / 2.2,
      'STATUS\nRESTORE',
      {
        fontSize: 19,
        align: 'center',
      }
    );
    const battleItemText = this.scene.add.text(
      25 + (this.scene.game.config.width as number) / 2,
      40 + (this.scene.game.config.height as number) / 2.2,
      'BATTLE ITEMS',
      {
        fontSize: 19,
        align: 'center',
      }
    );
  }

  public createLastItemUsed() {
    const lastItemEmpty = this.scene.add
      .image(5, 252, 'last-item-empty')
      .setOrigin(0, 0);
    lastItemEmpty.width = 270;
    lastItemEmpty.height = 30;
    lastItemEmpty.displayWidth = lastItemEmpty.width;
    lastItemEmpty.displayHeight = lastItemEmpty.height;
    return lastItemEmpty;
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
