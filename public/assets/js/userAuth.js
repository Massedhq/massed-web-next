
// ================================
// USER AUTH MODULE (FINAL)
// ================================


let usernameValid = false;
let emailValid = false;

// ---------- GLOBAL VALIDATION ----------
function updateSignupButton() {
  const usernameOk = usernameValid;
const emailOk = emailValid;
  const terms = document.getElementById("terms-checkbox").checked;

  const firstName = document.getElementById("signup-firstname").value.trim();
  const lastName = document.getElementById("signup-lastname").value.trim();
  const dob = document.getElementById("signup-dob").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  const valid =
    usernameOk &&
    emailOk &&
    terms &&
    firstName &&
    lastName &&
    dob &&
    password.length >= 8 &&
    password === confirm;

  document.getElementById("signup-submit-btn").disabled = !valid;
}

// ---------- USERNAME CHECK ----------
let usernameTimeout;

window.checkUsername = function (input) {
  const val = input.value.trim().toLowerCase();
  const status = document.getElementById("username-status");

  clearTimeout(usernameTimeout);
  status.textContent = "";

  if (!val) return;

  if (val.length < 6) {
    status.textContent = "✗ Min 6 characters";
    status.style.color = "#dc2626";
    updateSignupButton();
    return;
  }

  if (!/^[a-z0-9_]+$/.test(val)) {
    status.textContent = "✗ Only letters, numbers, _";
    status.style.color = "#dc2626";
    updateSignupButton();
    return;
  }

  status.textContent = "⏳";

  usernameTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/check-username?username=${val}`);
      const data = await res.json();

      if (data.taken) {
        usernameValid = false;
        status.textContent = "✗ Username taken";
        status.style.color = "#dc2626";
      } else {
        usernameValid = true;
        status.textContent = "✔ Username available";
        status.style.color = "#16a34a";
      }

      updateSignupButton();

    } catch {
      status.textContent = "";
      updateSignupButton();
    }
  }, 400);
};

// ---------- EMAIL CHECK ----------
let emailTimeout;

window.checkEmail = function (input) {
  const val = input.value.trim().toLowerCase();
  const hint = document.getElementById("email-status");

  clearTimeout(emailTimeout);

  if (!val) return;

  hint.textContent = "⏳";

  emailTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/check-email?email=${val}`);
      const data = await res.json();

      if (data.taken) {
        emailValid = false;
        hint.textContent = "✗ Email already used";
        hint.style.color = "#dc2626";
      } else {
        emailValid = true;
        hint.textContent = "✔ Email available";
        hint.style.color = "#16a34a";
      }

      updateSignupButton();

    } catch {
      hint.textContent = "";
      updateSignupButton();
    }
  }, 400);
};

// ---------- PASSWORD MATCH ----------
window.checkPasswordMatch = function () {
  const pass = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  const error = document.getElementById("password-match-error");

  if (!confirm) return;

  if (pass !== confirm) {
    error.style.display = "block";
  } else {
    error.style.display = "none";
  }

  updateSignupButton();
};

// ---------- PASSWORD STRENGTH ----------
window.checkPasswordStrength = function () {
  const pass = document.getElementById("signup-password").value;
  const hint = document.getElementById("password-hint");

  if (!pass) return;

  if (pass.length < 8) {
    hint.textContent = "✗ Min 8 characters";
    hint.style.color = "#dc2626";
  } else if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
    hint.textContent = "⚠ Add number + capital letter";
    hint.style.color = "#f59e0b";
  } else {
    hint.textContent = "✔ Strong password";
    hint.style.color = "#16a34a";
  }

  updateSignupButton();
};

// ---------- INPUT LISTENERS ----------
document.addEventListener("DOMContentLoaded", () => {
  ["signup-firstname", "signup-lastname", "signup-dob", "signup-password"]
  .forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateSignupButton);
  });

  const terms = document.getElementById("terms-checkbox");
  if (terms) terms.addEventListener("change", updateSignupButton);
});

// ---------- TERMS CHECKBOX ----------
document.getElementById("terms-checkbox")
  .addEventListener("change", updateSignupButton);

// ---------- SIGNUP ----------
window.completeSignup = async function () {
  if (document.getElementById("signup-submit-btn").disabled) return;

  const firstName = document.getElementById("signup-firstname").value.trim();
  const lastName = document.getElementById("signup-lastname").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const dob = document.getElementById("signup-dob").value;

  const fullName = `${firstName} ${lastName}`;
  const isCreator = localStorage.getItem("isCreator") === "true";
  const invitedBy = localStorage.getItem("invitedBy");

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        username,
        password,
        dob,
        is_creator: isCreator,
        created_by: invitedBy,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Signup failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    const encodedUser = encodeURIComponent(JSON.stringify(data.user));

window.location.href = window.location.hostname === 'localhost'
  ? `http://localhost:3000/?user=${encodedUser}`
  : `https://my.massed.io/?user=${encodedUser}`;

  } catch (err) {
    console.error(err);
    showToast("Signup failed");
  }
};


// ---------- LOGIN ----------
window.completeLogin = async function () {
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");
  const errorEl = document.getElementById("login-email-error");
  const btn = document.getElementById("login-btn");

  const email = emailInput.value.trim();
  const password = passInput.value;

  errorEl.textContent = "";

  if (!email || !password) {
    errorEl.textContent = "Enter email and password";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Signing in...";

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Login failed";

      // 🔥 UX IMPROVEMENT
      passInput.value = "";            // clear password
      passInput.focus();               // focus again

      btn.disabled = false;
      btn.textContent = "Sign in →";
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    const encodedUser = encodeURIComponent(JSON.stringify(data.user));
window.location.href = window.location.hostname === 'localhost'
  ? `http://localhost:3000/?user=${encodedUser}`
  : `https://my.massed.io/?user=${encodedUser}`;

  } catch (err) {
    console.error(err);
    errorEl.textContent = "Something went wrong";
    btn.disabled = false;
    btn.textContent = "Sign in →";
  }
};



document.getElementById("login-email")
  .addEventListener("input", () => {
    document.getElementById("login-email-error").textContent = "";
  });

document.getElementById("login-password")
  .addEventListener("input", () => {
    document.getElementById("login-email-error").textContent = "";
  });