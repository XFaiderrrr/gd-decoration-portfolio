
document.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("cinematicIntro");

    if (!intro) return;

    // Tiempo que permanece visible la intro.
    const INTRO_DURATION = 4500;

    // Duración del desvanecimiento.
    const FADE_DURATION = 850;

    // Adaptar los textos de la intro al idioma seleccionado.
    const languageES = document.getElementById("lang-es");
    const languageEN = document.getElementById("lang-en");

    function updateIntroLanguage() {
        const isEnglish = Boolean(languageEN && languageEN.checked);
        document.body.classList.toggle("language-en", isEnglish);
    }

    languageES?.addEventListener("change", updateIntroLanguage);
    languageEN?.addEventListener("change", updateIntroLanguage);

    updateIntroLanguage();

    // Mostrar la intro una sola vez por pestaña.
    try {
        if (sessionStorage.getItem("xfaiderIntroSeen") === "yes") {
            intro.style.display = "none";
            intro.setAttribute("aria-hidden", "true");
            intro.inert = true;
            return;
        }
    } catch (error) {
        // La intro funciona aunque el almacenamiento esté bloqueado.
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeIntro() {
        intro.classList.add("intro-exit");
        intro.setAttribute("aria-hidden", "true");
        intro.inert = true;

        document.body.style.overflow = previousOverflow;

        try {
            sessionStorage.setItem("xfaiderIntroSeen", "yes");
        } catch (error) {
            // No impedir el cierre si falla el almacenamiento.
        }

        window.setTimeout(() => {
            intro.style.display = "none";
        }, FADE_DURATION);
    }

    window.setTimeout(closeIntro, INTRO_DURATION);
});
