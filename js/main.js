/**
 * PRADEEP DHOTE - EXECUTIVE PORTFOLIO
 * Main JavaScript Controller
 * Vanilla JS - No External Dependencies
 */

function bootstrapPortfolio() {
  // 1. Initialize Page Load Bar
  initPageLoadProgress();

  // 2. Initialize Theme Management (Light / Dark)
  initThemeToggle();

  // 3. Initialize Sticky Header & Mobile Navigation
  initNavigation();

  // 4. Initialize Hero Typing Effect
  initTypingEffect();

  // 5. Initialize Scroll Reveals & Metric Counters
  initScrollAnimations();

  // 6. Initialize Homepage Subtabs Showcase Menu
  initSubtabsMenu();

  // 7. Initialize Portfolio & Knowledge Center Filters
  initFilterTabs();

  // 8. Initialize Knowledge Center Live Search
  initKnowledgeSearch();

  // 9. Initialize Modals & Interactive Forms
  initModalsAndForms();

  // 10. Initialize Visitor Counter Simulator
  initVisitorCounter();

  // 11. Initialize Back-to-Top Floating Control
  initBackToTop();

  // 12. Initialize Executive Insights Newsletter Form
  initNewsletterSubscription();

  // 13. Initialize Dynamic Articles & Podcasts Studio Pages
  initDynamicStudioPages();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapPortfolio);
} else {
  bootstrapPortfolio();
}

/* --------------------------------------------------------------------------
   1. PAGE LOAD PROGRESS BAR
   -------------------------------------------------------------------------- */
function initPageLoadProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'page-load-bar';
  document.body.appendChild(progressBar);

  setTimeout(() => { progressBar.style.width = '70%'; }, 50);
  window.addEventListener('load', () => {
    progressBar.style.width = '100%';
    setTimeout(() => {
      progressBar.style.opacity = '0';
      setTimeout(() => progressBar.remove(), 400);
    }, 300);
  });
}

/* --------------------------------------------------------------------------
   2. THEME TOGGLE (LIGHT / DARK)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('pradeep_theme') || 'light';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(toggleBtn, savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('pradeep_theme', newTheme);
      updateThemeIcon(toggleBtn, newTheme);
    });
  }
}

function updateThemeIcon(btn, theme) {
  if (!btn) return;
  if (theme === 'dark') {
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    btn.setAttribute('aria-label', 'Switch to Light Theme');
  } else {
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    btn.setAttribute('aria-label', 'Switch to Dark Theme');
  }
}

/* --------------------------------------------------------------------------
   3. STICKY NAVBAR & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu drawer
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      mobileToggle.innerHTML = isActive
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });

    // Close menu when clicking nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. HERO DYNAMIC TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingTarget = document.getElementById('typingText');
  if (!typingTarget) return;

  const roles = [
    'Telecom AI Consultant',
    'Private 5G Architecture Expert',
    'Digital Transformation Leader',
    'Technical Project Manager'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const delayBetween = 2000;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => { isDeleting = true; type(); }, delayBetween);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
  }

  type();
}

/* --------------------------------------------------------------------------
   5. SCROLL ANIMATIONS & COUNTER METRICS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // Reveal elements on scroll
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  // Counter animation for metrics
  const counters = document.querySelectorAll('.metric-value[data-target]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const isDecimal = target % 1 !== 0;
  const duration = 2000;
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const counterInterval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // Ease out quad formula
    const currentVal = target * (1 - Math.pow(1 - progress, 2));

    if (frame >= totalFrames) {
      el.textContent = `${prefix}${isDecimal ? target.toFixed(2) : Math.round(target)}${suffix}`;
      clearInterval(counterInterval);
    } else {
      el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(2) : Math.round(currentVal)}${suffix}`;
    }
  }, frameRate);
}

/* --------------------------------------------------------------------------
   6. HOMEPAGE SUBTABS SHOWCASE MENU SYSTEM
   -------------------------------------------------------------------------- */
function initSubtabsMenu() {
  const subtabBtns = document.querySelectorAll('.subtab-btn');
  const subtabPanels = document.querySelectorAll('.subtab-panel');

  if (subtabBtns.length === 0 || subtabPanels.length === 0) return;

  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSubtab = btn.getAttribute('data-subtab');

      // Update active subtab button
      subtabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active subtab panel
      subtabPanels.forEach(panel => {
        const panelKey = panel.getAttribute('id');
        if (targetSubtab === 'all') {
          panel.classList.add('active');
        } else {
          if (panelKey === `subtab-${targetSubtab}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. PORTFOLIO & KNOWLEDGE CENTER FILTER TABS
   -------------------------------------------------------------------------- */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category').split(' ');
        if (selectedCategory === 'all' || itemCategories.includes(selectedCategory)) {
          item.style.display = '';
          item.classList.add('active');
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. KNOWLEDGE CENTER LIVE SEARCH
   -------------------------------------------------------------------------- */
function initKnowledgeSearch() {
  const searchInput = document.getElementById('knowledgeSearchInput');
  const resourceCards = document.querySelectorAll('.resource-card');

  if (!searchInput || resourceCards.length === 0) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    resourceCards.forEach(card => {
      const textContent = card.textContent.toLowerCase();
      if (textContent.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. MODALS & FORMS
   -------------------------------------------------------------------------- */
function initModalsAndForms() {
  // Modal Triggers
  const openModalBtns = document.querySelectorAll('[data-modal-target]');
  const closeModalBtns = document.querySelectorAll('.modal-close, [data-modal-close]');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Contact Form Submission Simulation
  const contactForm = document.getElementById('executiveContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg> Transmitting Message...`;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `✓ Message Sent Successfully!`;
        submitBtn.style.backgroundColor = '#10b981';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
        }, 4000);
      }, 1500);
    });
  }
}

/* --------------------------------------------------------------------------
   9. VISITOR COUNTER SIMULATION
   -------------------------------------------------------------------------- */
function initVisitorCounter() {
  const counterEl = document.getElementById('visitorCounter');
  if (!counterEl) return;

  let baseVisitors = parseInt(localStorage.getItem('pradeep_visitor_count') || '14820', 10);
  baseVisitors += 1;
  localStorage.setItem('pradeep_visitor_count', baseVisitors.toString());

  counterEl.textContent = baseVisitors.toLocaleString();
}

/* --------------------------------------------------------------------------
   10. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   12. EXECUTIVE INSIGHTS NEWSLETTER SUBSCRIPTION
   -------------------------------------------------------------------------- */
