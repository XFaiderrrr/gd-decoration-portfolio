
/* =====================================================
   XFAIDER SECRET ARCHIVE
   Portal, código Konami y progreso persistente
   ===================================================== */

(() => {
  "use strict";

  const DATA = window.XFAIDER_PORTAL_DATA;

  if (!DATA) {
    console.error("[XFaider Portal] No se encontró portal-data.js.");
    return;
  }

  const STORAGE_KEY = "xfaider_secret_archive_v1";

  const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a"
  ];

  const ICONS = {
    origen: "◈",
    proyectos: "⌘",
    logros: "✧",
    archivos: "▧",
    mensaje: "⌬"
  };

  let keySequence = [];
  let activeSection = "origen";
  let portalElement = null;
  let toastTimer = null;

  function defaultProgress() {
    return {
      unlocked: false,
      visitedSections: [],
      unlockedAchievements: [],
      totalVisits: 0
    };
  }

  function loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return defaultProgress();

      const parsed = JSON.parse(saved);

      return {
        ...defaultProgress(),
        ...parsed,
        visitedSections: Array.isArray(parsed.visitedSections)
          ? parsed.visitedSections
          : [],
        unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
          ? parsed.unlockedAchievements
          : []
      };
    } catch (error) {
      console.warn(
        "[XFaider Portal] No se pudo leer el progreso.",
        error
      );

      return defaultProgress();
    }
  }

  let progress = loadProgress();

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn(
        "[XFaider Portal] No se pudo guardar el progreso.",
        error
      );
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[character]
    );
  }

  function sectionById(id) {
    return DATA.sections.find(section => section.id === id);
  }

  function isUnlocked(id) {
    return progress.unlockedAchievements.includes(id);
  }

  function showToast(message) {
    let toast = document.querySelector(".xfp-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "xfp-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  function unlockAchievement(id) {
    const achievements = sectionById("logros")?.achievements || [];
    const achievement = achievements.find(item => item.id === id);

    if (!achievement || isUnlocked(id)) return;

    progress.unlockedAchievements.push(id);
    saveProgress();

    showToast(`✦ LOGRO DESBLOQUEADO: ${achievement.title}`);

    if (portalElement) {
      renderAchievements();
      updateProgressDisplay();
    }
  }

  function openPortal() {
    if (portalElement) {
      portalElement.classList.add("is-open");
      portalElement.setAttribute("aria-hidden", "false");
      document.body.classList.add("xfp-portal-open");
      renderSection(activeSection);
      return;
    }

    progress.unlocked = true;
    progress.totalVisits += 1;
    saveProgress();

    createPortal();

    document.body.classList.add("xfp-portal-open");

    requestAnimationFrame(() => {
      portalElement.classList.add("is-open");
      portalElement.setAttribute("aria-hidden", "false");
      renderSection(activeSection);

      portalElement.querySelector(".xfp-window")?.focus();
    });

    unlockAchievement("first-archive");

    window.dispatchEvent(
      new CustomEvent("xfaider:portal-opened")
    );
  }

  function closePortal() {
    if (!portalElement) return;

    portalElement.classList.remove("is-open");
    portalElement.setAttribute("aria-hidden", "true");
    document.body.classList.remove("xfp-portal-open");

    const activeElement = document.activeElement;

    if (activeElement && portalElement.contains(activeElement)) {
      activeElement.blur();
    }

    window.dispatchEvent(
      new CustomEvent("xfaider:portal-closed")
    );
  }

  function createPortal() {
    portalElement = document.createElement("div");

    portalElement.className = "xfp-portal";
    portalElement.setAttribute("aria-hidden", "true");

    portalElement.innerHTML = `
      <div class="xfp-backdrop"></div>

      <section
        class="xfp-window"
        role="dialog"
        aria-modal="true"
        aria-label="Archivo secreto de XFaider"
        tabindex="-1"
      >
        <div class="xfp-scanlines"></div>
        <div class="xfp-glow xfp-glow-one"></div>
        <div class="xfp-glow xfp-glow-two"></div>

        <header class="xfp-header">
          <div class="xfp-brand">
            <span class="xfp-brand-icon">X</span>

            <div>
              <div class="xfp-brand-title">
                ${escapeHTML(DATA.title)}
              </div>

              <div class="xfp-brand-subtitle">
                ${escapeHTML(DATA.subtitle)}
              </div>
            </div>
          </div>

          <div class="xfp-header-right">
            <span class="xfp-status">
              <span class="xfp-status-dot"></span>
              ARCHIVE ONLINE
            </span>

            <button
              class="xfp-close"
              type="button"
              aria-label="Cerrar el portal"
              title="Cerrar (Escape)"
              data-xfp-close
            >×</button>
          </div>
        </header>

        <div class="xfp-layout">
          <aside class="xfp-sidebar">
            <div class="xfp-sidebar-label">
              DIRECTORY
            </div>

            <nav class="xfp-nav" aria-label="Secciones del archivo">
              ${DATA.sections.map(section => `
                <button
                  type="button"
                  class="xfp-nav-item"
                  data-xfp-section="${escapeHTML(section.id)}"
                >
                  <span class="xfp-nav-number">
                    ${escapeHTML(section.number)}
                  </span>

                  <span class="xfp-nav-icon">
                    ${escapeHTML(
                      ICONS[section.id] || section.icon || "◇"
                    )}
                  </span>

                  <span class="xfp-nav-title">
                    ${escapeHTML(section.title)}
                  </span>

                  <span class="xfp-nav-check" aria-hidden="true">✓</span>
                </button>
              `).join("")}
            </nav>

            <div class="xfp-sidebar-footer">
              <div class="xfp-progress-heading">
                EXPLORATION PROGRESS
              </div>

              <div class="xfp-progress-track">
                <div class="xfp-progress-fill"></div>
              </div>

              <div class="xfp-progress-text">0 / 5 ARCHIVES</div>
            </div>
          </aside>

          <main class="xfp-main">
            <div class="xfp-main-top">
              <span class="xfp-breadcrumb">
                ROOT / ARCHIVE
              </span>

              <span class="xfp-version">
                ${escapeHTML(DATA.version)}
              </span>
            </div>

            <div class="xfp-content" tabindex="-1"></div>

            <footer class="xfp-footer">
              <span>XA // PRIVATE CREATOR DATABASE</span>
              <span class="xfp-footer-right">CONNECTION SECURE</span>
            </footer>
          </main>
        </div>
      </section>
    `;

    document.body.appendChild(portalElement);

    portalElement.querySelector("[data-xfp-close]")
      .addEventListener("click", closePortal);

    portalElement.querySelector(".xfp-backdrop")
      .addEventListener("click", closePortal);

    portalElement.querySelectorAll("[data-xfp-section]")
      .forEach(button => {
        button.addEventListener("click", () => {
          renderSection(button.dataset.xfpSection);
        });
      });

    portalElement.addEventListener("click", event => {
      const button = event.target.closest("[data-xfp-achievement]");

      if (!button) return;

      if (button.dataset.xfp-achievement === "all-achievements") {
        renderSection("logros");
      }
    });

    portalElement.addEventListener("keydown", event => {
      if (event.key !== "Tab") return;

      const focusable = [
        ...portalElement.querySelectorAll(
          'button:not(:disabled), [tabindex="0"]'
        )
      ].filter(element => element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    });

    updateProgressDisplay();
  }

  function renderSection(id) {
    const section = sectionById(id);

    if (!section || !portalElement) return;

    activeSection = id;

    progress.visitedSections = [
      ...new Set([...progress.visitedSections, id])
    ];

    saveProgress();

    if (id === "origen") {
      unlockAchievement("creative-path");
    }

    if (id === "proyectos") {
      unlockAchievement("project-explorer");
    }

    if (id === "archivos") {
      unlockAchievement("memory-keeper");
    }

    const allVisited = DATA.sections.every(item =>
      progress.visitedSections.includes(item.id)
    );

    if (allVisited) {
      unlockAchievement("complete-archive");
    }

    portalElement.querySelectorAll("[data-xfp-section]")
      .forEach(button => {
        const selected = button.dataset.xfpSection === id;

        button.classList.toggle("is-active", selected);

        if (selected) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });

    const content = portalElement.querySelector(".xfp-content");

    content.innerHTML = `
      <div class="xfp-section-enter">
        <div class="xfp-section-eyebrow">
          <span class="xfp-eyebrow-line"></span>
          ${escapeHTML(section.eyebrow || "ARCHIVE ENTRY")}
        </div>

        <div class="xfp-section-title-row">
          <div>
            <div class="xfp-section-number">
              ENTRY_${escapeHTML(section.number)}
            </div>

            <h1 class="xfp-section-title">
              ${escapeHTML(section.title)}
            </h1>
          </div>

          <div class="xfp-section-symbol" aria-hidden="true">
            ${escapeHTML(ICONS[id] || section.icon || "◇")}
          </div>
        </div>

        <p class="xfp-section-description">
          ${escapeHTML(section.description || "")}
        </p>

        <div class="xfp-section-body">
          ${renderSectionBody(section)}
        </div>

        ${section.note ? `
          <div class="xfp-system-note">
            <span class="xfp-note-mark">▸</span>
            ${escapeHTML(section.note)}
          </div>
        ` : ""}

        ${section.signature ? `
          <div class="xfp-signature">
            ${escapeHTML(section.signature)}
          </div>
        ` : ""}
      </div>
    `;

    content.scrollTop = 0;
    updateProgressDisplay();
  }

  function renderSectionBody(section) {
    let html = "";

    // Texto narrativo: Origen y Mensaje final.
    if (section.paragraphs) {
      html += `
        <div class="xfp-prose">
          ${section.paragraphs.map(paragraph => `
            <p>${escapeHTML(paragraph)}</p>
          `).join("")}
        </div>
      `;
    }

    // Tarjetas de proyectos.
    if (section.projects) {
      html += `
        <div class="xfp-card-grid">
          ${section.projects.map((project, index) => `
            <article class="xfp-card">
              <div class="xfp-card-top">
                <span class="xfp-card-index">
                  PROJECT_${String(index + 1).padStart(2, "0")}
                </span>

                <span class="xfp-card-glyph">⌘</span>
              </div>

              ${project.image ? `
                <img
                  class="xfp-project-image"
                  src="${escapeHTML(project.image)}"
                  alt="${escapeHTML(project.title)}"
                  loading="lazy"
                  style="
                    display: block;
                    width: 100%;
                    max-height: 180px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin: 12px 0;
                  "
                >
              ` : ""}

              <div class="xfp-card-category">
                ${escapeHTML(project.category)}
              </div>

              <h2 class="xfp-card-title">
                ${escapeHTML(project.title)}
              </h2>

              <p class="xfp-card-description">
                ${escapeHTML(project.description)}
              </p>

              <div class="xfp-tags">
                ${(project.tags || []).map(tag => `
                  <span class="xfp-tag">${escapeHTML(tag)}</span>
                `).join("")}
              </div>

              <div class="xfp-card-status">
                <span class="xfp-status-dot"></span>
                ${escapeHTML(project.status || "ARCHIVED")}
              </div>
            </article>
          `).join("")}
        </div>
      `;
    }

    // Tarjetas de logros.
    if (section.achievements) {
      html += renderAchievementCards(section.achievements);
    }

    // Archivos perdidos con sus imágenes.
    if (section.files) {
      html += `
        <div class="xfp-file-list">
          ${section.files.map((file, index) => `
            <article class="xfp-file">
              <div class="xfp-file-icon">▤</div>

              <div class="xfp-file-details">
                <div class="xfp-file-type">
                  ${escapeHTML(file.type)}
                </div>

                <h2 class="xfp-file-title">
                  ${escapeHTML(file.title)}
                </h2>

                <p class="xfp-file-description">
                  ${escapeHTML(file.description)}
                </p>

                ${file.image ? `
                  <img
                    class="xfp-file-image"
                    src="${escapeHTML(file.image)}"
                    alt="Fragmento visual: ${escapeHTML(file.title)}"
                    loading="lazy"
                    style="
                      display: block;
                      width: 100%;
                      max-height: 240px;
                      object-fit: contain;
                      border-radius: 8px;
                      margin: 14px 0;
                    "
                  >
                ` : ""}

                <span class="xfp-file-status">
                  ${escapeHTML(file.status)}
                </span>
              </div>

              <div class="xfp-file-index">
                FRAGMENT_${String(index + 1).padStart(2, "0")}
              </div>
            </article>
          `).join("")}
        </div>
      `;
    }

    // Resumen de logros desbloqueados.
    if (section.id === "logros") {
      html += `
        <div class="xfp-achievement-summary">
          <span>UNLOCKED</span>
          <strong>
            ${progress.unlockedAchievements.length}
            /
            ${(section.achievements || []).length}
          </strong>
        </div>
      `;
    }

    return html;
  }

  function renderAchievementCards(achievements) {
    return `
      <div class="xfp-achievement-grid">
        ${achievements.map(achievement => {
          const unlocked = isUnlocked(achievement.id);

          return `
            <article class="xfp-achievement ${
              unlocked ? "is-unlocked" : "is-locked"
            }">
              <div class="xfp-achievement-icon">
                ${unlocked ? escapeHTML(achievement.icon || "✦") : "?"}
              </div>

              <div class="xfp-achievement-info">
                <span class="xfp-achievement-rarity">
                  ${escapeHTML(achievement.rarity || "ARCHIVE")}
                </span>

                <h2 class="xfp-achievement-title">
                  ${escapeHTML(
                    unlocked ? achievement.title : "LOGRO BLOQUEADO"
                  )}
                </h2>

                <p class="xfp-achievement-description">
                  ${escapeHTML(
                    unlocked
                      ? achievement.description
                      : "Continúa explorando el archivo para descubrir este logro."
                  )}
                </p>
              </div>

              <span class="xfp-achievement-state">
                ${unlocked ? "UNLOCKED" : "LOCKED"}
              </span>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderAchievements() {
    if (activeSection !== "logros" || !portalElement) return;

    renderSection("logros");
  }

  function updateProgressDisplay() {
    if (!portalElement) return;

    const total = DATA.sections.length;

    const visited = DATA.sections.filter(section =>
      progress.visitedSections.includes(section.id)
    ).length;

    const fill = portalElement.querySelector(".xfp-progress-fill");
    const label = portalElement.querySelector(".xfp-progress-text");

    if (fill) {
      fill.style.width = `${total ? (visited / total) * 100 : 0}%`;
    }

    if (label) {
      label.textContent = `${visited} / ${total} ARCHIVES`;
    }

    portalElement.querySelectorAll("[data-xfp-section]")
      .forEach(button => {
        const check = button.querySelector(".xfp-nav-check");

        if (check) {
          check.textContent = progress.visitedSections.includes(
            button.dataset.xfpSection
          ) ? "✓" : "";
        }
      });
  }

  function handleKeydown(event) {
    if (
      event.key === "Escape" &&
      portalElement?.classList.contains("is-open")
    ) {
      closePortal();
      return;
    }

    // No activar el código mientras se escribe en un formulario.
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      )
    ) {
      keySequence = [];
      return;
    }

    const key = event.key.length === 1
      ? event.key.toLowerCase()
      : event.key;

    keySequence.push(key);
    keySequence = keySequence.slice(-KONAMI_CODE.length);

    const matches = keySequence.every(
      (pressedKey, index) => pressedKey === KONAMI_CODE[index]
    );

    if (matches && keySequence.length === KONAMI_CODE.length) {
      keySequence = [];
      openPortal();
    }
  }

  document.addEventListener("keydown", handleKeydown);

  // API pública del portal. Conserva las funciones originales.
  window.XFaiderPortal = {
    open: openPortal,
    close: closePortal,

    getProgress: () => JSON.parse(JSON.stringify(progress)),

    resetProgress: () => {
      progress = defaultProgress();
      saveProgress();

      showToast("Progreso del archivo reiniciado.");

      if (portalElement) {
        updateProgressDisplay();
        renderSection(activeSection);
      }
    }
  };
})();
