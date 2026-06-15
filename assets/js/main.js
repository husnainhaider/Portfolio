/* =========================================================
   HUSNAIN HAIDER — PORTFOLIO
   Minimal interactions
   ========================================================= */

(() => {
  'use strict';

  /* Smooth-scroll for in-page anchors WITHOUT putting #hash in the URL */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    if (href === '#' || href.length < 2) {
      // bare "#" (e.g. brand/home link) — scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // strip #hash from URL without reload
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Mobile nav burger */
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.addEventListener('click', e => {
      if (e.target.tagName === 'A') navLinks.classList.remove('open');
    });
  }

  /* Inline-play YouTube thumbnails on click */
  document.querySelectorAll('.project-thumb[data-video]').forEach(thumb => {
    thumb.addEventListener('click', e => {
      if (thumb.classList.contains('playing')) return;
      const id = thumb.dataset.video;
      if (!id) return;
      e.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = thumb.getAttribute('aria-label') || 'Project video';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      thumb.appendChild(iframe);
      thumb.classList.add('playing');
    });
  });

  /* Contact form: faux send */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Signal sent ✓';
        btn.style.background = '#A93620';
        setTimeout(() => { form.reset(); }, 600);
      }
    });
  }
})();
