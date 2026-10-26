
/* =========================================
   XFAIDER PORTFOLIO — OPTIMIZED INTERACTIVE EFFECTS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    /* 1. PARTÍCULAS DEL FONDO — OPTIMIZADAS */

    const canvas = document.createElement("canvas");
    canvas.id = "xfaider-particles";
    canvas.setAttribute("aria-hidden", "true");

    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationFrame = null;
    let scrollTimer = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let pageIsScrolling = false;

    const colors = [
        "139, 92, 246",
        "56, 189, 248",
        "180, 154, 255"
    ];

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            speedX: (Math.random() - 0.5) * 0.24,
            speedY: (Math.random() - 0.5) * 0.24,
            alpha: Math.random() * 0.42 + 0.12,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    function drawParticles() {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        for (const particle of particles) {
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${particle.color}, ${particle.alpha})`;

            ctx.fill();
        }
    }

    function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const particleCount = Math.min(
            65,
            Math.max(30, Math.floor((width * height) / 22000))
        );

        particles = Array.from(
            { length: particleCount },
            createParticle
        );

        if (reduceMotion || pageIsScrolling) {
            drawParticles();
        }
    }

    function stopParticles() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }

    function animateParticles() {
        // Impide que se creen varios bucles simultáneos.
        if (
            animationFrame !== null ||
            document.hidden ||
            pageIsScrolling ||
            reduceMotion
        ) {
            return;
        }

        function frame() {
            animationFrame = null;

            if (
                document.hidden ||
                pageIsScrolling ||
                reduceMotion
            ) {
                return;
            }

            ctx.clearRect(0, 0, width, height);

            for (const particle of particles) {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < -5) particle.x = width + 5;
                if (particle.x > width + 5) particle.x = -5;
                if (particle.y < -5) particle.y = height + 5;
                if (particle.y > height + 5) particle.y = -5;

                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(${particle.color}, ${particle.alpha})`;

                ctx.fill();
            }

            animationFrame = requestAnimationFrame(frame);
        }

        animationFrame = requestAnimationFrame(frame);
    }

    function resumeParticles() {
        if (reduceMotion) {
            drawParticles();
            return;
        }

        if (!document.hidden && !pageIsScrolling) {
            animateParticles();
        }
    }

    resizeCanvas();
    resumeParticles();

    window.addEventListener("resize", resizeCanvas, {
        passive: true
    });

    // Pausa el canvas durante el scroll y lo reanuda después.
    window.addEventListener("scroll", () => {
        pageIsScrolling = true;
        stopParticles();

        clearTimeout(scrollTimer);

        scrollTimer = window.setTimeout(() => {
            pageIsScrolling = false;
            resumeParticles();
        }, 150);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopParticles();
        } else {
            resumeParticles();
        }
    });

    /* 2. CURSOR PERSONALIZADO ELIMINADO
       Se utiliza el cursor normal del sistema. */

    /* 3. ANIMACIONES AL ENTRAR EN PANTALLA */

    const revealElements = document.querySelectorAll(
        ".creator-intro-content, .creator-logo-wrap, " +
        ".hider-section .hero-content, .hero-carousel, " +
        ".section-heading, .project-card, .style-card, " +
        ".about-content, .about-decoration, .contact-section > *"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-revealed");
        });
    } else {
        revealElements.forEach((element, index) => {
            element.classList.add("reveal-element");

            element.style.setProperty(
                "--reveal-delay",
                `${(index % 3) * 90}ms`
            );
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    /* 4. EFECTO 3D SUAVE EN LAS TARJETAS — OPTIMIZADO */

    if (finePointer && !reduceMotion) {
        document.querySelectorAll(".project-card").forEach((card) => {
            let rect = null;
            let pointerX = 0;
            let pointerY = 0;
            let tiltFrame = null;

            function updateTilt() {
                tiltFrame = null;

                if (!rect || rect.width === 0 || rect.height === 0) {
                    return;
                }

                const x = (pointerX - rect.left) / rect.width;
                const y = (pointerY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 5;
                const rotateX = (0.5 - y) * 5;

                card.style.setProperty("--tilt-x", `${rotateX}deg`);
                card.style.setProperty("--tilt-y", `${rotateY}deg`);
            }

            card.addEventListener("mouseenter", () => {
                rect = card.getBoundingClientRect();
            });

            card.addEventListener("mousemove", (event) => {
                pointerX = event.clientX;
                pointerY = event.clientY;

                if (tiltFrame === null) {
                    tiltFrame = requestAnimationFrame(updateTilt);
                }
            }, { passive: true });

            card.addEventListener("mouseleave", () => {
                rect = null;

                if (tiltFrame !== null) {
                    cancelAnimationFrame(tiltFrame);
                    tiltFrame = null;
                }

                card.style.setProperty("--tilt-x", "0deg");
                card.style.setProperty("--tilt-y", "0deg");
            });
        });
    }

    /* 5. CARRUSEL AUTOMÁTICO DE HIDER */

    const heroSlides = document.querySelectorAll(".hero-slide");

    if (heroSlides.length > 1) {
        let activeHeroSlide = Array.from(heroSlides).findIndex(
            (slide) => slide.classList.contains("active")
        );

        if (activeHeroSlide < 0) {
            activeHeroSlide = 0;
        }

        heroSlides.forEach((slide, index) => {
            slide.classList.toggle(
                "active",
                index === activeHeroSlide
            );
        });

        if (!reduceMotion) {
            let carouselInterval = null;

            function startCarousel() {
                if (
                    carouselInterval !== null ||
                    document.hidden
                ) {
                    return;
                }

                carouselInterval = window.setInterval(() => {
                    heroSlides[activeHeroSlide].classList.remove("active");

                    activeHeroSlide =
                        (activeHeroSlide + 1) % heroSlides.length;

                    heroSlides[activeHeroSlide].classList.add("active");
                }, 5000);
            }

            function stopCarousel() {
                if (carouselInterval !== null) {
                    clearInterval(carouselInterval);
                    carouselInterval = null;
                }
            }

            startCarousel();

            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    stopCarousel();
                } else {
                    startCarousel();
                }
            });
        }
    }

    /* 6. AÑO ACTUAL AUTOMÁTICO EN EL FOOTER */

    const footerText = document.querySelector(".footer p");

    if (footerText) {
        footerText.textContent =
            `Geometry Dash Decoration Portfolio · ${new Date().getFullYear()}`;
    }
});

