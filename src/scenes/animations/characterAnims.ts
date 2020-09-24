import Phaser from 'phaser';

const createCharacterAnims = (
  anims: Phaser.Animations.AnimationManager,
  name: string
) => {
  anims.create({
    key: `${name}_idle_down`,
    frames: [{ key: name, frame: `${name}_walk_4` }],
  });

  anims.create({
    key: `${name}_idle_up`,
    frames: [{ key: name, frame: `${name}_walk_1` }],
  });

  anims.create({
    key: `${name}_idle_left`,
    frames: [{ key: name, frame: `${name}_walk_7` }],
  });

  anims.create({
    key: `${name}_idle_right`,
    frames: [{ key: name, frame: `${name}_walk_10` }],
  });

  anims.create({
    key: `${name}_walk_down`,
    frames: anims.generateFrameNames(name, {
      start: 4,
      end: 6,
      prefix: `${name}_walk_`,
    }),
    repeat: -1,
    frameRate: 8,
  });

  anims.create({
    key: `${name}_walk_up`,
    frames: anims.generateFrameNames(name, {
      start: 1,
      end: 3,
      prefix: `${name}_walk_`,
    }),
    repeat: -1,
    frameRate: 8,
  });

  anims.create({
    key: `${name}_walk_left`,
    frames: anims.generateFrameNames(name, {
      start: 7,
      end: 9,
      prefix: `${name}_walk_`,
    }),
    repeat: -1,
    frameRate: 8,
  });

  anims.create({
    key: `${name}_walk_right`,
    frames: anims.generateFrameNames(name, {
      start: 10,
      end: 12,
      prefix: `${name}_walk_`,
    }),
    repeat: -1,
    frameRate: 8,
  });
};

export { createCharacterAnims };
