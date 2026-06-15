/* =========================================================
   HUSNAIN HAIDER — PORTFOLIO
   Interactions: HUD clock, custom cursor, reveals, marquee
   ========================================================= */

(() => {
  'use strict';

  /* ---------- HUD clock + uptime ---------- */
  const clockEl  = document.querySelector('[data-clock]');
  const uptimeEl = document.querySelector('[data-uptime]');
  const fpsEl    = document.querySelector('[data-fps]');
  const sessionStart = performance.now();

  function tickClock() {
    if (clockEl) {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      clockEl.textContent = `${hh}:${mm}:${ss} UTC`;
    }
    if (uptimeEl) {
      const t = Math.floor((performance.now() - sessionStart) / 1000);
      const m = String(Math.floor(t / 60)).padStart(2, '0');
      const s = String(t % 60).padStart(2, '0');
      uptimeEl.textContent = `${m}:${s}`;
    }
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- FPS counter (lightweight) ---------- */
  let lastT = performance.now();
  let frames = 0;
  let fps = 60;
  function fpsLoop(t) {
    frames++;
    if (t - lastT >= 1000) {
      fps = Math.round((frames * 1000) / (t - lastT));
      frames = 0; lastT = t;
      if (fpsEl) fpsEl.textContent = `${fps} fps`;
    }
    requestAnimationFrame(fpsLoop);
  }
  if (fpsEl) requestAnimationFrame(fpsLoop);

  /* ---------- Scroll progress on HUD ---------- */
  const progressEl = document.querySelector('[data-progress]');
  if (progressEl) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressEl.style.width = `${pct}%`;
    }, { passive: true });
  }

  /* ---------- Custom cursor (desktop only) ---------- */
  const canHover = window.matchMedia('(hover: hover)').matches;
  if (canHover) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      let mx = -100, my = -100;
      let rx = -100, ry = -100;
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      });
      function ringLoop() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(ringLoop);
      }
      ringLoop();
      const hovTargets = 'a, button, input, textarea, [data-hover]';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(hovTargets)) ring.classList.add('hov');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(hovTargets)) ring.classList.remove('hov');
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Mobile nav burger ---------- */
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

  /* ---------- Active-section tracking on HUD ---------- */
  const sectionEl = document.querySelector('[data-section]');
  if (sectionEl) {
    const sections = document.querySelectorAll('section[id]');
    const setSection = (id) => { sectionEl.textContent = id; };
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) setSection(en.target.id.toUpperCase());
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  /* ---------- Contact form: faux send ---------- */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Signal Sent ✓';
        btn.style.background = '#FF6B35';
        btn.style.color = '#0A0908';
        setTimeout(() => { form.reset(); }, 600);
      }
    });
  }
})();
