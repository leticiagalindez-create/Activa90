/* ============================================================
   ACTIVA 90 — PPTX Presentation Handler
   Renders presentation cards with download options.
   Attempts inline preview for smaller files using pptxjs.
   ============================================================ */

const INLINE_RENDER_MAX_MB = 10; // Only try inline render below this size

/**
 * Render presentation viewer/cards into a container.
 * @param {HTMLElement} container
 * @param {Array<{file,label,sizeMB}>|{file,label,sizeMB}} pptxConfig
 */
export function renderPptxCards(container, pptxConfig) {
  const items = Array.isArray(pptxConfig) ? pptxConfig : [pptxConfig];

  if (items.length > 1) {
    renderMultiPresentation(container, items);
  } else {
    renderSinglePresentation(container, items[0]);
  }
}

/* ── Multiple presentations: tab selector ─────────────────── */
function renderMultiPresentation(container, items) {
  container.innerHTML = `
    <div class="pptx-viewer-wrap">
      <div class="pptx-selector">
        ${items.map((item, i) => `
          <button class="pptx-selector__btn${i === 0 ? ' active' : ''}" data-idx="${i}">
            📊 ${item.label}
          </button>
        `).join('')}
      </div>
      <div class="pptx-viewer-stage" id="pptx-main-stage"></div>
    </div>
  `;

  const stage = container.querySelector('#pptx-main-stage');
  const btns  = container.querySelectorAll('.pptx-selector__btn');
  let current = -1;

  const load = idx => {
    if (current === idx) return;
    current = idx;
    btns.forEach(b => b.classList.toggle('active', +b.dataset.idx === idx));
    renderPresentationContent(stage, items[idx]);
  };

  btns.forEach(btn => btn.addEventListener('click', () => load(+btn.dataset.idx)));
  load(0);
}

/* ── Single presentation ─────────────────────────────────── */
function renderSinglePresentation(container, item) {
  container.innerHTML = `
    <div class="pptx-viewer-wrap">
      <div class="pptx-viewer-stage" id="pptx-main-stage"></div>
    </div>
  `;
  renderPresentationContent(container.querySelector('#pptx-main-stage'), item);
}

/* ── Main content renderer ───────────────────────────────── */
function renderPresentationContent(stage, item) {
  // Priority 1: Google Slides embed (best experience)
  if (item.embedUrl) {
    renderGoogleSlidesEmbed(stage, item);
  }
  // Priority 2: Try inline rendering for small files
  else if (item.sizeMB <= INLINE_RENDER_MAX_MB && typeof window.$ !== 'undefined' && typeof window.$.fn?.pptxToHtml !== 'undefined') {
    renderInlineViewer(stage, item);
  }
  // Priority 3: Download card fallback
  else {
    renderDownloadCard(stage, item);
  }
}

/* ── Google Slides Embed ─────────────────────────────────── */
function renderGoogleSlidesEmbed(stage, item) {
  stage.innerHTML = `
    <div class="google-slides-embed">
      <div class="google-slides-embed__header">
        <div class="google-slides-embed__info">
          <h3 class="google-slides-embed__title">${item.label}</h3>
          <p class="google-slides-embed__subtitle">Presentación en vivo • Navegación con flechas</p>
        </div>
        <div class="google-slides-embed__actions">
          <a href="${item.embedUrl.replace('/embed', '/edit')}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Abrir en Google Slides
          </a>
        </div>
      </div>
      <div class="google-slides-embed__container">
        <iframe
          src="${item.embedUrl}"
          frameborder="0"
          allowfullscreen="true"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          class="google-slides-embed__iframe"
        ></iframe>
      </div>
    </div>
  `;
}

