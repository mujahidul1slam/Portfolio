/**
 * VIDÉASTE - EDITORIAL VIDEO EDITOR PORTFOLIO INTERACTIVE LOGIC
 * High-End Motion & Antigravity Interactions (GSAP + 3D Tilt)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initCustomCursor();
  initHeaderScroll();
  initHeroAnimations();
  initScrollAnimations();
  init3DTilt();
  initVideoModal();
  initSoftwareCards();
  initEmailCopy();
  initIntakeForm();
  initSmoothScroll();
});

/* 1. CUSTOM CURSOR & follower WITH MAGNET EFFECT */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let isHovered = false;
  let activeMagnet = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Tiny cursor tracks mouse instantly
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // GSAP Ticker for smooth custom follower damping (buttery-smooth)
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add(() => {
      if (activeMagnet) {
        // Snapped to magnet target
        const rect = activeMagnet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Pulled toward the center but slightly responsive to cursor
        followerX += (centerX + (mouseX - centerX) * 0.35 - followerX) * 0.25;
        followerY += (centerY + (mouseY - centerY) * 0.35 - followerY) * 0.25;
      } else {
        // Free tracking with interpolation
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
      }

      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
    });
  } else {
    // Fallback animation loop
    function animateFollower() {
      if (activeMagnet) {
        const rect = activeMagnet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        followerX += (centerX + (mouseX - centerX) * 0.35 - followerX) * 0.2;
        followerY += (centerY + (mouseY - centerY) * 0.35 - followerY) * 0.2;
      } else {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
      }
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
  }

  // General Hover State classes
  const hoverables = document.querySelectorAll('a, button, .software-card, .grid-card, .intake-form input, .intake-form select, .intake-form textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Play Mode Cursor States for Videos
  const playables = document.querySelectorAll('.hero-media-wrapper, .work-row, .work-media-preview');
  playables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-play');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-play');
    });
  });

  // Magnet Targets Setup
  const magnets = document.querySelectorAll('.social-pill, .hero-action-btn, .float-btn, .watch-full-pill, .submit-brief-btn');
  magnets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      activeMagnet = el;
      document.body.classList.add('cursor-hover');
      
      // GSAP scale response for button itself (weightless pop)
      if (typeof gsap !== 'undefined') {
        gsap.to(el, { scale: 1.12, duration: 0.4, ease: "power2.out" });
      }
    });

    el.addEventListener('mouseleave', () => {
      activeMagnet = null;
      document.body.classList.remove('cursor-hover');
      
      if (typeof gsap !== 'undefined') {
        gsap.to(el, { scale: 1, duration: 0.4, ease: "power2.out" });
      }
    });
  });
}

/* 2. HEADER SCROLL EFFECT */
function initHeaderScroll() {
  const header = document.getElementById('topNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, footer');

  window.addEventListener('scroll', () => {
    // Nav styling transition
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link based on viewport scroll position
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* 3. HERO ENTRANCE & FLOATING ANIMATIONS */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  // Background text fade in
  gsap.from('.hero-bg-text', {
    scale: 0.85,
    opacity: 0,
    duration: 1.8,
    ease: "power3.out",
    delay: 0.1
  });

  // Left side: Greeting & Name
  gsap.from('.greeting-script', {
    x: -80,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.3
  });

  gsap.from('.hero-name', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.4
  });

  gsap.from('.hero-tagline-left', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.7
  });

  gsap.from('.hero-social-links .social-pill', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.7)",
    delay: 0.9
  });

  // Center image entrance
  gsap.from('.mujahid-image', {
    y: 120,
    opacity: 0,
    scale: 0.9,
    duration: 1.4,
    ease: "power3.out",
    delay: 0.2
  });

  // Right side: Role & Stats
  gsap.from('.role-desc', {
    x: 80,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.3
  });

  gsap.from('.hero-role', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.5
  });

  gsap.from('.stat-item-right', {
    x: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.8
  });

  gsap.from('.hero-action-btn', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)",
    delay: 1.1
  });

  // Availability bar
  gsap.from('.hero-availability-bar', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 1.3
  });
}

