// script.js — single-site, no query params in URL
// Save certificate payload to localStorage and show it on index.html

const CORRECT_ID = "08202569364";

// Default certificate payload (shown when site opened with no prior verification)
const defaultPayload = {
  id: CORRECT_ID,
  name: 'Devansh Karki',
  email: 'devanshkarki5@gmail.com',
  domain: 'web development',
  duration: '2 Months ( 1st July 2025 - 1st September 2025 )'
};

// Build certificate page URL (clean root, no personal data in URL)
function buildCertificateUrl(payload = {}) {
  return '/';
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

// Decode helper (safe)
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

  // Enter key triggers verify
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
        name: 'Devansh Karki',
        email: 'devanshkarki5@gmail.com',
        domain: 'web development',
        duration: '2 Months ( 1st July 2025 - 1st September 2025 )'
      };

      // Save for fallback and redirect to clean URL
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
  // 1) Try to read payload from localStorage
  const stored = readPayloadFromStorage({ clear: false });
  if (stored && stored.id) {
    populateCertificateFields(stored);
    return;
  }

  // 2) No stored data — show default payload and save it
  populateCertificateFields(defaultPayload);
  savePayloadToStorage(defaultPayload);
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
