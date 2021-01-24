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
      .image(playerBaseStartX, screen.height * 0.2213541667, `player-base${bgNumber}`)
      .setOrigin(0, 0);
    playerBase.width = screen.width * 0.1390922401;
    playerBase.height = screen.height * 0.078125;
    playerBase.displayWidth = playerBase.width;
    playerBase.displayHeight = playerBase.height;
    return playerBase;
  }

  public createOpponentBase(bgNumber: number, opponentBaseStartX: number) {
    const enemyBaseY = screen.height * 0.1106770833;
    const opponentBase = this.scene.add
      .image(opponentBaseStartX, enemyBaseY, `enemy-base${bgNumber}`)
      .setOrigin(0, 0);
    opponentBase.width = screen.width * 0.1390922401;
    opponentBase.height = screen.height * 0.078125;
    opponentBase.displayWidth = opponentBase.width;
    opponentBase.displayHeight = opponentBase.height;
    return opponentBase;
  }

  public createPlayerImage(playerStartX: number, playerSprite: string) {
    const playerImage = this.scene.add
      .image(playerStartX, screen.height * 0.1145833333, `throw-ball-${playerSprite}`)
      .setOrigin(0, 0);
    playerImage.width = screen.width * 0.036603221;
    playerImage.height = screen.height * 0.1627604167;
    playerImage.displayWidth = playerImage.width;
    playerImage.displayHeight = playerImage.height;
    playerImage.visible = true;
    return playerImage;
  }

  public createOpponentImage(opponentStartX: number, opponentSprite: string) {
    const opponentImage = this.scene.add
      .image(opponentStartX, 0, `vs-${opponentSprite}`)
      .setOrigin(0, 0);
    opponentImage.width = screen.width * 0.036603221;
    opponentImage.height = screen.height * 0.1627604167;
    opponentImage.displayWidth = opponentImage.width;
    opponentImage.displayHeight = opponentImage.height;
    opponentImage.visible = true;
    return opponentImage;
  }

  public createPlayerPartyBar() {
    const playerPartyBar = this.scene.add
      .image(screen.width * 0.1317715959, screen.height * 0.2213541667, 'battle-party-bar')
      .setOrigin(0, 0)
      .setFlip(true, false);
    playerPartyBar.width = screen.width * 0.1317715959;
    playerPartyBar.height = screen.height * 0.0065104167;
    playerPartyBar.displayWidth = playerPartyBar.width;
    playerPartyBar.displayHeight = playerPartyBar.height;
    playerPartyBar.visible = false;
    return playerPartyBar;
  }

  public createOpponentPartyBar() {
    const opponentPartyBar = this.scene.add
      .image(0, screen.height * 0.0651041667, 'battle-party-bar')
      .setOrigin(0, 0);
    opponentPartyBar.width = screen.width * 0.1317715959;
    opponentPartyBar.height = screen.height * 0.0065104167;
    opponentPartyBar.displayWidth = opponentPartyBar.width;
    opponentPartyBar.displayHeight = opponentPartyBar.height;
    opponentPartyBar.visible = false;
    return opponentPartyBar;
  }

  public createPlayerPartyBalls(playerStartX: number) {
    let ballX = playerStartX;
    let playerPartyBallStartX: number[] = [];
    let playerPartyBalls: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 6; i++, ballX += screen.width * 0.0146412884) {
      const partyBall = this.scene.add
        .image(ballX, screen.height * 0.1953125, 'ball-normal')
        .setOrigin(0, 0);
      partyBall.width = screen.width * 0.0146412884;
      partyBall.height = screen.height * 0.026416667;
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
    for (let i = 0; i < 6; i++, ballX -= screen.width * 0.0146412884) {
      const partyBall = this.scene.add
        .image(ballX, screen.height * 0.0390625, 'ball-normal')
        .setOrigin(0, 0);
      partyBall.width = screen.width * 0.0146412884;
      partyBall.height = screen.height * 0.026416667;
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
    const playerPokeBall = this.scene.add.sprite(screen.width * 0.065885798, screen.height * 0.1953125, 'player-ball');
    playerPokeBall.width = screen.width * 0.0292825769;
    playerPokeBall.height = screen.height * 0.0520833333;
    playerPokeBall.displayWidth = playerPokeBall.width;
    playerPokeBall.displayHeight = playerPokeBall.height;
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
    const enemyPokeBall = this.scene.add.sprite(screen.width * 0.1830161054, screen.height * 0.1041666667, 'enemy-ball');
    enemyPokeBall.width = screen.width * 0.0292825769;
    enemyPokeBall.height = screen.height * 0.0520833333;
    enemyPokeBall.displayWidth = enemyPokeBall.width;
    enemyPokeBall.displayHeight = enemyPokeBall.height;
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
    const playerLifeBar = this.scene.add.image(screen.width * 0.1866764275, screen.height * 0.21484375, 'player-life-bar');
    playerLifeBar.width = screen.width * 0.1244509517;
    playerLifeBar.height = screen.height * 0.0520833333;
    playerLifeBar.displayWidth = playerLifeBar.width;
    playerLifeBar.displayHeight = playerLifeBar.height;
    playerLifeBar.visible = false;
    return playerLifeBar;
  }

  public createOpponentLifeBar() {
    const enemyLifeBar = this.scene.add.image(screen.width * 0.0622254758, screen.height * 0.0651041667, 'enemy-life-bar');
    enemyLifeBar.width = screen.width * 0.1244509517;
    enemyLifeBar.height = screen.height * 0.0390625;
    enemyLifeBar.displayWidth = enemyLifeBar.width;
    enemyLifeBar.displayHeight = enemyLifeBar.height;
    enemyLifeBar.visible = false;
    return enemyLifeBar;
  }

  public createPlayerPokemonName(pokemonName: string) {
    const playerPokemonName = this.scene.add.text(screen.width * 0.1332357247, screen.height * 0.1848958333, `${pokemonName}`, {
      stroke: '#000000',
      strokeThickness: screen.width * 0.0036603221,
      align: 'center',
      fontSize: screen.width * 0.0087847731,
    });
    playerPokemonName.visible = false;
    return playerPokemonName;
  }

  public createOpponentPokemonName(pokemonName: string) {
    const opponentPokemonName = this.scene.add.text(screen.width * 0.0109809663, screen.height * 0.0455729167, `${pokemonName}`, {
      stroke: '#000000',
      strokeThickness: screen.width * 0.0036603221,
      fontSize: screen.width * 0.0087847731,
      align: 'center',
    });
    opponentPokemonName.visible = false;
    return opponentPokemonName;
  }

  public createPlayerPokemonLevel() {
    const playerPokemonLevel = this.scene.add.text(screen.width * 0.2159590044, screen.height * 0.1848958333, '50', {
      stroke: '#000000',
      strokeThickness: screen.width * 0.0036603221,
      align: 'center',
      fontSize: screen.width * 0.0087847731,
    });
    playerPokemonLevel.visible = false;
    return playerPokemonLevel;
  }

  public createOpponentPokemonLevel() {
    const enemyPokemonLevel = this.scene.add.text(screen.width * 0.0915080527, screen.height * 0.0455729167, '50', {
      stroke: '#000000',
      strokeThickness: screen.width * 0.0036603221,
      fontSize: screen.width * 0.0087847731,
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
      screen.width * 0.1866764275,
      screen.height * 0.2109375,
      `${pokemonCurrentHealth}/${pokemonMaxHealth}`,
      {
        stroke: '#000000',
        strokeThickness: screen.width * 0.0036603221,
        fontSize: screen.width * 0.0087847731,
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
      .rectangle(screen.width * 0.1824304539, screen.height * 0.2096354167, rectWidth, screen.height * 0.0067708333, 0x00bf37)
      .setOrigin(0, 0);
    hpRect.visible = false;
    return hpRect;
  }

  public createOpponentHpRect(opponentPokemonMaxWidth: number) {
    const opponentHpRect = this.scene.add
      .rectangle(screen.width * 0.0439238653, screen.height * 0.0690104167, opponentPokemonMaxWidth, screen.height * 0.0067708333, 0x00bf37)
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
      screen.height * 0.1953125,
      'player-pokemon'
    );
    playerPokemon.width = (playerPokemon.width / 1366) * screen.width;
    playerPokemon.height = (playerPokemon.height / 768) * screen.height;
    playerPokemon.displayWidth = playerPokemon.width;
    playerPokemon.displayHeight = playerPokemon.height;
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
      screen.height * 0.1041666667,
      'enemy-pokemon'
    );
    opponentPokemon.width = (opponentPokemon.width / 1366) * screen.width;
    opponentPokemon.height = (opponentPokemon.height / 768) * screen.height;
    opponentPokemon.displayWidth = opponentPokemon.width;
    opponentPokemon.displayHeight = opponentPokemon.height;
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
