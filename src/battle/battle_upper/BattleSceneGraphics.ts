import Phaser from 'phaser';
import { pokemonFrames } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';

export default class BattleSceneGraphics {
  constructor(public scene: Phaser.Scene) {}

  public createBackground(bgNumber: number) {
    const bg = this.scene.add
      .image(0, 0, `battle-bg${bgNumber}`)
      .setOrigin(0, 0);
    bg.width = this.scene.game.config.width as number;
    bg.height = (this.scene.game.config.height as number) * (3 / 4);
    bg.displayWidth = bg.width;
    bg.displayHeight = bg.height;
    return bg;
  }

  public createPlayerBase(bgNumber: number, playerBaseStartX: number) {
    const playerBase = this.scene.add
      .image(playerBaseStartX, 170, `player-base${bgNumber}`)
      .setOrigin(0, 0);
    playerBase.width = 190;
    playerBase.height = 60;
    playerBase.displayWidth = playerBase.width;
    playerBase.displayHeight = playerBase.height;
    return playerBase;
  }

  public createOpponentBase(bgNumber: number, opponentBaseStartX: number) {
    const enemyBaseY = 85;
    const opponentBase = this.scene.add
      .image(opponentBaseStartX, enemyBaseY, `enemy-base${bgNumber}`)
      .setOrigin(0, 0);
    opponentBase.width = 190;
    opponentBase.height = 60;
    opponentBase.displayWidth = opponentBase.width;
    opponentBase.displayHeight = opponentBase.height;
    return opponentBase;
  }

  public createPlayerImage(playerStartX: number, playerSprite: string) {
    const playerImage = this.scene.add
      .image(playerStartX, 88, `throw-ball-${playerSprite}`)
      .setOrigin(0, 0);
    playerImage.width = 50;
    playerImage.height = 125;
    playerImage.displayWidth = playerImage.width;
    playerImage.displayHeight = playerImage.height;
    playerImage.visible = true;
    return playerImage;
  }

  public createOpponentImage(opponentStartX: number, opponentSprite: string) {
    const opponentImage = this.scene.add
      .image(opponentStartX, 0, `vs-${opponentSprite}`)
      .setOrigin(0, 0);
    opponentImage.width = 50;
    opponentImage.height = 125;
    opponentImage.displayWidth = opponentImage.width;
    opponentImage.displayHeight = opponentImage.height;
    opponentImage.visible = true;
    return opponentImage;
  }

  public createPlayerPartyBar() {
    const playerPartyBar = this.scene.add
      .image(180, 170, 'battle-party-bar')
      .setOrigin(0, 0)
      .setFlip(true, false);
    playerPartyBar.width = 180;
    playerPartyBar.height = 5;
    playerPartyBar.displayWidth = playerPartyBar.width;
    playerPartyBar.displayHeight = playerPartyBar.height;
    playerPartyBar.visible = false;
    return playerPartyBar;
  }

  public createOpponentPartyBar() {
    const opponentPartyBar = this.scene.add
      .image(0, 50, 'battle-party-bar')
      .setOrigin(0, 0);
    opponentPartyBar.width = 180;
    opponentPartyBar.height = 5;
    opponentPartyBar.displayWidth = opponentPartyBar.width;
    opponentPartyBar.displayHeight = opponentPartyBar.height;
    opponentPartyBar.visible = false;
    return opponentPartyBar;
  }

