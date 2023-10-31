import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyBG98H7GyrDC9efMb_caVMuxuBpoJouWj8",
    authDomain: "medinet-1a602.firebaseapp.com",
    projectId: "medinet-1a602",
    storageBucket: "medinet-1a602.appspot.com",
    messagingSenderId: "92133490188",
    appId: "1:92133490188:web:fbaa9c4f48f9538d717829",
    measurementId: "G-PMNS3Q9F6G"
  };

const Firebase = initializeApp(firebaseConfig);
const auth = getAuth(Firebase);
const storage = getStorage(Firebase)

export { Firebase, auth, storage };