import Phaser from 'phaser';
import BattleMemberSwitch from '../battle_member_switch/BattleMemberSwitch';
import BattleMenu from '../battle_menu/BattleMenu';
import axios from 'axios';
import { url } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';
import BattlePartyMenuGraphicsManager from './BattlePartyMenuGraphicsManager';
import { IncreaseItem, Item, Pokemon, TeamMember } from '~/types/myTypes';
import { createIconAnims } from '~/scenes/animations/iconAnims';
import { getPokemons, getTeamPromise } from '~/promises/pokemonPromises';
import { getIncreaseHealthItem } from '~/promises/itemsDatabasePromises';
import BattleBackground, {
  BackgroundState,
} from '../battle_background/BattleBackground';

export enum BattlePartyState {
  SWITCH,
  SWITCH_FAINTED,
  CURE_HEALTH,
  CURE_STATUS,
  POKE_BALL_STATUS,
  INCREASE_STATS_STATUS,
}

const notifyHealthUpperScreen = (
  increaseAmount: number,
  pokemonIndex: number,
  id: number
) => {
  console.log('sending promise');
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(
        `${url}/real-time/notify-upper/increase-health/${increaseAmount}/${pokemonIndex}/${id}`
      )
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyCureUpperScreen = (id: number) => {
  console.log('sending cure promise');
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/cure/${'NONE'}/${id}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyStatsUpperScreen = (id: number) => {
  console.log('sending cure promise');
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/stats/${'NONE'}/${id}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyPokeBallUpperScreen = (id: number) => {
  console.log('sending cure promise');
  return new Promise((resolve: (value: string) => void) => {
    axios
      .get(`${url}/real-time/notify-upper/poke-ball/${'NONE'}/${id}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const notifyOpponentChoice = (
  choiceType: string,
  pokemonIndex: number,
  amount: number,
  velocity: number,
  id: number
) => {
  const data = `${choiceType},${velocity},${pokemonIndex},${amount}`;
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/battle/notify-choice-upper/${id}/${data}`)
      .then((response) => {
        console.log('Successfully sent');
        console.log(response.data);
        resolve('success');
      });
  });
};

const getPokemonHealthPromise = (id: number, index: number) => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/health/get-one/${id}/${index}`).then((response) => {
      console.log(response.data);
      resolve(parseInt(response.data.data));
    });
  });
};

export default class BattlePartyMenu extends Phaser.Scene {
  private cursor!: number;
  private keyCode!: number;
  private bPressedCount!: number;
  private panels: Phaser.GameObjects.Image[] = [];
  private selectors: Phaser.GameObjects.Image[] = [];
  private hpRects: Phaser.GameObjects.Rectangle[] = [];
  private hpTexts: Phaser.GameObjects.Text[] = [];
  private currentHealths: number[] = [];
  private maxHpRextWidth!: number;
  private state!: BattlePartyState;
  private timeout!: number;
  private timeoutCount: number = 0;
  private zPressed: boolean = false;
  private pokemons: Pokemon[] = [];
  private userID!: number;
  private teamMembers: TeamMember[] = [];
  private item!: Item;
  constructor() {
    super('battle-party-menu');
  }

  async create(data: {
    sceneToRemove: string;
    bPressedCount: number;
    state: BattlePartyState;
    userID: number;
    item?: Item;
  }) {
    this.scene.remove(data.sceneToRemove);
    this.bPressedCount = data.bPressedCount;
    this.state = data.state;
    this.userID = data.userID;
    if (data.item) {
      this.item = data.item;
    }
    this.teamMembers = await getTeamPromise(this.userID);
    this.pokemons = await getPokemons(this.teamMembers);
    //TODO: Get healths
    for (let i = 0; i < this.pokemons.length; i++) {
      this.pokemons[i].ps = await getPokemonHealthPromise(this.userID, i);
    }
    this.cursor = -1;
    for (let i = 0; i < this.pokemons.length; i++) {
      createIconAnims(this.anims, this.pokemons[i].pokedexNumber);
    }
    const menuSelectSound = this.sound.add("menu-select-sound");
    const menuChooseSound = this.sound.add("menu-choose-sound");
    const menuCancel = this.sound.add("cancel-sound");
    const graphicsManager = new BattlePartyMenuGraphicsManager(this);
    const bg = graphicsManager.createBackground();
    let boxX = 0;
    let boxY = screen.height * 0.0169270833;
    for (let i = 0; i < 6; i++) {
      //Party member box and selector
      const partyMemberBox = graphicsManager.createPartyMemberBox(boxX, boxY);
      const partyMemberBoxSelector = graphicsManager.createPartyMemberBoxSelector(
        boxX,
        boxY,
        partyMemberBox
      );
      this.panels.push(partyMemberBox);
      this.selectors.push(partyMemberBoxSelector);
      // Member text
      graphicsManager.createMemberText(boxX, boxY, this.pokemons[i]);
      // Party Member Sprite
      const partyMemberSprite = graphicsManager.createPartyMemberSprite(
        boxX,
        boxY
      );
      partyMemberSprite.anims.play(
        `icon${this.pokemons[i].pokedexNumber}-move`
      );
      // Hp Bar
      const hpBar = graphicsManager.createHpBar(boxX, boxY);
      const currentHealth = this.pokemons[i].ps;
      const maxWidth = hpBar.width / 1.35;
      this.maxHpRextWidth = maxWidth;
      const hpRect = graphicsManager.createHpRect(
        boxX,
        boxY,
        currentHealth,
        hpBar,
        maxWidth,
        this.pokemons[i]
      );
      const hpText = graphicsManager.createHpText(
        boxX,
        boxY,
        this.pokemons[i],
        i
      );
      this.hpRects.push(hpRect);
      this.hpTexts.push(hpText);
      this.currentHealths.push(currentHealth);

      boxX += partyMemberBox.width;
      if (boxX + screen.width * 0.0146412884 > (this.game.config.width as number)) {
        boxX = 0;
        boxY += partyMemberBox.height + screen.width * 0.0065104167;
      }
    }
    //Back image
    const backImage = graphicsManager.createBackImage();
    //TODO: Keyboard input
    this.input.keyboard.on(
      'keydown-R',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.R;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-L',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.L;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-U',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.U;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-D',
      () => {
        menuSelectSound.play();
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.D;
        this.updateCursor();
        this.renderAll();
      },
      this
    );
    this.input.keyboard.on(
      'keydown-Z',
      () => {
        if (this.cursor !== -1) {
          menuChooseSound.play();
          switch (this.state) {
            case BattlePartyState.SWITCH: {
              if (this.pokemons[this.cursor].ps > 0) {
                this.switchOff();
                this.scene.add(
                  'battle-member-switch',
                  BattleMemberSwitch,
                  true,
                  {
                    sceneToRemove: 'battle-party-menu',
                    bPressedCount: 0,
                    state: BattlePartyState.SWITCH,
                    pokemons: this.pokemons,
                    inBattleIndex: this.cursor,
                    userID: this.userID,
                  }
                );
              }
              break;
            }
            case BattlePartyState.SWITCH_FAINTED: {
              if (this.pokemons[this.cursor].ps > 0) {
                this.switchOff();
                this.scene.add(
                  'battle-member-switch',
                  BattleMemberSwitch,
                  true,
                  {
                    sceneToRemove: 'battle-party-menu',
                    bPressedCount: 0,
                    state: BattlePartyState.SWITCH_FAINTED,
                    pokemons: this.pokemons,
                    inBattleIndex: this.cursor,
                    userID: this.userID,
                  }
                );
              }
              break;
            }
            case BattlePartyState.CURE_HEALTH: {
              sceneEvents.emit('notify-upper-screen-health');
              break;
            }
            case BattlePartyState.CURE_STATUS: {
              sceneEvents.emit('notify-upper-screen-cure');
              break;
            }
            case BattlePartyState.INCREASE_STATS_STATUS: {
              sceneEvents.emit('notify-upper-screen-stats');
              break;
            }
            case BattlePartyState.POKE_BALL_STATUS: {
              sceneEvents.emit('notify-upper-screen-poke-ball');
              break;
            }
          }
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-B',
      () => {
        this.keyCode = Phaser.Input.Keyboard.KeyCodes.B;
        this.bPressedCount++;
        if (this.bPressedCount > 0) {
          this.switchOff();
          menuCancel.play();
          this.scene.add('battle-menu', BattleMenu, true, {
            sceneToRemove: 'battle-party-menu',
            userID: this.userID,
          });
        }
      },
      this
    );
    sceneEvents.on(
      'notify-upper-screen-health',
      this.notifyUpperScreenForHealth,
      this
    );
    sceneEvents.on(
      'notify-upper-screen-cure',
      this.notifyUpperScreenForCure,
      this
    );
    sceneEvents.on(
      'notify-upper-screen-stats',
      this.notifyUpperScreenForStats,
      this
    );
    sceneEvents.on(
      'notify-upper-screen-poke-ball',
      this.notifyUpperScreenForPokeBall,
      this
    );

    sceneEvents.on('send-choice-to-opponent', this.sendChoiceToOpponent, this);
  }

  private renderAll(): void {
    for (let i = 0; i < this.panels.length; i++) {
      if (i == this.cursor) {
        this.selectors[i].visible = true;
      } else {
        this.selectors[i].visible = false;
      }
    }
  }

  private updateCursor(): void {
    switch (this.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.R: {
        this.cursor++;
        if (this.cursor >= this.panels.length) {
          this.cursor--;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.L: {
        this.cursor--;
        if (this.cursor < 0) {
          this.cursor = 0;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.U: {
        this.cursor -= 2;
        if (this.cursor < 0) {
          this.cursor += 2;
        }
        break;
      }
      case Phaser.Input.Keyboard.KeyCodes.D: {
        this.cursor += 2;
        if (this.cursor >= this.panels.length) {
          this.cursor -= 2;
        }
        break;
      }
    }
  }

  private switchOff() {
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-B');
    sceneEvents.off('notify-upper-screen-health');
    sceneEvents.off('notify-upper-screen-cure');
    sceneEvents.off('send-choice-to-opponent');
  }

  private computeRectWidth(
    currentHealth: number,
    maxHealth: number,
    maxRectWidth: number
  ) {
    let new_width = maxRectWidth * (currentHealth / maxHealth);
    if (new_width >= maxRectWidth) {
      new_width = maxRectWidth;
    }
    return new_width;
  }

  private increaseHealth() {
    this.currentHealths[this.cursor]++;
    if (this.currentHealths[this.cursor] >= this.pokemons[this.cursor].maxPs) {
      this.currentHealths[this.cursor] = this.pokemons[this.cursor].maxPs;
    }
    this.hpRects[this.cursor].width = this.computeRectWidth(
      this.currentHealths[this.cursor],
      this.pokemons[this.cursor].maxPs,
      this.maxHpRextWidth
    );
    this.hpRects[this.cursor].displayWidth = this.hpRects[this.cursor].width;
    this.hpTexts[this.cursor].setText(
      `${this.currentHealths[this.cursor]}/${this.pokemons[this.cursor].maxPs}`
    );
  }

  private async notifyUpperScreenForHealth() {
    console.log('Sending health notification');
    if (
      this.hpRects[this.cursor].width < this.maxHpRextWidth &&
      !this.zPressed
    ) {
      if (this.item) {
        const healthItem: IncreaseItem = await getIncreaseHealthItem(
          this.item.index,
          'down'
        );
        console.log(healthItem);
        console.log(healthItem.incrementAmount);
        const amount = this.convertToNumber(healthItem.incrementAmount);
        console.log(amount);
        this.zPressed = true;
        this.timeout = setInterval(() => {
          this.increaseHealth();
          this.timeoutCount++;
          if (this.timeoutCount >= parseInt(healthItem.incrementAmount)) {
            this.timeoutCount = 0;
            this.zPressed = false;
            clearInterval(this.timeout);
            sceneEvents.emit('send-choice-to-opponent', amount);
          }
        }, 50);
      } else {
        //TODO: Say that is not possible to increase the health
        console.log('Health is already at its maximum value');
      }
    }
  }

  private async sendChoiceToOpponent(amount: number) {
    await notifyHealthUpperScreen(amount, this.cursor, this.userID);
    await notifyOpponentChoice(
      'INCREASE-HEALTH',
      this.cursor,
      amount,
      999,
      this.userID
    );
    this.switchOff();
    this.scene.add('battle-background', BattleBackground, true, {
      sceneToRemove: 'battle-member-switch',
      userID: this.userID,
      state: BackgroundState.TURN_CHOICE,
    });
  }

  private async notifyUpperScreenForCure() {
    if (!this.zPressed) {
      await notifyCureUpperScreen(this.userID);
    }
  }

  private async notifyUpperScreenForStats() {
    if (!this.zPressed) {
      await notifyStatsUpperScreen(this.userID);
    }
  }

  private async notifyUpperScreenForPokeBall() {
    if (!this.zPressed) {
      await notifyPokeBallUpperScreen(this.userID);
    }
  }

  private convertToNumber(word: string) {
    let num = 0;
    for (let i = word.length - 1, j = 0; i >= 0; i--, j++) {
      switch (word[i]) {
        case '0':
          num += 0 * Math.pow(10, j);
          break;
        case '1':
          num += 1 * Math.pow(10, j);
          break;
        case '2':
          num += 2 * Math.pow(10, j);
          break;
        case '3':
          num += 3 * Math.pow(10, j);
          break;
        case '4':
          num += 4 * Math.pow(10, j);
          break;
        case '5':
          num += 5 * Math.pow(10, j);
          break;
        case '6':
          num += 6 * Math.pow(10, j);
          break;
        case '7':
          num += 7 * Math.pow(10, j);
          break;
        case '8':
          num += 8 * Math.pow(10, j);
          break;
        case '9':
          num += 9 * Math.pow(10, j);
          break;
      }
    }
    return num;
  }
}
