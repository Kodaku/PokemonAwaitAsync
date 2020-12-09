import Phaser from 'phaser';

const createPikachuAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'pikachu-anim',
    frames: anims.generateFrameNames('pikachu-run', {
      start: 0,
      end: 3,
      prefix: 'pikachu_run_',
    }),
    repeat: -1,
    frameRate: 8,
  });
};

export { createPikachuAnims };
