import Phaser from 'phaser';
import BattleBag from './BattleBag';
import BattleMoves from './BattleMoves';
import BattlePartyMenu from './BattlePartyMenu';
import axios from 'axios';
import { url } from '~/constants/Constants';

const notifyUpperPromise = () => {
  return new Promise((resolve: () => void) => {
    axios.get(`${url}/real-time/notify-upper`).then((response) => {
      console.log('Successfully sent');
      console.log(response.data);
      resolve();
    });
  });
};

enum CursorPosition {
  FIGHT = 0,
  BAG = 1,
  POKEMON = 3,
}

export default class BattleMenu extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  constructor() {
    super('battle-menu');
  }

  create(data: { sceneToRemove: string }) {
    this.scene.remove(data.sceneToRemove);
    this.cursor = -1;
    const bg = this.add.image(0, 0, 'battle-menu-bg').setOrigin(0, 0);
    bg.width = this.game.config.width as number;
    bg.height = this.game.config.height as number;
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;

    const fightOption = this.add.image(0, 0, 'fight-option').setOrigin(0, 0);
    fightOption.width = this.game.config.width as number;
    fightOption.height = this.game.config.height as number;
    fightOption.displayWidth = fightOption.width;
    fightOption.displayHeight = fightOption.height;

    const fightSelector = this.add.image(105, 90, 'selector').setOrigin(0, 0);
    fightSelector.width = 130;
    fightSelector.height = 100;
    fightSelector.displayWidth = fightSelector.width;
    fightSelector.displayHeight = fightSelector.height;
    fightSelector.visible = false;

    this.panels.push(fightOption);
    this.selectors.push(fightSelector);

    const bagOption = this.add.image(0, 220, 'bag-option').setOrigin(0, 0);
    bagOption.width = 100;
    bagOption.height = 70;
    bagOption.displayWidth = bagOption.width;
    bagOption.displayHeight = bagOption.height;

    const bagSelector = this.add.image(0, 220, 'selector').setOrigin(0, 0);
    bagSelector.width = 100;
    bagSelector.height = 70;
    bagSelector.displayWidth = bagSelector.width;
    bagSelector.displayHeight = bagSelector.height;
    bagSelector.visible = false;

    this.panels.push(bagOption);
    this.selectors.push(bagSelector);

    const runOption = this.add.image(130, 240, 'run-option').setOrigin(0, 0);
    runOption.width = 80;
    runOption.height = 50;
    runOption.displayWidth = runOption.width;
    runOption.displayHeight = runOption.height;

    const runSelector = this.add.image(130, 240, 'selector').setOrigin(0, 0);
    runSelector.width = 80;
    runSelector.height = 50;
    runSelector.displayWidth = runSelector.width;
    runSelector.displayHeight = runSelector.height;
    runSelector.visible = false;

    this.panels.push(runOption);
    this.selectors.push(runSelector);

    const pokemonOption = this.add
      .image(240, 220, 'pokemon-option')
      .setOrigin(0, 0);
    pokemonOption.width = 100;
    pokemonOption.height = 70;
    pokemonOption.displayWidth = pokemonOption.width;
    pokemonOption.displayHeight = pokemonOption.height;

    const pokemonSelector = this.add
      .image(240, 220, 'selector')
      .setOrigin(0, 0);
    pokemonSelector.width = 100;
    pokemonSelector.height = 70;
    pokemonSelector.displayWidth = pokemonSelector.width;
    pokemonSelector.displayHeight = pokemonSelector.height;
    pokemonSelector.visible = false;

    this.panels.push(pokemonOption);
    this.selectors.push(pokemonSelector);

    let playerPokeBallX = 85;
    for (let i = 0; i < 6; i++, playerPokeBallX += 28) {
      const playerPokeBall = this.add
        .image(playerPokeBallX, 190, 'battle-ball-normal')
        .setOrigin(0, 0);
    }
    let enemyPokeBallX = 110;
    for (let i = 0; i < 6; i++, enemyPokeBallX += 20) {
      const enemyPokeBall = this.add
        .image(enemyPokeBallX, 60, 'battle-ball-normal')
        .setOrigin(0, 0);
      enemyPokeBall.width = 20;
      enemyPokeBall.height = 20;
      enemyPokeBall.displayWidth = enemyPokeBall.width;
      enemyPokeBall.displayHeight = enemyPokeBall.height;
    }

    this.input.keyboard.on(
      'keydown-R',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-L',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.L;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        this.notifyUpperScreen();
        this.switchMenu();
      },
      this
    );
  }

  private async notifyUpperScreen() {
    await notifyUpperPromise();
    this.createSSE();
  }

  private createSSE() {
    const sse = new EventSource(`${url}/delayed/notify-lower`);
    sse.addEventListener('message', (ev) => {
      console.log('From Upper Screen');
      console.log(ev.data);
      sse.close();
    });
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
      case Phaser.Input.Keyboard.KeyCodes.L: {
        this.cursor--;
        if (this.cursor < 0) {
          this.cursor = 0;
        }
        break;
      }
    }
  }

  private switchOff() {
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-Z');
  }

  private switchMenu() {
    switch (this.cursor) {
      case CursorPosition.FIGHT: {
        this.switchOff();
        this.scene.add('battle-moves-menu', BattleMoves, true, {
          sceneToRemove: 'battle-menu',
        });
        break;
      }
      case CursorPosition.BAG: {
        this.switchOff();
        this.scene.add('battle-bag', BattleBag, true, {
          sceneToRemove: 'battle-menu',
          bPressedCount: 0,
        });
        break;
      }
      case CursorPosition.POKEMON: {
        this.switchOff();
        this.scene.add('battle-party-menu', BattlePartyMenu, true, {
          sceneToRemove: 'battle-menu',
          bPressedCount: 0,
        });
        break;
      }
    }
  }
}
