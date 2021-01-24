import axios from "axios";
import { url } from "~/constants/Constants";
import { Move } from "~/types/myTypes";

export const getMove = (moveName: string) => {
    return new Promise((resolve: (move: Move) => void) => {
      axios
        .get(`${url}/moves/get-move?name=${moveName}`)
        .then((response) => {
          const data = response.data.data.move[0];
          console.log("Got move: ",data);
          resolve({
            name: data.name,
            pp: parseInt(data.pp),
            power: parseInt(data.power),
            type: data.type,
            accuracy: parseInt(data.accuracy),
            typology: data.typology,
          });
        });
    });
  };