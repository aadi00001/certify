const CORRECT_ID = "08202569364";

function buildCertificateUrl(payload = {}) {
  const params = new URLSearchParams();
  if (payload.id) params.set('id', payload.id);
  if (payload.name) params.set('name', payload.name);
  if (payload.email) params.set('email', payload.email);
  if (payload.domain) params.set('domain', payload.domain);
  if (payload.duration) params.set('duration', payload.duration);

  return '/?' + params.toString();
}

function initVerifyPage() {
  const input = document.getElementById('codeInput');
  const verifyBtn = document.getElementById('verifyBtn');

  if (!input || !verifyBtn) return;

  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get('id');
  if (idFromUrl) input.value = idFromUrl;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBtn.click();
  });

  verifyBtn.addEventListener('click', () => {
    const value = (input.value || '').trim();

    if (!value) return;

    if (value === CORRECT_ID) {
      const payload = {
        id: value,
        name: 'devansh karki',
        email: 'devanshkarki5@gmail.com',
        domain: 'web development',
        duration: '1 Month ( 1st May 2025 - 1st June 2025 )'
      };

      window.location.href = buildCertificateUrl(payload);
    }
  });
}

function initCertificatePage() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('id')) return;

  const map = {
    name: 'name',
    email: 'email',
    domain: 'domain',
    duration: 'duration'
  };

  Object.keys(map).forEach(key => {
    const v = params.get(key);
    if (v) {
      const el = document.getElementById(map[key]);
      if (el) el.textContent = decodeURIComponent(v);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('codeInput')) initVerifyPage();
  if (document.getElementById('name')) initCertificatePage();

  const goVerifyBtn = document.getElementById('goVerify');
  if (goVerifyBtn) {
    goVerifyBtn.addEventListener('click', () => {
      window.location.href = '/verify.html';
    });
  }
});
