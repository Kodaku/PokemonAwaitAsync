import Phaser from 'phaser';

import Game from './scenes/Game';
import Login from './scenes/Login';
import 'regenerator-runtime/runtime';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Login],
};

export default new Phaser.Game(config);
