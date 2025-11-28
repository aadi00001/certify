// Common client script used by both pages

const SITE_B = 'https://certificate-id.netlify.app'; // the "first page" site (where we land after success)
const SITE_A_VERIFY_PATH = 'https://certificate-id-verification.netlify.app/page/qr-verification'; // the verification site path used for QR

// When the "Go to the Certification Verification" button is clicked on index.html,
// navigate to the verification site's verify path.
const goVerify = document.getElementById('goVerify');
if (goVerify) {
  goVerify.addEventListener('click', ()=>{
    // Navigate to the verification site path (Site A)
    window.location.href = SITE_A_VERIFY_PATH;
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

// On the verification page, check the entered code
const verifyBtn = document.getElementById('verifyBtn');
if (verifyBtn) {
  verifyBtn.addEventListener('click', ()=>{
    const input = document.getElementById('codeInput');
    const val = input ? input.value.trim() : '';
    doVerifyWithValue(val);
  });
}

// Allow Enter to trigger verify
const codeInput = document.getElementById('codeInput');
if (codeInput) {
  codeInput.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') verifyBtn.click();
  });
}

// On page load, check URL query param `id` and auto-verify if present
(function autoVerifyFromQuery() {
  try {
    if (!window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    // If we're on the verify page (or Netlify served verify.html at /page/qr-verification),
    // auto-fill and auto-verify.
    const input = document.getElementById('codeInput');
    if (input) {
      input.value = id; // optional: show it in the input
      // small delay so the page renders before redirecting
      setTimeout(()=> {
        doVerifyWithValue(id);
      }, 250);
    }
  } catch (e) {
    console.error(e);
  }
})();
