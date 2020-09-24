import axios from 'axios';

const input = document.querySelector('input');
const button = document.getElementById('button');
const div = document.getElementById('container');

button.onclick = function () {
  const value = input.value;
  if (value) {
    console.log(`This is the input value: ${value}`);
    axios
      .post('http://localhost:3000/login', {
        name: value,
      })
      .then((response) => {
        console.log(response.data);
        document.location.href = 'index.html';
      });
  } else {
    let p = document.createElement('p');
    let textNode = document.createTextNode('Please enter your name');
    p.appendChild(textNode);
    div.appendChild(p);
  }
};