/* ==========================================
   XFAIDER COLLAB DASHBOARD
   Abrir, cerrar y cambiar de categoría
   ========================================== */

(() => {
    const dashboard = document.querySelector(".collab-dashboard");
    const panel = document.querySelector(".collab-results");

    if (!dashboard || !panel) return;

    const buttons = [
        ...dashboard.querySelectorAll("[data-collab-tab]")
    ];

    const lists = [
        ...panel.querySelectorAll("[data-collab-list]")
    ];

    const search = panel.querySelector(".collab-search");
    const title = panel.querySelector(".collab-results-title");
    const eyebrow = panel.querySelector(".collab-results-eyebrow");
    const count = panel.querySelector(".collab-results-count");
    const noResults = panel.querySelector(".collab-no-results");
    const emptyMessage = panel.querySelector(".collab-empty-message");

    const states = {
        finished: {
            title: "Collabs terminados",
            eyebrow: "ARCHIVE / 01",
            count: "21 PROJECTS"
        },
        progress: {
            title: "Collabs en proceso",
            eyebrow: "ARCHIVE / 02",
            count: "1 PROJECT"
        },
        "not-started": {
            title: "Collabs sin empezar",
            eyebrow: "ARCHIVE / 03",
            count: "0 PROJECTS"
        }
    };

    let activeCategory = null;

    function filterList() {
        const activeList = lists.find(list => !list.hidden);
        const query = search.value.trim().toLocaleLowerCase();

        let visibleRows = 0;
        let totalRows = 0;

        if (activeList) {
            activeList.querySelectorAll(".collab-row").forEach(row => {
                totalRows++;

                const matches = row.textContent
                    .toLocaleLowerCase()
                    .includes(query);

                row.hidden = !matches;

                if (matches) visibleRows++;
            });
        }

        const categoryIsEmpty = totalRows === 0;

        if (noResults) {
            noResults.hidden = categoryIsEmpty || visibleRows > 0;
        }

        if (emptyMessage) {
            emptyMessage.hidden = !categoryIsEmpty;
        }
    }

    function closePanel() {
        activeCategory = null;
        panel.hidden = true;

        buttons.forEach(button => {
            button.classList.remove("is-selected");
            button.setAttribute("aria-pressed", "false");
        });

        lists.forEach(list => {
            list.hidden = true;
        });

        search.value = "";
    }

    function selectCategory(category) {
        // Pulsar otra vez el mismo cuadro cierra el panel.
        if (activeCategory === category) {
            closePanel();
            return;
        }

        const state = states[category];

        if (!state) return;

        activeCategory = category;

        buttons.forEach(button => {
            const selected = button.dataset.collabTab === category;

            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });

        lists.forEach(list => {
            list.hidden = list.dataset.collabList !== category;
        });

        title.textContent = state.title;
        eyebrow.textContent = state.eyebrow;
        count.textContent = state.count;

        search.value = "";
        panel.hidden = false;

        filterList();
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectCategory(button.dataset.collabTab);
        });
    });

    search.addEventListener("input", filterList);

    // Al entrar solo se muestran los tres cuadros.
    closePanel();
})();
