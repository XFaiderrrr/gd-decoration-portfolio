
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // CONFIGURACIÓN DE LA GALERÍA XFAIDER
    // ==========================================

    const projectImages = [
        ...document.querySelectorAll(".project-image img")
    ];

    if (projectImages.length === 0) {
        console.warn(
            "Galería XFaider: no se encontraron imágenes con el selector .project-image img"
        );
        return;
    }

    // Obtener la información de cada proyecto.
    const items = projectImages.map((img) => {
        const card = img.closest(
            ".project-card, .project-item, article"
        );

        const link = img.closest("a");

        return {
            src: img.currentSrc || img.src,
            alt: img.alt || "Imagen del proyecto XFaider",
            title:
                card?.querySelector("h2, h3, h4")?.textContent.trim() ||
                img.alt ||
                "Proyecto XFaider",
            link: link?.href || null
        };
    });

    // ==========================================
    // CREAR LA VENTANA DE LA GALERÍA
    // ==========================================

    const modal = document.createElement("div");

    modal.className = "gallery-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
        <button
            class="gallery-close"
            aria-label="Cerrar galería"
            type="button"
        >
            ×
        </button>

        <button
            class="gallery-arrow gallery-prev"
            aria-label="Imagen anterior"
            type="button"
        >
            ‹
        </button>

        <div class="gallery-content">
            <img
                class="gallery-main-image"
                src=""
                alt=""
            >

            <h2 class="gallery-title"></h2>

            <p class="gallery-counter"></p>

            <a
                class="gallery-project-link"
                href="#contacto"
            >
                <span class="gallery-es">
                    Ver enlace del proyecto
                </span>

                <span class="gallery-en">
                    Open project link
                </span>
            </a>
        </div>

        <button
            class="gallery-arrow gallery-next"
            aria-label="Imagen siguiente"
            type="button"
        >
            ›
        </button>
    `;

    document.body.appendChild(modal);

    // ==========================================
    // REFERENCIAS A LOS ELEMENTOS
    // ==========================================

    const mainImage = modal.querySelector(".gallery-main-image");
    const title = modal.querySelector(".gallery-title");
    const counter = modal.querySelector(".gallery-counter");

    const closeButton = modal.querySelector(".gallery-close");
    const prevButton = modal.querySelector(".gallery-prev");
    const nextButton = modal.querySelector(".gallery-next");

    const projectLink = modal.querySelector(".gallery-project-link");

    // ==========================================
    // VARIABLES DE CONTROL
    // ==========================================

    let currentIndex = 0;
    let previousOverflow = "";
    let galleryIsOpen = false;

    // ==========================================
    // MOSTRAR UNA IMAGEN
    // ==========================================

    function renderImage() {
        const item = items[currentIndex];

        mainImage.src = item.src;
        mainImage.alt = item.alt;

        title.textContent = item.title;

        counter.textContent =
            `${currentIndex + 1} / ${items.length}`;

        // Desactivar las flechas si solo hay una imagen.
        prevButton.disabled = items.length < 2;
        nextButton.disabled = items.length < 2;

        // Conservar el enlace original de cada proyecto.
        if (item.link) {
            projectLink.href = item.link;
            projectLink.hidden = false;
        } else {
            projectLink.hidden = true;
        }
    }

    // ==========================================
    // ABRIR LA GALERÍA
    // ==========================================

    function openGallery(index) {
        if (galleryIsOpen) return;

        currentIndex = index;
        galleryIsOpen = true;

        // Guardar el estado actual del desplazamiento.
        previousOverflow = document.body.style.overflow;

        // Evitar que la página se desplace detrás de la galería.
        document.body.style.overflow = "hidden";

        // ACTIVAR EL CURSOR NORMAL DEL SISTEMA.
        document.body.classList.add("gallery-cursor-normal");

        renderImage();

        modal.classList.add("gallery-open");
        modal.setAttribute("aria-hidden", "false");

        closeButton.focus();
    }

    // ==========================================
    // CERRAR LA GALERÍA
    // ==========================================

    function closeGallery() {
        if (!galleryIsOpen) return;

        galleryIsOpen = false;

        modal.classList.remove("gallery-open");
        modal.setAttribute("aria-hidden", "true");

        // Restaurar el desplazamiento original.
        document.body.style.overflow = previousOverflow;

        // RESTAURAR EL CURSOR PERSONALIZADO.
        document.body.classList.remove("gallery-cursor-normal");
    }

    // ==========================================
    // CAMBIAR DE IMAGEN
    // ==========================================

    function changeImage(direction) {
        if (!galleryIsOpen || items.length < 2) return;

        currentIndex =
            (currentIndex + direction + items.length) % items.length;

        renderImage();
    }

    // ==========================================
    // ACTIVAR LA GALERÍA EN LAS TARJETAS
    // ==========================================

    projectImages.forEach((img, index) => {
        img.style.cursor = "zoom-in";

        img.addEventListener("click", (event) => {
            // Evitar que el enlace original se abra al pulsar la imagen.
            event.preventDefault();

            openGallery(index);
        });
    });

    // ==========================================
    // BOTONES DE NAVEGACIÓN Y CIERRE
    // ==========================================

    closeButton.addEventListener("click", closeGallery);

    prevButton.addEventListener("click", () => {
        changeImage(-1);
    });

    nextButton.addEventListener("click", () => {
        changeImage(1);
    });

    // Cerrar al pulsar el fondo oscuro.
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeGallery();
        }
    });

    // ==========================================
    // CONTROLES DEL TECLADO
    // ==========================================

    document.addEventListener("keydown", (event) => {
        if (!galleryIsOpen) return;

        if (event.key === "Escape") {
            closeGallery();
        }

        if (event.key === "ArrowLeft") {
            changeImage(-1);
        }

        if (event.key === "ArrowRight") {
            changeImage(1);
        }
    });

    console.log(
        `Galería XFaider inicializada con ${items.length} imágenes.`
    );
});
