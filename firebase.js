const firebaseConfig = {
  apiKey: "AIzaSyBWnf8zHTl0nHvgLlxjDrmTlg74wZCRhv8",
  authDomain: "lotmore-store.firebaseapp.com",
  projectId: "lotmore-store",
  storageBucket: "lotmore-store.firebasestorage.app",
  messagingSenderId: "129844135487",
  appId: "1:129844135487:web:c65d1d938192c17191da8a",
  measurementId: "G-FFD2RT7N8J"
};

// INIT FIREBASE
firebase.initializeApp(firebaseConfig);

// SERVICES
const auth = firebase.auth();
const db = firebase.firestore();