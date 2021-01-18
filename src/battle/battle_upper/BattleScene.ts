import Phaser from 'phaser';
import { relevantMessageTypes, url } from '~/constants/Constants';
import { createPokeBallAnim } from '~/scenes/animations/pokeBallAnims';
import axios from 'axios';
import MessageBoxScene from '~/scenes/MessageBoxScene';
import { sceneEvents } from '~/events/EventCenter';
import BattleSceneGraphics from './BattleSceneGraphics';
import BattleSceneHealthManager from './BattleSceneHealthManager';
import BattleSceneIntroManager from './BattleSceneIntroManager';
import BattleScenePokemonManager from './BattleScenePokemonManager';
import { Pokemon, TeamMember, User } from '~/types/myTypes';
import { getPokemons, getTeamPromise } from '~/promises/pokemonPromises';

enum BattleState {
  BATTLE_INTRO,
  COMPLETE_PLAYER_INTRO,
  ENTERING_PARTY_BALL,
  COMPLETE_PLAYER_PARTY_BALL,
  ENEMY_FADING,
  PLAYER_FADING,
  BATTLE_START,
  PLAYER_ATTACK_FRONT,
  PLAYER_ATTACK_BACK,
  HIT_ENEMY,
  ENEMY_ATTACK_FRONT,
  ENEMY_ATTACK_BACK,
  HIT_PLAYER,
  SWITCH_PLAYER_POKEMON,
  SEND_OUT_PLAYER_POKEMON,
  SEND_OUT_OPPONENT_POKEMON,
  PLAYER_FAINTED,
  ENEMY_FAINTED,
  ENEMY_FAINTED_BATTLE,
  SEND_OUT_OPPONENT_POKEMON_FAINTED,
}

const pokeBalls = ['poke-ball', 'master-ball', 'mega-ball', 'ultra-ball'];

const notifyLowerPromise = (pokemonState: string, id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-lower/${pokemonState}/${id}`)
      .then((response) => {
        console.log('Successfully sent to lower');
        console.log(response.data);
        resolve('success');
      });
  });
};

const sendPlayerPokemonIndex = (pokemonIndex: number, id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/battle/pokemon-index/${pokemonIndex}/${id}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const sendBattleIntroNotification = (id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.post(`${url}/battle/notify-intro-upper/${id}`).then((response) => {
      console.log('Successfully sent to other player');
      console.log(response.data);
      resolve('success');
    });
  });
};

const sendBattleIntroNotificationToLower = (id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.post(`${url}/battle/notify-intro-lower/${id}`).then((response) => {
      console.log('Successfully sent to lower');
      console.log(response.data);
      resolve('success');
    });
  });
};

const sendBattleChoiceNotificationToLower = (id: number, state: string) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/battle/notify-choice-lower/${id}/${state}`)
      .then((response) => {
        console.log('Successfully sent to lower');
        console.log(response.data);
        resolve(response.data);
      });
  });
};

const sendResetIntroData = () => {
  return new Promise((resolve: (value: string) => void) => {
    axios.post(`${url}/battle/reset-intro-data`).then((response) => {
      console.log('Successfully sent');
      console.log(response.data);
      resolve('success');
    });
  });
};

const sendResetChoiceData = () => {
  return new Promise((resolve: (value: string) => void) => {
    axios.post(`${url}/battle/reset-choice-data`).then((response) => {
      console.log('Successfully reset');
      console.log(response.data);
      resolve('success');
    });
  });
};

const getOpponentChoicePromise = (opponentID: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.get(`${url}/battle/get-choice/${opponentID}`).then((response) => {
      console.log('Successfully received');
      console.log(response.data);
      resolve(response.data.data);
    });
  });
};

