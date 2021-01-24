import Phaser from 'phaser';
import {
  characters,
  itemsIndexes,
  pokedexNumbers,
} from '~/constants/Constants';
import { characterLoader } from './loaders/charactersLoader';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('bg', 'windowskins/presentation_bg.png');
    this.load.image('prof_image', 'windowskins/introProf.png');
    this.load.image('alto_mare_img', 'alto_mare/alto_mare_extruded.png');
    this.load.tilemapTiledJSON('alto_mare', 'alto_mare/alto_mare.json');
    for (let i = 0; i < characters.length; i++) {
      characterLoader(this.load, characters[i]);
    }
    this.load.image('box', 'windowskins/text-box.png');
    this.load.image('yes-no-box', 'windowskins/text-box.png');
    this.load.image('pause-img', 'windowskins/pause_1.png');
    this.load.atlas(
      'pause',
      'windowskins/pause.png',
      'windowskins/pause_atlas.json'
    );
    this.load.image('pikachu-start', 'couples/pikachu_run_0.png');
    this.load.atlas(
      'pikachu-run',
      'couples/pikachu_run.png',
      'couples/pikachu_run_atlas.json'
    );

    this.load.image('bg-up-m', 'bag/background/bagbgup.png');
    this.load.image('bg-up-f', 'bag/background/bagbgupf.png');
    this.load.image('bg-item-m', 'bag/background/bagbgupitem.png');
    this.load.image('bg-item-f', 'bag/background/bagbgupitemf.png');

    this.load.image('party-bg', 'party/partybg.png');

    //Bag up images
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
    this.load.audio('first-town-sound', `music/BGM/First Town.mp3`);
    this.load.audio('introduction-sound', `music/BGM/Introduction.mp3`);
    this.load.audio('vs-rival-sound', `music/BGM/VSRival.mp3`);
    this.load.audio(
      'victory-trainer-intro-sound',
      `music/ME/VictoryTrainer_Intro.wav`
    );
    this.load.audio("victory-trainer-sound", "music/ME/VictoryTrainer.mp3");
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
    this.scene.start('battle-preloader');
  }
}
