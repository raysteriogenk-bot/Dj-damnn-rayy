
const music=document.getElementById("music")

function enterSite(){
document.getElementById("welcome").style.display="none"
music.play()
startVisualizer()
startEffects()
}

function startVisualizer(){

const ctxAudio=new AudioContext()
const analyser=ctxAudio.createAnalyser()
const source=ctxAudio.createMediaElementSource(music)

source.connect(analyser)
analyser.connect(ctxAudio.destination)

analyser.fftSize=256

const canvas=document.getElementById("visualizer")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=220

const bufferLength=analyser.frequencyBinCount
const dataArray=new Uint8Array(bufferLength)

function draw(){

requestAnimationFrame(draw)

analyser.getByteFrequencyData(dataArray)

ctx.clearRect(0,0,canvas.width,canvas.height)

let barWidth=canvas.width/bufferLength

for(let i=0;i<bufferLength;i++){

let barHeight=dataArray[i]

ctx.fillStyle="hsl("+i*3+",100%,50%)"

ctx.fillRect(i*barWidth,220-barHeight,barWidth,barHeight)

}

}

draw()

window.analyser=analyser
window.dataArray=dataArray

}

function startEffects(){

const canvas=document.getElementById("effects")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let fireworks=[]
let lasers=[]

function firework(){

let x=Math.random()*canvas.width
let y=Math.random()*canvas.height/2

for(let i=0;i<60;i++){

fireworks.push({
x:x,
y:y,
vx:(Math.random()-0.5)*10,
vy:(Math.random()-0.5)*10,
life:80
})

}

}

function laser(){

lasers.push({
x:Math.random()*canvas.width,
life:20
})

}

function animate(){

requestAnimationFrame(animate)

ctx.clearRect(0,0,canvas.width,canvas.height)

if(window.analyser){

window.analyser.getByteFrequencyData(window.dataArray)

let avg=window.dataArray.reduce((a,b)=>a+b)/window.dataArray.length

if(avg>150){
firework()
laser()
}

}

fireworks.forEach((p,i)=>{

p.x+=p.vx
p.y+=p.vy
p.life--

ctx.beginPath()
ctx.arc(p.x,p.y,3,0,Math.PI*2)
ctx.fillStyle="rgba(255,50,200,0.9)"
ctx.fill()

if(p.life<=0)fireworks.splice(i,1)

})

lasers.forEach((l,i)=>{

ctx.beginPath()
ctx.moveTo(l.x,0)
ctx.lineTo(l.x,canvas.height)
ctx.strokeStyle="rgba(0,255,255,0.8)"
ctx.lineWidth=2
ctx.stroke()

l.life--
if(l.life<=0)lasers.splice(i,1)

})

}

animate()

}
