import Phaser from 'phaser';

const createBagAnims = (
  anims: Phaser.Animations.AnimationManager,
  bagIndex: number,
  sex: string
) => {
  anims.create({
    key: `bag${bagIndex}-${sex}-move`,
    frames: anims.generateFrameNames(`bag${bagIndex}-${sex}`, {
      start: 0,
      end: 2,
      prefix: `tile00`,
    }),
    frameRate: 8,
  });

  anims.create({
    key: `bag${bagIndex}-${sex}-idle`,
    frames: [{ key: `bag${bagIndex}-${sex}`, frame: `tile000` }],
  });
};

export { createBagAnims };
