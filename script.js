const ac = new AudioContext();
let piano = null;
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
  let box = document.getElementById("check").classList;
  console.log("You know what box is, right?");
  if(box.contains("true"){
    if(document.exitFullscreen){document.exitFullscreeen()}
    addMessage("Pantalla Completa Desactivada");
    box.remove("true");
  }
  else{
    if(document.body.requestFullscreen){document.body.requestFullscreen()}
    addMessage("Pantalla Completa Activada");
    box.add("true")
}}
const notes = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",
  k: "C5"
};
let tiles = document.querySelectorAll(".key");
function playNote(key){
  if (!piano) return alert("Aún cargando el soundfont");
  ac.resume().then( () => {if (notes[key] && piano){ 
    piano.play(notes[key]);
    document.getElementById(key).classList.add("active");
  }})
}
function stopNote(key){
  document.getElementById(key).classList.remove("active")
}
window.addEventListener("keydown", () => {playNote(e.key.toLowerCase())});
window.addEventListener("keyup", () => {stopNote(e.key.toLowerCase())});
for(let x = 0; x < tiles.length; x++){
  tiles[x].addEventListener("touchstart", () => {playNote(tiles[x].id)})
  tiles[x].addEventListener("touchend", () => {stopNote(tiles[x].id)})
}
