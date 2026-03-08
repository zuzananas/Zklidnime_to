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
