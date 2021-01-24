import Phaser from 'phaser';
import { url } from '~/constants/Constants';
import { Pokemon } from '~/types/myTypes';
import BattleSceneGraphics from './BattleSceneGraphics';
import axios from 'axios';

const getPokemonHealthPromise = (id: number, index: number) => {
  return new Promise((resolve: (value: number) => void) => {
    axios.get(`${url}/health/get-one/${id}/${index}`).then((response) => {
      console.log(response.data);
      resolve(parseInt(response.data.data));
    });
  });
};

const sendPokemonHealthPromise = (
  id: number,
  index: number,
  health: number
) => {
  return new Promise((resolve: (value: string) => void) => {
    axios
      .post(`${url}/health/post-one/${id}/${index}/${health}`)
      .then((response) => {
        console.log(response.data);
        resolve('success');
      });
  });
};

const hpRectMaxWidth = screen.width * 0.0505124451;

export default class BattleSceneHealthManager {
  private playerPokemonMaxHealth!: number;
  private opponentPokemonMaxHealth!: number;
  private playerPokemonCurrentHealth!: number;
  private opponentPokemonCurrentHealth!: number;
  private playerHpRect!: Phaser.GameObjects.Rectangle;
  private playerHealthText!: Phaser.GameObjects.Text;
  private opponentHpRect!: Phaser.GameObjects.Rectangle;
  private playerLifeBar!: Phaser.GameObjects.Image;
  private opponentLifeBar!: Phaser.GameObjects.Image;
  constructor(public scene: Phaser.Scene) {}

  public createHealthGraphics(
    battleGraphics: BattleSceneGraphics,
    playerPokemon: Pokemon,
    opponentPokemon: Pokemon
  ) {
    this.playerPokemonMaxHealth = playerPokemon.maxPs;
    this.playerPokemonCurrentHealth = playerPokemon.ps;
    this.opponentPokemonMaxHealth = opponentPokemon.maxPs;
    this.opponentPokemonCurrentHealth = opponentPokemon.ps;
    // Player life bar
    this.playerLifeBar = battleGraphics.createPlayerLifeBar();
    // Enemy life bar
    this.opponentLifeBar = battleGraphics.createOpponentLifeBar();
    // Player health
    this.playerHealthText = battleGraphics.createPlayerHealthText(
      playerPokemon.ps,
      playerPokemon.maxPs
    );
    // Player life
    this.playerHpRect = battleGraphics.createPlayerHpRect(
      playerPokemon.ps,
      playerPokemon.maxPs,
      hpRectMaxWidth
    );
    // Enemy life
    this.opponentHpRect = battleGraphics.createOpponentHpRect(hpRectMaxWidth);
  }

  public async setPlayerHealth(
    pokemon: Pokemon,
    battleGraphics: BattleSceneGraphics,
    userID: number,
    playerPokemonIndex: number
  ) {
    //TODO: Get pokemon health
    this.playerPokemonCurrentHealth = await getPokemonHealthPromise(
      userID,
      playerPokemonIndex
    );
    this.playerPokemonMaxHealth = pokemon.maxPs;
    this.computePlayerHealthColor();
    this.playerHealthText.setText(`${pokemon.ps}/${pokemon.maxPs}`);
    const newWidth = battleGraphics.computeRectWidth(
      pokemon.ps,
      pokemon.maxPs,
      hpRectMaxWidth
    );
    this.playerHpRect.width = newWidth;
    this.playerHpRect.displayWidth = this.playerHpRect.width;
  }

  public async setOpponentHealth(
    pokemon: Pokemon,
    battleGraphics: BattleSceneGraphics,
    opponentID: number,
    opponentPokemonIndex: number
  ) {
    //TODO: Get pokemon health
    this.opponentPokemonCurrentHealth = await getPokemonHealthPromise(
      opponentID,
      opponentPokemonIndex
    );
    this.opponentPokemonMaxHealth = pokemon.maxPs;
    this.computeOpponentHealthColor();
    const newWidth = battleGraphics.computeRectWidth(
      pokemon.ps,
      pokemon.maxPs,
      hpRectMaxWidth
    );
    this.opponentHpRect.width = newWidth;
    this.opponentHpRect.displayWidth = this.opponentHpRect.width;
  }

  public async sendNewPlayerPokemonHealth(
    userID: number,
    playerPokemonIndex: number
  ) {
    await sendPokemonHealthPromise(
      userID,
      playerPokemonIndex,
      this.playerPokemonCurrentHealth
    );
  }

  public getPlayerHpRect() {
    return this.playerHpRect;
  }

  public opponentHpRectVisible() {
    this.opponentHpRect.width = this.computeRectWidth(
      this.opponentPokemonCurrentHealth,
      this.opponentPokemonMaxHealth,
      hpRectMaxWidth
    );
    this.opponentHpRect.displayWidth = this.opponentHpRect.width;
    this.opponentHpRect.visible = true;
  }

  public opponentHpRectInvisible() {
    this.opponentHpRect.visible = false;
  }

