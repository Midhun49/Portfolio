/* ═══ FLOATING GEOMETRIC BACKGROUND ═══ */
const canvas = document.getElementById('stars');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const SHAPES = Array.from({ length: 25 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  size: Math.random() * 40 + 10,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  angle: Math.random() * Math.PI * 2,
  av: (Math.random() - 0.5) * 0.01,
  opacity: Math.random() * 0.15 + 0.05
}));

function frame() {
  ctx.clearRect(0, 0, W, H);
  
  SHAPES.forEach(s => {
    s.x += s.vx; s.y += s.vy;
    s.angle += s.av;
    if (s.x < -50) s.x = W + 50; if (s.x > W + 50) s.x = -50;
    if (s.y < -50) s.y = H + 50; if (s.y > H + 50) s.y = -50;

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    ctx.strokeStyle = `rgba(0, 255, 170, ${s.opacity})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(-s.size/2, -s.size/2, s.size, s.size);
    ctx.restore();
  });

  requestAnimationFrame(frame);
}
frame();

/* ═══ NAV SCROLL ═══ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 40
    ? 'rgba(5,8,22,0.92)' : 'rgba(5,8,22,0.7)';

  /* active nav link */
  const sections = document.querySelectorAll('section[id]');
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  document.querySelectorAll('.nav-a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
});

/* ═══ BURGER ═══ */
document.getElementById('burger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-a').forEach(a =>
  a.addEventListener('click', () =>
    document.getElementById('navLinks').classList.remove('open')));

/* ═══ SCROLL REVEAL ═══ */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.sec-title,.card,.skill-bar-card,.cert-card,.proj-card,.contact-card'
).forEach(el => { el.classList.add('reveal'); obs.observe(el); });

/* ═══ SKILL BARS — animate when visible ═══ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sb-fill').forEach(f => {
        f.style.width = f.style.getPropertyValue('--w') || f.dataset.w || '0%';
        /* fallback: read from inline style --w */
        const w = getComputedStyle(f).getPropertyValue('--w').trim();
        if (w) f.style.width = w;
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-card').forEach(c => barObs.observe(c));

/* ═══ CONTACT FORM (mailto) ═══ */
document.getElementById('send-btn').addEventListener('click', () => {
  const name  = document.getElementById('msg-name').value.trim();
  const email = document.getElementById('msg-email').value.trim();
  const msg   = document.getElementById('msg-text').value.trim();
  if (!name || !email || !msg) { alert('Please fill all fields.'); return; }
  const subject = encodeURIComponent(`Portfolio Contact — ${name}`);
  const body    = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${msg}`);
  window.location.href = `mailto:midhunkarna08@gmail.com?subject=${subject}&body=${body}`;
});
