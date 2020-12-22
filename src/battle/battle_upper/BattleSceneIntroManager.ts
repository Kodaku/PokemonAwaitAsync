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
    this.playerEndX = 50;
    this.playerBaseStartX = this.playerStartX - 50;
    this.playerBaseEndX = 0;
    this.playerPartyBallEndX = 210;
  }

  public initializeOpponentPosition() {
    this.opponentStartX = 0;
    this.opponentEndX = 210;
    this.opponentBaseStartX = this.opponentStartX - 60;
    this.opponentBaseEndX = 150;
    this.opponentPartyBallEndX = 110;
  }

  public createIntroGraphics(
    battleGraphics: BattleSceneGraphics,
    bgNumber: number
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
    this.playerPokeBall = battleGraphics.createPlayerPokeBall();
    // poke ball avversario
    this.opponentPokeBall = battleGraphics.createOpponentPokeBall();
  }

  public getOpponentPokeBall() {
    return this.opponentPokeBall;
  }

  public getPlayerPokeBall() {
    return this.playerPokeBall;
  }
}
