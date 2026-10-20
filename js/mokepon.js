// URL DEL SERVIDOR (AUTOMÁTICA SEGÚN ENTORNO)
const SERVIDOR_URL = window.location.protocol.startsWith("http")
    ? window.location.origin
    : "http://localhost:8080";

// SECCIONES DEL DOM
const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota");
const sectionVerMapa = document.getElementById("ver-mapa");
const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
const sectionMensajes = document.getElementById("mensajes");
const sectionReiniciar = document.getElementById("reiniciar");

// BOTONES
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");

// ELEMENTOS DE TEXTO Y CONTENEDORES
const spanMascotaJugador = document.getElementById("mascota-jugador");
const spanMascotaEnemigo = document.getElementById("mascota-enemigo");
const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");
const spanAtaqueJugador = document.getElementById("ataque-jugador");
const spanAtaqueEnemigo = document.getElementById("ataque-enemigo");
const resultadoCombate = document.getElementById("resultado-combate");
const contenedorTarjetas = document.getElementById("contenedorTarjetas");
const contenedorAtaques = document.getElementById("contenedorAtaques");

// CANVAS Y MAPA
const mapa = document.getElementById("mapa");
const lienzo = mapa.getContext("2d");

// VARIABLES DEL JUEGO
let jugadorId = null;
let enemigoId = null;
let mokepones = [];
let mokeponesEnemigos = [];
let ataqueJugador = [];
let ataqueEnemigo = [];
let ataquesMokeponEnemigo = [];
let botones = [];

let mascotaJugador = null;
let mascotaJugadorObjeto = null;
let mokeponEnemigo = null;

let victoriasJugador = 0;
let victoriasEnemigo = 0;
let juegoTerminado = false;

let intervalo = null;
let intervaloAtaques = null;

// TAMAÑO DEL MAPA (RESPONSIVO MANTENIENDO RELACIÓN 5:3)
const anchoMaximoMapa = 500;
let anchoDelMapa = window.innerWidth - 40;
if (anchoDelMapa > anchoMaximoMapa) {
    anchoDelMapa = anchoMaximoMapa;
}
if (anchoDelMapa < 300) {
    anchoDelMapa = 300;
}
const altoDelMapa = (anchoDelMapa * 3) / 5;

mapa.width = anchoDelMapa;
mapa.height = altoDelMapa;

// CLASE MOKEPON (CURSO PLATZI 2022)
class Mokepon {
    constructor(nombre, foto, vida, fotoMapa = null, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = [];
        this.ancho = 55;
        this.alto = 55;
        this.x = aleatorio(10, mapa.width - this.ancho - 10);
        this.y = aleatorio(10, mapa.height - this.alto - 10);
        this.mapaFoto = new Image();
        this.mapaFoto.src = fotoMapa || foto;
        this.velocidadX = 0;
        this.velocidadY = 0;
    }

    pintarMokepon() {
        if (this.mapaFoto.complete && this.mapaFoto.naturalWidth > 0) {
            lienzo.drawImage(
                this.mapaFoto,
                this.x,
                this.y,
                this.ancho,
                this.alto
            );
        } else {
            // Fondo de respaldo visible si la imagen demora en cargar
            lienzo.fillStyle = "#FFB000";
            lienzo.fillRect(this.x, this.y, this.ancho, this.alto);
        }
    }
}

// CREACIÓN DE LAS MASCOTAS DEL JUGADOR
const hipodoge = new Mokepon(
    "Hipodoge",
    "./assets/Blastoise Pixel Png - Blastoise Pokemon Rojo Fuego, Transparent Png , Transparent Png Image - PNGitem.jpg",
    5
);

const capipepo = new Mokepon(
    "Capipepo",
    "./assets/Serperior.jpg",
    5
);

const ratigueya = new Mokepon(
    "Ratigueya",
    "./assets/Charizard  Pixel Art.jpg",
    5
);

// LISTA DE ATAQUES DE CADA MOKEPON
const HIPODOGE_ATAQUES = [
    { nombre: "AGUA 💧", id: "boton-agua" },
    { nombre: "AGUA 💧", id: "boton-agua" },
    { nombre: "AGUA 💧", id: "boton-agua" },
    { nombre: "FUEGO 🔥", id: "boton-fuego" },
    { nombre: "TIERRA 🌱", id: "boton-tierra" }
];

