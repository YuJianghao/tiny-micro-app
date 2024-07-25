import { createDiv } from "./utils";

const div = createDiv()
div.innerHTML = 'Hello from child.js';
const button = document.createElement('button');
button.innerHTML = 'Click me';
button.onclick = () => {
  const modal = document.createElement('div');
  const shadow = document.createElement('div');
  shadow.style.position = 'fixed';
  shadow.style.top = '0';
  shadow.style.left = '0';
  shadow.style.width = '100%';
  shadow.style.height = '100%';
  shadow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  shadow.style.zIndex = '1000';
  shadow.onclick = () => {
    modal.remove();
    shadow.remove();
  }
  modal.innerHTML = 'Hello from modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = 'white';
  modal.style.padding = '20px';
  modal.style.zIndex = '1001';
  document.body.appendChild(modal);
  document.body.appendChild(shadow);
}
div.appendChild(button);
document.body.appendChild(div);
window.blabla = 'blabla from child';

console.log(window, div, document, window)