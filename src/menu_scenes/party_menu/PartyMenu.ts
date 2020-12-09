import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import { createIconAnims } from '~/scenes/animations/iconAnims';
import BackgroundCreator from '../creators/BackgroundCreator';
import PartyCursorManager from '../creators/party_creators/PartyCursorManager';
import PartyEventManager from '../creators/party_creators/PartyEventManager';
import PartyGraphicManager from '../creators/party_creators/PartyGraphicManager';
import PartyRenderManager from '../creators/party_creators/PartyRenderManager';
import EmptyMenu from '../EmptyMenu';
import { getPokemons, getTeamPromise } from '~/promises/pokemonPromises';
import { ItemToString, TeamMember } from '~/types/myTypes';
import { PartyMenuState } from '~/enums/depthLevels';
import axios from 'axios';
import { url } from '~/constants/Constants';

const reduceItemQuantityPromise = (
  id: number,
  index: string,
  pokemonIndex: number
) => {
  return new Promise((resolve: () => void) => {
    axios
      .get(`${url}/players/items/${id}/${index}/${pokemonIndex}`)
      .then((response) => {
        resolve();
      });
  });
};

const switchRequestPromise = (
  id: number,
  fromIndex: number,
  toIndex: number
) => {
  return new Promise((resolve: () => void) => {
    axios
      .get(`${url}/players/switchpokemon/${id}/${fromIndex}/${toIndex}`)
      .then((response) => {
        console.log(response.data);
        resolve();
      });
  });
};

const increaseItemQuantityPromise = (
  id: number,
  index: string,
  pokemonIndex: number
) => {
  return new Promise((resolve: () => void) => {
    axios
      .get(`${url}/players/itemsincrease/${id}/${index}/${pokemonIndex}`)
      .then((response) => {
        resolve();
      });
  });
};

export default class PartyMenu extends Phaser.Scene {
  private state!: PartyMenuState;
  private backgroundCreator: BackgroundCreator = new BackgroundCreator();
  private curorsManager = new PartyCursorManager();
  private keyPressed!: number;
  private userID!: number;
  private eventsManager!: PartyEventManager;
  private teamMembers: TeamMember[] = [];
  private itemToGive!: ItemToString;
  private switchIndex!: number;
  constructor() {
    super('party-menu');
  }

  preload() {}

  async create(data: {
    userID: number;
    sceneName: string;
    state: PartyMenuState;
    itemToGive: ItemToString;
  }) {
    this.userID = data.userID;
    if (data.sceneName !== '') {
      this.scene.remove(data.sceneName);
    }
    this.state = data.state;
    this.itemToGive = data.itemToGive;
    const bg = this.backgroundCreator.createBackground(this, 'party-bg');
    const graphicsManager = new PartyGraphicManager(this);
    const renderManager = new PartyRenderManager();
    this.eventsManager = new PartyEventManager();
    let panelX = 3;
    let panelY = 40;
    for (let i = 0; i < 6; i++) {
      const panel = graphicsManager.createPanel(panelX, panelY, bg);
      const hpBar = graphicsManager.createHPBar(panelX, panelY, panel);
      graphicsManager.createLevelText(panelX, panelY, panel);
      panelX += panel.width;
      if (panelX >= bg.width) {
        panelX = 3;
        panelY += panel.height + 10;
      }
      const hpRect = graphicsManager.createHPRect(hpBar);
      renderManager.pushHpRect(hpRect);
      renderManager.pushHpMaxWidth(hpRect.width);
      renderManager.pushPanel(panel);
    }
    this.teamMembers = await getTeamPromise(this.userID);
    const pokemons = await getPokemons(this.teamMembers);
    const healths: number[] = [];
    for (let i = 0; i < pokemons.length; i++) {
      createIconAnims(this.anims, pokemons[i].pokedexNumber);
      healths[i] = pokemons[i].ps;
    }
    renderManager.setPokemons(pokemons);
    renderManager.setTotalHP(healths);
    const panels = renderManager.getPanels();
    panelX = 3;
    panelY = 40;
    for (let i = 0; i < 6; i++) {
      const pokemonIcon = graphicsManager.createIconSprite(
        panelX,
        panelY,
        i,
        this.teamMembers
      );
      graphicsManager.createPokemonNameText(
        panelX,
        panelY,
        panels[i],
        i,
        pokemons
      );
      renderManager.pushHealth(healths[i]);
      const hpText = graphicsManager.createHPText(
        panelX,
        panelY,
        panels[i],
        i,
        healths
      );
      panelX += panels[i].width;
      if (panelX >= bg.width) {
        panelX = 3;
        panelY += panels[i].height + 10;
      }
      renderManager.pushPokemonIcon(pokemonIcon);
      renderManager.pushHpText(hpText);
    }
    for (let i = 0, y = bg.height / 2 + 20; i < 3; i++, y += 30) {
      const commandUnsel = graphicsManager.createCommandUnsel(bg, y);
      const commandText = graphicsManager.createCommandText(commandUnsel, i);
      renderManager.pushCommandUnsel(commandUnsel);
      renderManager.pushCommandText(commandText);
    }
    this.eventsManager.createEvents(renderManager);
    sceneEvents.on('reduce-item-quantity', this.reduceItemQuantity, this);
    sceneEvents.on('increase-item-quantity', this.increaseItemQuantity, this);
    sceneEvents.on('switch-request', this.switchRequest, this);
    this.createInputKeyboard(bg);
    // this.setHPInterval();
  }

  private async switchRequest() {
    await switchRequestPromise(
      this.userID,
      this.switchIndex,
      this.curorsManager.getCursorPosition()
    );
  }

