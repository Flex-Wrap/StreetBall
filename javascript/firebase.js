import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlmvi2eCvmmlcdI5jrgIJq9C4nhIMCwDg",
  authDomain: "streetball-8d7a1.firebaseapp.com",
  projectId: "streetball-8d7a1",
  storageBucket: "streetball-8d7a1.firebasestorage.app",
  messagingSenderId: "868275049109",
  appId: "1:868275049109:web:be76eddd04027097a7c19c",
  measurementId: "G-HTVDJQTCJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Match class for structure
class Match {
  constructor(court, date, description, endTime, name, players, startTime) {
    this.Court = court;
    this.Date = date;
    this.Description = description;
    this.EndTime = endTime;
    this.Name = name;
    this.Players = players;  // Array of player names
    this.StartTime = startTime;
  }
}

// Function to add a match to Firestore
const addMatch = async (match) => {
  try {
    // Add the match document to the "Matches" collection
    const docRef = await addDoc(collection(db, "Matches"), {
      Court: match.Court,
      Date: match.Date,
      Description: match.Description,
      EndTime: match.EndTime,
      Name: match.Name,
      Players: match.Players,
      StartTime: match.StartTime
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding match: ", error);
  }
};

// Function to get all matches from Firestore
const getMatches = async () => {
  try {
    const matchesCollection = collection(db, "Matches");
    const snapshot = await getDocs(matchesCollection);
    const matchesList = snapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id }; // Return the match data and include the doc ID
    });
    return matchesList;
  } catch (error) {
    console.error("Error fetching matches: ", error);
    return [];
  }
};

// Export functions and the Match class for use in other files
export { db, addMatch, getMatches, Match };

