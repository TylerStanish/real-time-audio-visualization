// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const coreAudio = require('node-core-audio');




function render(arr=new Array(16)){
  // let content = document.getElementById('content');
  const width = window.outerWidth;
  for(let i=0; i<16; i++){
    // let div = document.createElement('span');
    let div = document.getElementById('bar' + i);
    // div.className = 'bar';
    const barPos = i*(width/16);
    div.style.left = barPos + 'px';
    div.style.width = width/16 + 'px';
    div.style.height = arr[i]*1e13 + 'px';
    // content.appendChild(div);
  }
}



function runningAverage(oldVal=0, len, newVal){
  // debugger;
  return (oldVal+newVal)/(len+1);
}

let count = 1;
function processAudio( inputBuffer ) {

  let bars = new Array(16);
  for(let i=0; i<inputBuffer[0].length; i++){
    const index = Math.floor(i/16);
    const distanceBetweenStart = i - index*16;
    bars[index] = runningAverage(bars[index], distanceBetweenStart, inputBuffer[0][i]);
    
    // count += 1;
    // if(count % 64 === 0){
    //   console.log(inputBuffer);
    //   console.log(bars);
    //   count = 1;
    // }
    // inputBuffer[0][i] = 0;
    setTimeout(() => render(bars), 0);
  }

  return inputBuffer;
}




// var coreAudio = require("node-core-audio");
let engine = coreAudio.createNewAudioEngine();

var options = {
    inputChannels: 1,
    outputChannels: 1,
    useMicrophone: false,
    // inputDevice: 1,
    // outputDevice: 0
};

engine.setOptions(options);
console.log(engine.getOptions());
console.log(engine.getDeviceName(0), engine.getDeviceName(1));
engine.addAudioCallback(function (inputBuffer) {
  let newBuffer = inputBuffer.slice();
  console.log(inputBuffer);
  return processAudio(newBuffer);
});