  private async reduceItemQuantity() {
    await reduceItemQuantityPromise(
      this.userID,
      this.itemToGive.index,
      this.curorsManager.getCursorPosition()
    );
  }

  private async increaseItemQuantity() {
    await increaseItemQuantityPromise(
      this.userID,
      this.teamMembers[this.curorsManager.getCursorPosition()].itemHeld.index,
      this.curorsManager.getCursorPosition()
    );
    this.teamMembers[this.curorsManager.getCursorPosition()].itemHeld = {
      index: '',
      description: '',
      name: '',
    };
    this.state = PartyMenuState.DISPLAY;
  }

  private createInputKeyboard(bg: Phaser.GameObjects.Image) {
    this.input.keyboard.on('keydown-Z', () => {
      if (this.state === PartyMenuState.DISPLAY) {
        this.state = PartyMenuState.COMMAND;
        sceneEvents.emit(
          'A-pressed-command',
          this,
          bg,
          this.curorsManager.getCursorPosition()
        );
      } else if (this.state === PartyMenuState.COMMAND) {
        switch (this.curorsManager.getCommandCursor()) {
          case 0:
            this.state = PartyMenuState.SWITCH;
            this.switchIndex = this.curorsManager.getCursorPosition();
            sceneEvents.emit(
              'B-pressed-command',
              this.curorsManager.getCursorPosition()
            );
            break;
          case 1:
            if (
              this.teamMembers[this.curorsManager.getCursorPosition()].itemHeld
                .index !== ''
            ) {
              sceneEvents.emit('increase-item-quantity');
            }
            sceneEvents.emit(
              'B-pressed-command',
              this.curorsManager.getCursorPosition()
            );
            this.state = PartyMenuState.WAIT_SECOND_A;
            break;
          case 2:
            this.state = PartyMenuState.DISPLAY;
            sceneEvents.emit(
              'B-pressed-command',
              this.curorsManager.getCursorPosition()
            );
            break;
        }
      } else if (this.state === PartyMenuState.ASSIGN_ITEM) {
        if (
          this.teamMembers[this.curorsManager.getCursorPosition()].itemHeld
            .index !== ''
        ) {
          sceneEvents.emit('increase-item-quantity');
        }
        this.teamMembers[
          this.curorsManager.getCursorPosition()
        ].itemHeld = this.itemToGive;
        sceneEvents.emit('reduce-item-quantity');
        this.state = PartyMenuState.WAIT_SECOND_A;
      } else if (this.state === PartyMenuState.SWITCH) {
        // const tmpMember = this.teamMembers[this.switchIndex];
        // this.teamMembers[this.switchIndex] = this.teamMembers[
        //   this.curorsManager.getCursorPosition()
        // ];
        // this.teamMembers[this.curorsManager.getCursorPosition()] = tmpMember;
        sceneEvents.emit('switch-request');
        // sceneEvents.emit(
        //   'switch-members',
        //   this.switchIndex,
        //   this.curorsManager.getCursorPosition()
        // );
        this.exitParty();
        this.scene.restart({
          userID: this.userID,
          sceneName: '',
          state: PartyMenuState.DISPLAY,
          itemToGive: {
            index: '',
            description: '',
            name: '',
          },
        });
        this.state = PartyMenuState.DISPLAY;
      }
    });
    this.input.keyboard.on('keydown-A', () => {
      if (this.state === PartyMenuState.WAIT_SECOND_A) {
        this.state = PartyMenuState.DISPLAY;
      }
    });
    this.input.keyboard.on('keydown-B', () => {
      if (this.state === PartyMenuState.COMMAND) {
        this.state = PartyMenuState.DISPLAY;
        sceneEvents.emit(
          'B-pressed-command',
          this.curorsManager.getCursorPosition()
        );
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
        this.startEmptyMenu();
      }
    });
  }

  private exitParty() {
    this.eventsManager.destroyEvents();
    this.input.keyboard.off('keydown-Z');
    this.input.keyboard.off('keydown-A');
    this.input.keyboard.off('keydown-B');
    this.input.keyboard.off('keydown-R');
    this.input.keyboard.off('keydown-L');
    this.input.keyboard.off('keydown-U');
    this.input.keyboard.off('keydown-D');
    this.input.keyboard.off('keydown-X');
    sceneEvents.off('reduce-item-quantity');
    sceneEvents.off('increase-item-quantity');
    sceneEvents.off('switch-request');
  }

  private startEmptyMenu() {
    this.scene.add('empty-menu', EmptyMenu, true, {
      userID: this.userID,
      sceneName: 'party-menu',
    });
  }

  update() {
    switch (this.state) {
      case PartyMenuState.DISPLAY:
      case PartyMenuState.SWITCH:
      case PartyMenuState.ASSIGN_ITEM: {
        this.displayParty();
        break;
      }
      case PartyMenuState.COMMAND: {
        this.displayCommand();
        break;
      }
    }
  }

  private displayParty() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.curorsManager.incrementCursorPosition(2, 6);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.curorsManager.decrementCursorPosition(2);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.R) {
      this.curorsManager.incrementCursorPosition(1, 6);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.L) {
      this.curorsManager.decrementCursorPosition(1);
      this.keyPressed = -3;
    }
  }

  private displayCommand() {
    if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.D) {
      this.curorsManager.incrementCommandCursor(3);
      this.keyPressed = -3;
    } else if (this.keyPressed == Phaser.Input.Keyboard.KeyCodes.U) {
      this.curorsManager.decrementCommandCursor();
      this.keyPressed = -3;
    }
  }
}
