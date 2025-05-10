import { auth, db, provider, GoogleAuthProvider, signInWithPopup } from "./firebase-connection.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const googleLoginBtn = document.getElementById('googleLoginBtn');
const inviteSection = document.getElementById('inviteSection');
const inviteLinkDisplay = document.getElementById('inviteLink');

googleLoginBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // First-time user
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        partnerId: null
      });

      showInvite(user.uid); // First time, no partner yet
    } else {
      const data = userSnap.data();
      if (!data.partnerId) {
        showInvite(user.uid); // No partner yet
      } else {
        window.location.href = "dashboard.html"; // Already linked to a partner
      }
    }
  } catch (error) {
    const errorMessage = error.message;
    alert("Login failed: " + errorMessage);
  }
});

function showInvite(uid) {
  const link = `${window.location.origin}/invite.html?uid=${uid}`;
  inviteLinkDisplay.textContent = `Invite your partner: ${link}`;
  inviteLinkDisplay.href = link;
  inviteSection.style.display = 'block';
}
