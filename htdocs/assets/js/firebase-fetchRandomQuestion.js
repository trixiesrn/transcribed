import { auth, db } from "./firebase-connection.js";
import {
  collection,
  query,
  orderBy,
  getDoc,
  getDocs,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

let currentQuestion = null;

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

  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];

  document.querySelector(".c-modal__content__body__content__text__question").textContent = currentQuestion.question;
  document.getElementById("answerRandomQuestionContainer").style.display = "block";
}