const CAPIPEPO_ATAQUES = [
    { nombre: "TIERRA 🌱", id: "boton-tierra" },
    { nombre: "TIERRA 🌱", id: "boton-tierra" },
    { nombre: "TIERRA 🌱", id: "boton-tierra" },
    { nombre: "AGUA 💧", id: "boton-agua" },
    { nombre: "FUEGO 🔥", id: "boton-fuego" }
];

const RATIGUEYA_ATAQUES = [
    { nombre: "FUEGO 🔥", id: "boton-fuego" },
    { nombre: "FUEGO 🔥", id: "boton-fuego" },
    { nombre: "FUEGO 🔥", id: "boton-fuego" },
    { nombre: "AGUA 💧", id: "boton-agua" },
    { nombre: "TIERRA 🌱", id: "boton-tierra" }
];

hipodoge.ataques.push(...HIPODOGE_ATAQUES);
capipepo.ataques.push(...CAPIPEPO_ATAQUES);
ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

mokepones.push(hipodoge, capipepo, ratigueya);

// INICIALIZACIÓN DEL JUEGO
function iniciarJuego() {
    sectionVerMapa.style.display = "none";
    sectionSeleccionarAtaque.style.display = "none";
    sectionReiniciar.style.display = "none";

    // Generar tarjetas de Mokepones dinámicamente
    mokepones.forEach((mokepon) => {
        const opcionDeMokepones = `
            <input
                class="input"
                type="radio"
                name="mascota"
                id="${mokepon.nombre}"
                value="${mokepon.nombre}"
            >
            <label class="label" for="${mokepon.nombre}">
                <div class="imgPet">
                    <img src="${mokepon.foto}" alt="${mokepon.nombre}">
                    <p>${mokepon.nombre}</p>
                </div>
            </label>
        `;
        contenedorTarjetas.innerHTML += opcionDeMokepones;
    });

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);
    botonReiniciar.addEventListener("click", reiniciarJuego);

    // Conectar al backend si el servidor está encendido
    unirseAlJuego();
}

// CONEXIÓN CON EL SERVIDOR NODE.JS (CLASES 67-84)
function unirseAlJuego() {
    fetch(`${SERVIDOR_URL}/unirse`)
        .then(function (res) {
            if (res.ok) {
                res.text().then(function (respuesta) {
                    jugadorId = respuesta;
                    console.log("Conectado al servidor multijugador. ID:", jugadorId);
                });
            }
        })
        .catch(function () {
            console.log("Servidor backend no detectado. Jugando en modo local contra la IA.");
        });
}

// SELECCIONAR MASCOTA DEL JUGADOR
function seleccionarMascotaJugador() {
    const inputHipodoge = document.getElementById("Hipodoge");
    const inputCapipepo = document.getElementById("Capipepo");
    const inputRatigueya = document.getElementById("Ratigueya");

    if (inputHipodoge && inputHipodoge.checked) {
        mascotaJugador = hipodoge.nombre;
    } else if (inputCapipepo && inputCapipepo.checked) {
        mascotaJugador = capipepo.nombre;
    } else if (inputRatigueya && inputRatigueya.checked) {
        mascotaJugador = ratigueya.nombre;
    } else {
        alert("Por favor selecciona una mascota");
        return;
    }

    spanMascotaJugador.innerHTML = mascotaJugador;

    // Enviar elección al servidor si está disponible
    seleccionarMokeponServidor(mascotaJugador);

    // Ocultar selección y abrir mapa
    sectionSeleccionarMascota.style.display = "none";
    sectionVerMapa.style.display = "flex";

    iniciarMapa();
}

