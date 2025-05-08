import { auth, provider, GoogleAuthProvider, signInWithPopup } from "./firebase-connection.js";

const googleLoginBtn = document.getElementById('googleLoginBtn');

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
});
