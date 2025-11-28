// FINAL SCRIPT — opens verify page with ?id= but requires manual verification

const SITE_B = "https://certificate-id.netlify.app"; 
const SITE_A = "https://certificate-id-verification.netlify.app/page/qr-verification";

// ---------------------
// GO TO VERIFICATION PAGE (button on main page)
// ---------------------
const goVerify = document.getElementById('goVerify');
if (goVerify) {
  goVerify.addEventListener('click', () => {
    window.location.href = SITE_A;
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
