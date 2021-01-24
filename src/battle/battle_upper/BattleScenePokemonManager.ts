import Phaser from 'phaser';
import { pokemonFrames } from '~/constants/Constants';
import {
  createPokemonBackAnim,
  createPokemonFrontAnim,
} from '~/scenes/animations/pokemonAnims';
import { Pokemon } from '~/types/myTypes';
import BattleSceneGraphics from './BattleSceneGraphics';

export default class BattleScenePokemonManager {
  private playerPokemon!: Phaser.GameObjects.Sprite;
  private frameQuantitiesBack: number[] = [];
  private frameQuantitiesFront: number[] = [];
  private opponentPokemon!: Phaser.GameObjects.Sprite;
  private playerPokemonStartX!: number;
  private playerPokemonCurrentX!: number;
  private playerPokemonEndX!: number;
  private opponentPokemonStartX!: number;
  private opponentPokemonCurrentX!: number;
  private opponentPokemonEndX!: number;
  private playerPokemonName!: Phaser.GameObjects.Text;
  private opponentPokemonName!: Phaser.GameObjects.Text;
  private playerPokemonLevel!: Phaser.GameObjects.Text;
  private opponentPokemonLevel!: Phaser.GameObjects.Text;
  private opponentPokemonIndex!: number;
  private playerPokemonIndex!: number;
  constructor(public scene: Phaser.Scene) {
    this.initializePlayerPosition();
    this.initializeOpponentPosition();
  }

  public initializePlayerPosition() {
    this.playerPokemonStartX = screen.width * 0.065885798;
    this.playerPokemonCurrentX = this.playerPokemonStartX;
    this.playerPokemonEndX = screen.width * 0.0951683748;
  }

  public initializeOpponentPosition() {
    this.opponentPokemonStartX = screen.width * 0.1830161054;
    this.opponentPokemonCurrentX = this.opponentPokemonStartX;
    this.opponentPokemonEndX = screen.width * 0.1537335286;
  }

  public createAnims() {
    for (let i = 0; i < pokemonFrames.length; i++) {
      this.frameQuantitiesBack[i] = createPokemonBackAnim(
        this.scene.anims,
        pokemonFrames[i].pokedexNumber,
        pokemonFrames[i].backFrames
      );
      this.frameQuantitiesFront[i] = createPokemonFrontAnim(
        this.scene.anims,
        pokemonFrames[i].pokedexNumber,
        pokemonFrames[i].frontFrames
      );
    }
  }

  public createPlayerPokemon(
    battleGraphics: BattleSceneGraphics,
    playerPokemon: Pokemon
  ) {
    const playerPokedexNumber = playerPokemon.pokedexNumber;
    this.playerPokemonIndex = this.getPokemonIndex(playerPokedexNumber);
    this.playerPokemon = battleGraphics.createPlayerPokemon(
      this.playerPokemonIndex,
      this.playerPokemonStartX,
      this.frameQuantitiesBack
    );
    this.playerPokemonName = battleGraphics.createPlayerPokemonName(
      playerPokemon.name
    );
    // Enemy pokemon name
  }

  public createOpponentPokemon(
    battleGraphics: BattleSceneGraphics,
    opponentPokemon: Pokemon
  ) {
    const opponentPokedexNumber = opponentPokemon.pokedexNumber;
    this.opponentPokemonIndex = this.getPokemonIndex(opponentPokedexNumber);
    this.opponentPokemon = battleGraphics.createOpponentPokemon(
      this.opponentPokemonIndex,
      this.opponentPokemonStartX,
      this.frameQuantitiesFront
    );
    this.opponentPokemonName = battleGraphics.createOpponentPokemonName(
      opponentPokemon.name
    );
  }

  private getPokemonIndex(pokedexNumber: string): number {
    let index = 0;
    for (let i = 0; i < pokemonFrames.length; i++) {
      if (pokemonFrames[i].pokedexNumber === pokedexNumber) {
        index = i;
        break;
      }
    }
    return index;
  }

