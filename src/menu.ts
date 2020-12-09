import Phaser from 'phaser';
import BattleMenuPreloader from './battle/battle_down/BattleMenuPreloader';
import BagMenuDown from './menu_scenes/bag_menu/BagMenuDown';
import EmptyMenu from './menu_scenes/EmptyMenu';
import Menu from './menu_scenes/Menu';
import MenuPreloader from './menu_scenes/MenuPreloader';
import PartyMenu from './menu_scenes/party_menu/PartyMenu';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'menu-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: screen.width / 4,
    height: screen.height / 2.7,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [BattleMenuPreloader, MenuPreloader, EmptyMenu],
};

export default new Phaser.Game(config);
