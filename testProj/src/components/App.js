import { loadLoginScreen } from "./LoginScreen.js";

export function loadApp() {
  const app = document.getElementById("quiz-app");
  loadLoginScreen(app);
}
