import { initializeApp } from "firebase/app"; //앱초기화
import { getAuth } from "firebase/auth"; //인증처리
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KET,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP__PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP__MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP__APP_ID
};

const app = initializeApp(firebaseConfig);

// export default app;
export const authService = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);