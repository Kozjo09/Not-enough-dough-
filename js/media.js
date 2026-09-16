/* --- DOUGH ENTERTAINMENT INTERACTIVE MEDIA & SPECTRUM VISUALIZER --- */

document.addEventListener('DOMContentLoaded', () => {
  initAudioPlayer();
  initSpectrumVisualizer();
});

let currentTrack = 0;
const tracks = [
  { title: 'NOT ENOUGH DOUGH - CYBERPUNK THEME', artist: 'Dough Records feat. Jordan & Kelly', freq: 440 },
  { title: 'GOLDEN LOAF (NEON REMIX)', artist: 'DJ Kelly & Jordan Beats', freq: 520 },
  { title: 'QUANTUM BAKE BEATS', artist: 'Dough Synthwave Syndicate', freq: 380 }
];

let isPlaying = false;
let audioVisualizerCtx = null;
let animId = null;

function initAudioPlayer() {
  const playBtn = document.getElementById('play-audio-btn');
  const trackTitleEl = document.getElementById('current-track-title');
  const trackArtistEl = document.getElementById('current-track-artist');
  const prevBtn = document.getElementById('prev-track-btn');
  const nextBtn = document.getElementById('next-track-btn');

  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.innerText = isPlaying ? '⏸️ PAUSE SYNTH' : '▶️ PLAY SYNTH';

    if (isPlaying) {
      if (typeof playSynthBeep === 'function') playSynthBeep(tracks[currentTrack].freq, 0.5);
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      updateTrackInfo();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      updateTrackInfo();
    });
  }

  function updateTrackInfo() {
    if (trackTitleEl) trackTitleEl.innerText = tracks[currentTrack].title;
    if (trackArtistEl) trackArtistEl.innerText = tracks[currentTrack].artist;
    if (isPlaying && typeof playSynthBeep === 'function') {
      playSynthBeep(tracks[currentTrack].freq, 0.4);
    }
  }
}

function initSpectrumVisualizer() {
  const canvas = document.getElementById('spectrum-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function renderVisualizer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 32;
    const barWidth = (canvas.width / bars) - 2;

    for (let i = 0; i < bars; i++) {
      let height = isPlaying
        ? Math.random() * (canvas.height - 20) + 10
        : Math.sin(Date.now() * 0.003 + i) * 15 + 20;

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#ffd700');
      gradient.addColorStop(0.5, '#ff007f');
      gradient.addColorStop(1, '#00f0ff');

      ctx.fillStyle = gradient;
      ctx.fillRect(i * (barWidth + 2), canvas.height - height, barWidth, height);
    }

    requestAnimationFrame(renderVisualizer);
  }

  renderVisualizer();
}
