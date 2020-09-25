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
};
