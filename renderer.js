// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const coreAudio = require('node-core-audio');




function render(arr=new Array(16)){
  let content = document.getElementById('content')

  const width = window.outerWidth;
  for(let i=0; i<16; i++){
    let div = document.createElement('span');
    div.className = 'bar';
    const barPos = i*(width/16);
    div.style.left = barPos + 'px';
    div.style.width = width/16 + 'px';
    div.style.height = arr[i]*1000 + 'px';
    content.appendChild(div);
  }
}



function runningAverage(oldVal=0, len, newVal){
  // debugger;
  return (oldVal+newVal)/(len+1);
}

let count = 1;
function processAudio( inputBuffer ) {

  // if(count % 24 !== 0){
  //   count++;
  //   return inputBuffer;
  // }else{
  //   debugger;
    // count = 1;
  // }

  let bars = new Array(16);
  for(let i=0; i<inputBuffer[0].length; i++){
    const index = Math.floor(i/16);
    const distanceBetweenStart = i - index*16;
    bars[index] = runningAverage(bars[index], distanceBetweenStart, inputBuffer[0][i]);
    // render(bars);
  }

  return inputBuffer;
}


let engine = coreAudio.createNewAudioEngine();
// engine.setOptions({sampleRate: 5000});
// engine.addAudioCallback( processAudio );

setInterval(() => {
  // Grab a buffer
  let buffer = engine.read();
  console.log(buffer);
// Silence the 0th channel
  for( let iSample=0; iSample<buffer[0].length; ++iSample ){
    buffer[0][iSample] = 0.0;
  }
  console.log(buffer);
// Send the buffer back to the sound card
  engine.write(buffer);
}, 1000);
