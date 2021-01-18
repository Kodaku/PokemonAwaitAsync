import Phaser from 'phaser';
import { createCharacterAnims } from './animations/characterAnims';
import { characterLoader } from './loaders/charactersLoader';
import Map from './Map';
import '../characters/Player';
import Player from '../characters/Player';
import { Couple, Reference, User } from '~/types/myTypes';
import {
  DepthLevels,
  IconSelectable,
  PartyMenuState,
} from '~/enums/depthLevels';
import {
  getPlayersNumber,
  getUserPromise,
  resetAllReplys,
} from '~/promises/getPromises';
import { postPosition } from '~/promises/postPromises';
import { characters, url } from '~/constants/Constants';
import Text from '~/windowskins/Text';
import { sceneEvents } from '../events/EventCenter';
import { getOpponentPromise } from '~/promises/couplePromises';
import MessageBoxScene from './MessageBoxScene';
import BagMenuUp from '~/menu_scenes/bag_menu/BagMenuUp';
import PartyMenuUp from '~/menu_scenes/party_menu/PartyMenuUp';
import BattleScene from '~/battle/battle_upper/BattleScene';
import axios from 'axios';

const notifyEmptyMenu = (id: number, message: string) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/players/notify-empty/${id}/${message}`)
      .then((response) => {
        console.log('Successfully sent to lower from game');
        console.log(response.data);
        resolve('success');
      });
  });
};

enum GameState {
  PLAY,
  MENU,
}

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
  private opponent!: User;
  private couple!: Couple;
  private coupleID!: number;
  private knowOpponent: boolean = false;
  private players: Player[] = [];
  private texts: Text[] = [];
  private messageBoxScene!: MessageBoxScene;
  private displayingText: boolean = false;
  private alreadyEncountered: boolean = false;
  private colliders: Phaser.Physics.Arcade.Collider[] = [];
  private gameState: GameState = GameState.PLAY;
  private menuCursor: number = 0;
  private positionInterval!: number;
  private playersPositionIntervals: number[] = [];
  private battleInterval!: number;
  private townSound!: Phaser.Sound.BaseSound;
  private rect!: Phaser.GameObjects.Rectangle;
  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  async create(data: { user: User; sceneName: string }) {
    this.user = data.user;
    // console.log(this.user);
    this.townSound = this.sound.add('first-town-sound');
    const bump = this.sound.add('bump-sound');
    this.id = this.user.userID;
    this.scene.remove(data.sceneName);
    this.couple = await getOpponentPromise(this.id);
    console.log(this.couple);
    this.opponent = this.couple.opponent;
    this.coupleID = this.couple.coupleID;
    this.knowOpponent = this.couple.knowOpponent;
    if (this.user.userID === 0) {
      this.townSound.play();
      this.townSound.on('complete', () => {
        this.townSound.play();
      });
    }
    sceneEvents.on(
      'display-text',
      () => {
        this.displayingText = true;
      },
      this
    );

    sceneEvents.on(
      'end-text',
      () => {
        this.displayingText = false;
      },
      this
    );
    sceneEvents.on('S-pressed-play', this.requireMenu, this);
    sceneEvents.on('battle-start-from-game', this.notifyBattleBegin, this);
    //make sense to pass the coupleID to the MessageBoxScene because it's important in order to wait for opponent's answers
    this.messageBoxScene = new MessageBoxScene(this, this.coupleID);
    this.messageBoxScene.create();
    this.totalPlayers = await getPlayersNumber();
    this.createCharactersAnims();
    this.player = this.add.player(
      this.user.x,
      this.user.y,
      this.user.userCharacter,
      this.user.anim
    );
    this.player.setBusy(false);
    this.player.setPlayerName(this.user.userName);
    this.player.setDepth(DepthLevels.CHARACTERS_LEVEL);

    await this.createOpponents();
    await this.createTexts();
    this.createAll(bump);
    this.input.keyboard.on('keydown-S', () => {
      if (this.gameState == GameState.PLAY) {
        this.gameState = GameState.MENU;
        this.player.setBusy(true);
        sceneEvents.emit('S-pressed-play');
      }
    });
    this.input.keyboard.on('keydown-R', () => {
      if (this.gameState == GameState.MENU) {
        this.menuCursor++;
        if (this.menuCursor >= 6) {
          this.menuCursor--;
        }
      }
    });
    this.input.keyboard.on('keydown-L', () => {
      if (this.gameState == GameState.MENU) {
        this.menuCursor--;
        if (this.menuCursor < 0) {
          this.menuCursor++;
        }
      }
    });
    this.input.keyboard.on('keydown-U', () => {
      if (this.gameState == GameState.MENU) {
        this.menuCursor -= 2;
        if (this.menuCursor < 0) {
          this.menuCursor += 2;
        }
      }
    });
    this.input.keyboard.on('keydown-D', () => {
      if (this.gameState == GameState.MENU) {
        this.menuCursor += 2;
        if (this.menuCursor >= 6) {
          this.menuCursor -= 2;
        }
      }
    });
    this.input.keyboard.on('keydown-Z', () => {
      if (this.gameState == GameState.MENU) {
        switch (this.menuCursor) {
          case IconSelectable.POKEMON: {
            this.removeEventsAndClearIntervals();
            this.scene.add('party-menu-up', PartyMenuUp, true, {
              user: this.user,
              sceneName: 'game',
              state: PartyMenuState.DISPLAY,
            });
            break;
          }
          case IconSelectable.BAG: {
            this.removeEventsAndClearIntervals();
            this.scene.add('bag-menu-up', BagMenuUp, true, {
              user: this.user,
              sceneName: 'game',
            });
            break;
          }
        }
      }
    });
  }

  private removeEventsAndClearIntervals() {
    sceneEvents.off('display-text');
    sceneEvents.off('end-text');
    sceneEvents.off('S-pressed-play');
    sceneEvents.off('X-pressed-menu');
    sceneEvents.off('battle-start-from-game');
    this.messageBoxScene.turnOff();
    this.input.keyboard.off('keydown-S');
    this.input.keyboard.off('keydown-X');
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-Z');
    clearInterval(this.battleInterval);
    clearInterval(this.positionInterval);
    this.playersPositionIntervals.forEach((interval) => {
      clearInterval(interval);
    });
  }

  private async notifyBattleBegin() {
    this.gameState = GameState.MENU;
    this.townSound.stop();
    if (this.user.userID === 0) {
      const rivalIntro = this.sound.add('vs-rival-intro-sound');
      const rivalMusic = this.sound.add('vs-rival-sound');
      rivalIntro.on('complete', () => {
        rivalMusic.play();
      });
      rivalMusic.on('complete', () => {
        rivalMusic.play();
      });
      rivalIntro.play();
    }
    await notifyEmptyMenu(this.user.userID, 'SWITCH');
    this.removeEventsAndClearIntervals();
    let count = 0;
    this.rect = this.add
      .rectangle(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        0x000000
      )
      .setOrigin(0, 0);
    this.rect.setDepth(5);
    let isFading = true;
    const fadeInterval = setInterval(() => {
      this.rect.setDepth(5);
      if (isFading) {
        this.rect.alpha -= 0.1;
        if (this.rect.alpha <= 0) {
          isFading = false;
          count++;
        }
      }
    }, 35);
    const refadeInterval = setInterval(() => {
      this.rect.setDepth(5);
      if (!isFading) {
        this.rect.alpha += 0.1;
        if (this.rect.alpha >= 1) {
          isFading = true;
          count++;
          if (count >= 4) {
            this.beginUpperBattle();
            clearInterval(fadeInterval);
            clearInterval(refadeInterval);
          }
        }
      }
    }, 35);
  }

  private beginUpperBattle() {
    this.scene.add('battle-scene', BattleScene, true, {
      sceneToRemove: 'game',
      user: this.user,
      opponent: this.opponent,
    });
  }

  private requireMenu() {
    this.user.busy = true;
  }

  private async createAll(bump: Phaser.Sound.BaseSound) {
    this.map = new Map(this);

    this.map.makeMap();
    this.map.addColliders(this.players, bump);

    //getting bridge and stairs level to make the player pass under them
    this.bridgeStairsLayer = this.map.findLayer('t_bridge_stairs');
    this.bridgeLayer = this.map.findLayer('t_bridges');
    this.map.switchTopColliders(false);

    this.cameras.main.startFollow(this.player);

    this.positionInterval = setInterval(postPosition, 150, [
      this.user,
      this.id,
    ]);
    for (let i = 0; i < this.totalPlayers; i++) {
      if (i != this.id) {
        let t = this as Game;
        this.playersPositionIntervals[i] = setInterval(function () {
          if (!t.displayingText) {
            getUserPromise(i).then((data) => {
              t.updateOpponent(data);
            });
          }
        }, 150);
      }
    }
    //every minute players can retry to battle each other
    this.battleInterval = setInterval(() => {
      if (!this.displayingText) {
        resetAllReplys(this.coupleID).then((data) => {
          this.alreadyEncountered = false;
          console.log(data);
        });
      }
    }, 60000);

    if (!this.knowOpponent) {
      sceneEvents.emit(
        'unknown-opponent',
        this.makeReference(this.player),
        this.opponent
      );
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
        const spriteOpponent = this.add.player(
          userOpponent.x,
          userOpponent.y,
          userOpponent.userCharacter,
          userOpponent.anim
        );
        spriteOpponent.setPlayerName(userOpponent.userName);
        spriteOpponent.setDepth(DepthLevels.CHARACTERS_LEVEL);
        this.colliders[i] = this.physics.add.collider(
          this.player,
          spriteOpponent,
          this.checkOpponent,
          undefined,
          this
        );
        this.colliders[i].overlapOnly = true;
        this.players.push(spriteOpponent);
      } else {
        this.players.push(this.player);
      }
    }
  }

  private checkOpponent(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    if (!this.alreadyEncountered) {
      this.alreadyEncountered = true;
      const player = obj1 as Player;
      const opponent = obj2 as Player;
      this.player.setVelocity(0, 0);
      opponent.setVelocity(0, 0);
      if (
        opponent.playerName === this.opponent.userName &&
        !this.opponent.busy
      ) {
        this.makeSSE();
        sceneEvents.emit(
          'opponent-encounter',
          this.makeReference(player),
          opponent.playerName
        );
      }
    }
  }

  private makeSSE() {
    const sse = new EventSource(`${url}/couples/replys/get/${this.coupleID}`);
    sse.addEventListener('message', (ev) => {
      console.log(ev.data);
      sse.close();
      sceneEvents.emit('received-replys');
    });
  }

  private makeReference(player: Player): Reference {
    const reference: Reference = {
      x: player.body.x,
      y: player.body.y,
      width: player.body.width,
      height: player.body.height,
      referenceName: player.playerKey,
    };

    return reference;
  }

  private async createTexts() {
    console.log(this.player);
    for (let i = 0; i < this.totalPlayers; i++) {
      this.texts[i] = new Text(
        this,
        this.players[i].playerName,
        0,
        -this.players[i].height
      );
      this.texts[i].setTextPosition(
        this.players[i].body.x,
        this.players[i].body.y
      );
    }
  }

  async update() {
    if (!this.player || !this.cursors || !this.players[0] || !this.texts[0]) {
      return;
    }
    if (this.gameState === GameState.PLAY) {
      this.texts[this.id].setTextPosition(this.player.x, this.player.y);

      if (this.displayingText) {
        this.messageBoxScene.displayText();
        return;
      }

      this.player.update(this.cursors);

      for (let i = 0; i < this.players.length; i++) {
        if (i != this.id) {
          const opponent = this.players[i];
          opponent.anims.play(opponent.playerAnim, true);
          opponent.setVelocity(opponent.velocity.vx, opponent.velocity.vy);
          this.texts[i].setTextPosition(opponent.x, opponent.y);
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
    } else if (this.gameState == GameState.MENU) {
    }
  }

  private updateUser(): void {
    this.user.x = this.player.body.x;
    this.user.y = this.player.body.y;
    this.user.anim = this.player.getPlayerAnim();
    this.user.velocity = this.player.getVelocity();
    this.user.busy = this.player.getBusy();
  }

  private updateOpponent(userOpponent: User): void {
    let opponent = this.players[userOpponent.userID];
    opponent.playerAnim = userOpponent.anim;
    opponent.x = userOpponent.x + 15;
    opponent.y = userOpponent.y + 15;
    opponent.velocity = userOpponent.velocity;
    this.opponent = userOpponent;
  }
}
