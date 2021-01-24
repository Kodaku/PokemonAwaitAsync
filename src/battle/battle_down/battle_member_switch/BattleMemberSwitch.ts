import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import BattlePartyMenu, {
  BattlePartyState,
} from '../battle_party_menu/BattlePartyMenu';
import axios from 'axios';
import BattleMemberSwitchGraphicsManager from './BattleMemberSwitchGraphicsManager';
import { Pokemon } from '~/types/myTypes';
import { createIconAnims } from '~/scenes/animations/iconAnims';
import BattleBackground, {
  BackgroundState,
} from '../battle_background/BattleBackground';
import BattleMenu from '../battle_menu/BattleMenu';

const notifyUpperSwitchPromise = (pokemonIndex: number, id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/switch/${pokemonIndex}/${id}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyUpperFaintedPromise = (pokemonIndex: number, id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/fainted/${pokemonIndex}/${id}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyOpponentChoice = (
  choiceType: string,
  pokemonIndex: number,
  velocity: number,
  id: number
) => {
  const data = `${choiceType},${velocity},${pokemonIndex}`;
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/battle/notify-choice-upper/${id}/${data}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyOpponentChoiceFainted = (
  choiceType: string,
  pokemonIndex: number,
  id: number
) => {
  const data = `${choiceType},${pokemonIndex}`;
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/battle/notify-choice-fainted/${id}/${data}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

export default class BattleMemberSwitch extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  private state!: BattlePartyState;
  private pokemons!: Pokemon[];
  private inBattleIndex!: number;
  private userID!: number;
  constructor() {
    super('battle-member-switch');
  }

  create(data: {
    sceneToRemove: string;
    bPressedCount: number;
    state: BattlePartyState;
    pokemons: Pokemon[];
    inBattleIndex: number;
    userID: number;
  }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.state = data.state;
    this.pokemons = data.pokemons;
    this.inBattleIndex = data.inBattleIndex;
    this.userID = data.userID;
    this.cursor = -1;
    for (let i = 0; i < this.pokemons.length; i++) {
      createIconAnims(this.anims, this.pokemons[i].pokedexNumber);
    }
    const menuSelectSound = this.sound.add("menu-select-sound");
    const menuChooseSound = this.sound.add("menu-choose-sound");
    const menuCancel = this.sound.add("cancel-sound");
    const graphicsManager = new BattleMemberSwitchGraphicsManager(this);
    const bg = graphicsManager.createBackground();
    // Big Box image and selector
    const bigBox = graphicsManager.createBigBox();
    const bigBoxSelector = graphicsManager.createBigBoxSelector();
    this.panels.push(bigBox);
    this.selectors.push(bigBoxSelector);
    //Pokemon sprite
    const pokemonSprite = graphicsManager.createPokemonSprite();
    pokemonSprite.anims.play(
      `icon${this.pokemons[this.inBattleIndex].pokedexNumber}-move`
    );
    // Pokemon name
    const pokemonName = graphicsManager.createPokemonName(
      this.pokemons[this.inBattleIndex]
    );
    //In battle text
    const inBattle = graphicsManager.createInBattleText(this.inBattleIndex);
    // Back image
    const backImage = graphicsManager.createBackImage();
    this.input.keyboard.on(
      'keydown-R',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.cursor !== -1) {
          menuChooseSound.play();
          this.notifyUpperScreen();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-B',
      () => {
        this.bPressedCount++;
        console.log(this.bPressedCount);
        if (this.bPressedCount > 0) {
          this.switchOff();
          menuCancel.play();
          this.scene.add('battle-party-menu', BattlePartyMenu, true, {
            sceneToRemove: 'battle-member-switch',
            bPressedCount: -1,
            state: this.state,
            userID: data.userID,
            pokemons: this.pokemons,
          });
        }
      },
      this
    );
  }

  private async notifyUpperScreen() {
    switch (this.state) {
      case BattlePartyState.SWITCH: {
        await notifyUpperSwitchPromise(this.inBattleIndex, this.userID);
        await notifyOpponentChoice(
          'SWITCH',
          this.inBattleIndex,
          999,
          this.userID
        );
        this.switchOff();
        this.scene.add('battle-background', BattleBackground, true, {
          sceneToRemove: 'battle-member-switch',
          userID: this.userID,
          state: BackgroundState.TURN_CHOICE,
        });
        break;
      }
      case BattlePartyState.SWITCH_FAINTED: {
        await notifyUpperFaintedPromise(this.inBattleIndex, this.userID);
        await notifyOpponentChoiceFainted(
          'SWITCH-FAINTED',
          this.inBattleIndex,
          this.userID
        );
        this.switchOff();
        this.scene.add('battle-menu', BattleMenu, true, {
          sceneToRemove: 'battle-member-switch',
          userID: this.userID,
        });
        break;
      }
    }
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
    }
  }

  private switchOff() {
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-B');
  }
}
