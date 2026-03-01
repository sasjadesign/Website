/* ================================================
   COOKIE HELPER FUNCTIONS
   ================================================ */
function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
}

function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
}

/* ================================================
   DOM READY
   ================================================ */
document.addEventListener('DOMContentLoaded', function () {

    // ==================== PAGE LOADER ====================
    var pageLoader = document.getElementById('pageLoader');

    window.addEventListener('load', function () {
        if (pageLoader) {
            setTimeout(function () {
                pageLoader.classList.add('hidden');
            }, 400);
        }
    });

    if (document.readyState === 'complete' && pageLoader) {
        setTimeout(function () {
            pageLoader.classList.add('hidden');
        }, 400);
    }

    // ==================== DARK MODE TOGGLE ====================
    var themeToggle = document.getElementById('theme-toggle');
    var body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark');
            document.documentElement.classList.add('dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    }

    var savedTheme = getCookie('theme');

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            themeToggle.classList.add('is-animating');
            setTimeout(function () {
                themeToggle.classList.remove('is-animating');
            }, 350);

            var isDark = body.classList.toggle('dark');
            document.documentElement.classList.toggle('dark');
            var newTheme = isDark ? 'dark' : 'light';
            setCookie('theme', newTheme, 365);
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var saved = getCookie('theme');
        if (!saved) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ==================== MOBILE NAVIGATION ====================
    var hamburger = document.getElementById('navHamburger');
    var navLinks = document.getElementById('navLinks');

    var navOverlay = document.createElement('div');
    navOverlay.classList.add('nav-overlay');
    body.appendChild(navOverlay);

    function toggleNav() {
        if (hamburger) hamburger.classList.toggle('active');
        if (navLinks) navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.style.overflow = (navLinks && navLinks.classList.contains('active')) ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleNav);
    if (navOverlay) navOverlay.addEventListener('click', toggleNav);

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navLinks && navLinks.classList.contains('active')) {
                toggleNav();
            }
        });
    });

    // ==================== NAVBAR SCROLL ====================
    var navbar = document.getElementById('navbar');

    function handleScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ==================== ACTIVE NAV LINK ====================
    var sections = document.querySelectorAll('section[id]');
    var navItems = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        var scrollY = window.scrollY + 100;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ==================== SCROLL ANIMATIONS ====================
    var animateElements = document.querySelectorAll('[data-animate]');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(function () {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(function (el) {
        observer.observe(el);
    });

    // ==================== COUNTER ANIMATION ====================
    var counters = document.querySelectorAll('.stat-number[data-count]');

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var target = parseInt(entry.target.getAttribute('data-count'));
                var current = 0;
                var increment = target / 40;
                var timer = setInterval(function () {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 40);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
        counterObserver.observe(counter);
    });

    // ==================== FAQ ACCORDION ====================
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                faqItems.forEach(function (faq) {
                    faq.classList.remove('active');
                });

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ==================== CONTACT FORM ====================
    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
            submitBtn.disabled = true;

            var formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    if (formSuccess) formSuccess.style.display = 'block';
                } else {
                    throw new Error('Formular konnte nicht gesendet werden.');
                }
            })
            .catch(function (error) {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Fehler – bitte erneut versuchen';
                submitBtn.disabled = false;
                setTimeout(function () {
                    submitBtn.innerHTML = originalHTML;
                }, 3000);
            });
        });
    }

    // ==================== BACK TO TOP ====================
    var backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== CURRENT YEAR ====================
    var yearEls = document.querySelectorAll('#currentYear, .currentYear');
    yearEls.forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==================== COOKIE CONSENT ====================
    var cookieOverlay = document.getElementById('cookieOverlay');
    var cookieBanner = document.getElementById('cookieBanner');
    var cookieAccept = document.getElementById('cookieAccept');
    var cookieReject = document.getElementById('cookieReject');
    var cookieSave = document.getElementById('cookieSave');
    var cookieDetailsToggle = document.getElementById('cookieDetailsToggle');
    var cookieDetails = document.getElementById('cookieDetails');
    var cookieAnalytics = document.getElementById('cookieAnalytics');
    var cookieExternal = document.getElementById('cookieExternal');

    var consentValue = getCookie('cookie_consent');

    function showCookieBanner() {
        if (cookieOverlay && !consentValue) {
            cookieOverlay.classList.add('visible');
            body.style.overflow = 'hidden';
        }
    }

    // Wenn schon Consent vorhanden, Einstellungen anwenden
    if (consentValue) {
        applyConsentSettings(consentValue);
    }

    // Banner nach Loader zeigen
    window.addEventListener('load', function () {
        setTimeout(showCookieBanner, 1200);
    });

    if (document.readyState === 'complete') {
        setTimeout(showCookieBanner, 1200);
    }

    // Details Toggle
    if (cookieDetailsToggle && cookieDetails) {
        cookieDetailsToggle.addEventListener('click', function () {
            var isOpen = cookieDetails.classList.toggle('open');
            cookieDetailsToggle.classList.toggle('active');
            cookieDetailsToggle.querySelector('span').textContent = isOpen ? 'Details ausblenden' : 'Details anzeigen';

            if (cookieSave) {
                cookieSave.style.display = isOpen ? 'block' : 'none';
            }
        });
    }

    // Alle akzeptieren
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function () {
            saveConsent('all');
            closeCookieBanner();
        });
    }

    // Nur Notwendige
    if (cookieReject) {
        cookieReject.addEventListener('click', function () {
            saveConsent('necessary');
            closeCookieBanner();
        });
    }

    // Auswahl speichern
    if (cookieSave) {
        cookieSave.addEventListener('click', function () {
            var selected = 'necessary';
            var parts = [];
            if (cookieAnalytics && cookieAnalytics.checked) parts.push('analytics');
            if (cookieExternal && cookieExternal.checked) parts.push('external');
            if (parts.length > 0) {
                selected = 'custom:' + parts.join(',');
            }
            saveConsent(selected);
            closeCookieBanner();
        });
    }

    function saveConsent(level) {
        setCookie('cookie_consent', level, 365);
        setCookie('cookie_consent_date', new Date().toISOString(), 365);
        applyConsentSettings(level);
    }

    function closeCookieBanner() {
        if (cookieOverlay) cookieOverlay.classList.remove('visible');
        body.style.overflow = '';
    }

    function applyConsentSettings(consent) {
        var allowAnalytics = false;
        var allowExternal = false;

        if (consent === 'all') {
            allowAnalytics = true;
            allowExternal = true;
        } else if (consent.indexOf('custom:') === 0) {
            var parts = consent.replace('custom:', '').split(',');
            allowAnalytics = parts.indexOf('analytics') !== -1;
            allowExternal = parts.indexOf('external') !== -1;
        }

        if (allowAnalytics) {
            loadAnalytics();
        }

        if (allowExternal) {
            loadExternalMedia();
        }
    }

    function loadAnalytics() {
        // Google Analytics hier einbinden:
        // var script = document.createElement('script');
        // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
        // script.async = true;
        // document.head.appendChild(script);
        // script.onload = function() {
        //     window.dataLayer = window.dataLayer || [];
        //     function gtag(){ dataLayer.push(arguments); }
        //     gtag('js', new Date());
        //     gtag('config', 'G-XXXXXXX');
        // };
    }

    function loadExternalMedia() {
        // Externe Dienste aktivieren (z.B. YouTube embeds etc.)
    }

    // Cookie-Einstellungen erneut öffnen
    var reopenBtns = document.querySelectorAll('.reopen-cookie-settings');
    reopenBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Checkboxen auf aktuellen Stand setzen
            var currentConsent = getCookie('cookie_consent');
            if (cookieAnalytics) {
                cookieAnalytics.checked = (currentConsent === 'all' || (currentConsent && currentConsent.indexOf('analytics') !== -1));
            }
            if (cookieExternal) {
                cookieExternal.checked = (currentConsent === 'all' || (currentConsent && currentConsent.indexOf('external') !== -1));
            }

            if (cookieOverlay) cookieOverlay.classList.add('visible');
            body.style.overflow = 'hidden';
        });
    });

}); // Ende DOMContentLoaded
