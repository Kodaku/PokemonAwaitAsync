import Phaser from 'phaser';
import { characters, itemsIndexes } from '~/constants/Constants';
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
  }

  create() {
    this.scene.start('battle-preloader');
  }
}
