import Phaser from 'phaser';
import { createCharacterAnims } from './animations/characterAnims';
import { debugDraw } from './utils/debug';
import { url } from '../constants/Constants';
import Map from './Map';
import '../characters/Player';
import Player from '../characters/Player';
import axios from 'axios';

enum DepthLevels {
  BOTTOM = 0,
  CHARACTERS_LEVEL = 1,
  MEDIUM = 2,
  TOP = 3,
  OMNISCENT = 4,
}

type Velocity = {
  vx: number;
  vy: number;
};

interface User {
  userName: string;
  userID: number;
  userCharacter: string;
  x: number;
  y: number;
  anim: string;
  velocity: Velocity;
}

const getUserPromise = (id: number) => {
  return new Promise((resolve: (value: User) => void) => {
    axios.get(`${url}/players/user${id}/move`).then((response) => {
      const user = response.data as User;
      console.log(user);
      resolve(user);
    });
  });
};

const postPosition = (player: User) => {
  if (player) {
    // console.log(player[0]);
    // console.log(player[0].userName);
    return new Promise((resolve: (ok: string) => void) => {
      axios
        .put(`${url}/players/user${player[1]}/move`, {
          userName: player[0].userName,
          userID: player[1],
          userCharacter: player[0].userCharacter,
          x: player[0].x,
          y: player[0].y,
          anim: player[0].anim,
          velocity: { vx: player[0].velocity.vx, vy: player[0].velocity.vy },
        })
        .then((response) => {
          // console.log(response.data);
          resolve('success');
        });
    });
  } else {
    return;
  }
};

const getPlayersNumber = () => {
  return new Promise((resolve: (total: number) => void) => {
    axios.get(`${url}/players/total`).then((response) => {
      const data = response.data;
      resolve(data.total);
    });
  });
};

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
    this.load.atlas(
      'nate',
      'characters/nate.png',
      'characters/nate_atlas.json'
    );

    this.load.atlas(
      'rosa',
      'characters/rosa.png',
      'characters/rosa_atlas.json'
    );
    this.load.atlas(
      'hilbert',
      'characters/hilbert.png',
      'characters/hilbert_atlas.json'
    );

    this.load.atlas(
      'hilda',
      'characters/hilda.png',
      'characters/hilda_atlas.json'
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  async create(data: { id: number }) {
    this.id = data.id;
    this.game.scene.remove('login');
    this.totalPlayers = await getPlayersNumber();
    this.user = await getUserPromise(this.id);
    createCharacterAnims(this.anims, 'nate');
    createCharacterAnims(this.anims, 'rosa');
    createCharacterAnims(this.anims, 'hilbert');
    createCharacterAnims(this.anims, 'hilda');
    for (let i = 0; i < this.totalPlayers; i++) {
      if (i != this.id) {
        console.log('Before await');
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

  updateOpponent(userOpponent: User): void {
    let opponent = this.players[userOpponent.userID];
    opponent.playerAnim = userOpponent.anim;
    opponent.x = userOpponent.x + 15;
    opponent.y = userOpponent.y + 15;
    opponent.velocity = userOpponent.velocity;
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
}
