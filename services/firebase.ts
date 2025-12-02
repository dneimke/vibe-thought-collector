import { initializeApp } from "firebase/app"; 
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  getDocs,
  orderBy,
  deleteDoc
} from "firebase/firestore";
import { Thought, FavoriteSummary } from '../types';

// IMPORTANT: Replace this with your own Firebase configuration
// from your Firebase project settings.
// Import the functions you need from the SDKs you need import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWk02vPsuHw-RzThUvvX0QdF4meZNJ2Pk",
  authDomain: "thought-collector.firebaseapp.com",
  projectId: "thought-collector",
  storageBucket: "thought-collector.firebasestorage.app",
  messagingSenderId: "1098709209149",
  appId: "1:1098709209149:web:a02f8190da6039f7ccda54"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- AUTHENTICATION ---

export const signInWithGoogle = () => signInWithRedirect(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const onAuthStateChangedListener = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);

// --- FIRESTORE DATA HELPERS ---

// Helper to get user document reference
const getUserDocRef = (userId: string) => doc(db, 'users', userId);

// --- THOUGHTS ---
export const addThoughtToFirestore = async (userId: string, thought: Thought) => {
    const userDocRef = getUserDocRef(userId);
    const thoughtDocRef = doc(userDocRef, 'thoughts', thought.id);
    await setDoc(thoughtDocRef, thought);
};

export const fetchThoughtsFromFirestore = async (userId: string): Promise<Thought[]> => {
    const thoughtsColRef = collection(getUserDocRef(userId), 'thoughts');
    const q = query(thoughtsColRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Thought);
};

// --- FAVORITE SUMMARIES ---
export const addFavoriteToFirestore = async (userId: string, favorite: FavoriteSummary) => {
    const favDocRef = doc(getUserDocRef(userId), 'favorites', favorite.id);
    await setDoc(favDocRef, favorite);
};

export const removeFavoriteFromFirestore = async (userId: string, favoriteId: string) => {
    const favDocRef = doc(getUserDocRef(userId), 'favorites', favoriteId);
    await deleteDoc(favDocRef);
};

export const fetchFavoritesFromFirestore = async (userId: string): Promise<FavoriteSummary[]> => {
    const favsColRef = collection(getUserDocRef(userId), 'favorites');
    const q = query(favsColRef, orderBy('favoritedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FavoriteSummary);
};
