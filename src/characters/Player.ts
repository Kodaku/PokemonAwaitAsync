import Phaser from 'phaser';

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Player;
    }
  }
}

type Velocity = {
  vx: number;
  vy: number;
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private emotion!: Phaser.GameObjects.Sprite;
  public playerKey: string;
  public playerName!: string;
  public playerAnim: string;
  public velocity: Velocity;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.anims.play(frame as string);
    this.playerAnim = frame as string;
    this.playerKey = texture;
    this.velocity = { vx: 0, vy: 0 };
  }

  public setPlayerName(newName: string): void {
    this.name = newName;
  }

  // get playerKey(): string {
  //   return this.playerKey;
  // }

  public getPlayerName(): string {
    return this.playerName;
  }

  public getPlayerAnim(): string {
    return this.playerAnim;
  }

  public getVelocity(): Velocity {
    return {
      vx: this.velocity.vx,
      vy: this.velocity.vy,
    };
  }

  setEmotion(emotion: Phaser.GameObjects.Sprite) {
    this.emotion = emotion;
  }

  showEmotion() {
    if (!this.emotion) {
      return;
    }

    this.emotion.x = this.x;
    this.emotion.y = this.y - 16;
    this.emotion.visible = true;
    this.emotion.anims.play('emotion_anim');
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors) {
      return;
    }

    const speed = 200;
    if (cursors.left?.isDown) {
      this.velocity.vx = -speed;
      this.velocity.vy = 0;
      this?.setVelocity(this.velocity.vx, this.velocity.vy);
      this.playerAnim = `${this.playerKey}_walk_left`;
      this?.anims.play(this.playerAnim, true);
    } else if (cursors.right?.isDown) {
      this.velocity.vx = speed;
      this.velocity.vy = 0;
      this.playerAnim = `${this.playerKey}_walk_right`;
      this.anims.play(this.playerAnim, true);
      this.setVelocity(this.velocity.vx, this.velocity.vy);
    } else if (cursors.up?.isDown) {
      this.velocity.vx = 0;
      this.velocity.vy = -speed;
      this.setVelocity(this.velocity.vx, this.velocity.vy);
      this.playerAnim = `${this.playerKey}_walk_up`;
      this.anims.play(this.playerAnim, true);
    } else if (cursors.down?.isDown) {
      this.velocity.vx = 0;
      this.velocity.vy = speed;
      this.playerAnim = `${this.playerKey}_walk_down`;
      this.anims.play(this.playerAnim, true);
      this.setVelocity(this.velocity.vx, this.velocity.vy);
    } else {
      this.velocity.vx = 0;
      this.velocity.vy = 0;
      const parts = this.anims.currentAnim.key.split('_');
      parts[1] = 'idle';
      this.playerAnim = parts.join('_');
      this.anims.play(this.playerAnim);
      this.setVelocity(this.velocity.vx, this.velocity.vy);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  frame: string | number
) {
  var sprite = new Player(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );
  sprite.body.setSize(sprite.width * 0.8, sprite.height * 0.8);

  return sprite;
});
