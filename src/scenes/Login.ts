import Phaser from 'phaser';
import axios from 'axios';
import { lecture, url } from '../constants/Constants';
import { Reference, User } from '~/types/myTypes';
import MessageBoxScene from './MessageBoxScene';
import { sceneEvents } from '~/events/EventCenter';

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

const createUserPromise = (id: number, userName: string) => {
  return new Promise((resolve: (user: User) => void) => {
    axios.get(`${url}/create/${id}/${userName}`).then((response) => {
      console.log('Created');
      console.log(response.data);
      resolve(response.data.user);
    });
  });
};

export default class Login extends Phaser.Scene {
  private sse!: EventSource;
  private loginBox!: MessageBoxScene;
  private displayingText: boolean = false;
  private background!: Phaser.GameObjects.Image;
  private profImage!: Phaser.GameObjects.Image;
  private id!: number;
  private allReady: boolean = false;
  private userName: string;
  private user!: User;
  constructor() {
    super('login');
    this.userName = getName();
  }

  preload() {
    this.sse = new EventSource(`${url}/wait-players`);
  }

  async create() {
    this.id = await getIDPromise(this.userName);
    this.sse.addEventListener('message', (ev) => {
      this.sse.close();
      this.allReady = true;
      sceneEvents.emit('change-scene');
    });
    this.loginBox = new MessageBoxScene(this);
    this.loginBox.create();
    this.background = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.setBackground();
    this.profImage = this.add.image(0, 0, 'prof_image').setOrigin(0, 0);
    this.setProfImage();
    this.setEvents();
    sceneEvents.emit('opening-lecture', lecture, this.makeReference());
    if (this.id === 0) {
      this.sound.play('introduction-sound');
    }
  }

  private setEvents() {
    sceneEvents.on(
      'display-text',
      () => {
        this.displayingText = true;
      },
      this
    );
    sceneEvents.on('end-text', () => {
      this.displayingText = false;
      sceneEvents.emit('change-scene');
    });

    sceneEvents.on('change-scene', this.handleChangeScene, this);
  }

  private async handleChangeScene() {
    if (!this.user) {
      this.user = await createUserPromise(this.id, this.userName);
    }
    if (this.allReady && !this.displayingText) {
      sceneEvents.off('display-text');
      sceneEvents.off('end-text');
      this.loginBox.turnOff();
      this.sound.stopAll();
      this.scene.start('couples', { user: this.user });
    }
  }

  private setBackground() {
    this.background.width = screen.width / 4;
    this.background.height = screen.height / 2.7;
    this.background.displayWidth = this.background.width;
    this.background.displayHeight = this.background.height;
  }

  private setProfImage() {
    this.profImage.x = this.background.width / 2.6269230769;
    this.profImage.y = this.background.height / 28.9;
    this.profImage.displayHeight = this.background.height / 1.445;
    this.profImage.displayWidth = this.background.width / 4.26875;
    this.profImage.width = this.background.width / 4.26875;
    this.profImage.height = this.background.height / 1.445;
  }

  update() {
    if (this.displayingText) {
      this.loginBox.displayText();
      return;
    }
  }

  private makeReference(): Reference {
    return {
      x: this.profImage.x,
      y: this.profImage.y - 150,
      width: this.profImage.width,
      height: this.profImage.height,
      referenceName: 'Prof',
    };
  }
}