/* 4. SCROLL LINKED PARALLAX & STAGGERED ENTRANCES */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Parallax on Background glow orbs
  gsap.to('.orb-1', {
    yPercent: -40,
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5
    }
  });

  gsap.to('.orb-2', {
    yPercent: 30,
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5
    }
  });

  gsap.to('.orb-3', {
    yPercent: -20,
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5
    }
  });

  // Softwares Grid Cards: Entrance stagger
  gsap.from('.software-card', {
    y: 60,
    opacity: 0,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".softwares-grid",
      start: "top 85%",
      toggleActions: "play none none none"
    }
  });

  // Center editor black and white portrait scale
  gsap.from('.center-editor-portrait', {
    scale: 0.8,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".wing-graphic-wrapper",
      start: "top 80%",
    }
  });

  // Portfolio Grid Cards: Domino drop-in stagger
  gsap.from('.portfolio-cards-grid .grid-card', {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".portfolio-cards-grid",
      start: "top 80%",
    }
  });

  // Exhibitions List Items
  const workRows = document.querySelectorAll('.work-row');
  workRows.forEach((row) => {
    gsap.from(row, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: row,
        start: "top 90%",
      }
    });
  });

  // Form & Direct contact components
  gsap.from('.intake-form', {
    x: -80,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-grid",
      start: "top 80%",
    }
  });

  gsap.from('.direct-contact-card', {
    x: 80,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-grid",
      start: "top 80%",
    }
  });

  // Giant background typography scroll parallax
  gsap.to('.massive-cropped-typography span', {
    y: -80,
    scrollTrigger: {
      trigger: ".footer-contact-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });

  gsap.to('.giant-overlay-title', {
    y: -50,
    scrollTrigger: {
      trigger: ".clients-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });
}

/* 5. 3D TILT INTERACTION LOGIC (SPATIAL DEPTH) */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('#contactCard3D, .portfolio-cards-grid .grid-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse x within card
      const y = e.clientY - rect.top;  // mouse y within card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt percentages (range -1 to 1)
      const rotateX = -((y - centerY) / centerY) * 12; // tilt max 12 degrees
      const rotateY = ((x - centerX) / centerX) * 12;

      // Apply transforms via GSAP for butter-smooth damping (doesn't snap)
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          z: 20, // push card out slightly
          duration: 0.35,
          ease: "power2.out"
        });
      } else {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      // Revert tilts smoothly
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          z: 0,
          duration: 0.65,
          ease: "power3.out"
        });
      } else {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      }
    });
  });
}

/* 6. VIDEO PLAYER LIGHTBOX MODAL */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideoPlayer');
  const modalSource = document.getElementById('modalVideoSource');
  const modalTitle = document.getElementById('modalVideoTitle');
  const closeBtn = document.getElementById('closeModalBtn');

  if (!modal || !modalVideo) return;

  function openModal(videoUrl, title) {
    modalSource.src = videoUrl;
    modalVideo.load();
    modalTitle.textContent = title || 'Cinematic Cut Showreel';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // GSAP scale modal container in
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.video-modal-container',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power4.out" }
      );
    }
    modalVideo.play().catch(() => {});
  }

  function closeModal() {
    if (typeof gsap !== 'undefined') {
      gsap.to('.video-modal-container', {
        scale: 0.85,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          modal.classList.remove('active');
          modalVideo.pause();
          modalSource.src = '';
          document.body.style.overflow = '';
        }
      });
    } else {
      modal.classList.remove('active');
      modalVideo.pause();
      modalSource.src = '';
      document.body.style.overflow = '';
    }
  }

  // Watch buttons
  const watchButtons = document.querySelectorAll('.watch-full-pill');
  watchButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoSrc = btn.getAttribute('data-src');
      const title = btn.getAttribute('data-title');
      openModal(videoSrc, title);
    });
  });

  // Exhibition video preview boxes (Clicking opens modal without watch full button)
  const exhibitionPreviews = document.querySelectorAll('.exhibition-preview-item, .exhibition-media-box');
  exhibitionPreviews.forEach((box) => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoSrc = box.getAttribute('data-video');
      const title = box.getAttribute('data-title');
      if (videoSrc) openModal(videoSrc, title || 'Video Preview');
    });
  });

  // Click work row to open video
  const workRows = document.querySelectorAll('.work-row');
  workRows.forEach((row) => {
    row.addEventListener('click', (e) => {
      if (e.target.classList.contains('watch-full-pill')) return;
      const videoSrc = row.getAttribute('data-video');
      const title = row.getAttribute('data-title');
      openModal(videoSrc, title);
    });
  });

  // Hero interactive elements triggers
  const heroCameraBtn = document.getElementById('heroCameraBtn');
  const heroPlayReelBtn = document.getElementById('heroPlayReelBtn');
  const heroExploreBtn = document.getElementById('heroExploreBtn');
  const heroMediaFrame = document.getElementById('heroMediaFrame');

  const defaultReel = 'https://assets.mixkit.co/videos/preview/mixkit-cinematographer-filming-a-scene-41551-large.mp4';

  if (heroCameraBtn) {
    heroCameraBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(defaultReel, '2026 Camera Rushes & Cut Reel');
    });
  }

  if (heroPlayReelBtn) {
    heroPlayReelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(defaultReel, 'Master Showreel 2026');
    });
  }

  if (heroMediaFrame) {
    heroMediaFrame.addEventListener('click', () => {
      openModal(defaultReel, 'Visual Poetry Director Cut');
    });
  }

  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', () => {
      const target = document.getElementById('highlighted-work');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* 7. SOFTWARE CARDS INTERACTIVE TOAST */
function initSoftwareCards() {
  const cards = document.querySelectorAll('.software-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const softwareName = card.querySelector('h3').textContent;
      showToast(`Selected Workflow: ${softwareName}`);
    });
  });
}

/* 8. DIRECT EMAIL COPY */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailAddressText');

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', () => {
    const textToCopy = emailText.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Email address copied to clipboard!');
    }).catch(() => {
      showToast(`Email: ${textToCopy}`);
    });
  });
}

/* 9. INTAKE FORM HANDLING */
function initIntakeForm() {
  const form = document.getElementById('projectIntakeForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value;
    
    // Simulate sending brief
    showToast(`Thank you, ${name}! Your project brief has been received. We'll reply within 24h.`);
    form.reset();
  });
}

/* 10. TOAST NOTIFICATION HELPER */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* 11. SMOOTH ANCHOR SCROLLING */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}
