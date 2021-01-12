import Phaser from 'phaser';
import axios from 'axios';
import { url } from '../constants/Constants';
import { User } from '~/types/myTypes';
import { createPikachuAnims } from './animations/pikachuAnims';
import Game from './Game';

const postUserPromise = (user: User) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/couples/post/${user.userID}`, {
        user: user,
      })
      .then((response) => {
        resolve('success');
      });
  });
};

export default class Couples extends Phaser.Scene {
  private sse!: EventSource;
  private user!: User;
  private pikachu!: Phaser.Physics.Arcade.Sprite;
  constructor() {
    super('couples');
  }

  preload() {
    this.sse = new EventSource(`${url}/couples/create`);
  }

  async create(data: { user: User }) {
    this.user = data.user;
    createPikachuAnims(this.anims);
    this.pikachu = this.physics.add
      .sprite(screen.width / 4.9672, screen.height / 6.144, 'pikachu-start')
      .setOrigin(0, 0);
    this.pikachu.width = screen.width / 22.76667;
    this.pikachu.height = this.pikachu.width / 1.6803278689;
    this.pikachu.displayWidth = this.pikachu.width;
    this.pikachu.displayHeight = this.pikachu.height;
    await postUserPromise(this.user);
    this.scene.remove('login');
    this.sse.addEventListener('message', (ev) => {
      this.sse.close();
      setTimeout(() => {
        // this.scene.remove('couples').start('game', { user: this.user });
        this.scene.add('game', Game, true, {
          user: this.user,
          sceneName: 'couples',
        });
      }, 3000);
    });
    this.add
      .text(
        screen.width / 136.6,
        screen.height / 5.908,
        'Creating Couples...',
        {
          color: '#ffffff',
          fontSize: screen.width / 62.091,
        }
      )
      .setOrigin(0, 0);
  }

  update() {
    this.pikachu.anims.play('pikachu-anim', true);
  }
}