  public playerHpRectVisible() {
    this.playerHpRect.width = this.computeRectWidth(
      this.playerPokemonCurrentHealth,
      this.playerPokemonMaxHealth,
      hpRectMaxWidth
    );
    this.playerHpRect.displayWidth = this.playerHpRect.width;
    this.playerHpRect.visible = true;
  }

  public playerHpRectInvisible() {
    this.playerHpRect.visible = false;
  }

  public playerHpTextVisible() {
    this.playerHealthText.setText(
      `${this.playerPokemonCurrentHealth}/${this.playerPokemonMaxHealth}`
    );
    this.playerHealthText.visible = true;
  }

  public playerHpTextInvisible() {
    this.playerHealthText.visible = false;
  }

  public opponentLifeBarVisible() {
    this.opponentLifeBar.visible = true;
  }

  public opponentLifeBarInvisible() {
    this.opponentLifeBar.visible = false;
  }

  public playerLifeBarVisible() {
    this.playerLifeBar.visible = true;
  }

  public playerLifeBarInvisible() {
    this.playerLifeBar.visible = false;
  }

  public getPlayerPokemonCurrentHealth() {
    return this.playerPokemonCurrentHealth;
  }

  public getOpponentPokemonCurrentHealth() {
    return this.opponentPokemonCurrentHealth;
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

  public increasePlayerPokemonHealth() {
    this.playerPokemonCurrentHealth++;
    if (this.playerPokemonCurrentHealth >= this.playerPokemonMaxHealth) {
      this.playerPokemonCurrentHealth = this.playerPokemonMaxHealth;
    }
    this.playerHpRect.width = this.computeRectWidth(
      this.playerPokemonCurrentHealth,
      this.playerPokemonMaxHealth,
      hpRectMaxWidth
    );
    this.playerHpRect.displayWidth = this.playerHpRect.width;
    if (this.playerHealthText) {
      this.playerHealthText.setText(
        `${this.playerPokemonCurrentHealth}/${this.playerPokemonMaxHealth}`
      );
    }
    this.computePlayerHealthColor();
  }

  public decreasePlayerPokemonHealth() {
    this.playerPokemonCurrentHealth--;
    if (this.playerPokemonCurrentHealth <= 0) {
      this.playerPokemonCurrentHealth = 0;
    }
    this.playerHpRect.width = this.computeRectWidth(
      this.playerPokemonCurrentHealth,
      this.playerPokemonMaxHealth,
      hpRectMaxWidth
    );
    this.playerHpRect.displayWidth = this.playerHpRect.width;
    if (this.playerHealthText) {
      this.playerHealthText.setText(
        `${this.playerPokemonCurrentHealth}/${this.playerPokemonMaxHealth}`
      );
    }
    this.computePlayerHealthColor();
  }

  public increaseOpponentPokemonHealth() {
    this.opponentPokemonCurrentHealth++;
    if (this.opponentPokemonCurrentHealth >= this.opponentPokemonMaxHealth) {
      this.opponentPokemonCurrentHealth = this.opponentPokemonMaxHealth;
    }
    this.opponentHpRect.width = this.computeRectWidth(
      this.opponentPokemonCurrentHealth,
      this.opponentPokemonMaxHealth,
      hpRectMaxWidth
    );
    this.opponentHpRect.displayWidth = this.opponentHpRect.width;
    this.computeOpponentHealthColor();
  }

  public decreaseOpponentPokemonHealth() {
    this.opponentPokemonCurrentHealth--;
    if (this.opponentPokemonCurrentHealth <= 0) {
      this.opponentPokemonCurrentHealth = 0;
    }
    this.opponentHpRect.width = this.computeRectWidth(
      this.opponentPokemonCurrentHealth,
      this.opponentPokemonMaxHealth,
      hpRectMaxWidth
    );
    this.opponentHpRect.displayWidth = this.opponentHpRect.width;
    this.computeOpponentHealthColor();
  }

  private computePlayerHealthColor() {
    if (
      this.playerPokemonCurrentHealth <
        this.playerPokemonMaxHealth * (40 / 100) &&
      this.playerPokemonCurrentHealth >=
        this.playerPokemonMaxHealth * (15 / 100)
    ) {
      this.playerHpRect.fillColor = 0xf7b500;
    } else if (
      this.playerPokemonCurrentHealth <
      this.playerPokemonMaxHealth * (15 / 100)
    ) {
      this.playerHpRect.fillColor = 0xe71410;
    } else {
      this.playerHpRect.fillColor = 0x00bf37;
    }
  }

  private computeOpponentHealthColor() {
    if (
      this.opponentPokemonCurrentHealth <
        this.opponentPokemonMaxHealth * (40 / 100) &&
      this.opponentPokemonCurrentHealth >=
        this.opponentPokemonMaxHealth * (15 / 100)
    ) {
      this.opponentHpRect.fillColor = 0xf7b500;
    } else if (
      this.opponentPokemonCurrentHealth <
      this.opponentPokemonMaxHealth * (15 / 100)
    ) {
      this.opponentHpRect.fillColor = 0xe71410;
    } else {
      this.opponentHpRect.fillColor = 0x00bf37;
    }
  }
}
