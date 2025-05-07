// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyAdzLcI-ZtYaXv9WQvtStuVBL_GgeHwWFE",
authDomain: "transcribed-1f943.firebaseapp.com",
projectId: "transcribed-1f943",
storageBucket: "transcribed-1f943.firebasestorage.app",
messagingSenderId: "307728953883",
appId: "1:307728953883:web:c939c70909f6ba210d3ebe",
measurementId: "G-W9MSGKDZYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);

googleLoginBtn.addEventListener('click', (e) => {
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    if (user) {
      window.location.href = "dashboard.html";
    } else {
      // Redirect to login if not signed in
      window.location.href = "login.html";
    }
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...

    alert(errorMessage)
  }); 

  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("user-name").textContent = user.displayName;
      document.getElementById("user-email").textContent = user.email;
      document.getElementById("user-photo").src = user.photoURL;
    } else {
      // Redirect to login if not signed in
      window.location.href = "index.html";
    }
  });
});

export { auth };