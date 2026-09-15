let numerosDisponibles = [];

let pausado = false;

let tiempoEntreNumeros = 5000;

let temporizador;


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

    const decena =
        Math.floor(numero / 10) * 10;

    const unidad =
        numero % 10;

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

    const tablero =
        document.getElementById("tablero");

    tablero.innerHTML = "";

    for (let i = 1; i <= 90; i++) {

        const numero =
            document.createElement("div");

        numero.textContent = i;

        numero.id =
            `numero-${i}`;

        tablero.appendChild(numero);

    }
}


/* =========================
   SACAR NÚMERO
========================= */

function sacarNumero() {

    if (pausado) {
        return;
    }

    if (numerosDisponibles.length === 0) {

        finalizarBingo();

        return;
    }

    const posicion =
        Math.floor(
            Math.random() *
            numerosDisponibles.length
        );

    const numero =
        numerosDisponibles[posicion];

    numerosDisponibles.splice(
        posicion,
        1
    );

    animarBola(numero);
}


/* =========================
   ANIMACIÓN
========================= */

function animarBola(numeroFinal) {

    const bola =
        document.getElementById("numeroActual");

    const texto =
        document.getElementById("numeroTexto");

    bola.classList.remove("animando");

    bola.classList.remove("girando");

    void bola.offsetWidth;

    bola.classList.add("girando");

    let cambios = 0;

    const maxCambios = 12;

    const intervalo =
        setInterval(function () {

            const numeroAleatorio =
                Math.floor(
                    Math.random() * 90
                ) + 1;

            bola.textContent =
                numeroAleatorio;

            cambios++;

            if (cambios >= maxCambios) {

                clearInterval(intervalo);

                bola.textContent =
                    numeroFinal;

                texto.textContent =
                    numeroEnTexto(
                        numeroFinal
                    ).toUpperCase();

                bola.classList.remove(
                    "girando"
                );

                bola.classList.add(
                    "animando"
                );

                marcarNumero(
                    numeroFinal
                );

                añadirUltimoNumero(
                    numeroFinal
                );

                document
                    .getElementById("contador")
                    .textContent =
                    `Quedan ${numerosDisponibles.length} números`;

                decirNumero(
                    numeroFinal
                );

                temporizador =
                    setTimeout(
                        sacarNumero,
                        tiempoEntreNumeros
                    );
            }

        }, 80);
}


/* =========================
   MARCAR TABLERO
========================= */

function marcarNumero(numero) {

    const elemento =
        document.getElementById(
            `numero-${numero}`
        );

    if (elemento) {

        elemento.classList.add(
            "salido"
        );

    }
}


/* =========================
   ÚLTIMOS NÚMEROS
========================= */

function añadirUltimoNumero(numero) {

    const lista =
        document.getElementById(
            "listaUltimosNumeros"
        );

    const elemento =
        document.createElement("div");

    elemento.classList.add(
        "ultimoNumero"
    );

    elemento.textContent =
        numero;

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

let vozActivada = true;

function prepararVoz() {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();
    speechSynthesis.resume();

    const prueba = new SpeechSynthesisUtterance(" ");
    prueba.lang = "es-ES";
    prueba.volume = 0;

    speechSynthesis.speak(prueba);
}

function decirNumero(numero) {
    if (!vozActivada) return;
    if (!("speechSynthesis" in window)) return;

    const texto = numeroEnTexto(numero);

    speechSynthesis.cancel();

    const mensaje = new SpeechSynthesisUtterance(texto);

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
    .addEventListener(
        "click",
        function () {

            pausado = !pausado;

            if (pausado) {

                clearTimeout(
                    temporizador
                );

                this.textContent =
                    "▶️ CONTINUAR";

            } else {

                this.textContent =
                    "⏸️ PAUSAR";

                temporizador =
                    setTimeout(
                        sacarNumero,
                        tiempoEntreNumeros
                    );

            }

        }
    );


/* =========================
   REINICIAR
========================= */

document
    .getElementById("reiniciar")
    .addEventListener(
        "click",
        function () {

            clearTimeout(
                temporizador
            );

            pausado = false;

            document
                .getElementById("pausar")
                .textContent =
                "⏸️ PAUSAR";

            crearNumeros();

            crearTablero();

            document
                .getElementById("numeroActual")
                .textContent =
                "--";

            document
                .getElementById("numeroTexto")
                .textContent =
                "";

            document
                .getElementById(
                    "listaUltimosNumeros"
                )
                .innerHTML =
                "";

            document
                .getElementById("contador")
                .textContent =
                "Quedan 90 números";

            iniciarBingo();

        }
    );


/* =========================
   VELOCIDAD
========================= */

document
    .getElementById("velocidad")
    .addEventListener(
        "change",
        function () {

            tiempoEntreNumeros =
                Number(this.value);

            if (!pausado) {

                clearTimeout(
                    temporizador
                );

                temporizador =
                    setTimeout(
                        sacarNumero,
                        tiempoEntreNumeros
                    );

            }

        }
    );


/* =========================
   FINAL
========================= */

function finalizarBingo() {

    clearTimeout(
        temporizador
    );

    document
        .getElementById("numeroActual")
        .textContent =
        "🎉";

    document
        .getElementById("numeroTexto")
        .textContent =
        "¡BINGO!";

    document
        .getElementById("contador")
        .textContent =
        "Han salido los 90 números";
}


/* =========================
   INICIAR
========================= */

function iniciarBingo() {
    crearNumeros();

    sacarNumero();

    clearInterval(temporizador);

    temporizador = setInterval(() => {
        if (!pausado) {
            sacarNumero();
        }
    }, tiempoEntreNumeros);
}


/* =========================
   ARRANCAR APP
========================= */

crearNumeros();

crearTablero();


/* =========================
   PANTALLA DE INICIO
========================= */

document.getElementById("empezar").addEventListener("click", () => {

    pantallaInicio.classList.add("oculto");
    juego.classList.remove("oculto");
    juego.classList.add("entradaJuego");

    // Activar la voz directamente desde el toque del usuario
    if ("speechSynthesis" in window) {
        speechSynthesis.cancel();

        const mensajeInicial = new SpeechSynthesisUtterance("Bingo");
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
    .addEventListener(
        "click",
        function () {

            vozActivada =
                !vozActivada;

            if (vozActivada) {

                this.textContent = "🔊";

                this.classList.remove(
                    "vozOff"
                );

            } else {

                this.textContent = "🔇";

                this.classList.add(
                    "vozOff"
                );

                speechSynthesis.cancel();
            }

        }
    );


/* =========================
   VOLVER AL INICIO
========================= */

document
    .getElementById("volverInicio")
    .addEventListener(
        "click",
        function () {

            clearTimeout(
                temporizador
            );

            pausado = true;

            const juego =
                document.getElementById(
                    "juego"
                );

            const pantallaInicio =
                document.getElementById(
                    "pantallaInicio"
                );

            juego.classList.add(
                "oculto"
            );

            pantallaInicio.classList.remove(
                "oculto"
            );

            speechSynthesis.cancel();

        }
    );
