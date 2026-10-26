/* =====================================================
   XFAIDER LANGUAGE SYSTEM — ES / EN
   Traduce contenido estático y contenido dinámico del portal.
   No reemplaza ni modifica las animaciones del sitio.
   ===================================================== */
(() => {
  "use strict";

  const esRadio = document.getElementById("lang-es");
  const enRadio = document.getElementById("lang-en");
  if (!esRadio || !enRadio) return;

  const translations = {
    // Intro y botones sin pares lang-es/lang-en
    "Decoración y glow.": "Decoration and glow.",
    "Ver Preview": "Watch Preview",
    "Carrusel de imágenes del nivel Hider": "Hider level image carousel",
    "No se encontraron collabs.": "No collaborations found.",
    "No hay colaboraciones en esta categoría por ahora.": "There are no collaborations in this category yet.",
    "TERMINADOS": "COMPLETED",
    "EN PROCESO": "IN PROGRESS",
    "SIN EMPEZAR": "NOT STARTED",
    "COMPLETADOS": "COMPLETED",
    "ACTIVOS": "ACTIVE",
    "PENDIENTES": "PENDING",
    "Buscar nivel o equipo...": "Search level or team...",
    "Buscar nivel o equipo": "Search level or team",
    "LEVEL": "LEVEL",
    "HOST / TEAM": "HOST / TEAM",
    "Collabs terminados": "Completed collabs",
    "Collabs en proceso": "Collabs in progress",
    "Collabs sin empezar": "Collabs not started",
    "XFAIDER // COLLAB DATABASE": "XFAIDER // COLLAB DATABASE",

    // Portal: interfaz
    "ARCHIVO SECRETO DEL CREADOR": "SECRET CREATOR ARCHIVE",
    "ARCHIVE ONLINE": "ARCHIVE ONLINE",
    "DIRECTORY": "DIRECTORY",
    "EXPLORATION PROGRESS": "EXPLORATION PROGRESS",
    "ROOT / ARCHIVE": "ROOT / ARCHIVE",
    "XA // PRIVATE CREATOR DATABASE": "XA // PRIVATE CREATOR DATABASE",
    "CONNECTION SECURE": "CONNECTION SECURE",
    "ARCHIVE ENTRY": "ARCHIVE ENTRY",
    "LOGRO DESBLOQUEADO": "ACHIEVEMENT UNLOCKED",
    "Primer acceso": "First Access",
    "Progreso del archivo reiniciado.": "Archive progress reset.",
    "Cerrar galería": "Close gallery",
    "Cerrar el portal": "Close portal",
    "Cerrar (Escape)": "Close (Escape)",
    "Ver enlace del proyecto": "Open project link",
    "Imagen anterior": "Previous image",
    "Imagen siguiente": "Next image",

    // Portal: secciones
    "Origen": "Origins",
    "Proyectos antiguos": "Past Projects",
    "Logros": "Achievements",
    "Archivos perdidos": "Lost Files",
    "Mensaje final": "Final Message",
    "THE BEGINNING": "THE BEGINNING",
    "CREATIVE DATABASE": "CREATIVE DATABASE",
    "ACHIEVEMENT DATABASE": "ACHIEVEMENT DATABASE",
    "RECOVERED FRAGMENTS": "RECOVERED FRAGMENTS",
    "MESSAGE FROM THE CREATOR": "MESSAGE FROM THE CREATOR",
    "Toda creación comienza con una idea.": "Every creation begins with an idea.",
    "Detrás de cada proyecto hay una historia: ideas, pruebas, errores y muchas ganas de crear algo propio.": "Behind every project there is a story: ideas, experiments, mistakes, and a strong desire to create something of your own.",
    "Este archivo reúne parte del recorrido de XFaider como creador. Es un espacio para conservar los inicios, recordar los experimentos y mostrar cómo evoluciona cada idea con el tiempo.": "This archive brings together part of XFaider's journey as a creator. It preserves the beginnings, remembers experiments, and shows how each idea evolves over time.",
    "ARCHIVO ABIERTO // LA HISTORIA CONTINÚA": "ARCHIVE OPEN // THE STORY CONTINUES",
    "Proyectos que forman parte del recorrido creativo.": "Projects that are part of the creative journey.",
    "Nivel de Geometry Dash creado por XFaider junto con Hikex. Una propuesta glow con una atmósfera mecánica y una identidad visual propia.": "A Geometry Dash level created by XFaider and Hikex. A glow project with a mechanical atmosphere and its own visual identity.",
    "PROYECTO DESTACADO": "FEATURED PROJECT",
    "Cada logro representa algo que aprendiste, creaste o superaste.": "Every achievement represents something you learned, created, or overcame.",
    "Primer acceso": "First Access",
    "Encontraste el archivo secreto de XFaider.": "You found XFaider's secret archive.",
    "Mente creativa": "Creative Mind",
    "Exploraste la sección de origen.": "You explored the origins section.",
    "Explorador de proyectos": "Project Explorer",
    "Consultaste el archivo de proyectos.": "You checked the project archive.",
    "Guardián de recuerdos": "Memory Keeper",
    "Visitaste la sección de archivos perdidos.": "You visited the lost files section.",
    "Archivo completo": "Complete Archive",
    "Exploraste todas las secciones del portal.": "You explored every section of the portal.",
    "Continúa explorando el archivo para descubrir este logro.": "Keep exploring the archive to discover this achievement.",
    "COMÚN": "COMMON",
    "ESPECIAL": "SPECIAL",
    "RARO": "RARE",
    "ÉPICO": "EPIC",
    "UNLOCKED": "UNLOCKED",
    "LOCKED": "LOCKED",
    "UNLOCKED": "UNLOCKED",
    "IDEAS": "IDEAS",
    "DISEÑOS": "DESIGNS",
    "RECUERDOS": "MEMORIES",
    "ESPERANDO RECUPERACIÓN": "AWAITING RECOVERY",
    "Un espacio para guardar conceptos, ideas descartadas y proyectos que quizá algún día vuelvan a la vida.": "A place to store concepts, discarded ideas, and projects that might come back to life one day.",
    "Logotipos antiguos, pruebas visuales, bocetos y versiones anteriores de tus creaciones.": "Old logos, visual tests, sketches, and previous versions of your creations.",
    "Capturas, momentos importantes y pequeñas historias que forman parte del camino.": "Screenshots, important moments, and small stories that are part of the journey.",
    "Ideas, bocetos y recuerdos que merecen una segunda oportunidad.": "Ideas, sketches, and memories that deserve a second chance.",
    "Una última transmisión antes de abandonar el archivo.": "One last transmission before leaving the archive.",
    "Si llegaste hasta aquí, encontraste algo que normalmente permanece oculto.": "If you made it this far, you've found something that usually remains hidden.",
    "Los proyectos cambian, las ideas evolucionan y algunas creaciones quedan atrás. Pero cada intento deja algo que vale la pena conservar.": "Projects change, ideas evolve, and some creations are left behind. But every attempt leaves something worth preserving.",
    "Esto no es el final del recorrido. Es solamente otra versión de lo que está por venir.": "This is not the end of the journey. It is just another version of what is yet to come.",
    "END OF TRANSMISSION // TO BE CONTINUED": "END OF TRANSMISSION // TO BE CONTINUED",
    "Mensaje final": "Final Message",
    "— XFAIDER": "— XFAIDER",

    // Portal: botones, estados y mensajes comunes
    "ARCHIVED": "ARCHIVED",
    "ESTADO DEL PROYECTO": "PROJECT STATUS",
    "LOGRO BLOQUEADO": "ACHIEVEMENT LOCKED",
    "Continúa explorando el archivo para descubrir este logro.": "Keep exploring the archive to discover this achievement.",
    "PROYECTO DESTACADO · EN DESARROLLO": "FEATURED PROJECT · IN DEVELOPMENT",
    "EN DESARROLLO": "IN DEVELOPMENT",
    "Creador": "Creator",
    "Buscar": "Search",
    "Cerrar": "Close"
  };

  const reverseTranslations = {};
  Object.entries(translations).forEach(([es, en]) => {
    if (!(en in reverseTranslations)) reverseTranslations[en] = es;
  });

  function getLanguage() {
    return enRadio.checked ? "en" : "es";
  }

  function translateValue(value, language) {
    const trimmed = value.trim();
    if (!trimmed) return value;
    const translated = language === "en"
      ? (translations[trimmed] ?? trimmed)
      : (reverseTranslations[trimmed] ?? trimmed);
    if (translated === trimmed) return value;
    const start = value.match(/^\s*/)?.[0] ?? "";
    const end = value.match(/\s*$/)?.[0] ?? "";
    return start + translated + end;
  }

  function translateDynamicContent(root = document) {
    const language = getLanguage();

    // Intro usa clases propias, independientes de .lang-es/.lang-en.
    document.querySelectorAll(".intro-es").forEach(el => {
      el.style.display = language === "es" ? "inline" : "none";
    });
    document.querySelectorAll(".intro-en").forEach(el => {
      el.style.display = language === "en" ? "inline" : "none";
    });

    // Actualiza textos de nodos dinámicos sin tocar los pares de idioma del HTML.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".lang-es, .lang-en, script, style, textarea, input")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = translateValue(node.nodeValue, language);
    });

    // Atributos accesibles y placeholders.
    document.querySelectorAll("[placeholder]").forEach(el => {
      const original = el.getAttribute("placeholder");
      el.setAttribute("placeholder", translateValue(original, language));
    });
    document.querySelectorAll("[aria-label]").forEach(el => {
      const original = el.getAttribute("aria-label");
      el.setAttribute("aria-label", translateValue(original, language));
    });
    document.querySelectorAll("[title]").forEach(el => {
      const original = el.getAttribute("title");
      el.setAttribute("title", translateValue(original, language));
    });

    document.documentElement.lang = language;
    document.title = language === "en"
      ? "XFaider | Decoration Portfolio"
      : "XFaider | Decoration Portfolio";
  }

  function applyLanguage() {
    const language = getLanguage();
    document.documentElement.lang = language;
    try { localStorage.setItem("xfaider-language", language); } catch (_) {}
    translateDynamicContent(document);
    window.dispatchEvent(new CustomEvent("xfaider:language-changed", {
      detail: { language }
    }));
  }

  // Recuperar preferencia guardada.
  try {
    const saved = localStorage.getItem("xfaider-language");
    if (saved === "en") enRadio.checked = true;
    if (saved === "es") esRadio.checked = true;
  } catch (_) {}

  esRadio.addEventListener("change", applyLanguage);
  enRadio.addEventListener("change", applyLanguage);

  // El portal se genera al abrirse, así que traducimos sus cambios también.
  const observer = new MutationObserver(() => translateDynamicContent(document));
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLanguage, { once: true });
  } else {
    applyLanguage();
  }
})();