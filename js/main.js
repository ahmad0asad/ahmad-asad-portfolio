/**
 * Ahmad Asad - Academic Portfolio & Geospatial Platform
 * Lightweight Vanilla JavaScript (ES6+)
 * Zero external frameworks or heavy dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  highlightActiveNav();
  initCopyActions();
  initDynamicYear();
  initPublicationFilters();
  initCodeVault();
  initTutorialTOC();
  initReferenceSearch();
  initSpectralTool();
});

/**
 * 1. Mobile Navigation Toggle with ARIA Accessibility
 */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (!menuBtn || !mainNav) return;

  const toggleMenu = (forceClose) => {
    const isExpanded = forceClose ? true : menuBtn.getAttribute('aria-expanded') === 'true';
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

  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
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
 * 2. Highlight Active Page Link Based on Current URL
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  if (pageName === '') pageName = 'index.html';

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (href === pageName || (pageName === 'index.html' && href === './')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 3. Clipboard Copy Utilities with Toast Notifications
 */
function initCopyActions() {
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
  document.addEventListener('click', (e) => {
    const citeBtn = e.target.closest('[data-copy-citation]');
    if (citeBtn) {
      e.preventDefault();
      const citationText = citeBtn.getAttribute('data-copy-citation');
      if (!citationText) return;

      navigator.clipboard.writeText(citationText)
        .then(() => showToast('Citation copied to clipboard!'))
        .catch(() => showToast('Unable to copy citation.'));
      return;
    }

    // Copy Code Snippet handler
    const codeBtn = e.target.closest('[data-copy-target]');
    if (codeBtn) {
      e.preventDefault();
      const targetId = codeBtn.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const codeText = targetEl.innerText || targetEl.textContent;
      navigator.clipboard.writeText(codeText)
        .then(() => {
          showToast('Code snippet copied to clipboard!');
          const origText = codeBtn.innerHTML;
          codeBtn.classList.add('copied');
          codeBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          `;
          setTimeout(() => {
            codeBtn.classList.remove('copied');
            codeBtn.innerHTML = origText;
          }, 2000);
        })
        .catch(() => showToast('Unable to copy code.'));
      return;
    }

    // Copy Email handler
    const emailBtn = e.target.closest('[data-copy-email]');
    if (emailBtn) {
      e.preventDefault();
      const email = emailBtn.getAttribute('data-copy-email') || 'ahmad0asad.aa@gmail.com';
      navigator.clipboard.writeText(email)
        .then(() => showToast(`Copied ${email} to clipboard!`))
        .catch(() => showToast('Unable to copy email.'));
      return;
    }
  });
}

/**
 * 4. Update Current Year in Footer
 */
function initDynamicYear() {
  const yearSpans = document.querySelectorAll('.current-year');
  const thisYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = thisYear;
  });
}

/**
 * 5. Interactive Filter Tabs for Publications (index.html)
 */
function initPublicationFilters() {
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubCards = document.querySelectorAll('.publication-card');

  if (!filterBtns.length || !pubCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      pubCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 6. Code Vault Live Search & Filter Buttons (code.html)
 */
function initCodeVault() {
  const searchInput = document.getElementById('codeSearchInput');
  const filterBtns = document.querySelectorAll('.code-filter-btn');
  const codeCards = document.querySelectorAll('.code-card');

  if (!codeCards.length) return;

  let activeFilter = 'all';

  const filterCards = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    codeCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();

      const matchesFilter = (activeFilter === 'all' || category === activeFilter);
      const matchesSearch = query === '' || text.includes(query);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-category');
        filterCards();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}

/**
 * 7. Tutorials Sticky Table of Contents Scroll Spy (tutorials.html)
 */
function initTutorialTOC() {
  const tocLinks = document.querySelectorAll('.toc-link');
  if (!tocLinks.length) return;

  const sections = [];
  tocLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      const el = document.querySelector(targetId);
      if (el) sections.push({ link, el });
    }
  });

  if (!sections.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 160;
    let current = null;

    sections.forEach(({ link, el }) => {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = link;
      }
    });

    tocLinks.forEach(l => {
      if (l === current) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 8. Empirical Reference Table Search / Row Filtering (reference.html)
 */
function initReferenceSearch() {
  const refSearch = document.getElementById('referenceSearchInput');
  if (!refSearch) return;

  const tables = document.querySelectorAll('.data-table');
  refSearch.addEventListener('input', () => {
    const q = refSearch.value.toLowerCase().trim();

    tables.forEach(table => {
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (q === '' || text.includes(q)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 9. Interactive Spectral Tool Controller (spectral-tool.html)
 */
function initSpectralTool() {
  if (typeof RS_DATA === 'undefined') return;

  const sensorBtns = document.querySelectorAll('.sensor-btn');
  const catBtns = document.querySelectorAll('.tool-cat-btn');
  const searchInput = document.getElementById('indexSearchInput');
  const indexListEl = document.getElementById('indexListContainer');
  const inspectorEl = document.getElementById('toolInspectorContainer');

  if (!indexListEl || !inspectorEl) return;

  let currentSensorKey = 'sentinel2';
  let currentCategory = 'all';
  let selectedIndexId = 'sui'; // default to SUI

  // 1. Render Index Cards
  const renderIndexList = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    indexListEl.innerHTML = '';

    const filtered = RS_DATA.indices.filter(idx => {
      const matchesCat = (currentCategory === 'all' || idx.category === currentCategory);
      const matchesSearch = query === '' ||
        idx.acronym.toLowerCase().includes(query) ||
        idx.name.toLowerCase().includes(query) ||
        idx.description.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      indexListEl.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--color-text-subtle); background: var(--color-bg); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
          No matching spectral indices found. Try adjusting your search query or category filter.
        </div>
      `;
      return;
    }

    filtered.forEach(idx => {
      const isSelected = idx.id === selectedIndexId;
      const card = document.createElement('div');
      card.className = `index-card ${isSelected ? 'active' : ''}`;
      card.setAttribute('data-id', idx.id);

      card.innerHTML = `
        <div class="index-card-top">
          <span class="index-acronym">${idx.acronym}</span>
          ${idx.featured ? `<span class="badge-featured">★ ${idx.citationBadge || 'Featured'}</span>` : `<span class="tag" style="text-transform: capitalize;">${idx.category}</span>`}
        </div>
        <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-primary); line-height: 1.3;">${idx.name}</div>
        <div class="index-formula-preview">${idx.formulaDisplay}</div>
      `;

      card.addEventListener('click', () => {
        selectedIndexId = idx.id;
        document.querySelectorAll('.index-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        renderInspector();
      });

      indexListEl.appendChild(card);
    });

    // If the selected index is not in the filtered list, select the first available
    if (!filtered.some(i => i.id === selectedIndexId) && filtered.length > 0) {
      selectedIndexId = filtered[0].id;
      const firstCard = indexListEl.querySelector('.index-card');
      if (firstCard) firstCard.classList.add('active');
    }

    renderInspector();
  };

  // 2. Render Details & Code Generation for Selected Index & Sensor
  const renderInspector = () => {
    const idx = RS_DATA.indices.find(i => i.id === selectedIndexId);
    const sensor = RS_DATA.sensors[currentSensorKey];
    if (!idx || !sensor) return;

    // Check if sensor has all required bands
    const missingBands = idx.requiredBands.filter(b => !sensor.bands[b]);
    const sensorBands = {};
    idx.requiredBands.forEach(b => {
      if (sensor.bands[b]) {
        sensorBands[b] = sensor.bands[b].band;
      }
    });

    let bandsHtml = '';
    idx.requiredBands.forEach(b => {
      const bInfo = sensor.bands[b];
      if (bInfo) {
        bandsHtml += `
          <div class="band-chip">
            <span style="font-weight: 700; color: var(--color-accent);">${b}:</span>
            <span>${bInfo.band}</span>
            <span style="color: var(--color-text-subtle);">(${bInfo.wave} nm · ${bInfo.res})</span>
          </div>
        `;
      } else {
        bandsHtml += `
          <div class="band-chip" style="border-color: #fecaca; background: #fef2f2; color: #dc2626;">
            <span>${b}: Not natively available on ${sensor.name}</span>
          </div>
        `;
      }
    });

    let codeSection = '';
    if (missingBands.length > 0) {
      codeSection = `
        <div class="callout callout-warning">
          <div class="callout-text">
            <strong>Sensor Incompatibility:</strong> ${idx.acronym} requires band(s) [${missingBands.join(', ')}] which are not present on <strong>${sensor.name}</strong>. Please switch to a sensor supporting thermal/SWIR channels (e.g. Landsat 8/9).
          </div>
        </div>
      `;
    } else {
      const geeCode = idx.geeCode ? idx.geeCode(sensorBands) : '// GEE code';
      const qgisFormula = idx.qgisFormula ? idx.qgisFormula(sensorBands, 'raster') : '';
      const pythonCode = idx.pythonCode ? idx.pythonCode(sensorBands) : '';

      codeSection = `
        <div style="margin-top: 1.5rem;">
          <div class="code-tabs-nav" role="tablist">
            <button class="code-tab-btn active" data-tab="gee">Google Earth Engine</button>
            <button class="code-tab-btn" data-tab="qgis">QGIS Raster Calc</button>
            <button class="code-tab-btn" data-tab="python">Python (Rasterio/NumPy)</button>
          </div>

          <div class="code-block-wrapper" style="border-bottom-left-radius: var(--radius-md); border-bottom-right-radius: var(--radius-md); overflow: hidden;">
            <div class="code-block-bar">
              <span id="activeTabLangLabel">JavaScript (GEE API)</span>
              <button class="copy-btn" data-copy-target="dynamicSnippetPre">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Formula
              </button>
            </div>
            <pre class="code-pre" id="dynamicSnippetPre">${escapeHtml(geeCode)}</pre>
          </div>
        </div>
      `;
    }

    inspectorEl.innerHTML = `
      <div class="inspector-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
          <div>
            <span class="section-tag" style="font-size: 0.75rem; padding: 0.2rem 0.6rem; margin-bottom: 0.5rem;">
              ${sensor.name} · ${idx.category.toUpperCase()}
            </span>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${idx.acronym} — ${idx.name}</h3>
          </div>
          ${idx.featured ? `<span class="badge-featured" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;">★ Featured Publication</span>` : ''}
        </div>
        <p style="font-size: 0.925rem; color: var(--color-primary-muted); line-height: 1.6; margin-bottom: 0;">
          ${idx.description}
        </p>
      </div>

      <div class="formula-display-box">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-subtle); margin-bottom: 0.35rem;">
          Mathematical Formulation
        </div>
        <div class="formula-math">${idx.formulaDisplay}</div>
      </div>

      <div>
        <div style="font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-subtle); margin-bottom: 0.35rem;">
          Required Sensor Channels (${sensor.name})
        </div>
        <div class="bands-chips-row">${bandsHtml}</div>
      </div>

      ${idx.resolutionWarning ? `
        <div class="callout callout-note" style="margin: 1.25rem 0;">
          <div class="callout-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="callout-text">
            <strong>Spatial Resolution Notice:</strong> ${idx.resolutionWarning}
          </div>
        </div>
      ` : ''}

      ${codeSection}

      ${idx.citation ? `
        <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--color-border); font-size: 0.8125rem; color: var(--color-text-subtle);">
          <strong>Scientific Citation:</strong> ${idx.citation}
        </div>
      ` : ''}
    `;

    // Tab switching within the inspector
    const tabBtns = inspectorEl.querySelectorAll('.code-tab-btn');
    const dynamicSnippetPre = inspectorEl.querySelector('#dynamicSnippetPre');
    const activeTabLangLabel = inspectorEl.querySelector('#activeTabLangLabel');

    if (tabBtns.length && dynamicSnippetPre) {
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const tabKey = btn.getAttribute('data-tab');

          if (tabKey === 'gee') {
            activeTabLangLabel.textContent = 'JavaScript (GEE API)';
            dynamicSnippetPre.textContent = idx.geeCode ? idx.geeCode(sensorBands) : '';
          } else if (tabKey === 'qgis') {
            activeTabLangLabel.textContent = 'QGIS Raster Calculator Expression';
            dynamicSnippetPre.textContent = idx.qgisFormula ? idx.qgisFormula(sensorBands, 'raster') : '';
          } else if (tabKey === 'python') {
            activeTabLangLabel.textContent = 'Python 3 (NumPy & Rasterio)';
            dynamicSnippetPre.textContent = idx.pythonCode ? idx.pythonCode(sensorBands) : '';
          }
        });
      });
    }
  };

  // Helper to escape HTML in code
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Sensor selection listeners
  sensorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sensorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSensorKey = btn.getAttribute('data-sensor');
      renderInspector();
    });
  });

  // Category selection listeners
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderIndexList();
    });
  });

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', renderIndexList);
  }

  // Initial render
  renderIndexList();
}
