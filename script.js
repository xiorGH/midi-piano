const ac = new AudioContext();
let piano = null;

Soundfont.instrument(ac, "acoustic_grand_piano").then(inst => {
  piano = inst;
  document.getElementById('play-btn').disabled = false;
  console.log('¡Piano cargado!');
});

// Solo suena si piano ya cargó:
document.getElementById('play-btn').onclick = () => {
  if (!piano) return alert("Aún cargando el soundfont");
  ac.resume().then(() => {
    console.log(piano);
    alert('AudioContext state:', ac.state);
    piano.play("C4");
  });
};
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
  if (notes[key] && piano) piano.play(notes[key]);
}
window.addEventListener("keydown", playNote, e.key);
let tiles = document.querySelectorAll(".key");
for(let x = 0; x < tiles.length; x++){
  tiles[x].addEventListener("ontouchstart", playNote, tiles[x].id)
}
