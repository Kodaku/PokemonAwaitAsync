import Phaser from 'phaser';

import Game from './scenes/Game';
import Login from './scenes/Login';
import 'regenerator-runtime/runtime';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: (800 / 1366) * screen.width,
  height: (600 / 768) * screen.height,
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
