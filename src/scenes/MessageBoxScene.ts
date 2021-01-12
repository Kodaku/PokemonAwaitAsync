import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import { knowOpponentPromise } from '~/promises/couplePromises';
import { Reference, User } from '~/types/myTypes';
import Box from '~/windowskins/Box';
import TextBox from '~/windowskins/TextBox';
import YesNoBox from '~/windowskins/YesNoBox';
import axios from 'axios';
import { url } from '~/constants/Constants';
import BattleMessageBox from '~/windowskins/BattleMessageBox';

const postMyReply = (myReply: string, coupleID: number) => {
  return new Promise((resolve: (res: string) => void) => {
    axios
      .post(`${url}/couples/replys/post/${coupleID}`, {
        reply: myReply,
      })
      .then((response) => {
        console.log(response.data);
        resolve('succeess');
      });
  });
};

const getAllReplys = (coupleID: number) => {
  return new Promise((resolve: (replys: string[]) => void) => {
    axios.get(`${url}/couples/all-replys/${coupleID}`).then((response) => {
      console.log(response.data);
      resolve(response.data.replys);
    });
  });
};

export default class MessageBoxScene {
  private box!: Box;
  private reference!: Reference;
  private createBattleBox: boolean = false;
  constructor(public scene: Phaser.Scene, public coupleID?: number) {}

  create() {
    sceneEvents.on('get-my-reply', this.postMyReply, this);
    sceneEvents.on('unknown-opponent', this.handleUnknownOpponent, this);
    sceneEvents.on('opponent-encounter', this.handleEncounter, this);
    sceneEvents.on('received-replys', this.handleReceivedReplys, this);
    sceneEvents.on('opening-lecture', this.handleOpeningLecture, this);
  }

  createBattleMessage() {
    sceneEvents.on('show-battle-text', this.handleBattleText, this);
  }

  public turnOff() {
    sceneEvents.off('get-my-reply');
    sceneEvents.off('unknown-opponent');
    sceneEvents.off('opponent-encounter');
    sceneEvents.off('received-replys');
    sceneEvents.off('opening-lecture');
    sceneEvents.off('show-battle-text');
  }

  public displayText() {
    this.box.displayText();
  }

  private handleBattleText(text: string) {
    if (!this.createBattleBox) {
      this.box = new BattleMessageBox(this.scene);
      this.createBattleBox = true;
    }
    this.box.setSentence(text);
    sceneEvents.emit('display-text');
  }

  private handleOpeningLecture(lecture: string, reference: Reference) {
    this.box = new TextBox(this.scene, reference);
    this.box.setSentence(lecture);
    sceneEvents.emit('display-text');
  }

  private async postMyReply(myReply: string, reference: Reference) {
    if (this.coupleID || this.coupleID === 0) {
      console.log(this.coupleID);
      await postMyReply(myReply, this.coupleID);
      this.reference = reference;
    }
  }

  private async handleReceivedReplys() {
    if (this.coupleID || this.coupleID === 0) {
      const replys: string[] = await getAllReplys(this.coupleID);
      console.log(replys);
      if (replys[0] === 'YES' && replys[1] === 'YES') {
        this.turnOff();
        sceneEvents.emit('battle-start-from-game');
      } else if (replys[0] === 'NO' || replys[1] === 'NO') {
        this.box = new TextBox(this.scene, this.reference);
        this.box.setSentence(
          'You or your opponent can fight whenever you want'
        );
        sceneEvents.emit('display-text');
      }
    }
  }

  private handleEncounter(reference: Reference, opponentName: string) {
    this.box = new YesNoBox(this.scene, reference);
    this.box.setSentence(
      `You have encountered your opponent ${opponentName}. Do you want to fight?`
    );
    sceneEvents.emit('display-text');
  }

  private async handleUnknownOpponent(reference: Reference, opponent: User) {
    this.box = new TextBox(this.scene, reference);
    this.box.setSentence(
      `Your opponent is ${opponent.userName} with the sprite of ${opponent.userCharacter}`
    );
    sceneEvents.emit('display-text');
    await knowOpponentPromise(opponent.userID);
  }
}
