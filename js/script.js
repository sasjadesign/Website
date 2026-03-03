/* ================================================
   EARLY BOOTSTRAP (runs before DOMContentLoaded)
   - Wartungsmodus prüfen
   - Theme vorab setzen (verhindert Flash)
   ================================================ */
(function () {
    // Wartungsmodus: wenn /maintenance.on existiert -> Wartungsseite anzeigen
    try {
        fetch('/maintenance.on', { cache: 'no-store' })
            .then(function (res) {
                if (res && res.ok) window.location.replace('/maintenance.html');
            })
            .catch(function () { /* normal laden */ });
    } catch (e) { /* normal laden */ }

    // Theme möglichst früh setzen
    try {
        var m = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/);
        var t = m ? decodeURIComponent(m[1]) : null;
        if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    } catch (e2) { /* ignore */ }
})();


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

   var mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
if (mql) {
    var themeListener = function (e) {
        var saved = getCookie('theme');
        if (!saved) applyTheme(e.matches ? 'dark' : 'light');
    };

    if (mql.addEventListener) mql.addEventListener('change', themeListener);
    else if (mql.addListener) mql.addListener(themeListener); // Fallback
}

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

    var animateElements = document.querySelectorAll('[data-animate]');

if ('IntersectionObserver' in window) {
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
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(function (el) { observer.observe(el); });
} else {
    // Fallback: einfach alles direkt anzeigen
    animateElements.forEach(function (el) { el.classList.add('animated'); });
}
    

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

 /* ==================== COOKIE CONSENT (Cookies + Dynamic Google Fonts) ==================== */
(function () {
  var overlay = document.getElementById('ccOverlay');
  if (!overlay) return;

  var toggle = document.getElementById('ccToggle');
  var details = document.getElementById('ccDetails');

  var btnAccept = document.getElementById('ccAccept');
  var btnReject = document.getElementById('ccReject');
  var btnSave = document.getElementById('ccSave');

  var cbAnalytics = document.getElementById('ccAnalytics'); // bleibt ohne Funktion, falls du später willst
  var cbExternal = document.getElementById('ccExternal');

  // Footer-Link + alle Reopen-Links
  var reopenSelectors = '.reopen-cookie-settings, .cc-reopen';

  // Cookie-Name
  var CONSENT_COOKIE = 'cookie_consent_v2';

  function openBanner() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBanner() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function getConsent() {
    var raw = getCookie(CONSENT_COOKIE);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function setConsent(obj) {
    // 365 Tage
    setCookie(CONSENT_COOKIE, JSON.stringify(obj), 365);
    setCookie('cookie_consent_date', new Date().toISOString(), 365);
  }

  function syncUI(consent) {
    if (cbAnalytics) cbAnalytics.checked = !!consent.analytics;
    if (cbExternal) cbExternal.checked = !!consent.external;
  }

  function buildConsentFromUI() {
    return {
      necessary: true,
      analytics: cbAnalytics ? !!cbAnalytics.checked : false, // aktuell unused
      external: cbExternal ? !!cbExternal.checked : false,
      ts: new Date().toISOString()
    };
  }

  /* --------- Dynamic loaders --------- */
  function loadGoogleFonts() {
    // nur einmal laden
    if (document.getElementById('gf-preconnect-1')) return;

    var l1 = document.createElement('link');
    l1.id = 'gf-preconnect-1';
    l1.rel = 'preconnect';
    l1.href = 'https://fonts.googleapis.com';

    var l2 = document.createElement('link');
    l2.id = 'gf-preconnect-2';
    l2.rel = 'preconnect';
    l2.href = 'https://fonts.gstatic.com';
    l2.crossOrigin = 'anonymous';

    var l3 = document.createElement('link');
    l3.id = 'gf-stylesheet';
    l3.rel = 'stylesheet';
    l3.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

    document.head.appendChild(l1);
    document.head.appendChild(l2);
    document.head.appendChild(l3);

    // Optional: wenn Fonts geladen sind, CSS Variablen auf die echten Fonts setzen
    // (nur falls du oben system-ui als fallback gesetzt hast)
    document.documentElement.style.setProperty('--font-main', "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif");
    document.documentElement.style.setProperty('--font-heading', "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif");
  }

  function applyConsent(consent) {
    // Analytics: aktuell nichts zu laden (du nutzt kein GA)
    // Externe Medien: hier laden wir Google Fonts (und später z.B. YouTube/Maps)
    if (consent.external) {
      loadGoogleFonts();
      // loadExternalMedia(); // später möglich
    }
  }

  /* --------- Details Toggle --------- */
  if (toggle && details) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      details.hidden = isOpen;

      if (btnSave) btnSave.style.display = isOpen ? 'none' : 'inline-block';
    });
  }

  /* --------- Buttons --------- */
  if (btnAccept) btnAccept.addEventListener('click', function () {
    var c = { necessary: true, analytics: false, external: true, ts: new Date().toISOString() };
    setConsent(c);
    applyConsent(c);
    closeBanner();
  });

  if (btnReject) btnReject.addEventListener('click', function () {
    var c = { necessary: true, analytics: false, external: false, ts: new Date().toISOString() };
    setConsent(c);
    applyConsent(c);
    closeBanner();
  });

  if (btnSave) btnSave.addEventListener('click', function () {
    var c = buildConsentFromUI();
    // Du nutzt kein Analytics, also erzwingen wir false (optional):
    c.analytics = false;

    setConsent(c);
    applyConsent(c);
    closeBanner();
  });

  /* --------- Reopen (Footer verbinden) --------- */
  function reopenCookieSettings(e) {
    e.preventDefault();
    var c = getConsent() || { necessary: true, analytics: false, external: false };
    syncUI(c);

    // Details direkt öffnen
    if (toggle && details) {
      toggle.setAttribute('aria-expanded', 'true');
      details.hidden = false;
      if (btnSave) btnSave.style.display = 'inline-block';
    }
    openBanner();
  }

  document.querySelectorAll(reopenSelectors).forEach(function (el) {
    el.addEventListener('click', reopenCookieSettings);
  });

  /* --------- UX: Klick außerhalb / ESC --------- */
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      // Nur schließen, wenn bereits Consent existiert
      if (getConsent()) closeBanner();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open') && getConsent()) {
      closeBanner();
    }
  });

  /* --------- Initial --------- */
  var existing = getConsent();
  if (existing) {
    syncUI(existing);
    applyConsent(existing);
  } else {
    syncUI({ necessary: true, analytics: false, external: false });
    openBanner();
  }

  // Fail-safe: niemals dauerhaft sperren, falls Addons reinfunken
  setTimeout(function () {
    if (overlay.classList.contains('is-open') && getConsent()) closeBanner();
  }, 8000);
})();

}); // Ende DOMContentLoaded