const getSerialNumber = () => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/battle/get-serial-number`).then((response) => {
      console.log('Successfully received');
      console.log(response.data);
      resolve(parseInt(response.data.serial));
    });
  });
};

const sendPokemonFainted = (id: number, fainted: string) => {
  return new Promise((resolve: (value: number) => void) => {
    axios
      .post(`${url}/battle/pokemon-fainted/${fainted}/${id}`)
      .then((response) => {
        console.log('Successfully received');
        console.log(response.data);
        resolve(parseInt(response.data.serial));
      });
  });
};

const sendPokemonHealthPromise = (
  id: number,
  index: number,
  health: number
) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/health/post-one/${id}/${index}/${health}`)
      .then((response) => {
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

const getOpponentPokemonIndex = (id: number) => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/battle/pokemon-index/${id}`).then((response) => {
      console.log(response.data);
      resolve(parseInt(response.data.data));
    });
  });
};

const hpRectMaxWidth = 69;

export default class BattleScene extends Phaser.Scene {
  private state!: BattleState;
  private displayText: boolean = false;
  private battleMessage!: MessageBoxScene;
  //Z Pression
  private zPressed: boolean = false;
  private waitZ: boolean = false;
  private timeoutCount: number = 0;
  private timeout!: number;
  private battleGraphics!: BattleSceneGraphics;
  private introManager!: BattleSceneIntroManager;
  private healthManager!: BattleSceneHealthManager;
  private pokemonManager!: BattleScenePokemonManager;
  private playerTeamMembers: TeamMember[] = [];
  private opponentTeamMembers: TeamMember[] = [];
  private playerPokemons: Pokemon[] = [];
  private opponentPokemons: Pokemon[] = [];
  private user!: User;
  private opponent!: User;
  private readData: boolean = false;
  private playerPokemonIndex: number = 0;
  private opponentPokemonIndex: number = 0;
  private sentIntroNotification: boolean = false;
  private turn!: number;
  private playerData!: string;
  private opponentData!: string;
  private faintedTimeout!: number;
  constructor() {
    super('battle-scene');
  }

  preload() {}

  async create(data: { sceneToRemove: string; user: User; opponent: User }) {
    this.scene.remove(data.sceneToRemove);
    this.user = data.user;
    this.opponent = data.opponent;
    this.state = BattleState.BATTLE_INTRO;
    this.playerTeamMembers = await getTeamPromise(this.user.userID);
    this.opponentTeamMembers = await getTeamPromise(this.opponent.userID);
    this.playerPokemons = await getPokemons(this.playerTeamMembers);
    this.opponentPokemons = await getPokemons(this.opponentTeamMembers);
    //TODO: initialize healths
    for (let i = 0; i < this.playerPokemons.length; i++) {
      await sendPokemonHealthPromise(
        this.user.userID,
        i,
        this.playerPokemons[i].ps
      );
    }
    console.log('Battle Scene Pokemons: ', this.playerPokemons);
    this.readData = true;
    this.introManager = new BattleSceneIntroManager(this);
    this.healthManager = new BattleSceneHealthManager(this);
    this.pokemonManager = new BattleScenePokemonManager(this);
    this.pokemonManager.createAnims();
    this.introManager.initializePlayerPosition();
    this.introManager.initializeOpponentPosition();
    this.createAnims();
    const bgNumber = Math.floor(Math.random() * 6);
    //Message Dialogue
    this.battleMessage = new MessageBoxScene(this);
    this.battleMessage.createBattleMessage();

    this.battleGraphics = new BattleSceneGraphics(this);
    this.introManager.createIntroGraphics(
      this.battleGraphics,
      bgNumber,
      this.user.userCharacter,
      this.opponent.userCharacter
    );
    this.pokemonManager.createPokemonGraphics(
      this.battleGraphics,
      this.playerPokemons[this.playerPokemonIndex],
      this.opponentPokemons[this.opponentPokemonIndex]
    );
    this.healthManager.createHealthGraphics(
      this.battleGraphics,
      this.playerPokemons[this.playerPokemonIndex],
      this.opponentPokemons[this.opponentPokemonIndex]
    );
    //Input Keyboard
    this.createInputKeyboard();
    // Text Events
    this.createTextEvents();
    sceneEvents.on('notify-lower-screen', this.notifyLowerScreen, this);
    sceneEvents.on(
      'opponent-faded',
      () => {
        this.introManager.playOpponentPokeBall();
      },
      this
    );
    sceneEvents.on(
      'player-faded',
      () => {
        this.introManager.playPlayerPokeBall();
      },
      this
    );
    sceneEvents.on(
      'from-opponent-poke-ball-to-pokemon',
      () => {
        this.introManager.invisibleOpponentPokeBall();
        this.introManager.invisibleOpponentPartyBar();
        this.introManager.invisibleOpponentPartyBalls();
        this.healthManager.opponentLifeBarVisible();
        this.healthManager.opponentHpRectVisible();
        this.healthManager.setOpponentHealth(
          this.opponentPokemons[this.opponentPokemonIndex],
          this.battleGraphics,
          this.opponent.userID,
          this.opponentPokemonIndex
        );
        this.pokemonManager.opponentPokemonLevelVisible();
        this.pokemonManager.opponentPokemonNameVisible();
        this.pokemonManager.opponentPokemonVisible();
        this.pokemonManager.opponentPokemonResetAlpha();
        this.pokemonManager.initializeOpponentPosition();
        this.pokemonManager.playOpponentPokemon();
        if (this.state !== BattleState.BATTLE_START) {
          if (this.state === BattleState.SEND_OUT_OPPONENT_POKEMON) {
            if (this.turn === 2) {
              sceneEvents.emit(
                'manage-action',
                this.playerData,
                this.opponentData
              );
            } else {
              this.state = BattleState.BATTLE_START;
              this.waitZ = true;
            }
          } else if (
            this.state === BattleState.SEND_OUT_OPPONENT_POKEMON_FAINTED
          ) {
            this.state = BattleState.BATTLE_START;
            this.waitZ = true;
          } else {
            sceneEvents.emit('new-text');
            sceneEvents.emit(
              'show-battle-text',
              `Go ${this.playerPokemons[this.playerPokemonIndex].name}!`
            );
            this.state = BattleState.PLAYER_FADING;
          }
        } else {
          this.waitZ = true;
        }
      },
      this
    );
    sceneEvents.on(
      'from-player-poke-ball-to-pokemon',
      () => {
        this.introManager.invisiblePlayerPokeBall();
        this.introManager.invisiblePlayerPartyBar();
        this.introManager.invisiblePlayerPartyBalls();
        this.healthManager.setPlayerHealth(
          this.playerPokemons[this.playerPokemonIndex],
          this.battleGraphics,
          this.user.userID,
          this.playerPokemonIndex
        );
        this.healthManager.playerLifeBarVisible();
        this.healthManager.playerHpRectVisible();
        this.healthManager.playerHpTextVisible();
        this.pokemonManager.playerPokemonLevelVisible();
        this.pokemonManager.playerPokemonNameVisible();
        this.pokemonManager.playerPokemonVisible();
        this.pokemonManager.playerPokemonResetAlpha();
        this.pokemonManager.playPlayerPokemon();
        if (this.state === BattleState.SEND_OUT_PLAYER_POKEMON) {
          if (this.turn === 1) {
            sceneEvents.emit(
              'manage-opponent-action',
              this.opponentData,
              this.playerData
            );
          } else {
            this.waitZ = true;
            this.state = BattleState.BATTLE_START;
          }
        } else {
          sceneEvents.emit('new-text');
          sceneEvents.emit(
            'show-battle-text',
            `What ${
              this.playerPokemons[this.playerPokemonIndex].name
            } should do?`
          );
          this.waitZ = true;
          this.state = BattleState.BATTLE_START;
        }
      },
      this
    );
    //Action event
    sceneEvents.on('manage-action', this.manageAction, this);
    sceneEvents.on('manage-opponent-action', this.manageOpponentAction, this);
    sceneEvents.on('notify-pokemon-fainted', this.notifyPokemonFainted, this);
    //Battle Events
    sceneEvents.on(
      'hit-enemy',
      () => {
        this.timeout = setInterval(() => {
          this.timeoutCount++;
          this.pokemonManager.hitOpponentPokemon();
          if (this.timeoutCount >= 6) {
            this.timeoutCount = 0;
            setTimeout(() => {
              sceneEvents.emit('decrease-enemy-health');
            }, 1000);
            clearInterval(this.timeout);
          }
        }, 150);
      },
      this
    );

    sceneEvents.on(
      'decrease-enemy-health',
      () => {
        this.timeout = setInterval(() => {
          this.healthManager.decreaseOpponentPokemonHealth();
          this.timeoutCount++;
          if (this.timeoutCount >= 50) {
            this.timeoutCount = 0;
            setTimeout(() => {
              if (this.healthManager.getOpponentPokemonCurrentHealth() <= 0) {
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `The enemy ${
                    this.opponentPokemons[this.opponentPokemonIndex].name
                  } is fainted`
                );
                // sceneEvents.emit('notify-lower-screen', 'OK');
                this.state = BattleState.ENEMY_FAINTED_BATTLE;
              } else {
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `The enemy ${
                    this.opponentPokemons[this.opponentPokemonIndex].name
                  } uses ${'Solar Beam'}`
                );
                if (this.turn === 1) {
                  sceneEvents.emit(
                    'manage-opponent-action',
                    this.opponentData,
                    this.playerData
                  );
                } else {
                  sceneEvents.emit('new-text');
                  sceneEvents.emit(
                    'show-battle-text',
                    `What should ${
                      this.playerPokemons[this.playerPokemonIndex].name
                    } do?`
                  );
                  this.waitZ = true;
                  // sceneEvents.emit('notify-pokemon-fainted', 'OK');
                  this.state = BattleState.BATTLE_START;
                }
              }
            }, 2000);
            clearInterval(this.timeout);
          }
        }, 50);
      },
      this
    );

    sceneEvents.on(
      'hit-player',
      () => {
        this.timeout = setInterval(() => {
          this.timeoutCount++;
          this.pokemonManager.hitPlayerPokemon();
          if (this.timeoutCount >= 6) {
            this.timeoutCount = 0;
            setTimeout(() => {
              sceneEvents.emit('decrease-player-health');
            }, 1000);
            clearInterval(this.timeout);
          }
        }, 150);
      },
      this
    );

    sceneEvents.on('update-pokemon-healths', this.updatePokemonHealths, this);

    sceneEvents.on(
      'decrease-player-health',
      () => {
        this.timeout = setInterval(() => {
          this.healthManager.decreasePlayerPokemonHealth();
          this.timeoutCount++;
          if (this.timeoutCount >= 50) {
            //TODO: Set pokemon health with current - 50
            this.healthManager.sendNewPlayerPokemonHealth(
              this.user.userID,
              this.playerPokemonIndex
            );
            sceneEvents.emit('update-pokemon-healths');
            this.timeoutCount = 0;
            clearInterval(this.timeout);
            setTimeout(() => {
              let pokemonState = '';
              let shouldSendFainted = true;
              if (this.healthManager.getPlayerPokemonCurrentHealth() <= 0) {
                pokemonState = 'FAINTED';
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `${
                    this.playerPokemons[this.playerPokemonIndex].name
                  } is fainted`
                );
                this.faintedTimeout = setTimeout(() => {
                  for (let i = 0; i < this.playerPokemons.length; i++) {
                    if (this.playerPokemons[i].ps > 0) {
                      this.playerPokemonIndex = i;
                      sceneEvents.emit('send-out-player-pokemon');
                      break;
                    }
                  }
                }, 12000);
                this.state = BattleState.PLAYER_FAINTED;
                // this.createSSE();
              } else {
                pokemonState = 'OK';
                if (this.turn === 2) {
                  sceneEvents.emit(
                    'manage-action',
                    this.playerData,
                    this.opponentData
                  );
                } else {
                  sceneEvents.emit('new-text');
                  sceneEvents.emit(
                    'show-battle-text',
                    `What should ${
                      this.playerPokemons[this.playerPokemonIndex].name
                    } do?`
                  );
                  this.state = BattleState.BATTLE_START;
                  this.waitZ = true;
                }
              }
              sceneEvents.emit('notify-pokemon-fainted', pokemonState);
            }, 2000);
          }
        }, 30);
      },
      this
    );

    //Send out pokemon Event
    sceneEvents.on(
      'send-out-player-pokemon',
      () => {
        this.healthManager.playerLifeBarInvisible();
        this.healthManager.playerHpRectInvisible();
        this.healthManager.playerHpTextInvisible();
        this.pokemonManager.playerPokemonLevelInvisible();
        this.pokemonManager.playerPokemonNameInvisible();
        this.pokemonManager.createPlayerPokemon(
          this.battleGraphics,
          this.playerPokemons[this.playerPokemonIndex]
        );
        sceneEvents.emit('send-player-index');
        this.pokemonManager.playerPokemonInvisilbe();
        this.introManager.playPlayerPokeBall();
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `Go ${this.playerPokemons[this.playerPokemonIndex].name}!`
        );
      },
      this
    );
    sceneEvents.on('send-player-index', this.sendOutPlayerPokemon, this);
    sceneEvents.on(
      'send-out-enemy-pokemon',
      () => {
        this.healthManager.opponentLifeBarInvisible();
        this.healthManager.opponentHpRectInvisible();
        this.pokemonManager.opponentPokemonLevelInvisible();
        this.pokemonManager.opponentPokemonNameInvisible();
        this.pokemonManager.initializeOpponentPosition();
        this.pokemonManager.createOpponentPokemon(
          this.battleGraphics,
          this.opponentPokemons[this.opponentPokemonIndex]
        );
        this.pokemonManager.opponentPokemonInvisible();
        this.introManager.playOpponentPokeBall();
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `${this.opponent.userName} Pokémon Trainer send out ${
            this.opponentPokemons[this.opponentPokemonIndex].name
          }`
        );
      },
      this
    );

    sceneEvents.on(
      'send-intro-to-lower',
      this.sendIntroNotificationToLower,
      this
    );
    sceneEvents.on(
      'send-choice-to-lower',
      this.sendChoiceNotificationToLower,
      this
    );

    sceneEvents.on('reset-intro-data', this.resetIntroData, this);
    sceneEvents.on('reset-choice-data', this.resetChoiceData, this);

    sceneEvents.on('get-opponent-choice', this.getOpponentChoice, this);

    sceneEvents.on('test-opponent-choice', this.testOpponentChoice, this);

    sceneEvents.on(
      'get-timeout-opponent-index',
      this.getTimeoutOpponentIndex,
      this
    );

    sceneEvents.emit(
      'show-battle-text',
      `You're challenged by ${this.opponent.userName} Pokémon Trainer(press A or Z)`
    );
  }

  private async notifyLowerScreen(pokemonState: string) {
    await notifyLowerPromise(pokemonState, this.user.userID);
  }

  private createSSE() {
    const sse = new EventSource(
      `${url}/delayed/notify-upper/${this.user.userID}`
    );
    sse.addEventListener('message', (ev) => {
      let [messageType, information]: string = ev.data.split(',');
      this.playerData = ev.data;
      console.log(this.playerData);
      sse.close();
      if (this.isRelavant(messageType)) {
        sceneEvents.emit('test-opponent-choice', this.playerData);
      } else {
        sceneEvents.emit('manage-action', this.playerData, '');
      }
    });
  }

  private async testOpponentChoice(playerData: string) {
    const opponentChoiceEmpty = await this.emptyOpponentChoice();
    if (opponentChoiceEmpty) {
      console.log("YES, IT'S EMPTY");
      this.createSSE2(playerData);
    } else {
      sceneEvents.emit('get-opponent-choice', playerData);
    }
  }

  private async emptyOpponentChoice() {
    const data = await getOpponentChoicePromise(this.opponent.userID);
    console.log('IS EMPTY?', data);
    return data === '';
  }

  private createSSE2(playerData: string) {
    const sse2 = new EventSource(`${url}/battle/wait-choice-upper`);
    sse2.addEventListener('message', (ev2) => {
      let data = ev2.data.split(',');
      console.log(ev2.data);
      sse2.close();
      sceneEvents.emit('get-opponent-choice', playerData);
    });
  }

  private createSSEFainted() {
    const sseFainted = new EventSource(
      `${url}/battle/wait-choice-fainted/${this.opponent.userID}`
    );
    let timeout = setTimeout(() => {
      sseFainted.close();
      sceneEvents.emit('get-timeout-opponent-index');
    }, 14000);
    sseFainted.addEventListener('message', (ev2) => {
      clearTimeout(timeout);
      let data = ev2.data.split(',');
      console.log(ev2.data);
      sseFainted.close();
      console.log('Notification arrived successfully');
      this.opponentPokemonIndex = parseInt(data[1]);
      sceneEvents.emit('notify-pokemon-fainted', 'OK');
      sceneEvents.emit('send-out-enemy-pokemon');
    });
  }

  private manageAction(playerData: string, opponentData: string) {
    let playerInfo: string[] = playerData.split(',');
    // let opponentInfo: string[] = opponentData.split(',');
    console.log('Player Info: ', playerInfo);
    switch (playerInfo[0]) {
      case 'INCREASE-HEALTH': {
        if (
          this.healthManager.getPlayerHpRect().width < hpRectMaxWidth &&
          !this.zPressed
        ) {
          sceneEvents.emit('new-text');
          sceneEvents.emit(
            'show-battle-text',
            `${
              this.playerPokemons[this.playerPokemonIndex].name
            } has recovered ${parseInt(playerInfo[3])}ps`
          );
          this.zPressed = true;
          this.timeout = setInterval(() => {
            this.healthManager.increasePlayerPokemonHealth();
            this.timeoutCount++;
            if (this.timeoutCount >= parseInt(playerInfo[3])) {
              this.timeoutCount = 0;
              this.zPressed = false;
              setTimeout(() => {
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `What ${
                    this.playerPokemons[this.playerPokemonIndex].name
                  } should do?`
                );
                this.waitZ = true;
              }, 2000);
              clearInterval(this.timeout);
            }
          }, 50);
        }
        if (this.turn === 1) {
          sceneEvents.emit('manage-opponent-action', opponentData, playerData);
        }
        break;
      }
      case 'CURE': {
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `This functionality is not yet available D:`
        );
        this.zPressed = false;
        setTimeout(() => {
          sceneEvents.emit('new-text');
          sceneEvents.emit(
            'show-battle-text',
            `What ${
              this.playerPokemons[this.playerPokemonIndex].name
            } should do?`
          );
          this.waitZ = true;
        }, 2000);
        break;
      }
      case 'STATS': {
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `This functionality is not yet available D:`
        );
        this.zPressed = false;
        setTimeout(() => {
          sceneEvents.emit('new-text');
          sceneEvents.emit(
            'show-battle-text',
            `What ${
              this.playerPokemons[this.playerPokemonIndex].name
            } should do?`
          );
          this.waitZ = true;
        }, 2000);
        break;
      }
      case 'POKEBALL': {
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `You cannot catch your opponent's Pokémon`
        );
        this.zPressed = false;
        setTimeout(() => {
          sceneEvents.emit('new-text');
          sceneEvents.emit(
            'show-battle-text',
            `What ${
              this.playerPokemons[this.playerPokemonIndex].name
            } should do?`
          );
          this.waitZ = true;
        }, 2000);
        break;
      }
      case 'ATTACK': {
        this.state = BattleState.PLAYER_ATTACK_FRONT;
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `${this.playerPokemons[this.playerPokemonIndex].name} uses ${
            playerInfo[1]
          }`
        );
        // if (this.turn === 1) {
        //   sceneEvents.emit('manage-opponent-action', opponentData, playerData);
        // }
        this.waitZ = false;
        break;
      }
      case 'SWITCH': {
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `${
            this.playerPokemons[this.playerPokemonIndex].name
          } good job! Now come back`
        );
        this.playerPokemonIndex = parseInt(playerInfo[1]);
        // if (this.turn === 1) {
        this.state = BattleState.SWITCH_PLAYER_POKEMON;
        // sceneEvents.emit('manage-opponent-action', opponentData, playerData);
        // }
        this.waitZ = false;
        break;
      }
      case 'SWITCH-FAINTED': {
        clearTimeout(this.faintedTimeout);
        this.playerPokemonIndex = parseInt(playerInfo[1]);
        sceneEvents.emit('send-out-player-pokemon');
        break;
      }
      default: {
        console.log('Nothing special from lower screen');
        this.waitZ = true;
        break;
      }
    }
  }

  private manageOpponentAction(opponentData: string, playerData: string) {
    let [messageType] = opponentData.split(',');
    switch (messageType) {
      case 'SWITCH': {
        let [a, b, pokemonIndexString] = opponentData.split(',');
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `${
            this.opponentPokemons[this.opponentPokemonIndex].name
          } is retreat from battle.`
        );
        this.opponentPokemonIndex = parseInt(pokemonIndexString);
        this.state = BattleState.ENEMY_FAINTED;
        //The opponent has switched pokémon but the user has chosen to attack
        // if (this.playerData.split(',')[0] === 'ATTACK') {
        //   sceneEvents.emit('notify-pokemon-fainted', 'OK');
        // }
        this.waitZ = false;
        break;
      }
      case 'SWITCH-FAINTED': {
        break;
      }
      case 'ATTACK': {
        let [a, b, moveName] = opponentData.split(',');
        this.state = BattleState.ENEMY_ATTACK_FRONT;
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `${
            this.opponentPokemons[this.opponentPokemonIndex].name
          } uses ${moveName}`
        );
        // if (this.turn === 2) {
        //   sceneEvents.emit('manage-action', playerData, opponentData);
        // }
        this.waitZ = false;
        break;
      }
      case 'INCREASE-HEALTH': {
        break;
      }
    }
  }

  update() {
    if (this.readData) {
      switch (this.state) {
        case BattleState.BATTLE_INTRO: {
          this.introManager.setPlayerBaseX();
          this.introManager.setOpponentBaseX();
          this.introManager.setPlayerImageX();
          this.introManager.setOpponentImageX();
          if (this.introManager.introOpponentCompleted()) {
            this.state = BattleState.COMPLETE_PLAYER_INTRO;
          }
          break;
        }
        case BattleState.COMPLETE_PLAYER_INTRO: {
          if (!this.introManager.introPlayerCompleted()) {
            this.introManager.setPlayerBaseX();
            this.introManager.setPlayerImageX();
          } else {
            this.waitZ = true;
          }
          break;
        }
        case BattleState.ENTERING_PARTY_BALL: {
          this.introManager.enterPlayerAndOpponentPartyBalls();
          if (this.introManager.opponentPartyBallsCompleted()) {
            this.state = BattleState.COMPLETE_PLAYER_PARTY_BALL;
          }
          break;
        }
        case BattleState.COMPLETE_PLAYER_PARTY_BALL: {
          this.introManager.enterPlayerPartyBalls();
          if (this.introManager.playerPartyBallsCompleted()) {
            console.log('Completed player party ball');
            this.state = BattleState.ENEMY_FADING;
            sceneEvents.emit(
              'show-battle-text',
              `${this.opponent.userName} Pokémon Trainer send out ${
                this.opponentPokemons[this.opponentPokemonIndex].name
              }`
            );
          }
          break;
        }
        case BattleState.ENEMY_FADING: {
          this.introManager.setOpponentImageX();
          this.introManager.setOpponentImageAlpha();
          if (this.introManager.opponentImageFaded()) {
            sceneEvents.emit('opponent-faded');
          }
          break;
        }
        case BattleState.PLAYER_FADING: {
          this.introManager.setPlayerImageX();
          this.introManager.setPlayerImageAlpha();
          if (this.introManager.playerImageFaded()) {
            sceneEvents.emit('player-faded');
          }
          break;
        }
        case BattleState.PLAYER_ATTACK_FRONT: {
          this.pokemonManager.moveForwardPlayerPokemon();
          if (this.pokemonManager.checkPlayerPokemonFrontX()) {
            this.state = BattleState.PLAYER_ATTACK_BACK;
          }
          break;
        }
        case BattleState.PLAYER_ATTACK_BACK: {
          this.pokemonManager.moveBackwardPlayerPokemon();
          if (this.pokemonManager.checkPlayerPokemonBackX()) {
            this.state = BattleState.HIT_ENEMY;
            sceneEvents.emit('hit-enemy');
          }
          break;
        }
        case BattleState.HIT_ENEMY: {
          this.pokemonManager.stopPlayerPokemon();
          break;
        }
        case BattleState.ENEMY_ATTACK_FRONT: {
          this.pokemonManager.moveForwardOpponentPokemon();
          if (this.pokemonManager.checkOpponentPokemonFrontX()) {
            this.state = BattleState.ENEMY_ATTACK_BACK;
          }
          break;
        }
        case BattleState.ENEMY_ATTACK_BACK: {
          this.pokemonManager.moveBackwardOpponentPokemon();
          if (this.pokemonManager.checkOpponentPokemonBackX()) {
            this.state = BattleState.HIT_PLAYER;
            sceneEvents.emit('hit-player');
          }
          break;
        }
        case BattleState.HIT_PLAYER: {
          this.pokemonManager.stopOpponentPokemon();
          break;
        }
        case BattleState.SWITCH_PLAYER_POKEMON: {
          this.pokemonManager.moveBackwardPlayerPokemon();
          this.pokemonManager.fadePlayerPokemon();
          if (this.pokemonManager.playerPokemonFaded()) {
            this.state = BattleState.SEND_OUT_PLAYER_POKEMON;
            sceneEvents.emit('send-out-player-pokemon');
          }
          break;
        }
        case BattleState.SEND_OUT_PLAYER_POKEMON: {
          this.pokemonManager.initializePlayerPosition();
          break;
        }
        case BattleState.PLAYER_FAINTED: {
          this.pokemonManager.moveBackwardPlayerPokemon();
          this.pokemonManager.fadePlayerPokemon();
          if (this.pokemonManager.playerPokemonFaded()) {
            this.pokemonManager.initializePlayerPosition();
            this.waitZ = true;
            this.state = BattleState.BATTLE_START;
          }
          break;
        }
        case BattleState.ENEMY_FAINTED: {
          this.pokemonManager.moveBackwardOpponentPokemon();
          this.pokemonManager.fadeOpponentPokemon();
          if (this.pokemonManager.opponentPokemonFaded()) {
            this.state = BattleState.SEND_OUT_OPPONENT_POKEMON;
            sceneEvents.emit('send-out-enemy-pokemon');
          }
          break;
        }
        case BattleState.ENEMY_FAINTED_BATTLE: {
          this.pokemonManager.moveBackwardOpponentPokemon();
          this.pokemonManager.fadeOpponentPokemon();
          if (this.pokemonManager.opponentPokemonFaded()) {
            this.state = BattleState.SEND_OUT_OPPONENT_POKEMON_FAINTED;
            console.log('The enemy is fainted, waiting for his choice');
            this.createSSEFainted();
          }
          break;
        }
        case BattleState.SEND_OUT_OPPONENT_POKEMON: {
          this.pokemonManager.initializeOpponentPosition();
          break;
        }
        case BattleState.SEND_OUT_OPPONENT_POKEMON_FAINTED: {
          this.pokemonManager.initializeOpponentPosition();
          break;
        }
      }
      if (this.displayText) {
        this.battleMessage.displayText();
      }
    }
  }

  private createAnims() {
    for (let i = 0; i < pokeBalls.length; i++) {
      createPokeBallAnim(this.anims, pokeBalls[i]);
    }
  }

  private async managePressZPlayerIntro() {
    sceneEvents.emit('new-text');
    if (!this.sentIntroNotification) {
      this.sentIntroNotification = true;
      await sendBattleIntroNotification(this.user.userID);
      const sse = new EventSource(`${url}/battle/wait-intro-upper`);
      sse.addEventListener('message', (ev) => {
        console.log('Upper: ', ev.data);
        sse.close();
        const serialNumber = parseInt(ev.data);
        if (serialNumber == 1) {
          sceneEvents.emit('reset-intro-data');
        }
        sceneEvents.emit('send-intro-to-lower');
        this.state = BattleState.ENTERING_PARTY_BALL;
        this.introManager.visibleOpponentPartyBar();
        this.introManager.visiblePlayerPartyBar();
        this.introManager.visiblePlayerPartyBalls();
        this.introManager.visibleOpponentPartyBalls();
        this.waitZ = false;
      });
    }
  }

  private async sendIntroNotificationToLower() {
    await sendBattleIntroNotificationToLower(this.user.userID);
  }

  private async sendChoiceNotificationToLower(state: string) {
    await sendBattleChoiceNotificationToLower(this.user.userID, state);
  }

  private async resetIntroData() {
    await sendResetIntroData();
  }

  private async resetChoiceData(
    opponentData: string,
    playerData: string,
    velocity: number
  ) {
    await sendResetChoiceData();
    this.decideTurn(opponentData, playerData, velocity);
  }

  private async getOpponentChoice(playerData: string) {
    this.opponentData = await getOpponentChoicePromise(this.opponent.userID);
    let [opponentMessageType, velocityString] = this.opponentData.split(',');
    let velocity = parseInt(velocityString);
    const serialNumber = await getSerialNumber();
    console.log('From opponent: ', this.opponentData);
    console.log('Player data: ', playerData);
    if (serialNumber === 1) {
      console.log('RESET CHOICE');
      sceneEvents.emit(
        'reset-choice-data',
        this.opponentData,
        playerData,
        velocity
      );
    } else {
      this.decideTurn(this.opponentData, playerData, velocity);
    }
  }

  private decideTurn(
    opponentData: string,
    playerData: string,
    velocity: number
  ) {
    //Both have choose switch or item
    let [messageType] = playerData.split(',');
    if (velocity === 999 && messageType !== 'ATTACK') {
      if (this.user.userID === 0) {
        console.log('switch user 0');
        this.turn = 1; //Then will be the turn of user 1
        sceneEvents.emit('send-choice-to-lower', 'OK'); //no worry about being fainted
        sceneEvents.emit('manage-action', playerData, opponentData);
      } else {
        this.turn = 2;
        sceneEvents.emit('send-choice-to-lower', 'OK'); //no worry about being fainted
        sceneEvents.emit('manage-opponent-action', opponentData, playerData);
      }
      //The opponent has chosen a switch or to use an item
    } else if (velocity === 999 && messageType === 'ATTACK') {
      this.turn = 2;
      sceneEvents.emit('notify-pokemon-fainted', 'OK'); //no worry about being fainted
      sceneEvents.emit('manage-opponent-action', opponentData, playerData);
      //I've chosen to switch or use an item therefore I'm the first
    } else if (velocity !== 999 && messageType !== 'ATTACK') {
      this.turn = 1;
      //I'm not attacking but the opponent is attacking so I may be fainted
      sceneEvents.emit('send-choice-to-lower', 'WARN-FAINTED');
      sceneEvents.emit('manage-action', playerData, opponentData);
      //Both have chosen to attack
    } else if (velocity !== 999 && messageType === 'ATTACK') {
      const playerPokemonSpeed = this.playerPokemons[this.playerPokemonIndex]
        .speed;
      const opponentPokemonSpeed = this.opponentPokemons[
        this.opponentPokemonIndex
      ].speed;
      //My pokemon is faster then it's my turn
      if (playerPokemonSpeed > opponentPokemonSpeed) {
        this.turn = 1;
        sceneEvents.emit('manage-action', playerData, opponentData);
        //Same speed
      } else if (playerPokemonSpeed === opponentPokemonSpeed) {
        if (this.user.userID === 0) {
          this.turn = 1; //Then will be the turn of user 0
          sceneEvents.emit('manage-action', playerData, opponentData);
        } else {
          this.turn = 2;
          sceneEvents.emit('manage-opponent-action', opponentData, playerData);
        }
        //Opponent's pokemon is faster
      } else {
        this.turn = 2;
        sceneEvents.emit('manage-opponent-action', opponentData, playerData);
      }
    }
  }

  private async manangePressZBattleStart() {
    this.waitZ = false;
    this.createSSE();
  }

  private createInputKeyboard() {
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.waitZ) {
          switch (this.state) {
            case BattleState.COMPLETE_PLAYER_INTRO: {
              this.managePressZPlayerIntro();
              break;
            }
            case BattleState.BATTLE_START: {
              this.manangePressZBattleStart();
              break;
            }
          }
        }
      },
      this
    );
  }

  private createTextEvents() {
    sceneEvents.on('display-text', () => {
      this.displayText = true;
    });
    sceneEvents.on('end-text', () => {
      this.displayText = false;
    });
  }

  private async sendOutPlayerPokemon() {
    await sendPlayerPokemonIndex(this.playerPokemonIndex, this.user.userID);
  }

  private isRelavant(messageType: string): boolean {
    for (let i = 0; i < relevantMessageTypes.length; i++) {
      if (messageType === relevantMessageTypes[i]) {
        return true;
      }
    }
    return false;
  }

  private async notifyPokemonFainted(pokemonState: string) {
    await sendPokemonFainted(this.user.userID, pokemonState);
  }

  private async updatePokemonHealths() {
    for (let i = 0; i < this.playerPokemons.length; i++) {
      this.playerPokemons[i].ps = await getPokemonHealthPromise(
        this.user.userID,
        i
      );
      this.opponentPokemons[i].ps = await getPokemonHealthPromise(
        this.opponent.userID,
        i
      );
    }
  }

  private async getTimeoutOpponentIndex() {
    this.opponentPokemonIndex = await getOpponentPokemonIndex(
      this.opponent.userID
    );
  }
}