function seleccionarMokeponServidor(nombreMascota) {
    if (!jugadorId) return;

    fetch(`${SERVIDOR_URL}/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: nombreMascota
        })
    }).catch((err) => console.log("Error al enviar mascota al servidor:", err));
}

// INICIALIZACIÓN DEL MAPA Y CONTROLES
function iniciarMapa() {
    // Obtener objeto de la mascota seleccionada
    mokepones.forEach((m) => {
        if (m.nombre === mascotaJugador) {
            mascotaJugadorObjeto = new Mokepon(m.nombre, m.foto, m.vida, m.foto);
        }
    });

    mascotaJugadorObjeto.x = 20;
    mascotaJugadorObjeto.y = 20;

    // Inicializar enemigos locales para juego offline o solitario
    crearEnemigosLocales();

    // Eventos de teclado
    window.addEventListener("keydown", sePresionoUnaTecla);
    window.addEventListener("keyup", detenerMovimiento);

    // Loop de renderizado a 20 FPS (50ms) según la clase de Platzi
    intervalo = setInterval(pintarCanvas, 50);
}

// CREACIÓN DE ENEMIGOS LOCALES (FALLBACK / MODO LOCAL)
function crearEnemigosLocales() {
    mokeponesEnemigos = [
        new Mokepon("Hipodoge", hipodoge.foto, 5, hipodoge.foto, "local-hipodoge"),
        new Mokepon("Capipepo", capipepo.foto, 5, capipepo.foto, "local-capipepo"),
        new Mokepon("Ratigueya", ratigueya.foto, 5, ratigueya.foto, "local-ratigueya")
    ];

    // Asignar posiciones separadas en el mapa
    mokeponesEnemigos[0].x = Math.max(120, mapa.width - 80);
    mokeponesEnemigos[0].y = 25;

    mokeponesEnemigos[1].x = Math.max(140, Math.floor(mapa.width / 2));
    mokeponesEnemigos[1].y = Math.max(50, mapa.height - 75);

    mokeponesEnemigos[2].x = Math.max(70, mapa.width - 150);
    mokeponesEnemigos[2].y = Math.floor(mapa.height / 2);
}

// DIBUJAR FONDO RETRO DEL MAPA
function dibujarFondoMapa() {
    // Césped
    lienzo.fillStyle = "#8BCB78";
    lienzo.fillRect(0, 0, mapa.width, mapa.height);

    // Textura de cuadrícula retro suave
    lienzo.strokeStyle = "rgba(105, 175, 85, 0.45)";
    lienzo.lineWidth = 1;
    const pasoCuadricula = 40;
    for (let x = 0; x < mapa.width; x += pasoCuadricula) {
        lienzo.beginPath();
        lienzo.moveTo(x, 0);
        lienzo.lineTo(x, mapa.height);
        lienzo.stroke();
    }
    for (let y = 0; y < mapa.height; y += pasoCuadricula) {
        lienzo.beginPath();
        lienzo.moveTo(0, y);
        lienzo.lineTo(mapa.width, y);
        lienzo.stroke();
    }

    // Camino de arena central horizontal
    const altoCamino = Math.min(50, mapa.height * 0.22);
    const posYCamino = (mapa.height - altoCamino) / 2;
    lienzo.fillStyle = "#E8D8A6";
    lienzo.fillRect(0, posYCamino, mapa.width, altoCamino);

    // Bordes del camino
    lienzo.fillStyle = "#C8B582";
    lienzo.fillRect(0, posYCamino, mapa.width, 3);
    lienzo.fillRect(0, posYCamino + altoCamino - 3, mapa.width, 3);

    // Decoración de zona de batalla central
    lienzo.fillStyle = "rgba(255, 255, 255, 0.25)";
    lienzo.beginPath();
    lienzo.arc(mapa.width / 2, mapa.height / 2, 45, 0, Math.PI * 2);
    lienzo.fill();
    lienzo.strokeStyle = "#FFFFFF";
    lienzo.lineWidth = 2;
    lienzo.stroke();
}

// LOOP PRINCIPAL DEL CANVAS
function pintarCanvas() {
    // Actualizar coordenadas del jugador con velocidad
    mascotaJugadorObjeto.x += mascotaJugadorObjeto.velocidadX;
    mascotaJugadorObjeto.y += mascotaJugadorObjeto.velocidadY;

    // Evitar que el jugador salga de los bordes del mapa
    if (mascotaJugadorObjeto.x < 0) {
        mascotaJugadorObjeto.x = 0;
    }
    if (mascotaJugadorObjeto.x > mapa.width - mascotaJugadorObjeto.ancho) {
        mascotaJugadorObjeto.x = mapa.width - mascotaJugadorObjeto.ancho;
    }
    if (mascotaJugadorObjeto.y < 0) {
        mascotaJugadorObjeto.y = 0;
    }
    if (mascotaJugadorObjeto.y > mapa.height - mascotaJugadorObjeto.alto) {
        mascotaJugadorObjeto.y = mapa.height - mascotaJugadorObjeto.alto;
    }

    // Limpiar y redibujar escenario
    lienzo.clearRect(0, 0, mapa.width, mapa.height);
    dibujarFondoMapa();

    // Pintar la mascota del jugador
    mascotaJugadorObjeto.pintarMokepon();

    // Enviar posición al servidor si hay multijugador activo
    if (jugadorId) {
        enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y);
    }

    // Pintar enemigos y verificar colisiones
    mokeponesEnemigos.forEach((enemigo) => {
        if (enemigo !== undefined && enemigo !== null) {
            enemigo.pintarMokepon();
            revisarColision(enemigo);
        }
    });
}

// SINCRONIZACIÓN DE POSICIÓN CON EL SERVIDOR
function enviarPosicion(x, y) {
    fetch(`${SERVIDOR_URL}/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ x, y })
    })
        .then(function (res) {
            if (res.ok) {
                res.json().then(function ({ enemigos }) {
                    if (enemigos && enemigos.length > 0) {
                        mokeponesEnemigos = enemigos.map(function (enemigo) {
                            let mokeponServidor = null;
                            if (enemigo.mokepon !== undefined && enemigo.mokepon !== null) {
                                const nombre = enemigo.mokepon.nombre;
                                if (nombre === "Hipodoge") {
                                    mokeponServidor = new Mokepon("Hipodoge", hipodoge.foto, 5, hipodoge.foto, enemigo.id);
                                } else if (nombre === "Capipepo") {
                                    mokeponServidor = new Mokepon("Capipepo", capipepo.foto, 5, capipepo.foto, enemigo.id);
                                } else if (nombre === "Ratigueya") {
                                    mokeponServidor = new Mokepon("Ratigueya", ratigueya.foto, 5, ratigueya.foto, enemigo.id);
                                }
                                if (mokeponServidor) {
                                    mokeponServidor.x = enemigo.x;
                                    mokeponServidor.y = enemigo.y;
                                }
                            }
                            return mokeponServidor;
                        }).filter(Boolean);
                    }
                });
            }
        })
        .catch(function () {
            // Si el servidor falla temporalmente, se mantienen los enemigos locales
        });
}

