const ac = new AudioContext();
let piano = null;
var octave = 4;
var instruments;
fetch("https://raw.githubusercontent.com/danigb/soundfont-player/master/names/fluidR3.json").then(response => {
  if(!response.ok){console.log("Couldn't fetch")}
  return response.json();
})
.then(data => {
  instruments = data;
  for(let x = 0; x < instruments.length; x++){document.getElementById("sound").innerHTML += `<option>${instruments[x]}</option>`;
  }
})
function addMessage(txt){
  let msg = document.getElementById("message");
  var time;
  msg.classList.remove("show");
  clearTimeout(time)
  setTimeout(() => {
  msg.textContent = txt;
  msg.classList.add("show");
  time = setTimeout(() => {msg.classList.remove("show")}, 2000)}, 450)
}
function changeSoundfont(soundfont){
  if(piano){
    if(piano.name === soundfont){
     return addMessage("Soundfont ya Aplicado");
    }
  }
  if(!instruments.includes(soundfont))  {
    addMessage("Soundfont no Disponible. Prueba con Otro");
    return;
  }
  addMessage("Cargando Soundfont. Espere unos Segundos");
Soundfont.instrument(ac, soundfont).then(inst => {
  piano = inst;
  console.log(JSON.stringify(piano));
  addMessage("Soundfont Cargado y Listo para Usar");
})}
addMessage("Importando Soundfonts")
const load = setInterval(() => {
  if(!instruments){
    if(!navigator.online){
      addMessage("Sin Acceso a Internet. Conéctate y Recarga la Página");
      clearInterval(load);
    }
    return console.log("Loading…")}
  changeSoundfont("acoustic_grand_piano");
  document.getElementById("search").value = "acoustic_grand_piano";
  document.getElementById("search").addEventListener("keydown", (e) => {if(e.key === "Enter"){changeSoundfont(document.getElementById("search").value})})
  document.getElementById("changer").addEventListener("click", () => {changeSoundfont(document.getElementById("search").value)})
  clearInterval(load)
}, 1000)
function screenFull(){
  let box = document.getElementById("check").classList
  if(box.contains("true")){
  if(document.exitFullscreen){document.exitFullscreen()}
    addMessage("Pantalla Completa Desactivada");
    box.remove("true")
  }
  else{
    if(document.documentElement.requestFullscreen){document.documentElement.requestFullscreen()}
    addMessage("Pantalla Completa Activada");
    box.add("true")
  }
}
const notes = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B",
  k: "C"
};
let tiles = document.querySelectorAll(".key");
function changeOctave(up){
  if(up){
    if(octave === 7){octave = 1}
    else{octave++}
  }
  else{
    if(octave === 1){octave = 7}
    else{octave--}
  }
  document.getElementById("counter").textContent = octave
}
var playing;
function playNote(key){
  key = key.toLowerCase();
  if (!piano){return addMessage("Soundfont Pendiente")}
  ac.resume().then( () => {if (notes[key] && piano){ 
    if(key === "k"){playing = piano.play(notes[key] + (octave + 1))}
    else{playing = piano.play(notes[key] + octave)}
    document.getElementById(key).classList.add("active");
  }})
}
function stopNote(key){
  playing.stop(ac.currentTime + 0.2);
  document.getElementById(key).classList.remove("active");
}
window.addEventListener("keydown", () => {playNote(e.key)});
window.addEventListener("keyup", () => {stopNote(e.key)});
for(let x = 0; x < tiles.length; x++){
  tiles[x].addEventListener("touchstart", (e) => {
    e.preventDefault();
    playNote(tiles[x].id)})
  tiles[x].addEventListener("touchend", () => {stopNote(tiles[x].id)})
}
