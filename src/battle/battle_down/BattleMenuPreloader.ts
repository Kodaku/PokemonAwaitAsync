import Phaser from 'phaser';
import { pokemon_types } from '~/constants/Constants';
import BattleBackground from './BattleBackground';
import BattleBag from './BattleBag';
import BattleItemDescription from './BattleItemDescription';
import BattleItemMenu from './BattleItemMenu';
import BattleMemberSwitch from './BattleMemberSwitch';
import BattleMenu from './BattleMenu';
import BattleMoves from './BattleMoves';
import BattlePartyMenu from './BattlePartyMenu';

export default class BattleMenuPreloader extends Phaser.Scene {
  constructor() {
    super('battle-menu-preloader');
  }

  preload() {
    this.load.image('battle-bg', 'battle_menu/battleballbg.png');
    this.load.image('battle-menu-bg', 'battle_menu/bg.png');
    //OPTIONS
    this.load.image('bag-option', 'battle_menu/bag.png');
    this.load.image('fight-option', 'battle_menu/fight.png');
    this.load.image('pokemon-option', 'battle_menu/pokemon.png');
    this.load.image('run-option', 'battle_menu/run.png');
    //BATTLE BALLS
    this.load.image('battle-ball-empty', 'battle_menu/battleBallEmpty.png');
    this.load.image('battle-ball-fainted', 'battle_menu/battleBallFainted.png');
    this.load.image('battle-ball-normal', 'battle_menu/battleBallNormal.png');
    this.load.image('battle-ball-status', 'battle_menu/battleBallStatus.png');

    //BATTLE BAG
    this.load.image('battle-bag-bg', 'battle_menu/battlebagbg.png');
    this.load.image('battle-items', 'battle_menu/battleItems.png');
    this.load.image('hp-restore', 'battle_menu/hpRestore.png');
    this.load.image('poke-balls-menu', 'battle_menu/pokeBalls.png');
    this.load.image('status-restore', 'battle_menu/statusRestore.png');
    this.load.image('last-item-empty', 'battle_menu/lastItemEmpty.png');
    this.load.image('last-item-full', 'battle_menu/lastItemFull.png');
    this.load.image('item-info', 'battle_menu/iteminfo.png');
    this.load.image('menu-item-selected', 'battle_menu/menuItemSelected.png');
    this.load.image(
      'menu-item-unselected',
      'battle_menu/menuItemUnselected.png'
    );

    this.load.image('back-arrow', 'battle_menu/back.png');

    this.load.image('menu-info', 'battle_menu/menuinfo.png');
    this.load.image('left-arrow', 'battle_menu/arrowLeft.png');
    this.load.image('right-arrow', 'battle_menu/arrowRight.png');

    this.load.image('item-description', 'battle_menu/iteminfo.png');

    this.load.image('active-box', 'battle_menu/activeBox.png');
    this.load.image('inactive-box', 'battle_menu/inactiveBox.png');
    this.load.image('hp-bar', 'party/advHPbar.png');

    this.load.image('big-box', 'battle_menu/bigbox.png');

    for (let i = 0; i < pokemon_types.length; i++) {
      this.load.image(
        `move-${pokemon_types[i]}`,
        `battle_menu/move_${pokemon_types[i]}.png`
      );
      this.load.image(
        `${pokemon_types[i]}`,
        `battle_menu/${pokemon_types[i]}.png`
      );
    }
    this.load.image('battle-return', 'battle_menu/battlemenureturn.png');
    this.load.image('battle-moves-bg', 'battle_menu/battlemenu.png');

    this.load.image('selector', 'battle_menu/battleselector2.png');
  }

  create() {
    this.scene.add('battle-menu', BattleMenu, true, {
      sceneToRemove: 'battle-menu-preloader',
    });
  }
}
