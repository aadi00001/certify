// Updated script.js — smoother auto-verify with visible "Verifying..." delay

const SITE_B = 'https://certificate-id.netlify.app'; // destination after success
const SITE_A_VERIFY_PATH = 'https://certificate-id-verification.netlify.app/page/qr-verification'; // verification site path used for QR

// Small helper to create a temporary "verifying" overlay
function showVerifyingOverlay() {
  // avoid duplicate overlays
  if (document.getElementById('verifying-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'verifying-overlay';
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'rgba(255,255,255,0.85)';
  overlay.style.zIndex = 9999;
  overlay.innerHTML = '<div style="text-align:center;font-family:Inter,system-ui,Arial;color:#333"><div style="font-size:22px;font-weight:700;margin-bottom:8px">Verifying…</div><div style="color:#666;font-size:14px">Please wait a moment</div></div>';
  document.body.appendChild(overlay);
}

// Remove overlay
function removeVerifyingOverlay() {
  const el = document.getElementById('verifying-overlay');
  if (el) el.remove();
}

// When the "Go to the Certification Verification" button is clicked on index.html,
// navigate to the verification site's verify path.
const goVerify = document.getElementById('goVerify');
if (goVerify) {
  goVerify.addEventListener('click', ()=>{
    // Always point explicitly to the verification site path (Site A)
    window.location.href = SITE_A_VERIFY_PATH + '?id=';
  });
}

// Helper: perform verification; returns true on success
function doVerifyWithValue(val) {
  const expected = '08-2025-69364';
  if (val === expected) {
    // success: redirect to Site B (the verified page)
    window.location.href = SITE_B + '/';
    return true;
  } else {
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
      verifyBtn.textContent = 'Invalid code — try again';
      setTimeout(()=>{ verifyBtn.textContent = 'Verify'; }, 1500);
    }
    const input = document.getElementById('codeInput');
    if (input) input.focus();
    return false;
  }
}

// On the verification page, check the entered code (manual verify)
const verifyBtn = document.getElementById('verifyBtn');
if (verifyBtn) {
  verifyBtn.addEventListener('click', ()=>{
    const input = document.getElementById('codeInput');
    const val = input ? input.value.trim() : '';
    // show a short overlay for manual clicks too for consistency
    if (val) {
      showVerifyingOverlay();
      setTimeout(()=> {
        removeVerifyingOverlay();
        doVerifyWithValue(val);
      }, 700); // smaller delay for manual clicks
    }
  });
}

// Allow Enter to trigger verify
const codeInput = document.getElementById('codeInput');
if (codeInput) {
  codeInput.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' && verifyBtn) verifyBtn.click();
  });
}

// On page load, check URL query param `id` and auto-verify if present
// IMPORTANT: only auto-verify if we are on the verification site (to avoid loops)
(function autoVerifyFromQuery() {
  try {
    if (!window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    // Only auto-verify when served from the verification host or when the path includes /page/qr-verification
    const hostOk = window.location.hostname.includes('certificate-id-verification');
    const pathOk = window.location.pathname.includes('/page/qr-verification');
    if (!hostOk && !pathOk) {
      // not on the verification site — don't auto-verify here
      return;
    }

    const input = document.getElementById('codeInput');
    if (input) {
      // show the id for transparency
      input.value = id;

      // show overlay so user sees verification status instead of an immediate jump
      showVerifyingOverlay();

      // wait a short, deliberate delay (1.5s) so user sees the verify page, then verify and redirect
      setTimeout(()=> {
        removeVerifyingOverlay();
        doVerifyWithValue(id);
      }, 1500);
    }
  } catch (e) {
    console.error(e);
  }
})();
