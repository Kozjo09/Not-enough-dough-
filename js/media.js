/* --- DOUGH ENTERTAINMENT MONOCHROME SPECTRUM VISUALIZER --- */

document.addEventListener('DOMContentLoaded', () => {
  initAudioPlayer();
  initSpectrumVisualizer();
});

let currentTrack = 0;
const tracks = [
  { title: 'NOT ENOUGH DOUGH - MONOCHROME THEME', artist: 'Dough Records feat. Jordan & Kelly', freq: 440 },
  { title: 'SILENT LOAF (AMBIENT REMIX)', artist: 'DJ Kelly & Jordan Beats', freq: 520 },
  { title: 'QUANTUM BAKE SOUNDSCAPES', artist: 'Dough Synth Syndicate', freq: 380 }
];

let isPlaying = false;

function initAudioPlayer() {
  const playBtn = document.getElementById('play-audio-btn');
  const trackTitleEl = document.getElementById('current-track-title');
  const trackArtistEl = document.getElementById('current-track-artist');
  const prevBtn = document.getElementById('prev-track-btn');
  const nextBtn = document.getElementById('next-track-btn');

  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.innerText = isPlaying ? '⏸️ PAUSE AUDIO' : '▶️ PLAY AUDIO';

    if (isPlaying && typeof playSynthBeep === 'function') {
      playSynthBeep(tracks[currentTrack].freq, 0.4);
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
      playSynthBeep(tracks[currentTrack].freq, 0.3);
    }
  }
}

function initSpectrumVisualizer() {
  const canvas = document.getElementById('spectrum-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function renderVisualizer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 36;
    const barWidth = (canvas.width / bars) - 2;

    for (let i = 0; i < bars; i++) {
      let height = isPlaying
        ? Math.random() * (canvas.height - 15) + 10
        : Math.sin(Date.now() * 0.002 + i) * 12 + 15;

      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#8e8e99';
      ctx.fillRect(i * (barWidth + 2), canvas.height - height, barWidth, height);
    }

    requestAnimationFrame(renderVisualizer);
  }

  renderVisualizer();
}
