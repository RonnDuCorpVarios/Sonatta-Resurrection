
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
  import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
  import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, updateDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

  // ═══════════════════════════════════════════
  // CONFIGURACIÓN FIREBASE - SONATTA
  // ═══════════════════════════════════════════
  const firebaseConfig = {
    apiKey: "AIzaSyDM-mTQGFfJDKwWskYnJafCsmlsl_YYZLc",
    authDomain: "sonatta.firebaseapp.com",
    projectId: "sonatta",
    storageBucket: "sonatta.firebasestorage.app",
    messagingSenderId: "263700294848",
    appId: "1:263700294848:web:51122c74cbe209e0ea5125"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  // ═══════════════════════════════════════════
  // ESTADO GLOBAL DE LA APP
  // ═══════════════════════════════════════════
  window.SonattaApp = {
    auth, db, googleProvider,
    currentUser: null,
    songs: [],
    playlists: [],
    currentSong: null,
    currentIndex: -1,
    isPlaying: false,
    queue: [],
    shuffle: false,
    repeat: 'none', // 'none' | 'one' | 'all'
    audio: new Audio(),
    activeView: 'home',
    // Helpers Firebase
    signIn: (email, pass) => signInWithEmailAndPassword(auth, email, pass),
    signUp: (email, pass) => createUserWithEmailAndPassword(auth, email, pass),
    signOut: () => signOut(auth),
    signInGoogle: () => signInWithPopup(auth, googleProvider),
    updateUserProfile: (data) => updateProfile(auth.currentUser, data),
    // Firestore helpers
    saveDoc: (col, id, data) => setDoc(doc(db, col, id), data, { merge: true }),
    getDoc: (col, id) => getDoc(doc(db, col, id)),
    addDoc: (col, data) => addDoc(collection(db, col), data),
    getDocs: (col) => getDocs(collection(db, col)),
    deleteDoc: (col, id) => deleteDoc(doc(db, col, id)),
    updateDoc: (col, id, data) => updateDoc(doc(db, col, id), data),
    query, where, orderBy, collection, doc,
  };

  // ═══════════════════════════════════════════
  // OBSERVER DE AUTH — controla qué pantalla se ve
  // ═══════════════════════════════════════════
  onAuthStateChanged(auth, (user) => {
    window.SonattaApp.currentUser = user;
    if (user) {
      showScreen('homeScreen');
      // Esperar a que el DOM y SonattaUI estén listos
      const tryLogin = () => {
        if (window.SonattaUI && window.SonattaUI.onUserLogin) {
          window.SonattaUI.onUserLogin(user);
        } else {
          setTimeout(tryLogin, 100);
        }
      };
      tryLogin();
    } else {
      showScreen('welcomeScreen');
    }
  });

  window.firebaseReady = true;
  document.dispatchEvent(new Event('firebaseReady'));
