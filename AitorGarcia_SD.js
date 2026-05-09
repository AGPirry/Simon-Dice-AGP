const MAX_COLORES_SEQ = 15;
const MAX_COLORES_FACIL = 4;
const MAX_COLORES_DIFICIL = 7;
const MAX_AYUDAS = 3;

const tModo = {
  Facil: 1,
  Dificil: 2,
};

const tColores = {
  Rojo:   0,
  Verde:  1,
  Azul:   2, 
  Dorado: 3,
  Blanco:  4,
  Marron:  5,
  Naranja: 6,
};

// Aqui se recibe un valor del array tColores y devuelve su nombre como un String
function mostrarColor(color) {
  if (color == tColores.Rojo)   
    return "Rojo";
  if (color == tColores.Verde)  
    return "Verde";
  if (color == tColores.Azul)  
    return "Azul";
  if (color == tColores.Dorado) 
    return "Dorado";
  if (color == tColores.Blanco)  
    return "Blanco";
  if (color == tColores.Marron)  
    return "Marrón";
  if (color == tColores.Naranja) 
    return "Naranja";
}

// En esta funcion recibe un carácter que en este caso son las iniciales de los colores (r/v/a/d) y devuelve el valor de tColores, o null si no es ninguno
function charToColor(color) {
  const c = color.toLowerCase();
  if (c == "r") 
    return tColores.Rojo;
  if (c == "v") 
    return tColores.Verde;
  if (c == "a") 
    return tColores.Azul;
  if (c == "d") 
    return tColores.Dorado;
  if (c == "b") 
    return tColores.Blanco;
  if (c == "m") 
    return tColores.Marron;
  if (c == "n") 
    return tColores.Naranja;
    
    return null;
}

// Ahora recibe un número entero del 0 al 3 ya que el array tiene 4 posiciones y devuelve el valor de tColores en esa posición
function intToColor(numero) {
  if (numero == 0) 
    return tColores.Rojo;
  if (numero == 1) 
    return tColores.Verde;
  if (numero == 2) 
    return tColores.Azul;
  if (numero == 3) 
    return tColores.Dorado;
  if (numero == 4) 
    return tColores.Blanco;
  if (numero == 5) 
    return tColores.Marron;
  if (numero == 6) 
    return tColores.Naranja;
}

// Genera y devuelve un array de MAX_COLORES_SEQ colores aleatorios lo que pasa que no los muestra aunque esta creada y por eso hay que ir descubriendolos
function generarSecuencia(modo) {
  const numColores = (modo == tModo.Dificil) ? MAX_COLORES_DIFICIL : MAX_COLORES_FACIL;
  const secuencia = [];
  for (let i = 0; i < MAX_COLORES_SEQ; i++) {
    const aleatorio = Math.floor(Math.random() * numColores);
    secuencia[i] = intToColor(aleatorio);
  }
  return secuencia;
}


// Comprueba si el color introducido en la posición "indice" es correcto, que en este caso "indice" es la posición del color que buscamos
function comprobarColor(secuenciaColores, indice, color) {
  if (secuenciaColores[indice] == color) {
    return true;
  } else {
    return false;
  }
}

// Muestra los primeros 'numero' colores de la secuencia, te dice que memorices la secuencia y pulses Enter cuando creas que la tienes y despues borra la pantalla
async function mostrarSecuencia(secuenciaColores, numero, rl) {
  let texto = "";
  for (let i = 0; i < numero; i++) {
    if (i == 0) {
      texto = mostrarColor(secuenciaColores[i]);
    } else {
      texto = texto + " - " + mostrarColor(secuenciaColores[i]);
    }
  }

  const numSecuencia = numero - 2;
  console.log("\nSecuencia numero " + numSecuencia + ": " + texto);
  await pregunta(rl, "Memoriza la secuencia y pulsa Enter para continuar...");
  console.clear();
}

// Función principal del juego para poder empezar a jugar
async function comenzarJuego(nombre, rl) {
  const secuencia = generarSecuencia();
  let longitudActual = 3;

  while (longitudActual <= MAX_COLORES_SEQ) {
    await mostrarSecuencia(secuencia, longitudActual, rl);

    console.log(nombre + ", introduce la secuencia de " + longitudActual + " colores:");
    console.log("(R = Rojo, V = Verde, A = Azul, D = Dorado)");

    let fallo = false;

    for (let i = 0; i < longitudActual; i++) {
      let colorUsuario = null;

      while (colorUsuario == null) {
        const entrada = await pregunta(rl, "Color " + (i + 1) + ": ");
        colorUsuario = charToColor(entrada.trim());

        if (colorUsuario == null) {
          console.log("Color no válido. Usa R, V, A o D.");
        }
      }

      if (!comprobarColor(secuencia, i, colorUsuario)) {
        console.log("\n¡Fallo! El color " + (i + 1) + " era " + mostrarColor(secuencia[i]) + ".");
        fallo = true;
        break;
      }
    }

    const numSecuencia = longitudActual - 2;

    if (fallo) {
      console.log("Fin de la partida, " + nombre + ". Has fallado en la secuencia numero " + numSecuencia + ".");
      break;
    }

    console.log("\nEnhorabuena, has acertado la secuencia numero " + numSecuencia + ".");

    if (longitudActual == MAX_COLORES_SEQ) {
      console.log("¡Increíble, " + nombre + "! Has completado todas las secuencias. ¡Eres el campeón!");
      break;
    }

    longitudActual++;
  }
}

// ----------------------------------------------------------------
//Desde aqui tuve que preguntar a Claude porque no sabia seguir con las entradas de texto

const readline = require("readline"); 

function pregunta(rl, texto) {
  return new Promise((resolve) => {
    rl.question(texto, resolve);
  });
}

async function main() {
  process.stdin.resume();
  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  });

  console.log("¡Bienvenido a Simon dice!");
  const nombre = await pregunta(rl, "¿Cuál es tu nombre? ");
  console.log("Hola " + nombre + ", pulsa una tecla para empezar a jugar.");

  await pregunta(rl, "");
  await comenzarJuego(nombre, rl);

  rl.close();
}

main().catch(console.error);