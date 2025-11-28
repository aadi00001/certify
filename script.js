// Common client script used by both pages

// When the "Go to the Certification Verification" button is clicked on index.html,
// navigate to verify.html
const goVerify = document.getElementById('goVerify');
if (goVerify) {
  goVerify.addEventListener('click', ()=>{
    // navigate to verification page
    window.location.href = './verify.html';
  });
}

// On the verification page, check the entered code
const verifyBtn = document.getElementById('verifyBtn');
if (verifyBtn) {
  verifyBtn.addEventListener('click', ()=>{
    const input = document.getElementById('codeInput');
    const val = input ? input.value.trim() : '';
    const expected = '08-2025-69364';

    if (val === expected) {
      // success: go back to the verified page
      window.location.href = './index.html';
    } else {
      // simple feedback
      verifyBtn.textContent = 'Invalid code — try again';
      setTimeout(()=>{ verifyBtn.textContent = 'Verify'; }, 1500);
      if (input) input.focus();
    }
  });
}

// Optional: allow pressing Enter inside input to trigger verification
const codeInput = document.getElementById('codeInput');
if (codeInput) {
  codeInput.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') verifyBtn.click();
  });
}
