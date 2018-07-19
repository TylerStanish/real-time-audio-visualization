// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const coreAudio = require('node-core-audio');

function render(arr){
  console.log(arr);
  let content = document.getElementById('content')

  const width = window.outerWidth;
  for(let i=0; i<16; i++){
    let div = document.createElement('span');
    div.className = 'bar';
    const barPos = i*(width/16);
    div.style.left = barPos + 'px';
    div.style.width = width/16 + 'px';
    content.appendChild(div);
  }
}

function runningAverage(oldVal=0, len, newVal){
  // debugger;
  return (oldVal+newVal)/(len+1);
}

let count = 1;
function processAudio( inputBuffer ) {

  if(count % 8 !== 0){
    return inputBuffer;
  }else{
    count = 1;
  }

  let bars = new Array(16);
  for(let i=0; i<inputBuffer[0].length; i++){
    const index = Math.floor(i/16);
    const distanceBetweenStart = i - index*16;
    bars[index] = runningAverage(bars[index], distanceBetweenStart, inputBuffer[0][i]);
    render(bars);
  }

  return inputBuffer;
}

document.addEventListener("DOMContentLoaded", function(event) {
  let engine = coreAudio.createNewAudioEngine();
  engine.addAudioCallback( processAudio );
  render();
});