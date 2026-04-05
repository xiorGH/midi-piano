const ac = new AudioContext();
let piano = null;
function changeSoundfont(soundfont){
Soundfont.instrument(ac, soundfont).then(inst => {
  piano = inst;
  alert('¡Piano cargado!');
})}
changeSoundfont("acoustic_grand_piano")
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
function playNote(key){
  if (!piano) return alert("Aún cargando el soundfont");
  alert(notes[key]);
  ac.resume().then( () => {if (notes[key] && piano) piano.play(notes[key])})
}
window.addEventListener("keydown", playNote, e.key);
let tiles = document.querySelectorAll(".key");
for(let x = 0; x < tiles.length; x++){
  tiles[x].addEventListener("touchstart", playNote, tiles[x].id)
}
