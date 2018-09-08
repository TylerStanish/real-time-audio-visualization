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
    div.style.height = arr[i]*2000000 + 'px';
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
  for(let i=0; i<inputBuffer.length; i++){
    const index = Math.floor(i/16);
    const distanceBetweenStart = i - index*16;
    bars[index] = runningAverage(bars[index], distanceBetweenStart, inputBuffer[i]);
    
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
    inputDevice: 2,
    // outputDevice: 4
    // inputDevice: 1,
    // outputDevice: 0
};

engine.setOptions(options);
console.log(engine.getOptions());
console.log(
  engine.getDeviceName(0), 
  engine.getDeviceName(1), 
  engine.getDeviceName(2), 
  engine.getDeviceName(3), 
  engine.getDeviceName(4)
);


const ft = require('fourier-transform');
const db = require('decibels');

const frequency = 440;
const size = 1024;
const sampleRate = 44100;


engine.addAudioCallback(function (inputBuffer) {
  let spectrum = ft(inputBuffer[0]);
  let decibels = spectrum.map((value) => db.fromGain(value))
  console.log(spectrum);
  console.log(decibels);
  processAudio(spectrum);
  // return inputBuffer;
});
