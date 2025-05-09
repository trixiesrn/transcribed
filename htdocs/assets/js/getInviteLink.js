import { auth, db } from './firebase-connection.js'; // adjust path as needed

document.getElementById('generateInviteBtn').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in");

  // Generate a unique token (simple example)
  const token = Math.random().toString(36).substring(2, 10);

  // Save invite in Firestore
  await db.collection("invites").doc(token).set({
    inviterId: user.uid,
    used: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  const inviteUrl = `${window.location.origin}/invite.html?token=${token}`;
  document.getElementById('inviteLink').textContent = inviteUrl;
});
