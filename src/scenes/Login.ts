import Phaser from 'phaser';
import axios from 'axios';
import Game from './Game';
import { url } from '../constants/Constants';

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
  return new Promise((resolve: () => void) => {
    axios.get(`${url}/create/${id}/${userName}`).then((response) => {
      console.log(response.data);
      resolve();
    });
  });
};

export default class Login extends Phaser.Scene {
  private sse!: EventSource;
  private number!: number;
  private id!: number;
  private userName: string;
  constructor() {
    super('login');
    this.userName = getName();
  }

  preload() {
    this.sse = new EventSource(`${url}/wait-players`);
  }

  async create() {
    this.id = await getIDPromise(this.userName);
    await createUserPromise(this.id, this.userName);
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
