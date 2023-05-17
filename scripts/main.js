/* JavaScript Document */

const startQuizAndScoreDiv = document.querySelector(`#startQuizAndScoreDiv`);
const scoreDiv = document.querySelector(`#scoreDiv`);
const scoreText = document.querySelector(`.scoreText`);
const startQuizBtn = document.querySelector(`#startQuizBtn`);
const QandABox = document.querySelector(`#QandABox`);
const questionDiv = document.querySelector(`#questionDiv`);
const answersDiv = document.querySelector(`#answersDiv`);
const nextBtn = document.querySelector(`#nextBtn`);

const QUIZ_API_URL =
  `https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple`;

let currentQuestionIndex = 0;
let score = 0;
let questions;

scoreDiv.style.display = `none`;
QandABox.style.display = `none`;
nextBtn.style.display = `none`;

async function getQuestions() {
  const fetchQuestionsResponse = await fetch(QUIZ_API_URL);
  const fetchQuestionsObj = await fetchQuestionsResponse.json();
  const fetchQuestions = fetchQuestionsObj.results;
  const questions = new Array();

  fetchQuestions.forEach((value, index) => {
    const questionIndex = index;
    const question = value.question;
    const correctAnswer = value.correct_answer;
    const answers = value.incorrect_answers;
    answers.push(correctAnswer);
    answers.sort(() => Math.random() - 0.5);
    const questionObj = { questionIndex, question, correctAnswer, answers };
    questions.push(questionObj);
  });
  return questions;
}

async function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextBtn.style.display = `none`;
  nextBtn.innerText = `Next`;
  answersDiv.innerHTML = ``;
  questionDiv.innerHTML = ``;
  questions = await getQuestions();
  setQuestions(questions);
}

function setQuestions(questions) {
  const questionToShow = questions[currentQuestionIndex];
  if (currentQuestionIndex === questions.length) showScore();
  if (currentQuestionIndex === questions.length - 1)
    nextBtn.innerText = `Submit`;
  showQuestions(questionToShow);
}

function showQuestions({ questionIndex, question, answers }) {
  answersDiv.innerHTML = ``;
  questionDiv.innerHTML = `Q.${questionIndex + 1} ${question}`;
  answers.forEach((value) => {
    const answers = document.createElement(`div`);
    answers.classList.add(`answers`);
    answers.setAttribute(`data-index`, questionIndex);
    answers.innerText = value;
    answersDiv.appendChild(answers);
  });
  startQuizAndScoreDiv.style.display = `none`;
  QandABox.style.display = `block`;
}

answersDiv.addEventListener(`click`, (e) => {
  if (e.target.className === `answers`) {
    answersDiv.className = `disabled`;

    const selectedQuestionIndex = e.target.getAttribute(`data-index`);
    const selectedAnswer = e.target.innerText;
    const selectedQuestion = questions[selectedQuestionIndex];
    if (selectedQuestion.correctAnswer !== selectedAnswer) {
      e.target.classList.add(`false`);
      const allChoiches = answersDiv.childNodes;
      allChoiches.forEach((v) => {
        if (v.innerText === selectedQuestion.correctAnswer)
          v.classList.add(`true`);
      });
      currentQuestionIndex++;
    } else {
      e.target.classList.add(`true`);
      currentQuestionIndex++;
      score++;
    }
    nextBtn.style.display = `block`;
    nextBtn.addEventListener(`click`, (e) => {
      nextBtn.style.display = `none`;
      answersDiv.className = ``;
      setQuestions(questions);
    });
  }
});

function showScore() {
  QandABox.style.display = `none`;
  startQuizAndScoreDiv.style.display = `block`;
  startQuizBtn.innerText = `More Quizes`;
  scoreDiv.style.display = `block`;
  scoreText.innerText = score;
}

startQuizBtn.addEventListener(`click`, startQuiz);
