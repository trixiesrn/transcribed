import { auth, provider, GoogleAuthProvider, signInWithPopup, db } from './firebase-connection.js';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const acceptBtn = document.getElementById('acceptInviteBtn');


const urlParams = new URLSearchParams(window.location.search);
const inviterUid = urlParams.get('uid');

if (!inviterUid) {
  alert("Invalid invite link.");
}

acceptBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const partnerUser = result.user;
    const partnerRef = doc(db, "users", partnerUser.uid);
    const inviterRef = doc(db, "users", inviterUid);

    const [inviterSnap, partnerSnap] = await Promise.all([
      getDoc(inviterRef),
      getDoc(partnerRef)
    ]);

    if (!inviterSnap.exists()) {
      alert("Inviter does not exist.");
      return;
    }

    const inviterData = inviterSnap.data();

    if (inviterData.partnerId) {
      alert("This invite has already been accepted by someone.");
      return;
    }

    // Create partner's user document if it doesn't exist
    if (!partnerSnap.exists()) {
      await setDoc(partnerRef, {
        name: partnerUser.displayName,
        email: partnerUser.email,
        partnerId: inviterUid
      });
    } else {
      await updateDoc(partnerRef, { partnerId: inviterUid });
    }

    // Update inviter to set their partnerId too
    await updateDoc(inviterRef, { partnerId: partnerUser.uid });

    alert("Invite accepted! You are now connected.");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
});
