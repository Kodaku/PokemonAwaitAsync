import Phaser from 'phaser';
import { commandTexts } from '~/constants/Constants';
import { Pokemon, TeamMember } from '~/types/myTypes';

export default class PartyGraphicManager {
  constructor(public scene: Phaser.Scene) {}

  public createPanel(
    panelX: number,
    panelY: number,
    bg: Phaser.GameObjects.Image
  ): Phaser.GameObjects.Image {
    const panel = this.scene.add
      .image(panelX, panelY, 'party-active')
      .setOrigin(0, 0);
    panel.width = bg.width / 2;
    panel.height = bg.height / 5;
    panel.displayWidth = panel.width;
    panel.displayHeight = panel.height;
    return panel;
  }

  public createIconSprite(
    panelX: number,
    panelY: number,
    index: number,
    pokemons: TeamMember[]
  ): Phaser.Physics.Arcade.Sprite {
    const pokemonIcon = this.scene.physics.add.sprite(
      panelX + (30 / 1366) * screen.width,
      panelY + (25 / 768) * screen.height,
      ''
    );
    pokemonIcon.width = (20 / 1366) * screen.width;
    pokemonIcon.height = (20 / 768) * screen.height;
    pokemonIcon.displayHeight = pokemonIcon.height;
    pokemonIcon.displayWidth = pokemonIcon.width;
    pokemonIcon.anims.play(`icon${pokemons[index].pokedexNumber}-idle`);
    return pokemonIcon;
  }

  public createHPBar(
    panelX: number,
    panelY: number,
    panel: Phaser.GameObjects.Image
  ): Phaser.GameObjects.Image {
    const hpBar = this.scene.add
      .image(
        panelX + panel.width / 2 - (30 / 1366) * screen.width,
        panelY + panel.height / 2 - (5 / 768) * screen.height,
        'party-hp-bar'
      )
      .setOrigin(0, 0);
    hpBar.width = (100 / 1366) * screen.width;
    hpBar.height = (hpBar.height / 768) * screen.height
    hpBar.height = hpBar.height;
    hpBar.displayWidth = hpBar.width;
    hpBar.displayHeight = hpBar.height;
    return hpBar;
  }

  public createHPRect(
    hpBar: Phaser.GameObjects.Image
  ): Phaser.GameObjects.Rectangle {
    const hpRect = this.scene.add
      .rectangle(
        hpBar.x + (25.5 / 1366) * screen.width,
        hpBar.y + (5 / 768) * screen.height,
        hpBar.width / 1.35,
        hpBar.height / 3.1,
        0x00ff4a
      )
      .setOrigin(0, 0);
    return hpRect;
  }

  public createPokemonNameText(
    panelX: number,
    panelY: number,
    panel: Phaser.GameObjects.Image,
    index: number,
    pokemons: Pokemon[]
  ): Phaser.GameObjects.Text {
    const pokemonName = this.scene.add
      .text(
        panelX + panel.width / 2 - (30 / 1366) * screen.width,
        panelY + panel.height / 2 - (20 / 768) * screen.height,
        pokemons[index].name
      )
      .setOrigin(0, 0);
    return pokemonName;
  }

  public createHPText(
    panelX: number,
    panelY: number,
    panel: Phaser.GameObjects.Image,
    index: number,
    healths: number[]
  ) {
    const hpText = this.scene.add
      .text(
        panelX + panel.width / 2 + (5 / 1366) * screen.width,
        panelY + panel.height / 2 + (10 / 768) * screen.height,
        `${healths[index]}/${healths[index]}`
      )
      .setOrigin(0, 0);
    return hpText;
  }

  public createLevelText(
    panelX: number,
    panelY: number,
    panel: Phaser.GameObjects.Image
  ) {
    const levelText = this.scene.add
      .text(panelX + (3 / 1366) * screen.width, panelY + panel.height / 2 + (11 / 768) * screen.height, `Lv.50`)
      .setOrigin(0, 0);
    return levelText;
  }

  public createCommandUnsel(
    bg: Phaser.GameObjects.Image,
    y: number
  ): Phaser.GameObjects.Image {
    const commandUnsel = this.scene.add
      .image(bg.width - (150 / 1366) * screen.width, y, 'command-unsel')
      .setOrigin(0, 0);
    commandUnsel.height = (30 / 1366) * screen.width;
    commandUnsel.width = (120 / 768) * screen.height;
    commandUnsel.displayHeight = commandUnsel.height;
    commandUnsel.displayWidth = commandUnsel.width;
    commandUnsel.visible = false;
    return commandUnsel;
  }

  public createCommandText(
    commandUnsel: Phaser.GameObjects.Image,
    index: number
  ) {
    const commandText = this.scene.add
      .text(commandUnsel.x + (10 / 1366) * screen.width, commandUnsel.y + (6 / 768) * screen.height, commandTexts[index], {
        fontSize: (18 / 1366) * screen.width,
      })
      .setOrigin(0, 0);
    commandText.visible = false;
    return commandText;
  }
}
