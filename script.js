/* ═══════════════════════════════════════════
   Portfolio script — Sahil Ajay Pandey
   ═══════════════════════════════════════════ */

// ── Utility ──────────────────────────────────────────────────
const qs = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ── Year ─────────────────────────────────────────────────────
qs('#year').textContent = new Date().getFullYear();

// ── Custom Cursor ─────────────────────────────────────────────
const cursor     = qs('#cursor');
const cursorRing = qs('#cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animateCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cursor.style.left     = mx + 'px';
  cursor.style.top      = my + 'px';
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0'; cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1'; cursorRing.style.opacity = '1';
});

// ── Particle Canvas ──────────────────────────────────────────
(function initParticles() {
  const canvas = qs('#particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(114,245,198,', 'rgba(131,183,255,', 'rgba(255,209,102,'];
  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.45 + 0.1,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

// ── Click Ripple Canvas ───────────────────────────────────────
(function initRipples() {
  const canvas = qs('#rippleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const ripples = [];
  document.addEventListener('click', e => {
    ripples.push({ x: e.clientX, y: e.clientY, r: 0, a: 1, color: '114,245,198' });
    ripples.push({ x: e.clientX, y: e.clientY, r: 0, a: 0.6, color: '131,183,255' });
  });

  function drawRipples() {
    ctx.clearRect(0, 0, W, H);
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rp.color},${rp.a})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      rp.r += 5;
      rp.a -= 0.025;
      if (rp.a <= 0) ripples.splice(i, 1);
    }
    requestAnimationFrame(drawRipples);
  }
  drawRipples();
})();

// ── Nav toggle ───────────────────────────────────────────────
const navToggle = qs('#navToggle');
const navLinks  = qs('#navLinks');

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
qsa('a', navLinks).forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

// ── Nav scrolled ─────────────────────────────────────────────
const navWrap = qs('.nav-wrap');
window.addEventListener('scroll', () => {
  navWrap.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Progress bar ──────────────────────────────────────────────
const progressBar = qs('#progressBar');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}, { passive: true });

// ── Reveal on scroll ─────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
qsa('.reveal').forEach(el => revealObs.observe(el));

// ── Typewriter ───────────────────────────────────────────────
(function initTypewriter() {
  const el    = qs('#heroTypewriter');
  if (!el) return;
  const words = ['measures & controls.', 'computes.', 'senses everything.', 'changes the world.'];
  let wi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 65, SPEED_DEL = 38, PAUSE = 2200;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.substring(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = word.substring(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(type, 800);
})();

// ── Skill filter ──────────────────────────────────────────────
const filterBtns = qsa('.filter-btn');
const chips      = qsa('.skill-chip');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    chips.forEach(chip => {
      const show = f === 'all' || chip.dataset.category === f;
      chip.classList.toggle('hidden', !show);
    });
  });
});

// ── Magnetic buttons ──────────────────────────────────────────
qsa('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ── Chip interactive tilt ─────────────────────────────────────
(function initChipTilt() {
  const chip = qs('#heroChip');
  if (!chip) return;
  chip.addEventListener('mousemove', e => {
    const r  = chip.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) / (r.width  / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    chip.style.transform = `rotate(-1deg) rotateX(${-dy * 14}deg) rotateY(${dx * 14}deg) scale(1.04)`;
    chip.style.boxShadow = `0 0 60px rgba(114,245,198,${0.1 + Math.abs(dx) * 0.08}), 0 50px 120px rgba(0,0,0,.5)`;
    chip.style.transition = 'transform .1s ease, box-shadow .1s ease';
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.transform  = '';
    chip.style.boxShadow  = '';
    chip.style.transition = 'transform .5s ease, box-shadow .5s ease';
  });
})();

// ── Active nav link highlight ──────────────────────────────────
(function initActiveNav() {
  const sections = qsa('main section[id]');
  const links    = qsa('.nav-links a[href^="#"]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const a = qs(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
})();
