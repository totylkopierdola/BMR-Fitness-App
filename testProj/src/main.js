import { questions } from "./js/questions";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultsScreen = document.getElementById("results-screen");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const questionNumberEl = document.getElementById("question-number");
  const questionEl = document.getElementById("question");
  const answersForm = document.getElementById("answers");
  const extraCalcToggle = document.getElementById("extra-calc-toggle");
  const resultsEl = document.getElementById("results");
  const resetBtn = document.getElementById("reset-btn");

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

  function handleReset() {
    for (let key in answers) {
      if (answers.hasOwnProperty(key)) {
        answers[key] = null;
      }
    }
    answers.extraCalculationEnabled = false;

    loginScreen.style.display = "block";
    quizScreen.classList.remove("active");
    quizScreen.style.display = "none";
    resultsScreen.style.display = "none";
    currentQuestionIndex = 0;

    document.querySelectorAll("input").forEach((input) => {
      if (input.type === "radio" || input.type === "checkbox") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });

    loadQuestion();
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (loginScreen && quizScreen) {
      loginScreen.style.display = "none";
      quizScreen.classList.add("active");
      quizScreen.style.display = "flex";
      loadQuestion();
    }
  });

  nextBtn.addEventListener("click", handleNextQuestion);
  prevBtn.addEventListener("click", handlePrevQuestion);
  extraCalcToggle.addEventListener("change", (e) => {
    console.log("klik");

    answers.extraCalculationEnabled = e.target.checked;
    console.log("answers", answers);
  });

  function loadQuestion() {
    nextBtn.disabled = true;

    if (questions.length === 0) return;

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
        answers[currentQuestion.name] !== null
          ? answers[currentQuestion.name]
          : currentQuestion.range.default;
      slider.id = currentQuestion.name + "-slider";

      const input = document.createElement("input");
      input.classList.add("metrics-input");
      input.type = "number";
      input.min = currentQuestion.range.min;
      input.max = currentQuestion.range.max;
      input.step = currentQuestion.range.step;
      input.value =
        answers[currentQuestion.name] !== null
          ? answers[currentQuestion.name]
          : currentQuestion.range.default;
      input.id = currentQuestion.name + "-input";

      function updateAnswer() {
        answers[currentQuestion.name] = parseInt(input.value, 10);
        nextBtn.disabled = false;
      }

      slider.addEventListener("input", () => {
        input.value = slider.value;
        updateAnswer();
      });

      input.addEventListener("input", () => {
        slider.value = input.value;
        updateAnswer();
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
      console.log("answers", answers);
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
    if (
      weight === null ||
      height === null ||
      age === null ||
      gender === null ||
      activityLevel === null
    ) {
      console.error("One or more required answers are missing.");
      return;
    }

    let bmr;
    if (gender === "Male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }

    let tdee = bmr;
    if (answers.extraCalculationEnabled) {
      tdee *= getActivityMultiplier(activityLevel);
      tdee *= 1.1;
    } else {
      tdee *= getActivityMultiplier(activityLevel);
    }

    displayResults(bmr, tdee);
  }

  function getActivityMultiplier(level) {
    switch (level) {
      case "Sedentary":
        return 1.2;
      case "Lightly Active":
        return 1.375;
      case "Moderately Active":
        return 1.55;
      case "Very Active":
        return 1.725;
      default:
        return 1;
    }
  }

  function displayResults(bmr, tdee) {
    quizScreen.style.display = "none";
    resultsScreen.style.display = "block";
    resultsEl.innerHTML = `
      <p>Your Basal Metabolic Rate (BMR) is ${bmr.toFixed(2)} kcal/day.</p>
      <p>Your Total Daily Energy Expenditure (TDEE) with adjustments is ${tdee.toFixed(
        2
      )} kcal/day.</p>
    `;
  }
});
