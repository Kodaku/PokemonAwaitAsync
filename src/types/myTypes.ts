export type Velocity = {
  vx: number;
  vy: number;
};

export type User = {
  userName: string;
  userID: number;
  userCharacter: string;
  x: number;
  y: number;
  anim: string;
  velocity: Velocity;
  busy: boolean;
  pokemons: string[];
  pokeBalls: Item[];
  increaseStats: Item[];
  increaseHealth: Item[];
  cures: Item[];
};

export type Item = {
  index: string;
  quantity: number;
  category: string;
  type: string;
};

export type ItemContainer = {
  pokeBalls: Item[];
  increaseStats: Item[];
  increaseHealth: Item[];
  cures: Item[];
};

export type Couple = {
  user: User;
  opponent: User;
  haveBattled: boolean;
  knowOpponent: boolean;
  coupleID: number;
};

export type Reference = {
  x: number;
  y: number;
  width: number;
  height: number;
  referenceName: string;
};

export type Pokemon = {
  pokedexNumber: string;
  name: string;
  type: string[];
  weaknesses: string[];
  immunities: string[];
  resistances: string[];
  moveNames: string[];
  ps: number;
  maxPs: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type CureItem = {
  index: string;
  name: string;
  description: string;
  category: string;
  stateCured: string;
};

export type IncreaseItem = {
  index: string;
  name: string;
  description: string;
  category: string;
  incrementAmount: string;
  increaseType: string;
};

export type IncreaseStats = {
  index: string;
  name: string;
  description: string;
  category: string;
  incrementAmount: string;
  statName: string;
};

export type PokeBall = {
  index: string;
  name: string;
  description: string;
  category: string;
  catchProbability: string;
};

export type ItemToString = {
  index: string;
  name: string;
  description: string;
};

export type TeamMember = {
  pokedexNumber: string;
  itemHeld: ItemToString;
  status: string;
};
