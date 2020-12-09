import { Couple } from '~/types/myTypes';
import axios from 'axios';
import { url } from '~/constants/Constants';

export const getOpponentPromise = (id: number) => {
  return new Promise((resolve: (opponent: Couple) => void) => {
    axios.get(`${url}/couples/user/${id}`).then((response) => {
      console.log('From promise: ' + response.data);
      const couple = response.data.couple as Couple;
      resolve(couple);
    });
  });
};

export const knowOpponentPromise = (opponentID: number) => {
  return new Promise((resolve: () => void) => {
    axios.get(`${url}/couples/user/known/${opponentID}`).then((response) => {
      console.log('Now I know my opponent');
      resolve();
    });
  });
};

export const getPlayerReply = (spriteName: string) => {
  return new Promise((resolve: (reply: string) => void) => {
    axios.get(`${url}/couples/user/reply/${spriteName}`).then((response) => {
      const data = response.data as { reply: string };
      resolve(data.reply);
    });
  });
};
