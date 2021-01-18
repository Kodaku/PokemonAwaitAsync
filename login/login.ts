import axios from 'axios';
import { url } from '../src/constants/Constants';

const input = document.querySelector('input');
const button = document.getElementById('button');
const div = document.getElementById('container');

button.onclick = function () {
  const value = input.value;
  const newUrl =
    'http://localhost:8000/index.html?name=' + encodeURIComponent(value);
  if (value) {
    console.log(`This is the input value: ${value}`);
    axios
      .post(`${url}/login`, {
        name: value,
      })
      .then((response) => {
        console.log(response.data);
        document.location.href = newUrl;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let p = document.createElement('p');
    let textNode = document.createTextNode('Please enter your name');
    p.appendChild(textNode);
    div.appendChild(p);
  }
};
