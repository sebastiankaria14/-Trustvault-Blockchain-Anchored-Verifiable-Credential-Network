/**
 * Animation Utilities for TrustVault
 * Scroll reveal and ripple effect animations
 */

// ===== SCROLL REVEAL =====
/**
 * Observes elements and reveals them when they enter viewport
 * Usage: Add data-scroll attribute to elements
 */
export function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animation class based on data-scroll attribute
        const animationType = entry.target.dataset.scroll || 'slide-in-up';
        entry.target.classList.add(animationType);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-scroll attribute
  document.querySelectorAll('[data-scroll]').forEach((element) => {
    observer.observe(element);
  });
}

// ===== RIPPLE EFFECT =====
/**
 * Creates a ripple effect on click
 * Usage: Add data-ripple class to interactive elements
 */
export function initRippleEffect() {
  const rippleElements = document.querySelectorAll('[data-ripple]');

  rippleElements.forEach((element) => {
    element.addEventListener('click', (e) => {
      createRipple(e, element);
    });
  });
}

function createRipple(event, element) {
  // Get the position of the click relative to the element
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Create ripple element
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';

  // Ensure element has relative positioning
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }

  element.appendChild(ripple);

  // Remove ripple after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// ===== PARALLAX EFFECT =====
/**
 * Creates a parallax scrolling effect
 * Usage: Add data-parallax="0.5" to elements (0-1 speed factor)
 */
export function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = window.scrollY * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ===== STAGGER ANIMATION =====
/**
 * Staggers animation for multiple elements
 * Usage: Add data-stagger to elements
 */
export function initStaggerAnimation() {
  const staggerElements = document.querySelectorAll('[data-stagger]');

  staggerElements.forEach((container) => {
    const items = container.querySelectorAll('[data-stagger-item]');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add('fade-in');
    });
  });
}

// ===== SMOOTH SCROLL =====
/**
 * Enables smooth scrolling for anchor links
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ===== COUNT UP ANIMATION =====
/**
 * Counts up a number when element is visible
 * Usage: Add data-count="1000" to elements
 */
export function initCountUpAnimation() {
  const countElements = document.querySelectorAll('[data-count]');

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.dataset.count);
        const duration = parseInt(entry.target.dataset.duration) || 2000;
        countUp(entry.target, target, duration);
        entry.target.classList.add('counted');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  countElements.forEach((element) => observer.observe(element));
}

function countUp(element, target, duration) {
  const start = 0;
  const startTime = Date.now();

  const updateCount = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start + (target - start) * progress);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  updateCount();
}

// ===== GRADIENT ANIMATION =====
/**
 * Creates animated gradient background
 * Usage: Add data-gradient-animate class
 */
export function initGradientAnimation() {
  const gradientElements = document.querySelectorAll('[data-gradient-animate]');

  gradientElements.forEach((element) => {
    element.style.backgroundSize = '200% 200%';
    element.style.animation = 'aurora 3s ease infinite';
  });
}

// ===== INITIALIZE ALL ANIMATIONS =====
/**
 * Call this function to initialize all animation utilities
 */
export function initializeAnimations() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollReveal();
      initRippleEffect();
      initParallaxEffect();
      initStaggerAnimation();
      initSmoothScroll();
      initCountUpAnimation();
      initGradientAnimation();
    });
  } else {
    initScrollReveal();
    initRippleEffect();
    initParallaxEffect();
    initStaggerAnimation();
    initSmoothScroll();
    initCountUpAnimation();
    initGradientAnimation();
  }
}
