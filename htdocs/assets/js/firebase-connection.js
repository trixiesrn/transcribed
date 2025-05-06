// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
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
console.log(app);
console.log(analytics);