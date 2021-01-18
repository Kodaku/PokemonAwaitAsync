import Phaser from 'phaser';
import axios from 'axios';
import { url } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';
import Menu from './Menu';
import BattleMenu from '~/battle/battle_down/battle_menu/BattleMenu';
import BattleBackground, {
  BackgroundState,
} from '~/battle/battle_down/battle_background/BattleBackground';

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

const getReplyFromUser = (id: number) => {
  return new Promise((resolve: (value: string) => void) => {
    axios.get(`${url}/players/notify/delayed/${id}`).then((response) => {
      const data = response.data;
      console.log(data.message);
      resolve(data.message);
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
    console.log('Screen dimension', screen.width, screen.height);
    console.log(data);
    this.scene.remove(data.sceneName);
    this.id = await getIDPromise(this.userName);
    this.background = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.setBackgroundSize();
    this.input.keyboard.on('keydown-S', () => {
      sceneEvents.emit('S-pressed');
    });
    this.input.keyboard.on('keydown-A', () => {
      sceneEvents.emit('A-pressed');
    });
    sceneEvents.on('S-pressed', this.displayMenu, this);
    sceneEvents.on('A-pressed', this.tryLaunchBattle, this);
  }

  private displayMenu() {
    this.switchOff();
    this.scene.add('menu', Menu, true, {
      id: this.id,
      sceneName: 'empty-menu',
    });
  }

  private switchOff() {
    this.input.keyboard.off('keydown-S');
    this.input.keyboard.off('keydown-A');
    sceneEvents.off('S-pressed');
    sceneEvents.off('A-pressed');
  }

  private tryLaunchBattle() {
    this.createSSE();
  }

  private async createSSE() {
    const sse = new EventSource(`${url}/players/notify/delayed/${this.id}`);
    sse.addEventListener('message', (ev) => {
      console.log(ev.data);
      const message = ev.data;
      sse.close();
      if (message === 'SWITCH') {
        this.switchOff();
        console.log('Switching ', ev.data);
        this.scene.add('battle-background', BattleBackground, true, {
          sceneToRemove: 'empty-menu',
          userID: this.id,
          state: BackgroundState.INTRO,
        });
      } else {
        console.log('Nothing special from the server: from EmptyMenu');
      }
    });
    // let reply = '';
    // while (reply === '') {
    //   reply = await getReplyFromUser(this.id);
    // }
    // if (reply === 'SWITCH') {
    //   this.switchOff();
    //   console.log('Switching');
    //   this.scene.add('battle-menu', BattleMenu, true, {
    //     sceneToRemove: 'empty-menu',
    //   });
    // } else {
    //   console.log('Nothing special from the server: from EmptyMenu');
    // }
  }

  private setBackgroundSize() {
    this.background.width = screen.width / 4;
    this.background.height = screen.height / 2.7;
    this.background.displayHeight = this.background.height;
    this.background.displayWidth = this.background.width;
  }

  update() {}
}
