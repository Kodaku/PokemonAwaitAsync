import Phaser from 'phaser';
import { pokemon_types, url } from '~/constants/Constants';
import BattleMenu from '../battle_menu/BattleMenu';
import axios from 'axios';
import { sceneEvents } from '~/events/EventCenter';
import BattlePartyMenu, {
  BattlePartyState,
} from '../battle_party_menu/BattlePartyMenu';
import BattleMovesGraphicsManager from './BattleMovesGraphicsManager';
import { Move, Pokemon, TeamMember } from '~/types/myTypes';
import { getPokemons, getTeamPromise } from '~/promises/pokemonPromises';
import BattleBackground, {
  BackgroundState,
} from '../battle_background/BattleBackground';
import menu from '~/menu';
import { getMove } from '~/promises/movesPromises';

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

const getPokemonHealthPromise = (id: number, index: number) => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/health/get-one/${id}/${index}`).then((response) => {
      console.log(response.data);
      resolve(parseInt(response.data.data));
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
  private pokemonMoves: Move[] = [];
  constructor() {
    super('battle-moves-menu');
  }

  async create(data: { sceneToRemove: string; userID: number }) {
    this.scene.remove(data.sceneToRemove);
    this.userID = data.userID;
    this.teamMembers = await getTeamPromise(this.userID);
    this.pokemons = await getPokemons(this.teamMembers);
    this.pokemonIndex = await getPlayerPokemonIndex(this.userID);
    for (let i = 0; i < this.pokemons.length; i++) {
      this.pokemons[i].ps = await getPokemonHealthPromise(this.userID, i);
    }
    this.cursor = -1;
    let indexes: number[] = [];
    // for (let i = 0; i < 4; i++) {
    //   const index = Math.floor(Math.random() * pokemon_types.length);
    //   indexes.push(index);
    // }
    const menuSelectSound = this.sound.add("menu-select-sound");
    const menuChooseSound = this.sound.add("menu-choose-sound");
    const menuCancel = this.sound.add("cancel-sound");
    const graphicsManager = new BattleMovesGraphicsManager(this);
    const bg = graphicsManager.createBackground();
    let boxX = 0;
    let boxY = screen.height * 0.0651041667;
    this.moves = this.pokemons[this.pokemonIndex].moveNames;
    for(let i = 0; i < this.moves.length; i++){
      this.pokemonMoves[i] = await getMove(this.moves[i]);
    }
    //TODO: Get moves and tune their pp and type, also when a move is selected decrease its pp
    for (let i = 0; i < 4; i++) {
      // Move Box and selector
      const moveBox = graphicsManager.createMoveBox(boxX, boxY, this.pokemonMoves[i].type);
      const moveBoxSelector = graphicsManager.createMoveBoxSelector(
        boxX,
        boxY,
        moveBox
      );
      this.panels.push(moveBox);
      this.selectors.push(moveBoxSelector);
      // Move Text
      graphicsManager.createMoveText(boxX, boxY, this.moves[i], this.pokemonMoves[i].pp, this.pokemonMoves[i].pp);
      // Move type image
      const moveTypeImage = graphicsManager.createMoveTypeImage(
        boxX,
        boxY,
        this.pokemonMoves[i].type
      );

      boxX += moveBox.width;
      if (
        boxX + screen.width * 0.0146412884 >
        (this.game.config.width as number)
      ) {
        boxX = 0;
        boxY += moveBox.height + screen.height * 0.0065104167;
      }
    }
    //Player poke balls
    graphicsManager.createPlayerPokeBalls(this.pokemons);
    // Back Image
    const backImage = graphicsManager.createBackImage();
    //TODO: Input keyboards
    this.input.keyboard.on(
      'keydown-R',
      () => {
        if (this.shouldPressKey) {
          menuSelectSound.play();
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
          menuSelectSound.play();
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
          menuSelectSound.play();
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
          menuSelectSound.play();
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
            menuChooseSound.play();
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
          menuCancel.play();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-moves-menu',
            userID: this.userID,
          });
        }
      },
      this
    );
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
  }
}
