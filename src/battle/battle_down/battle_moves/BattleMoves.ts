import Phaser from 'phaser';
import { pokemon_types, url } from '~/constants/Constants';
import BattleMenu from '../battle_menu/BattleMenu';
import axios from 'axios';
import { sceneEvents } from '~/events/EventCenter';
import BattlePartyMenu, {
  BattlePartyState,
} from '../battle_party_menu/BattlePartyMenu';
import BattleMovesGraphicsManager from './BattleMovesGraphicsManager';
import { Pokemon, TeamMember } from '~/types/myTypes';
import { getPokemons, getTeamPromise } from '~/promises/pokemonPromises';
import BattleBackground, {
  BackgroundState,
} from '../battle_background/BattleBackground';

const notifyUpperAttackPromise = (attackName: string, id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/attack/${attackName}/${id}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const getPlayerPokemonIndex = (id: number) => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/battle/pokemon-index/${id}`).then((response) => {
      console.log('Successfully sent');
      console.log(response.data);
      resolve(response.data.data);
    });
  });
};

const notifyOpponentChoice = (
  choiceType: string,
  moveName: string,
  velocity: number,
  id: number
) => {
  const data = `${choiceType},${velocity},${moveName}`;
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

export default class BattleMoves extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  private shouldPressKey: boolean = true;
  private pokemons: Pokemon[] = [];
  private teamMembers: TeamMember[] = [];
  private userID!: number;
  private pokemonIndex!: number;
  private moves: string[] = [];
  constructor() {
    super('battle-moves-menu');
  }

  async create(data: { sceneToRemove: string; userID: number }) {
    this.scene.remove(data.sceneToRemove);
    this.userID = data.userID;
    this.teamMembers = await getTeamPromise(this.userID);
    this.pokemons = await getPokemons(this.teamMembers);
    this.pokemonIndex = await getPlayerPokemonIndex(this.userID);
    this.cursor = -1;
    let indexes: number[] = [];
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * pokemon_types.length);
      indexes.push(index);
    }
    const graphicsManager = new BattleMovesGraphicsManager(this);
    const bg = graphicsManager.createBackground();
    let boxX = 0;
    let boxY = 50;
    this.moves = this.pokemons[this.pokemonIndex].moveNames;
    for (let i = 0; i < 4; i++) {
      // Move Box and selector
      const moveBox = graphicsManager.createMoveBox(boxX, boxY, indexes, i);
      const moveBoxSelector = graphicsManager.createMoveBoxSelector(
        boxX,
        boxY,
        moveBox
      );
      this.panels.push(moveBox);
      this.selectors.push(moveBoxSelector);
      // Move Text
      graphicsManager.createMoveText(boxX, boxY, this.moves[i]);
      // Move type image
      const moveTypeImage = graphicsManager.createMoveTypeImage(
        boxX,
        boxY,
        indexes,
        i
      );

      boxX += moveBox.width;
      if (boxX + 20 > (this.game.config.width as number)) {
        boxX = 0;
        boxY += moveBox.height + 5;
      }
    }
    //Player poke balls
    graphicsManager.createPlayerPokeBalls();
    // Back Image
    const backImage = graphicsManager.createBackImage();
    //TODO: Input keyboards
    this.input.keyboard.on(
      'keydown-R',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-L',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.L;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-U',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.U;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-D',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.D;
          this.updateCursor();
          this.renderAll();
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.cursor !== -1) {
          if (this.shouldPressKey) {
            this.shouldPressKey = false;
            this.notifyUpperScreen();
          }
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-B',
      () => {
        if (this.shouldPressKey) {
          this.keyCode = Phaser.Input.Keyboard.KeyCodes.B;
          this.switchOff();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-moves-menu',
            userID: this.userID,
          });
        }
      },
      this
    );

    sceneEvents.on(
      'can-press-key',
      () => {
        this.shouldPressKey = true;
      },
      true
    );
    sceneEvents.on('manage-move-action', this.manageReply, this);
  }

  private async notifyUpperScreen() {
    await notifyUpperAttackPromise(this.moves[this.cursor], this.userID);
    await notifyOpponentChoice(
      'ATTACK',
      this.moves[this.cursor],
      this.pokemons[this.pokemonIndex].speed,
      this.userID
    );
    this.switchOff();
    this.scene.add('battle-background', BattleBackground, true, {
      sceneToRemove: 'battle-moves-menu',
      userID: this.userID,
      state: BackgroundState.TURN_BATTLE,
    });
  }

  private manageReply(reply: string) {
    switch (reply) {
      case 'FAINTED': {
        this.switchOff();
        this.scene.add('battle-party-menu', BattlePartyMenu, true, {
          sceneToRemove: 'battle-moves-menu',
          bPressedCount: 0,
          state: BattlePartyState.SWITCH_FAINTED,
        });
        break;
      }
      default: {
        sceneEvents.emit('can-press-key');
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
      case Phaser.Input.Keyboard.KeyCodes.L: {
        this.cursor--;
        if (this.cursor < 0) {
          this.cursor = 0;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.U: {
        this.cursor -= 2;
        if (this.cursor < 0) {
          this.cursor += 2;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.D: {
        this.cursor += 2;
        if (this.cursor >= this.panels.length) {
          this.cursor -= 2;
        }
        break;
      }
    }
  }

  private switchOff() {
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-B');
    sceneEvents.off('can-press-key');
    sceneEvents.off('manage-move-action');
  }
}
