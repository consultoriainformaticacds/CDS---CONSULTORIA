// ===========================
// SCROLL REVEAL
// ===========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===========================
// NAVBAR — scroll effect & hamburger
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const hamburger = document.getElementById('nav-hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks?.classList.contains('open'));
});

// Close menu on nav link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===========================
// CONTACT FORM — Formspree AJAX
// ===========================
const form   = document.getElementById('cdsForm');
const status = document.getElementById('form-status');
const btn    = document.getElementById('cds-btn');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalText = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  if (status) status.textContent = '';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      btn.textContent = '✓ ¡Enviado!';
      btn.style.opacity = '1';
      btn.style.background = 'var(--accent-cyan)';
      btn.style.color = 'var(--bg-primary)';
      if (status) {
        status.textContent = '¡Consulta enviada! Te contactaremos pronto.';
        status.style.color = 'var(--accent-cyan)';
      }
      form.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.cssText = '';
        btn.disabled = false;
        if (status) status.textContent = '';
      }, 5000);

    } else {
      const result = await response.json();
      const msg = result?.errors?.[0]?.message ?? 'Error desconocido';
      if (status) { status.textContent = 'Error: ' + msg; status.style.color = 'var(--accent-red)'; }
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    }

  } catch {
    if (status) {
      status.textContent = 'Sin conexión. Escribinos por WhatsApp.';
      status.style.color = 'var(--accent-red)';
    }
    btn.textContent = originalText;
    btn.disabled = false;
    btn.style.opacity = '1';
  }
});