/* ── Enhanced Download Card ──────────────────────────────── */
function renderDownloadCard(stage, item) {
  const isLarge = item.sizeMB > 15;

  stage.innerHTML = `
    <div class="pptx-presentation-card">
      <div class="pptx-presentation-card__preview">
        <div class="pptx-presentation-card__icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="8" width="60" height="45" rx="4" fill="#D14424" opacity="0.1"/>
            <rect x="14" y="12" width="52" height="37" rx="2" fill="#D14424" opacity="0.2"/>
            <rect x="18" y="16" width="44" height="29" rx="1" fill="white" stroke="#D14424" stroke-width="2"/>
            <rect x="24" y="22" width="20" height="4" rx="1" fill="#D14424" opacity="0.6"/>
            <rect x="24" y="30" width="32" height="2" rx="1" fill="#D14424" opacity="0.3"/>
            <rect x="24" y="35" width="28" height="2" rx="1" fill="#D14424" opacity="0.3"/>
            <circle cx="56" cy="60" r="12" fill="#D14424"/>
            <path d="M52 60L55 63L61 57" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="pptx-presentation-card__slides-hint">
          ${isLarge ? 'Archivo grande' : 'Presentación PowerPoint'}
        </div>
      </div>

      <div class="pptx-presentation-card__info">
        <h3 class="pptx-presentation-card__title">${item.label}</h3>
        <div class="pptx-presentation-card__meta">
          <span class="pptx-presentation-card__size">📎 ${item.sizeMB} MB</span>
          <span class="pptx-presentation-card__type">Microsoft PowerPoint</span>
        </div>
        ${isLarge ? `
          <p class="pptx-presentation-card__note">
            Este archivo es muy grande para previsualizarlo en el navegador.
            Descárgalo para verlo en PowerPoint.
          </p>
        ` : ''}
      </div>

      <div class="pptx-presentation-card__actions">
        <a href="${encodeURI(item.file)}" download class="btn btn-primary pptx-presentation-card__download">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Descargar Presentación
        </a>
        ${!isLarge ? `
          <button class="btn btn-outline pptx-presentation-card__try-view" data-action="try-view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Intentar Vista Previa
          </button>
        ` : ''}
      </div>
    </div>
  `;

  // Add try view button handler
  const tryViewBtn = stage.querySelector('[data-action="try-view"]');
  if (tryViewBtn) {
    tryViewBtn.addEventListener('click', () => {
      renderInlineViewer(stage, item);
    });
  }
}

/* ── Inline Viewer (for smaller files) ───────────────────── */
function renderInlineViewer(stage, item) {
  if (typeof window.$ === 'undefined' || typeof window.$.fn?.pptxToHtml === 'undefined') {
    renderDownloadCard(stage, item);
    return;
  }

  const uid = 'pptx-' + Math.random().toString(36).slice(2, 8);

  stage.innerHTML = `
    <div class="pptx-inline-viewer">
      <div class="pptx-spinner" id="spinner-${uid}">
        <div class="pptx-spinner__ring"></div>
        <p>Cargando diapositivas…</p>
        <p class="pptx-spinner__hint">Esto puede tardar un momento</p>
      </div>
      <div id="${uid}" class="pptx-slides-host" style="display:none"></div>
      <nav class="pptx-nav" id="nav-${uid}" style="display:none">
        <button class="pptx-nav__btn" id="prev-${uid}" disabled aria-label="Anterior">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="pptx-nav__counter" id="ctr-${uid}">1 / —</span>
        <button class="pptx-nav__btn" id="next-${uid}" aria-label="Siguiente">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </nav>
    </div>
  `;

  const host = document.getElementById(uid);
  let resolved = false;

  // Timeout fallback - show download card after 20 seconds
  const timer = setTimeout(() => {
    if (!resolved) {
      resolved = true;
      showInlineError(stage, item, 'La carga tomó demasiado tiempo.');
    }
  }, 20000);

  // Poll for rendered slides
  let polls = 0;
  const poll = setInterval(() => {
    polls++;
    const slideEls = host.querySelectorAll('.slide');
    if (slideEls.length > 0 && !resolved) {
      clearInterval(poll);
      clearTimeout(timer);
      resolved = true;
      setupSlideNavigation(stage, uid, host, [...slideEls], item);
    } else if (polls >= 40) {
      clearInterval(poll);
      clearTimeout(timer);
      if (!resolved) {
        resolved = true;
        showInlineError(stage, item, 'No se pudieron cargar las diapositivas.');
      }
    }
  }, 500);

  try {
    window.$(`#${uid}`).pptxToHtml({
      pptxFileUrl:      encodeURI(item.file),
      slidesScale:      '100%',
      slideMode:        false,
      keyBoardShortCut: false
    });
  } catch (err) {
    clearInterval(poll);
    clearTimeout(timer);
    if (!resolved) {
      resolved = true;
      showInlineError(stage, item, 'Error al procesar el archivo.');
    }
  }
}

