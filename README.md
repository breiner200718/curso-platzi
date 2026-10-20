# 🎮 MOKEPON! 🔥💧🌱

Videojuego web interactivo desarrollado con **HTML5**, **CSS3**, **JavaScript (ES6+)** y un backend en **Node.js con Express**, inspirado en el emblemático proyecto práctico del **Curso Gratis de Programación Básica (2022)** de **Platzi**.

El juego combina selección dinámica de personajes, exploración de mapas en `<canvas>`, detección de colisiones 2D en tiempo real, combate táctico por rondas y soporte multijugador cliente-servidor con sincronización de posiciones y ataques.

---

## 🎓 Certificado de Aprobación

Este proyecto fue desarrollado y completado satisfactoriamente como parte del **Curso de Programación Básica** de **Platzi**.

- 👤 **Estudiante:** Breiner Arteaga
- 📜 **Diploma Oficial:** [Ver Certificación en Platzi](https://platzi.com/p/breinerarteaga54/curso/3208-programacion-basica-2022/diploma/detalle/)
- 📄 **Copia en PDF:** [`./certificado/diploma-programacion-basica-platzi.pdf`](./certificado/diploma-programacion-basica-platzi.pdf)
- 🔑 **Código de verificación:** `8a6b4a7b-e874-4564-b9e9-b7df65d1ac84`
- ⏱️ **Carga horaria:** 29 horas de teoría y práctica
- 📅 **Fecha:** 20 de Octubre de 2026

---

## ✨ Características Principales

- **Programación Orientada a Objetos (POO):** Modelado modular mediante la clase `Mokepon` (nombre, vidas, ataques, avatares, coordenadas y métodos de renderizado).
- **Inyección Dinámica en el DOM:** Generación automática de tarjetas de selección de mascotas y botones de ataque a partir de arrays de datos.
- **Mapa en Canvas 2D:**
  - Renderizado dinámico a 20 FPS (intervalo de 50 ms).
  - Fondo de campo de batalla con estética retro y límites de mapa para evitar desbordes.
  - Detección precisa de colisiones bidimensionales mediante el algoritmo **AABB** (*Axis-Aligned Bounding Box*).
- **Controles Híbridos (Móvil y Escritorio):**
  - Controles por teclado: Teclas de dirección (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) y controles clásicos (`W`, `A`, `S`, `D`).
  - Controles táctiles en pantalla: Botones direccionales optimizados con eventos `onmousedown`, `onmouseup`, `ontouchstart` y `ontouchend`.
- **Sistema de Combate por Rondas (5 Ataques):**
  - Reglas elementales clásicas:
    - 🔥 **FUEGO** vence a 🌱 **TIERRA**
    - 💧 **AGUA** vence a 🔥 **FUEGO**
    - 🌱 **TIERRA** vence a 💧 **AGUA**
  - Registro de ataques seleccionados en secuencia, cálculo de victorias y panel de resultados con estados visuales (`.ganaste`, `.perdiste`, `.empate`).
- **Backend Multijugador con Express y CORS:**
  - API REST que administra jugadores activos, posiciones concurrentes y sincronización de ataques.
- **Modo Dual Resiliente:**
  - **Modo Multijugador:** Se activa automáticamente al iniciar el servidor Node.js.
  - **Modo Local (Offline):** Si no hay servidor en ejecución (o se abre directamente con Live Server / navegador), el juego genera rivales automáticos en el mapa para permitir partidas en solitario fluidas sin arrojar errores.
- **Diseño Visual Retro:**
  - Tipografía pixel art *"Press Start 2P"*.
  - Efectos visuales de botones 3D, sombras suaves, gradientes oscuros y diseño totalmente responsivo adaptado a dispositivos móviles.

---

## 📁 Estructura del Proyecto

```text
moquepon/
├── assets/                     # Sprites e imágenes de las mascotas
│   ├── Blastoise Pixel Png...  # Avatar de Hipodoge
│   ├── Serperior.jpg           # Avatar de Capipepo
│   └── Charizard  Pixel Art.jpg# Avatar de Ratigueya
├── certificado/                # Certificado oficial de aprobación
│   └── diploma-programacion-basica-platzi.pdf
├── js/
│   └── mokepon.js              # Lógica del cliente, Canvas, colisiones y combate
├── index.js                    # Servidor backend Node.js (Express + CORS)
├── mokepon.html                # Estructura semántica del juego
├── styles.css                  # Hoja de estilos con diseño retro arcade
├── package.json                # Dependencias y scripts de Node.js
├── .gitignore                  # Exclusión de dependencias (node_modules)
└── README.md                   # Documentación oficial del proyecto
```

---

## 🚀 Requisitos e Instalación

### Requisitos previos
- Tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior).

### Instalación
1. Clona o descarga este repositorio en tu equipo.
2. Abre una terminal dentro del directorio del proyecto (`moquepon`).
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

---

## 🕹️ Cómo Ejecutar el Juego

### Opción 1: Modo Multijugador (Recomendado)
1. En la terminal del proyecto, inicia el servidor:
   ```bash
   npm start
   ```
2. Abre tu navegador favorito e ingresa a:
   ```
   http://localhost:8080
   ```
3. *Para probar el modo multijugador:* Abre una segunda pestaña en modo incógnito (o ingresa desde otro dispositivo conectado a la misma red local usando tu IP local `http://TU_IP_LOCAL:8080`). Ambos jugadores aparecerán en el mapa simultáneamente.

### Opción 2: Modo Local / Solitario
- Puedes abrir el archivo `mokepon.html` directamente en tu navegador o utilizando la extensión **Live Server** de VS Code. El juego detectará automáticamente la ausencia del backend y desplegará rivales controlados por la computadora en el mapa.

---

## 🥋 Reglas y Flujo de Juego

1. **Elegir Mascota:**
   - Selecciona a tu compañero: **Hipodoge** 💧, **Capipepo** 🌱 o **Ratigueya** 🔥, y presiona **Seleccionar**.
2. **Explorar el Mapa:**
   - Mueve a tu personaje por el campo de batalla usando el teclado o los botones táctiles en pantalla.
   - Encuentra a un Mokepon rival en el mapa y colisiona con él para comenzar la batalla.
3. **Seleccionar Ataques:**
   - Elige 5 ataques estratégicamente en el orden que prefieras. Cada ataque utilizado quedará bloqueado.
4. **Resolución del Combate:**
   - Una vez definidos los 5 ataques, el sistema evaluará las 5 rondas, sumando victorias al jugador y al rival.
   - El marcador mostrará al ganador final con la opción de reiniciar la partida.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - HTML5 (Canvas API, etiquetas semánticas)
  - CSS3 (Flexbox, Media Queries, diseño adaptativo, Google Fonts)
  - JavaScript ES6+ (Clases, Promesas, Fetch API, Event Listeners)
- **Backend:**
  - Node.js
  - Express.js (Enrutamiento y servicio de estáticos)
  - CORS (Cross-Origin Resource Sharing)

---

## 📚 Créditos y Agradecimientos

Proyecto desarrollado y completado siguiendo la guía del **Curso Gratis de Programación Básica (84 clases)** de [Platzi](https://platzi.com/), manteniendo los estilos visuales originales personalizados.
