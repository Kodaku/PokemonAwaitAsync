import Phaser from 'phaser';
import { pokemonFrames, url } from '~/constants/Constants';
import { createPokeBallAnim } from '~/scenes/animations/pokeBallAnims';
import {
  createPokemonBackAnim,
  createPokemonFrontAnim,
} from '~/scenes/animations/pokemonAnims';
import axios from 'axios';
import MessageBoxScene from '~/scenes/MessageBoxScene';
import { sceneEvents } from '~/events/EventCenter';
import BattleSceneGraphics from './BattleSceneGraphics';
import BattleSceneHealthManager from './BattleSceneHealthManager';

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
  DECREASE_ENEMY_HEALTH,
  ENEMY_ATTACK_FRONT,
  ENEMY_ATTACK_BACK,
  HIT_PLAYER,
  DECREASE_PLAYER_HEALTH,
  SWITCH_PLAYER_POKEMON,
  SEND_OUT_PLAYER_POKEMON,
  PLAYER_FAINTED,
  ENEMY_FAINTED,
}

const pokeBalls = ['poke-ball', 'm&aster-ball', 'mega-ball', 'ultra-ball'];

const notifyLowerPromise = (pokemonState: string) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-lower/${pokemonState}`)
      .then((response) => {
        console.log('Successfully sent to lower');
        console.log(response.data);
        resolve('success');
      });
  });
};

const hpRectMaxWidth = 69;

export default class BattleScene extends Phaser.Scene {
  private state!: BattleState;
  private displayText: boolean = false;
  private frameQuantitiesBack: number[] = [];
  private frameQuantitiesFront: number[] = [];
  private battleMessage!: MessageBoxScene;
  //Intro
  private playerStartX!: number;
  private playerBaseStartX!: number;
  private opponentStartX!: number;
  private opponentBaseStartX!: number;
  private playerEndX!: number;
  private playerBaseEndX!: number;
  private opponentEndX!: number;
  private opponentBaseEndX!: number;
  private playerImage!: Phaser.GameObjects.Image;
  private opponentImage!: Phaser.GameObjects.Image;
  private playerBase!: Phaser.GameObjects.Image;
  private opponentBase!: Phaser.GameObjects.Image;
  private playerPartyBar!: Phaser.GameObjects.Image;
  private opponentPartyBar!: Phaser.GameObjects.Image;
  private playerPartyBallStartX: number[] = [];
  private playerPartyBallEndX!: number;
  private opponentPartyBallStartX: number[] = [];
  private opponentPartyBallEndX!: number;
  private playerPartyBalls: Phaser.GameObjects.Image[] = [];
  private opponentPartyBalls: Phaser.GameObjects.Image[] = [];
  //Heath
  private hpRect!: Phaser.GameObjects.Rectangle;
  private healthText!: Phaser.GameObjects.Text;
  private opponentHpRect!: Phaser.GameObjects.Rectangle;
  //Z Pression
  private zPressed: boolean = false;
  private waitZ: boolean = false;
  private timeoutCount: number = 0;
  private timeout!: number;
  //Attack
  private playerPokemon!: Phaser.GameObjects.Sprite;
  private opponentPokemon!: Phaser.GameObjects.Sprite;
  private playerPokemonStartX!: number;
  private playerPokemonCurrentX!: number;
  private playerPokemonEndX!: number;
  private opponentPokemonStartX!: number;
  private opponentPokemonCurrentX!: number;
  private opponentPokemonEndX!: number;
  constructor() {
    super('battle-scene');
  }

  preload() {}

  create(data: { sceneToRemove: string }) {
    this.scene.remove(data.sceneToRemove);
    this.state = BattleState.BATTLE_INTRO;
    //TODO: Create two intro manager: 1 for player and 1 for opponent
    this.initializePlayerPositions();
    this.initializeOpponentPositions();
    this.createAnims();
    const bgNumber = Math.floor(Math.random() * 6);
    let playerPokemonIndex = Math.floor(Math.random() * pokemonFrames.length);
    let enemyPokemonIndex = Math.floor(Math.random() * pokemonFrames.length);

    //Message Dialogue
    this.battleMessage = new MessageBoxScene(this);
    this.battleMessage.create();

    const battleGraphics: BattleSceneGraphics = new BattleSceneGraphics(this);

    const bg = battleGraphics.createBackground(bgNumber);
    // add player-base
    this.playerBase = battleGraphics.createPlayerBase(
      bgNumber,
      this.playerBaseStartX
    );
    // add enemy-base
    this.opponentBase = battleGraphics.createOpponentBase(
      bgNumber,
      this.opponentBaseStartX
    );
    //add player image
    this.playerImage = battleGraphics.createPlayerImage(this.playerStartX);
    // add enemy image
    this.opponentImage = battleGraphics.createOpponentImage(
      this.opponentStartX
    );
    // barra sfere giocatore
    this.playerPartyBar = battleGraphics.createPlayerPartyBar();
    //barra sfere avversario
    this.opponentPartyBar = battleGraphics.createOpponentPartyBar();
    // sfere giocatore
    const obj = battleGraphics.createPlayerPartyBalls(this.playerStartX);
    this.playerPartyBallStartX = obj.playerPartyBallsStartX;
    this.playerPartyBalls = obj.playerPartyBalls;
    // sfere avversario
    const obj2 = battleGraphics.createOpponentPartyBalls(this.opponentStartX);
    this.opponentPartyBallStartX = obj2.opponentPartyBallStartX;
    this.opponentPartyBalls = obj2.opponentPartyBalls;
    // poke ball giocatore
    const playerPokeBall = battleGraphics.createPlayerPokeBall();
    // poke ball avversario
    const enemyPokeBall = battleGraphics.createOpponentPokeBall();
    // Player's Pokémon
    this.playerPokemon = battleGraphics.createPlayerPokemon(
      playerPokemonIndex,
      this.playerPokemonStartX,
      this.frameQuantitiesBack
    );
    // Enemy's Pokémon
    this.opponentPokemon = battleGraphics.createOpponentPokemon(
      enemyPokemonIndex,
      this.opponentPokemonStartX,
      this.frameQuantitiesFront
    );
    // Player life bar
    const playerLifeBar = battleGraphics.createPlayerLifeBar();
    // Enemy life bar
    const enemyLifeBar = battleGraphics.createOpponentLifeBar();
    // Player pokemon name
    const playerPokemonName = battleGraphics.createPlayerPokemonName();
    // Enemy pokemon name
    const enemyPokemonName = battleGraphics.createOpponentPokemonName();
    // Player level
    const playerPokemonLevel = battleGraphics.createPlayerPokemonLevel();
    // Enemy level
    const enemyPokemonLevel = battleGraphics.createOpponentPokemonLevel();
    // Player health
    this.healthText = battleGraphics.createPlayerHealthText(555);
    // Player life
    this.hpRect = battleGraphics.createPlayerHpRect(555, 555, hpRectMaxWidth);
    // Enemy life
    this.opponentHpRect = battleGraphics.createOpponentHpRect(hpRectMaxWidth);
    //TODO: Health Managers
    const playerHealthManager = new BattleSceneHealthManager(this);
    playerHealthManager.setHPRect(this.hpRect);
    playerHealthManager.setHealthText(this.healthText);
    const opponentHealthManager = new BattleSceneHealthManager(this);
    opponentHealthManager.setHPRect(this.opponentHpRect);
    //Input Keyboard
    this.createInputKeyboard(playerHealthManager);
    // Text Events
    this.createTextEvents();
    //TODO: Network Events
    sceneEvents.on('notify-lower-screen', this.notifyLowerScreen, this);
    //TODO: Faded Events
    sceneEvents.on(
      'opponent-faded',
      () => {
        enemyPokeBall.visible = true;
        enemyPokeBall.anims.play('ultra-ball-anim-0', true);
      },
      this
    );
    sceneEvents.on(
      'player-faded',
      () => {
        playerPokeBall.visible = true;
        playerPokeBall.anims.play('ultra-ball-anim-0', true);
      },
      this
    );
    //TODO: Pokemon entering events
    sceneEvents.on(
      'from-opponent-poke-ball-to-pokemon',
      () => {
        enemyPokeBall.visible = false;
        this.opponentPartyBar.visible = false;
        this.opponentPartyBalls.forEach((ball) => {
          ball.visible = false;
        });
        enemyLifeBar.visible = true;
        this.opponentHpRect.visible = true;
        enemyPokemonLevel.visible = true;
        enemyPokemonName.visible = true;
        this.opponentPokemon.visible = true;
        this.opponentPokemon.anims.play(
          `${pokemonFrames[enemyPokemonIndex].pokedexNumber}-front-anim-0`,
          true
        );
        if (this.state !== BattleState.BATTLE_START) {
          sceneEvents.emit('new-text');
          sceneEvents.emit('show-battle-text', `Go ${'Template Name'}!`);
          this.state = BattleState.PLAYER_FADING;
        } else {
          this.waitZ = true;
        }
      },
      this
    );
    sceneEvents.on(
      'from-player-poke-ball-to-pokemon',
      () => {
        playerPokeBall.visible = false;
        this.playerPartyBar.visible = false;
        this.playerPartyBalls.forEach((ball) => {
          ball.visible = false;
        });
        playerLifeBar.visible = true;
        this.hpRect.visible = true;
        playerPokemonLevel.visible = true;
        playerPokemonName.visible = true;
        this.healthText.visible = true;
        this.playerPokemon.visible = true;
        this.playerPokemon.alpha = 1;
        this.playerPokemon.anims.play(
          `${pokemonFrames[playerPokemonIndex].pokedexNumber}-back-anim-0`,
          true
        );
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `What ${'Template Name'} should do?`
        );
        this.waitZ = true;
        this.state = BattleState.BATTLE_START;
      },
      this
    );
    //TODO: Action event
    sceneEvents.on('manage-action', this.manageAction, this);
    //TODO: Battle Events
    sceneEvents.on(
      'hit-enemy',
      () => {
        this.timeout = setInterval(() => {
          this.timeoutCount++;
          this.opponentPokemon.visible = !this.opponentPokemon.visible;
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
          opponentHealthManager.decreaseHealth();
          this.timeoutCount++;
          if (this.timeoutCount >= 600) {
            this.timeoutCount = 0;
            setTimeout(() => {
              if (opponentHealthManager.getPokemonCurrentHealth() <= 0) {
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `The enemy ${'Template Name'} is fainted`
                );
                sceneEvents.emit('notify-lower-screen', 'OK');
                this.state = BattleState.ENEMY_FAINTED;
              } else {
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `The enemy ${'Template Namte'} uses ${'Solar Beam'}`
                );
                this.state = BattleState.ENEMY_ATTACK_FRONT;
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
          this.playerPokemon.visible = !this.playerPokemon.visible;
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

    sceneEvents.on(
      'decrease-player-health',
      () => {
        this.timeout = setInterval(() => {
          playerHealthManager.decreaseHealth();
          this.timeoutCount++;
          if (this.timeoutCount >= 600) {
            this.timeoutCount = 0;
            setTimeout(() => {
              let pokemonState = '';
              if (playerHealthManager.getPokemonCurrentHealth() <= 0) {
                pokemonState = 'FAINTED';
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `${'Template Name'} is fainted`
                );
                this.state = BattleState.PLAYER_FAINTED;
              } else {
                pokemonState = 'OK';
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `What should ${'Template Name'} do?`
                );
                this.state = BattleState.BATTLE_START;
                this.waitZ = true;
              }
              sceneEvents.emit('notify-lower-screen', pokemonState);
            }, 2000);
            clearInterval(this.timeout);
          }
        }, 30);
      },
      this
    );

    //TODO: Send out pokemon Event
    sceneEvents.on(
      'send-out-player-pokemon',
      () => {
        playerLifeBar.visible = false;
        this.hpRect.visible = false;
        playerPokemonLevel.visible = false;
        playerPokemonName.visible = false;
        this.healthText.visible = false;
        playerPokemonIndex = Math.floor(Math.random() * pokemonFrames.length);
        this.playerPokemon = battleGraphics.createPlayerPokemon(
          playerPokemonIndex,
          this.playerPokemonStartX,
          this.frameQuantitiesBack
        );
        this.playerPokemon.visible = false;
        playerPokeBall.visible = true;
        sceneEvents.emit('new-text');
        sceneEvents.emit('show-battle-text', `Go ${'Template Name'}!`);
        playerPokeBall.anims.play('ultra-ball-anim-0', true);
      },
      this
    );
    sceneEvents.on(
      'send-out-enemy-pokemon',
      () => {
        enemyLifeBar.visible = false;
        this.opponentHpRect.visible = false;
        enemyPokemonLevel.visible = false;
        enemyPokemonName.visible = false;
        enemyPokemonIndex = Math.floor(Math.random() * pokemonFrames.length);
        this.opponentPokemon = battleGraphics.createOpponentPokemon(
          enemyPokemonIndex,
          this.opponentPokemonStartX,
          this.frameQuantitiesFront
        );
        this.opponentPokemon.visible = false;
        enemyPokeBall.visible = true;
        enemyPokeBall.anims.play('ultra-ball-anim-0', true);
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `${'Rosa'} Pokémon Trainer send out ${'Template Name'}`
        );
      },
      this
    );

    sceneEvents.emit(
      'show-battle-text',
      `You're challenged by ${'Rosa'} Pokémon Trainer`
    );
  }

  private async notifyLowerScreen(pokemonState: string) {
    await notifyLowerPromise(pokemonState);
  }

  private createSSE(healthManager: BattleSceneHealthManager) {
    const sse = new EventSource(`${url}/delayed/notify-upper`);
    sse.addEventListener('message', async function (ev) {
      console.log('From Lower Screen');
      let [messageType, information]: string = ev.data.split(',');
      console.log(messageType, information);
      sceneEvents.emit(
        'manage-action',
        messageType,
        information,
        healthManager
      );
      // await notifyLowerPromise();
      sse.close();
    });
  }

  private manageAction(
    messageType: string,
    information: string,
    healthManager: BattleSceneHealthManager
  ) {
    switch (messageType) {
      case 'INCREASE-HEALTH': {
        if (this.hpRect.width < hpRectMaxWidth && !this.zPressed) {
          sceneEvents.emit('new-text');
          sceneEvents.emit(
            'show-battle-text',
            `${'Template Name'} has recovered ${20}ps`
          );
          this.zPressed = true;
          this.timeout = setInterval(() => {
            healthManager.increaseHealth();
            this.timeoutCount++;
            if (this.timeoutCount >= 20) {
              this.timeoutCount = 0;
              this.zPressed = false;
              setTimeout(() => {
                sceneEvents.emit('new-text');
                sceneEvents.emit(
                  'show-battle-text',
                  `What ${'Template Name'} should do?`
                );
                this.waitZ = true;
              }, 2000);
              clearInterval(this.timeout);
            }
          }, 50);
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
            `What ${'Template Name'} should do?`
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
          `${'Template Name'} uses ${'Flamethrower'}`
        );
        this.waitZ = false;
        break;
      }
      case 'SWITCH': {
        this.state = BattleState.SWITCH_PLAYER_POKEMON;
        sceneEvents.emit('new-text');
        sceneEvents.emit(
          'show-battle-text',
          `${'Template Name'} good job! Now come back`
        );
        this.waitZ = false;
        break;
      }
      case 'SWITCH-FAINTED': {
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

  update() {
    switch (this.state) {
      case BattleState.BATTLE_INTRO: {
        this.playerBase.setX((this.playerBaseStartX -= 2));
        this.opponentBase.setX((this.opponentBaseStartX += 2));
        this.playerImage.setX((this.playerStartX -= 2));
        this.opponentImage.setX((this.opponentStartX += 2));
        if (this.introOpponentCompleted()) {
          this.state = BattleState.COMPLETE_PLAYER_INTRO;
        }
        break;
      }
      case BattleState.COMPLETE_PLAYER_INTRO: {
        if (!this.introPlayerCompleted()) {
          this.playerBase.setX((this.playerBaseStartX -= 2));
          this.playerImage.setX((this.playerStartX -= 2));
        } else {
          this.waitZ = true;
        }
        break;
      }
      case BattleState.ENTERING_PARTY_BALL: {
        for (let i = 0; i < this.playerPartyBalls.length; i++) {
          this.playerPartyBalls[i].setX((this.playerPartyBallStartX[i] -= 2));
          this.opponentPartyBalls[i].setX(
            (this.opponentPartyBallStartX[i] += 2)
          );
        }
        if (this.opponentPartyBallsCompleted()) {
          this.state = BattleState.COMPLETE_PLAYER_PARTY_BALL;
        }
        break;
      }
      case BattleState.COMPLETE_PLAYER_PARTY_BALL: {
        for (let i = 0; i < this.playerPartyBalls.length; i++) {
          this.playerPartyBalls[i].setX((this.playerPartyBallStartX[i] -= 2));
        }
        if (this.playerPartyBallsCompleted()) {
          this.state = BattleState.ENEMY_FADING;
          sceneEvents.emit(
            'show-battle-text',
            `${'Rosa'} Pokémon Trainer send out ${'Template Name'}`
          );
        }
        break;
      }
      case BattleState.ENEMY_FADING: {
        this.opponentImage.setX((this.opponentStartX += 2));
        this.opponentImage.alpha -= 0.02;
        if (this.opponentImageFaded()) {
          sceneEvents.emit('opponent-faded');
        }
        break;
      }
      case BattleState.PLAYER_FADING: {
        this.playerImage.setX((this.playerStartX -= 2));
        this.playerImage.alpha -= 0.02;
        if (this.playerImageFaded()) {
          sceneEvents.emit('player-faded');
        }
        break;
      }
      case BattleState.PLAYER_ATTACK_FRONT: {
        this.playerPokemon.setX((this.playerPokemonCurrentX += 2));
        if (this.checkPlayerPokemonFrontX()) {
          this.state = BattleState.PLAYER_ATTACK_BACK;
        }
        break;
      }
      case BattleState.PLAYER_ATTACK_BACK: {
        this.playerPokemon.setX((this.playerPokemonCurrentX -= 2));
        if (this.checkPlayerPokemonBackX()) {
          this.state = BattleState.HIT_ENEMY;
          sceneEvents.emit('hit-enemy');
        }
        break;
      }
      case BattleState.HIT_ENEMY: {
        this.playerPokemon.setX(this.playerPokemonCurrentX);
        break;
      }
      case BattleState.ENEMY_ATTACK_FRONT: {
        this.opponentPokemon.setX((this.opponentPokemonCurrentX -= 2));
        if (this.checkOpponentPokemonFrontX()) {
          this.state = BattleState.ENEMY_ATTACK_BACK;
        }
        break;
      }
      case BattleState.ENEMY_ATTACK_BACK: {
        this.opponentPokemon.setX((this.opponentPokemonCurrentX += 2));
        if (this.checkOpponentPokemonBackX()) {
          this.state = BattleState.HIT_PLAYER;
          sceneEvents.emit('hit-player');
        }
        break;
      }
      case BattleState.HIT_PLAYER: {
        this.opponentPokemon.setX(this.opponentPokemonCurrentX);
        break;
      }
      case BattleState.SWITCH_PLAYER_POKEMON: {
        this.playerPokemon.setX((this.playerPokemonCurrentX -= 2));
        this.playerPokemon.alpha -= 0.02;
        if (this.playerPokemonFaded()) {
          this.state = BattleState.SEND_OUT_PLAYER_POKEMON;
          sceneEvents.emit('send-out-player-pokemon');
        }
        break;
      }
      case BattleState.SEND_OUT_PLAYER_POKEMON: {
        this.playerPokemon.setX(this.playerPokemonStartX);
        this.playerPokemonCurrentX = this.playerPokemonStartX;
        break;
      }
      case BattleState.PLAYER_FAINTED: {
        this.playerPokemon.setX((this.playerPokemonCurrentX -= 2));
        this.playerPokemon.alpha -= 0.02;
        if (this.playerPokemonFaded()) {
          this.playerPokemon.setX(this.playerPokemonStartX);
          this.playerPokemonCurrentX = this.playerPokemonStartX;
          this.waitZ = true;
          this.state = BattleState.BATTLE_START;
          // this.createSSE(); //listening for the switch, create a new one not sending any fake
        }
        break;
      }
      case BattleState.ENEMY_FAINTED: {
        this.opponentPokemon.setX((this.opponentPokemonCurrentX += 2));
        this.opponentPokemon.alpha -= 0.02;
        if (this.opponentPokemonFaded()) {
          this.opponentPokemon.setX(this.opponentPokemonStartX);
          this.opponentPokemonCurrentX = this.opponentPokemonStartX;
          // this.waitZ = true;
          sceneEvents.emit('send-out-enemy-pokemon');
          this.state = BattleState.BATTLE_START;
        }
        break;
      }
    }
    if (this.displayText) {
      this.battleMessage.displayText();
    }
  }

  private introPlayerCompleted() {
    return (
      this.playerBaseStartX <= this.playerBaseEndX &&
      this.playerStartX <= this.playerEndX
    );
  }

  private introOpponentCompleted() {
    return (
      this.opponentBaseStartX >= this.opponentBaseEndX &&
      this.opponentStartX >= this.opponentEndX
    );
  }

  private opponentPartyBallsCompleted() {
    return this.opponentPartyBallStartX[0] >= this.opponentPartyBallEndX;
  }

  private playerPartyBallsCompleted() {
    return this.playerPartyBallStartX[0] <= this.playerPartyBallEndX;
  }

  private opponentImageFaded() {
    return this.opponentImage.alpha <= 0;
  }

  private playerImageFaded() {
    return this.playerImage.alpha <= 0;
  }

  private checkPlayerPokemonFrontX() {
    return this.playerPokemonCurrentX >= this.playerPokemonEndX;
  }

  private checkPlayerPokemonBackX() {
    return this.playerPokemonCurrentX <= this.playerPokemonStartX;
  }

  private checkOpponentPokemonFrontX() {
    return this.opponentPokemonCurrentX <= this.opponentPokemonEndX;
  }

  private checkOpponentPokemonBackX() {
    return this.opponentPokemonCurrentX >= this.opponentPokemonStartX;
  }

  private playerPokemonFaded() {
    return this.playerPokemon.alpha <= 0;
  }

  private opponentPokemonFaded() {
    return this.opponentPokemon.alpha <= 0;
  }

  private initializePlayerPositions() {
    this.playerStartX = this.game.config.width as number;
    this.playerEndX = 50;
    this.playerBaseStartX = this.playerStartX - 50;
    this.playerBaseEndX = 0;
    this.playerPartyBallEndX = 210;
    this.playerPokemonStartX = 90;
    this.playerPokemonCurrentX = this.playerPokemonStartX;
    this.playerPokemonEndX = 130;
  }

  private initializeOpponentPositions() {
    this.opponentStartX = 0;
    this.opponentEndX = 210;
    this.opponentBaseStartX = this.opponentStartX - 60;
    this.opponentBaseEndX = 150;
    this.opponentPartyBallEndX = 110;
    this.opponentPokemonStartX = 250;
    this.opponentPokemonCurrentX = this.opponentPokemonStartX;
    this.opponentPokemonEndX = 210;
  }

  private createAnims() {
    for (let i = 0; i < pokeBalls.length; i++) {
      createPokeBallAnim(this.anims, pokeBalls[i]);
    }
    for (let i = 0; i < pokemonFrames.length; i++) {
      this.frameQuantitiesBack[i] = createPokemonBackAnim(
        this.anims,
        pokemonFrames[i].pokedexNumber,
        pokemonFrames[i].backFrames
      );
      this.frameQuantitiesFront[i] = createPokemonFrontAnim(
        this.anims,
        pokemonFrames[i].pokedexNumber,
        pokemonFrames[i].frontFrames
      );
    }
  }

  private managePressZPlayerIntro() {
    sceneEvents.emit('new-text');
    this.state = BattleState.ENTERING_PARTY_BALL;
    this.playerPartyBar.visible = true;
    this.opponentPartyBar.visible = true;
    this.playerPartyBalls.forEach((ball) => {
      ball.visible = true;
    });
    this.opponentPartyBalls.forEach((ball) => {
      ball.visible = true;
    });
    this.waitZ = false;
  }

  private manangePressZBattleStart(healthManager: BattleSceneHealthManager) {
    this.waitZ = false;
    this.createSSE(healthManager);
  }

  private createInputKeyboard(healthManager: BattleSceneHealthManager) {
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
              this.manangePressZBattleStart(healthManager);
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
}
