import Phaser from 'phaser';
import BattleSceneGraphics from './BattleSceneGraphics';

export default class BattleSceneIntroManager {
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
  private opponentPokeBall!: Phaser.GameObjects.Sprite;
  private playerPokeBall!: Phaser.GameObjects.Sprite;
  constructor(public scene: Phaser.Scene) {}

  public initializePlayerPosition() {
    this.playerStartX = this.scene.game.config.width as number;
    this.playerEndX = screen.width * 0.0366032211;
    this.playerBaseStartX = this.playerStartX - screen.width * 0.0366032211;
    this.playerBaseEndX = 0;
    this.playerPartyBallEndX = screen.width * 0.1537335286;
  }

  public initializeOpponentPosition() {
    this.opponentStartX = 0;
    this.opponentEndX = screen.width * 0.1537335286;
    this.opponentBaseStartX = this.opponentStartX - screen.width * 0.0439238653;
    this.opponentBaseEndX = screen.width * 0.1098096633;
    this.opponentPartyBallEndX = screen.width * 0.0805270864;
  }

  public createIntroGraphics(
    battleGraphics: BattleSceneGraphics,
    bgNumber: number,
    playerSprite: string,
    opponentSprite: string
  ) {
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
    this.playerImage = battleGraphics.createPlayerImage(
      this.playerStartX,
      playerSprite
    );
    // add enemy image
    this.opponentImage = battleGraphics.createOpponentImage(
      this.opponentStartX,
      opponentSprite
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
    this.playerPokeBall = battleGraphics.createPlayerPokeBall();
    // poke ball avversario
    this.opponentPokeBall = battleGraphics.createOpponentPokeBall();
  }

  public playOpponentPokeBall() {
    this.opponentPokeBall.visible = true;
    this.opponentPokeBall.anims.play('poke-ball-anim-0', true);
  }

  public invisibleOpponentPokeBall() {
    this.opponentPokeBall.visible = false;
  }

  public playPlayerPokeBall() {
    this.playerPokeBall.visible = true;
    this.playerPokeBall.anims.play('poke-ball-anim-0', true);
  }

  public invisiblePlayerPokeBall() {
    this.playerPokeBall.visible = false;
  }

  public invisibleOpponentPartyBar() {
    this.opponentPartyBar.visible = false;
  }

  public visibleOpponentPartyBar() {
    this.opponentPartyBar.visible = true;
  }

  public visiblePlayerPartyBar() {
    this.playerPartyBar.visible = true;
  }

  public invisiblePlayerPartyBar() {
    this.playerPartyBar.visible = false;
  }

  public invisiblePlayerPartyBalls() {
    this.playerPartyBalls.forEach((ball) => {
      ball.visible = false;
    });
  }

  public invisibleOpponentPartyBalls() {
    this.opponentPartyBalls.forEach((ball) => {
      ball.visible = false;
    });
  }

  public visibleOpponentPartyBalls() {
    this.opponentPartyBalls.forEach((ball) => {
      ball.visible = true;
    });
  }

  public visiblePlayerPartyBalls() {
    this.playerPartyBalls.forEach((ball) => {
      ball.visible = true;
    });
  }

  public setPlayerBaseX() {
    this.playerBase.setX((this.playerBaseStartX -= screen.width * 0.0029282577));
  }

  public setOpponentBaseX() {
    this.opponentBase.setX((this.opponentBaseStartX += screen.width * 0.0029282577));
  }

  public setPlayerImageX() {
    this.playerImage.setX((this.playerStartX -= screen.width * 0.0029282577));
  }

  public setPlayerImageAlpha() {
    this.playerImage.alpha -= 0.02;
  }

  public setOpponentImageX() {
    this.opponentImage.setX((this.opponentStartX += screen.width * 0.0029282577));
  }

  public setOpponentImageAlpha() {
    this.opponentImage.alpha -= 0.02;
  }

  public enterPlayerAndOpponentPartyBalls() {
    for (let i = 0; i < this.playerPartyBalls.length; i++) {
      this.playerPartyBalls[i].setX((this.playerPartyBallStartX[i] -= screen.width * 0.0029282577));
      this.opponentPartyBalls[i].setX((this.opponentPartyBallStartX[i] += screen.width * 0.0029282577));
    }
  }

  public enterPlayerPartyBalls() {
    for (let i = 0; i < this.playerPartyBalls.length; i++) {
      this.playerPartyBalls[i].setX((this.playerPartyBallStartX[i] -= screen.width * 0.0029282577));
    }
  }
  public introPlayerCompleted() {
    return (
      this.playerBaseStartX <= this.playerBaseEndX &&
      this.playerStartX <= this.playerEndX
    );
  }

  public introOpponentCompleted() {
    return (
      this.opponentBaseStartX >= this.opponentBaseEndX &&
      this.opponentStartX >= this.opponentEndX
    );
  }

  public opponentPartyBallsCompleted() {
    return this.opponentPartyBallStartX[0] >= this.opponentPartyBallEndX;
  }

  public playerPartyBallsCompleted() {
    return this.playerPartyBallStartX[0] <= this.playerPartyBallEndX;
  }

  public opponentImageFaded() {
    return this.opponentImage.alpha <= 0;
  }

  public playerImageFaded() {
    return this.playerImage.alpha <= 0;
  }
}
