import Phaser from 'phaser';
import { DepthLevels } from '~/enums/depthLevels';

export default class Map {
  private colliders: Phaser.Physics.Arcade.Collider[] = [];
  private mapLayers: Phaser.Tilemaps.StaticTilemapLayer[] = [];

  constructor(public scene: Phaser.Scene) {}

  public makeMap(): void {
    const map = this.scene.make.tilemap({ key: 'alto_mare' });
    const tileset = map.addTilesetImage(
      'alto_mare',
      'alto_mare_img',
      16,
      16,
      1,
      2
    );

    for (let i = 0; i < map.layers.length; i++) {
      const layer_name = map.layers[i].name;
      const layer_split = layer_name.split('_');
      const layer = map.createStaticLayer(layer_name, tileset);
      //   const collider = this.scene.physics.add.collider(this.nate, layer);
      layer.name = layer_name;
      layer.setCollisionByProperty({ collides: true });
      //   collider.name = layer_name;
      //   this.colliders.push(collider);
      if (layer_split[0] === 'b') {
        layer.setDepth(DepthLevels.BOTTOM);
      } else if (layer_split[0] === 'm') {
        layer.setDepth(DepthLevels.MEDIUM);
      } else if (layer_split[0] === 't') {
        layer.setDepth(DepthLevels.TOP);
      }

      this.mapLayers.push(layer);
      // debugDraw(layer, this);
    }
  }

  public addColliders(sprites: Phaser.Physics.Arcade.Sprite[]): void {
    for (let layer of this.mapLayers) {
      for (let i = 0; i < sprites.length; i++) {
        const collider = this.scene.physics.add.collider(sprites[i], layer);
        collider.name = layer.name;
        this.colliders.push(collider);
      }
    }
  }

  public findLayer(name: string): Phaser.Tilemaps.StaticTilemapLayer {
    let layer!: Phaser.Tilemaps.StaticTilemapLayer;
    for (let i = 0; i < this.mapLayers.length; i++) {
      if (this.mapLayers[i].name === name) layer = this.mapLayers[i];
    }
    return layer;
  }

  public getLayerCollider(name: string): Phaser.Physics.Arcade.Collider {
    let collider_find!: Phaser.Physics.Arcade.Collider;
    for (let collider of this.colliders) {
      if (collider.name === name) {
        collider_find = collider;
      }
    }
    return collider_find;
  }

  public switchBottomColliders(yes: boolean): void {
    for (let collider of this.colliders) {
      let name_split = collider.name.split('_');
      if (name_split[0] === 'b' || name_split[0] === 'm') {
        collider.active = yes;
      }
    }
  }

  public switchTopColliders(yes: boolean): void {
    for (let collider of this.colliders) {
      let name_split = collider.name.split('_');
      if (name_split[0] === 't') {
        collider.active = yes;
      }
    }
  }
}
