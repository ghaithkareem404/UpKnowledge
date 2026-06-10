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
const revealEls = document.querySelectorAll('.service-card, .about-card, .contact-card, .feature, .odoo-modules span, .section-head');
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

console.log('UpKnowledge website loaded successfully ✓');// UpKnowledge - Main JavaScript File\n// Professional interactivity and dynamic features\n\n// Smooth scrolling for navigation links\ndocument.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {\n    anchor.addEventListener('click', function(e) {\n        e.preventDefault();\n        const target = document.querySelector(this.getAttribute('href'));\n        if (target) {\n            target.scrollIntoView({\n                behavior: 'smooth',\n                block: 'start'\n            });\n        }\n    });\n});\n\n// Navbar styling on scroll\nwindow.addEventListener('scroll', () => {\n    const navbar = document.querySelector('.navbar');\n    if (window.scrollY > 100) {\n        navbar.style.boxShadow = '0 5px 20px rgba(9, 36, 66, 0.2)';\n    } else {\n        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';\n    }\n});\n\n// Service card hover effect\nconst serviceCards = document.querySelectorAll('.service-card');\nserviceCards.forEach(card => {\n    card.addEventListener('mouseenter', function() {\n        this.style.transform = 'translateY(-15px) scale(1.02)';\n    });\n    \n    card.addEventListener('mouseleave', function() {\n        this.style.transform = 'translateY(0) scale(1)';\n    });\n});\n\n// CTA Button click handler\nconst ctaBtn = document.querySelector('.cta-btn');\nif (ctaBtn) {\n    ctaBtn.addEventListener('click', () => {\n        const contactSection = document.querySelector('#contact');\n        if (contactSection) {\n            contactSection.scrollIntoView({ behavior: 'smooth' });\n        }\n    });\n}\n\n// Initialize animations on page load\nwindow.addEventListener('load', () => {\n    console.log('UpKnowledge website loaded successfully');\n    \n    // Add loaded class for animations\n    document.body.classList.add('loaded');\n});\n\n// Mobile menu toggle (if needed in future)\nfunction toggleMenu() {\n    const navLinks = document.querySelector('.nav-links');\n    if (navLinks) {\n        navLinks.classList.toggle('active');\n    }\n}\n\n// Responsive observer for animations\nconst observerOptions = {\n    threshold: 0.1,\n    rootMargin: '0px 0px -100px 0px'\n};\n\nconst observer = new IntersectionObserver((entries) => {\n    entries.forEach(entry => {\n        if (entry.isIntersecting) {\n            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';\n            observer.unobserve(entry.target);\n        }\n    });\n}, observerOptions);\n\n// Observe all service cards\nserviceCards.forEach(card => {\n    observer.observe(card);\n});
