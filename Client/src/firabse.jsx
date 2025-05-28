import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "***********************",
  authDomain: "recommendationsystem-ae8b5.firebaseapp.com",
  projectId: "recommendationsystem-ae8b5",
  storageBucket: "recommendationsystem-ae8b5.appspot.com",
  messagingSenderId: "826303939239",
  appId: "1:826303939239:web:c640c76adf2dcbe04f1182",
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
