import { auth } from "./firebase-connection.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
    document.getElementById("user-name").textContent = user.displayName;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-photo").src = user.photoURL;
    
    } else {
    // Redirect to login if not signed in
    window.location.href = "login.html";
    }
});