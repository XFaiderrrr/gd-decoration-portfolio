
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
