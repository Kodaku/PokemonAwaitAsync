import Phaser from 'phaser';
import axios from 'axios';
import Game from './Game';

const url = 'http://localhost:3000';

const getIDPromise = () => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/players/id`).then((response) => {
      const data = response.data;
      const id = parseInt(data.id);
      console.log('User id: ' + id);
      resolve(id);
    });
  });
};

export default class Login extends Phaser.Scene {
  private sse!: EventSource;
  private number!: number;
  private id!: number;
  constructor() {
    super('login');
  }

  preload() {
    this.sse = new EventSource(`${url}/test`);
  }

  async create() {
    this.id = await getIDPromise();
    this.sse.addEventListener('message', (ev) => {
      this.number = ev.data;
      this.sse.close();
      console.log(this.number);
      this.game.scene.add('game', Game, true, { id: this.id });
    });
    this.add
      .text(100, 100, 'This is a temporary\n     Login Page', {
        color: '#ffffff',
        fontSize: 48,
      })
      .setOrigin(0, 0);
  }

  update() {}
}