function initNewsletterSubscription() {
  const forms = document.querySelectorAll('[data-newsletter-form]');
  if (forms.length === 0) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function renderFeedback(feedbackEl, stateClass, iconSvg, message) {
    if (!feedbackEl) return;
    feedbackEl.className = 'footer-newsletter-feedback';
    if (stateClass) {
      feedbackEl.classList.add(stateClass);
    }
    feedbackEl.innerHTML = '';

    if (iconSvg) {
      const iconWrap = document.createElement('span');
      iconWrap.setAttribute('aria-hidden', 'true');
      iconWrap.style.display = 'inline-flex';
      iconWrap.style.flexShrink = '0';
      iconWrap.style.marginTop = '2px';
      iconWrap.innerHTML = iconSvg;
      feedbackEl.appendChild(iconWrap);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    feedbackEl.appendChild(textSpan);
  }

  const checkIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const infoIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  const errorIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  forms.forEach((form) => {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const feedbackEl = form.querySelector('[data-newsletter-feedback]');
    if (!emailInput || !submitBtn) return;

    const defaultBtnLabel = submitBtn.textContent.trim() || 'Subscribe';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();

      if (!email || email.length > 254 || !emailPattern.test(email)) {
        renderFeedback(
          feedbackEl,
          'is-error',
          errorIcon,
          'Please enter a valid corporate or work email address.'
        );
        emailInput.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';
      renderFeedback(feedbackEl, '', '', 'Submitting subscription...');

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            sourcePage: window.location.pathname || '/',
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          renderFeedback(
            feedbackEl,
            'is-error',
            errorIcon,
            data.error || 'Unable to subscribe right now. Please try again.'
          );
          return;
        }

        if (data.status === 'already_subscribed') {
          renderFeedback(
            feedbackEl,
            'is-info',
            infoIcon,
            data.message || 'This email is already subscribed to Executive Insights.'
          );
          return;
        }

        form.reset();
        renderFeedback(
          feedbackEl,
          'is-success',
          checkIcon,
          data.message || 'Subscribed. Upcoming Telecom AI & Private 5G whitepapers will be sent to your inbox.'
        );
      } catch (_err) {
        renderFeedback(
          feedbackEl,
          'is-error',
          errorIcon,
          'Network error while subscribing. Please check your connection and try again.'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnLabel;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. DYNAMIC ARTICLES & PODCASTS STUDIO (AUTHOR AUTH, CRUD, GITHUB PAGES MODE)
   -------------------------------------------------------------------------- */
function initDynamicStudioPages() {
  const articlesPage = document.querySelector('[data-articles-page]');
  const podcastsPage = document.querySelector('[data-podcasts-page]');
  const resumePage = document.querySelector('[data-resume-page]');
  if (!articlesPage && !podcastsPage && !resumePage) return;

  // Held strictly in JS memory (never stored in localStorage or sessionStorage)
  let authorToken = null;
  let authorConfigured = false;
  let pendingAuthAction = null;
  let staticMode = false;

  const STATIC_AUTHOR_KEY = 'pd_static_author_v1';
  const STATIC_ARTICLES_KEY = 'pd_static_articles_v1';
  const STATIC_DELETED_ARTICLES_KEY = 'pd_static_deleted_article_ids_v1';
  const STATIC_PODCASTS_KEY = 'pd_static_podcasts_v1';
  const STATIC_DELETED_PODCASTS_KEY = 'pd_static_deleted_podcast_ids_v1';
  const SAFE_DATA_IMAGE_REGEX = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i;
  const MAX_IMAGE_STR_LEN = 1500000;

  const authBtn = document.getElementById('authorAuthBtn');
  const authModal = document.getElementById('authorAuthModal');
  const authTitle = document.getElementById('authorAuthTitle');
  const authDesc = document.getElementById('authorAuthDesc');
  const authLabel = document.getElementById('authorPasscodeLabel');
  const authForm = document.getElementById('authorAuthForm');
  const authInput = document.getElementById('authorPasscodeInput');
  const authFeedback = document.getElementById('authorAuthFeedback');
  const authSubmitBtn = document.getElementById('authorAuthSubmitBtn');
  const githubStaticBanner = document.getElementById('githubStaticBanner');

  function isJsonResponse(res) {
    if (!res || !res.ok) return false;
    const ct = res.headers.get('content-type') || '';
    return ct.toLowerCase().includes('application/json');
  }

  function showStaticBannerIfNeeded() {
    if (githubStaticBanner) {
      githubStaticBanner.style.display = staticMode ? 'flex' : 'none';
    }
  }

  function readLocalJson(key, fallbackValue) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallbackValue;
      return JSON.parse(raw);
    } catch (_err) {
      return fallbackValue;
    }
  }

  function writeLocalJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_err) {
      return false;
    }
  }

  async function hashStaticPasscode(passcode, salt) {
    const input = `${salt}:${passcode}`;
    if (window.crypto && window.crypto.subtle) {
      const encoded = new TextEncoder().encode(input);
      const digest = await window.crypto.subtle.digest('SHA-256', encoded);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `fallback_${(hash >>> 0).toString(16)}`;
  }

  function generateStaticSalt() {
    if (window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint8Array(12);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return String(Date.now());
  }

  function formatDisplayDate(isoString) {
    const parsed = new Date(isoString);
    if (Number.isNaN(parsed.getTime())) return 'Recently published';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function setStudioFeedback(el, type, message) {
    if (!el) return;
    el.className = 'studio-form-feedback';
    if (type === 'error') el.classList.add('is-error');
    if (type === 'success') el.classList.add('is-success');
    el.textContent = message;
  }

  function sanitizeArticleImageSrc(rawValue) {
    if (typeof rawValue !== 'string') return '';
    const trimmed = rawValue.trim();
    if (!trimmed || trimmed.length > MAX_IMAGE_STR_LEN) return '';

    if (SAFE_DATA_IMAGE_REGEX.test(trimmed)) {
      return trimmed;
    }
    if (/^(assets\/images\/|\/assets\/images\/)[a-zA-Z0-9._/-]+$/.test(trimmed)) {
      return trimmed.replace(/^\//, '');
    }
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return parsed.toString();
      }
    } catch (_err) {
      return '';
    }
    return '';
  }

  function compressImageFileToDataUrl(file, maxWidth = 1200, quality = 0.84) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Please choose a valid PNG, JPEG, WebP, or GIF image.'));
        return;
      }
      if (/svg/i.test(file.type)) {
        reject(new Error('For security, please upload a raster image (PNG, JPG, WebP, or GIF).'));
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        reject(new Error('Image file is too large (max 12 MB before optimization).'));
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Unable to read image file.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Invalid or unsupported image file.'));
        img.onload = () => {
          const scale = img.width > maxWidth ? maxWidth / img.width : 1;
          const targetWidth = Math.max(1, Math.round(img.width * scale));
          const targetHeight = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Browser canvas unavailable for image processing.'));
            return;
          }
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const outputMime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
          let dataUrl = canvas.toDataURL(outputMime, quality);
          if (!dataUrl.startsWith('data:image/')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          if (dataUrl.length > MAX_IMAGE_STR_LEN) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          }
          if (dataUrl.length > MAX_IMAGE_STR_LEN) {
            reject(new Error('Compressed image is still too large. Please use a smaller image.'));
            return;
          }
          resolve(dataUrl);
        };
        img.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slugifyFilename(title) {
    const clean = String(title || 'article')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70);
    return clean || 'executive-article';
  }

  function downloadBlobFile(filename, textContent, mimeType) {
    const blob = new Blob([textContent], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
  }

  function parseArticleBlocks(content) {
    const blocks = [];
    const lines = String(content || '').replace(/\r\n/g, '\n').split('\n');
    let paragraphLines = [];

    function flushParagraph() {
      if (paragraphLines.length === 0) return;
      const text = paragraphLines.join(' ').trim();
      paragraphLines = [];
      if (text) blocks.push({ type: 'p', text });
    }

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        return;
      }

      const h3Match = /^###\s+(.+)$/.exec(line);
      if (h3Match) {
        flushParagraph();
        blocks.push({ type: 'h3', text: h3Match[1].trim() });
        return;
      }

      const h2Match = /^##\s+(.+)$/.exec(line);
      if (h2Match) {
        flushParagraph();
        blocks.push({ type: 'h2', text: h2Match[1].trim() });
        return;
      }

      const placeholderMatch = /^\[IMAGE_PLACEHOLDER:\s*([^|\]]+?)(?:\s*\|\s*([^\]]*))?\]$/i.exec(line);
      if (placeholderMatch) {
        flushParagraph();
        blocks.push({
          type: 'placeholder',
          title: placeholderMatch[1].trim(),
          desc: (placeholderMatch[2] || '').trim(),
        });
        return;
      }

      const imageMatch = /^\[IMAGE:\s*([^|\]]+?)(?:\s*\|\s*([^\]]*))?\]$/i.exec(line);
      if (imageMatch) {
        flushParagraph();
        const rawSrc = imageMatch[1].trim();
        const caption = (imageMatch[2] || '').trim();
        if (rawSrc.toLowerCase() === 'placeholder') {
          blocks.push({
            type: 'placeholder',
            title: caption || 'Reference Image Placeholder',
            desc: 'Replace placeholder tag with architecture diagram or chart.',
          });
        } else {
          const cleanSrc = sanitizeArticleImageSrc(rawSrc);
          if (cleanSrc) {
            blocks.push({ type: 'image', src: cleanSrc, caption });
          } else {
            blocks.push({
              type: 'placeholder',
              title: caption || 'External Image Reference',
              desc: 'Invalid or unsupported image path.',
            });
          }
        }
        return;
      }

      const mdImgMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
      if (mdImgMatch) {
        flushParagraph();
        const alt = mdImgMatch[1].trim();
        const rawUrl = mdImgMatch[2].trim();
        if (rawUrl.toLowerCase() === 'placeholder') {
          blocks.push({
            type: 'placeholder',
            title: alt || 'Reference Image Placeholder',
            desc: 'Replace placeholder tag with your reference architecture diagram.',
          });
        } else {
          const cleanSrc = sanitizeArticleImageSrc(rawUrl);
          if (cleanSrc) {
            blocks.push({ type: 'image', src: cleanSrc, caption: alt });
          }
        }
        return;
      }

      paragraphLines.push(line);
    });

    flushParagraph();
    return blocks;
  }

  function renderArticleBlocksToDom(container, content) {
    container.innerHTML = '';
    const blocks = parseArticleBlocks(content);

    blocks.forEach((block) => {
      if (block.type === 'h2') {
        const h3 = document.createElement('h3');
        h3.className = 'article-reader-h2';
        h3.textContent = block.text;
        container.appendChild(h3);
      } else if (block.type === 'h3') {
        const h4 = document.createElement('h4');
        h4.className = 'article-reader-h3';
        h4.textContent = block.text;
        container.appendChild(h4);
      } else if (block.type === 'image') {
        const fig = document.createElement('figure');
        fig.className = 'article-inline-figure';
        const img = document.createElement('img');
        img.src = block.src;
        img.alt = block.caption || 'Article architecture illustration';
        img.loading = 'lazy';
        fig.appendChild(img);
        if (block.caption) {
          const cap = document.createElement('figcaption');
          cap.textContent = block.caption;
          fig.appendChild(cap);
        }
        container.appendChild(fig);
      } else if (block.type === 'placeholder') {
        const box = document.createElement('div');
        box.className = 'article-placeholder-frame';

        const iconWrap = document.createElement('div');
        iconWrap.className = 'article-placeholder-icon';
        iconWrap.setAttribute('aria-hidden', 'true');
        iconWrap.innerHTML =
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

        const badge = document.createElement('span');
        badge.className = 'article-placeholder-badge';
        badge.textContent = 'Reference Image Placeholder';

        const title = document.createElement('div');
        title.className = 'article-placeholder-title';
        title.textContent = block.title;

        box.append(iconWrap, badge, title);
        if (block.desc) {
          const desc = document.createElement('div');
          desc.className = 'article-placeholder-desc';
          desc.textContent = block.desc;
          box.appendChild(desc);
        }
        container.appendChild(box);
      } else {
        const p = document.createElement('p');
        p.textContent = block.text;
        container.appendChild(p);
      }
    });
  }

  function buildStandaloneArticleHtml(article) {
    const cleanCover = sanitizeArticleImageSrc(article.coverImage || '');
    const blocks = parseArticleBlocks(article.content);
    const tagsHtml =
      Array.isArray(article.tags) && article.tags.length > 0
        ? `<div class="tags">${article.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`
        : '';

    const coverHtml = cleanCover
      ? `<figure class="figure"><img src="${escapeHtml(cleanCover)}" alt="${escapeHtml(article.coverCaption || article.title)}">${
          article.coverCaption ? `<figcaption>${escapeHtml(article.coverCaption)}</figcaption>` : ''
        }</figure>`
      : '';

    const bodyHtml = blocks
      .map((block) => {
        if (block.type === 'h2') return `<h2>${escapeHtml(block.text)}</h2>`;
        if (block.type === 'h3') return `<h3>${escapeHtml(block.text)}</h3>`;
        if (block.type === 'image') {
          return `<figure class="figure"><img src="${escapeHtml(block.src)}" alt="${escapeHtml(
            block.caption || article.title
          )}">${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`;
        }
        if (block.type === 'placeholder') {
          return `<div class="placeholder"><div class="ph-badge">Reference Image Placeholder</div><div class="ph-title">${escapeHtml(
            block.title
          )}</div>${block.desc ? `<div class="ph-desc">${escapeHtml(block.desc)}</div>` : ''}</div>`;
        }
        return `<p>${escapeHtml(block.text)}</p>`;
      })
      .join('\n      ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(article.title)} | Pradeep Dhote</title>
  <meta name="description" content="${escapeHtml(article.summary)}">
  <style>
    :root { color-scheme: light dark; --bg: #f8fafc; --surface: #ffffff; --text: #0f172a; --muted: #475569; --border: #e2e8f0; --accent: #2563eb; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #020817; --surface: #0f172a; --text: #f8fafc; --muted: #94a3b8; --border: #1e293b; --accent: #38bdf8; }
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); line-height: 1.75; }
    .topbar { border-bottom: 1px solid var(--border); background: var(--surface); padding: 1rem 1.5rem; }
    .topbar-inner { max-width: 820px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .brand { font-weight: 700; text-decoration: none; color: var(--text); letter-spacing: 0.02em; }
    .back-link { color: var(--accent); text-decoration: none; font-weight: 600; font-size: 0.92rem; }
    .back-link:hover { text-decoration: underline; }
    main { max-width: 820px; margin: 2.5rem auto 4rem auto; padding: 0 1.5rem; }
    article { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 2.5rem; }
    .meta { font-size: 0.88rem; color: var(--muted); font-weight: 500; margin-bottom: 0.75rem; }
    .cat { color: var(--accent); font-weight: 700; }
    h1 { font-size: clamp(1.75rem, 3vw, 2.35rem); line-height: 1.22; margin: 0 0 0.9rem 0; }
    .summary { font-size: 1.08rem; color: var(--muted); margin: 0 0 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
    h2 { font-size: 1.32rem; margin: 1.85rem 0 0.6rem 0; }
    h3 { font-size: 1.12rem; margin: 1.4rem 0 0.5rem 0; }
    p { margin: 0 0 1.15rem 0; }
    .figure { margin: 1.5rem 0; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
    .figure img { width: 100%; max-height: 430px; object-fit: cover; display: block; }
    .figure figcaption { padding: 0.7rem 1rem; font-size: 0.86rem; color: var(--muted); border-top: 1px solid var(--border); }
    .placeholder { margin: 1.5rem 0; padding: 1.5rem; border: 2px dashed var(--accent); border-radius: 10px; text-align: center; }
    .ph-badge { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.35rem; }
    .ph-title { font-weight: 700; font-size: 1.02rem; margin-bottom: 0.25rem; }
    .ph-desc { font-size: 0.88rem; color: var(--muted); }
    .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border); }
    .tag { font-size: 0.82rem; color: var(--muted); border: 1px solid var(--border); border-radius: 6px; padding: 0.25rem 0.65rem; }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="index.html">PRADEEP DHOTE</a>
      <a class="back-link" href="articles.html">&larr; Back to All Articles</a>
    </div>
  </header>
  <main>
    <article>
      <div class="meta"><span class="cat">${escapeHtml(article.category)}</span> &middot; ${escapeHtml(
        formatDisplayDate(article.publishedAt)
      )} &middot; ${escapeHtml(article.readTime)} &middot; ${escapeHtml(article.author || 'Pradeep Dhote')}</div>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="summary">${escapeHtml(article.summary)}</p>
      ${coverHtml}
      ${bodyHtml}
      ${tagsHtml}
    </article>
  </main>
</body>
</html>
`;
  }

  function updateAuthButtonUI() {
    if (!authBtn) return;
    if (authorToken) {
      authBtn.textContent = 'Lock Author Studio';
      authBtn.setAttribute('aria-pressed', 'true');
    } else {
      authBtn.textContent = authorConfigured ? 'Unlock Author Studio' : 'Set Author Passcode';
      authBtn.setAttribute('aria-pressed', 'false');
    }
  }

  async function refreshAuthorStatus() {
    try {
      const headers = authorToken ? { Authorization: `Bearer ${authorToken}` } : {};
      const res = await fetch('/api/author/status', { headers });
      if (isJsonResponse(res)) {
        staticMode = false;
        const data = await res.json();
        authorConfigured = Boolean(data.configured);
        if (!data.authenticated) {
          authorToken = null;
        }
      } else {
        staticMode = true;
      }
    } catch (_err) {
      staticMode = true;
    }

    if (staticMode) {
      const stored = readLocalJson(STATIC_AUTHOR_KEY, null);
      authorConfigured = Boolean(stored && typeof stored.hash === 'string' && typeof stored.salt === 'string');
    }

    showStaticBannerIfNeeded();
    updateAuthButtonUI();
  }

  function openAuthModal(onUnlocked) {
    pendingAuthAction = typeof onUnlocked === 'function' ? onUnlocked : null;
    if (!authModal) return;

    if (!authorConfigured) {
      if (authTitle) authTitle.textContent = 'Set Your Author Passcode';
      if (authDesc) {
        authDesc.textContent = staticMode
          ? 'Create a browser-local passcode (min 6 characters) to write or delete articles in GitHub Pages Static Mode.'
          : 'Create an author passcode (minimum 6 characters) once to protect writing and deleting articles or videos.';
      }
      if (authLabel) authLabel.textContent = 'New Author Passcode *';
      if (authInput) authInput.setAttribute('autocomplete', 'new-password');
      if (authSubmitBtn) authSubmitBtn.textContent = 'Save & Unlock Studio';
    } else {
      if (authTitle) authTitle.textContent = 'Unlock Author Studio';
      if (authDesc) {
        authDesc.textContent =
          'Enter your author passcode to write new posts or delete existing items.';
      }
      if (authLabel) authLabel.textContent = 'Author Passcode *';
      if (authInput) authInput.setAttribute('autocomplete', 'current-password');
      if (authSubmitBtn) authSubmitBtn.textContent = 'Unlock Studio';
    }

    setStudioFeedback(authFeedback, '', '');
    if (authForm) authForm.reset();
    authModal.classList.add('active');
    if (authInput) setTimeout(() => authInput.focus(), 50);
  }

  function ensureAuthorUnlocked(callback) {
    if (authorToken) {
      callback();
      return;
    }
    openAuthModal(callback);
  }

  if (authBtn) {
    authBtn.addEventListener('click', async () => {
      if (authorToken) {
        if (!staticMode) {
          try {
            await fetch('/api/author/logout', {
              method: 'POST',
              headers: { Authorization: `Bearer ${authorToken}` },
            });
          } catch (_err) {
            // Clear locally regardless
          }
        }
        authorToken = null;
        if (typeof window.__clearGitHubTokenSession === 'function') {
          window.__clearGitHubTokenSession();
        }
        updateAuthButtonUI();
        if (typeof window.__refreshStudioRender === 'function') {
          window.__refreshStudioRender();
        }
        return;
      }
      await refreshAuthorStatus();
      openAuthModal(() => {
        if (typeof window.__refreshStudioRender === 'function') {
          window.__refreshStudioRender();
        }
      });
    });
  }

  if (authForm && authInput && authSubmitBtn) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passcode = authInput.value.trim();

      if (passcode.length < 6) {
        setStudioFeedback(authFeedback, 'error', 'Passcode must be at least 6 characters.');
        authInput.focus();
        return;
      }

      authSubmitBtn.disabled = true;

      if (staticMode) {
        try {
          const existing = readLocalJson(STATIC_AUTHOR_KEY, null);
          if (!existing || !existing.hash || !existing.salt) {
            const salt = generateStaticSalt();
            const hash = await hashStaticPasscode(passcode, salt);
            writeLocalJson(STATIC_AUTHOR_KEY, { salt, hash });
          } else {
            const candidate = await hashStaticPasscode(passcode, existing.salt);
            if (candidate !== existing.hash) {
              setStudioFeedback(authFeedback, 'error', 'Incorrect author passcode.');
              return;
            }
          }
          authorToken = 'static-session';
          authorConfigured = true;
          updateAuthButtonUI();
          authModal?.classList.remove('active');
          authForm.reset();
          if (typeof window.__refreshStudioRender === 'function') {
            window.__refreshStudioRender();
          }
          if (pendingAuthAction) {
            const action = pendingAuthAction;
            pendingAuthAction = null;
            action();
          }
        } finally {
          authSubmitBtn.disabled = false;
        }
        return;
      }

      const endpoint = authorConfigured ? '/api/author/login' : '/api/author/setup';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.token) {
          if (res.status === 409) {
            authorConfigured = true;
            updateAuthButtonUI();
          }
          setStudioFeedback(authFeedback, 'error', data.error || 'Authentication failed.');
          return;
        }

        authorToken = data.token;
        authorConfigured = true;
        updateAuthButtonUI();
        authModal?.classList.remove('active');
        authForm.reset();

        if (typeof window.__refreshStudioRender === 'function') {
          window.__refreshStudioRender();
        }
        if (pendingAuthAction) {
          const action = pendingAuthAction;
          pendingAuthAction = null;
          action();
        }
      } catch (_err) {
        setStudioFeedback(authFeedback, 'error', 'Network error while verifying passcode.');
      } finally {
        authSubmitBtn.disabled = false;
      }
    });
  }

  function closeModalOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove('active');
    if (overlay.id === 'articleReaderModal') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('article')) {
        url.searchParams.delete('article');
        window.history.replaceState(null, '', url.toString());
      }
    }
  }

  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModalOverlay(btn.closest('.modal-overlay'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModalOverlay(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((m) => closeModalOverlay(m));
    }
  });

  refreshAuthorStatus();

  /* -------------------- ARTICLES PAGE CONTROLLER -------------------- */
  if (articlesPage) {
    let allArticles = [];
    let activeCategory = 'all';
    let searchQuery = '';
    let activeReaderArticle = null;

    const gridEl = document.getElementById('articlesGrid');
    const filterRowEl = document.getElementById('articleCategoryFilters');
    const searchInput = document.getElementById('articleSearchInput');
    const openGitHubSyncBtn = document.getElementById('openGitHubSyncBtn');
    const openGitHubSyncLabel = document.getElementById('openGitHubSyncLabel');
    const githubSyncStatusBar = document.getElementById('githubSyncStatusBar');
    const githubDeployModal = document.getElementById('githubDeployModal');
    const githubDeployForm = document.getElementById('githubDeployForm');
    const ghRepoInput = document.getElementById('ghRepoInput');
    const ghBranchInput = document.getElementById('ghBranchInput');
    const ghFilePathInput = document.getElementById('ghFilePathInput');
    const ghTokenInput = document.getElementById('ghTokenInput');
    const ghAutoSyncCheckbox = document.getElementById('ghAutoSyncCheckbox');
    const ghDisconnectBtn = document.getElementById('ghDisconnectBtn');
    const ghPushNowBtn = document.getElementById('ghPushNowBtn');
    const ghSaveConnectBtn = document.getElementById('ghSaveConnectBtn');
    const githubDeployFeedback = document.getElementById('githubDeployFeedback');

    const exportJsonBtn = document.getElementById('exportArticlesJsonBtn');
    const openWriteBtn = document.getElementById('openWriteArticleBtn');
    const writeModal = document.getElementById('writeArticleModal');
    const writeForm = document.getElementById('writeArticleForm');
    const writeFeedback = document.getElementById('writeArticleFeedback');
    const publishBtn = document.getElementById('publishArticleBtn');

    const GH_META_STORAGE_KEY = 'pd_gh_deploy_meta_v1';
    const GH_SESSION_TOKEN_KEY = 'pd_gh_session_pat_v1';
    let ghMemoryToken = '';

    function getGitHubToken() {
      if (ghMemoryToken) return ghMemoryToken;
      try {
        const stored = sessionStorage.getItem(GH_SESSION_TOKEN_KEY) || '';
        if (stored) ghMemoryToken = stored;
        return stored;
      } catch (_err) {
        return '';
      }
    }

    function setGitHubToken(token) {
      ghMemoryToken = token || '';
      try {
        if (ghMemoryToken) {
          sessionStorage.setItem(GH_SESSION_TOKEN_KEY, ghMemoryToken);
        } else {
          sessionStorage.removeItem(GH_SESSION_TOKEN_KEY);
        }
      } catch (_err) {
        // Ignore sessionStorage restrictions
      }
    }

    window.__clearGitHubTokenSession = () => {
      setGitHubToken('');
      updateGitHubButtonUI();
    };

    function getGitHubMeta() {
      const saved = readLocalJson(GH_META_STORAGE_KEY, null);
      if (saved && typeof saved === 'object') {
        return {
          repo: typeof saved.repo === 'string' ? saved.repo : '',
          branch: typeof saved.branch === 'string' && saved.branch ? saved.branch : 'main',
          filePath:
            typeof saved.filePath === 'string' && saved.filePath
              ? saved.filePath
              : 'public/data/articles.json',
          autoSync: saved.autoSync !== false,
        };
      }
      return {
        repo: '',
        branch: 'main',
        filePath: 'public/data/articles.json',
        autoSync: true,
      };
    }

    function saveGitHubMeta(meta) {
      writeLocalJson(GH_META_STORAGE_KEY, meta);
    }

    function isValidGitHubRepo(repo) {
      return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo);
    }

    function isValidGitHubBranch(branch) {
      return /^[A-Za-z0-9._/-]{1,80}$/.test(branch) && !branch.includes('..');
    }

    function isValidGitHubFilePath(filePath) {
      return (
        /^[A-Za-z0-9._/-]{3,180}\.json$/i.test(filePath) &&
        !filePath.startsWith('/') &&
        !filePath.includes('..')
      );
    }

    function utf8ToBase64(str) {
      const bytes = new TextEncoder().encode(str);
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    }

    function updateGitHubButtonUI() {
      const meta = getGitHubMeta();
      const connected = Boolean(isValidGitHubRepo(meta.repo) && getGitHubToken());
      if (openGitHubSyncLabel) {
        openGitHubSyncLabel.textContent = connected ? `GitHub: ${meta.repo.split('/')[1]}` : 'GitHub Auto-Deploy';
      }
      if (ghDisconnectBtn) {
        ghDisconnectBtn.style.display = meta.repo || getGitHubToken() ? '' : 'none';
      }
    }

    function renderGitHubStatusBar(type, message, repoForActions) {
      if (!githubSyncStatusBar) return;
      githubSyncStatusBar.className = 'github-sync-status-bar';
      if (type === 'success') githubSyncStatusBar.classList.add('is-success');
      if (type === 'error') githubSyncStatusBar.classList.add('is-error');
      githubSyncStatusBar.innerHTML = '';

      const msgSpan = document.createElement('span');
      msgSpan.textContent = message;
      githubSyncStatusBar.appendChild(msgSpan);

      if (repoForActions && isValidGitHubRepo(repoForActions)) {
        const actionsLink = document.createElement('a');
        actionsLink.href = `https://github.com/${repoForActions}/actions`;
        actionsLink.target = '_blank';
        actionsLink.rel = 'noopener noreferrer';
        actionsLink.textContent = 'View GitHub Pages Build →';
        githubSyncStatusBar.appendChild(actionsLink);
      }

      githubSyncStatusBar.style.display = message ? 'flex' : 'none';
    }

    async function pushArticlesToGitHub(articlesList, commitMessage, attempt = 1) {
      const meta = getGitHubMeta();
      const token = getGitHubToken();
      if (!isValidGitHubRepo(meta.repo) || !isValidGitHubBranch(meta.branch) || !isValidGitHubFilePath(meta.filePath)) {
        throw new Error('Please configure a valid GitHub repository, branch, and JSON path.');
      }
      if (!token) {
        throw new Error('GitHub Personal Access Token is missing for this session.');
      }

      const encodedPath = meta.filePath
        .split('/')
        .map((seg) => encodeURIComponent(seg))
        .join('/');
      const apiBase = `https://api.github.com/repos/${meta.repo}/contents/${encodedPath}`;
      const headers = {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      };

      let existingSha;
      const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(meta.branch)}`, { headers });
      if (getRes.ok) {
        const fileData = await getRes.json();
        if (fileData && typeof fileData.sha === 'string') {
          existingSha = fileData.sha;
        }
      } else if (getRes.status !== 404) {
        const errData = await getRes.json().catch(() => ({}));
        throw new Error(errData.message || `GitHub lookup failed (${getRes.status}).`);
      }

      const jsonBody = `${JSON.stringify(articlesList, null, 2)}\n`;
      const putRes = await fetch(apiBase, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage.slice(0, 120),
          content: utf8ToBase64(jsonBody),
          branch: meta.branch,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      });

      if ((putRes.status === 409 || putRes.status === 422) && attempt === 1) {
        return pushArticlesToGitHub(articlesList, commitMessage, 2);
      }

      const putData = await putRes.json().catch(() => ({}));
      if (!putRes.ok) {
        throw new Error(putData.message || `GitHub commit failed (${putRes.status}).`);
      }

      const shortSha = putData?.commit?.sha ? putData.commit.sha.slice(0, 7) : 'committed';
      return { shortSha, repo: meta.repo };
    }

    async function maybeAutoSyncToGitHub(commitMessage) {
      const meta = getGitHubMeta();
      const token = getGitHubToken();
      if (!meta.autoSync || !token || !isValidGitHubRepo(meta.repo)) {
        return;
      }

      renderGitHubStatusBar('', `Syncing article update to ${meta.repo} (${meta.branch})...`, null);
      try {
        const result = await pushArticlesToGitHub(allArticles, commitMessage);
        renderGitHubStatusBar(
          'success',
          `Auto-synced to GitHub (${result.shortSha}). GitHub Pages is rebuilding now (~45s).`,
          result.repo
        );
      } catch (err) {
        renderGitHubStatusBar(
          'error',
          `Saved locally, but GitHub sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          meta.repo
        );
      }
    }

    const coverUrlInput = document.getElementById('articleCoverImageInput');
    const coverFileInput = document.getElementById('articleCoverFileInput');
    const coverPreviewWrap = document.getElementById('articleCoverPreviewWrap');
    const coverPreviewImg = document.getElementById('articleCoverPreviewImg');
    const coverClearBtn = document.getElementById('articleCoverClearBtn');
    const coverCaptionInput = document.getElementById('articleCoverCaptionInput');

    const contentTextarea = document.getElementById('articleContentInput');
    const insertHeadingBtn = document.getElementById('insertHeadingBtn');
    const toggleInlineImgBtn = document.getElementById('toggleInlineImagePanelBtn');
    const inlineImgPanel = document.getElementById('inlineImagePanel');
    const inlineImgUrlInput = document.getElementById('inlineImgUrlInput');
    const inlineImgFileInput = document.getElementById('inlineImgFileInput');
    const inlineImgCaptionInput = document.getElementById('inlineImgCaptionInput');
    const cancelInlineImgBtn = document.getElementById('cancelInlineImageBtn');
    const confirmInsertImgBtn = document.getElementById('confirmInsertInlineImageBtn');

    const togglePlaceholderBtn = document.getElementById('togglePlaceholderPanelBtn');
    const placeholderPanel = document.getElementById('placeholderBlockPanel');
    const placeholderTitleInput = document.getElementById('placeholderTitleInput');
    const placeholderDescInput = document.getElementById('placeholderDescInput');
    const cancelPlaceholderBtn = document.getElementById('cancelPlaceholderBtn');
    const confirmPlaceholderBtn = document.getElementById('confirmInsertPlaceholderBtn');

    const readerModal = document.getElementById('articleReaderModal');
    const readerMeta = document.getElementById('readerMetaLine');
    const readerTitle = document.getElementById('readerTitle');
    const readerSummary = document.getElementById('readerSummary');
    const readerCoverFigure = document.getElementById('readerCoverFigure');
    const readerCoverImg = document.getElementById('readerCoverImg');
    const readerCoverCaption = document.getElementById('readerCoverCaption');
    const readerBody = document.getElementById('readerBody');
    const readerTags = document.getElementById('readerTags');
    const copyLinkBtn = document.getElementById('copyArticleLinkBtn');
    const downloadHtmlBtn = document.getElementById('downloadArticleHtmlBtn');
    const readerShareFeedback = document.getElementById('readerShareFeedback');

    function updateCoverPreview(rawSrc) {
      if (!coverPreviewWrap || !coverPreviewImg) return;
      const clean = sanitizeArticleImageSrc(rawSrc);
      if (clean) {
        coverPreviewImg.src = clean;
        coverPreviewWrap.style.display = 'flex';
      } else {
        coverPreviewImg.removeAttribute('src');
        coverPreviewWrap.style.display = 'none';
      }
    }

    function insertTextAtCursor(textarea, snippet) {
      if (!textarea) return;
      const start = typeof textarea.selectionStart === 'number' ? textarea.selectionStart : textarea.value.length;
      const end = typeof textarea.selectionEnd === 'number' ? textarea.selectionEnd : textarea.value.length;
      const before = textarea.value.slice(0, start);
      const after = textarea.value.slice(end);
      const prefix = before.length > 0 && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
      const suffix = after.length > 0 && !after.startsWith('\n\n') ? (after.startsWith('\n') ? '\n' : '\n\n') : '';
      const inserted = `${prefix}${snippet}${suffix}`;
      textarea.value = `${before}${inserted}${after}`;
      const cursorPos = before.length + inserted.length;
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }

    function openArticleReader(article) {
      if (!readerModal || !readerTitle || !readerBody || !readerMeta) return;
      activeReaderArticle = article;
      setStudioFeedback(readerShareFeedback, '', '');
      readerMeta.innerHTML = '';

      const catSpan = document.createElement('span');
      catSpan.className = 'editorial-meta-category';
      catSpan.textContent = article.category;

      const sep1 = document.createElement('span');
      sep1.setAttribute('aria-hidden', 'true');
      sep1.textContent = '·';

      const dateSpan = document.createElement('span');
      dateSpan.textContent = formatDisplayDate(article.publishedAt);

      const sep2 = document.createElement('span');
      sep2.setAttribute('aria-hidden', 'true');
      sep2.textContent = '·';

      const readSpan = document.createElement('span');
      readSpan.textContent = article.readTime;

      const sep3 = document.createElement('span');
      sep3.setAttribute('aria-hidden', 'true');
      sep3.textContent = '·';

      const authorSpan = document.createElement('span');
      authorSpan.textContent = article.author || 'Pradeep Dhote';

      readerMeta.append(catSpan, sep1, dateSpan, sep2, readSpan, sep3, authorSpan);
      readerTitle.textContent = article.title;
      if (readerSummary) readerSummary.textContent = article.summary;

      const cleanCover = sanitizeArticleImageSrc(article.coverImage || '');
      if (readerCoverFigure && readerCoverImg && readerCoverCaption) {
        if (cleanCover) {
          readerCoverImg.src = cleanCover;
          readerCoverImg.alt = article.coverCaption || article.title;
          readerCoverCaption.textContent = article.coverCaption || '';
          readerCoverCaption.style.display = article.coverCaption ? '' : 'none';
          readerCoverFigure.style.display = '';
        } else {
          readerCoverImg.removeAttribute('src');
          readerCoverFigure.style.display = 'none';
        }
      }

      renderArticleBlocksToDom(readerBody, article.content);

      if (readerTags) {
        readerTags.textContent =
          Array.isArray(article.tags) && article.tags.length > 0
            ? `Topics: ${article.tags.join(' · ')}`
            : '';
      }

      const url = new URL(window.location.href);
      url.searchParams.set('article', article.id);
      window.history.replaceState(null, '', url.toString());

      readerModal.classList.add('active');
    }

    function renderArticleFilters() {
      if (!filterRowEl) return;
      const categories = ['all', ...new Set(allArticles.map((a) => a.category))];
      if (!categories.includes(activeCategory)) activeCategory = 'all';

      filterRowEl.innerHTML = '';
      categories.forEach((category) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `studio-filter-tab${activeCategory === category ? ' active' : ''}`;
        btn.textContent = category === 'all' ? 'All Articles' : category;
        btn.addEventListener('click', () => {
          activeCategory = category;
          renderArticleFilters();
          renderArticles();
        });
        filterRowEl.appendChild(btn);
      });
    }

    async function deleteArticle(id, feedbackTarget) {
      if (!authorToken) {
        ensureAuthorUnlocked(() => deleteArticle(id, feedbackTarget));
        return;
      }

      const targetArticle = allArticles.find((item) => item.id === id);
      const commitSummary = targetArticle
        ? `chore(articles): remove "${targetArticle.title.slice(0, 60)}"`
        : 'chore(articles): remove article';

      if (staticMode) {
        const customArticles = readLocalJson(STATIC_ARTICLES_KEY, []);
        const filteredCustom = Array.isArray(customArticles)
          ? customArticles.filter((item) => item && item.id !== id)
          : [];
        writeLocalJson(STATIC_ARTICLES_KEY, filteredCustom);

        const deletedIds = readLocalJson(STATIC_DELETED_ARTICLES_KEY, []);
        if (Array.isArray(deletedIds) && !deletedIds.includes(id)) {
          writeLocalJson(STATIC_DELETED_ARTICLES_KEY, [...deletedIds, id]);
        }

        allArticles = allArticles.filter((item) => item.id !== id);
        renderArticleFilters();
        renderArticles();
        await maybeAutoSyncToGitHub(commitSummary);
        return;
      }

      try {
        const res = await fetch(`/api/articles/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authorToken}` },
        });
        if (res.status === 401) {
          authorToken = null;
          updateAuthButtonUI();
          openAuthModal(() => deleteArticle(id, feedbackTarget));
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (feedbackTarget) feedbackTarget.textContent = data.error || 'Delete failed.';
          return;
        }
        allArticles = allArticles.filter((item) => item.id !== id);
        renderArticleFilters();
        renderArticles();
        await maybeAutoSyncToGitHub(commitSummary);
      } catch (_err) {
        if (feedbackTarget) feedbackTarget.textContent = 'Network error deleting article.';
      }
    }

    function renderArticles() {
      if (!gridEl) return;
      gridEl.innerHTML = '';

      const q = searchQuery.toLowerCase().trim();
      const filtered = allArticles.filter((article) => {
        const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
        if (!matchesCategory) return false;
        if (!q) return true;
        const haystack = [
          article.title,
          article.category,
          article.summary,
          ...(Array.isArray(article.tags) ? article.tags : []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });

      if (filtered.length === 0) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'studio-empty-state';

        const h3 = document.createElement('h3');
        h3.textContent = allArticles.length === 0 ? 'No articles published yet' : 'No matching articles';

        const p = document.createElement('p');
        p.textContent =
          allArticles.length === 0
            ? 'Publish your first technical article or executive blog to share insights with your audience.'
            : 'Try adjusting your search query or clearing the category filter.';

        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.className = 'studio-btn studio-btn-primary';
        if (allArticles.length === 0) {
          actionBtn.textContent = 'Write First Article';
          actionBtn.addEventListener('click', () => {
            ensureAuthorUnlocked(() => writeModal?.classList.add('active'));
          });
        } else {
          actionBtn.textContent = 'Show All Articles';
          actionBtn.addEventListener('click', () => {
            activeCategory = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            renderArticleFilters();
            renderArticles();
          });
        }

        emptyBox.append(h3, p, actionBtn);
        gridEl.appendChild(emptyBox);
        return;
      }

      filtered.forEach((article) => {
        const card = document.createElement('article');
        card.className = 'card editorial-card';

        const topWrap = document.createElement('div');

        const cleanCover = sanitizeArticleImageSrc(article.coverImage || '');
        if (cleanCover) {
          const thumbWrap = document.createElement('div');
          thumbWrap.className = 'editorial-card-thumb';
          const thumbImg = document.createElement('img');
          thumbImg.src = cleanCover;
          thumbImg.alt = article.coverCaption || article.title;
          thumbImg.loading = 'lazy';
          thumbWrap.appendChild(thumbImg);
          topWrap.appendChild(thumbWrap);
        }

        const metaLine = document.createElement('div');
        metaLine.className = 'editorial-meta-line';

        const catSpan = document.createElement('span');
        catSpan.className = 'editorial-meta-category';
        catSpan.textContent = article.category;

        const dot1 = document.createElement('span');
        dot1.setAttribute('aria-hidden', 'true');
        dot1.textContent = '·';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = formatDisplayDate(article.publishedAt);

        const dot2 = document.createElement('span');
        dot2.setAttribute('aria-hidden', 'true');
        dot2.textContent = '·';

        const readSpan = document.createElement('span');
        readSpan.textContent = article.readTime;

        metaLine.append(catSpan, dot1, dateSpan, dot2, readSpan);

        const titleEl = document.createElement('h2');
        titleEl.className = 'editorial-card-title';
        titleEl.textContent = article.title;

        const summaryEl = document.createElement('p');
        summaryEl.className = 'editorial-card-summary';
        summaryEl.textContent = article.summary;

        topWrap.append(metaLine, titleEl, summaryEl);

        if (Array.isArray(article.tags) && article.tags.length > 0) {
          const tagsEl = document.createElement('div');
          tagsEl.className = 'editorial-tags-text';
          tagsEl.textContent = article.tags.join(' · ');
          topWrap.appendChild(tagsEl);
        }

        const footerEl = document.createElement('div');
        footerEl.className = 'editorial-card-footer';

        const readBtn = document.createElement('button');
        readBtn.type = 'button';
        readBtn.className = 'studio-btn studio-btn-secondary';
        readBtn.textContent = 'Read Article';
        readBtn.addEventListener('click', () => openArticleReader(article));

        const deleteControls = document.createElement('div');
        deleteControls.className = 'delete-confirm-inline';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'studio-btn studio-btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', `Delete article ${article.title}`);

        deleteBtn.addEventListener('click', () => {
          ensureAuthorUnlocked(() => {
            deleteControls.innerHTML = '';

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.className = 'studio-btn studio-btn-danger';
            confirmBtn.textContent = 'Confirm';
            confirmBtn.addEventListener('click', () => {
              confirmBtn.disabled = true;
              confirmBtn.textContent = 'Deleting...';
              deleteArticle(article.id, null);
            });

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'studio-btn studio-btn-secondary';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', () => {
              deleteControls.innerHTML = '';
              deleteControls.appendChild(deleteBtn);
            });

            deleteControls.append(confirmBtn, cancelBtn);
          });
        });

        deleteControls.appendChild(deleteBtn);
        footerEl.append(readBtn, deleteControls);

        card.append(topWrap, footerEl);
        gridEl.appendChild(card);
      });
    }

    async function loadArticles() {
      let loadedFromBackend = false;
      try {
        const res = await fetch('/api/articles');
        if (isJsonResponse(res)) {
          const data = await res.json();
          allArticles = Array.isArray(data.articles) ? data.articles : [];
          loadedFromBackend = true;
        }
      } catch (_err) {
        loadedFromBackend = false;
      }

      if (!loadedFromBackend) {
        staticMode = true;
        showStaticBannerIfNeeded();
        let baseArticles = [];
        try {
          const staticRes = await fetch(`data/articles.json?v=${Date.now()}`, { cache: 'no-store' });
          if (isJsonResponse(staticRes)) {
            const parsed = await staticRes.json();
            if (Array.isArray(parsed)) baseArticles = parsed;
          }
        } catch (_err) {
          baseArticles = [];
        }
        const customArticles = readLocalJson(STATIC_ARTICLES_KEY, []);
        const deletedIds = new Set(readLocalJson(STATIC_DELETED_ARTICLES_KEY, []));
        const byId = new Map();
        [...baseArticles, ...(Array.isArray(customArticles) ? customArticles : [])].forEach((art) => {
          if (art && typeof art.id === 'string' && !deletedIds.has(art.id)) {
            byId.set(art.id, art);
          }
        });
        allArticles = Array.from(byId.values()).sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }

      updateGitHubButtonUI();
      renderArticleFilters();
      renderArticles();

      const requestedArticleId = new URLSearchParams(window.location.search).get('article');
      if (requestedArticleId) {
        const matched = allArticles.find((a) => a.id === requestedArticleId);
        if (matched) openArticleReader(matched);
      }
    }

    window.__refreshStudioRender = renderArticles;

    if (openGitHubSyncBtn && githubDeployModal) {
      openGitHubSyncBtn.addEventListener('click', () => {
        ensureAuthorUnlocked(() => {
          const meta = getGitHubMeta();
          if (ghRepoInput) ghRepoInput.value = meta.repo;
          if (ghBranchInput) ghBranchInput.value = meta.branch;
          if (ghFilePathInput) ghFilePathInput.value = meta.filePath;
          if (ghTokenInput) ghTokenInput.value = getGitHubToken();
          if (ghAutoSyncCheckbox) ghAutoSyncCheckbox.checked = meta.autoSync;
          setStudioFeedback(githubDeployFeedback, '', '');
          updateGitHubButtonUI();
          githubDeployModal.classList.add('active');
        });
      });
    }

    if (githubDeployForm) {
      githubDeployForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const repo = ghRepoInput?.value.trim() || '';
        const branch = ghBranchInput?.value.trim() || 'main';
        const filePath = (ghFilePathInput?.value.trim() || 'public/data/articles.json').replace(/^\/+/, '');
        const token = ghTokenInput?.value.trim() || '';
        const autoSync = ghAutoSyncCheckbox ? ghAutoSyncCheckbox.checked : true;

        if (!isValidGitHubRepo(repo)) {
          setStudioFeedback(githubDeployFeedback, 'error', 'Enter a valid repository in owner/repo format.');
          ghRepoInput?.focus();
          return;
        }
        if (!isValidGitHubBranch(branch)) {
          setStudioFeedback(githubDeployFeedback, 'error', 'Enter a valid branch name (e.g. main).');
          ghBranchInput?.focus();
          return;
        }
        if (!isValidGitHubFilePath(filePath)) {
          setStudioFeedback(githubDeployFeedback, 'error', 'File path must end with .json (e.g. public/data/articles.json).');
          ghFilePathInput?.focus();
          return;
        }
        if (token.length < 10) {
          setStudioFeedback(githubDeployFeedback, 'error', 'Enter a valid GitHub Personal Access Token.');
          ghTokenInput?.focus();
          return;
        }

        if (ghSaveConnectBtn) {
          ghSaveConnectBtn.disabled = true;
          ghSaveConnectBtn.textContent = 'Verifying...';
        }
        setStudioFeedback(githubDeployFeedback, '', 'Checking GitHub repository access...');

        try {
          const verifyRes = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${token}`,
              'X-GitHub-Api-Version': '2022-11-28',
            },
          });
          const repoInfo = await verifyRes.json().catch(() => ({}));
          if (!verifyRes.ok) {
            setStudioFeedback(
              githubDeployFeedback,
              'error',
              repoInfo.message || `Unable to access ${repo} (${verifyRes.status}).`
            );
            return;
          }
          if (repoInfo.permissions && repoInfo.permissions.push === false) {
            setStudioFeedback(
              githubDeployFeedback,
              'error',
              'Token has read-only access. Grant Contents: Read and write permission.'
            );
            return;
          }

          saveGitHubMeta({ repo, branch, filePath, autoSync });
          setGitHubToken(token);
          updateGitHubButtonUI();
          setStudioFeedback(
            githubDeployFeedback,
            'success',
            `Connected to ${repo} (${branch}). New or deleted articles will auto-sync to GitHub Pages.`
          );
          renderGitHubStatusBar(
            'success',
            `Connected to ${repo} (${branch}) for automatic GitHub Pages article updates.`,
            repo
          );
        } catch (_err) {
          setStudioFeedback(githubDeployFeedback, 'error', 'Network error while verifying GitHub repository.');
        } finally {
          if (ghSaveConnectBtn) {
            ghSaveConnectBtn.disabled = false;
            ghSaveConnectBtn.textContent = 'Connect GitHub';
          }
        }
      });
    }

    if (ghPushNowBtn) {
      ghPushNowBtn.addEventListener('click', async () => {
        const repo = ghRepoInput?.value.trim() || '';
        const branch = ghBranchInput?.value.trim() || 'main';
        const filePath = (ghFilePathInput?.value.trim() || 'public/data/articles.json').replace(/^\/+/, '');
        const token = ghTokenInput?.value.trim() || getGitHubToken();
        const autoSync = ghAutoSyncCheckbox ? ghAutoSyncCheckbox.checked : true;

        if (!isValidGitHubRepo(repo) || !isValidGitHubBranch(branch) || !isValidGitHubFilePath(filePath) || token.length < 10) {
          setStudioFeedback(githubDeployFeedback, 'error', 'Please fill in valid repository, branch, path, and token first.');
          return;
        }

        saveGitHubMeta({ repo, branch, filePath, autoSync });
        setGitHubToken(token);
        updateGitHubButtonUI();

        ghPushNowBtn.disabled = true;
        ghPushNowBtn.textContent = 'Pushing...';
        setStudioFeedback(githubDeployFeedback, '', 'Committing articles.json to GitHub...');

        try {
          const result = await pushArticlesToGitHub(
            allArticles,
            `chore(articles): sync ${allArticles.length} articles via UI`
          );
          setStudioFeedback(
            githubDeployFeedback,
            'success',
            `Pushed commit ${result.shortSha} to ${result.repo}. GitHub Pages is now rebuilding.`
          );
          renderGitHubStatusBar(
            'success',
            `Synced ${allArticles.length} articles (${result.shortSha}). GitHub Pages deploy triggered.`,
            result.repo
          );
        } catch (err) {
          setStudioFeedback(
            githubDeployFeedback,
            'error',
            err instanceof Error ? err.message : 'Unable to push to GitHub.'
          );
        } finally {
          ghPushNowBtn.disabled = false;
          ghPushNowBtn.textContent = 'Push & Deploy Now';
        }
      });
    }

    if (ghDisconnectBtn) {
      ghDisconnectBtn.addEventListener('click', () => {
        saveGitHubMeta({ repo: '', branch: 'main', filePath: 'public/data/articles.json', autoSync: true });
        setGitHubToken('');
        if (ghRepoInput) ghRepoInput.value = '';
        if (ghTokenInput) ghTokenInput.value = '';
        updateGitHubButtonUI();
        setStudioFeedback(githubDeployFeedback, 'success', 'GitHub Auto-Deploy disconnected.');
        renderGitHubStatusBar('', '', null);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderArticles();
      });
    }

    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        downloadBlobFile(
          'articles.json',
          `${JSON.stringify(allArticles, null, 2)}\n`,
          'application/json'
        );
      });
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', async () => {
        if (!activeReaderArticle) return;
        const shareUrl = new URL(window.location.href);
        shareUrl.searchParams.set('article', activeReaderArticle.id);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl.toString());
            setStudioFeedback(readerShareFeedback, 'success', 'Article link copied.');
          } else {
            setStudioFeedback(readerShareFeedback, 'success', shareUrl.toString());
          }
        } catch (_err) {
          setStudioFeedback(readerShareFeedback, 'error', 'Copy unavailable in this browser.');
        }
      });
    }

    if (downloadHtmlBtn) {
      downloadHtmlBtn.addEventListener('click', () => {
        if (!activeReaderArticle) return;
        const htmlDoc = buildStandaloneArticleHtml(activeReaderArticle);
        const filename = `${slugifyFilename(activeReaderArticle.title)}.html`;
        downloadBlobFile(filename, htmlDoc, 'text/html;charset=utf-8');
        setStudioFeedback(readerShareFeedback, 'success', `Downloaded ${filename}`);
      });
    }

    if (coverUrlInput) {
      coverUrlInput.addEventListener('input', () => {
        updateCoverPreview(coverUrlInput.value);
      });
    }

    if (coverFileInput && coverUrlInput) {
      coverFileInput.addEventListener('change', async () => {
        const file = coverFileInput.files && coverFileInput.files[0];
        if (!file) return;
        try {
          setStudioFeedback(writeFeedback, '', 'Optimizing cover image...');
          const dataUrl = await compressImageFileToDataUrl(file);
          coverUrlInput.value = dataUrl;
          updateCoverPreview(dataUrl);
          setStudioFeedback(writeFeedback, 'success', 'Cover image ready.');
        } catch (err) {
          setStudioFeedback(writeFeedback, 'error', err instanceof Error ? err.message : 'Unable to process image.');
        } finally {
          coverFileInput.value = '';
        }
      });
    }

    if (coverClearBtn && coverUrlInput) {
      coverClearBtn.addEventListener('click', () => {
        coverUrlInput.value = '';
        updateCoverPreview('');
      });
    }

    if (insertHeadingBtn && contentTextarea) {
      insertHeadingBtn.addEventListener('click', () => {
        insertTextAtCursor(contentTextarea, '## Section Heading');
      });
    }

    if (toggleInlineImgBtn && inlineImgPanel) {
      toggleInlineImgBtn.addEventListener('click', () => {
        const willOpen = inlineImgPanel.style.display === 'none';
        inlineImgPanel.style.display = willOpen ? 'flex' : 'none';
        if (placeholderPanel) placeholderPanel.style.display = 'none';
      });
    }

    if (cancelInlineImgBtn && inlineImgPanel) {
      cancelInlineImgBtn.addEventListener('click', () => {
        inlineImgPanel.style.display = 'none';
      });
    }

    if (inlineImgFileInput && inlineImgUrlInput) {
      inlineImgFileInput.addEventListener('change', async () => {
        const file = inlineImgFileInput.files && inlineImgFileInput.files[0];
        if (!file) return;
        try {
          setStudioFeedback(writeFeedback, '', 'Optimizing inline image...');
          const dataUrl = await compressImageFileToDataUrl(file);
          inlineImgUrlInput.value = dataUrl;
          setStudioFeedback(writeFeedback, 'success', 'Inline image ready to insert.');
        } catch (err) {
          setStudioFeedback(writeFeedback, 'error', err instanceof Error ? err.message : 'Unable to process image.');
        } finally {
          inlineImgFileInput.value = '';
        }
      });
    }

    if (confirmInsertImgBtn && inlineImgUrlInput && contentTextarea) {
      confirmInsertImgBtn.addEventListener('click', () => {
        const cleanSrc = sanitizeArticleImageSrc(inlineImgUrlInput.value);
        if (!cleanSrc) {
          setStudioFeedback(
            writeFeedback,
            'error',
            'Please provide a valid image URL (https://...), assets/images/... path, or upload an image file.'
          );
          return;
        }
        const caption = (inlineImgCaptionInput?.value || '').trim().replace(/\]/g, ')').replace(/\|/g, '-');
        const tag = caption ? `[IMAGE: ${cleanSrc} | ${caption}]` : `[IMAGE: ${cleanSrc}]`;
        insertTextAtCursor(contentTextarea, tag);
        inlineImgUrlInput.value = '';
        if (inlineImgCaptionInput) inlineImgCaptionInput.value = '';
        if (inlineImgPanel) inlineImgPanel.style.display = 'none';
        setStudioFeedback(writeFeedback, 'success', 'Image block inserted into article.');
      });
    }

    if (togglePlaceholderBtn && placeholderPanel) {
      togglePlaceholderBtn.addEventListener('click', () => {
        const willOpen = placeholderPanel.style.display === 'none';
        placeholderPanel.style.display = willOpen ? 'flex' : 'none';
        if (inlineImgPanel) inlineImgPanel.style.display = 'none';
      });
    }

    if (cancelPlaceholderBtn && placeholderPanel) {
      cancelPlaceholderBtn.addEventListener('click', () => {
        placeholderPanel.style.display = 'none';
      });
    }

    if (confirmPlaceholderBtn && placeholderTitleInput && contentTextarea) {
      confirmPlaceholderBtn.addEventListener('click', () => {
        const pTitle =
          placeholderTitleInput.value.trim().replace(/\]/g, ')').replace(/\|/g, '-') ||
          'Reference Architecture Diagram';
        const pDesc = (placeholderDescInput?.value || '').trim().replace(/\]/g, ')').replace(/\|/g, '-');
        const tag = pDesc
          ? `[IMAGE_PLACEHOLDER: ${pTitle} | ${pDesc}]`
          : `[IMAGE_PLACEHOLDER: ${pTitle}]`;
        insertTextAtCursor(contentTextarea, tag);
        placeholderTitleInput.value = '';
        if (placeholderDescInput) placeholderDescInput.value = '';
        if (placeholderPanel) placeholderPanel.style.display = 'none';
        setStudioFeedback(writeFeedback, 'success', 'Reference image placeholder inserted.');
      });
    }

    if (openWriteBtn) {
      openWriteBtn.addEventListener('click', () => {
        ensureAuthorUnlocked(() => {
          setStudioFeedback(writeFeedback, '', '');
          updateCoverPreview(coverUrlInput?.value || '');
          writeModal?.classList.add('active');
          const titleField = document.getElementById('articleTitleInput');
          if (titleField) setTimeout(() => titleField.focus(), 50);
        });
      });
    }

    if (writeForm && publishBtn) {
      writeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('articleTitleInput')?.value.trim() || '';
        const category = document.getElementById('articleCategoryInput')?.value.trim() || '';
        const tagsRaw = document.getElementById('articleTagsInput')?.value.trim() || '';
        const summary = document.getElementById('articleSummaryInput')?.value.trim() || '';
        const content = document.getElementById('articleContentInput')?.value.trim() || '';
        const rawCover = coverUrlInput?.value.trim() || '';
        const coverImage = rawCover ? sanitizeArticleImageSrc(rawCover) : '';
        const coverCaption = (coverCaptionInput?.value || '').trim().slice(0, 220);

        if (rawCover && !coverImage) {
          setStudioFeedback(
            writeFeedback,
            'error',
            'Cover image must be a valid https:// URL, assets/images/ path, or uploaded PNG/JPG/WebP image.'
          );
          return;
        }

        if (title.length < 3 || category.length < 2 || summary.length < 10 || content.length < 20) {
          setStudioFeedback(
            writeFeedback,
            'error',
            'Please fill in headline, category, summary (10+ chars), and article body (20+ chars).'
          );
          return;
        }

        const tags = tagsRaw
          ? tagsRaw
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .slice(0, 6)
          : [];

        if (!authorToken) {
          openAuthModal(() => writeForm.requestSubmit());
          return;
        }

        publishBtn.disabled = true;
        publishBtn.textContent = 'Publishing...';
        setStudioFeedback(writeFeedback, '', '');

        if (staticMode) {
          const words = content.replace(/\[IMAGE(?:_PLACEHOLDER)?:[^\]]+\]/g, '').trim().split(/\s+/).filter(Boolean).length;
          const mins = Math.max(1, Math.ceil(words / 200));
          const created = {
            id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            title,
            category,
            summary,
            content,
            tags,
            ...(coverImage ? { coverImage } : {}),
            ...(coverCaption ? { coverCaption } : {}),
            readTime: `${mins} min read`,
            author: 'Pradeep Dhote',
            publishedAt: new Date().toISOString(),
          };

          const existingCustom = readLocalJson(STATIC_ARTICLES_KEY, []);
          const nextCustom = [created, ...(Array.isArray(existingCustom) ? existingCustom : [])];
          if (!writeLocalJson(STATIC_ARTICLES_KEY, nextCustom)) {
            setStudioFeedback(
              writeFeedback,
              'error',
              'Browser storage limit reached. Try smaller images or export articles.json first.'
            );
            publishBtn.disabled = false;
            publishBtn.textContent = 'Publish Article';
            return;
          }

          allArticles = [created, ...allArticles];
          activeCategory = 'all';
          writeForm.reset();
          updateCoverPreview('');
          if (inlineImgPanel) inlineImgPanel.style.display = 'none';
          if (placeholderPanel) placeholderPanel.style.display = 'none';
          writeModal?.classList.remove('active');
          renderArticleFilters();
          renderArticles();
          publishBtn.disabled = false;
          publishBtn.textContent = 'Publish Article';
          await maybeAutoSyncToGitHub(`feat(articles): publish "${created.title.slice(0, 60)}"`);
          return;
        }

        try {
          const payload = {
            title,
            category,
            summary,
            content,
            tags,
            ...(coverImage ? { coverImage } : {}),
            ...(coverCaption ? { coverCaption } : {}),
          };
          const res = await fetch('/api/articles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authorToken}`,
            },
            body: JSON.stringify(payload),
          });

          const data = await res.json().catch(() => ({}));
          if (res.status === 401) {
            authorToken = null;
            updateAuthButtonUI();
            writeModal?.classList.remove('active');
            openAuthModal(() => writeModal?.classList.add('active'));
            return;
          }
          if (!res.ok || !data.article) {
            setStudioFeedback(writeFeedback, 'error', data.error || 'Unable to publish article.');
            return;
          }

          allArticles = [data.article, ...allArticles];
          activeCategory = 'all';
          writeForm.reset();
          updateCoverPreview('');
          if (inlineImgPanel) inlineImgPanel.style.display = 'none';
          if (placeholderPanel) placeholderPanel.style.display = 'none';
          writeModal?.classList.remove('active');
          renderArticleFilters();
          renderArticles();
          await maybeAutoSyncToGitHub(`feat(articles): publish "${data.article.title.slice(0, 60)}"`);
        } catch (_err) {
          setStudioFeedback(writeFeedback, 'error', 'Network error while publishing article.');
        } finally {
          publishBtn.disabled = false;
          publishBtn.textContent = 'Publish Article';
        }
      });
    }

    loadArticles();
  }

  /* -------------------- PODCASTS & YOUTUBE PAGE CONTROLLER -------------------- */
  if (podcastsPage) {
    let allPodcasts = [];
    let activeTopic = 'all';
    let searchQuery = '';

    const allowedYouTubeHosts = new Set([
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtu.be',
      'www.youtube-nocookie.com',
      'youtube-nocookie.com',
    ]);
    const ytIdPattern = /^[A-Za-z0-9_-]{11}$/;

    function parseYouTubeVideoIdClient(rawUrl) {
      let parsed;
      try {
        parsed = new URL(rawUrl.trim());
      } catch (_err) {
        return null;
      }
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
      const host = parsed.hostname.toLowerCase();
      if (!allowedYouTubeHosts.has(host)) return null;

      let candidate = null;
      if (host === 'youtu.be') {
        candidate = parsed.pathname.split('/').filter(Boolean)[0] || null;
      } else {
        const vParam = parsed.searchParams.get('v');
        if (vParam) {
          candidate = vParam;
        } else {
          const segments = parsed.pathname.split('/').filter(Boolean);
          if (
            segments.length >= 2 &&
            (segments[0] === 'embed' || segments[0] === 'shorts' || segments[0] === 'live')
          ) {
            candidate = segments[1];
          }
        }
      }

      if (!candidate || !ytIdPattern.test(candidate)) return null;
      return candidate;
    }

    const gridEl = document.getElementById('podcastsGrid');
    const filterRowEl = document.getElementById('podcastTopicFilters');
    const searchInput = document.getElementById('podcastSearchInput');
    const openAddBtn = document.getElementById('openAddPodcastBtn');
    const addModal = document.getElementById('addPodcastModal');
    const addForm = document.getElementById('addPodcastForm');
    const urlInput = document.getElementById('podcastYoutubeUrlInput');
    const previewWrap = document.getElementById('youtubeLivePreviewWrap');
    const previewFrame = document.getElementById('youtubeLivePreviewFrame');
    const addFeedback = document.getElementById('addPodcastFeedback');
    const publishPodcastBtn = document.getElementById('publishPodcastBtn');

    function mountYouTubeIframe(container, videoId, title, autoplay) {
      container.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.className = 'podcast-iframe';
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0${
        autoplay ? '&autoplay=1' : ''
      }`;
      iframe.title = title;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      container.appendChild(iframe);
    }

    function renderPodcastFilters() {
      if (!filterRowEl) return;
      const topics = ['all', ...new Set(allPodcasts.map((p) => p.topic))];
      if (!topics.includes(activeTopic)) activeTopic = 'all';

      filterRowEl.innerHTML = '';
      topics.forEach((topic) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `studio-filter-tab${activeTopic === topic ? ' active' : ''}`;
        btn.textContent = topic === 'all' ? 'All Episodes' : topic;
        btn.addEventListener('click', () => {
          activeTopic = topic;
          renderPodcastFilters();
          renderPodcasts();
        });
        filterRowEl.appendChild(btn);
      });
    }

    async function deletePodcast(id) {
      if (!authorToken) {
        ensureAuthorUnlocked(() => deletePodcast(id));
        return;
      }

      if (staticMode) {
        const customPods = readLocalJson(STATIC_PODCASTS_KEY, []);
        writeLocalJson(
          STATIC_PODCASTS_KEY,
          Array.isArray(customPods) ? customPods.filter((p) => p && p.id !== id) : []
        );
        const deletedIds = readLocalJson(STATIC_DELETED_PODCASTS_KEY, []);
        if (Array.isArray(deletedIds) && !deletedIds.includes(id)) {
          writeLocalJson(STATIC_DELETED_PODCASTS_KEY, [...deletedIds, id]);
        }
        allPodcasts = allPodcasts.filter((item) => item.id !== id);
        renderPodcastFilters();
        renderPodcasts();
        return;
      }

      try {
        const res = await fetch(`/api/podcasts/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authorToken}` },
        });
        if (res.status === 401) {
          authorToken = null;
          updateAuthButtonUI();
          openAuthModal(() => deletePodcast(id));
          return;
        }
        if (!res.ok) return;
        allPodcasts = allPodcasts.filter((item) => item.id !== id);
        renderPodcastFilters();
        renderPodcasts();
      } catch (_err) {
        // Ignore network error
      }
    }

    function renderPodcasts() {
      if (!gridEl) return;
      gridEl.innerHTML = '';

      const q = searchQuery.toLowerCase().trim();
      const filtered = allPodcasts.filter((ep) => {
        const matchesTopic = activeTopic === 'all' || ep.topic === activeTopic;
        if (!matchesTopic) return false;
        if (!q) return true;
        const haystack = `${ep.title} ${ep.topic} ${ep.description}`.toLowerCase();
        return haystack.includes(q);
      });

      if (filtered.length === 0) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'studio-empty-state';

        const h3 = document.createElement('h3');
        h3.textContent =
          allPodcasts.length === 0
            ? 'Your Podcast & YouTube Studio is ready'
            : 'No matching episodes';

        const p = document.createElement('p');
        p.textContent =
          allPodcasts.length === 0
            ? 'Add your YouTube podcast episodes, executive briefings, or conference talks using any standard YouTube link.'
            : 'Try adjusting your search query or selecting All Episodes.';

        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.className = 'studio-btn studio-btn-primary';
        if (allPodcasts.length === 0) {
          actionBtn.textContent = 'Add YouTube Video';
          actionBtn.addEventListener('click', () => {
            ensureAuthorUnlocked(() => {
              setStudioFeedback(addFeedback, '', '');
              addModal?.classList.add('active');
            });
          });
        } else {
          actionBtn.textContent = 'Show All Episodes';
          actionBtn.addEventListener('click', () => {
            activeTopic = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            renderPodcastFilters();
            renderPodcasts();
          });
        }

        emptyBox.append(h3, p, actionBtn);
        gridEl.appendChild(emptyBox);
        return;
      }

      filtered.forEach((ep) => {
        const card = document.createElement('article');
        card.className = 'card podcast-card';

        const mediaFrame = document.createElement('div');
        mediaFrame.className = 'podcast-media-frame';

        const thumbImg = document.createElement('img');
        thumbImg.className = 'podcast-thumb-img';
        thumbImg.src = `https://i.ytimg.com/vi/${encodeURIComponent(ep.videoId)}/hqdefault.jpg`;
        thumbImg.alt = `${ep.title} YouTube video thumbnail`;
        thumbImg.referrerPolicy = 'no-referrer';
        thumbImg.addEventListener('error', () => {
          thumbImg.style.display = 'none';
        });

        const playOverlay = document.createElement('button');
        playOverlay.type = 'button';
        playOverlay.className = 'podcast-media-scrim';
        playOverlay.setAttribute('aria-label', `Play YouTube video: ${ep.title}`);
        playOverlay.innerHTML =
          '<span class="podcast-play-circle" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg></span><span class="podcast-play-label">Play Episode</span>';

        playOverlay.addEventListener('click', () => {
          mountYouTubeIframe(mediaFrame, ep.videoId, ep.title, true);
        });

        mediaFrame.append(thumbImg, playOverlay);

        const bodyEl = document.createElement('div');
        bodyEl.className = 'podcast-card-body';

        const topWrap = document.createElement('div');
        const metaLine = document.createElement('div');
        metaLine.className = 'editorial-meta-line';

        const topicSpan = document.createElement('span');
        topicSpan.className = 'editorial-meta-category';
        topicSpan.textContent = ep.topic;

        const sep1 = document.createElement('span');
        sep1.setAttribute('aria-hidden', 'true');
        sep1.textContent = '·';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = formatDisplayDate(ep.publishedAt);

        metaLine.append(topicSpan, sep1, dateSpan);

        if (ep.duration) {
          const sep2 = document.createElement('span');
          sep2.setAttribute('aria-hidden', 'true');
          sep2.textContent = '·';
          const durSpan = document.createElement('span');
          durSpan.textContent = ep.duration;
          metaLine.append(sep2, durSpan);
        }

        const titleEl = document.createElement('h2');
        titleEl.className = 'editorial-card-title';
        titleEl.textContent = ep.title;

        const descEl = document.createElement('p');
        descEl.className = 'editorial-card-summary';
        descEl.textContent = ep.description;

        topWrap.append(metaLine, titleEl, descEl);

        const footerEl = document.createElement('div');
        footerEl.className = 'editorial-card-footer';

        const watchLink = document.createElement('a');
        watchLink.className = 'studio-btn studio-btn-secondary';
        watchLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(ep.videoId)}`;
        watchLink.target = '_blank';
        watchLink.rel = 'noopener noreferrer';
        watchLink.textContent = 'Watch on YouTube';

        const deleteControls = document.createElement('div');
        deleteControls.className = 'delete-confirm-inline';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'studio-btn studio-btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', `Delete episode ${ep.title}`);

        deleteBtn.addEventListener('click', () => {
          ensureAuthorUnlocked(() => {
            deleteControls.innerHTML = '';

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.className = 'studio-btn studio-btn-danger';
            confirmBtn.textContent = 'Confirm';
            confirmBtn.addEventListener('click', () => {
              confirmBtn.disabled = true;
              confirmBtn.textContent = 'Deleting...';
              deletePodcast(ep.id);
            });

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'studio-btn studio-btn-secondary';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', () => {
              deleteControls.innerHTML = '';
              deleteControls.appendChild(deleteBtn);
            });

            deleteControls.append(confirmBtn, cancelBtn);
          });
        });

        deleteControls.appendChild(deleteBtn);
        footerEl.append(watchLink, deleteControls);

        bodyEl.append(topWrap, footerEl);
        card.append(mediaFrame, bodyEl);
        gridEl.appendChild(card);
      });
    }

    async function loadPodcasts() {
      let loadedFromBackend = false;
      try {
        const res = await fetch('/api/podcasts');
        if (isJsonResponse(res)) {
          const data = await res.json();
          allPodcasts = Array.isArray(data.podcasts) ? data.podcasts : [];
          loadedFromBackend = true;
        }
      } catch (_err) {
        loadedFromBackend = false;
      }

      if (!loadedFromBackend) {
        staticMode = true;
        let basePods = [];
        try {
          const staticRes = await fetch('data/podcasts.json');
          if (isJsonResponse(staticRes)) {
            const parsed = await staticRes.json();
            if (Array.isArray(parsed)) basePods = parsed;
          }
        } catch (_err) {
          basePods = [];
        }
        const customPods = readLocalJson(STATIC_PODCASTS_KEY, []);
        const deletedIds = new Set(readLocalJson(STATIC_DELETED_PODCASTS_KEY, []));
        const byId = new Map();
        [...basePods, ...(Array.isArray(customPods) ? customPods : [])].forEach((pod) => {
          if (pod && typeof pod.id === 'string' && !deletedIds.has(pod.id)) {
            byId.set(pod.id, pod);
          }
        });
        allPodcasts = Array.from(byId.values()).sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }

      renderPodcastFilters();
      renderPodcasts();
    }

    window.__refreshStudioRender = renderPodcasts;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderPodcasts();
      });
    }

    if (urlInput && previewWrap && previewFrame) {
      urlInput.addEventListener('input', () => {
        const vid = parseYouTubeVideoIdClient(urlInput.value);
        if (vid) {
          previewWrap.style.display = '';
          mountYouTubeIframe(previewFrame, vid, 'YouTube video preview', false);
        } else {
          previewWrap.style.display = 'none';
          previewFrame.innerHTML = '';
        }
      });
    }

    if (openAddBtn) {
      openAddBtn.addEventListener('click', () => {
        ensureAuthorUnlocked(() => {
          setStudioFeedback(addFeedback, '', '');
          if (previewWrap && previewFrame) {
            previewWrap.style.display = 'none';
            previewFrame.innerHTML = '';
          }
          addModal?.classList.add('active');
          if (urlInput) setTimeout(() => urlInput.focus(), 50);
        });
      });
    }

    if (addForm && publishPodcastBtn) {
      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const youtubeUrl = urlInput?.value.trim() || '';
        const title = document.getElementById('podcastTitleInput')?.value.trim() || '';
        const topic = document.getElementById('podcastTopicInput')?.value.trim() || '';
        const duration = document.getElementById('podcastDurationInput')?.value.trim() || '';
        const description = document.getElementById('podcastDescInput')?.value.trim() || '';

        const videoId = parseYouTubeVideoIdClient(youtubeUrl);
        if (!videoId) {
          setStudioFeedback(
            addFeedback,
            'error',
            'Please enter a valid YouTube link (youtube.com/watch?v=... or youtu.be/...).'
          );
          urlInput?.focus();
          return;
        }

        if (title.length < 3 || topic.length < 2 || description.length < 10) {
          setStudioFeedback(
            addFeedback,
            'error',
            'Please fill in the episode title, topic, and summary (10+ characters).'
          );
          return;
        }

        if (!authorToken) {
          openAuthModal(() => addForm.requestSubmit());
          return;
        }

        publishPodcastBtn.disabled = true;
        publishPodcastBtn.textContent = 'Publishing...';
        setStudioFeedback(addFeedback, '', '');

        if (staticMode) {
          const created = {
            id: `pod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            videoId,
            youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
            title,
            topic,
            description,
            duration: duration || 'Video Episode',
            publishedAt: new Date().toISOString(),
          };
          const existing = readLocalJson(STATIC_PODCASTS_KEY, []);
          writeLocalJson(STATIC_PODCASTS_KEY, [created, ...(Array.isArray(existing) ? existing : [])]);
          allPodcasts = [created, ...allPodcasts];
          activeTopic = 'all';
          addForm.reset();
          if (previewWrap && previewFrame) {
            previewWrap.style.display = 'none';
            previewFrame.innerHTML = '';
          }
          addModal?.classList.remove('active');
          renderPodcastFilters();
          renderPodcasts();
          publishPodcastBtn.disabled = false;
          publishPodcastBtn.textContent = 'Publish Episode';
          return;
        }

        try {
          const res = await fetch('/api/podcasts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authorToken}`,
            },
            body: JSON.stringify({ youtubeUrl, title, topic, duration, description }),
          });

          const data = await res.json().catch(() => ({}));
          if (res.status === 401) {
            authorToken = null;
            updateAuthButtonUI();
            addModal?.classList.remove('active');
            openAuthModal(() => addModal?.classList.add('active'));
            return;
          }
          if (!res.ok || !data.podcast) {
            setStudioFeedback(addFeedback, 'error', data.error || 'Unable to publish video.');
            return;
          }

          allPodcasts = [data.podcast, ...allPodcasts];
          activeTopic = 'all';
          addForm.reset();
          if (previewWrap && previewFrame) {
            previewWrap.style.display = 'none';
            previewFrame.innerHTML = '';
          }
          addModal?.classList.remove('active');
          renderPodcastFilters();
          renderPodcasts();
        } catch (_err) {
          setStudioFeedback(addFeedback, 'error', 'Network error while publishing episode.');
        } finally {
          publishPodcastBtn.disabled = false;
          publishPodcastBtn.textContent = 'Publish Episode';
        }
      });
    }

    loadPodcasts();
  }

  /* -------------------- RESUME UPLOAD & DOWNLOAD CONTROLLER -------------------- */
  if (resumePage) {
    let currentResume = null;
    let selectedFile = null;

    const downloadTopBtn = document.getElementById('downloadResumeTopBtn');
    const downloadBottomBtn = document.getElementById('downloadResumeBottomBtn');
    const openUploadBtn = document.getElementById('openUploadResumeBtn');
    const statusTitle = document.getElementById('resumeFileStatusTitle');
    const statusMeta = document.getElementById('resumeFileStatusMeta');
    const statusActions = document.getElementById('resumeFileStatusActions');

    const uploadModal = document.getElementById('uploadResumeModal');
    const uploadForm = document.getElementById('uploadResumeForm');
    const dropzone = document.getElementById('resumeDropzone');
    const fileInput = document.getElementById('resumeFileInput');
    const selectedBox = document.getElementById('resumeSelectedFileBox');
    const selectedName = document.getElementById('resumeSelectedFileName');
    const selectedSize = document.getElementById('resumeSelectedFileSize');
    const uploadFeedback = document.getElementById('uploadResumeFeedback');
    const submitUploadBtn = document.getElementById('submitResumeUploadBtn');

    function formatFileSize(bytes) {
      if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes <= 0) return '0 KB';
      if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    function setSelectedFile(file) {
      selectedFile = file || null;
      if (!selectedBox || !selectedName || !selectedSize) return;
      if (!selectedFile) {
        selectedBox.classList.remove('is-visible');
        selectedName.textContent = '';
        selectedSize.textContent = '';
        return;
      }
      selectedName.textContent = selectedFile.name;
      selectedSize.textContent = formatFileSize(selectedFile.size);
      selectedBox.classList.add('is-visible');
    }

    function triggerDownloadOrPrint() {
      if (currentResume) {
        const link = document.createElement('a');
        link.href = '/api/resume/download';
        link.download = currentResume.originalName || 'Pradeep_Dhote_Executive_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        window.print();
      }
    }

    async function deleteResumeFile() {
      if (!authorToken) {
        openAuthModal(deleteResumeFile);
        return;
      }
      try {
        const res = await fetch('/api/resume', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authorToken}` },
        });
        if (res.status === 401) {
          authorToken = null;
          updateAuthButtonUI();
          openAuthModal(deleteResumeFile);
          return;
        }
        if (res.ok) {
          currentResume = null;
          renderResumeStatus();
        }
      } catch (_err) {
        // Ignore transient delete error
      }
    }

    function renderResumeStatus() {
      const topLabel = downloadTopBtn?.querySelector('span');
      if (currentResume) {
        if (topLabel) topLabel.textContent = `Download Resume (${currentResume.originalName})`;
        if (downloadBottomBtn) {
          downloadBottomBtn.textContent = `Download ${currentResume.originalName}`;
        }
        if (openUploadBtn) {
          const btnSpan = openUploadBtn.querySelector('span');
          if (btnSpan) btnSpan.textContent = 'Replace Resume';
        }
        if (statusTitle) {
          statusTitle.textContent = `Published Resume: ${currentResume.originalName}`;
        }
        if (statusMeta) {
          statusMeta.textContent = `${formatFileSize(currentResume.sizeBytes)} · Uploaded ${formatDisplayDate(currentResume.uploadedAt)}`;
        }
        if (statusActions) {
          statusActions.innerHTML = '';
          const dlLink = document.createElement('a');
          dlLink.href = '/api/resume/download';
          dlLink.download = currentResume.originalName;
          dlLink.className = 'studio-btn studio-btn-secondary';
          dlLink.textContent = 'Download File';
          statusActions.appendChild(dlLink);

          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'studio-btn studio-btn-danger';
          removeBtn.textContent = 'Remove';
          removeBtn.addEventListener('click', () => {
            ensureAuthorUnlocked(() => {
              statusActions.innerHTML = '';
              const confirmBtn = document.createElement('button');
              confirmBtn.type = 'button';
              confirmBtn.className = 'studio-btn studio-btn-danger';
              confirmBtn.textContent = 'Confirm Remove';
              confirmBtn.addEventListener('click', () => {
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Removing...';
                deleteResumeFile();
              });
              const cancelBtn = document.createElement('button');
              cancelBtn.type = 'button';
              cancelBtn.className = 'studio-btn studio-btn-secondary';
              cancelBtn.textContent = 'Cancel';
              cancelBtn.addEventListener('click', renderResumeStatus);
              statusActions.append(confirmBtn, cancelBtn);
            });
          });
          statusActions.appendChild(removeBtn);
        }
      } else {
        if (topLabel) topLabel.textContent = 'Print / Save CV as PDF';
        if (downloadBottomBtn) {
          downloadBottomBtn.textContent = 'Print / Save Executive CV as PDF';
        }
        if (openUploadBtn) {
          const btnSpan = openUploadBtn.querySelector('span');
          if (btnSpan) btnSpan.textContent = 'Upload Resume';
        }
        if (statusTitle) {
          statusTitle.textContent = 'No PDF or DOCX file uploaded yet';
        }
        if (statusMeta) {
          statusMeta.textContent =
            'Upload your official PDF or DOCX resume to serve direct downloads, or print this CV view.';
        }
        if (statusActions) {
          statusActions.innerHTML = '';
        }
      }
    }

    async function loadResumeStatus() {
      try {
        const res = await fetch('/api/resume/status');
        if (res.ok) {
          const data = await res.json();
          currentResume = data.uploaded && data.resume ? data.resume : null;
        } else {
          currentResume = null;
        }
      } catch (_err) {
        currentResume = null;
      }
      renderResumeStatus();
    }

    window.__refreshStudioRender = renderResumeStatus;

    if (downloadTopBtn) {
      downloadTopBtn.addEventListener('click', triggerDownloadOrPrint);
    }
    if (downloadBottomBtn) {
      downloadBottomBtn.addEventListener('click', triggerDownloadOrPrint);
    }

    if (openUploadBtn) {
      openUploadBtn.addEventListener('click', () => {
        ensureAuthorUnlocked(() => {
          setStudioFeedback(uploadFeedback, '', '');
          setSelectedFile(null);
          if (fileInput) fileInput.value = '';
          uploadModal?.classList.add('active');
        });
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        setStudioFeedback(uploadFeedback, '', '');
        setSelectedFile(file || null);
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('is-dragover');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('is-dragover');
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');
        const dropped = e.dataTransfer?.files && e.dataTransfer.files[0];
        if (dropped) {
          setStudioFeedback(uploadFeedback, '', '');
          setSelectedFile(dropped);
        }
      });
    }

    if (uploadForm && submitUploadBtn) {
      uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = selectedFile || (fileInput?.files && fileInput.files[0]) || null;
        if (!file) {
          setStudioFeedback(uploadFeedback, 'error', 'Please choose a PDF (.pdf) or Word (.docx) file first.');
          return;
        }
        if (file.size > 8 * 1024 * 1024) {
          setStudioFeedback(uploadFeedback, 'error', 'File exceeds the 8 MB size limit.');
          return;
        }
        if (!/\.(pdf|docx)$/i.test(file.name)) {
          setStudioFeedback(uploadFeedback, 'error', 'Only PDF (.pdf) or Word (.docx) files are accepted.');
          return;
        }

        if (!authorToken) {
          openAuthModal(() => uploadForm.requestSubmit());
          return;
        }

        submitUploadBtn.disabled = true;
        submitUploadBtn.textContent = 'Uploading...';
        setStudioFeedback(uploadFeedback, '', '');

        try {
          const contentType =
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              ? file.type
              : 'application/octet-stream';

          const res = await fetch('/api/resume', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authorToken}`,
              'Content-Type': contentType,
              'X-Resume-Filename': encodeURIComponent(file.name),
            },
            body: file,
          });

          const data = await res.json().catch(() => ({}));
          if (res.status === 401) {
            authorToken = null;
            updateAuthButtonUI();
            uploadModal?.classList.remove('active');
            openAuthModal(() => uploadModal?.classList.add('active'));
            return;
          }
          if (!res.ok || !data.resume) {
            setStudioFeedback(uploadFeedback, 'error', data.error || 'Unable to upload resume.');
            return;
          }

          currentResume = data.resume;
          setSelectedFile(null);
          if (fileInput) fileInput.value = '';
          uploadModal?.classList.remove('active');
          renderResumeStatus();
        } catch (_err) {
          setStudioFeedback(uploadFeedback, 'error', 'Network error while uploading resume.');
        } finally {
          submitUploadBtn.disabled = false;
          submitUploadBtn.textContent = 'Upload & Publish Resume';
        }
      });
    }

    loadResumeStatus();
  }
}
