import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAMyLKA1QjRxqRYencwSs1u2vnzuJCyXGc",
  authDomain: "masbah-72093.firebaseapp.com",
  databaseURL: "https://masbah-72093-default-rtdb.firebaseio.com",
  projectId: "masbah-72093",
  storageBucket: "masbah-72093.firebasestorage.app",
  messagingSenderId: "605196126905",
  appId: "1:605196126905:web:1b0ac8e511d9db0d1f2968",
  measurementId: "G-ZXBFLG73HV"
};

// Initialize Firebase cleanly and synchronously
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

export { app, db, auth, storage, firebase };