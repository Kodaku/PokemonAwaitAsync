import Phaser from 'phaser';
import {
  itemsIndexes,
  pokedexNumbers,
  pokemon_types,
} from '~/constants/Constants';
import EmptyMenu from '~/menu_scenes/EmptyMenu';
// import BattleBackground from './battle_background/BattleBackground';
// import BattleBag from './battle_bag/BattleBag';
// import BattleItemDescription from './battle_item_description/BattleItemDescription';
// import BattleItemMenu from './battle_item_menu/BattleItemMenu';
// import BattleMemberSwitch from './battle_member_switch/BattleMemberSwitch';
// import BattleMenu from './battle_menu/BattleMenu';
// import BattleMoves from './battle_moves/BattleMoves';
// import BattlePartyMenu from './battle_party_menu/BattlePartyMenu';

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

    for (let i = 0; i < itemsIndexes.length; i++) {
      console.log(`item${itemsIndexes[i]}`);
      this.load.image(
        `item${itemsIndexes[i]}`,
        `items/item${itemsIndexes[i]}.png`
      );
    }
    for (let i = 0; i < pokedexNumbers.length; i++) {
      const number = pokedexNumbers[i];
      this.load.audio(`cry${number}-sound`, `music/Cries/${number}Cry.wav`);
    }
    this.load.audio('first-town-sound', `music/BGM/FirstTown.mp3`);
    this.load.audio('introduction-sound', `music/BGM/Introduction.mp3`);
    this.load.audio('vs-rival-sound', `music/BGM/VSRival.mp3`);
    this.load.audio(
      'victory-trainer-intro-sound',
      `music/ME/VictoryTrainter_Intro.wav`
    );
    this.load.audio('vs-rival-intro-sound', `music/ME/VSRival_Intro.mp3`);
    this.load.audio('bump-sound', `music/SE/bump.mp3`);
    this.load.audio('bag-sound', `music/SE/BW2BagSound.wav`);
    this.load.audio('battle-balls-sound', `music/SE/BW2BattleBalls.mp3`);
    this.load.audio('cancel-sound', `music/SE/BW2Cancel.wav`);
    this.load.audio('close-menu-sound', `music/SE/BW2CloseMenu.wav`);
    this.load.audio('menu-choose-sound', `music/SE/BW2MenuChoose.wav`);
    this.load.audio('menu-select-sound', `music/SE/BW2MenuSelect.wav`);
    this.load.audio('open-menu-sound', `music/SE/BW2OpenMenu.wav`);
    this.load.audio('menu-sound', `music/SE/menu.wav`);
    this.load.audio('normal-damage-sound', `music/SE/normaldamage.wav`);
    this.load.audio('not-very-damage-sound', `music/SE/notverydamage.wav`);
    this.load.audio('recall-sound', `music/SE/recall.wav`);
    this.load.audio('select-1-sound', `music/SE/SE_Select1.wav`);
    this.load.audio('select-2-sound', `music/SE/SE_Select2.wav`);
    this.load.audio('select-3-sound', `music/SE/SE_Select3.wav`);
    this.load.audio('super-damage-sound', `music/SE/superdamage.wav`);
    this.load.audio('throw-sound', `music/SE/throw.wav`);
  }

  create() {
    this.scene.start('menu-preloader');
  }
}
