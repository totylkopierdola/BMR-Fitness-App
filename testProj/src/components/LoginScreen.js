import { loadQuizScreen } from "./QuizScreen.js";

export function loadLoginScreen(container) {
  container.innerHTML = `
    <section id="login-screen" class="screen">
      <div class="logo">
        <h4>BMR</h4>
        <span>Fitness</span>
      </div>
      <form id="login-form">
        <label for="name">Enter your name</label>
        <input type="text" id="name" name="name" required />
        <button type="submit">Start</button>
      </form>
    </section>
  `;

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const loginScreen = document.getElementById("login-screen");
    loginScreen.remove();

    loadQuizScreen(container);

    const quizScreen = document.getElementById("quiz-screen");
    if (quizScreen) {
      quizScreen.style.display = "flex";
    } else {
      console.error("Quiz screen element not found");
    }
  });
}
