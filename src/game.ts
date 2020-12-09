import Phaser from 'phaser';

import Game from './scenes/Game';
import Login from './scenes/Login';
import 'regenerator-runtime/runtime';
import MessageBoxScene from './scenes/MessageBoxScene';
import Couples from './scenes/Couples';
import { Preloader } from './scenes/Preloader';
import BagMenuUp from './menu_scenes/bag_menu/BagMenuUp';
import PartyMenuUp from './menu_scenes/party_menu/PartyMenuUp';
import BattlePreloader from './battle/BattlePreloader';

console.log(window.innerHeight, window.innerWidth);

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: screen.width / 4,
    height: screen.height / 2.7,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BattlePreloader, Preloader, Login, Couples, Game, MessageBoxScene],
};

export default new Phaser.Game(config);
