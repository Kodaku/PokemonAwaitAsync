import axios from 'axios';
import { url } from '~/constants/Constants';
import {
  CureItem,
  IncreaseItem,
  IncreaseStats,
  Item,
  ItemContainer,
  ItemToString,
  PokeBall,
} from '~/types/myTypes';

export const getItemsPromise = (id: number, bagType: string) => {
  return new Promise((resolve: (data: ItemContainer) => void) => {
    axios.get(`${url}/players/items/${bagType}/${id}`).then((response) => {
      resolve(response.data.data as ItemContainer);
    });
  });
};

export const getPokeball = (index: string, bagType: string) => {
  return new Promise((resolve: (data: PokeBall) => void) => {
    axios
      .get(`${url}/${bagType}/poke-balls/get-poke-ball?index=${index}`)
      .then((response) => {
        resolve(response.data.data.item[0]);
      });
  });
};

export const getIncreaseStatsItem = (index: string, bagType: string) => {
  return new Promise((resolve: (data: IncreaseStats) => void) => {
    axios
      .get(`${url}/${bagType}/increasing-stats-item/get-item?index=${index}`)
      .then((response) => {
        resolve(response.data.data.item[0]);
      });
  });
};

export const getIncreaseHealthItem = (index: string, bagType: string) => {
  return new Promise((resolve: (data: IncreaseItem) => void) => {
    axios
      .get(`${url}/${bagType}/increasing-type-items/get-item?index=${index}`)
      .then((response) => {
        resolve(response.data.data.item[0]);
      });
  });
};

export const getCure = (index: string, bagType: string) => {
  return new Promise((resolve: (data: CureItem) => void) => {
    axios
      .get(`${url}/${bagType}/cure-items/get-item?index=${index}`)
      .then((response) => {
        resolve(response.data.data.item[0]);
      });
  });
};

export async function requestText(item: Item): Promise<string> {
  let itemName = '';
  switch (item.type) {
    case 'PokeBall': {
      const pokeBall = await getPokeball(item.index, 'down');
      itemName = pokeBall.name;
      break;
    }
    case 'IncreaseStats': {
      const increaseStats = await getIncreaseStatsItem(item.index, 'down');
      itemName = increaseStats.name;
      break;
    }
    case 'IncreaseHealth': {
      const increaseHealth = await getIncreaseHealthItem(item.index, 'down');
      itemName = increaseHealth.name;
      break;
    }
    case 'Cure': {
      const cure = await getCure(item.index, 'down');
      itemName = cure.name;
      break;
    }
  }
  return itemName;
}

export async function requestTextAndDescription(
  item: Item
): Promise<ItemToString> {
  let itemName: ItemToString = { index: '', name: '', description: '' };
  switch (item.type) {
    case 'PokeBall': {
      const pokeBall = await getPokeball(item.index, 'up');
      itemName.index = pokeBall.index;
      itemName.name = pokeBall.name;
      itemName.description = pokeBall.description;
      break;
    }
    case 'IncreaseStats': {
      const increaseStats = await getIncreaseStatsItem(item.index, 'up');
      itemName.index = increaseStats.index;
      itemName.name = increaseStats.name;
      itemName.description = increaseStats.description;
      break;
    }
    case 'IncreaseHealth': {
      const increaseHealth = await getIncreaseHealthItem(item.index, 'up');
      itemName.index = increaseHealth.index;
      itemName.name = increaseHealth.name;
      itemName.description = increaseHealth.description;
      break;
    }
    case 'Cure': {
      const cure = await getCure(item.index, 'up');
      itemName.index = cure.index;
      itemName.name = cure.name;
      itemName.description = cure.description;
      break;
    }
  }
  return itemName;
}
