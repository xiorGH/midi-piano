import { Synth } from 'https://cdn.jsdelivr.net/npm/spessasynth_core@4.2.7/dist/index.min.js';

const audioContext = new AudioContext();
let synth = null;

// 1. Carga del archivo
document.getElementById('sf2-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        // Despertar el audio (Vital en móviles)
        if (audioContext.state === 'suspended') await audioContext.resume();

        const arrayBuffer = await file.arrayBuffer();
        
        // Creamos el sintetizador
        synth = new Synth(audioContext, arrayBuffer);
        
        alert("¡LOGRADO! Piano listo: " + file.name);
    } catch (err) {
        // Si el error es vacío, esto nos dirá qué tipo de objeto es
        alert("Error detallado: " + (err.message || err.name || "Error desconocido de acceso"));
        console.error(err);
    }
});

// 2. Mapa de notas (Basado en tus IDs del HTML)
const midiMap = {
    'a': 60, 'w': 61, 's': 62, 'e': 63, 'd': 64, 
    'f': 65, 't': 66, 'g': 67, 'y': 68, 'h': 69, 
    'u': 70, 'j': 71, 'k': 72
};

// 3. Funciones de sonido (Sustain incluido)
function tocar(nota, id) {
    if (!synth) return;
    synth.noteOn(0, nota, 100);
    document.getElementById(id)?.classList.add('active');
}

function soltar(nota, id) {
    if (!synth) return;
    synth.noteOff(0, nota);
    document.getElementById(id)?.classList.remove('active');
}

// 4. Eventos de Teclado
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (midiMap[key] && !e.repeat) tocar(midiMap[key], key);
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (midiMap[key]) soltar(midiMap[key], key);
});

// 5. Eventos Táctiles (Móviles)
Object.keys(midiMap).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
        el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            tocar(midiMap[key], key);
        }, {passive: false});

        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            soltar(midiMap[key], key);
        }, {passive: false});
    }
});