  public createPokemonGraphics(
    battleGraphics: BattleSceneGraphics,
    playerPokemon: Pokemon,
    opponentPokemon: Pokemon
  ) {
    //Player Pokemon
    this.createPlayerPokemon(battleGraphics, playerPokemon);
    //Opponent Pokemon
    this.createOpponentPokemon(battleGraphics, opponentPokemon);
    // Player level
    this.playerPokemonLevel = battleGraphics.createPlayerPokemonLevel();
    // Enemy level
    this.opponentPokemonLevel = battleGraphics.createOpponentPokemonLevel();
  }

  public opponentPokemonLevelVisible() {
    this.opponentPokemonLevel.visible = true;
  }

  public opponentPokemonLevelInvisible() {
    this.opponentPokemonLevel.visible = false;
  }

  public playerPokemonLevelVisible() {
    this.playerPokemonLevel.visible = true;
  }

  public playerPokemonLevelInvisible() {
    this.playerPokemonLevel.visible = false;
  }

  public opponentPokemonVisible() {
    this.opponentPokemon.visible = true;
  }

  public opponentPokemonInvisible() {
    this.opponentPokemon.visible = false;
  }

  public hitOpponentPokemon() {
    this.opponentPokemon.visible = !this.opponentPokemon.visible;
  }

  public moveForwardOpponentPokemon() {
    this.opponentPokemon.setX((this.opponentPokemonCurrentX -= screen.width * 0.0029282577));
  }

  public moveBackwardOpponentPokemon() {
    this.opponentPokemon.setX((this.opponentPokemonCurrentX += screen.width * 0.0029282577));
  }

  public stopOpponentPokemon() {
    this.opponentPokemon.setX(this.opponentPokemonCurrentX);
  }

  public fadeOpponentPokemon() {
    this.opponentPokemon.alpha -= 0.02;
  }

  public playerPokemonVisible() {
    this.playerPokemon.visible = true;
  }

  public playerPokemonInvisilbe() {
    this.playerPokemon.visible = false;
  }

  public playerPokemonResetAlpha() {
    this.playerPokemon.alpha = 1;
  }

  public opponentPokemonResetAlpha() {
    this.opponentPokemon.alpha = 1;
  }

  public hitPlayerPokemon() {
    this.playerPokemon.visible = !this.playerPokemon.visible;
  }

  public moveForwardPlayerPokemon() {
    this.playerPokemon.setX((this.playerPokemonCurrentX += screen.width * 0.0029282577));
  }

  public moveBackwardPlayerPokemon() {
    this.playerPokemon.setX((this.playerPokemonCurrentX -= screen.width * 0.0029282577));
  }

  public stopPlayerPokemon() {
    this.playerPokemon.setX(this.playerPokemonCurrentX);
  }

  public fadePlayerPokemon() {
    this.playerPokemon.alpha -= 0.02;
  }

  public opponentPokemonNameVisible() {
    this.opponentPokemonName.visible = true;
  }

  public opponentPokemonNameInvisible() {
    this.opponentPokemonName.visible = false;
  }

  public playerPokemonNameVisible() {
    this.playerPokemonName.visible = true;
  }

  public playerPokemonNameInvisible() {
    this.playerPokemonName.visible = false;
  }

  public playOpponentPokemon() {
    this.opponentPokemon.anims.play(
      `${pokemonFrames[this.opponentPokemonIndex].pokedexNumber}-front-anim-0`,
      true
    );
  }

  public playPlayerPokemon() {
    this.playerPokemon.anims.play(
      `${pokemonFrames[this.playerPokemonIndex].pokedexNumber}-back-anim-0`,
      true
    );
  }

  public checkPlayerPokemonFrontX() {
    return this.playerPokemonCurrentX >= this.playerPokemonEndX;
  }

  public checkPlayerPokemonBackX() {
    return this.playerPokemonCurrentX <= this.playerPokemonStartX;
  }

  public checkOpponentPokemonFrontX() {
    return this.opponentPokemonCurrentX <= this.opponentPokemonEndX;
  }

  public checkOpponentPokemonBackX() {
    return this.opponentPokemonCurrentX >= this.opponentPokemonStartX;
  }

  public playerPokemonFaded() {
    return this.playerPokemon.alpha <= 0;
  }

  public opponentPokemonFaded() {
    return this.opponentPokemon.alpha <= 0;
  }
}
