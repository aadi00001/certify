// script.js — single-site version
// Behavior:
// - If index page is opened: use query params OR localStorage OR defaultPayload (in that order)
// - If verify page is used: verify ID, save payload, redirect to index (with params)

// Demo ID (for client-side demo)
const CORRECT_ID = "08202569364";

// Default certificate payload (will show if no params & no storage)
const defaultPayload = {
  id: CORRECT_ID,
  name: 'Devansh Karki',
  email: 'devanshkarki5@gmail.com',
  domain: 'Web Development',
  duration: '2 Month ( 1st July 2025 - 1st September 2025 )'
};

// Build certificate page URL with encoded query params (relative)
function buildCertificateUrl(payload = {}) {
  const params = new URLSearchParams();
  if (payload.id) params.set('id', payload.id);
  if (payload.name) params.set('name', payload.name);
  if (payload.email) params.set('email', payload.email);
  if (payload.domain) params.set('domain', payload.domain);
  if (payload.duration) params.set('duration', payload.duration);
  return '/?' + params.toString();
}

// Save payload to localStorage
function savePayloadToStorage(payload = {}) {
  try {
    localStorage.setItem('cert_payload', JSON.stringify(payload));
  } catch (e) {
    console.warn('Could not save payload to localStorage', e);
  }
}

// Read payload from localStorage
function readPayloadFromStorage({ clear = false } = {}) {
  try {
    const raw = localStorage.getItem('cert_payload');
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (clear) localStorage.removeItem('cert_payload');
    return obj;
  } catch (e) {
    return null;
  }
}

// Decode helper
function decodeIfNeeded(s) {
  if (!s) return s;
  try { return decodeURIComponent(s); } catch(e) { return s; }
}

// Show errors (either in #verifyError element or via button text)
function showVerifyError(message, buttonEl) {
  const existingErr = document.getElementById('verifyError');
  if (existingErr) {
    existingErr.textContent = message;
    existingErr.style.display = 'block';
    setTimeout(() => { existingErr.style.display = 'none'; }, 3000);
    return;
  }
  if (buttonEl) {
    const original = buttonEl.textContent;
    buttonEl.textContent = message;
    buttonEl.disabled = true;
    setTimeout(() => {
      buttonEl.textContent = original;
      buttonEl.disabled = false;
    }, 2000);
  } else {
    alert(message);
  }
}

// ---------- VERIFY PAGE ----------
function initVerifyPage() {
  const input = document.getElementById('codeInput');
  const verifyBtn = document.getElementById('verifyBtn');
  if (!input || !verifyBtn) return;

  // Prefill input from ?id= if present (prefill only)
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get('id');
  if (idFromUrl) input.value = idFromUrl;

  // Enter triggers verify
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBtn.click();
  });

  verifyBtn.addEventListener('click', () => {
    const val = (input.value || '').trim();
    if (!val) {
      showVerifyError('Please enter certificate id.', verifyBtn);
      return;
    }
    if (val === CORRECT_ID) {
      const payload = {
        id: val,
        name: 'devansh karki',
        email: 'devanshkarki5@gmail.com',
        domain: 'web development',
        duration: '1 Month ( 1st May 2025 - 1st June 2025 )'
      };
      // save and redirect
      savePayloadToStorage(payload);
      window.location.href = buildCertificateUrl(payload);
    } else {
      showVerifyError('Certificate ID not found. Please check and try again.', verifyBtn);
    }
  });
}

// ---------- CERTIFICATE PAGE ----------
function populateCertificateFields(payload) {
  if (!payload) return false;
  const map = ['name','email','domain','duration'];
  map.forEach(key => {
    const v = payload[key];
    const el = document.getElementById(key);
    if (el) el.textContent = decodeIfNeeded(v);
  });
  return true;
}

function initCertificatePage() {
  const params = new URLSearchParams(window.location.search);

  // 1) If query params present, use them
  if (params.get('id')) {
    const payload = {
      id: params.get('id'),
      name: decodeIfNeeded(params.get('name') || ''),
      email: decodeIfNeeded(params.get('email') || ''),
      domain: decodeIfNeeded(params.get('domain') || ''),
      duration: decodeIfNeeded(params.get('duration') || '')
    };
    // persist for reloads and populate
    savePayloadToStorage(payload);
    populateCertificateFields(payload);
    return;
  }

  // 2) If nothing in URL, check localStorage
  const stored = readPayloadFromStorage({ clear: false });
  if (stored && stored.id) {
    populateCertificateFields(stored);
    // update URL to show params (non-reload)
    try {
      const newUrl = buildCertificateUrl(stored);
      history.replaceState(null, '', newUrl);
    } catch(e){}
    return;
  }

  // 3) If nothing in storage either, use the default payload
  populateCertificateFields(defaultPayload);
  // also save default so reloads keep it
  savePayloadToStorage(defaultPayload);
  // and update the URL (so it's shareable)
  try {
    const newUrl = buildCertificateUrl(defaultPayload);
    history.replaceState(null, '', newUrl);
  } catch(e){}
}

// ---------- Back button ----------
function initBackButton() {
  const goVerifyBtn = document.getElementById('goVerify');
  if (!goVerifyBtn) return;
  goVerifyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/verify.html';
  });
}

// ---------- Auto init ----------
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('codeInput')) initVerifyPage();
  if (document.getElementById('name')) initCertificatePage();
  initBackButton();
});
