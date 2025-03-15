import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { app } from "./firebase_core.js";
import { router } from "./app.js";
import { glGameModel } from "./DiceGameController.js";

const auth = getAuth(app);

export let currentUser = null;
export let isGuestMode = false;

export async function loginFirebase(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutFirebase() {
  if (isGuestMode) {
    exitGuestMode();
  } else {
    await signOut(auth);
  }
}

export function playAsGuest() {
  isGuestMode = true;
  const loginDiv = document.getElementById("loginDiv");
  loginDiv.classList.replace("d-block", "d-none");

  const navMenu = document.getElementById("navMenuContainer");
  navMenu.classList.replace("d-none", "d-block");

  const spaRoot = document.getElementById("spaRoot");
  spaRoot.classList.replace("d-none", "d-block");

  // Set guest user email display
  const userEmailDisplay = document.getElementById("userEmailDisplay");
  if (userEmailDisplay) {
    userEmailDisplay.textContent = "Guest User";
  }

  // Reset game model for a fresh start
  if (glGameModel) {
    glGameModel.reset();
  }

  // Navigate to home
  router.navigate("/");
}

export function exitGuestMode() {
  isGuestMode = false;

  // Hide navigation and game content
  const navMenu = document.getElementById("navMenuContainer");
  navMenu.classList.replace("d-block", "d-none");

  const spaRoot = document.getElementById("spaRoot");
  spaRoot.classList.replace("d-block", "d-none");

  // Show login form
  const loginDiv = document.getElementById("loginDiv");
  loginDiv.classList.replace("d-none", "d-block");

  // Reset game state
  if (glGameModel) {
    glGameModel.reset();
  }

  // Clear view
  router.currentView = null;
  spaRoot.innerHTML = "";
}

onAuthStateChanged(auth, (user) => {
  // Skip auth state changes if in guest mode
  if (isGuestMode) return;

  currentUser = user;
  if (user) {
    console.log("AuthStateChanged: User logged in", user.email);
    const loginDiv = document.getElementById("loginDiv");
    loginDiv.classList.replace("d-block", "d-none");
    const navMenu = document.getElementById("navMenuContainer");
    navMenu.classList.replace("d-none", "d-block");
    const spaRoot = document.getElementById("spaRoot");
    spaRoot.classList.replace("d-none", "d-block");

    // Display user email
    const userEmailDisplay = document.getElementById("userEmailDisplay");
    if (userEmailDisplay) {
      userEmailDisplay.textContent = user.email;
    }

    router.navigate(window.location.pathname);
  } else {
    console.log("AuthStateChanged: User logged out");
    const loginDiv = document.getElementById("loginDiv");
    loginDiv.classList.replace("d-none", "d-block");
    const navMenu = document.getElementById("navMenuContainer");
    navMenu.classList.replace("d-block", "d-none");
    const spaRoot = document.getElementById("spaRoot");
    spaRoot.classList.replace("d-block", "d-none");
    router.currentView = null;
    spaRoot.innerHTML = ""; // Clear view

    // Reset game model when logging out
    if (glGameModel) {
      glGameModel.reset();
    }
  }
});

export async function createAccount(email, password) {
  await createUserWithEmailAndPassword(auth, email, password);
}
