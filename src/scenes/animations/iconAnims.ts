import Phaser from 'phaser';

const createIconAnims = (
  anims: Phaser.Animations.AnimationManager,
  pokedexNumber: string
) => {
  anims.create({
    key: `icon${pokedexNumber}-move`,
    frames: anims.generateFrameNames(`icon${pokedexNumber}`, {
      start: 0,
      end: 1,
      prefix: `tile00`,
    }),
    repeat: -1,
    frameRate: 8,
  });

  anims.create({
    key: `icon${pokedexNumber}-idle`,
    frames: [{ key: `icon${pokedexNumber}`, frame: `tile000` }],
  });
};

export { createIconAnims };
