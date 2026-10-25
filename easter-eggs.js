
/* =========================================
   XFAIDER PORTFOLIO — EASTER EGGS OPTIMIZADOS
   ========================================= */

(() => {
    "use strict";

    const CONFIG = {
        cubeClicksRequired: 5,
        cubeImage: "images/cube_98.png",
        cubeDuration: 3000,
        hackerWord: "XFAIDER",
        particleCount: 28
    };

    const discovered = {
        cube: false,
        hacker: false
    };

    let logoClicks = 0;
    let typedText = "";
    let visualUnlocked = false;
    let hueValue = 0;
    let originalStyles = [];
    let visualLayer = null;
    let rgbBorder = null;
    let terminal = null;
    let toastTimer = null;
    let binaryRain = null;
    let hueFrame = null;
    let pendingHue = 0;

    const colorProperties = [
        "color",
        "background-color",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
        "outline-color",
        "text-decoration-color",
        "column-rule-color"
    ];

    const gradientProperties = [
        "background-image",
        "border-image-source",
        "list-style-image"
    ];

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    /* 1. NOTIFICACIONES SECRETAS */

    function showToast(message) {
        let toast = $(".xf-secret-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "xf-secret-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("is-visible");

        clearTimeout(toastTimer);

        toastTimer = window.setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 3000);
    }

    /* 2. CONTENEDOR DEL PORTAFOLIO */

    function findPortfolioContainer() {
        const selectors = [
            "#app",
            "#page",
            "#website",
            "#site-wrapper",
            "#site-container",
            ".site-wrapper",
            ".site-container",
            ".page-wrapper",
            ".page-container",
            ".container-principal",
            ".main-container",
            ".portfolio-container",
            ".wrapper",
            ".pagina"
        ];

        for (const selector of selectors) {
            const element = $(selector);

            if (element && element !== document.body) {
                return element;
            }
        }

        const header = $("header, nav, .navbar");
        const main = $("main, #main-content, .main-content");

        if (header && main) {
            let ancestor = header;

            while (ancestor && !ancestor.contains(main)) {
                ancestor = ancestor.parentElement;
            }

            if (
                ancestor &&
                ancestor !== document.body &&
                ancestor !== document.documentElement
            ) {
                return ancestor;
            }
        }

        return document.body.firstElementChild || document.body;
    }

    function createRgbBorder() {
        if (rgbBorder) return;

        const host = findPortfolioContainer();
        host.classList.add("xf-rgb-host");

        if (getComputedStyle(host).position === "static") {
            host.style.position = "relative";
            host.dataset.xfAddedPosition = "true";
        }

        rgbBorder = document.createElement("div");
        rgbBorder.className = "xf-rgb-border";
        rgbBorder.setAttribute("aria-hidden", "true");

        host.prepend(rgbBorder);
    }

    /* 3. SECRETO DEL CUBO */

    function createCubeSecret() {
        if ($(".xf-cube-overlay")) return;

        const overlay = document.createElement("div");
        overlay.className = "xf-cube-overlay";

        const image = document.createElement("img");
        image.src = CONFIG.cubeImage;
        image.alt = "Secreto del cubo de XFaider";

        overlay.appendChild(image);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add("is-visible");
        });

        window.setTimeout(() => {
            overlay.classList.remove("is-visible");

            window.setTimeout(() => {
                overlay.remove();
            }, 500);
        }, CONFIG.cubeDuration);
    }

    function discoverCube() {
        if (discovered.cube) return;

        discovered.cube = true;

        createCubeSecret();
        showToast("¡Secreto del cubo descubierto!");
        updateUnlockStatus();
    }

    /* 4. CAMBIO DE TONO RGB */

    function rotateColor(color, degrees) {
        const match = color.match(
            /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i
        );

        if (!match) return color;

        let r = Number(match[1]) / 255;
        let g = Number(match[2]) / 255;
        let b = Number(match[3]) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        const lightness = (max + min) / 2;

        let h = 0;
        let s = 0;

        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * lightness - 1));

            if (max === r) {
                h = 60 * (((g - b) / delta) % 6);
            } else if (max === g) {
                h = 60 * ((b - r) / delta + 2);
            } else {
                h = 60 * ((r - g) / delta + 4);
            }
        }

        h = ((h + degrees) % 360 + 360) % 360;

        const c = (1 - Math.abs(2 * lightness - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = lightness - c / 2;

        let rp = 0;
        let gp = 0;
        let bp = 0;

        if (h < 60) [rp, gp, bp] = [c, x, 0];
        else if (h < 120) [rp, gp, bp] = [x, c, 0];
        else if (h < 180) [rp, gp, bp] = [0, c, x];
        else if (h < 240) [rp, gp, bp] = [0, x, c];
        else if (h < 300) [rp, gp, bp] = [x, 0, c];
        else [rp, gp, bp] = [c, 0, x];

        const rr = Math.round((rp + m) * 255);
        const gg = Math.round((gp + m) * 255);
        const bb = Math.round((bp + m) * 255);
        const alpha = match[4];

        return alpha !== undefined
            ? `rgba(${rr}, ${gg}, ${bb}, ${alpha})`
            : `rgb(${rr}, ${gg}, ${bb})`;
    }

    function rotateGradient(value, degrees) {
        if (!value || value === "none") return value;

        return value.replace(
            /rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+(?:\s*[,/]\s*[\d.]+%?)?\s*\)/gi,
            (color) => rotateColor(color, degrees)
        );
    }

    function isExcludedElement(element) {
        if (element.matches(
            "img, svg, canvas, video, iframe, picture, source, " +
            "script, style, link, meta, head"
        )) {
            return true;
        }

        return Boolean(
            element.closest(
                ".xf-terminal, .xf-secret-toast, .xf-cube-overlay, " +
                ".xf-visual-controls, .xf-visual-layer, .xf-rgb-border"
            )
        );
    }

    function capturePageStyles() {
        originalStyles = [];

        document.querySelectorAll("body *").forEach((element) => {
            if (isExcludedElement(element)) return;

            const computed = getComputedStyle(element);
            const savedProperties = {};

            colorProperties.forEach((property) => {
                savedProperties[property] = {
                    inline: element.style.getPropertyValue(property),
                    priority: element.style.getPropertyPriority(property),
                    computed: computed.getPropertyValue(property)
                };
            });

            gradientProperties.forEach((property) => {
                savedProperties[property] = {
                    inline: element.style.getPropertyValue(property),
                    priority: element.style.getPropertyPriority(property),
                    computed: computed.getPropertyValue(property)
                };
            });

            originalStyles.push({
                element,
                properties: savedProperties
            });
        });
    }

    function applyPageHue(degrees) {
        hueValue = Number(degrees) || 0;

        originalStyles.forEach(({ element, properties }) => {
            if (!element.isConnected) return;

            Object.entries(properties).forEach(([property, saved]) => {
                const original = saved.computed;

                if (colorProperties.includes(property)) {
                    element.style.setProperty(
                        property,
                        rotateColor(original, hueValue)
                    );
                } else if (gradientProperties.includes(property)) {
                    element.style.setProperty(
                        property,
                        rotateGradient(original, hueValue)
                    );
                }
            });
        });
    }

    // Agrupa los cambios del deslizador a un máximo por cuadro visual.
    function schedulePageHue(degrees) {
        pendingHue = Number(degrees) || 0;

        if (hueFrame !== null) return;

        hueFrame = requestAnimationFrame(() => {
            hueFrame = null;
            applyPageHue(pendingHue);
        });
    }

    function restorePageStyles() {
        if (hueFrame !== null) {
            cancelAnimationFrame(hueFrame);
            hueFrame = null;
        }

        originalStyles.forEach(({ element, properties }) => {
            if (!element.isConnected) return;

            Object.entries(properties).forEach(([property, saved]) => {
                if (saved.inline) {
                    element.style.setProperty(
                        property,
                        saved.inline,
                        saved.priority
                    );
                } else {
                    element.style.removeProperty(property);
                }
            });
        });

        originalStyles = [];
        hueValue = 0;
    }

    /* 5. PARTÍCULAS DEL DESBLOQUEO VISUAL */

    function createVisualLayer() {
        if (visualLayer) return;

        visualLayer = document.createElement("div");
        visualLayer.className = "xf-visual-layer";
        visualLayer.setAttribute("aria-hidden", "true");

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement("span");
            particle.className = "xf-particle";

            particle.style.setProperty(
                "--particle-x",
                `${Math.random() * 100}%`
            );

            particle.style.setProperty(
                "--particle-y",
                `${Math.random() * 100}%`
            );

            particle.style.setProperty(
                "--particle-delay",
                `${Math.random() * -10}s`
            );

            particle.style.setProperty(
                "--particle-duration",
                `${4 + Math.random() * 7}s`
            );

            visualLayer.appendChild(particle);
        }

        document.body.appendChild(visualLayer);
    }

    function createVisualControls() {
        if ($(".xf-visual-controls")) return;

        const controls = document.createElement("div");
        controls.className = "xf-visual-controls";
        controls.setAttribute(
            "aria-label",
            "Controles visuales secretos"
        );

        const label = document.createElement("label");
        label.htmlFor = "xf-color-slider";
        label.textContent = "RGB";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.id = "xf-color-slider";
        slider.min = "0";
        slider.max = "360";
        slider.step = "1";
        slider.value = "0";
        slider.title = "Cambiar los colores de la interfaz";
        slider.setAttribute(
            "aria-label",
            "Tono de color de la interfaz"
        );

        const value = document.createElement("span");
        value.className = "xf-color-value";
        value.textContent = "0°";

        slider.addEventListener("input", () => {
            value.textContent = `${slider.value}°`;
            schedulePageHue(slider.value);
        });

        controls.append(label, slider, value);

        const nav = $("nav, .navbar, header");

        if (nav) {
            nav.appendChild(controls);
        } else {
            document.body.appendChild(controls);
        }
    }

    function activateVisualSecrets() {
        if (visualUnlocked) return;

        visualUnlocked = true;
        document.body.classList.add("visual-unlocked");

        createRgbBorder();
        createVisualLayer();
        createVisualControls();

        const controls = $(".xf-visual-controls");

        if (controls) {
            controls.classList.add("is-unlocked");
        }

        if (visualLayer) {
            visualLayer.classList.add("is-active");
        }

        capturePageStyles();
        showToast("¡Todos los secretos desbloqueados!");
    }

    function updateUnlockStatus() {
        if (discovered.cube && discovered.hacker) {
            activateVisualSecrets();
        }
    }

    /* 6. TERMINAL SECRETA */

    function appendTerminalLine(message, type = "") {
        if (!terminal) return;

        const output = $(".xf-terminal-output", terminal);
        if (!output) return;

        const line = document.createElement("div");
        line.className = `xf-terminal-line ${type}`.trim();
        line.textContent = message;

        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function createTerminal() {
        if (terminal) {
            terminal.classList.add("is-open");
            return;
        }

        terminal = document.createElement("section");
        terminal.className = "xf-terminal";
        terminal.setAttribute("aria-label", "Terminal secreta");

        const header = document.createElement("div");
        header.className = "xf-terminal-header";

        const title = document.createElement("span");
        title.textContent = "XFAIDER // ACCESS TERMINAL";

        const close = document.createElement("button");
        close.type = "button";
        close.className = "xf-terminal-close";
        close.textContent = "×";
        close.setAttribute("aria-label", "Cerrar terminal");

        close.addEventListener("click", () => {
            terminal.classList.remove("is-open");
        });

        header.append(title, close);

        const output = document.createElement("div");
        output.className = "xf-terminal-output";

        const inputRow = document.createElement("form");
        inputRow.className = "xf-terminal-input-row";

        const prompt = document.createElement("span");
        prompt.textContent = ">";

        const input = document.createElement("input");
        input.className = "xf-terminal-input";
        input.type = "text";
        input.placeholder = "Escribe un comando...";
        input.autocomplete = "off";
        input.spellcheck = false;
        input.setAttribute("aria-label", "Comando de terminal");

        inputRow.append(prompt, input);
        terminal.append(header, output, inputRow);
        document.body.appendChild(terminal);

        inputRow.addEventListener("submit", (event) => {
            event.preventDefault();

            const command = input.value.trim().toLowerCase();

            if (!command) return;

            appendTerminalLine(`> ${command}`);

            if (command === "help") {
                appendTerminalLine(
                    "Comandos: help, status, clear, close"
                );
            } else if (command === "status") {
                appendTerminalLine(
                    `Cubo: ${discovered.cube ? "ENCONTRADO" : "PENDIENTE"} | ` +
                    `XFAIDER: ${discovered.hacker ? "ENCONTRADO" : "PENDIENTE"}`
                );
            } else if (command === "clear") {
                output.replaceChildren();
            } else if (command === "close") {
                terminal.classList.remove("is-open");
            } else {
                appendTerminalLine(
                    "Comando no reconocido. Escribe help.",
                    "error"
                );
            }

            input.value = "";
        });

        appendTerminalLine("Conexión establecida.");
        appendTerminalLine("Bienvenido, visitante.");
        appendTerminalLine("Escribe help para ver los comandos.");
    }

    /* 7. LLUVIA BINARIA — REDUCIDA */

    function createBinaryRain() {
        if (binaryRain) return;

        binaryRain = document.createElement("div");
        binaryRain.className = "xf-binary-rain";
        binaryRain.setAttribute("aria-hidden", "true");

        const columns = Math.min(
            20,
            Math.max(10, Math.floor(window.innerWidth / 70))
        );

        for (let i = 0; i < columns; i++) {
            const column = document.createElement("div");
            column.className = "xf-binary-column";

            let sequence = "";

            for (let j = 0; j < 16; j++) {
                sequence += Math.random() > 0.5 ? "1" : "0";

                if (j < 15) {
                    sequence += "\n";
                }
            }

            column.textContent = sequence;
            column.style.left = `${(i / columns) * 100}%`;
            column.style.animationDuration =
                `${5 + Math.random() * 9}s`;
            column.style.animationDelay =
                `${Math.random() * -12}s`;

            column.style.setProperty(
                "--binary-opacity",
                `${0.25 + Math.random() * 0.55}`
            );

            binaryRain.appendChild(column);
        }

        document.body.appendChild(binaryRain);
    }

    function discoverHacker() {
        if (discovered.hacker) {
            createTerminal();
            return;
        }

        discovered.hacker = true;

        document.body.classList.add("hacker-mode");

        createBinaryRain();
        createTerminal();

        appendTerminalLine(
            "Identidad XFAIDER confirmada.",
            "success"
        );

        showToast("Secreto hacker descubierto.");
        updateUnlockStatus();
    }

    /* 8. DETECCIÓN DE LA PALABRA SECRETA */

    function handleKeyboard(event) {
        if (
            event.ctrlKey ||
            event.altKey ||
            event.metaKey ||
            event.key.length !== 1
        ) {
            return;
        }

        const target = event.target;

        if (
            target instanceof HTMLElement &&
            target.closest(
                "input, textarea, select, [contenteditable='true']"
            )
        ) {
            return;
        }

        typedText = (typedText + event.key).toUpperCase();

        if (typedText.length > CONFIG.hackerWord.length) {
            typedText = typedText.slice(-CONFIG.hackerWord.length);
        }

        if (typedText === CONFIG.hackerWord) {
            discoverHacker();
            typedText = "";
        }
    }

    /* 9. DETECCIÓN DE CLICS EN EL LOGO */

    function handleLogoClick(event) {
        const target = event.target;

        if (!(target instanceof Element)) return;

        const logo = target.closest(
            "[data-xfaider-logo], .logo, .navbar-brand, " +
            "header img, nav img, img[src*='logo']"
        );

        if (!logo) return;

        logoClicks++;

        if (logoClicks >= CONFIG.cubeClicksRequired) {
            logoClicks = 0;
            discoverCube();
        }
    }

    /* 10. INICIALIZACIÓN */

    function init() {
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("click", handleLogoClick);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }
})();
