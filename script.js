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
    addMessage("Soundfont no Disponible. Prueba con Otra");
    return;
  }
  addMessage("Cargando Soundfont. Espere unos Segundos");
Soundfont.instrument(ac, soundfont).then(inst => {
  piano = inst;
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
  document.getElementById("search").addEventListener("keydown", (e) => {if(e.key === "Enter"){changeSoundfont(document.getElementById("search").value)}})
  document.getElementById("changer").addEventListener("click", () => {changeSoundfont(document.getElementById("search").value)});
  clearInterval(load);
  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  addMessage("Si estás usando un Móvil, Recomiendo usar la Interfaz Vertical")
}
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
  Nq: {char: "C", num: 0},
  N1: {char: "C#", num: 0},
  Na: {char: "D", num: 0},
  N2: {char: "D#", num: 0},
  Nw: {char: "E", num: 0},
  Ns: {char: "F", num: 0},
  N3: {char: "F#", num: 0},
  Ne: {char: "G", num: 0},
  N4: {char: "G#", num: 0},
  Nd: {char: "A", num: 0},
  N5: {char: "A#", num: 0},
  Nr: {char: "B", num: 0},
  Ny: {char: "C", num: 1},
  N6: {char: "C#", num: 1},
  Nh: {char: "D", num: 1},
  N7: {char: "D#", num: 1},
  Nu: {char: "E", num: 1},
  Nj: {char: "F", num: 1},
  N8: {char: "F#", num: 1},
  Ni: {char: "G", num: 1},
  N9: {char: "G#", num: 1},
  Nk: {char: "A", num: 1},
  N0: {char: "A#", num: 1},
  No: {char: "B", num: 1},
  Nl: {char: "C", num: 2},
};
let tiles = document.querySelectorAll(".key");
function changeOctave(up){
  if(up){
    if(octave === 6){octave = 1}
    else{octave++}
  }
  else{
    if(octave === 1){octave = 6}
    else{octave--}
  }
  document.getElementById("counter").textContent = octave + "/" + (octave + 1)
}
const playing = [];
function playNote(key){
  key = key.toLowerCase();
  let nkey = "N" + key;
  if (!piano){return addMessage("Soundfont Pendiente")}
  ac.resume().then( () => {if (notes[nkey] && piano){
    let id = notes[nkey].char + (octave + notes[nkey].num)
    const note = piano.play(id);
    note.id = id;
    playing.push(note)
    document.getElementById(key).classList.add("active");
  }})
}
function stopNote(key){
  key = key.toLowerCase();
  let nkey = "N" + key;
  let id = notes[nkey].char + (octave + notes[nkey].num)
  var note;
  for(let x = 0; x < playing.length; x++){
    if(playing[x].id === id){
      note = x;
      break;
    }
  }
  playing[note].stop(ac.currentTime + 0.2);
  playing.splice(note, 1);
  document.getElementById(key).classList.remove("active");
}
window.addEventListener("keydown", (e) => {playNote(e.key)})
window.addEventListener("keyup", (e) => {stopNote(e.key)});
window.addEventListener("keydown", (e) => {
  if(e.key === "left"){changeOctave(false)}
  else if(e.key === "right"){changeOctave(true)}
})
// Objeto para rastrear qué tecla tiene cada dedo (soporta múltiples dedos)
let activeTouches = {}; 

function getElementFromTouch(touch) {
  return document.elementFromPoint(touch.clientX, touch.clientY);
}

const keysContainer = document.getElementById("keys");

keysContainer.addEventListener("touchstart", (e) => {
  e.preventDefault();
  // Iteramos por todos los dedos nuevos que tocaron la pantalla
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const el = getElementFromTouch(touch);
    
    if (el && el.classList.contains("key")) {
      activeTouches[touch.identifier] = el.id;
      playNote(el.id);
    }
  }
}, { passive: false });

keysContainer.addEventListener("touchmove", (e) => {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const el = getElementFromTouch(touch);
    const lastKeyId = activeTouches[touch.identifier];

    if (el && el.classList.contains("key")) {
      const newKeyId = el.id;
      // Si el dedo se movió a una tecla distinta
      if (newKeyId !== lastKeyId) {
        if (lastKeyId) stopNote(lastKeyId); // Apaga la tecla anterior de ESTE dedo
        activeTouches[touch.identifier] = newKeyId;
        playNote(newKeyId);
      }
    } else if (lastKeyId) {
      // Si el dedo se salió de las teclas
      stopNote(lastKeyId);
      delete activeTouches[touch.identifier];
    }
  }
}, { passive: false });

keysContainer.addEventListener("touchend", (e) => {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const lastKeyId = activeTouches[touch.identifier];
    if (lastKeyId) {
      stopNote(lastKeyId);
      delete activeTouches[touch.identifier];
    }
  }
})

keysContainer.addEventListener("touchcancel", (e) => {
  // Maneja interrupciones (como una notificación o salir de la app)
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    if (activeTouches[touch.identifier]) {
      stopNote(activeTouches[touch.identifier]);
      delete activeTouches[touch.identifier];
    }
  }
});
