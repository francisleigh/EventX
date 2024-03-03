import { Platform } from "react-native";
import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const appId = Platform.select({
  ios: "1:410380259796:ios:2fb1914ffbb7822795c641",
  android: "1:410380259796:android:02a831ae5fb0c86895c641",
  web: "1:410380259796:web:6710878203ce4b0295c641",
});
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaB2JtskSqcgFASlVtV8S6acW_LfRxVcM",
  authDomain: "eventx-95742.firebaseapp.com",
  projectId: "eventx-95742",
  storageBucket: "eventx-95742.appspot.com",
  messagingSenderId: "410380259796",
  appId,
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

export const auth = getAuth(app);
export default app;
