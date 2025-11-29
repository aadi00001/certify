// FINAL SCRIPT — opens verify page with ?id= but requires manual verification

// FINAL SCRIPT — opens main certificate page after QR scan

// SITE A = QR verification page
const SITE_A = "https://certificate-id-verificationweb.netlify.app/page/qr-verification";

// SITE B = main certificate home page
const SITE_B = "https://certificate-id-verify.netlify.app";

// ---------------------
// GO TO MAIN CERTIFICATE PAGE
// ---------------------
const goVerify = document.getElementById('goVerify');
if (goVerify) {
  goVerify.addEventListener('click', () => {
    window.location.href = SITE_B;   // Button takes you to certificate-id.netlify.app
  });
}


// ---------------------
// MANUAL VERIFY ONLY
// ---------------------
function doVerify(val) {
  const correct = "08202569364";

  if (val === correct) {
    window.location.href = SITE_B + "/";
  } else {
    const btn = document.getElementById('verifyBtn');
    btn.textContent = "Invalid Code!";
    setTimeout(() => btn.textContent = "Verify", 1500);
  }
}

// Click verify
const verifyBtn = document.getElementById('verifyBtn');
if (verifyBtn) {
  verifyBtn.addEventListener('click', () => {
    const input = document.getElementById('codeInput');
    doVerify(input.value.trim());
  });
}

// Enter key triggers verify
const input = document.getElementById('codeInput');
if (input) {
  input.addEventListener('keydown', e => {
    if (e.key === "Enter") verifyBtn.click();
  });
}

// ---------------------
// PREFILL ONLY — NO AUTO VERIFY
// ---------------------
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (id && input) {
  input.value = id; // prefill ONLY
}
