import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import BattleBag from '../battle_bag/BattleBag';
import BattleMemberSwitch from '../battle_member_switch/BattleMemberSwitch';
import BattleMenu from '../battle_menu/BattleMenu';
import BattlePartyMenu, {
  BattlePartyState,
} from '../battle_party_menu/BattlePartyMenu';
import BattleBackgroundGraphicsManager from './BattleBackgroundGraphicsManager';

export enum BackgroundState {
  INTRO,
  TURN_CHOICE,
  TURN_BATTLE,
}

export default class BattleBackground extends Phaser.Scene {
  private userID!: number;
  private state!: BackgroundState;
  constructor() {
    super('battle-background');
  }

  create(data: {
    sceneToRemove: string;
    userID: number;
    state: BackgroundState;
  }) {
    this.scene.remove(data.sceneToRemove);
    this.userID = data.userID;
    this.state = data.state;
    const graphicsManager = new BattleBackgroundGraphicsManager(this);
    graphicsManager.createBackground();
    switch (this.state) {
      case BackgroundState.INTRO: {
        const sse = new EventSource(
          `${url}/battle/wait-intro-lower/${this.userID}`
        );
        sse.addEventListener('message', (ev) => {
          sse.close();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-background',
            userID: this.userID,
          });
        });
        break;
      }
      case BackgroundState.TURN_CHOICE: {
        const sse = new EventSource(
          `${url}/battle/wait-choice-lower/${this.userID}`
        );
        sse.addEventListener('message', (ev) => {
          sse.close();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-background',
            userID: this.userID,
          });
        });
        break;
      }
      case BackgroundState.TURN_BATTLE: {
        // const sse = new EventSource(
        //   `${url}/battle/wait-choice-lower/${this.userID}`
        // );
        // sse.addEventListener('message', (ev) => {
        //   sse.close();
        //   this.scene.add('battle-menu', BattleMenu, true, {
        //     sceneToRemove: 'battle-background',
        //     userID: this.userID,
        //   });
        // });
        const sse = new EventSource(
          `${url}/battle/pokemon-fainted/${this.userID}`
        );
        sse.addEventListener('message', (ev) => {
          sse.close();
          const pokemonFainted = ev.data;
          if (pokemonFainted === 'OK') {
            this.scene.add('battle-menu', BattleMenu, true, {
              sceneToRemove: 'battle-background',
              userID: this.userID,
            });
          } else if (pokemonFainted === 'FAINTED') {
            this.scene.add('battle-party-menu', BattlePartyMenu, true, {
              sceneToRemove: 'battle-background',
              bPressedCount: -1,
              state: BattlePartyState.SWITCH_FAINTED,
              userID: this.userID,
            });
          }
        });
        break;
      }
    }
  }
}
