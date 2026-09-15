```javascript
let numerosDisponibles = [];

let pausado = false;
let jugando = false;

let tiempoEntreNumeros = 5000;

let temporizador = null;
let intervaloAnimacion = null;

let vozActivada = true;


/* =========================
   NÚMERO EN ESPAÑOL
========================= */

function numeroEnTexto(numero) {

    const unidades = [
        "",
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve"
    ];

    const especiales = {
        10: "diez",
        11: "once",
        12: "doce",
        13: "trece",
        14: "catorce",
        15: "quince",
        16: "dieciséis",
        17: "diecisiete",
        18: "dieciocho",
        19: "diecinueve",

        20: "veinte",
        21: "veintiuno",
        22: "veintidós",
        23: "veintitrés",
        24: "veinticuatro",
        25: "veinticinco",
        26: "veintiséis",
        27: "veintisiete",
        28: "veintiocho",
        29: "veintinueve"
    };

    const decenas = {
        30: "treinta",
        40: "cuarenta",
        50: "cincuenta",
        60: "sesenta",
        70: "setenta",
        80: "ochenta",
        90: "noventa"
    };

    if (numero < 10) {
        return unidades[numero];
    }

    if (especiales[numero]) {
        return especiales[numero];
    }

    const decena = Math.floor(numero / 10) * 10;
    const unidad = numero % 10;

    if (unidad === 0) {
        return decenas[decena];
    }

    return `${decenas[decena]} y ${unidades[unidad]}`;
}


/* =========================
   CREAR NÚMEROS
========================= */

function crearNumeros() {

    numerosDisponibles = [];

    for (let i = 1; i <= 90; i++) {
        numerosDisponibles.push(i);
    }
}


/* =========================
   CREAR TABLERO
========================= */

function crearTablero() {

    const tablero = document.getElementById("tablero");

    if (!tablero) return;

    tablero.innerHTML = "";

    for (let i = 1; i <= 90; i++) {

        const numero = document.createElement("div");

        numero.textContent = i;
        numero.id = `numero-${i}`;

        tablero.appendChild(numero);
    }
}


/* =========================
   SACAR NÚMERO
========================= */

function sacarNumero() {

    if (!jugando || pausado) {
        return;
    }

    if (numerosDisponibles.length === 0) {
        finalizarBingo();
        return;
    }

    // Elegir número aleatorio
    const posicion = Math.floor(
        Math.random() * numerosDisponibles.length
    );

    const numero = numerosDisponibles.splice(
        posicion,
        1
    )[0];

    // Animar y anunciar
    animarBola(numero);
}


/* =========================
   ANIMACIÓN DE LA BOLA
========================= */

function animarBola(numeroFinal) {

    const bola = document.getElementById("numeroActual");
    const texto = document.getElementById("numeroTexto");

    if (!bola || !texto) return;

    // Cancelar cualquier animación anterior
    if (intervaloAnimacion !== null) {
        clearInterval(intervaloAnimacion);
        intervaloAnimacion = null;
    }

    bola.classList.remove("animando");
    bola.classList.remove("girando");

    void bola.offsetWidth;

    bola.classList.add("girando");

    let cambios = 0;

    const maxCambios = 12;

    intervaloAnimacion = setInterval(() => {

        // Si hemos pausado, detener la animación
        if (pausado || !jugando) {
            clearInterval(intervaloAnimacion);
            intervaloAnimacion = null;
            return;
        }

        const numeroAleatorio =
            Math.floor(Math.random() * 90) + 1;

        bola.textContent = numeroAleatorio;

        cambios++;

        if (cambios >= maxCambios) {

            clearInterval(intervaloAnimacion);
            intervaloAnimacion = null;

            bola.textContent = numeroFinal;

            texto.textContent =
                numeroEnTexto(numeroFinal).toUpperCase();

            bola.classList.remove("girando");
            bola.classList.add("animando");

            marcarNumero(numeroFinal);

            añadirUltimoNumero(numeroFinal);

            const contador =
                document.getElementById("contador");

            if (contador) {
                contador.textContent =
                    `Quedan ${numerosDisponibles.length} números`;
            }

            // Decir el número
            decirNumero(numeroFinal);

            // PROGRAMAR SOLO AQUÍ EL SIGUIENTE
            programarSiguienteNumero();
        }

    }, 80);
}


/* =========================
   PROGRAMAR SIGUIENTE NÚMERO
========================= */

function programarSiguienteNumero() {

    // Cancelar cualquier temporizador anterior
    if (temporizador !== null) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    if (!jugando || pausado) {
        return;
    }

    if (numerosDisponibles.length === 0) {
        finalizarBingo();
        return;
    }

    temporizador = setTimeout(() => {

        temporizador = null;

        if (!jugando || pausado) {
            return;
        }

        sacarNumero();

    }, tiempoEntreNumeros);
}


/* =========================
   MARCAR TABLERO
========================= */

function marcarNumero(numero) {

    const elemento =
        document.getElementById(`numero-${numero}`);

    if (elemento) {
        elemento.classList.add("salido");
    }
}


/* =========================
   ÚLTIMOS NÚMEROS
========================= */

function añadirUltimoNumero(numero) {

    const lista =
        document.getElementById("listaUltimosNumeros");

    if (!lista) return;

    const elemento =
        document.createElement("div");

    elemento.classList.add("ultimoNumero");

    elemento.textContent = numero;

    lista.prepend(elemento);

    if (lista.children.length > 5) {

        lista.removeChild(
            lista.lastChild
        );
    }
}


/* =========================
   VOZ
========================= */

function prepararVoz() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();
    speechSynthesis.resume();

    const prueba =
        new SpeechSynthesisUtterance(" ");

    prueba.lang = "es-ES";
    prueba.volume = 0;

    speechSynthesis.speak(prueba);
}


function decirNumero(numero) {

    if (!vozActivada) {
        return;
    }

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();
    speechSynthesis.resume();

    const mensaje =
        new SpeechSynthesisUtterance(
            numeroEnTexto(numero)
        );

    mensaje.lang = "es-ES";
    mensaje.rate = 0.8;
    mensaje.pitch = 1;
    mensaje.volume = 1;

    speechSynthesis.speak(mensaje);
}


/* =========================
   PAUSAR / CONTINUAR
========================= */

document
    .getElementById("pausar")
    .addEventListener("click", function () {

        if (!jugando) {
            return;
        }

        pausado = !pausado;

        if (pausado) {

            // Cancelar siguiente número
            clearTimeout(temporizador);
            temporizador = null;

            // Detener animación
            if (intervaloAnimacion !== null) {
                clearInterval(intervaloAnimacion);
                intervaloAnimacion = null;
            }

            this.textContent =
                "▶️ CONTINUAR";

        } else {

            this.textContent =
                "⏸️ PAUSAR";

            // Continuar con un único temporizador
            programarSiguienteNumero();
        }

    });


/* =========================
   REINICIAR
========================= */

document
    .getElementById("reiniciar")
    .addEventListener("click", function () {

        // Cancelar absolutamente todo
        clearTimeout(temporizador);
        temporizador = null;

        if (intervaloAnimacion !== null) {
            clearInterval(intervaloAnimacion);
            intervaloAnimacion = null;
        }

        speechSynthesis.cancel();

        pausado = false;
        jugando = true;

        this.blur();

        document
            .getElementById("pausar")
            .textContent = "⏸️ PAUSAR";

        crearNumeros();

        crearTablero();

        document
            .getElementById("numeroActual")
            .textContent = "--";

        document
            .getElementById("numeroTexto")
            .textContent = "";

        document
            .getElementById("listaUltimosNumeros")
            .innerHTML = "";

        document
            .getElementById("contador")
            .textContent =
            "Quedan 90 números";

        // Sacar el primer número inmediatamente
        sacarNumero();
    });


/* =========================
   VELOCIDAD
========================= */

document
    .getElementById("velocidad")
    .addEventListener("change", function () {

        tiempoEntreNumeros =
            Number(this.value);

        // Si estamos jugando, reiniciamos
        // SOLO el temporizador.
        if (jugando && !pausado) {

            clearTimeout(temporizador);
            temporizador = null;

            programarSiguienteNumero();
        }

    });


/* =========================
   FINAL DEL BINGO
========================= */

function finalizarBingo() {

    jugando = false;

    clearTimeout(temporizador);
    temporizador = null;

    if (intervaloAnimacion !== null) {
        clearInterval(intervaloAnimacion);
        intervaloAnimacion = null;
    }

    speechSynthesis.cancel();

    document
        .getElementById("numeroActual")
        .textContent = "🎉";

    document
        .getElementById("numeroTexto")
        .textContent = "¡BINGO!";

    document
        .getElementById("contador")
        .textContent =
        "Han salido los 90 números";
}


/* =========================
   INICIAR BINGO
========================= */

function iniciarBingo() {

    clearTimeout(temporizador);
    temporizador = null;

    if (intervaloAnimacion !== null) {
        clearInterval(intervaloAnimacion);
        intervaloAnimacion = null;
    }

    crearNumeros();

    pausado = false;
    jugando = true;

    // Primer número inmediatamente
    sacarNumero();
}


/* =========================
   ARRANCAR APP
========================= */

crearNumeros();

crearTablero();


/* =========================
   PANTALLA DE INICIO
========================= */

document
    .getElementById("empezar")
    .addEventListener("click", function () {

        const pantallaInicio =
            document.getElementById("pantallaInicio");

        const juego =
            document.getElementById("juego");

        pantallaInicio.classList.add("oculto");

        juego.classList.remove("oculto");

        juego.classList.add("entradaJuego");

        // Inicializar voz desde el toque del usuario
        prepararVoz();

        if ("speechSynthesis" in window) {

            const mensajeInicial =
                new SpeechSynthesisUtterance("Bingo");

            mensajeInicial.lang = "es-ES";
            mensajeInicial.rate = 0.8;
            mensajeInicial.volume = 0;

            speechSynthesis.speak(mensajeInicial);
        }

        iniciarBingo();
    });


/* =========================
   BOTÓN DE VOZ
========================= */

document
    .getElementById("voz")
    .addEventListener("click", function () {

        vozActivada = !vozActivada;

        if (vozActivada) {

            this.textContent = "🔊";

            this.classList.remove("vozOff");

        } else {

            this.textContent = "🔇";

            this.classList.add("vozOff");

            speechSynthesis.cancel();
        }

    });


/* =========================
   VOLVER AL INICIO
========================= */

document
    .getElementById("volverInicio")
    .addEventListener("click", function () {

        clearTimeout(temporizador);
        temporizador = null;

        if (intervaloAnimacion !== null) {
            clearInterval(intervaloAnimacion);
            intervaloAnimacion = null;
        }

        jugando = false;
        pausado = true;

        speechSynthesis.cancel();

        const juego =
            document.getElementById("juego");

        const pantallaInicio =
            document.getElementById("pantallaInicio");

        juego.classList.add("oculto");

        pantallaInicio.classList.remove("oculto");

    });
```
