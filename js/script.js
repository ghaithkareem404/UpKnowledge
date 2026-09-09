// ===== UpKnowledge - Interactive Scripts =====

// Sticky header style on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// Reveal on scroll animation
const revealEls = document.querySelectorAll('.service-card, .about-card, .contact-card, .client-card, .feature, .odoo-modules span, .section-head');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity .6s ease ' + (i % 3 * 0.08) + 's, transform .6s ease ' + (i % 3 * 0.08) + 's';
  observer.observe(el);
});

// Animated counter for hero stats
const counters = document.querySelectorAll('.stat-num');
const animateCounter = (el) => {
  const text = el.textContent.trim();
  const match = text.match(/\d+/);
  if (!match) return;
  const target = parseInt(match[0]);
  const prefix = text.startsWith('+') ? '+' : '';
  const suffix = text.includes('/') ? text.slice(text.indexOf(match[0]) + match[0].length) : '';
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = prefix + count + suffix;
  }, 30);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => statObserver.observe(c));

console.log('UpKnowledge website loaded successfully ✓');
