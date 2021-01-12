import Phaser from 'phaser';
import { pokedexNumbers } from '~/constants/Constants';
import Login from '~/scenes/Login';
import BattleScene from './battle_upper/BattleScene';

export default class BattlePreloader extends Phaser.Scene {
  constructor() {
    super('battle-preloader');
  }

  preload() {
    for (let i = 0; i <= 6; i++) {
      this.load.image(`battle-bg${i}`, `battle_background/battlebg${i}.png`);
    }

    for (let i = 0; i <= 6; i++) {
      this.load.image(`enemy-base${i}`, `battle_background/enemybase${i}.png`);
    }

    for (let i = 0; i <= 6; i++) {
      this.load.image(
        `player-base${i}`,
        `battle_background/playerbase${i}.png`
      );
    }

    this.load.image('battle-party-bar', 'battle_menu/battlepartybar.png');
    this.load.image('ball-normal', 'battle_menu/ballnormal.png');
    this.load.image('ball-fainted', 'battle_menu/ballfainted.png');
    this.load.image('ball-status', 'battle_menu/ballstatus.png');

    this.load.image(
      'throw-ball-nate',
      'characters/throw_ball/throw_ball_nate.png'
    );
    this.load.image(
      'throw-ball-rosa',
      'characters/throw_ball/throw_ball_rosa.png'
    );

    this.load.image('vs-nate', 'characters/vs/vs_nate.png');
    this.load.image('vs-rosa', 'characters/vs/vs_rosa.png');

    //POKE BALL ATLASES
    this.load.atlas(
      'master-ball',
      'poke_balls/master_ball/master_ball.png',
      'poke_balls/master_ball/master_ball_atlas.json'
    );
    this.load.atlas(
      'mega-ball',
      'poke_balls/mega_ball/mega_ball.png',
      'poke_balls/mega_ball/mega_ball_atlas.json'
    );
    this.load.atlas(
      'poke-ball',
      'poke_balls/poke_ball/poke_ball.png',
      'poke_balls/poke_ball/poke_ball_atlas.json'
    );
    this.load.atlas(
      'ultra-ball',
      'poke_balls/ultra_ball/ultra_ball.png',
      'poke_balls/ultra_ball/ultra_ball_atlas.json'
    );

    //BATTLERS BACK
    for (let i = 0; i < pokedexNumbers.length; i++) {
      const number = pokedexNumbers[i];
      this.load.atlas(
        `battler-back-${number}`,
        `battlers/back/back_${number}/back_${number}.png`,
        `battlers/back/back_${number}/back_${number}_atlas.json`
      );
    }

    //BATTLERS FRONT
    for (let i = 0; i < pokedexNumbers.length; i++) {
      const number = pokedexNumbers[i];
      this.load.atlas(
        `battler-front-${number}`,
        `battlers/front/front_${number}/front_${number}.png`,
        `battlers/front/front_${number}/front_${number}_atlas.json`
      );
    }

    this.load.image('enemy-life-bar', 'battle_menu/enemyBox.png');
    this.load.image('player-life-bar', 'battle_menu/playerBox.png');

    this.load.image('box', 'windowskins/text-box.png');
  }

  create() {
    this.scene.start('login');
  }
}
