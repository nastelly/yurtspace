// Mobile navigation.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

nav.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  });
});

// Reveal sections as they enter the viewport.
const animated = document.querySelectorAll(
  '.section h2,.section-top,.event-card,.upcoming,.outreach figure,.team-layout img,.media-card,.community-list>div,.contact-grid>*'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -30px 0px' });

  animated.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Interactive yurt.
const emblem = document.querySelector('.hero-object');

if (
  emblem &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
  window.matchMedia('(pointer: fine)').matches
) {
  let frame;
  let bounds;

  emblem.addEventListener('pointerenter', () => {
    bounds = emblem.getBoundingClientRect();
    emblem.style.transition = 'transform 180ms ease-out';
  });

  emblem.addEventListener('pointermove', (e) => {
    if (!bounds) return;

    const x = Math.max(-0.5, Math.min(
      0.5, (e.clientX - bounds.left) / bounds.width - 0.5
    ));
    const y = Math.max(-0.5, Math.min(
      0.5, (e.clientY - bounds.top) / bounds.height - 0.5
    ));

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      emblem.style.transform = `
        perspective(900px)
        translate3d(${x * 22}px, ${y * 16}px, 0)
        rotateX(${-y * 12}deg)
        rotateY(${x * 16}deg)
        rotate(${-5 + x * 5}deg)
        scale(1.04)
      `;
    });
  });

  emblem.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    bounds = null;
    emblem.style.transition =
      'transform 700ms cubic-bezier(.22, 1, .36, 1)';
    emblem.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg) rotate(-5deg) scale(1)';
  });
}
// Stagger reveal timing within each group.
const revealGroups = [
  '.event-grid .event-card',
  '.outreach-grid figure',
  '.media-grid .media-card',
  '.team-roster .lead-card'
];

revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, index) => {
    el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 85}ms`);
  });
});

// Hover reveals the back on desktop; click/tap toggles it on touch devices.
document.querySelectorAll('.event-flip').forEach((button) => {
  button.addEventListener('click', () => {
    const flipped = button.classList.toggle('is-flipped');
    button.setAttribute('aria-pressed', String(flipped));
    button.setAttribute(
      'aria-label',
      `${flipped ? 'Hide' : 'Show'} details for ${button.closest('.event-card').querySelector('h4').textContent.trim()}`
    );
  });
});

// Animate all content groups while respecting reduced-motion preferences.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        contentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.stats > div, .lead-card, .team-heading figure, .footer-links > a, .media-intro').forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 80}ms`);
    contentObserver.observe(element);
  });
}
