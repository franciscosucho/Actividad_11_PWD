// Variables globales para el color loop
let colorTime = 0;
let animationActive = false;
let triangles = [];
let speedMultiplier = 1;

// Función para generar colores en loop (efecto arcoíris)
function getLoopColor(time, offset = 0) {
    const r = Math.sin(time * 0.02 + offset) * 127 + 128;
    const g = Math.sin(time * 0.02 + offset + 2) * 127 + 128;
    const b = Math.sin(time * 0.02 + offset + 4) * 127 + 128;
    return [r, g, b];
}

// Clase para triángulos animados
class AnimatedTriangle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.colorOffset = Math.random() * 10;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.alpha = 255;
        this.fadeSpeed = 2;
    }

    update() {
        this.rotation += this.rotationSpeed * speedMultiplier;
        this.alpha -= this.fadeSpeed;
        return this.alpha > 0;
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);

        const [r, g, b] = getLoopColor(colorTime, this.colorOffset);
        fill(r, g, b, this.alpha);
        stroke(255, this.alpha * 0.5);
        strokeWeight(2);

        // Dibujar triángulo
        triangle(0, -this.size / 2, -this.size / 2, this.size / 2, this.size / 2, this.size / 2);
        pop();
    }
}

// Inicialización de p5.js
function setup() {
    const canvas = createCanvas(600, 400);
    canvas.parent('p5-container');
    background(20);

    // Título inicial en el canvas
    fill(255);
    textAlign(CENTER);
    textSize(24);
    text("🎨 Mueve el mouse para comenzar", width / 2, height / 2);
}

// Función de dibujo de p5.js
function draw() {
    // Fondo semi-transparente para efecto de estela
    fill(20, 30);
    rect(0, 0, width, height);

    if (animationActive) {
        colorTime += speedMultiplier;

        // Dibujar triángulo que sigue el mouse
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            push();
            translate(mouseX, mouseY);

            const [r, g, b] = getLoopColor(colorTime);
            fill(r, g, b, 200);
            stroke(255, 100);
            strokeWeight(2);

            // Triángulo principal que rota
            rotate(colorTime * 0.05);
            triangle(0, -25, -25, 25, 25, 25);
            pop();
        }
    }

    // Actualizar y dibujar triángulos animados
    for (let i = triangles.length - 1; i >= 0; i--) {
        if (triangles[i].update()) {
            triangles[i].draw();
        } else {
            triangles.splice(i, 1);
        }
    }

    // Mostrar información en pantalla
    fill(255, 150);
    textAlign(LEFT);
    textSize(12);
    text(`Triángulos activos: ${triangles.length}`, 10, 20);
    text(`Velocidad: ${speedMultiplier.toFixed(1)}x`, 10, 35);
}

// Función cuando se hace clic
function mousePressed() {
    if (animationActive && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        // Crear múltiples triángulos en la posición del clic
        for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            const size = Math.random() * 40 + 20;
            triangles.push(new AnimatedTriangle(mouseX + offsetX, mouseY + offsetY, size));
        }
    }
}

// Sketch de Processing.js (decoración de fondo)
var sketchProc = function (processing) {
    processing.size(600, 400);
    processing.background(20);

    processing.draw = function () {
        if (animationActive) {
            processing.stroke(100, 50);
            processing.strokeWeight(1);
            processing.noFill();

            // Dibujar líneas decorativas que se mueven
            for (let i = 0; i < 10; i++) {
                const x = (processing.frameCount * 0.5 + i * 60) % 620;
                processing.line(x, 0, x, 400);
            }

            for (let i = 0; i < 6; i++) {
                const y = (processing.frameCount * 0.3 + i * 80) % 420;
                processing.line(0, y, 600, y);
            }
        }
    };
};

// Event listeners para los botones
document.getElementById("start-button").addEventListener("click", function () {
    animationActive = !animationActive;
    this.textContent = animationActive ? "⏸️ Pausar Animación" : "🚀 Iniciar Animación";

    if (animationActive) {
        // Limpiar canvas y mostrar mensaje
        background(20);
        fill(255);
        textAlign(CENTER);
        textSize(16);
        text("🎨 ¡Animación iniciada! Mueve el mouse y haz clic", width / 2, height / 2);
    }
});

document.getElementById("clear-button").addEventListener("click", function () {
    triangles = [];
    background(20);

    if (!animationActive) {
        fill(255);
        textAlign(CENTER);
        textSize(24);
        text("🎨 Canvas limpio - Inicia la animación", width / 2, height / 2);
    }
});

document.getElementById("speed-button").addEventListener("click", function () {
    speedMultiplier = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 0.5 : 1;
    this.textContent = `⚡ Velocidad: ${speedMultiplier.toFixed(1)}x`;
});

// Efecto de partículas en el fondo cuando se mueve el mouse
function mouseMoved() {
    if (animationActive && Math.random() < 0.1) {
        const size = Math.random() * 15 + 5;
        triangles.push(new AnimatedTriangle(mouseX, mouseY, size));
    }
}