import Phaser from 'phaser';
import { createCharacterAnims } from './animations/characterAnims';
import { characterLoader } from './loaders/charactersLoader';
import Map from './Map';
import '../characters/Player';
import Player from '../characters/Player';
import { User } from '~/types/myTypes';
import { DepthLevels } from '~/enums/depthLevels';
import { getPlayersNumber, getUserPromise } from '~/promises/getPromises';
import { postPosition } from '~/promises/postPromises';
import { characters } from '~/constants/Constants';

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private bridgeStairsLayer!: Phaser.Tilemaps.StaticTilemapLayer;
  private bridgeLayer!: Phaser.Tilemaps.StaticTilemapLayer;
  private onStairs!: boolean;
  private map!: Map;
  private player!: Player;
  private id!: number;
  private totalPlayers!: number;
  private user!: User;
  private players: Player[] = [];
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('alto_mare_img', 'alto_mare/alto_mare_extruded.png');
    this.load.tilemapTiledJSON('alto_mare', 'alto_mare/alto_mare.json');
    for (let i = 0; i < characters.length; i++) {
      characterLoader(this.load, characters[i]);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  async create(data: { id: number }) {
    this.id = data.id;
    this.game.scene.remove('login');
    this.totalPlayers = await getPlayersNumber();
    this.user = await getUserPromise(this.id);
    this.createCharactersAnims();
    this.createOpponents();
    this.createAll();
  }

  private createAll() {
    this.player = this.add.player(
      this.user.x,
      this.user.y,
      this.user.userCharacter,
      this.user.anim
    );

    this.player.setPlayerName(this.user.userName);
    console.log(this.players);

    this.map = new Map(this);

    this.map.makeMap();
    this.map.addColliders(this.player);

    //getting bridge and stairs level to make the player pass under them
    this.bridgeStairsLayer = this.map.findLayer('t_bridge_stairs');
    this.bridgeLayer = this.map.findLayer('t_bridges');
    this.map.switchTopColliders(false);

    this.cameras.main.startFollow(this.player);

    setInterval(postPosition, 150, [this.user, this.id]);
    for (let i = 0; i < this.totalPlayers; i++) {
      if (i != this.id) {
        let t = this as Game;
        setInterval(function () {
          getUserPromise(i).then((data) => {
            t.updateOpponent(data);
          });
        }, 150);
      }
    }
  }

  private createCharactersAnims() {
    for (let i = 0; i < characters.length; i++) {
      createCharacterAnims(this.anims, characters[i]);
    }
  }

  private async createOpponents() {
    for (let i = 0; i < this.totalPlayers; i++) {
      if (i != this.id) {
        const userOpponent = await getUserPromise(i);
        console.log(userOpponent);
        const spriteOpponent = this.add.player(
          userOpponent.x,
          userOpponent.y,
          userOpponent.userCharacter,
          userOpponent.anim
        );
        spriteOpponent.setDepth(DepthLevels.CHARACTERS_LEVEL);
        this.players.push(spriteOpponent);
      } else {
        this.players.push(this.player);
      }
    }
  }

  update() {
    if (!this.player || !this.cursors || !this.players) {
      return;
    }

    this.player.update(this.cursors);

    for (let i = 0; i < this.players.length; i++) {
      if (i != this.id) {
        const opponent = this.players[i];
        opponent.anims.play(opponent.playerAnim, true);
      }
    }

    if (
      this.bridgeStairsLayer.getTileAtWorldXY(
        this.player.body.x,
        this.player.body.y
      ) != null
    ) {
      this.onStairs = true;
    } else if (
      this.bridgeLayer.getTileAtWorldXY(
        this.player.body.x,
        this.player.body.y
      ) != null &&
      this.onStairs
    ) {
    } else {
      this.onStairs = false;
    }

    if (this.onStairs) {
      this.player.setDepth(DepthLevels.OMNISCENT);
      this.map.switchBottomColliders(false);
      this.map.switchTopColliders(true);
    } else {
      this.player.setDepth(DepthLevels.CHARACTERS_LEVEL);
      this.map.switchBottomColliders(true);
      this.map.switchTopColliders(false);
    }
    this.updateUser();
  }

  private updateUser(): void {
    this.user.x = this.player.body.x;
    this.user.y = this.player.body.y;
    this.user.anim = this.player.getPlayerAnim();
    this.user.velocity = this.player.getVelocity();
  }

  private updateOpponent(userOpponent: User): void {
    let opponent = this.players[userOpponent.userID];
    opponent.playerAnim = userOpponent.anim;
    opponent.x = userOpponent.x + 15;
    opponent.y = userOpponent.y + 15;
    opponent.velocity = userOpponent.velocity;
  }
}
