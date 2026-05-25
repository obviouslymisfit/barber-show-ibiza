/* ─────────────────────────────────────────
   HEADER SCROLL
───────────────────────────────────────── */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const hasDarkHero = document.querySelector('.page-hero');

  const toggle = () => {
    if (!hasDarkHero) {
      header.classList.add('scrolled');
      return;
    }
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();

/* ─────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');
  if (!toggle || !overlay) return;

  const overlayLinks = overlay.querySelectorAll('.nav-overlay__link, .nav-overlay__book');
  let isOpen = false;

  function openNav() {
    isOpen = true;
    overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(overlayLinks,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: 0.05 }
      );
    }

    const firstLink = overlay.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    isOpen = false;
    overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => isOpen ? closeNav() : openNav());

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeNav();
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = [...overlay.querySelectorAll('a, button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-item__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((el) => el.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
})();

/* ─────────────────────────────────────────
   GSAP SCROLL ANIMATIONS
───────────────────────────────────────── */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const defaults = { ease: 'power2.out' };

  /* Eyebrow labels */
  gsap.utils.toArray('.eyebrow, .hero-eyebrow').forEach((el) => {
    if (el.closest('.page-hero')) return;
    gsap.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  /* Section titles */
  gsap.utils.toArray('.section-title').forEach((el) => {
    gsap.fromTo(el,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  /* Section lead text */
  gsap.utils.toArray('.section-lead').forEach((el) => {
    gsap.fromTo(el,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  /* Cards — staggered */
  const cardSelectors = [
    '.value-card',
    '.testimonial-card',
    '.news-card',
    '.team-card',
    '.pricing-card',
    '.included-item',
    '.contact-path',
  ];

  cardSelectors.forEach((selector) => {
    const groups = {};
    document.querySelectorAll(selector).forEach((el) => {
      const parent = el.parentElement;
      if (!groups[parent]) groups[parent] = [];
      groups[parent].push(el);
    });

    Object.values(groups).forEach((cards) => {
      gsap.fromTo(cards,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ...defaults,
          scrollTrigger: { trigger: cards[0], start: 'top 85%', once: true }
        }
      );
    });
  });

  /* Images */
  gsap.utils.toArray('.split__img, .article-hero, .studio-gallery__main, .studio-gallery__thumb').forEach((el) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  /* Pullquotes */
  gsap.utils.toArray('.pullquote').forEach((el) => {
    const border = el;
    gsap.fromTo(border,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  /* Service items */
  gsap.utils.toArray('.service-item').forEach((el, i) => {
    gsap.fromTo(el,
      { x: -16, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, delay: (i % 6) * 0.05, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  /* Hero content animation on load */
  const heroEyebrow = document.querySelector('.page-hero .hero-eyebrow');
  const heroTitle = document.querySelector('.page-hero .hero-title');
  const heroSub = document.querySelector('.page-hero .hero-sub');
  const heroActions = document.querySelector('.page-hero .hero-actions');

  if (heroTitle) {
    const tl = gsap.timeline({ defaults });
    if (heroEyebrow) tl.fromTo(heroEyebrow, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    tl.fromTo(heroTitle, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.1');
    if (heroSub) tl.fromTo(heroSub, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4');
    if (heroActions) tl.fromTo(heroActions, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.3');
  }
})();
