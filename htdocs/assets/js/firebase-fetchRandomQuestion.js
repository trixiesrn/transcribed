import { auth, db } from "./firebase-connection.js";
import {
  collection,
  query,
  orderBy,
  getDoc,
  getDocs,
  doc,
  onSnapshot, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

let currentQuestion = null;

let previousIndex = -1;

async function showRandomQuestionModal() {
  const querySnapshot = await getDocs(collection(db, "random_questions"));
  const questions = [];

  querySnapshot.forEach((doc) => {
    questions.push({ id: doc.id, ...doc.data() });
  });

  if (questions.length === 0) {
    alert("No questions available.");
    return;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * questions.length);
  } while (randomIndex === previousIndex && questions.length > 1);

  previousIndex = randomIndex;
  currentQuestion = questions[randomIndex];

  const questionElement = document.querySelector(".c-modal__content__body__content__text__question");

  if (questionElement) {
    questionElement.textContent = currentQuestion.question;
  } else {
    console.error("Question element not found in the DOM.");
  }

  document.getElementById("answerRandomQuestionContainer").style.display = "block";
}


document.addEventListener("DOMContentLoaded", () => {
  const skipButton = document.getElementById("skipQuestionButton");
  if (skipButton) {
    skipButton.addEventListener("click", () => {
      const confirmed = confirm("Are you sure you want to skip this question?");
      if (confirmed) {
        showRandomQuestionModal();
      }
    });
  }
});

async function submitAnswer() {
  const answerInput = document.getElementById("randomAnswerInput");
  const answerText = answerInput.value.trim();

  if (!answerText) {
    alert("Please type an answer.");
    return;
  }

  if (!currentQuestion) {
    alert("No question selected.");
    return;
  }

  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  try {
    await addDoc(collection(db, "random_question_answers"), {
      questionId: currentQuestion.id,
      answer: answerText,
      userId: userId,
      timestamp: serverTimestamp()
    });

    alert("Answer submitted!");

    answerInput.value = ""; // Clear input
    showRandomQuestionModal(); // Optionally load the next question
  } catch (error) {
    console.error("Error submitting answer:", error);
    alert("Failed to submit. Try again.");
  }
}



export { showRandomQuestionModal, submitAnswer };