  public createPlayerPartyBalls(playerStartX: number) {
    let ballX = playerStartX;
    let playerPartyBallStartX: number[] = [];
    let playerPartyBalls: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 6; i++, ballX += 20) {
      const partyBall = this.scene.add
        .image(ballX, 150, 'ball-normal')
        .setOrigin(0, 0);
      partyBall.width = 20;
      partyBall.height = 20;
      partyBall.displayWidth = partyBall.width;
      partyBall.displayHeight = partyBall.height;
      partyBall.visible = false;
      playerPartyBallStartX.push(ballX);
      playerPartyBalls.push(partyBall);
    }
    return {
      playerPartyBallsStartX: playerPartyBallStartX,
      playerPartyBalls: playerPartyBalls,
    };
  }

  public createOpponentPartyBalls(opponentStartX: number) {
    let ballX = opponentStartX;
    let opponentPartyBallStartX: number[] = [];
    let opponentPartyBalls: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 6; i++, ballX -= 20) {
      const partyBall = this.scene.add
        .image(ballX, 30, 'ball-normal')
        .setOrigin(0, 0);
      partyBall.width = 20;
      partyBall.height = 20;
      partyBall.displayWidth = partyBall.width;
      partyBall.displayHeight = partyBall.height;
      partyBall.visible = false;
      opponentPartyBallStartX.push(ballX);
      opponentPartyBalls.push(partyBall);
    }
    return {
      opponentPartyBallStartX: opponentPartyBallStartX,
      opponentPartyBalls: opponentPartyBalls,
    };
  }

  public createPlayerPokeBall() {
    const playerPokeBall = this.scene.add.sprite(90, 150, 'player-ball');
    playerPokeBall.on(
      Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
        'poke-ball-anim-0',
      function (animation, frame) {
        playerPokeBall.anims.play('poke-ball-anim-1', true);
      },
      this
    );
    playerPokeBall.on(
      Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
        'poke-ball-anim-1',
      function (animation, frame) {
        sceneEvents.emit('from-player-poke-ball-to-pokemon');
      },
      this
    );
    playerPokeBall.visible = false;
    return playerPokeBall;
  }

  public createOpponentPokeBall() {
    const enemyPokeBall = this.scene.add.sprite(250, 80, 'enemy-ball');
    enemyPokeBall.on(
      Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
        'poke-ball-anim-0',
      function (animation, frame) {
        enemyPokeBall.anims.play('poke-ball-anim-1', true);
      },
      this
    );
    enemyPokeBall.on(
      Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
        'poke-ball-anim-1',
      function (animation, frame) {
        sceneEvents.emit('from-opponent-poke-ball-to-pokemon');
      },
      this
    );
    enemyPokeBall.visible = false;
    return enemyPokeBall;
  }

  public createPlayerLifeBar() {
    const playerLifeBar = this.scene.add.image(255, 165, 'player-life-bar');
    playerLifeBar.width = 170;
    playerLifeBar.height = 40;
    playerLifeBar.displayWidth = playerLifeBar.width;
    playerLifeBar.displayHeight = playerLifeBar.height;
    playerLifeBar.visible = false;
    return playerLifeBar;
  }

  public createOpponentLifeBar() {
    const enemyLifeBar = this.scene.add.image(85, 50, 'enemy-life-bar');
    enemyLifeBar.width = 170;
    enemyLifeBar.height = 30;
    enemyLifeBar.displayWidth = enemyLifeBar.width;
    enemyLifeBar.displayHeight = enemyLifeBar.height;
    enemyLifeBar.visible = false;
    return enemyLifeBar;
  }

  public createPlayerPokemonName(pokemonName: string) {
    const playerPokemonName = this.scene.add.text(180, 142, `${pokemonName}`, {
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
      fontSize: 12,
    });
    playerPokemonName.visible = false;
    return playerPokemonName;
  }

  public createOpponentPokemonName(pokemonName: string) {
    const opponentPokemonName = this.scene.add.text(15, 35, `${pokemonName}`, {
      stroke: '#000000',
      strokeThickness: 5,
      fontSize: 12,
      align: 'center',
    });
    opponentPokemonName.visible = false;
    return opponentPokemonName;
  }

  public createPlayerPokemonLevel() {
    const playerPokemonLevel = this.scene.add.text(295, 142, '50', {
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
      fontSize: 12,
    });
    playerPokemonLevel.visible = false;
    return playerPokemonLevel;
  }

  public createOpponentPokemonLevel() {
    const enemyPokemonLevel = this.scene.add.text(125, 35, '50', {
      stroke: '#000000',
      strokeThickness: 5,
      fontSize: 12,
      align: 'center',
    });
    enemyPokemonLevel.visible = false;
    return enemyPokemonLevel;
  }

  public createPlayerHealthText(
    pokemonCurrentHealth: number,
    pokemonMaxHealth: number
  ) {
    const healthText = this.scene.add.text(
      255,
      162,
      `${pokemonCurrentHealth}/${pokemonMaxHealth}`,
      {
        stroke: '#000000',
        strokeThickness: 5,
        fontSize: 12,
        align: 'center',
      }
    );
    healthText.visible = false;
    return healthText;
  }

  public createPlayerHpRect(
    pokemonCurrentHealth: number,
    pokemonMaxHealth: number,
    hpRectMaxWidth: number
  ) {
    const rectWidth = this.computeRectWidth(
      pokemonCurrentHealth,
      pokemonMaxHealth,
      hpRectMaxWidth
    );
    const hpRect = this.scene.add
      .rectangle(249.2, 161, rectWidth, 5.2, 0x00bf37)
      .setOrigin(0, 0);
    hpRect.visible = false;
    return hpRect;
  }

  public createOpponentHpRect(opponentPokemonMaxWidth: number) {
    const opponentHpRect = this.scene.add
      .rectangle(60, 53, opponentPokemonMaxWidth, 5.2, 0x00bf37)
      .setOrigin(0, 0);
    opponentHpRect.visible = false;
    return opponentHpRect;
  }

  public computeRectWidth(
    currentHealth: number,
    maxHealth: number,
    maxRectWidth: number
  ) {
    let new_width = maxRectWidth * (currentHealth / maxHealth);
    if (new_width >= maxRectWidth) {
      new_width = maxRectWidth;
    }
    return new_width;
  }

  public createPlayerPokemon(
    playerPokemonIndex: number,
    playerPokemonStartX,
    frameQuantitiesBack: number[]
  ) {
    const playerPokemon = this.scene.add.sprite(
      playerPokemonStartX,
      150,
      'player-pokemon'
    );
    for (let i = 0; i < frameQuantitiesBack[playerPokemonIndex]; i++) {
      let nextAnim = i + 1;
      if (nextAnim == frameQuantitiesBack[playerPokemonIndex]) {
        nextAnim = 0;
      }
      playerPokemon.on(
        Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
          `${pokemonFrames[playerPokemonIndex].pokedexNumber}-back-anim-${i}`,
        function (animation, frame) {
          playerPokemon.anims.play(
            `${pokemonFrames[playerPokemonIndex].pokedexNumber}-back-anim-${nextAnim}`,
            true
          );
        },
        this
      );
    }
    playerPokemon.visible = false;
    return playerPokemon;
  }

  public createOpponentPokemon(
    enemyPokemonIndex: number,
    opponentPokemonStartX: number,
    frameQuantitiesBack: number[]
  ) {
    const opponentPokemon = this.scene.add.sprite(
      opponentPokemonStartX,
      80,
      'enemy-pokemon'
    );
    for (let i = 0; i < frameQuantitiesBack[enemyPokemonIndex]; i++) {
      let nextAnim = i + 1;
      if (nextAnim == frameQuantitiesBack[enemyPokemonIndex]) {
        nextAnim = 0;
      }
      opponentPokemon.on(
        Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE +
          `${pokemonFrames[enemyPokemonIndex].pokedexNumber}-front-anim-${i}`,
        function (animation, frame) {
          opponentPokemon.anims.play(
            `${pokemonFrames[enemyPokemonIndex].pokedexNumber}-front-anim-${nextAnim}`,
            true
          );
        },
        this
      );
    }
    opponentPokemon.visible = false;
    return opponentPokemon;
  }
}
