import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { app } from "./firebase_core.js";
import { currentUser } from "./firebase_auth.js";

// Initialize Firestore
const db = getFirestore(app);

// Collection name as specified in requirements
const COLLECTION_NAME = "dicegame_collection";

// Save game record to Firestore
export async function saveGameRecord(gameResult) {
  try {
    if (!currentUser) {
      console.error("No user logged in");
      return null;
    }

    // Format data according to required schema
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId: currentUser.uid,
      email: currentUser.email,
      timestamp: serverTimestamp(),
      betType: gameResult.betType, // string "odd", "even", or range like "1-2"
      betAmount: gameResult.betAmount, // number
      diceResult: gameResult.diceResult, // number 1-6
      win: gameResult.win, // boolean
      balance: gameResult.newBalance, // number
    });

    console.log("Game record saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving game record:", error);
    throw error;
  }
}

// Get all game records for current user
export async function getGameRecords() {
  try {
    if (!currentUser) {
      console.error("No user logged in");
      return [];
    }

    console.log("Getting records for email:", currentUser.email);

    // Query by email to match your security rules
    const q = query(
      collection(db, COLLECTION_NAME),
      where("email", "==", currentUser.email),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const records = [];

    querySnapshot.forEach((doc) => {
      records.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Found records:", records.length);
    return records;
  } catch (error) {
    console.error("Error getting game records:", error);
    throw error;
  }
}

// Delete all game records for current user
export async function clearGameRecords() {
  try {
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    // Query by email to match your security rules
    const q = query(
      collection(db, COLLECTION_NAME),
      where("email", "==", currentUser.email)
    );

    const querySnapshot = await getDocs(q);

    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
    console.log("Game records cleared");
  } catch (error) {
    console.error("Error clearing game records:", error);
    throw error;
  }
}
