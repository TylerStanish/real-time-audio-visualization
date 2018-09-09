const coreAudio = require('node-core-audio')

const WIDTH = 512

function render(arr = new Array(WIDTH)){
  const width = window.outerWidth
  for(let i = 0; i < WIDTH; i++){
    let div = document.getElementById('bar' + i)
    const barPos = i * (width / WIDTH)
    div.style.left = barPos + 'px'
    div.style.width = width / WIDTH + 'px'
    div.style.height = Math.log(i)*arr[i] * 200000 + 'px'
  }
}


function runningAverage(oldVal = 0, len, newVal){
  return (oldVal + newVal) / (len + 1)
}

let count = 1

function processAudio(inputBuffer){
  if(count % 2 === 0){
    // debugger;
    setTimeout(() => render(inputBuffer), 0)
    count = 1;
  }else{ count += 1; }
  return inputBuffer;

  let bars = new Array(WIDTH)
  for(let i = 0; i < inputBuffer.length; i++){
    const index = Math.floor(i / WIDTH)
    const distanceBetweenStart = i - index * WIDTH
    bars[index] = runningAverage(bars[index], distanceBetweenStart, inputBuffer[i])
  }
  if(count % 2 === 0){
    // debugger;
    setTimeout(() => render(bars), 0)
    count = 1;
  }else{ count += 1; }

  return inputBuffer
}

let engine = coreAudio.createNewAudioEngine()

const options = {
  inputChannels: 1,
  outputChannels: 1,
  inputDevice: 2
}

engine.setOptions(options)
console.log(engine.getOptions())
console.log(
  engine.getDeviceName(0),
  engine.getDeviceName(1),
  engine.getDeviceName(2),
  engine.getDeviceName(3),
  engine.getDeviceName(4)
)


const ft = require('fourier-transform/asm')
const db = require('decibels')

function start(){
  const content = document.getElementById('content')
  for(let i = 0; i < WIDTH; i++){
    let span = document.createElement('span')
    span.className = 'bar'
    span.id = 'bar' + i
    content.appendChild(span)
  }
}

document.addEventListener('DOMContentLoaded', start)


engine.addAudioCallback(function(inputBuffer){
  let spectrum = ft(inputBuffer[0])
  let decibels = spectrum.map((value) => db.fromGain(value))
  // console.log(spectrum)
  processAudio(spectrum)
  // return inputBuffer;
})
