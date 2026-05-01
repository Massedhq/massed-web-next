const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://www.massed.io/api';
// ================================
// INVITE CODE VALIDATION
// ================================




window.checkInvite = async function () {
  const input = document.getElementById("invite-input");
  const val = input.value.trim().toUpperCase();
  const btn = document.querySelector("#signup-step1 .btn-tc");

  if (!val) return;

  const errorEl = document.getElementById("invite-error");
  const successEl = document.getElementById("invite-success");

  errorEl.classList.remove("show");
  successEl.style.display = "none";

  btn.textContent = "Checking…";
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/validate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: val }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      throw new Error(data.error || "Validation failed");
    }

    if (data.valid) {

      // 🔥 NEW CODE
      localStorage.setItem("isCreator", data.isCreator ? "true" : "false");
    
      if (data.createdBy) {
        localStorage.setItem("invitedBy", data.createdBy);
      } else {
        localStorage.removeItem("invitedBy");
      }
    
      // ✅ SUCCESS UI
      successEl.style.display = "flex";
      errorEl.classList.remove("show");
    
      setTimeout(() => {
        document.getElementById("signup-step1").style.display = "none";
        document.getElementById("signup-step2").style.display = "block";
    
        document.getElementById("signup-sub").textContent =
          "Create your account";
    
        successEl.style.display = "none";
      }, 800);
    } else {
      successEl.style.display = "none";
      errorEl.classList.add("show");
    }

  } catch (err) {
    console.error("Invite validation error:", err);
    errorEl.classList.add("show");
  } finally {
    btn.textContent = "Verify invite →";
    btn.disabled = false;
  }
};