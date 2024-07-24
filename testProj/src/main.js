import { loadLoginScreen } from "./components/LoginScreen.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("quiz-app");
  loadLoginScreen(app);
});
