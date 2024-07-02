import { createDiv } from "./lib";

const div = createDiv()
div.innerHTML = 'Hello from child.js';
const button = document.createElement('button');
button.innerHTML = 'Click me';
button.onclick = () => alert('Hello from child.js');
div.appendChild(button);
document.body.appendChild(div);
window.blabla = 'blabla from child';