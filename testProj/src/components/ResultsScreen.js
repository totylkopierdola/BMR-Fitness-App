import { loadLoginScreen } from "./LoginScreen.js";

export function loadResultsScreen(container, bmr, tdee) {
  container.innerHTML = `
    <section id="results-screen" class="screen">
      <h2>Results</h2>
      <div id="results">
        <p>Your Basal Metabolic Rate (BMR) is ${bmr.toFixed(2)} kcal/day.</p>
        <p>Your Total Daily Energy Expenditure (TDEE) with adjustments is ${tdee.toFixed(
          2
        )} kcal/day.</p>
      </div>
      <button id="restart-btn">Restart Quiz</button>
    </section>
  `;

  const restartBtn = document.getElementById("restart-btn");
  restartBtn.addEventListener("click", () => restartQuiz(container));
}

function restartQuiz(container) {
  loadLoginScreen(container);
}
