import Phaser from 'phaser';

const createPokemonBackAnim = (
  anims: Phaser.Animations.AnimationManager,
  pokemonNumber: string,
  totalFrames: number
) => {
  const digitNumber = computeDigitNumber(totalFrames);
  for (let i = 0; i < digitNumber; i++) {
    const prefix = computePrefix(i);
    const start = computeStart(i);
    const end = computeEnd(i, digitNumber, totalFrames);
    anims.create({
      key: `${pokemonNumber}-back-anim-${i}`,
      frames: anims.generateFrameNames(`battler-back-${pokemonNumber}`, {
        start: start,
        end: end,
        prefix: prefix,
      }),
      repeat: 0,
      frameRate: 15,
    });
  }
  return digitNumber;
};
const createPokemonFrontAnim = (
  anims: Phaser.Animations.AnimationManager,
  pokemonNumber: string,
  totalFrames: number
) => {
  const digitNumber = computeDigitNumber(totalFrames);
  // console.log(pokemonNumber, digitNumber, totalFrames);
  for (let i = 0; i < digitNumber; i++) {
    const prefix = computePrefix(i);
    const start = computeStart(i);
    const end = computeEnd(i, digitNumber, totalFrames);
    // console.log(prefix, start, end);
    anims.create({
      key: `${pokemonNumber}-front-anim-${i}`,
      frames: anims.generateFrameNames(`battler-front-${pokemonNumber}`, {
        start: start,
        end: end,
        prefix: prefix,
      }),
      repeat: 0,
      frameRate: 15,
    });
  }
  return digitNumber;
};

function computeDigitNumber(totalFrames: number): number {
  let totalDigits = 0;
  do {
    totalFrames = Math.floor(totalFrames / 10);
    totalDigits = totalDigits + 1;
  } while (totalFrames != 0);
  return totalDigits;
}

function computePrefix(index: number): string {
  let prefix = '';
  switch (index) {
    case 0:
      prefix = 'tile00';
      break;
    case 1:
      prefix = 'tile0';
      break;
    case 2:
      prefix = 'tile';
  }
  return prefix;
}

function computeStart(index: number): number {
  let start = 0;
  switch (index) {
    case 0:
      start = 0;
      break;
    case 1:
      start = 10;
      break;
    case 2:
      start = 100;
      break;
  }
  return start;
}

function computeEnd(
  index: number,
  digitNumber: number,
  totalFrames: number
): number {
  let end = 0;
  if (index == digitNumber - 1) {
    end = totalFrames;
  } else {
    switch (index) {
      case 0:
        end = 9;
        break;
      case 1:
        end = 99;
        break;
    }
  }
  return end;
}

export { createPokemonBackAnim, createPokemonFrontAnim };
