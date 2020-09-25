import Phaser from 'phaser';

export const characterLoader = (
  loader: Phaser.Loader.LoaderPlugin,
  characterKey: string
) => {
  loader.atlas(
    characterKey,
    `characters/${characterKey}.png`,
    `characters/${characterKey}_atlas.json`
  );
};
