/* XFaider Portfolio — Avisos JSON bilingües */
(() => {
    "use strict";

    const center = document.getElementById("noticeCenter");
    const toggle = document.getElementById("noticeToggle");
    const panel = document.getElementById("noticePanel");
    const closeButton = document.getElementById("noticeClose");
    const list = document.getElementById("noticeList");
    const unreadDot = document.getElementById("noticeUnreadDot");

    if (!center || !toggle || !panel || !list) return;

    const isEnglish = () => document.getElementById("lang-en")?.checked;

    const getLanguage = () => isEnglish() ? "en" : "es";

    // Obtiene el texto del idioma activo.
    // También permite avisos antiguos que tengan texto simple.
    function getText(value, fallback = "") {
        if (typeof value === "string") return value;

        if (value && typeof value === "object") {
            return value[getLanguage()] || value.es || value.en || fallback;
        }

        return fallback;
    }

    const copyLabels = () => ({
        copy: isEnglish() ? "Copy GD ID" : "Copiar ID de GD",
        copied: isEnglish() ? "ID copied!" : "¡ID copiada!",
        link: isEnglish() ? "Open link ↗" : "Abrir enlace ↗",
        empty: isEnglish()
            ? "No updates yet. Check back soon!"
            : "Aún no hay avisos. ¡Vuelve pronto!",
        error: isEnglish()
            ? "Updates couldn't be loaded."
            : "No se pudieron cargar los avisos.",
        toast: isEnglish()
            ? "Copied to clipboard"
            : "ID copiada al portapapeles"
    });

    function openPanel() {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        unreadDot.hidden = true;
    }

    function closePanel() {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
        panel.hidden ? openPanel() : closePanel();
    });

    closeButton?.addEventListener("click", closePanel);

    document.addEventListener("click", (event) => {
        if (!center.contains(event.target)) closePanel();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePanel();
            toggle.focus();
        }
    });

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function showToast(message) {
        document.querySelector(".notice-toast")?.remove();

        const toast = makeElement("div", "notice-toast", message);
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);

        window.setTimeout(() => toast.remove(), 2200);
    }

    async function copyLevelId(levelId, button) {
        const labels = copyLabels();

        try {
            await navigator.clipboard.writeText(String(levelId));
        } catch {
            const field = document.createElement("textarea");

            field.value = String(levelId);
            field.style.position = "fixed";
            field.style.opacity = "0";

            document.body.appendChild(field);
            field.select();

            const copied = document.execCommand("copy");
            field.remove();

            if (!copied) {
                showToast(
                    isEnglish()
                        ? "Copy failed. Please copy it manually."
                        : "No se pudo copiar. Copia la ID manualmente."
                );
                return;
            }
        }

        button.textContent = labels.copied;
        showToast(labels.toast);

        window.setTimeout(() => {
            if (button.isConnected) {
                button.textContent = copyLabels().copy;
            }
        }, 1800);
    }

    function renderNotice(notice) {
        const card = makeElement("article", "notice-card");

        const title = getText(
            notice.titulo,
            isEnglish() ? "Update" : "Aviso"
        );

        const description = getText(notice.descripcion);

        if (notice.imagen) {
            const image = makeElement("img", "notice-card-image");

            image.src = notice.imagen;
            image.alt = title || "XFaider update";
            image.loading = "lazy";
            image.onerror = () => image.remove();

            card.appendChild(image);
        }

        const content = makeElement("div", "notice-card-content");
        const topline = makeElement("div", "notice-card-topline");

        const typeText = notice.tipo || "update";

        const typeLabel = isEnglish()
            ? ({
                nivel: "LEVEL",
                video: "VIDEO",
                stream: "STREAM"
            }[typeText] || "UPDATE")
            : ({
                nivel: "NIVEL",
                video: "VIDEO",
                stream: "STREAM"
            }[typeText] || "AVISO");

        topline.appendChild(
            makeElement("span", "notice-type", typeLabel)
        );

        if (notice.fecha) {
            topline.appendChild(
                makeElement("time", "notice-date", notice.fecha)
            );
        }

        content.appendChild(topline);
        content.appendChild(makeElement("h3", "", title));

        if (description) {
            content.appendChild(
                makeElement("p", "notice-card-description", description)
            );
        }

        const actions = makeElement("div", "notice-card-actions");

        if (
            notice.gdId !== undefined &&
            notice.gdId !== null &&
            String(notice.gdId).trim() !== ""
        ) {
            const copyButton = makeElement(
                "button",
                "notice-action primary",
                copyLabels().copy
            );

            copyButton.type = "button";

            copyButton.addEventListener("click", () => {
                copyLevelId(notice.gdId, copyButton);
            });

            actions.appendChild(copyButton);
        }

        if (notice.link) {
            const link = makeElement(
                "a",
                "notice-action",
                copyLabels().link
            );

            link.href = notice.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            actions.appendChild(link);
        }

        if (actions.childElementCount) {
            content.appendChild(actions);
        }

        card.appendChild(content);

        return card;
    }

    async function loadNotices() {
        try {
            const response = await fetch("avisos.json", {
                cache: "no-cache"
            });

            if (!response.ok) {
                throw new Error("Could not fetch avisos.json");
            }

            const data = await response.json();

            const notices = Array.isArray(data)
                ? data
                : Array.isArray(data.avisos)
                    ? data.avisos
                    : [];

            notices.sort((a, b) =>
                String(b.fecha || "").localeCompare(String(a.fecha || ""))
            );

            list.replaceChildren();

            if (!notices.length) {
                list.appendChild(
                    makeElement("p", "notice-empty", copyLabels().empty)
                );
                return;
            }

            notices.forEach((notice) => {
                list.appendChild(renderNotice(notice));
            });

            unreadDot.hidden = false;
        } catch (error) {
            console.error(error);

            list.replaceChildren(
                makeElement("p", "notice-empty", copyLabels().error)
            );
        }
    }

    // Actualiza los avisos cuando se cambia el idioma.
    document.querySelectorAll('input[name="language"]').forEach((input) => {
        input.addEventListener("change", loadNotices);
    });

    loadNotices();
})();