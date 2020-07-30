// definimos el modelo
let recognizer;
// esta variable es
let words;
// definimos las palabras a reconocer, estas son todas las que hay
const wordList = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "yes", "no", "up", "down", "left", "right", "stop", "go"];
// si el modelo esta cargado
let modelLoaded = false;
// elemento del switch
const switchMicro = document.getElementById('switch');


// funcion para cargar el modelo
async function loadModel() {
  // When calling `create()`, you must provide the type of the audio input.
  // - BROWSER_FFT uses the browser's native Fourier transform.
  // creamos el modelo
  recognizer = speechCommands.create("BROWSER_FFT");
  // esperamso a crearlo
  await recognizer.ensureModelLoaded();
  // tramos las palabras que el modelo alcanza a reconocer, que son las que ya definimos
  words = recognizer.wordLabels();
  // el modelo fue cragado
  modelLoaded = true;
  // mandamos una alerta
  // M.toast({ html: 'Modelo cargado :)', classes: 'rounded teal' });
}

// funcion para escuchar
function startListening() {
  // escuchamos con el modelo, y obtenemos los scores
  recognizer.listen(({ scores }) => {

    // cada que evaluemos con el modelo este retornara un array con puntajes
    // basado en los datos construiremos un array nuevo con los puntajes correspondientes a las palabras
    scores = Array.from(scores).map((s, i) => ({ score: s, word: words[i] }));

    // ordenamos los puntajes
    scores.sort((s1, s2) => s2.score - s1.score);

    // obtenemos el indice de la palabra dentro de nuestra lista
    word = scores[0].word; // obtenemos la palabra
    index_word = wordList.indexOf(word); // y el indice de esta

    // remarcamos la palabra que fue predicha
    const elementId = `word-${index_word}`;
    console.log(elementId);
    document.getElementById(elementId).classList.add('active');

    // y esperamos 2.5 segundos para desactivarla
    setTimeout(() => {
      document.getElementById(elementId).classList.remove('active');
    }, 1000);
  },
    {
      // esta es como la probabilidad minima para tomar en cuenta un resultado
      probabilityThreshold: 0.90
      // en pocas palabras es como el indice de seguridad de prediccion, 0 - 1
    });
}

// funcion para dejar de escuchar
function stopListening() {
  recognizer.stopListening();
}

// una vez que se cargue el documento, sera como la funcion principal
document.addEventListener('DOMContentLoaded', () => {
  loadModel()
  // si el switch se cambia
  switchMicro.addEventListener('change', (event) => {
    // si el switch esta en true
    if (event.target.checked) {
      // si tenemos el modelo cargado
      if (modelLoaded) {
        // procedemos a escuchar
        startListening();
      }
      // si el modelo no ha sido cargado
      else {
        // pues lo cargamos
        loadModel();
      }
    }
    // si el switch esta en false
    else {
      // dejamos de escuchar
      stopListening();
    }
  });
});

