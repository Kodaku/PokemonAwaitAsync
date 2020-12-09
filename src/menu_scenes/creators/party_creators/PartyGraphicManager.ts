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
      panelX + 30,
      panelY + 25,
      ''
    );
    pokemonIcon.width = 20;
    pokemonIcon.height = 20;
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
        panelX + panel.width / 2 - 30,
        panelY + panel.height / 2 - 5,
        'party-hp-bar'
      )
      .setOrigin(0, 0);
    hpBar.width = 100;
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
        hpBar.x + 25.5,
        hpBar.y + 5,
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
        panelX + panel.width / 2 - 30,
        panelY + panel.height / 2 - 20,
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
        panelX + panel.width / 2 + 5,
        panelY + panel.height / 2 + 10,
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
      .text(panelX + 3, panelY + panel.height / 2 + 11, `Lv.50`)
      .setOrigin(0, 0);
    return levelText;
  }

  public createCommandUnsel(
    bg: Phaser.GameObjects.Image,
    y: number
  ): Phaser.GameObjects.Image {
    const commandUnsel = this.scene.add
      .image(bg.width - 150, y, 'command-unsel')
      .setOrigin(0, 0);
    commandUnsel.height = 30;
    commandUnsel.width = 120;
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
      .text(commandUnsel.x + 10, commandUnsel.y + 6, commandTexts[index], {
        fontSize: 18,
      })
      .setOrigin(0, 0);
    commandText.visible = false;
    return commandText;
  }
}
