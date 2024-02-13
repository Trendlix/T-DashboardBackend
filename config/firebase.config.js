// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from '@firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyLwA90ClcT7Yzbm3bS984Q6fsVHyE7vI",
  authDomain: "trendlix-dashboard.firebaseapp.com",
  projectId: "trendlix-dashboard",
  storageBucket: "trendlix-dashboard.appspot.com",
  messagingSenderId: "413276416007",
  appId: "1:413276416007:web:c5a9a834864d98f000a2a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)