// MOVIMIENTO Y CONTROLES
function moverArriba() {
    mascotaJugadorObjeto.velocidadY = -5;
}

function moverAbajo() {
    mascotaJugadorObjeto.velocidadY = 5;
}

function moverIzquierda() {
    mascotaJugadorObjeto.velocidadX = -5;
}

function moverDerecha() {
    mascotaJugadorObjeto.velocidadX = 5;
}

function detenerMovimiento() {
    if (mascotaJugadorObjeto) {
        mascotaJugadorObjeto.velocidadX = 0;
        mascotaJugadorObjeto.velocidadY = 0;
    }
}

function sePresionoUnaTecla(evento) {
    switch (evento.key) {
        case "ArrowUp":
        case "w":
        case "W":
            evento.preventDefault();
            moverArriba();
            break;
        case "ArrowDown":
        case "s":
        case "S":
            evento.preventDefault();
            moverAbajo();
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            evento.preventDefault();
            moverIzquierda();
            break;
        case "ArrowRight":
        case "d":
        case "D":
            evento.preventDefault();
            moverDerecha();
            break;
        default:
            break;
    }
}

// DETECCIÓN DE COLISIONES (ALGORITMO AABB DE PLATZI)
function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;

    const arribaMascota = mascotaJugadorObjeto.y;
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto;
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho;
    const izquierdaMascota = mascotaJugadorObjeto.x;

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return; // No hay colisión
    }

    // ¡COLISIÓN DETECTADA!
    detenerMovimiento();
    clearInterval(intervalo);

    enemigoId = enemigo.id;
    mokeponEnemigo = enemigo;

    // Transición de pantalla: ocultar mapa y abrir combate
    sectionVerMapa.style.display = "none";
    sectionSeleccionarAtaque.style.display = "block";

    iniciarCombate(enemigo);
}

