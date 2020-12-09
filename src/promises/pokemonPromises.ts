import axios from 'axios';
import { url } from '~/constants/Constants';
import { Pokemon, TeamMember } from '~/types/myTypes';

export const getTeamPromise = (id: number) => {
  return new Promise((resolve: (data: TeamMember[]) => void) => {
    axios.get(`${url}/players/pokemons/${id}`).then((response) => {
      resolve(response.data.data.pokemons);
    });
  });
};

export const getPokemon = (pokemonNumber: string) => {
  return new Promise((resolve: (pokemons: Pokemon) => void) => {
    axios
      .get(`${url}/pokemons/get-pokemon?pokedexNumber=${pokemonNumber}`)
      .then((response) => {
        const data = response.data.data.pokemon[0];
        resolve({
          pokedexNumber: data.pokedexNumber,
          name: data.name,
          type: data.type,
          weaknesses: data.weaknesses,
          immunities: data.immunities,
          resistances: data.resistances,
          moveNames: data.moveNames,
          ps: parseInt(data.ps),
          attack: parseInt(data.attack),
          defense: parseInt(data.defense),
          specialAttack: parseInt(data.specialAttack),
          specialDefense: parseInt(data.specialDefense),
          speed: parseInt(data.speed),
        });
      });
  });
};

export async function getPokemons(
  pokemonNumbers: TeamMember[]
): Promise<Pokemon[]> {
  let pokemons: Pokemon[] = [];
  for (let i = 0; i < pokemonNumbers.length; i++) {
    const pokemon = await getPokemon(pokemonNumbers[i].pokedexNumber);
    pokemons[i] = pokemon;
  }
  return pokemons;
}
