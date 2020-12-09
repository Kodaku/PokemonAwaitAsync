import Phaser from 'phaser';

const createBagArrowAnims = (
  anims: Phaser.Animations.AnimationManager,
  direction: string
) => {
  anims.create({
    key: `${direction}-light-arrow-move`,
    frames: anims.generateFrameNames(`${direction}-light-arrow`, {
      start: 0,
      end: 2,
      prefix: `tile00`,
    }),
    frameRate: 8,
  });

  anims.create({
    key: `${direction}-light-arrow-idle`,
    frames: [{ key: `${direction}-light-arrow`, frame: `tile000` }],
  });
};

export { createBagArrowAnims };
