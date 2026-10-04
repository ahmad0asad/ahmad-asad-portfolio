/**
 * Ahmad Asad - Academic & Lifestyle Portfolio
 * Lightweight Vanilla JavaScript
 * Zero external frameworks or heavy dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  highlightActiveNav();
  initPublicationFilters();
  initCopyActions();
  initDynamicYear();
  initJumpLinkObserver();
});

/**
 * 1. Mobile Navigation Toggle with ARIA Accessibility
 */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (!menuBtn || !mainNav) return;

  const toggleMenu = (forceState) => {
    const isExpanded = forceState !== undefined 
      ? forceState 
      : menuBtn.getAttribute('aria-expanded') === 'true';
    
    const newState = !isExpanded;
    menuBtn.setAttribute('aria-expanded', String(newState));
    menuBtn.classList.toggle('active', newState);
    mainNav.classList.toggle('open', newState);

    if (newState) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleOutsideClick);
    }
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking on any nav link
  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true); // force close
    });
  });

  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      toggleMenu(true);
      menuBtn.focus();
    }
  }

  function handleOutsideClick(e) {
    if (!mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenu(true);
    }
  }
}

/**
 * 2. Highlight Active Page Link Based on URL
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize comparison
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 3. Interactive Filter Tabs for Publications (academic.html)
 */
function initPublicationFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.publication-card');

  if (!filterBtns.length || !pubCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter publications
      pubCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 4. Clipboard Copy Utilities with Toast Notifications
 */
function initCopyActions() {
  // Ensure toast container exists
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  let toastTimer = null;
  const showToast = (message) => {
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-accent-light);">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // Copy Citation handler
  const copyCiteBtns = document.querySelectorAll('[data-copy-citation]');
  copyCiteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const citationText = btn.getAttribute('data-copy-citation');
      if (!citationText) return;

      navigator.clipboard.writeText(citationText)
        .then(() => showToast('Citation copied to clipboard!'))
        .catch(() => showToast('Unable to copy citation.'));
    });
  });

  // Copy Email handler
  const copyEmailBtns = document.querySelectorAll('[data-copy-email]');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'ahmad0asad.aa@gmail.com';

      navigator.clipboard.writeText(email)
        .then(() => showToast(`Copied ${email} to clipboard!`))
        .catch(() => showToast('Unable to copy email address.'));
    });
  });
}

/**
 * 5. Update Current Year in Footer Automatically
 */
function initDynamicYear() {
  const yearSpans = document.querySelectorAll('.current-year');
  const thisYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = thisYear;
  });
}

/**
 * 6. Active Jump Link Highlighting on Scroll (lifestyle.html)
 */
function initJumpLinkObserver() {
  const jumpLinks = document.querySelectorAll('.jump-link');
  if (!jumpLinks.length) return;

  const sections = [];
  jumpLinks.forEach(link => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      const target = document.querySelector(hash);
      if (target) {
        sections.push({ link, target });
      }
    }
  });

  if (!sections.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 140;
    let currentActive = null;

    sections.forEach(({ link, target }) => {
      const top = target.offsetTop;
      const height = target.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentActive = link;
      }
    });

    jumpLinks.forEach(link => {
      if (link === currentActive) {
        link.classList.add('active-jump');
      } else {
        link.classList.remove('active-jump');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
