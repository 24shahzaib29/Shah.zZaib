/**
 * ====================================================================
 * SHAHZAIB - FRONT-END DEVELOPER PORTFOLIO
 * Vanilla JavaScript Engine (No external libraries or dependencies)
 * ====================================================================
 */

'use strict';

/* ====================================================================
 * 1. CONFIGURATION SECTION - CUSTOMIZE YOUR DETAILS HERE
 * ====================================================================
 * Replace the placeholder contact information below with your actual
 * details. This single configuration object controls all contact links
 * and the WhatsApp integration throughout the site.
 */
const CONFIG = {
  // Your WhatsApp number: Country code + phone number (DIGITS ONLY, NO SPACES OR '+')
  WHATSAPP_NUMBER: '923496146037',

  // Display phone number formatting (used for tel: dialer link)
  PHONE_NUMBER: '+92 349 6146037',

  // Raw phone digits for the tel: link protocol
  PHONE_TEL_LINK: '+923496146037',

  // Direct contact email address
  EMAIL_ADDRESS: 'shahzaib107027@gmail.com',

  // Public LinkedIn profile URL
  LINKEDIN_URL: 'https://www.linkedin.com/in/shahzaib-jamshaid-401605405/?isSelfProfile=true',

  // Developer Display Details
  NAME: 'Shahzaib',
  ROLE: 'Front-End Developer',
  LOCATION: 'Pakistan'
};

/* ====================================================================
 * 2. WEB AUDIO API - TACTILE SOUND SYNTHESIS
 * ====================================================================
 */
class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem('shahzaib_sound_enabled') !== 'false';
  }

  init() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('shahzaib_sound_enabled', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.init();
      this.playClick();
    }
    return this.enabled;
  }

  triggerVisualizer() {
    const visualizer = document.getElementById('audio-visualizer-box');
    if (!visualizer) return;
    visualizer.classList.add('is-playing');
    setTimeout(() => {
      visualizer.classList.remove('is-playing');
    }, 350);
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    this.triggerVisualizer();

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio autoplay handled
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    this.triggerVisualizer();

    try {
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const start = now + (i * 0.05);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.03, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(start);
        osc.stop(start + 0.12);
      });
    } catch {
      // Audio autoplay handled
    }
  }
}

const sound = new SoundEngine();

/* ====================================================================
 * 3. CONFIGURATION INJECTION
 * ====================================================================
 */
function applyConfiguration() {
  document.querySelectorAll('[data-config="phone-link"]').forEach(el => {
    el.setAttribute('href', `tel:${CONFIG.PHONE_TEL_LINK}`);
  });
  document.querySelectorAll('[data-config="phone-text"]').forEach(el => {
    el.textContent = CONFIG.PHONE_NUMBER;
  });

  document.querySelectorAll('[data-config="whatsapp-link"]').forEach(el => {
    el.setAttribute('href', `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`);
  });
  document.querySelectorAll('[data-config="whatsapp-text"]').forEach(el => {
    el.textContent = `+${CONFIG.WHATSAPP_NUMBER}`;
  });

  document.querySelectorAll('[data-config="email-link"]').forEach(el => {
    el.setAttribute('href', `mailto:${CONFIG.EMAIL_ADDRESS}`);
  });
  document.querySelectorAll('[data-config="email-text"]').forEach(el => {
    el.textContent = CONFIG.EMAIL_ADDRESS;
  });

  document.querySelectorAll('[data-config="linkedin-link"]').forEach(el => {
    el.setAttribute('href', CONFIG.LINKEDIN_URL);
  });
}

/* ====================================================================
 * 4. LOADING SCREEN (Matches Top Left in Image)
 * ====================================================================
 */
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('loading-progress');
  if (!loadingScreen || !progressBar) return;

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 12;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          document.body.classList.remove('is-loading');
        }, 500);
      }, 250);
    }
  }, 75);

  setTimeout(() => {
    if (loadingScreen.style.display !== 'none') {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.body.classList.remove('is-loading');
      }, 500);
    }
  }, 3000);
}

