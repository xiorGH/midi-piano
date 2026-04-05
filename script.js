const ac = new AudioContext();
let piano = null;
var octave = 4;
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
  addMessage("Cargando Sounfont. Espere unos Segundos")
Soundfont.instrument(ac, soundfont).then(inst => {
  piano = inst;
  addMessage("Soundfont Cargado y Listo para Usar");
})}
changeSoundfont("acoustic_grand_piano")
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
function playNote(key){
  if (!piano) return alert("Aún cargando el soundfont");
  ac.resume().then( () => {if (notes[key] && piano){ 
    if(key === "k"){piano.play(notes[key] + (octave + 1))}
    else{piano.play(notes[key] + octave)}
    document.getElementById(key).classList.add("active");
  }})
}
function stopNote(key){
  document.getElementById(key).classList.remove("active");
  piano.stop(notes[key]);
}
window.addEventListener("keydown", () => {playNote(e.key.toLowerCase())});
window.addEventListener("keyup", () => {stopNote(e.key.toLowerCase())});
for(let x = 0; x < tiles.length; x++){
  tiles[x].addEventListener("touchstart", (e) => {
    e.preventDefault();
    playNote(tiles[x].id)})
  tiles[x].addEventListener("touchend", () => {stopNote(tiles[x].id)})
}