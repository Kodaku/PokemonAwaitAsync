import Phaser from 'phaser';

const createPauseAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'pause_anim',
    frames: anims.generateFrameNames('pause', {
      start: 1,
      end: 4,
      prefix: 'pause_',
    }),
    repeat: -1,
    frameRate: 8,
  });
};

export { createPauseAnims };