// INICIAR COMBATE TRAS COLISIÓN
function iniciarCombate(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre;
    spanVidasJugador.innerHTML = "0";
    spanVidasEnemigo.innerHTML = "0";
    spanAtaqueJugador.innerHTML = "Esperando...";
    spanAtaqueEnemigo.innerHTML = "Esperando...";
    resultadoCombate.innerHTML = "¡QUE COMIENCE EL COMBATE!";
    resultadoCombate.className = "";
    
    ataqueJugador = [];
    ataqueEnemigo = [];
    victoriasJugador = 0;
    victoriasEnemigo = 0;
    juegoTerminado = false;

    // Asignar ataques del enemigo según su tipo
    if (enemigo.nombre === "Hipodoge") {
        ataquesMokeponEnemigo = HIPODOGE_ATAQUES;
    } else if (enemigo.nombre === "Capipepo") {
        ataquesMokeponEnemigo = CAPIPEPO_ATAQUES;
    } else {
        ataquesMokeponEnemigo = RATIGUEYA_ATAQUES;
    }

    // Extraer y mostrar ataques del jugador
    extraerAtaques(mascotaJugador);
}

// EXTRAER Y RENDERIZAR ATAQUES DEL JUGADOR
function extraerAtaques(nombreMascota) {
    let ataques = [];

    mokepones.forEach((mokepon) => {
        if (nombreMascota === mokepon.nombre) {
            ataques = mokepon.ataques;
        }
    });

    mostrarAtaques(ataques);
}

function mostrarAtaques(ataques) {
    contenedorAtaques.innerHTML = "";

    ataques.forEach((ataque, index) => {
        const botonAtaque = `
            <button
                class="button ataq BAtaque"
                id="${ataque.id}-${index}"
                type="button"
            >
                ${ataque.nombre}
            </button>
        `;
        contenedorAtaques.innerHTML += botonAtaque;
    });

    botones = document.querySelectorAll(".BAtaque");
    secuenciaAtaque();
}

// SECUENCIA DE SELECCIÓN DE 5 ATAQUES
function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if (juegoTerminado || ataqueJugador.length >= 5) {
                return;
            }

            const textoAtaque = e.currentTarget.textContent;

            if (textoAtaque.includes("FUEGO")) {
                ataqueJugador.push("FUEGO");
            } else if (textoAtaque.includes("AGUA")) {
                ataqueJugador.push("AGUA");
            } else {
                ataqueJugador.push("TIERRA");
            }

            boton.style.background = "#112f58";
            boton.disabled = true;

            // En modo local o cuando el enemigo no es un jugador remoto real
            if (!jugadorId || !enemigoId || enemigoId.toString().startsWith("local")) {
                ataqueAleatorioEnemigo();
            }

            // Si ya se eligieron los 5 ataques
            if (ataqueJugador.length === 5) {
                if (jugadorId && enemigoId && !enemigoId.toString().startsWith("local")) {
                    enviarAtaquesServidor();
                } else {
                    while (ataqueEnemigo.length < 5) {
                        ataqueAleatorioEnemigo();
                    }
                    iniciarPelea();
                }
            }
        });
    });
}

// ATAQUE ALEATORIO DEL ENEMIGO (MODO LOCAL)
function ataqueAleatorioEnemigo() {
    if (ataquesMokeponEnemigo.length === 0) {
        ataquesMokeponEnemigo = HIPODOGE_ATAQUES;
    }

    const ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length - 1);
    const ataque = ataquesMokeponEnemigo[ataqueAleatorio];

    if (ataque.nombre.includes("FUEGO")) {
        ataqueEnemigo.push("FUEGO");
    } else if (ataque.nombre.includes("AGUA")) {
        ataqueEnemigo.push("AGUA");
    } else {
        ataqueEnemigo.push("TIERRA");
    }
}

