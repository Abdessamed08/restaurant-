document.addEventListener('DOMContentLoaded', () => {
    // Script de gestion du menu hamburger
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    const heroBackground = document.querySelector('.hero-background');

    hamburger.addEventListener('click', () => {
        navUl.classList.toggle('active');
        hamburger.classList.toggle('active');
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navUl.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Parallax effect for header
    window.addEventListener('scroll', () => {
        if (heroBackground && window.innerWidth >= 769) {
            const scrollPosition = window.scrollY;
            heroBackground.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });

    // Observer pour les animations d'apparition au scroll
    const animatedElements = document.querySelectorAll('.section-title, .section-description, .card, .gallery-item, .plat-item, .form-group, footer, #about .about-content');
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });
    animatedElements.forEach(el => animateObserver.observe(el));

    // Galerie Lightbox et effet de suivi de souris
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');
    let currentImageIndex = 0;

    const openLightbox = (index) => {
        const items = document.querySelectorAll('.gallery-item');
        currentImageIndex = index;
        const item = items[currentImageIndex];
        const fullSizeSrc = item.querySelector('img').dataset.fullSize;
        const captionText = item.querySelector('figcaption').textContent;

        lightbox.classList.add('active');
        lightboxImg.src = fullSizeSrc;
        lightboxImg.alt = captionText;
        lightboxCaption.textContent = captionText;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const showNextImage = () => {
        const items = document.querySelectorAll('.gallery-item');
        currentImageIndex = (currentImageIndex + 1) % items.length;
        openLightbox(currentImageIndex);
    };

    const showPrevImage = () => {
        const items = document.querySelectorAll('.gallery-item');
        currentImageIndex = (currentImageIndex - 1 + items.length) % items.length;
        openLightbox(currentImageIndex);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
        
        // Effet de survol créatif
        const img = item.querySelector('img');
        if (window.innerWidth > 768) {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y / rect.height - 0.5) * 20;
                const rotateY = (x / rect.width - 0.5) * -20;
                img.style.transform = `scale(1.15) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            item.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1.07)';
            });
        }
    });

    if (closeBtn && lightbox && prevBtn && nextBtn) {
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { closeLightbox(); }
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight') { showNextImage(); }
                if (e.key === 'ArrowLeft') { showPrevImage(); }
                if (e.key === 'Escape') { closeLightbox(); }
            }
        });
    }

    // Validation de formulaire améliorée
    const form = document.querySelector('.contact-form');
    if (form) {
        const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea');
        const honeypot = document.getElementById('_honeypot');

        const validateField = (input) => {
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (input.validity.valid) {
                input.classList.remove('invalid');
                input.classList.add('valid');
                errorMessage.textContent = '';
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
                if (input.validity.valueMissing) {
                    errorMessage.textContent = 'Ce champ est obligatoire.';
                } else if (input.validity.typeMismatch) {
                    errorMessage.textContent = 'Veuillez entrer une adresse e-mail valide.';
                } else {
                    errorMessage.textContent = 'Veuillez corriger ce champ.';
                }
            }
        };

        inputs.forEach(input => {
            input.addEventListener('input', () => validateField(input));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Vérification du honeypot pour les bots
            if (honeypot.value !== '') {
                console.log('Spam detected via honeypot.');
                return;
            }

            let isFormValid = true;
            inputs.forEach(input => {
                validateField(input);
                if (!input.validity.valid) { isFormValid = false; }
            });

            if (isFormValid) {
                alert('Votre message a été envoyé avec succès ! Merci de nous avoir contactés.');
                form.reset();
                inputs.forEach(input => { input.classList.remove('valid', 'invalid'); });
            } else {
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) { firstInvalid.focus(); }
            }
        });
    }

    // NOUVEAU : Script pour le bouton "Retour en haut"
    const scrollToTopBtn = document.getElementById("scroll-to-top");

    window.addEventListener('scroll', () => {
        if (scrollToTopBtn) {
            if (window.scrollY > 100) {
                scrollToTopBtn.style.display = "flex";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- Code pour les fonctionnalités de la page Paramètres ---
    
    // 1. Fonctionnalité du mode sombre (Dark Mode)
    const body = document.body;
    const lightModeBtn = document.getElementById('light-mode-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const isSettingsPage = document.getElementById('settings-page');

    // On vérifie s'il y a une préférence sauvegardée et on l'applique
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    } else {
        // Par défaut, on peut mettre le mode clair
        body.classList.add('light-mode');
    }

    // On écoute les clics sur les boutons pour changer de thème
    if (lightModeBtn && darkModeBtn) {
        lightModeBtn.addEventListener('click', () => {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        });

        darkModeBtn.addEventListener('click', () => {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        });
    }

    // 2. Fonctionnalité du sélecteur de langue
    const languageSelect = document.getElementById('language-select');

    if (languageSelect) {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
        }

        languageSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            localStorage.setItem('language', newLang);
            alert("La langue a été changée en " + newLang + " !"); // Vous pouvez remplacer cette alerte par une logique plus avancée
        });
    }

    // 3. Fonctionnalité de l'interrupteur de notifications
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationStatus = document.getElementById('notification-status');

    if (notificationToggle) {
        const savedNotificationStatus = localStorage.getItem('notifications');
        if (savedNotificationStatus) {
            notificationToggle.checked = savedNotificationStatus === 'enabled';
            notificationStatus.textContent = notificationToggle.checked ? 'Activées' : 'Désactivées';
        }

        notificationToggle.addEventListener('change', () => {
            if (notificationToggle.checked) {
                notificationStatus.textContent = 'Activées';
                localStorage.setItem('notifications', 'enabled');
            } else {
                notificationStatus.textContent = 'Désactivées';
                localStorage.setItem('notifications', 'disabled');
            }
        });
    }
    
    // 4. Fonctionnalité d'accessibilité (taille de la police)
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');

    if (fontSizeSlider) {
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            fontSizeSlider.value = savedFontSize;
            document.body.style.fontSize = `${savedFontSize}rem`;
            fontSizeValue.textContent = `${Math.round(savedFontSize * 100)}%`;
        }

        fontSizeSlider.addEventListener('input', (e) => {
            const newSize = e.target.value;
            document.body.style.fontSize = `${newSize}rem`;
            fontSizeValue.textContent = `${Math.round(newSize * 100)}%`;
            localStorage.setItem('fontSize', newSize);
        });
    }
});