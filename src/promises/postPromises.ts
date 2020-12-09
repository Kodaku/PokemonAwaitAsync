import axios from 'axios';
import { url } from '~/constants/Constants';
import { User } from '~/types/myTypes';

export const postPosition = (player: User) => {
  if (player) {
    return new Promise((resolve: (ok: string) => void) => {
      axios
        .put(`${url}/players/user/move/${player[1]}`, {
          userName: player[0].userName,
          userID: player[1],
          userCharacter: player[0].userCharacter,
          x: player[0].x,
          y: player[0].y,
          anim: player[0].anim,
          velocity: { vx: player[0].velocity.vx, vy: player[0].velocity.vy },
          busy: player[0].busy,
        })
        .then((response) => {
          // console.log(response.data);
          resolve('success');
        });
    });
  } else {
    return;
  }
};
