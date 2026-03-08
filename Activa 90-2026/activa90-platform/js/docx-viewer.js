/* ============================================================
   ACTIVA 90 — DOCX Viewer
   Uses Mammoth.js to render Word documents in the browser.
   Mammoth is loaded globally via <script> tag in each HTML page.
   ============================================================ */

/**
 * Fetch and render a DOCX file into a target DOM element.
 * @param {string} filePath - URL/path to the .docx file
 * @param {HTMLElement} container - Element to render into
 * @param {Object} opts
 * @param {string} [opts.downloadLabel] - Label for fallback download link
 */
export async function loadDocx(filePath, container, opts = {}) {
  // Show loading skeleton
  container.innerHTML = buildSkeleton();

  if (typeof mammoth === 'undefined') {
    container.innerHTML = buildError(
      filePath,
      'Librería de visualización no cargada. Recarga la página.',
      opts.downloadLabel
    );
    return;
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} — ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        styleMap: [
          "p[style-name='Heading 1']      => h1",
          "p[style-name='Heading 2']      => h2",
          "p[style-name='Heading 3']      => h3",
          "p[style-name='Heading 4']      => h4",
          "p[style-name='Heading 5']      => h5",
          "p[style-name='Title']          => h1",
          "p[style-name='Subtitle']       => h4",
          "r[style-name='Strong']         => strong",
          "r[style-name='Emphasis']       => em",
          "p[style-name='List Paragraph'] => ul > li:fresh"
        ],
        convertImage: mammoth.images.imgElement(async (image) => {
          const base64 = await image.read('base64');
          return { src: `data:${image.contentType};base64,${base64}` };
        })
      }
    );

    const wrapper = document.createElement('div');
    wrapper.className = 'docx-content';
    wrapper.innerHTML = result.value || '<p>El documento está vacío.</p>';

    container.innerHTML = '';
    container.appendChild(wrapper);

    // Log conversion warnings (developer info only)
    if (result.messages && result.messages.length > 0) {
      console.debug('[Mammoth] Conversion notes for', filePath, result.messages);
    }

  } catch (err) {
    console.error('[DOCX Viewer] Failed to load:', filePath, err);
    container.innerHTML = buildError(filePath, err.message, opts.downloadLabel);
  }
}

/* ── Loading skeleton ───────────────────────────────────────── */
function buildSkeleton() {
  const lines = [
    ['lg', '80%'], ['sm', '60%'], ['', '95%'], ['', '88%'], ['', '72%'],
    ['lg', '55%'], ['sm', '40%'], ['', '91%'], ['', '83%'], ['', '68%'],
    ['lg', '70%'], ['', '94%'], ['', '79%'], ['sm', '50%']
  ];

  return `
    <div class="docx-loading" style="padding: var(--space-8);">
      ${lines.map(([size, w]) => `
        <div class="skeleton skeleton-text skeleton-text--${size}"
             style="width:${w}; margin-bottom: var(--space-3);"></div>
      `).join('')}
    </div>
  `;
}

/* ── Error state with download fallback ─────────────────────── */
function buildError(filePath, message, downloadLabel) {
  const fname = filePath.split('/').pop();
  return `
    <div class="docx-error">
      <div class="docx-error__icon">📄</div>
      <h3 class="docx-error__title">No se pudo cargar el documento</h3>
      <p class="docx-error__message">
        Este archivo debe ser servido desde un servidor HTTP.
        Abre la plataforma con Live Server o <code>python -m http.server</code>
        desde la carpeta <strong>Activa 90-2026</strong>.
      </p>
      <p class="docx-error__message" style="font-size: var(--font-size-xs); color: var(--color-text-subtle);">
        Detalle: ${message}
      </p>
      <a href="${filePath}" download class="btn btn-outline btn-sm" style="margin-top: var(--space-2);">
        Descargar ${downloadLabel || fname}
      </a>
    </div>
  `;
}
