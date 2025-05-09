import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAdzLcI-ZtYaXv9WQvtStuVBL_GgeHwWFE",
  authDomain: "transcribed-1f943.firebaseapp.com",
  projectId: "transcribed-1f943",
  storageBucket: "transcribed-1f943.appspot.com", // <-- fix: ".app" to ".com"
  messagingSenderId: "307728953883",
  appId: "1:307728953883:web:c939c70909f6ba210d3ebe",
  measurementId: "G-W9MSGKDZYW"
};

// Initialize
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { app, auth, provider, GoogleAuthProvider, signInWithPopup, db };
