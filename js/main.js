/* --- NOT ENOUGH DOUGH MONOCHROME ANIME JS UTILITIES --- */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initMobileMenu();
  initAudioEffects();
  initCounters();
});

/* Monochrome Floating Particles (Ink Stipple Effect) */
function initParticleCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.floor((width * height) / 20000);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* Mobile Navigation Toggle */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
    });
  }
}

/* Subtle Web Audio Synthesizer Beeps */
let audioCtx = null;
let soundEnabled = true;

function initAudioEffects() {
  const btn = document.querySelector('.sound-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    soundEnabled = !soundEnabled;
    btn.innerHTML = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
    if (soundEnabled) playSynthBeep(440, 0.08);
  });

  document.querySelectorAll('.btn, .card, .nav-links a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled && audioCtx) {
        playSynthBeep(600, 0.02);
      }
    });

    el.addEventListener('click', () => {
      if (soundEnabled && audioCtx) {
        playSynthBeep(880, 0.05);
      }
    });
  });
}

function playSynthBeep(freq = 440, duration = 0.08) {
  if (!soundEnabled) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq / 1.5, audioCtx.currentTime + duration);

  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

/* Animated Counters */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target / 40;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            entry.target.innerText = prefix + Math.ceil(count).toLocaleString() + suffix;
            setTimeout(updateCount, 25);
          } else {
            entry.target.innerText = prefix + target.toLocaleString() + suffix;
          }
        };

        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}
