// script.js — single-site version with localStorage fallback

const CORRECT_ID = "08202569364";

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
    // ignore storage errors (e.g. private mode)
    console.warn('Could not save payload to localStorage', e);
  }
}

// Read payload from localStorage (and optionally clear it)
function readPayloadFromStorage({ clear = true } = {}) {
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

// Show errors (either in #verifyError element or by using the button text)
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

// Initialize handlers on the verify page
function initVerifyPage() {
  const input = document.getElementById('codeInput');
  const verifyBtn = document.getElementById('verifyBtn');
  if (!input || !verifyBtn) return;

  // Prefill input from ?id= if present (prefill only)
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get('id');
  if (idFromUrl) input.value = idFromUrl;

  // Press Enter to verify
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBtn.click();
  });

  // Click verify
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

      // save for fallback (so a reload of / still shows info)
      savePayloadToStorage(payload);

      // redirect (keeps the existing query param behavior)
      window.location.href = buildCertificateUrl(payload);
    } else {
      showVerifyError('Certificate ID not found. Please check and try again.', verifyBtn);
    }
  });
}

// Initialize the certificate display on index page using query params or storage
function initCertificatePage() {
  const params = new URLSearchParams(window.location.search);
  let payload = null;

  if (params.get('id')) {
    payload = {
      id: params.get('id'),
      name: params.get('name'),
      email: params.get('email'),
      domain: params.get('domain'),
      duration: params.get('duration')
    };
  } else {
    // fallback to localStorage if no query params present
    const stored = readPayloadFromStorage({ clear: false });
    if (stored && stored.id) {
      payload = stored;
      // optional: once we populate from storage, update the URL without reloading
      const newUrl = buildCertificateUrl(stored);
      try {
        history.replaceState(null, '', newUrl);
      } catch (e) {
        // ignore
      }
      // clear storage so it doesn't persist forever
      try { localStorage.removeItem('cert_payload'); } catch (e) {}
    }
  }

  if (!payload) return;

  const map = ['name','email','domain','duration'];
  map.forEach(key => {
    const v = payload[key];
    if (v) {
      const el = document.getElementById(key);
      if (el) el.textContent = decodeURIComponent(v);
    }
  });
}

// Back button handler
function initBackButton() {
  const goVerifyBtn = document.getElementById('goVerify');
  if (!goVerifyBtn) return;
  goVerifyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/verify.html';
  });
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('codeInput')) initVerifyPage();
  if (document.getElementById('name')) initCertificatePage();
  initBackButton();
});
