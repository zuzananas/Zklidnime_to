/* Common scripts for Zklidníme to */

// Rok ve footeru
document.getElementById('y').textContent = new Date().getFullYear();

// Mobilní menu toggle
const toggle = document.querySelector('.menu-toggle');
const mnav = document.getElementById('mobile-menu');

function closeMenu(){
  mnav.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
}

toggle?.addEventListener('click', () => {
  const willOpen = !mnav.classList.contains('open');
  mnav.classList.toggle('open', willOpen);
  toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
});

// Zavři menu po kliknutí na odkaz
mnav?.querySelectorAll('.m-link').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// Když přejdu nad breakpoint, menu zavři
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) closeMenu();
});

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});
backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

// Cookie consent + Google Analytics
const GA_MEASUREMENT_ID = 'G-PH141QN3ZR';
const CONSENT_KEY = 'consent_analytics';
const banner = document.getElementById('consent-banner');
const acceptBtn = document.getElementById('consent-accept');
const rejectBtn = document.getElementById('consent-reject');
const openBtn = document.getElementById('consent-open');

function loadGoogleAnalytics(){
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
  if (window.gtagLoaded) return;
  window.gtagLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
}

function setConsent(value){
  localStorage.setItem(CONSENT_KEY, value);
}

function getConsent(){
  return localStorage.getItem(CONSENT_KEY);
}

function showBanner(){
  banner.hidden = false;
}

function hideBanner(){
  banner.hidden = true;
}

function handleConsent(){
  const consent = getConsent();
  if (consent === 'accepted'){
    hideBanner();
    loadGoogleAnalytics();
  } else if (consent === 'rejected'){
    hideBanner();
  } else {
    showBanner();
  }
}

acceptBtn?.addEventListener('click', () => {
  setConsent('accepted');
  hideBanner();
  loadGoogleAnalytics();
});

rejectBtn?.addEventListener('click', () => {
  setConsent('rejected');
  hideBanner();
});

openBtn?.addEventListener('click', () => {
  showBanner();
});

handleConsent();

// --- Index (domovská stránka) ---

