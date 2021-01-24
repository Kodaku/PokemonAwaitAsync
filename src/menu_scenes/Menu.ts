import Phaser from 'phaser';
import { totalPanels } from '~/constants/Constants';
import { IconSelectable, PartyMenuState } from '~/enums/depthLevels';
import { sceneEvents } from '~/events/EventCenter';
import BagMenuDown from './bag_menu/BagMenuDown';
import BackgroundCreator from './creators/BackgroundCreator';
import MenuCursorManger from './creators/menu_creators/MenuCursorManager';
import MenuEventManager from './creators/menu_creators/MenuEventManager';
import MenuGraphicCreator from './creators/menu_creators/MenuGraphicCreator';
import MenuRenderManager from './creators/menu_creators/MenuRenderManager';
import PartyMenu from './party_menu/PartyMenu';

export default class Menu extends Phaser.Scene {
  // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private backgroundCreator: BackgroundCreator = new BackgroundCreator();
  private menuCursor: MenuCursorManger = new MenuCursorManger();
  private userID!: number;
  private keyPressed!: number;
  constructor() {
    super('menu');
  }

  preload() {
    // this.cursors = this.input.keyboard.createCursorKeys();
  }

  create(data: { id: number; sceneName: string }) {
    this.userID = data.id;
    this.scene.remove(data.sceneName);
    // console.log('Menu');
    const menu = this.backgroundCreator.createBackground(this, 'menu');
    const menuCreator = new MenuGraphicCreator(this);
    const renderManager = new MenuRenderManager();
    const eventCreator = new MenuEventManager();
    const menuSelectSound = this.sound.add("menu-select-sound");
    const menuChooseSound = this.sound.add("menu-choose-sound");
    let panelX = (3 / 1366) * screen.width;
    let panelY = (40 / 768) * screen.height;
    for (let i = 0; i < totalPanels; i++) {
      const panel = menuCreator.createPanel(panelX, panelY, menu);
      const icon = menuCreator.createIcon(panelX, panelY, panel, i);
      const text = menuCreator.createText(panelX, panelY, panel, i);
      panelX += panel.width;
      if (panelX >= menu.width) {
        panelX = (3 / 1366) * screen.width;
        panelY += panel.height + (10 / 768) * screen.height;
      }
      renderManager.pushPanel(panel, i);
      renderManager.pushIcon(icon, i);
      renderManager.pushIconText(text, i);
    }

    const exit = menuCreator.createExit(menu);
    eventCreator.createEvents(renderManager);

    sceneEvents.on('X-pressed-empty', this.restartEmptyMenu, this);

    this.input.keyboard.on('keydown-X', () => {
      sceneEvents.emit('X-pressed-empty');
    });
    this.input.keyboard.on('keydown-R', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.R;
      menuSelectSound.play();
    });
    this.input.keyboard.on('keydown-L', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.L;
      menuSelectSound.play();
    });
    this.input.keyboard.on('keydown-U', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.U;
      menuSelectSound.play();
    });
    this.input.keyboard.on('keydown-D', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.D;
      menuSelectSound.play();
    });
    this.input.keyboard.on('keydown-Z', () => {
      menuChooseSound.play();
      switch (this.menuCursor.getCursorPosition()) {
        case IconSelectable.POKEMON: {
          this.removeEvents();
          this.scene.add('party-menu', PartyMenu, true, {
            userID: this.userID,
            sceneName: 'menu',
            state: PartyMenuState.DISPLAY,
            itemToGive: {
              index: '',
              description: '',
              name: '',
            },
          });
          break;
        }
        case IconSelectable.BAG: {
          this.removeEvents();
          this.scene.add('bag-menu-down', BagMenuDown, true, {
            userID: this.userID,
            sceneName: 'menu',
          });
          break;
        }
      }
    });
  }

  private removeEvents() {
    sceneEvents.off('X-pressed-empty');
    sceneEvents.off('change-texture');
    this.input.keyboard.off('keydown-S');
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-Z');
    // this.scene.add(sceneName, { userID: this.userID, sceneName: 'menu' });
  }

  private restartEmptyMenu() {
    sceneEvents.off('X-pressed-empty');
    sceneEvents.off('change-texture');
    this.input.keyboard.off('keydown-S');
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-Z');
    this.scene.start('empty-scene', { removeMenu: true });
  }

  update() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.menuCursor.incrementCursor(2, 6);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.menuCursor.decrementCursor(2);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.R) {
      this.menuCursor.incrementCursor(1, 6);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.L) {
      this.menuCursor.decrementCursor(1);
      this.keyPressed = -3;
    }
  }
}
