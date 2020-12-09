import Phaser from 'phaser';

const createPokeBallAnim = (
  anims: Phaser.Animations.AnimationManager,
  pokeBallName: string
) => {
  anims.create({
    key: `${pokeBallName}-anim-0`,
    frames: anims.generateFrameNames(`${pokeBallName}`, {
      start: 0,
      end: 9,
      prefix: 'tile00',
    }),
    repeat: 0,
    frameRate: 14,
  });
  anims.create({
    key: `${pokeBallName}-anim-1`,
    frames: [{ key: pokeBallName, frame: `tile010` }],
  });
};

export { createPokeBallAnim };
