import axios from 'axios';
import { url } from '~/constants/Constants';
import { User } from '~/types/myTypes';

export const getUserPromise = (id: number) => {
  return new Promise((resolve: (value: User) => void) => {
    axios.get(`${url}/players/user/move/${id}`).then((response) => {
      const user = response.data as User;
      console.log(user);
      resolve(user);
    });
  });
};

export const getPlayersNumber = () => {
  return new Promise((resolve: (total: number) => void) => {
    axios.get(`${url}/players/total`).then((response) => {
      const data = response.data;
      resolve(data.total);
    });
  });
};