/* ── Error state with download fallback ──────────────────── */
function showInlineError(stage, item, message) {
  stage.innerHTML = `
    <div class="pptx-error-state">
      <div class="pptx-error-state__icon">⚠️</div>
      <h3 class="pptx-error-state__title">Vista previa no disponible</h3>
      <p class="pptx-error-state__message">${message}</p>
      <div class="pptx-error-state__actions">
        <a href="${encodeURI(item.file)}" download class="btn btn-primary">
          📥 Descargar Presentación
        </a>
        <button class="btn btn-outline" onclick="location.reload()">
          🔄 Reintentar
        </button>
      </div>
      <p class="pptx-error-state__hint">
        Descarga el archivo para verlo en Microsoft PowerPoint o LibreOffice Impress.
      </p>
    </div>
  `;
}

/* ── Slide Navigation ────────────────────────────────────── */
function setupSlideNavigation(stage, uid, host, slides, item) {
  document.getElementById(`spinner-${uid}`)?.remove();

  // Wrap each slide for responsive scaling
  slides.forEach(s => {
    const slideW = parseFloat(s.style.width)  || 960;
    const slideH = parseFloat(s.style.height) || 540;

    const wrap = document.createElement('div');
    wrap.className = 'pptx-slide-wrap';
    wrap.style.paddingBottom = `${(slideH / slideW * 100).toFixed(3)}%`;
    s.parentNode.insertBefore(wrap, s);
    wrap.appendChild(s);

    // Scale slide to fill wrapper
    s.style.position       = 'absolute';
    s.style.top            = '0';
    s.style.left           = '0';
    s.style.transformOrigin = 'top left';

    const applyScale = () => {
      const w = wrap.offsetWidth;
      if (w > 0 && slideW > 0) s.style.transform = `scale(${w / slideW})`;
    };
    applyScale();
    window.addEventListener('resize', applyScale);
  });

  // Hide all slides except first
  slides.forEach((s, i) => {
    s.parentElement.style.display = i === 0 ? 'block' : 'none';
  });

  host.style.display = 'block';

  const nav     = document.getElementById(`nav-${uid}`);
  const prevBtn = document.getElementById(`prev-${uid}`);
  const nextBtn = document.getElementById(`next-${uid}`);
  const ctr     = document.getElementById(`ctr-${uid}`);
  nav.style.display = '';

  let idx = 0;

  const update = () => {
    ctr.textContent  = `${idx + 1} / ${slides.length}`;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === slides.length - 1;
  };

  const show = i => {
    slides[idx].parentElement.style.display = 'none';
    idx = i;
    slides[idx].parentElement.style.display = 'block';
    // Re-trigger scale after becoming visible
    const slideW = parseFloat(slides[idx].style.width) || 960;
    const w = slides[idx].parentElement.offsetWidth;
    if (w > 0) slides[idx].style.transform = `scale(${w / slideW})`;
    update();
  };

  update();
  prevBtn.addEventListener('click', () => { if (idx > 0)               show(idx - 1); });
  nextBtn.addEventListener('click', () => { if (idx < slides.length-1) show(idx + 1); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!stage.isConnected) return;
    if (e.target.matches('input,textarea,select,[contenteditable]')) return;
    if (e.key === 'ArrowLeft'  && idx > 0)               { e.preventDefault(); show(idx - 1); }
    if (e.key === 'ArrowRight' && idx < slides.length-1) { e.preventDefault(); show(idx + 1); }
  });
}
