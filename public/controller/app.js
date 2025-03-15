import { HomeView } from "../view/HomeView.js";
import { ProfileView } from "../view/ProfileView.js";
import { HomeController } from "./HomeController.js";
import { ProfileController } from "./ProfileController.js";
import { Router } from "./Router.js";
import {
  createAccount,
  loginFirebase,
  logoutFirebase,
  playAsGuest,
} from "./firebase_auth.js";
import { startSpinner, stopSpinner } from "../view/util.js";

// Set app title
document.getElementById("appHeader").textContent = "Dice Roll Game";
document.title = "Dice Roll Game";

// Define routes
const routes = [
  { path: "/", view: HomeView, controller: HomeController },
  { path: "/profile", view: ProfileView, controller: ProfileController },
];

// Create router instance
export const router = new Router(routes);

// Initialize navigation
router.navigate(window.location.pathname);

// Setup navigation menu events
const menuItems = document.querySelectorAll("a[data-path]");
menuItems.forEach((item) => {
  item.onclick = function (e) {
    e.preventDefault();

    // Update active tab
    document.querySelectorAll(".nav-btn").forEach((link) => {
      link.classList.remove("active");
    });
    item.classList.add("active");

    // Navigate to the path
    const path = item.getAttribute("data-path");
    router.navigate(path);
  };
});

// Set home tab as active by default
document.getElementById("homeLink")?.classList.add("active");

// Login form submission
document.forms.loginForm.onsubmit = async function (e) {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  startSpinner();
  try {
    await loginFirebase(email, password);
    stopSpinner();
    console.log("User logged in", email);
  } catch (e) {
    stopSpinner();
    console.error("Error logging in", e);
    alert("Sign in failed: " + e.code + ", " + e.message);
  }
};

// No User button - Play as guest
const noUserBtn = document.getElementById("noUserBtn");
if (noUserBtn) {
  noUserBtn.addEventListener("click", function () {
    playAsGuest();
  });
}

// Logout button
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.onclick = async function (e) {
    startSpinner();
    try {
      await logoutFirebase();
      stopSpinner();
      console.log("User logged out");
    } catch (e) {
      stopSpinner();
      console.error("Error logging out: ", e);
      alert("Sign out failed: " + e.code + ", " + e.message);
    }
  };
}

// Create account form
document.forms.createAccountForm.onsubmit = async function (e) {
  e.preventDefault();
  const email = e.target.email.value;
  const emailConfirm = e.target.emailConfirm.value;

  if (email !== emailConfirm) {
    alert("Emails do not match");
    return;
  }

  const password = e.target.password.value;

  startSpinner();
  try {
    await createAccount(email, password);
    stopSpinner();
    document
      .getElementById("createAccountDiv")
      .classList.replace("d-block", "d-none");
  } catch (e) {
    stopSpinner();
    console.error("Error creating account: ", e);
    alert("Create account failed: " + e.code + ", " + e.message);
  }
};

// Show create account form/hide login form
const goToCreateAccount = document.getElementById("goToCreateAccount");
if (goToCreateAccount) {
  goToCreateAccount.onclick = function (e) {
    e.preventDefault();
    document.getElementById("loginDiv").classList.replace("d-block", "d-none");
    document
      .getElementById("createAccountDiv")
      .classList.replace("d-none", "d-block");
    document.forms.createAccountForm.reset();
  };
}

// Hide create account form/show login form
const goToLogin = document.getElementById("goToLogin");
if (goToLogin) {
  goToLogin.onclick = function (e) {
    e.preventDefault();
    document
      .getElementById("createAccountDiv")
      .classList.replace("d-block", "d-none");
    document.getElementById("loginDiv").classList.replace("d-none", "d-block");
  };
}
