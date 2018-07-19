// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

function render(){
  let content = document.getElementById('content')

  const width = window.outerWidth;
  console.log(window.outerWidth);
  for(let i=1; i<=16; i++){
    let div = document.createElement('span');
    div.className = 'bar';
    const barPos = i*(width/16);
    console.log(barPos);
    div.style.left = barPos + 'px';
    content.appendChild(div);
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  render();
});