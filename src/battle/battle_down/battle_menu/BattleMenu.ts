import Phaser from 'phaser';
import BattleBag from '../battle_bag/BattleBag';
import BattleMoves from '../battle_moves/BattleMoves';
import BattlePartyMenu, {
  BattlePartyState,
} from '../battle_party_menu/BattlePartyMenu';
import axios from 'axios';
import { url } from '~/constants/Constants';
import BattleMenuGraphicsManager from './BattleMenuGraphicsManager';
import { Item } from '~/types/myTypes';
import { getItemsPromise } from '~/promises/itemsDatabasePromises';

const notifyUpperPromise = (id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.get(`${url}/real-time/notify-upper/${id}`).then((response) => {
      console.log('Successfully sent');
      console.log(response.data);
      resolve('success');
    });
  });
};

const getPokemonHealthPromise = (id: number, index: number) => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/health/get-one/${id}/${index}`).then((response) => {
      console.log(response.data);
      resolve(parseInt(response.data.data));
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
  private userID!: number;
  private items!: Item[][];
  private playerHealths: number[] = [];
  private opponentHealths: number[] = [];
  constructor() {
    super('battle-menu');
  }

  async create(data: { sceneToRemove: string; userID: number }) {
    this.scene.remove(data.sceneToRemove);
    this.cursor = -1;
    this.userID = data.userID;
    // this.teamMembers = await getTeamPromise(this.userID);
    // this.pokemons = await getPokemons(this.teamMembers);
    const items = await getItemsPromise(this.userID, 'down');
    const pokeBalls: Item[] = items.pokeBalls;
    const increaseStats: Item[] = items.increaseStats;
    const increaseHealth: Item[] = items.increaseHealth;
    const cures: Item[] = items.cures;
    this.items = [pokeBalls, increaseStats, increaseHealth, cures];
    //TODO: Get healths
    const opponentID = this.userID === 0 ? 1 : 0;
    for (let i = 0; i < 6; i++) {
      this.playerHealths[i] = await getPokemonHealthPromise(this.userID, i);
      this.opponentHealths[i] = await getPokemonHealthPromise(opponentID, i);
    }
    // this.items = this.parseData(tmpItems);
    // this.itemsNames = await this.requestAllTexts(this.items);
    // console.log('Items ', this.items);
    // console.log('Item Names', this.itemsNames);
    const graphicsManager = new BattleMenuGraphicsManager(this);
    const bg = graphicsManager.createBackground();
    // Fight option and selector
    const fightOption = graphicsManager.createFightOption();
    const fightSelector = graphicsManager.createFightOptionSelector();
    this.panels.push(fightOption);
    this.selectors.push(fightSelector);
    // Bag Option and selector
    const bagOption = graphicsManager.createBagOption();
    const bagSelector = graphicsManager.createBagOptionSelector();
    this.panels.push(bagOption);
    this.selectors.push(bagSelector);
    // Run option and selector
    const runOption = graphicsManager.createRunOption();
    const runSelector = graphicsManager.createRunOptionSelector();
    this.panels.push(runOption);
    this.selectors.push(runSelector);
    // Pokemon option and selector
    const pokemonOption = graphicsManager.createPokemonOption();
    const pokemonSelector = graphicsManager.createPokemonOptionSelector();
    this.panels.push(pokemonOption);
    this.selectors.push(pokemonSelector);

    let playerPokeBallX = screen.width * 0.0622254758;
    for (
      let i = 0;
      i < 6;
      i++, playerPokeBallX += screen.width * 0.0204978038
    ) {
      const playerPokeBall = graphicsManager.createPlayerPokeBall(
        playerPokeBallX,
        this.playerHealths[i]
      );
    }
    let enemyPokeBallX = screen.width * 0.0805270864;
    for (let i = 0; i < 6; i++, enemyPokeBallX += screen.width * 0.0146412884) {
      const enemyPokeBall = graphicsManager.createOpponentPokeBall(
        enemyPokeBallX,
        this.opponentHealths[i]
      );
    }
    //TODO: Input keyboards
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
    await notifyUpperPromise(this.userID);
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
          userID: this.userID,
        });
        break;
      }
      case CursorPosition.BAG: {
        // this.switchOff();
        // this.scene.add('battle-bag', BattleBag, true, {
        //   sceneToRemove: 'battle-menu',
        //   bPressedCount: 0,
        //   userID: this.userID,
        //   itemsToParse: this.items,
        // });
        break;
      }
      case CursorPosition.POKEMON: {
        this.switchOff();
        this.scene.add('battle-party-menu', BattlePartyMenu, true, {
          sceneToRemove: 'battle-menu',
          bPressedCount: 0,
          state: BattlePartyState.SWITCH,
          userID: this.userID,
        });
        break;
      }
    }
  }
}
