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

enum BattleState {
  BATTLE_INTRO,
  COMPLETE_PLAYER_INTRO,
  ENTERING_PARTY_BALL,
}

const pokeBalls = ['poke-ball', 'master-ball', 'mega-ball', 'ultra-ball'];

const notifyLowerPromise = () => {
  return new Promise((resolve: () => void) => {
    axios.get(`${url}/real-time/notify-lower`).then((response) => {
      console.log('Successfully sent to lower');
      console.log(response.data);
      resolve();
    });
  });
};

export default class BattleScene extends Phaser.Scene {
  private state!: BattleState;
  private displayText: boolean = false;
  private frameQuantitiesBack: number[] = [];
  private frameQuantitiesFront: number[] = [];
  private battleMessage!: MessageBoxScene;
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
  constructor() {
    super('battle-scene');
  }

  preload() {}

  create(data: { sceneToRemove: string }) {
    this.scene.remove(data.sceneToRemove);
    this.state = BattleState.BATTLE_INTRO;
    this.playerStartX = this.game.config.width as number;
    this.playerEndX = 50;
    this.opponentStartX = 0;
    this.opponentEndX = 210;
    this.playerBaseStartX = this.playerStartX - 50;
    this.playerBaseEndX = 0;
    this.opponentBaseStartX = this.opponentStartX - 60;
    this.opponentBaseEndX = 150;
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
    const playerPokemonIndex = Math.floor(Math.random() * pokemonFrames.length);
    const enemyPokemonIndex = Math.floor(Math.random() * pokemonFrames.length);
    const bgNumber = Math.floor(Math.random() * 6);
    const bg = this.add.image(0, 0, `battle-bg${bgNumber}`).setOrigin(0, 0);
    bg.width = this.game.config.width as number;
    bg.height = (this.game.config.height as number) * (3 / 4);
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;

    this.battleMessage = new MessageBoxScene(this);
    this.battleMessage.create();

    //TODO: add player-base
    this.playerBase = this.add
      .image(this.playerBaseStartX, 170, `player-base${bgNumber}`)
      .setOrigin(0, 0);
    this.playerBase.width = 190;
    this.playerBase.height = 60;
    this.playerBase.displayWidth = this.playerBase.width;
    this.playerBase.displayHeight = this.playerBase.height;
    //TODO: add enemy-base
    const enemyBaseY = 85;
    this.opponentBase = this.add
      .image(this.opponentBaseStartX, enemyBaseY, `enemy-base${bgNumber}`)
      .setOrigin(0, 0);
    this.opponentBase.width = 190;
    this.opponentBase.height = 60;
    this.opponentBase.displayWidth = this.opponentBase.width;
    this.opponentBase.displayHeight = this.opponentBase.height;
    //add player image
    this.playerImage = this.add
      .image(this.playerStartX, 88, 'throw-ball-nate')
      .setOrigin(0, 0);
    this.playerImage.width = 50;
    this.playerImage.height = 125;
    this.playerImage.displayWidth = this.playerImage.width;
    this.playerImage.displayHeight = this.playerImage.height;
    this.playerImage.visible = true;
    // add enemy image
    const enemyX = bg.x;
    const enemyY = 0;
    this.opponentImage = this.add
      .image(this.opponentStartX, enemyY, 'vs-rosa')
      .setOrigin(0, 0);
    this.opponentImage.width = 50;
    this.opponentImage.height = 125;
    this.opponentImage.displayWidth = this.opponentImage.width;
    this.opponentImage.displayHeight = this.opponentImage.height;
    this.opponentImage.visible = true;

    // barra sfere giocatore
    const playerPartyBar = this.add
      .image(180, 170, 'battle-party-bar')
      .setOrigin(0, 0)
      .setFlip(true, false);
    playerPartyBar.width = 180;
    playerPartyBar.height = 5;
    playerPartyBar.displayWidth = playerPartyBar.width;
    playerPartyBar.displayHeight = playerPartyBar.height;
    playerPartyBar.visible = false;
    // barra sfere avversario
    const enemyPartyBar = this.add
      .image(0, 50, 'battle-party-bar')
      .setOrigin(0, 0);
    enemyPartyBar.width = 180;
    enemyPartyBar.height = 5;
    enemyPartyBar.displayWidth = enemyPartyBar.width;
    enemyPartyBar.displayHeight = enemyPartyBar.height;
    enemyPartyBar.visible = false;
    //TODO: sfere giocatore
    let playerPartyBallX = 210;
    for (let i = 0; i < 6; i++, playerPartyBallX += 20) {
      const partyBall = this.add
        .image(playerPartyBallX, 150, 'ball-normal')
        .setOrigin(0, 0);
      partyBall.width = 20;
      partyBall.height = 20;
      partyBall.displayWidth = partyBall.width;
      partyBall.displayHeight = partyBall.height;
      partyBall.visible = false;
    }

    // sfere avversario
    let enemyPartyBallX = 110;
    for (let i = 0; i < 6; i++, enemyPartyBallX -= 20) {
      const partyBall = this.add
        .image(enemyPartyBallX, 30, 'ball-normal')
        .setOrigin(0, 0);
      partyBall.width = 20;
      partyBall.height = 20;
      partyBall.displayWidth = partyBall.width;
      partyBall.displayHeight = partyBall.height;
      partyBall.visible = false;
    }

    // poke ball giocatore
    const playerPokeBall = this.add.sprite(90, 150, 'player-ball');
    playerPokeBall.on(
      Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
        'master-ball-anim-0',
      function (animation, frame) {
        playerPokeBall.anims.play('master-ball-anim-1');
      },
      this
    );
    // playerPokeBall.anims.play('master-ball-anim-0', true);
    playerPokeBall.visible = false;
    // poke ball avversario
    const enemyPokeBall = this.add.sprite(250, 80, 'enemy-ball');
    enemyPokeBall.on(
      Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
        'ultra-ball-anim-0',
      function (animation, frame) {
        enemyPokeBall.anims.play('ultra-ball-anim-1');
      },
      this
    );
    // enemyPokeBall.anims.play('ultra-ball-anim-0', true);
    enemyPokeBall.visible = false;

    //TODO: Player's Pokémon
    const playerPokemon = this.add.sprite(90, 150, 'player-pokemon');
    for (let i = 0; i < this.frameQuantitiesBack[playerPokemonIndex]; i++) {
      let nextAnim = i + 1;
      if (nextAnim == this.frameQuantitiesBack[playerPokemonIndex]) {
        nextAnim = 0;
      }
      playerPokemon.on(
        Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
          `${pokemonFrames[playerPokemonIndex].pokedexNumber}-back-anim-${i}`,
        function (animation, frame) {
          playerPokemon.anims.play(
            `${pokemonFrames[playerPokemonIndex].pokedexNumber}-back-anim-${nextAnim}`
          );
        },
        this
      );
    }
    // playerPokemon.anims.play(
    //   `${pokemonFrames[playerPokemonIndex].pokedexNumber}-back-anim-0`
    // );
    playerPokemon.visible = false;
    //TODO: Enemy's Pokémon
    const enemyPokemon = this.add.sprite(250, 80, 'enemy-pokemon');
    for (let i = 0; i < this.frameQuantitiesFront[enemyPokemonIndex]; i++) {
      let nextAnim = i + 1;
      if (nextAnim == this.frameQuantitiesFront[enemyPokemonIndex]) {
        nextAnim = 0;
      }
      enemyPokemon.on(
        Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
          `${pokemonFrames[enemyPokemonIndex].pokedexNumber}-front-anim-${i}`,
        function (animation, frame) {
          enemyPokemon.anims.play(
            `${pokemonFrames[enemyPokemonIndex].pokedexNumber}-front-anim-${nextAnim}`
          );
        },
        this
      );
    }
    // enemyPokemon.anims.play(
    //   `${pokemonFrames[enemyPokemonIndex].pokedexNumber}-front-anim-0`
    // );
    enemyPokemon.visible = false;

    // Player life bar
    const playerLifeBar = this.add.image(255, 165, 'player-life-bar');
    playerLifeBar.width = 170;
    playerLifeBar.height = 40;
    playerLifeBar.displayWidth = playerLifeBar.width;
    playerLifeBar.displayHeight = playerLifeBar.height;
    playerLifeBar.visible = false;
    // Enemy life bar
    const enemyLifeBar = this.add.image(85, 50, 'enemy-life-bar');
    enemyLifeBar.width = 170;
    enemyLifeBar.height = 30;
    enemyLifeBar.displayWidth = enemyLifeBar.width;
    enemyLifeBar.displayHeight = enemyLifeBar.height;
    enemyLifeBar.visible = false;

    // Player pokemon name
    const playerPokemonName = this.add.text(180, 142, 'Template Name', {
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
      fontSize: 12,
    });
    playerPokemonName.visible = false;

    // Enemy pokemon name
    const enemyPokemonName = this.add.text(15, 35, 'Template Name', {
      stroke: '#000000',
      strokeThickness: 5,
      fontSize: 12,
      align: 'center',
    });
    enemyPokemonName.visible = false;

    // Player level
    const playerPokemonLevel = this.add.text(295, 142, '50', {
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
      fontSize: 12,
    });
    playerPokemonLevel.visible = false;

    // Enemy level
    const enemyPokemonLevel = this.add.text(125, 35, '50', {
      stroke: '#000000',
      strokeThickness: 5,
      fontSize: 12,
      align: 'center',
    });
    enemyPokemonLevel.visible = false;

    // Player health
    const healthText = this.add.text(255, 162, `${555}/${555}`, {
      stroke: '#000000',
      strokeThickness: 5,
      fontSize: 12,
      align: 'center',
    });
    healthText.visible = false;

    // Player life
    const playerLife = this.add.rectangle(283, 163, 69, 5.2, 0x00bf37);
    playerLife.visible = false;

    // Enemy life
    const enemyLife = this.add.rectangle(93, 56, 68, 5.2, 0x00bf37);
    enemyLife.visible = false;

    this.input.keyboard.on(
      'keydown-Z',
      () => {
        this.createSSE();
        sceneEvents.emit('new-text');
      },
      this
    );
    sceneEvents.on('display-text', () => {
      this.displayText = true;
    });
    sceneEvents.on('end-text', () => {
      this.displayText = false;
    });
    sceneEvents.emit(
      'show-battle-text',
      'Sample battle text...check its visualization'
    );
  }

  private createSSE() {
    const sse = new EventSource(`${url}/delayed/notify-upper`);
    sse.addEventListener('message', async function (ev) {
      console.log('From Lower Screen');
      console.log(ev.data);
      await notifyLowerPromise();
      sse.close();
    });
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
        this.playerBase.setX((this.playerBaseStartX -= 2));
        this.playerImage.setX((this.playerStartX -= 2));
        if (this.introPlayerCompleted()) {
          this.state = BattleState.ENTERING_PARTY_BALL;
        }
        break;
      }
      case BattleState.ENTERING_PARTY_BALL: {
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
      this.opponentStartX >= this.opponentBaseEndX
    );
  }
}
