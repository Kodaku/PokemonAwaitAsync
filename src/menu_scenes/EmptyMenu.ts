import Phaser from 'phaser';
import axios from 'axios';
import { url } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';
import Menu from './Menu';

function getName(): string {
  let url = document.location.href;
  const param: string = url.split('?')[1].split('&')[0];
  const name = param.split('=')[1];
  return name;
}

const getIDPromise = (userName: string) => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/players/id/${userName}`).then((response) => {
      const data = response.data;
      const id = parseInt(data.id);
      console.log('User id: ' + id);
      resolve(id);
    });
  });
};

export default class EmptyMenu extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private userName: string;
  private id!: number;
  constructor() {
    super('empty-menu');
    this.userName = getName();
  }

  preload() {
    this.load.image('bg', 'windowskins/clockbg.png');
  }

  async create(data: { sceneName: string }) {
    console.log(data);
    this.scene.remove(data.sceneName);
    this.id = await getIDPromise(this.userName);
    this.background = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.setBackgroundSize();
    this.input.keyboard.on('keydown-S', () => {
      sceneEvents.emit('S-pressed');
    });
    sceneEvents.on('S-pressed', this.displayMenu, this);
  }

  private displayMenu() {
    this.input.keyboard.off('keydown-S');
    sceneEvents.off('S-pressed');
    this.scene.add('menu', Menu, true, {
      id: this.id,
      sceneName: 'empty-menu',
    });
  }

  private setBackgroundSize() {
    this.background.width = screen.width / 4;
    this.background.height = screen.height / 2.7;
    this.background.displayHeight = this.background.height;
    this.background.displayWidth = this.background.width;
  }

  update() {}
}