// MULTIJUGADOR: ENVIAR Y OBTENER ATAQUES
function enviarAtaquesServidor() {
    fetch(`${SERVIDOR_URL}/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    }).then(() => {
        resultadoCombate.innerHTML = "Esperando los ataques de tu rival...";
        intervaloAtaques = setInterval(obtenerAtaquesServidor, 50);
    }).catch(() => {
        // Fallback a ataques locales si la petición falla
        while (ataqueEnemigo.length < 5) {
            ataqueAleatorioEnemigo();
        }
        iniciarPelea();
    });
}

function obtenerAtaquesServidor() {
    fetch(`${SERVIDOR_URL}/mokepon/${enemigoId}/ataques`)
        .then((res) => {
            if (res.ok) {
                res.json().then(({ ataques }) => {
                    if (ataques && ataques.length === 5) {
                        ataqueEnemigo = ataques;
                        clearInterval(intervaloAtaques);
                        iniciarPelea();
                    }
                });
            }
        })
        .catch(() => {
            clearInterval(intervaloAtaques);
            while (ataqueEnemigo.length < 5) {
                ataqueAleatorioEnemigo();
            }
            iniciarPelea();
        });
}

// EVALUAR COMBATE CUANDO AMBOS TIENEN 5 ATAQUES
function iniciarPelea() {
    if (ataqueJugador.length === 5 && ataqueEnemigo.length === 5) {
        combate();
    }
}

// RESOLUCIÓN DE LAS 5 RONDAS
function combate() {
    const resultados = [];

    for (let index = 0; index < ataqueJugador.length; index++) {
        const ataqueJ = ataqueJugador[index];
        const ataqueE = ataqueEnemigo[index];

        if (ataqueJ === ataqueE) {
            resultados.push(`Ronda ${index + 1}: EMPATE`);
        } else if (
            (ataqueJ === "FUEGO" && ataqueE === "TIERRA") ||
            (ataqueJ === "AGUA" && ataqueE === "FUEGO") ||
            (ataqueJ === "TIERRA" && ataqueE === "AGUA")
        ) {
            resultados.push(`Ronda ${index + 1}: GANASTE`);
            victoriasJugador++;
        } else {
            resultados.push(`Ronda ${index + 1}: PERDISTE`);
            victoriasEnemigo++;
        }
    }

    // Actualizar contadores de victorias
    spanVidasJugador.innerHTML = victoriasJugador;
    spanVidasEnemigo.innerHTML = victoriasEnemigo;

    // Mostrar historial de ataques
    spanAtaqueJugador.innerHTML = ataqueJugador.join(" - ");
    spanAtaqueEnemigo.innerHTML = ataqueEnemigo.join(" - ");

    // Mostrar resumen de rondas en el centro
    resultadoCombate.innerHTML = resultados.join("<br>");

    // Aplicar estilos visuales al resultado central
    resultadoCombate.classList.remove("ganaste", "perdiste", "empate");
    if (victoriasJugador > victoriasEnemigo) {
        resultadoCombate.classList.add("ganaste");
    } else if (victoriasJugador < victoriasEnemigo) {
        resultadoCombate.classList.add("perdiste");
    } else {
        resultadoCombate.classList.add("empate");
    }

    // Comprobar resultado final del combate
    revisarVidas();
}

// REVISAR RESULTADO FINAL
function revisarVidas() {
    if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("¡FELICITACIONES! GANASTE EL COMBATE 🏆");
    } else if (victoriasJugador < victoriasEnemigo) {
        crearMensajeFinal("¡LO SIENTO! PERDISTE EL COMBATE 💀");
    } else {
        crearMensajeFinal("¡COMBATE EMPATADO! GRAN BATALLA 🤝");
    }
}

// MENSAJE FINAL Y BOTÓN DE REINICIO
function crearMensajeFinal(mensaje) {
    juegoTerminado = true;

    sectionMensajes.innerHTML = "";
    const parrafo = document.createElement("p");
    parrafo.id = "mensajeFinal";
    parrafo.innerHTML = mensaje;
    sectionMensajes.appendChild(parrafo);

    sectionReiniciar.style.display = "block";

    botones.forEach((boton) => {
        boton.disabled = true;
    });
}

// REINICIAR
function reiniciarJuego() {
    location.reload();
}

// NÚMERO ALEATORIO ENTRE MIN Y MAX (INCLUSIVO)
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// INICIAR AL CARGAR LA PÁGINA
window.addEventListener("load", iniciarJuego);