/* ====================================================================
 * 5. ANIMATED BACKGROUND CANVAS (Cosmic Green Smoke & Filaments)
 * ====================================================================
 */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      const speed = prefersReducedMotion ? 0.1 : 0.45;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
      this.baseAlpha = Math.random() * 0.45 + 0.2;
      this.alpha = this.baseAlpha;
      this.pulse = Math.random() * Math.PI;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
      this.pulse += 0.02;
      this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.15;
    }
    draw(isMorning) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = isMorning
        ? `rgba(5, 150, 105, ${this.alpha * 0.6})`
        : `rgba(0, 255, 136, ${this.alpha})`;
      ctx.fill();
    }
  }

  let particles = [];
  function populate() {
    const count = width < 768 ? 25 : 55;
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  populate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    populate();
  });

  let waveOffset = 0;

  function loop() {
    const isMorning = document.documentElement.getAttribute('data-theme') === 'morning';
    ctx.clearRect(0, 0, width, height);

    // Subtle atmospheric cosmic green smoke wave
    if (!isMorning && !prefersReducedMotion) {
      waveOffset += 0.002;
      const grad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(waveOffset) * 150,
        height * 0.35 + Math.cos(waveOffset * 0.8) * 100,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, 'rgba(0, 255, 136, 0.06)');
      grad.addColorStop(0.5, 'rgba(0, 180, 100, 0.02)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    const maxDist = width < 768 ? 90 : 120;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      particles[i].update();
      particles[i].draw(isMorning);

      if (!prefersReducedMotion) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isMorning ? 0.1 : 0.18);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isMorning
              ? `rgba(5, 150, 105, ${lineAlpha})`
              : `rgba(0, 255, 136, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ====================================================================
 * 6. HERO SECTION TYPEWRITER EFFECT
 * ====================================================================
 */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Front-End Developer',
    'Web Designer',
    'Creative Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function step() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(step, typingSpeed);
  }

  setTimeout(step, 600);
}

/* ====================================================================
 * 7. THEME SWITCHER (Header Pill + Side Widgets)
 * ====================================================================
 */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const nightBtn = document.getElementById('theme-btn-night');
  const morningBtn = document.getElementById('theme-btn-morning');

  function setMode(mode) {
    if (mode === 'morning') {
      document.documentElement.setAttribute('data-theme', 'morning');
      localStorage.setItem('shahzaib_theme', 'morning');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('shahzaib_theme', 'night');
    }
  }

  const saved = localStorage.getItem('shahzaib_theme') || 'night';
  setMode(saved);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sound.playClick();
      const current = document.documentElement.getAttribute('data-theme') === 'morning' ? 'morning' : 'night';
      setMode(current === 'night' ? 'morning' : 'night');
    });
  }

  if (nightBtn) {
    nightBtn.addEventListener('click', () => {
      sound.playClick();
      setMode('night');
    });
  }

  if (morningBtn) {
    morningBtn.addEventListener('click', () => {
      sound.playClick();
      setMode('morning');
    });
  }
}

/* ====================================================================
 * 8. SOUND CONTROLS & TEST BUTTON
 * ====================================================================
 */
function initSound() {
  const toggleBtn = document.getElementById('sound-toggle');
  const testBtn = document.getElementById('test-sound-btn');

  function updateIcon(enabled) {
    if (!toggleBtn) return;
    toggleBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    toggleBtn.style.opacity = enabled ? '1' : '0.4';
  }

  updateIcon(sound.enabled);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const state = sound.toggle();
      updateIcon(state);
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', () => {
      sound.playSuccess();
    });
  }

  // Hook sound to all clickable elements
  document.querySelectorAll('button:not(#sound-toggle), .btn, .action-contact-card, .footer-icon-circle').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
    });
  });
}

/* ====================================================================
 * 9. RESPONSIVE NAVIGATION & SCROLL OBSERVER
 * ====================================================================
 */
function initNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      sound.playClick();
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ====================================================================
 * 10. PROJECT MODAL (+ Add Project)
 * ====================================================================
 */
function initProjectModal() {
  const addBtn = document.getElementById('add-project-btn');
  const modal = document.getElementById('add-project-modal');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!modal) return;

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      sound.playClick();
      modal.style.display = 'flex';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sound.playClick();
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}

/* ====================================================================
 * 11. SCROLL REVEAL
 * ====================================================================
 */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(el => observer.observe(el));
}

/* ====================================================================
 * 12. WHATSAPP CONTACT FORM
 * ====================================================================
 */
function initContactForm() {
  const form = document.getElementById('whatsapp-contact-form');
  const banner = document.getElementById('form-status-banner');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sound.playClick();

    // Clear previous errors
    [errorName, errorEmail, errorMessage].forEach(el => {
      if (el) el.style.display = 'none';
    });
    [nameInput, emailInput, messageInput].forEach(el => {
      if (el) el.classList.remove('input-error');
    });

    let hasError = false;

    // Validate Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      if (errorName) {
        errorName.textContent = 'Please enter your name.';
        errorName.style.display = 'block';
      }
      if (nameInput) nameInput.classList.add('input-error');
      hasError = true;
    }

    // Validate Email
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal || !isValidEmail(emailVal)) {
      if (errorEmail) {
        errorEmail.textContent = 'Please enter a valid email address.';
        errorEmail.style.display = 'block';
      }
      if (emailInput) emailInput.classList.add('input-error');
      hasError = true;
    }

    // Validate Message
    const msgVal = messageInput ? messageInput.value.trim() : '';
    if (!msgVal) {
      if (errorMessage) {
        errorMessage.textContent = 'Please write a message.';
        errorMessage.style.display = 'block';
      }
      if (messageInput) messageInput.classList.add('input-error');
      hasError = true;
    }

    if (hasError) return;

    const subjectVal = subjectInput ? subjectInput.value.trim() : '';

    // WhatsApp Message Template
    const waText =
`New Portfolio Contact

Name: ${nameVal}
Email: ${emailVal}${subjectVal ? `\nSubject: ${subjectVal}` : ''}

Message:
${msgVal}`;

    const waUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    sound.playSuccess();

    if (banner) {
      banner.innerHTML = `
        <strong>Launching WhatsApp...</strong>
        <p style="margin: 0.35rem 0 0.5rem;">Your message is prefilled into WhatsApp. Please review and click <em>Send</em> in WhatsApp to deliver it to Shahzaib.</p>
        <p style="font-size: 0.85rem;"><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--neon-green); text-decoration: underline;">Click here if WhatsApp did not open automatically</a></p>
      `;
      banner.style.display = 'block';
    }

    // Launch WhatsApp
    const a = document.createElement('a');
    a.href = waUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    form.reset();
  });
}

/* ====================================================================
 * BOOTSTRAP
 * ====================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  applyConfiguration();
  initBackgroundCanvas();
  initTypewriter();
  initTheme();
  initSound();
  initNav();
  initProjectModal();
  initScrollReveal();
  initContactForm();

  const yr = document.getElementById('current-year');
  if (yr) yr.textContent = new Date().getFullYear().toString();
});
