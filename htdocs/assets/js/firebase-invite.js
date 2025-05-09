import { auth, db } from './firebase-connection.js'; // adjust path as needed
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Example usage
const token = "abc123";
const user = auth.currentUser;

if (user) {
  await setDoc(doc(db, "invites", token), {
    inviterId: user.uid,
    used: false,
    createdAt: new Date()
  });
}

