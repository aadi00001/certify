// script.js — single-site version (relative redirects only)

// Demo-only correct id (for production, do server-side verification)
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
      window.location.href = buildCertificateUrl(payload);
    } else {
      showVerifyError('Certificate ID not found. Please check and try again.', verifyBtn);
    }
  });
}

// Initialize the certificate display on index page using query params
function initCertificatePage() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('id')) return;

  const map = ['name','email','domain','duration'];
  map.forEach(key => {
    const v = params.get(key);
    if (v) {
      const el = document.getElementById(key);
      if (el) el.textContent = decodeURIComponent(v);
    }
  });
}

// Wire up 'Go to Verification' button on the certificate page
function initBackButton() {
  const goVerifyBtn = document.getElementById('back-btn') || document.getElementById('goVerify');
  if (!goVerifyBtn) return;
  goVerifyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/verify.html';
  });
}

// Auto-initialize based on DOM content
document.addEventListener('DOMContentLoaded', () => {
  // If verify form present, init verify page
  if (document.getElementById('codeInput') || document.getElementById('verifyBtn')) {
    initVerifyPage();
  }

  // If certificate fields present, init certificate read
  if (document.getElementById('name') || document.getElementById('email')) {
    initCertificatePage();
  }

  // Hook back button if present
  initBackButton();
});
