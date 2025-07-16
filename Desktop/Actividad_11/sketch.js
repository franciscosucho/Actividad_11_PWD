let song;
let fft;
let playButton;
let playing = false;
let volumeSlider;

function preload() {
    song = loadSound('assets/babilonia.mp3');
}

function setup() {
    let canvas = createCanvas(400, 200);
    canvas.parent('musicBox');
    playButton = select('#playButton');
    playButton.mousePressed(togglePlay);
    fft = new p5.FFT();
    fft.setInput(song);

    volumeSlider = select('#volumeSlider');
    song.setVolume(volumeSlider.value());

    volumeSlider.input(() => {
        song.setVolume(volumeSlider.value());
    });
}

function draw() {
    background(240);
    let spectrum = fft.analyze();
    noStroke();
    for (let i = 0; i < spectrum.length; i += 10) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = map(spectrum[i], 0, 255, 0, height);
        fill(random(100, 255), random(100, 255), random(100, 255));
        rect(x, height - h, width / 64, h);
    }
}

function togglePlay() {
    if (playing) {
        song.pause();
        playButton.html('▶️ Reproducir');
    } else {
        song.loop();
        playButton.html('⏸️ Pausar');
    }
    playing = !playing;
}

document.getElementById('temasPiojos').addEventListener('change', function () {
    if (song && song.isPlaying()) {
        song.stop();
        playing = false;
        playButton.html('▶️ Reproducir');
    }
    document.getElementById("text_cancion").textContent = `Escuchando: ${this.value} `;
    if (this.value == "") {
        alert("Eliga un tema para reproducir")
    } else {
        const selectedSongPath = `assets/${this.value}.mp3`;
        song = loadSound(selectedSongPath, soundLoaded);
    }

});

function soundLoaded() {
    if (song) {
        fft.setInput(song);
        song.setVolume(volumeSlider.value());
    } else {
        console.error("Error: La canción no se pudo cargar.");
    }
}