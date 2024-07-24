import { questions } from "../data/questions.js";
import { loadLoginScreen } from "./LoginScreen.js";
import { loadResultsScreen } from "./ResultsScreen.js";

export function loadQuizScreen(container) {
  container.innerHTML = `
    <section id="quiz-screen" class="screen" style="display: none">
      <button id="reset-btn">Reset</button>
      <div id="question-container">
        <div id="question-number"></div>
        <div id="question"></div>
        <form id="answers"></form>
      </div>
      <div class="buttons-section">
        <button id="prev-btn" class="nav-btn">Previous</button>
        <button id="next-btn" class="nav-btn">Next</button>
      </div>
      <div class="extra-calc-section">
        <label>
          <input type="checkbox" id="extra-calc-toggle" />
          I'm a professional sportsman (extra calculations)
        </label>
      </div>
    </section>
  `;

  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const resetBtn = document.getElementById("reset-btn");
  const questionNumberEl = document.getElementById("question-number");
  const questionEl = document.getElementById("question");
  const answersForm = document.getElementById("answers");
  const extraCalcToggle = document.getElementById("extra-calc-toggle");

  let currentQuestionIndex = 0;

  const answers = {
    activityLevel: null,
    fitnessGoal: null,
    weight: null,
    height: null,
    age: null,
    gender: null,
    extraCalculationEnabled: false,
  };

  resetBtn.addEventListener("click", handleReset);
  nextBtn.addEventListener("click", handleNextQuestion);
  prevBtn.addEventListener("click", handlePrevQuestion);
  extraCalcToggle.addEventListener("change", (e) => {
    answers.extraCalculationEnabled = e.target.checked;
  });

  function handleReset() {
    currentQuestionIndex = 0;

    Object.keys(answers).forEach((key) => {
      answers[key] = null;
    });

    loadQuestion();
  }

  function loadQuestion() {
    nextBtn.disabled = true;
    const currentQuestion = questions[currentQuestionIndex];
    questionNumberEl.textContent = `${currentQuestionIndex + 1}/${
      questions.length
    }`;
    questionEl.textContent = currentQuestion.question;

    answersForm.innerHTML = "";
    if (currentQuestion.range) {
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = currentQuestion.range.min;
      slider.max = currentQuestion.range.max;
      slider.step = currentQuestion.range.step;
      slider.value =
        answers[currentQuestion.name] || currentQuestion.range.default;
      slider.id = `${currentQuestion.name}-slider`;

      const input = document.createElement("input");
      input.classList.add("metrics-input");
      input.type = "number";
      input.min = currentQuestion.range.min;
      input.max = currentQuestion.range.max;
      input.step = currentQuestion.range.step;
      input.value = answers[currentQuestion.name] || 0;
      input.id = `${currentQuestion.name}-input`;

      slider.addEventListener("input", () => {
        input.value = slider.value;

        answers[currentQuestion.name] = parseInt(input.value, 10);
        nextBtn.disabled = false;
      });

      input.addEventListener("input", () => {
        slider.value = input.value;

        answers[currentQuestion.name] = parseInt(input.value, 10);
        nextBtn.disabled = false;
      });

      answersForm.appendChild(slider);
      answersForm.appendChild(input);
    } else {
      currentQuestion.options.forEach((option, index) => {
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answer");

        const input = document.createElement("input");
        input.type = "radio";
        input.id = `option${index}`;
        input.name = currentQuestion.name;
        input.value = option;
        if (answers[currentQuestion.name] === option) {
          input.checked = true;
          nextBtn.disabled = false;
        }

        const label = document.createElement("label");
        label.setAttribute("for", `option${index}`);
        label.textContent = option;

        answerDiv.appendChild(input);
        answerDiv.appendChild(label);
        answersForm.appendChild(answerDiv);
      });

      answersForm.addEventListener("change", (e) => {
        if (e.target.type === "radio") {
          answers[e.target.name] = e.target.value;
          nextBtn.disabled = false;
        }
      });
    }

    prevBtn.disabled = currentQuestionIndex === 0;
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      calculateResults();
    }
  }

  function handlePrevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion();
    }
  }

  function calculateResults() {
    const { weight, height, age, gender, activityLevel } = answers;
    if (!weight || !height || !age || !gender || !activityLevel) {
      console.error("One or more required answers are missing.");
      return;
    }

    let bmr =
      gender === "Male"
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

    let tdee = bmr * getActivityMultiplier(activityLevel);
    if (answers.extraCalculationEnabled) {
      tdee *= 1.1;
    }

    const quizScreen = document.getElementById("quiz-screen");
    quizScreen.remove();

    loadResultsScreen(container, bmr, tdee);

    const resultsScreen = document.getElementById("results-screen");
    if (resultsScreen) {
      resultsScreen.style.display = "flex";
    } else {
      console.error("Results screen element not found");
    }
  }

  function getActivityMultiplier(level) {
    const multipliers = {
      Sedentary: 1.2,
      "Lightly Active": 1.375,
      "Moderately Active": 1.55,
      "Very Active": 1.725,
    };
    return multipliers[level] || 1;
  }

  loadQuestion();
}
