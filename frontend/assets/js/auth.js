// assets/js/auth.js

function saveToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
  }
}

// Attach to login page
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const errorEl = document.getElementById("login-error");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      errorEl.textContent = "";

      try {
        const data = await login(username, password);
        // Adjust based on your API response shape
        saveToken(data.token || data.jwt || data.accessToken);
        window.location.href = "dashboard.html";
      } catch (err) {
        errorEl.textContent = "Login failed. Check your credentials.";
        console.error(err);
      }
    });
  }

  // Logout button (on dashboard etc.)
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearToken();
      window.location.href = "index.html";
    });
  }
});
