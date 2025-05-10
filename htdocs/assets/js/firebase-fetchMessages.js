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

let currentUserId = null;
let linkedPartnerId = null;

// ✅ Wait for user auth before doing anything
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;

    const userDocRef = doc(db, "users", currentUserId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      linkedPartnerId = userDocSnap.data().partnerId;

      console.log("currentUserId:", currentUserId);
      console.log("linkedPartnerId:", linkedPartnerId);

      // ✅ Start fetching and listening only after user and partner are known
      fetchMessages();
      listenForMessages();
    } else {
      console.error("User document not found");
    }
  } else {
    console.log("User is not signed in.");
  }
});

async function fetchMessages() {
  const loadingMessage = document.getElementById("loading-message");
  const chatContainer = document.getElementById("p-dashboard__content__message-container");

  if (!loadingMessage || !chatContainer) {
    console.error("Missing elements");
    return;
  }

  loadingMessage.style.display = "block";

  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc")); // Already sorted

  const querySnapshot = await getDocs(q);

  chatContainer.innerHTML = "";

  for (const docSnap of querySnapshot.docs) {
    const message = docSnap.data();
    const { senderId, receiverId, type } = message;

    const isDirectMessage =
      (senderId === currentUserId && receiverId === linkedPartnerId) ||
      (senderId === linkedPartnerId && receiverId === currentUserId);

    const isRandomAnswer =
      type === "randomAnswer" &&
      (senderId === currentUserId || senderId === linkedPartnerId);

    if (isDirectMessage || isRandomAnswer) {
      await displayMessage(message);
    }
  }

  loadingMessage.style.display = "none";
}



function listenForMessages() {
  const messagesRef = collection(db, "messages");
  const answerstoRandomRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc"));

  onSnapshot(q, (querySnapshot) => {
    const chatContainer = document.getElementById("p-dashboard__content__message-container");
    if (!chatContainer) return;

    chatContainer.innerHTML = ""; // Clear previous messages

    querySnapshot.forEach((doc) => {
      const message = doc.data();
      const { senderId, recipientId, text } = message;

      if (
        (senderId === currentUserId && recipientId === linkedPartnerId) ||
        (senderId === linkedPartnerId && recipientId === currentUserId)
      ) {
        displayMessage(message);
      }
    });

  });
}

async function displayMessage(message) {
  const { senderId } = message; // ✅ Add this line

  const chatContainer = document.getElementById("p-dashboard__content__message-container");
  if (!chatContainer) {
    console.error("Chat container is not defined");
    return;
  }

  const senderDocRef = doc(db, "users", senderId);
  const senderDocSnap = await getDoc(senderDocRef);
  const senderName = senderDocSnap.exists() ? senderDocSnap.data().name : "Unknown Sender";


  // Create the message wrapper
  const messageWrapper = document.createElement("button");
  messageWrapper.classList.add("p-dashboard__content__message");
  messageWrapper.setAttribute("type", "button");

  // Optional: store full message in a data attribute or variable
  const fullMessage = message.text || "No content";

  messageWrapper.onclick = () => {
    showModal(fullMessage);
  };


  // Create the message body
  const messageBody = document.createElement("div");
  messageBody.classList.add("p-dashboard__content__message__body");

  // Body for the message
  const body = document.createElement("p");
  body.classList.add("p-dashboard__content__message__body__body");
  body.textContent = message.text || "Message content goes here."; // The actual message content

  // Tags (if any)
  const tagsContainer = document.createElement("div");
  tagsContainer.classList.add("p-dashboard__content__message__tags");

  // User details section
  const userDetails = document.createElement("div");
  userDetails.classList.add("p-dashboard__content__message__user-details");

  const timestamp = message.timestamp;

  let formattedDate = "Unknown Time";

  if (timestamp && timestamp.toDate) {
    const dateObj = timestamp.toDate(); // Convert Firestore Timestamp to JS Date

    formattedDate = dateObj.toLocaleString("en-US", {
      dateStyle: "medium",   // e.g., "May 10, 2025"
      timeStyle: "short"     // e.g., "3:05 PM"
    });
  }


  const date = document.createElement("p");
  date.textContent = formattedDate;


  const userName = document.createElement("p");
  userName.textContent = senderName; // ✅ Use the actual sender's name fetched above


  const userPhoto = document.createElement("img");
  userPhoto.classList.add("p-dashboard__content__message__user-details__img");
  userPhoto.src = message.userPhoto || "./assets/img/dashboard/icon-user.svg"; // Dynamic photo

  userDetails.appendChild(date);
  userDetails.appendChild(userName);
  userDetails.appendChild(userPhoto);

  // Append everything together
  messageBody.appendChild(body);
  messageBody.appendChild(tagsContainer);
  messageBody.appendChild(userDetails);
  messageWrapper.appendChild(messageBody);
  chatContainer.appendChild(messageWrapper);
}

function showModal(messageText) {
  const modal = document.getElementById("message-modal");
  const modalText = document.getElementById("modal-text");

  modalText.textContent = messageText;
  modal.style.display = "block";
}

// Optional: Close handler
document.getElementById("modal-close").onclick = function () {
  document.getElementById("message-modal").style.display = "none";
};


