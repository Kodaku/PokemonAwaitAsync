export const url: string = 'http://localhost:3000';

export const characters: string[] = ['nate', 'rosa', 'hilbert', 'hilda'];

export const iconsUnselected: string[] = [
  'icon-party-unselected',
  'pokedex-unselected',
  'icon-bag-male-unselected',
  'icon-card-unselected',
  'save-unselected',
  'option-unselected',
];

export const iconsSelected: string[] = [
  'icon-party-selected',
  'pokedex-selected',
  'icon-bag-male-selected',
  'icon-card-selected',
  'save-selected',
  'option-selected',
];

export const iconText: string[] = [
  'POKéMON',
  'POKéDEX',
  'BAG',
  'Nate',
  'SAVE',
  'OPTION',
];

export const totalPanels = 6;

export const pokedexNumbers: string[] = [
  '003',
  '006',
  '009',
  '018',
  '038',
  '094',
  '130',
  '134',
  '135',
  '136',
  '144',
  '145',
  '146',
  '149',
  '150',
  '151',
  '154',
  '157',
  '160',
  '164',
  '169',
  '181',
  '196',
  '197',
  '212',
  '214',
  '230',
  '248',
  '249',
  '250',
  '251',
  '254',
];

export const pokemonFrames = [
  { pokedexNumber: '003', backFrames: 167, frontFrames: 167 },
  { pokedexNumber: '006', backFrames: 143, frontFrames: 143 },
  { pokedexNumber: '009', backFrames: 244, frontFrames: 244 },
  { pokedexNumber: '018', backFrames: 68, frontFrames: 71 },
  { pokedexNumber: '038', backFrames: 107, frontFrames: 53 },
  { pokedexNumber: '094', backFrames: 88, frontFrames: 88 },
  { pokedexNumber: '130', backFrames: 87, frontFrames: 87 },
  { pokedexNumber: '134', backFrames: 107, frontFrames: 101 },
  { pokedexNumber: '135', backFrames: 99, frontFrames: 99 },
  { pokedexNumber: '136', backFrames: 119, frontFrames: 119 },
  { pokedexNumber: '144', backFrames: 51, frontFrames: 51 },
  { pokedexNumber: '145', backFrames: 17, frontFrames: 17 },
  { pokedexNumber: '146', backFrames: 53, frontFrames: 53 },
  { pokedexNumber: '149', backFrames: 102, frontFrames: 102 },
  { pokedexNumber: '150', backFrames: 125, frontFrames: 125 },
  { pokedexNumber: '151', backFrames: 119, frontFrames: 119 },
  { pokedexNumber: '154', backFrames: 89, frontFrames: 91 },
  { pokedexNumber: '157', backFrames: 112, frontFrames: 112 },
  { pokedexNumber: '160', backFrames: 83, frontFrames: 83 },
  { pokedexNumber: '164', backFrames: 72, frontFrames: 72 },
  { pokedexNumber: '169', backFrames: 95, frontFrames: 95 },
  { pokedexNumber: '181', backFrames: 73, frontFrames: 73 },
  { pokedexNumber: '196', backFrames: 143, frontFrames: 150 },
  { pokedexNumber: '197', backFrames: 65, frontFrames: 65 },
  { pokedexNumber: '212', backFrames: 105, frontFrames: 105 },
  { pokedexNumber: '214', backFrames: 84, frontFrames: 84 },
  { pokedexNumber: '230', backFrames: 54, frontFrames: 54 },
  { pokedexNumber: '248', backFrames: 85, frontFrames: 85 },
  { pokedexNumber: '249', backFrames: 120, frontFrames: 120 },
  { pokedexNumber: '250', backFrames: 83, frontFrames: 83 },
  { pokedexNumber: '251', backFrames: 84, frontFrames: 64 },
  { pokedexNumber: '254', backFrames: 135, frontFrames: 125 },
];

export const commandTexts: string[] = ['SWITCH', 'WITHDRAW', 'QUIT'];
export const itemOptions: string[] = ['GIVE', 'QUIT'];

export const sex: string[] = ['m', 'f'];
export const directions: string[] = ['right', 'left'];
export const itemsText: string[] = [
  'ITEMS',
  'MEDICINES',
  'TMs & HMs',
  'BERRIES',
  'KEY ITEMS',
];

export const itemsIndexes: string[] = [
  '001',
  '002',
  '003',
  '004',
  '057',
  '058',
  '059',
  '061',
  '062',
  '017',
  '024',
  '025',
  '026',
  '028',
  '029',
  '030',
  '031',
  '032',
  '033',
  '038',
  '039',
  '154',
  '155',
  '158',
  '018',
  '019',
  '020',
  '021',
  '022',
  '027',
  '149',
  '150',
  '151',
  '152',
  '153',
  '157',
];

export const items: string[] = [
  'Poké Ball',
  'Ultra Ball',
  'X Attack',
  'X Defense',
  'Velox Ball',
  'X Speciality',
  'Mega Ball',
  'Master Ball',
];

export const medicines: string[] = [
  'Potion',
  'Super Potion',
  'Revive',
  'Max Revive',
  'Paralyz Heal',
  'Awakening',
  'Full Heal',
  'Ether',
  'Fresh Water',
  'Antidote',
];

export const berries: string[] = [
  'Chesto Berry',
  'Pecha Berry',
  'Oran Berry',
  'Aspear Berry',
  'Cheri Berry',
  'Leppa Berry',
  'Lum Berry',
  'Persim Berry',
  'Rawst Berry',
  'Sitrus Berry',
];

export const TmsHms: string[] = [];
export const keyItems: string[] = [];

export const bag: string[][] = [items, medicines, TmsHms, berries, keyItems];

export const sliderEndY = 164;

// export const lecture =
//   "Welcome to Pokémon Async Await. While you're waiting for other players let me introduce the rules of this game and of course some useful commands. In this game you'll play a little tournament against other trainers so when you start play you'll be informed about the identity of your opponent. If you encounter him come close to him and choose 'YES' if you want to battle, otherwise 'NO' then you can walk around while waiting for your opponent's reply and you can ask him again after 1 minute. If you win you'll have to wait all other players to finish the battle, otherwise you'll be redirected to a Game Over screen. Before you start playing let me explain the basic commands: Press the arrows to move, A to read a dialogue, like you're doing now, X to get access to the menu. In this case if your opponent encounter you then you'll see the battle request when you exit the menu. Well, that's all so Good Luck. If you win the tournament you'll obtain a special gift";
export const lecture = 'Hello';

export const pokemon_types = [
  'BUG',
  'DARK',
  'FLYING',
  'ELECTRIC',
  'WATER',
  'FIRE',
  'POISON',
  'GRASS',
  'PSYCHIC',
  'DRAGON',
  'FIGHTING',
  'GHOST',
  'GROUND',
  'ICE',
  'NORMAL',
  'ROCK',
  'STEEL',
];
