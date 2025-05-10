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
  const chatContainer = document.getElementById("chat-container");

  if (!loadingMessage) {
    console.error("Loading message element not found");
    return;
  }

  // Show loading message
  loadingMessage.style.display = "block";

  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp"));

  const querySnapshot = await getDocs(q);

  chatContainer.innerHTML = ""; // clear existing messages

  querySnapshot.forEach((doc) => {
    const message = doc.data();
    const { senderId, receiverId, text } = message;

    console.log("Fetched message:", { senderId, receiverId, text });

    if (
      (senderId === currentUserId && receiverId === linkedPartnerId) ||
      (senderId === linkedPartnerId && receiverId === currentUserId)
    ) {
      console.log("✔ This message is between the current user and partner");
      displayMessage(message);
    }
  });

  // Hide loading message after messages are fetched
  loadingMessage.style.display = "none";
}


function listenForMessages() {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp"));

  onSnapshot(q, (querySnapshot) => {
    const chatContainer = document.getElementById("chat-container");
    if (!chatContainer) return;

    chatContainer.innerHTML = ""; // Clear previous messages

    querySnapshot.forEach((doc) => {
      const message = doc.data();
      const { senderId, recipientId, text } = message;

      console.log("Realtime message:", { senderId, recipientId, text });

      if (
        (senderId === currentUserId && recipientId === linkedPartnerId) ||
        (senderId === linkedPartnerId && recipientId === currentUserId)
      ) {
        console.log("✔ Realtime: This message is between the current user and partner");
        displayMessage(message);
      }
    });

  });
}

function displayMessage(message) {
  const chatContainer = document.getElementById("chat-container");
  if (!chatContainer) {
    console.error("Chat container is not defined");
    return;
  }

  // Create the message wrapper
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("p-dashboard__content__message");

  // Create the message body
  const messageBody = document.createElement("div");
  messageBody.classList.add("p-dashboard__content__message__body");

  // Header for the message
  const header = document.createElement("p");
  header.classList.add("p-dashboard__content__message__body__header");
  header.textContent = message.header || "Message Heading"; // Can be a dynamic field or static

  // Body for the message
  const body = document.createElement("p");
  body.classList.add("p-dashboard__content__message__body__body");
  body.textContent = message.text || "Message content goes here."; // The actual message content

  // Tags (if any)
  const tagsContainer = document.createElement("div");
  tagsContainer.classList.add("p-dashboard__content__message__tags");

  const tag1 = document.createElement("p");
  tag1.classList.add("p-dashboard__content__message__tags__txt");
  tag1.textContent = "Tag1"; // You can dynamically add tags here

  const tag2 = document.createElement("p");
  tag2.classList.add("p-dashboard__content__message__tags__txt");
  tag2.textContent = "Tag2"; // Similarly, dynamic tags can be added

  tagsContainer.appendChild(tag1);
  tagsContainer.appendChild(tag2);

  // User details section
  const userDetails = document.createElement("div");
  userDetails.classList.add("p-dashboard__content__message__user-details");

  const date = document.createElement("p");
  date.textContent = new Date().toLocaleDateString(); // You can adjust date formatting here

  const time = document.createElement("p");
  time.textContent = new Date().toLocaleTimeString(); // Adjust time format as needed

  const userName = document.createElement("p");
  userName.textContent = message.userName || "User Name"; // Dynamic username

  const userEmail = document.createElement("p");
  userEmail.style.display = "none"; // Hidden, you can choose to reveal this later if needed
  userEmail.textContent = message.userEmail || "user@example.com"; // Dynamic email

  const userPhoto = document.createElement("img");
  userPhoto.classList.add("p-dashboard__content__message__user-details__img");
  userPhoto.src = message.userPhoto || "./assets/img/dashboard/icon-user.svg"; // Dynamic photo

  userDetails.appendChild(date);
  userDetails.appendChild(time);
  userDetails.appendChild(userName);
  userDetails.appendChild(userEmail);
  userDetails.appendChild(userPhoto);

  // Append everything together
  messageBody.appendChild(header);
  messageBody.appendChild(body);
  messageBody.appendChild(tagsContainer);
  messageBody.appendChild(userDetails);
  messageWrapper.appendChild(messageBody);
  chatContainer.appendChild(messageWrapper);
}

