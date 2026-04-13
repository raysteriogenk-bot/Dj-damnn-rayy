const audio = document.getElementById("music");

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const fireCanvas = document.getElementById("fireworks");
const fireCtx = fireCanvas.getContext("2d");

function resize(){
canvas.width = window.innerWidth;
canvas.height = 220;
fireCanvas.width = window.innerWidth;
fireCanvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let analyser;
let dataArray;
let started = false;

function startFestival(){

if(started) return;
started = true;

audio.play();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

analyser = audioCtx.createAnalyser();

const source = audioCtx.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;

let bufferLength = analyser.frequencyBinCount;
dataArray = new Uint8Array(bufferLength);

visualize();
}

function visualize(){

requestAnimationFrame(visualize);

analyser.getByteFrequencyData(dataArray);

ctx.clearRect(0,0,canvas.width,canvas.height);

let barWidth = (canvas.width/dataArray.length)*2;
let x = 0;
let energy = 0;

for(let i=0;i<dataArray.length;i++){
let barHeight = dataArray[i];
energy += barHeight;

ctx.fillStyle = "rgb("+(barHeight+100)+",50,200)";
ctx.fillRect(x,canvas.height-barHeight,barWidth,barHeight);

x += barWidth + 1;
}

energy = energy/dataArray.length;

if(energy > 100){
launchFirework();
}

updateFireworks();
}

let fireworks=[];

function launchFirework(){
fireworks.push({
x:Math.random()*fireCanvas.width,
y:Math.random()*fireCanvas.height/2,
radius:2,
life:80
});
}

function updateFireworks(){
fireCtx.clearRect(0,0,fireCanvas.width,fireCanvas.height);

for(let i=0;i<fireworks.length;i++){
let f = fireworks[i];

fireCtx.beginPath();
fireCtx.arc(f.x,f.y,f.radius,0,Math.PI*2);
fireCtx.fillStyle="white";
fireCtx.fill();

f.radius += 3;
f.life--;

if(f.life<=0){
fireworks.splice(i,1);
}
}
}
