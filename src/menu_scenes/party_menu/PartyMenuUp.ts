import Phaser from 'phaser';
import { PartyMenuState } from '~/enums/depthLevels';
import { sceneEvents } from '~/events/EventCenter';
import { getPokemons, getTeamPromise } from '~/promises/pokemonPromises';
import Game from '~/scenes/Game';
import MessageBoxScene from '~/scenes/MessageBoxScene';
import { ItemToString, Pokemon, TeamMember, User } from '~/types/myTypes';

export default class PartyMenuUp extends Phaser.Scene {
  private user!: User;
  private state!: PartyMenuState;
  private keyPressed!: number;
  private cursorPosition: number = 0;
  private commandCursor: number = 0;
  private itemToGive!: ItemToString;
  private teamMembers: TeamMember[] = [];
  private pokemons: Pokemon[] = [];
  private bg!: Phaser.GameObjects.Image;
  private message!: MessageBoxScene;
  private switchIndex!: number;
  constructor() {
    super('party-menu-up');
  }

  preload() {}

  async create(data: {
    user: User;
    sceneName: string;
    state: PartyMenuState;
    itemToGive: ItemToString;
  }) {
    this.user = data.user;
    this.scene.remove(data.sceneName);
    this.state = data.state;
    this.itemToGive = data.itemToGive;
    this.message = new MessageBoxScene(this);
    this.message.create();
    this.teamMembers = await getTeamPromise(this.user.userID);
    this.pokemons = await getPokemons(this.teamMembers);
    this.bg = this.add.image(0, 0, 'party-bg').setOrigin(0, 0);
    this.bg.width = this.game.config.width as number;
    this.bg.height = this.game.config.height as number;
    this.bg.displayWidth = this.bg.width;
    this.bg.displayHeight = this.bg.height;

    sceneEvents.on(
      'end-text',
      () => {
        this.state = PartyMenuState.DISPLAY;
      },
      this
    );

    sceneEvents.on(
      'display-text',
      () => {
        this.state = PartyMenuState.DISPLAY_TEXT;
      },
      this
    );

    this.createInputKeyboard();
  }

  private createInputKeyboard() {
    this.createKeyboardZ();
    this.input.keyboard.on('keydown-B', () => {
      if (this.state === PartyMenuState.COMMAND) {
        this.state = PartyMenuState.DISPLAY;
      }
    });
    this.input.keyboard.on('keydown-R', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.R;
    });
    this.input.keyboard.on('keydown-L', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.L;
    });
    this.input.keyboard.on('keydown-U', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.U;
    });
    this.input.keyboard.on('keydown-D', () => {
      this.keyPressed = Phaser.Input.Keyboard.KeyCodes.D;
    });
    this.input.keyboard.on('keydown-X', () => {
      if (this.state == PartyMenuState.DISPLAY) {
        this.exitParty();
      }
    });
  }

  private createKeyboardZ() {
    this.input.keyboard.on('keydown-Z', () => {
      if (this.state === PartyMenuState.DISPLAY) {
        this.state = PartyMenuState.COMMAND;
      } else if (this.state === PartyMenuState.COMMAND) {
        switch (this.commandCursor) {
          case 0:
            this.switchIndex = this.cursorPosition;
            this.state = PartyMenuState.SWITCH;
            break;
          case 1:
            if (this.teamMembers[this.cursorPosition].itemHeld.index !== '') {
              sceneEvents.emit(
                'opening-lecture',
                `You have withdrawed ${
                  this.teamMembers[this.cursorPosition].itemHeld.index
                } from ${this.pokemons[this.cursorPosition].name}`,
                this.makeReference()
              );
              this.teamMembers[this.cursorPosition].itemHeld = {
                index: '',
                description: '',
                name: '',
              };
            } else {
              sceneEvents.emit(
                'opening-lecture',
                `${
                  this.pokemons[this.cursorPosition].name
                } has no item to withdraw`,
                this.makeReference()
              );
            }
            this.state = PartyMenuState.DISPLAY_TEXT;
            break;
          case 2:
            this.state = PartyMenuState.DISPLAY;
            break;
        }
      } else if (this.state === PartyMenuState.ASSIGN_ITEM) {
        if (this.teamMembers[this.cursorPosition].itemHeld.index !== '') {
          sceneEvents.emit(
            'opening-lecture',
            `You have switched item from ${
              this.teamMembers[this.cursorPosition].itemHeld.index
            } to ${this.itemToGive.name} to ${
              this.pokemons[this.cursorPosition].name
            }`,
            this.makeReference()
          );
        } else {
          sceneEvents.emit(
            'opening-lecture',
            `You have assigned ${this.itemToGive.name} to ${
              this.pokemons[this.cursorPosition].name
            }`,
            this.makeReference()
          );
        }
        this.teamMembers[this.cursorPosition].itemHeld = this.itemToGive;
      } else if (this.state === PartyMenuState.SWITCH) {
        //switching team members
        const tmp1 = this.teamMembers[this.switchIndex];
        this.teamMembers[this.switchIndex] = this.teamMembers[
          this.cursorPosition
        ];
        this.teamMembers[this.cursorPosition] = tmp1;
        //switching pokemons
        const tmp2 = this.pokemons[this.switchIndex];
        this.pokemons[this.switchIndex] = this.pokemons[this.cursorPosition];
        this.pokemons[this.cursorPosition] = tmp2;
        this.state = PartyMenuState.DISPLAY;
      }
    });
  }

  private exitParty() {
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-B');
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-X');
    this.message.turnOff();
    sceneEvents.off('end-text');
    sceneEvents.off('display-text');
    this.scene.add('game', Game, true, {
      user: this.user,
      sceneName: 'party-menu-up',
    });
  }

  update() {
    switch (this.state) {
      case PartyMenuState.DISPLAY:
      case PartyMenuState.ASSIGN_ITEM:
      case PartyMenuState.SWITCH: {
        this.displayParty();
        break;
      }
      case PartyMenuState.COMMAND: {
        this.displayCommand();
        break;
      }
      case PartyMenuState.DISPLAY_TEXT:
        this.message.displayText();
        break;
      case PartyMenuState.END:
        break;
    }
  }

  private displayParty() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.incrementCursorPosition(2, 6);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.decrementCursorPosition(2);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.R) {
      this.incrementCursorPosition(1, 6);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.L) {
      this.decrementCursorPosition(1);
      this.keyPressed = -3;
    }
  }

  private displayCommand() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.incrementCommandCursor(3);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.decrementCommandCursor();
      this.keyPressed = -3;
    }
  }

  public decrementCursorPosition(amount: number) {
    this.cursorPosition -= amount;
    if (this.cursorPosition < 0) {
      this.cursorPosition += amount;
    }
  }

  public incrementCursorPosition(amount: number, maxLength: number) {
    this.cursorPosition += amount;
    if (this.cursorPosition >= maxLength) {
      this.cursorPosition -= amount;
    }
  }

  public decrementCommandCursor() {
    this.commandCursor--;
    if (this.commandCursor < 0) {
      this.commandCursor++;
    }
  }

  public incrementCommandCursor(maxLength: number) {
    this.commandCursor++;
    if (this.commandCursor >= maxLength) {
      this.commandCursor--;
    }
  }

  private makeReference() {
    return {
      x: this.bg.x + (120 / 1366) * screen.width,
      y: this.bg.y + (150 / 768) * screen.height,
      width: (100 / 1366) * screen.width,
      height: (50 / 768) * screen.height,
      referenceName: 'Prof',
    };
  }
}
