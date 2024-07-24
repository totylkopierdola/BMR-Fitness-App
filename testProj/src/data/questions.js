export const questions = [
  {
    question: "What is your current activity level?",
    options: [
      "Sedentary",
      "Lightly Active",
      "Moderately Active",
      "Very Active",
    ],
    name: "activityLevel",
  },
  {
    question: "What is your primary fitness goal?",
    options: ["Lose Weight", "Gain Muscle", "Maintain Weight"],
    name: "fitnessGoal",
  },
  {
    question: "Your Weight (kg)",
    range: {
      min: 0,
      max: 200,
      step: 1,
      default: 70,
    },
    name: "weight",
  },
  {
    question: "Your Height (cm)",
    range: {
      min: 100,
      max: 250,
      step: 1,
      default: 165,
    },
    name: "height",
  },
  {
    question: "Your Age",
    range: {
      min: 0,
      max: 120,
      step: 1,
      default: 25,
    },
    name: "age",
  },
  {
    question: "Your Gender",
    options: ["Male", "Female"],
    name: "gender",
  },
];
