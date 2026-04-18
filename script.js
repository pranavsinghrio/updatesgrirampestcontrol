// ================================
// Shri Ram Pest Control - Interactions
// ================================

// ----- Mobile menu toggle -----
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.classList.toggle('nav-open', nav.classList.contains('open'));
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
  });
});

// ----- Header scroll effect -----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ----- Active nav link on scroll -----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ----- Set current year -----
document.getElementById('year').textContent = new Date().getFullYear();

// ================================
// FAQ Accordion
// ================================
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    // Open clicked one if it wasn't already open
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ================================
// Booking Form -> WhatsApp
// ================================
function submitBookingForm(event) {
  event.preventDefault();
  const name = document.getElementById('formName').value.trim();
  const phone = document.getElementById('formPhone').value.trim();
  const service = document.getElementById('formService').value;
  const city = document.getElementById('formCity').value;
  const message = document.getElementById('formMessage').value.trim();

  let whatsappMessage = `*New Booking Request - Shri Ram Pest Control*%0A%0A`;
  whatsappMessage += `*Name:* ${name}%0A`;
  whatsappMessage += `*Phone:* ${phone}%0A`;
  whatsappMessage += `*Service:* ${service}%0A`;
  whatsappMessage += `*City:* ${city}%0A`;
  if (message) {
    whatsappMessage += `*Details:* ${message}%0A`;
  }
  whatsappMessage += `%0APlease contact me with a quote. Thank you!`;

  const whatsappUrl = `https://wa.me/917000485602?text=${whatsappMessage}`;
  window.open(whatsappUrl, '_blank');
  return false;
}

// ================================
// Scroll Reveal Animations
// ================================
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// Auto-add reveal class to common elements
const autoReveal = [
  ...document.querySelectorAll('.service-card'),
  ...document.querySelectorAll('.why-card'),
  ...document.querySelectorAll('.contact-card'),
  ...document.querySelectorAll('.section-header')
];
autoReveal.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});

// ================================
// Animated Counter for Stats
// ================================
const counters = document.querySelectorAll('[data-count]');

const animateCounter = (el) => {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 2000;
  const stepTime = 16;
  const steps = duration / stepTime;
  const increment = target / steps;
  let current = 0;

  const update = () => {
    current += increment;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  update();
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ================================
// Testimonials Carousel
// ================================
const carouselTrack = document.getElementById('carouselTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');

if (carouselTrack) {
  const cards = carouselTrack.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  let currentIndex = 0;
  let cardsPerView = 3;
  let autoplayInterval;

  // Calculate cards per view based on screen size
  const updateCardsPerView = () => {
    if (window.innerWidth <= 768) {
      cardsPerView = 1;
    } else if (window.innerWidth <= 992) {
      cardsPerView = 2;
    } else {
      cardsPerView = 3;
    }
  };

  // Total slide positions
  const getMaxIndex = () => Math.max(0, totalCards - cardsPerView);

  // Move carousel to current index
  const updateCarousel = () => {
    const cardWidth = cards[0].offsetWidth + 24; // 24px gap
    const offset = -currentIndex * cardWidth;
    carouselTrack.style.transform = `translateX(${offset}px)`;
    updateDots();
  };

  // Build dot indicators
  const buildDots = () => {
    carouselDots.innerHTML = '';
    const dotCount = getMaxIndex() + 1;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
        resetAutoplay();
      });
      carouselDots.appendChild(dot);
    }
  };

  const updateDots = () => {
    const dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  // Next/prev handlers
  const goNext = () => {
    currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
    updateCarousel();
  };

  const goPrev = () => {
    currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
    updateCarousel();
  };

  carouselNext.addEventListener('click', () => {
    goNext();
    resetAutoplay();
  });

  carouselPrev.addEventListener('click', () => {
    goPrev();
    resetAutoplay();
  });

  // Autoplay
  const startAutoplay = () => {
    autoplayInterval = setInterval(goNext, 5000);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  // Pause on hover
  const carousel = document.getElementById('testimonialCarousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carousel.addEventListener('mouseleave', startAutoplay);

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
      resetAutoplay();
    }
  }, { passive: true });

  // Init
  const initCarousel = () => {
    updateCardsPerView();
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    buildDots();
    updateCarousel();
  };

  initCarousel();
  startAutoplay();

  // Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCarousel, 200);
  });
}

