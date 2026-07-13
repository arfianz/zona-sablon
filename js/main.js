/* ============================================================
   ZONA SABLON — Main JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    revealHeroElements();
  }, 1800);
  document.body.style.overflow = 'hidden';
});

/* ============================================================
   NAVBAR — Scroll Shrink + Active Link + Hamburger
   ============================================================ */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
  toggleBackToTop();
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (navLinks && hamburger && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  let activeId   = '';

  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      activeId = sec.id;
    }
  });

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === activeId);
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function revealHeroElements() {
  document.querySelectorAll('.reveal-hero').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   STATS COUNTER
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('id-ID');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  counterObserver.observe(el);
});

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach((item, i) => {
      const cat = item.dataset.category;
      const show = filter === 'all' || cat === filter;

      if (show) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, i * 40);
      } else {
        item.style.transition = 'opacity 0.25s ease';
        item.style.opacity = '0';
        setTimeout(() => { item.style.display = 'none'; }, 280);
      }
    });
  });
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxTitle  = document.getElementById('lightboxTitle');
const lightboxCat    = document.getElementById('lightboxCat');
const lightboxDesc   = document.getElementById('lightboxDesc');
const lightboxClose  = document.getElementById('lightboxClose');
const lightboxPrev   = document.getElementById('lightboxPrev');
const lightboxNext   = document.getElementById('lightboxNext');
const lightboxLoader = lightbox?.querySelector('.lightbox-loader');
const lightboxBackdrop = lightbox?.querySelector('.lightbox-backdrop');

let currentLightboxIndex = 0;
let lightboxItems = [];

function buildLightboxItems() {
  lightboxItems = [];
  document.querySelectorAll('.portfolio-zoom').forEach((btn, i) => {
    btn.dataset.index = i;
    lightboxItems.push({
      src:   btn.dataset.src,
      title: btn.dataset.title,
      cat:   btn.dataset.cat,
      desc:  btn.dataset.desc || '',
    });
  });
}

buildLightboxItems();

function openLightbox(index) {
  if (!lightbox) return;
  currentLightboxIndex = index;
  loadLightboxImage(index);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
}

function loadLightboxImage(index) {
  const item = lightboxItems[index];
  if (!item) return;

  if (lightboxLoader) lightboxLoader.style.display = 'flex';
  if (lightboxImg)    lightboxImg.style.opacity = '0';

  lightboxImg.onload = () => {
    if (lightboxLoader) lightboxLoader.style.display = 'none';
    lightboxImg.style.opacity = '1';
  };

  lightboxImg.src    = item.src;
  lightboxImg.alt    = item.title;
  lightboxTitle.textContent = item.title;
  lightboxCat.textContent   = item.cat;
  lightboxDesc.textContent  = item.desc;
}

document.querySelectorAll('.portfolio-zoom').forEach(btn => {
  btn.addEventListener('click', () => {
    openLightbox(parseInt(btn.dataset.index, 10));
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxBackdrop?.addEventListener('click', closeLightbox);

lightboxPrev?.addEventListener('click', () => {
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
  loadLightboxImage(currentLightboxIndex);
});

lightboxNext?.addEventListener('click', () => {
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
  loadLightboxImage(currentLightboxIndex);
});

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lightboxPrev?.click();
  if (e.key === 'ArrowRight')  lightboxNext?.click();
});

/* ============================================================
   TESTIMONIAL SLIDER
   ============================================================ */
const testiSlider  = document.getElementById('testiSlider');
const testiPrev    = document.getElementById('testiPrev');
const testiNext    = document.getElementById('testiNext');
const testiDotsEl  = document.getElementById('testiDots');

if (testiSlider) {
  const cards       = testiSlider.querySelectorAll('.testi-card');
  let   currentTesti = 0;
  let   autoPlay;

  function getVisibleCount() {
    if (window.innerWidth < 480)  return 1;
    if (window.innerWidth < 900)  return 2;
    return 3;
  }

  function buildDots() {
    if (!testiDotsEl) return;
    testiDotsEl.innerHTML = '';
    const count = Math.ceil(cards.length / getVisibleCount());
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToTesti(i));
      testiDotsEl.appendChild(dot);
    }
  }

  function goToTesti(index) {
    const visible   = getVisibleCount();
    const maxIndex  = Math.ceil(cards.length / visible) - 1;
    currentTesti    = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap       = 24;
    const offset    = currentTesti * visible * (cardWidth + gap);
    testiSlider.style.transform = `translateX(-${offset}px)`;

    testiDotsEl?.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentTesti);
    });
  }

  function nextTesti() {
    const visible  = getVisibleCount();
    const maxIndex = Math.ceil(cards.length / visible) - 1;
    goToTesti(currentTesti < maxIndex ? currentTesti + 1 : 0);
  }

  function prevTesti() {
    const visible  = getVisibleCount();
    const maxIndex = Math.ceil(cards.length / visible) - 1;
    goToTesti(currentTesti > 0 ? currentTesti - 1 : maxIndex);
  }

  function startAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextTesti, 4000);
  }

  testiPrev?.addEventListener('click', () => { prevTesti(); startAutoPlay(); });
  testiNext?.addEventListener('click', () => { nextTesti(); startAutoPlay(); });

  window.addEventListener('resize', () => { buildDots(); goToTesti(0); });

  buildDots();
  startAutoPlay();

  /* Touch/Swipe */
  let touchStartX = 0;
  testiSlider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; });
  testiSlider.addEventListener('touchend',   e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? nextTesti() : prevTesti();
      startAutoPlay();
    }
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item   = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('open', !isOpen);
    question.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm  = document.getElementById('contactForm');
const submitBtn    = document.getElementById('submitBtn');
const formSuccess  = document.getElementById('formSuccess');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const btnText    = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');

  if (btnText)    btnText.style.display    = 'none';
  if (btnLoading) btnLoading.style.display = 'inline-flex';
  if (submitBtn)  submitBtn.disabled = true;

  /* Simulate form submission */
  setTimeout(() => {
    if (btnText)    btnText.style.display    = '';
    if (btnLoading) btnLoading.style.display = 'none';
    if (submitBtn)  submitBtn.disabled = false;

    if (formSuccess) {
      formSuccess.style.display = 'flex';
      contactForm.reset();
      setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
    }
  }, 1800);
});

/* ============================================================
   BACK TO TOP
   ============================================================ */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (!backToTopBtn) return;
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   HERO PARTICLES (lightweight canvas dots)
   ============================================================ */
const heroParticlesEl = document.getElementById('heroParticles');

if (heroParticlesEl) {
  const canvas  = document.createElement('canvas');
  const ctx     = canvas.getContext('2d');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  heroParticlesEl.appendChild(canvas);

  const particles = [];
  const NUM       = 55;

  function resizeCanvas() {
    canvas.width  = heroParticlesEl.offsetWidth;
    canvas.height = heroParticlesEl.offsetHeight;
  }

  function createParticle() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   -Math.random() * 0.5 - 0.2,
      r:    Math.random() * 2 + 0.5,
      a:    Math.random() * 0.5 + 0.1,
      life: Math.random(),
    };
  }

  for (let i = 0; i < NUM; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.003;

      if (p.life <= 0 || p.y < -10) {
        particles[i] = createParticle();
        particles[i].y = canvas.height + 10;
        return;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192,57,43,${p.a * p.life})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  drawParticles();
  window.addEventListener('resize', resizeCanvas);
}

/* ============================================================
   YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   SMOOTH SCROLL (for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