document.querySelectorAll('.faq-question').forEach(function (button) {
  button.addEventListener('click', function () {
    var isExpanded = button.getAttribute('aria-expanded') === 'true';
    var answerId = button.getAttribute('aria-controls');
    var answer = document.getElementById(answerId);

    if (isExpanded) {
      button.setAttribute('aria-expanded', 'false');
      answer.classList.remove('open');
    } else {
      button.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

(function () {
  var root = document.querySelector('[data-reviews-carousel]');
  if (!root) return;
  var track = root.querySelector('[data-reviews-track]');
  var viewport = root.querySelector('[data-reviews-viewport]');
  var prevBtn = root.querySelector('[data-reviews-prev]');
  var nextBtn = root.querySelector('[data-reviews-next]');
  var dotsWrap = root.querySelector('[data-reviews-dots]');
  var live = root.querySelector('#reviews-live');
  if (!track || !viewport || !prevBtn || !nextBtn || !dotsWrap) return;

  var originalSlides = Array.from(track.querySelectorAll('[data-review-slide]'));
  var total = originalSlides.length;
  if (total === 0) return;

  var firstSlide = originalSlides[0];
  var lastSlide = originalSlides[total - 1];
  var cloneLast = lastSlide.cloneNode(true);
  var cloneFirst = firstSlide.cloneNode(true);
  [cloneLast, cloneFirst].forEach(function (node) {
    node.setAttribute('data-carousel-clone', 'true');
    node.removeAttribute('data-review-slide');
    node.setAttribute('aria-hidden', 'true');
  });
  track.insertBefore(cloneLast, firstSlide);
  track.appendChild(cloneFirst);

  var prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pos = 1;
  var isJumping = false;
  var isSliding = false;
  var hasAnnounced = false;

  originalSlides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'reviews-dot';
    dot.setAttribute('aria-label', 'Hodnocení ' + (i + 1) + ' z ' + total);
    dot.addEventListener('click', function () {
      goToSlide(i);
    });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('.reviews-dot');

  function slideWidth() {
    return viewport.clientWidth || 0;
  }

  function logicalFromPos(p) {
    if (p === 0) return total - 1;
    if (p === total + 1) return 0;
    return p - 1;
  }

  function announce(idx) {
    if (!live || !hasAnnounced) return;
    live.textContent = 'Zobrazeno hodnocení ' + (idx + 1) + ' z ' + total + '.';
  }

  function syncAria() {
    var idx = logicalFromPos(pos);
    originalSlides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-current', i === idx ? 'true' : 'false');
    });
    announce(idx);
  }

  function applyTransform(animate) {
    var w = slideWidth();
    if (!animate || prefersReduced) {
      track.style.transition = 'none';
    } else {
      track.style.transition = '';
    }
    track.style.transform = 'translateX(-' + pos * w + 'px)';
    if (!animate || prefersReduced) {
      void track.offsetHeight;
      track.style.transition = prefersReduced ? 'none' : '';
    }
  }

  function jumpAfterClone() {
    if (pos === total + 1) {
      isJumping = true;
      pos = 1;
      applyTransform(false);
      isJumping = false;
      syncAria();
    } else if (pos === 0) {
      isJumping = true;
      pos = total;
      applyTransform(false);
      isJumping = false;
      syncAria();
    }
  }

  track.addEventListener('transitionend', function (e) {
    if (e.target !== track || e.propertyName !== 'transform') return;
    if (prefersReduced) return;
    if (!isJumping) {
      jumpAfterClone();
    }
    isSliding = false;
  });

  function goNext() {
    hasAnnounced = true;
    if (prefersReduced) {
      pos = ((logicalFromPos(pos) + 1) % total) + 1;
      applyTransform(false);
      syncAria();
      return;
    }
    if (isSliding) return;
    isSliding = true;
    pos++;
    applyTransform(true);
    syncAria();
  }

  function goPrev() {
    hasAnnounced = true;
    if (prefersReduced) {
      pos = ((logicalFromPos(pos) - 1 + total) % total) + 1;
      applyTransform(false);
      syncAria();
      return;
    }
    if (isSliding) return;
    isSliding = true;
    pos--;
    applyTransform(true);
    syncAria();
  }

  function goToSlide(i) {
    hasAnnounced = true;
    if (prefersReduced) {
      pos = i + 1;
      applyTransform(false);
      syncAria();
      return;
    }
    if (isSliding) return;
    isSliding = true;
    pos = i + 1;
    applyTransform(true);
    syncAria();
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  if (viewport) {
    var swipeStartX = null;
    var swipeStartY = null;
    viewport.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length !== 1) return;
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    viewport.addEventListener(
      'touchcancel',
      function () {
        swipeStartX = swipeStartY = null;
      },
      { passive: true }
    );
    viewport.addEventListener(
      'touchend',
      function (e) {
        if (swipeStartX === null || swipeStartY === null) return;
        var t = e.changedTouches[0];
        var dx = t.clientX - swipeStartX;
        var dy = t.clientY - swipeStartY;
        swipeStartX = swipeStartY = null;
        var threshold = 48;
        if (Math.abs(dx) < threshold) return;
        if (Math.abs(dx) < Math.abs(dy) * 0.85) return;
        if (dx < 0) goNext();
        else goPrev();
      },
      { passive: true }
    );
  }

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  });

  window.addEventListener('resize', function () {
    isSliding = false;
    applyTransform(false);
  });

  if (prefersReduced) {
    track.style.transition = 'none';
  }

  applyTransform(false);
  syncAria();
})();

// Česká typografie: spojka „a“ a předložka „v“ nepřenášet na konec řádku (pevná mezera k následujícímu slovu).
(function () {
  var re = /\b([aAvV])\s+(?=\S)/g;
  var skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'PRE', 'CODE', 'TEXTAREA']);

  function parentSkipped(el) {
    while (el) {
      if (skip.has(el.tagName)) return true;
      el = el.parentElement;
    }
    return false;
  }

  if (!document.body) return;

  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      return parentSkipped(node.parentElement)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    }
  });

  var node;
  while ((node = walker.nextNode())) {
    var t = node.nodeValue;
    if (!t) continue;
    var next = t.replace(re, '$1\u00A0');
    if (next !== t) node.nodeValue = next;
  }
})();
