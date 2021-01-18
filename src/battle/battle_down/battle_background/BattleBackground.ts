import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';
import BattleBag from '../battle_bag/BattleBag';
import BattleMemberSwitch from '../battle_member_switch/BattleMemberSwitch';
import BattleMenu from '../battle_menu/BattleMenu';
import BattlePartyMenu, {
  BattlePartyState,
} from '../battle_party_menu/BattlePartyMenu';
import BattleBackgroundGraphicsManager from './BattleBackgroundGraphicsManager';
import axios from 'axios';

const sendEmergencyReset = (id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.post(`${url}/battle/emergency-reset/${id}`).then((response) => {
      console.log('Successfully sent');
      console.log(response.data);
      resolve('success');
    });
  });
};

export enum BackgroundState {
  INTRO,
  TURN_CHOICE,
  TURN_BATTLE,
}

export default class BattleBackground extends Phaser.Scene {
  private userID!: number;
  private state!: BackgroundState;
  private waitZ: boolean = false;
  private nextSceneType: string = 'MENU';
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
        let timeout = setTimeout(() => {
          this.waitZ = true;
          sse.close();
          sceneEvents.emit('emergency-reset');
        }, 45000);
        sse.addEventListener('message', (ev) => {
          sse.close();
          this.switchOff();
          clearTimeout(timeout);
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
        let timeout = setTimeout(() => {
          this.waitZ = true;
          sse.close();
          sceneEvents.emit('emergency-reset');
        }, 30000);
        sse.addEventListener('message', (ev) => {
          sse.close();
          clearTimeout(timeout);
          const state = ev.data;
          if (state === 'WARN-FAINTED') {
            const sse2 = new EventSource(
              `${url}/battle/pokemon-fainted/${this.userID}`
            );
            let timeout2 = setTimeout(() => {
              this.waitZ = true;
              sse2.close();
              sceneEvents.emit('emergency-reset');
            }, 10000);
            sse2.addEventListener('message', (ev) => {
              sse2.close();
              clearTimeout(timeout2);
              const pokemonFainted = ev.data;
              if (pokemonFainted === 'OK') {
                this.switchOff();
                this.scene.add('battle-menu', BattleMenu, true, {
                  sceneToRemove: 'battle-background',
                  userID: this.userID,
                });
              } else if (pokemonFainted === 'FAINTED') {
                this.switchOff();
                this.scene.add('battle-party-menu', BattlePartyMenu, true, {
                  sceneToRemove: 'battle-background',
                  bPressedCount: -1,
                  state: BattlePartyState.SWITCH_FAINTED,
                  userID: this.userID,
                });
              }
            });
          } else {
            this.switchOff();
            this.scene.add('battle-menu', BattleMenu, true, {
              sceneToRemove: 'battle-background',
              userID: this.userID,
            });
          }
        });
        break;
      }
      case BackgroundState.TURN_BATTLE: {
        const sse = new EventSource(
          `${url}/battle/pokemon-fainted/${this.userID}`
        );
        let timeout = setTimeout(() => {
          this.waitZ = true;
          sse.close();
          sceneEvents.emit('emergency-reset');
        }, 20000);
        sse.addEventListener('message', (ev) => {
          sse.close();
          clearTimeout(timeout);
          const pokemonFainted = ev.data;
          if (pokemonFainted === 'OK') {
            this.switchOff();
            this.scene.add('battle-menu', BattleMenu, true, {
              sceneToRemove: 'battle-background',
              userID: this.userID,
            });
          } else if (pokemonFainted === 'FAINTED') {
            this.switchOff();
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
    this.input.keyboard.on('keydown-B', () => {
      if (this.waitZ) {
        this.switchOff();
        this.scene.add('battle-menu', BattleMenu, true, {
          sceneToRemove: 'battle-background',
          userID: this.userID,
        });
      }
    });
    sceneEvents.on('emergency-reset', this.emergencyReset, this);
  }

  private async emergencyReset() {
    await sendEmergencyReset(this.userID);
    this.add
      .text(
        screen.width * 0.0146412884,
        screen.width * 0.0732064422,
        'The server has encountered a problem\nPress B to keep playing'
      )
      .setOrigin(0.5, 0.5);
  }

  private switchOff() {
    this.input.keyboard.off('keydown-B');
    sceneEvents.off('emergency-reset');
  }
}
