import { auth, db } from "./firebase-connection.js";
import { collection, doc, getDoc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

let currentUserId = null;
let linkedPartnerId = null;

// Monitor authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;
    const userDocRef = doc(db, "users", currentUserId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      linkedPartnerId = userDocSnap.data().partnerId;

      // Log values for debugging
      console.log("currentUserId:", currentUserId);
      console.log("linkedPartnerId:", linkedPartnerId);
    } else {
      console.error("User document not found");
    }
  } else {
    console.log("User is not signed in.");
  }
});

async function sendMessage() {
  const textarea = document.getElementById("sendMessagetxtarea");
  const text = textarea.value.trim();

  if (!text) {
    alert("Please enter a message.");
    return;
  }

  if (!currentUserId || !linkedPartnerId) { 
    alert("User or partner not identified.");
    return;
  }

  const chatId = [currentUserId, linkedPartnerId].sort().join("_");

  try {
    // Adding a new message to Firestore
    await addDoc(collection(db, "messages"), {
      chatId: chatId, // Adding chatId for easier message fetching later
      senderId: currentUserId,
      recipientId: linkedPartnerId,
      text: text,
      status: "unread", // Initial message status
      timestamp: serverTimestamp(),
    });

    // Clear textarea and alert the user
    textarea.value = "";
    alert("Message sent!");
  } catch (error) {
    console.error("Failed to send message:", error);
    alert("Sending failed.");
  }
}

// Attach event listener to button when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("sendMessageSubmitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", sendMessage);
  }
});
