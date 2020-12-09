import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import { Pokemon } from '~/types/myTypes';

export default class PartyRenderManager {
  private fadeRect!: Phaser.GameObjects.Rectangle;
  private panels: Phaser.GameObjects.Image[] = [];
  private pokemonIcons: Phaser.Physics.Arcade.Sprite[] = [];
  private commandsUnsel: Phaser.GameObjects.Image[] = [];
  private commandsText: Phaser.GameObjects.Text[] = [];
  private hpTexts: Phaser.GameObjects.Text[] = [];
  private hpRects: Phaser.GameObjects.Rectangle[] = [];
  private healths: number[] = [];
  private totalHP: number[] = [];
  private hpMaxWidths: number[] = [];
  private pokemons: Pokemon[] = [];

  public pushPanel(panel: Phaser.GameObjects.Image) {
    this.panels.push(panel);
  }

  public getPanels() {
    return this.panels;
  }

  public pushPokemonIcon(pokemonIcon: Phaser.Physics.Arcade.Sprite) {
    this.pokemonIcons.push(pokemonIcon);
  }

  public pushCommandUnsel(commandUnsel: Phaser.GameObjects.Image) {
    this.commandsUnsel.push(commandUnsel);
  }

  public pushCommandText(commandText: Phaser.GameObjects.Text) {
    this.commandsText.push(commandText);
  }

  public pushHpText(hpText: Phaser.GameObjects.Text) {
    this.hpTexts.push(hpText);
  }

  public pushHpRect(hpRect: Phaser.GameObjects.Rectangle) {
    this.hpRects.push(hpRect);
  }

  public pushHealth(health: number) {
    this.healths.push(health);
  }

  public pushHpMaxWidth(hpMaxWidth: number) {
    this.hpMaxWidths.push(hpMaxWidth);
  }

  public setPokemons(pokemons: Pokemon[]) {
    this.pokemons = pokemons;
  }

  public setTotalHP(totalHP: number[]) {
    this.totalHP = totalHP;
  }

  public renderAll(cursorPosition: number) {
    for (let i = 0; i < this.panels.length; i++) {
      if (i === cursorPosition) {
        this.panels[i].setTexture('party-active-sel');
        this.pokemonIcons[i].anims.play(
          `icon${this.pokemons[i].pokedexNumber}-move`
        );
      } else {
        this.panels[i].setTexture('party-active');
        this.pokemonIcons[i].anims.play(
          `icon${this.pokemons[i].pokedexNumber}-idle`
        );
      }
    }
  }

  public renderCommands(commandCursor: number) {
    for (let i = 0; i < this.commandsUnsel.length; i++) {
      if (i === commandCursor) {
        this.commandsUnsel[i].setTexture('command-sel');
      } else {
        this.commandsUnsel[i].setTexture('command-unsel');
      }
    }
  }

  public renderVisibleCommands(
    scene: Phaser.Scene,
    bg: Phaser.GameObjects.Image,
    cursorPosition: number
  ) {
    for (let i = 0; i < this.commandsUnsel.length; i++) {
      this.commandsUnsel[i].visible = true;
      this.commandsText[i].visible = true;
    }
    this.pokemonIcons[cursorPosition].anims.play(
      `icon${this.pokemons[cursorPosition].pokedexNumber}-idle`
    );
    this.fadeRect = scene.add
      .rectangle(0, 0, bg.width as number, bg.height as number, 0xffffff, 0.2)
      .setDepth(2)
      .setOrigin(0, 0);
  }

  public renderInvisibleCommands(cursorPosition: number) {
    for (let i = 0; i < this.commandsUnsel.length; i++) {
      this.commandsUnsel[i].visible = false;
      this.commandsText[i].visible = false;
    }
    this.pokemonIcons[cursorPosition].anims.play(
      `icon${this.pokemons[cursorPosition].pokedexNumber}-move`
    );
    this.fadeRect.destroy();
  }

  public showWarningHealth(
    hpRects: Phaser.GameObjects.Rectangle[],
    index: number
  ) {
    hpRects[index].fillColor = 0xf7b500;
  }

  public showDangerousHealth(
    hpRects: Phaser.GameObjects.Rectangle[],
    index: number
  ) {
    hpRects[index].fillColor = 0xe71410;
  }

  public decreasePokemonHP() {
    for (let i = 0; i < this.healths.length; i++) {
      this.healths[i]--;
      if (this.healths[i] <= 0) {
        this.healths[i] = 0;
      }
      this.hpTexts[i].setText(`${this.healths[i]}/${this.totalHP[i]}`);
      this.hpRects[i].width =
        (this.hpMaxWidths[i] * this.healths[i]) / this.totalHP[i];
    }
    sceneEvents.emit('check-health');
  }

  public checkHealths() {
    for (let i = 0; i < this.hpTexts.length; i++) {
      if (
        this.healths[i] < this.totalHP[i] / 2 &&
        this.healths[i] > this.totalHP[i] / 4
      ) {
        sceneEvents.emit('warning-health', this.hpRects, i);
      } else if (
        this.healths[i] <= this.totalHP[i] / 4 &&
        this.healths[i] > 0
      ) {
        sceneEvents.emit('dangerous-health', this.hpRects, i);
      }
    }
  }

  // public switchMembers(
  //   fromIndex: number,
  //   toIndex: number
  // ) {
  //   this.panels = this.switchInList<Phaser.GameObjects.Image[]>(
  //     this.panels,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.pokemonIcons = this.switchInList<Phaser.Physics.Arcade.Sprite[]>(
  //     this.pokemonIcons,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.hpTexts = this.switchInList<Phaser.GameObjects.Text[]>(
  //     this.hpTexts,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.hpRects = this.switchInList<Phaser.GameObjects.Rectangle[]>(
  //     this.hpRects,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.healths = this.switchInList<number[]>(
  //     this.healths,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.totalHP = this.switchInList<number[]>(
  //     this.totalHP,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.hpMaxWidths = this.switchInList<number[]>(
  //     this.hpMaxWidths,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.pokemons = this.switchInList<Pokemon[]>(
  //     this.pokemons,
  //     fromIndex,
  //     toIndex
  //   );
  //   this.renderAll(toIndex);
  // }

  // private switchInList<T>(list: T, fromIndex: number, toIndex: number): T {
  //   const tmp = list[fromIndex];
  //   list[fromIndex] = list[toIndex];
  //   list[toIndex] = tmp;
  //   return list;
  // }
}
