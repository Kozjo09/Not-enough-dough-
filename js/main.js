/* --- NOT ENOUGH DOUGH MONOCHROME ANIME JS UTILITIES --- */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initMobileMenu();
  initCounters();
  initCrispChat();
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
  const particleCount = Math.min(Math.floor((width * height) / 22000), 50);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.25 + 0.1;
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

        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - dist / 90)})`;
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
        const speed = Math.max(target / 30, 1);

        const updateCount = () => {
          count += speed;
          if (count < target) {
            entry.target.innerText = prefix + Math.ceil(count).toLocaleString() + suffix;
            setTimeout(updateCount, 30);
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


/* Crisp Headless Chat Handler */
function initCrispChat() {
  const chatForm = document.getElementById("chat-form");
  const chatMessages = document.getElementById("chat-messages");
  const chatMessageInput = document.getElementById("chat-message");
  const chatNameInput = document.getElementById("chat-name");
  const chatEmailInput = document.getElementById("chat-email");

  if (!chatForm || !chatMessages || !chatMessageInput) return;

  window.$crisp = window.$crisp || [];

  // Listen for incoming operator replies from Crisp
  window.$crisp.push(["on", "message:received", function(message) {
    if (message && message.origin === "operator" && message.type === "text") {
      appendMessage("operator", "JORDAN & KELLY // SUPPORT", message.content);
    }
  }]);

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userMessage = chatMessageInput.value.trim();
    if (!userMessage) return;

    if (chatEmailInput && chatEmailInput.value.trim()) {
      window.$crisp.push(["set", "user:email", [chatEmailInput.value.trim()]]);
    }
    if (chatNameInput && chatNameInput.value.trim()) {
      window.$crisp.push(["set", "user:nickname", [chatNameInput.value.trim()]]);
    }

    // Forward message to Crisp
    window.$crisp.push(["do", "message:send", ["text", userMessage]]);

    // Append message to custom message container
    const senderName = chatNameInput && chatNameInput.value.trim() ? chatNameInput.value.trim().toUpperCase() : "YOU";
    appendMessage("user", senderName, userMessage);

    // Clear textarea input
    chatMessageInput.value = "";
  });

  function appendMessage(senderType, senderName, text) {
    const emptyNotice = chatMessages.querySelector(".chat-empty-notice");
    if (emptyNotice) {
      emptyNotice.remove();
    }

    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${senderType}-message`;

    const senderDiv = document.createElement("div");
    senderDiv.className = "chat-sender";
    senderDiv.textContent = senderName;

    const contentDiv = document.createElement("div");
    contentDiv.style.whiteSpace = "pre-wrap";
    contentDiv.textContent = text;

    msgDiv.appendChild(senderDiv);
    msgDiv.appendChild(contentDiv);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
