/**
 * Basil Tariq Portfolio - Interactive JavaScript Engine
 * "Dark Forest" Aesthetics & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavigation();
  initTypewriter();
  initScrollAnimations();
  initProjectFilters();
  initProjectModals();
  initContactForm();
});

/* ==========================================================================
   1. Deep Dark Matte Slate & Tactile Charcoal Texture Canvas
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let noiseCanvas, noiseCtx;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateTactileNoise();
    drawBackground();
  }

  // Pre-render a subtle matte grain noise pattern
  function generateTactileNoise() {
    noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 256;
    noiseCanvas.height = 256;
    noiseCtx = noiseCanvas.getContext('2d');

    const imgData = noiseCtx.createImageData(256, 256);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Very soft tactile matte noise
      const grain = Math.random() * 12;
      data[i] = 18 + grain;     // R
      data[i + 1] = 24 + grain; // G
      data[i + 2] = 21 + grain; // B
      data[i + 3] = 14;         // Alpha (subtle matte texture)
    }

    noiseCtx.putImageData(imgData, 0, 0);
  }

  function drawBackground() {
    ctx.clearRect(0, 0, width, height);

    // 1. Deep Slate Charcoal Gradient Base
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.4, 100,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.75
    );
    bgGrad.addColorStop(0, '#101614');   // Deep slate center
    bgGrad.addColorStop(0.5, '#0d1110'); // Dark charcoal body
    bgGrad.addColorStop(1, '#080a09');   // Deep obsidian edge vignette

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Dark Forest Ambient Glow (Centered, ultra-soft)
    const forestGlow = ctx.createRadialGradient(
      width * 0.5, height * 0.35, 50,
      width * 0.5, height * 0.35, width * 0.5
    );
    forestGlow.addColorStop(0, 'rgba(27, 59, 43, 0.08)');
    forestGlow.addColorStop(0.7, 'rgba(18, 38, 28, 0.02)');
    forestGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = forestGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Tile the Tactile Matte Noise Overlay
    if (noiseCanvas) {
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }

  window.addEventListener('resize', resize);
  resize();
}

/* ==========================================================================
   2. Sticky Navigation, Mobile Drawer & Scrollspy
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy active state update
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Mobile menu toggle
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    navBackdrop.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  if (navBackdrop) navBackdrop.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          if (mobileNav.classList.contains('open')) {
            toggleMobileMenu();
          }
          const headerOffset = 80;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ==========================================================================
   3. Typewriter Dynamic Tagline Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const titles = [
    "BS Artificial Intelligence Student @ Iqra University",
    "Digital Strategy & Media @ AI Cloud Solutions (@aicloudsl)",
    "Java & Systems Developer"
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      target.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      target.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400; // Pause before new word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   4. Smooth Scroll Entrance Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up, .fade-down, .fade-left, .fade-right, .scale-up, .scroll-reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Interactive Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Interactive Project Details Modal
   ========================================================================== */
const projectData = {
  project1: {
    title: "Desktop ATM Withdrawal & Transfer System",
    tech: ["Java", "OOP", "Swing UI", "File I/O"],
    description: "A desktop banking application I built in Java to master Object-Oriented Programming. It handles user authentication, cash withdrawals, balance tracking, and account-to-account transfers with input validation to keep user data safe.",
    features: [
      "Built modular class structures for User Account, Banking Ledger, and Session Management",
      "Implemented PIN security verification and real-time transaction balance checks",
      "Designed a clean desktop GUI with Java Swing for user-friendly navigation",
      "Saved transaction logs to local disk files so account balances persist between sessions"
    ]
  },
  project2: {
    title: "Smart Course Registration & Notification System",
    tech: ["Java", "Data Structures", "System Logic"],
    description: "Built during my coursework to solve real student enrollment challenges. It automatically validates course prerequisites, monitors class capacity in real time, manages waitlists, and sends status alerts when seats open up.",
    features: [
      "Prerequisite checking logic to prevent invalid course signups",
      "Queue data structures to manage student waitlists automatically when classes fill up",
      "Automated alert dispatcher simulating SMS and Email notifications when seats open",
      "Clean separation between data models, course logic, and user output"
    ]
  },
  project3: {
    title: "ATM Machine Program (C)",
    tech: ["C Programming", "Pointers", "Buffer Sanitization"],
    description: "A command-line banking application written in C to get comfortable with pointer arithmetic, memory allocation, and struct-based state machines for deposits, withdrawals, and balance checks.",
    features: [
      "Pointer-based state management for fast and memory-efficient execution",
      "Input sanitization to handle unexpected user entries and prevent runtime crashes",
      "Modular functions for deposit, withdrawal, balance inquiry, and PIN validation",
      "File I/O integration to store user account balances locally"
    ]
  },
  project4: {
    title: "AI Cloud Solutions (@aicloudsl) Media Strategy",
    tech: ["@aicloudsl", "Social Media", "Content Strategy", "Brand Growth"],
    description: "Managing social media strategy and visual content for AI Cloud Solutions (@aicloudsl). I design educational carousels, cloud technology highlights, and posts that build brand presence and engage developer communities online.",
    features: [
      "Content calendar planning and campaign execution for @aicloudsl",
      "Designing visual slides that explain cloud infrastructure and AI tool integrations",
      "Tracking post engagement and audience growth to refine content topics",
      "Maintaining an authentic, clear brand voice across social platforms"
    ]
  },
  project5: {
    title: "Tech Storytelling & Visual Guides",
    tech: ["B2B Communication", "Media Design", "Infographics"],
    description: "Creating visual breakdown carousels and technical guides that simplify complex computer science and AI concepts into clear, engaging social media posts for developers and students.",
    features: [
      "Breaking down algorithms and code concepts into visual slide decks",
      "Formatting developer tips, cheat sheets, and tool recommendations for social feeds",
      "Engaging developer audiences through interactive Q&As and tech discussions",
      "Creating dark modern visuals tailored for technical readers"
    ]
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalTech = document.getElementById('modalTech');
  const modalDesc = document.getElementById('modalDesc');
  const modalFeatures = document.getElementById('modalFeatures');
  const detailBtns = document.querySelectorAll('.project-details-btn');

  if (!modalOverlay) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalTech.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    modalDesc.textContent = data.description;
    modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* ==========================================================================
   6. Contact Form Submission & Direct Gmail Integration
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('Please fill out all fields before sending.');
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin btn-icon"></i> Sending to Gmail...`;
    submitBtn.disabled = true;

    // Send payload directly to FormSubmit endpoint (delivers to basiltariq2006@gmail.com)
    fetch('https://formsubmit.co/ajax/basiltariq2006@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: `New Portfolio Message from ${name}`
      })
    })
    .then(response => response.json())
    .then(data => {
      submitBtn.innerHTML = `<i class="fas fa-check btn-icon"></i> Sent to Gmail!`;
      submitBtn.style.background = 'var(--bright-emerald)';
      
      showToast(`Thank you, ${name}! Your message has been sent to basiltariq2006@gmail.com.`);
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3500);
    })
    .catch(err => {
      // Fallback: Mailto trigger if offline or blocked
      window.location.href = `mailto:basiltariq2006@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
      showToast('Opening your email app to send message to basiltariq2006@gmail.com');

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Utility to copy email address
window.copyEmail = function() {
  const emailText = "basiltariq2006@gmail.com";
  navigator.clipboard.writeText(emailText).then(() => {
    showToast("Email basiltariq2006@gmail.com copied to clipboard!");
  }).catch(() => {
    showToast("Email: " + emailText);
  });
};
