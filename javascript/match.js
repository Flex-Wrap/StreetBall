import { db, getMatches } from './firebase.js'; // Import Firebase functions
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // Import Firestore updateDoc

// Get the match data from the URL
const urlParams = new URLSearchParams(window.location.search);
const matchData = urlParams.get('match');
let match;

// Parse the match data if it's available
if (matchData) {
    match = JSON.parse(decodeURIComponent(matchData));

    // Fill the HTML elements with match data
    const courtDiv = document.querySelector('.court-container');
    courtDiv.innerHTML = `<p id="match-start">${match.StartTime}</p><p id="court-name">${match.Court}</p>`;
    document.getElementById("match-name").textContent = match.Name || "No Match Name";  // Set match name
    document.getElementById("match-description").textContent = match.Description || "No Description";  // Set match description

    // Display match line-up (players)
    const contentDiv = document.querySelector('.content');
    if (match.Players.length > 0) {
        const playersList = match.Players.map(player => `<p class="text-sub-header">${player}</p>`).join('');
        contentDiv.innerHTML = playersList;
    } else {
        contentDiv.innerHTML = `<p class="no-player">No players yet.</p>`;
    }

} else {
    console.error("No match data found in URL.");
}

// Back button functionality
const backButton = document.querySelector('.btn-back');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.back();  // Go back to the previous page in the browser history
  });
}

// Get the overlay and its elements
const overlay = document.getElementById('overlay');
const btnJoinOverlay = document.getElementById('btn-join-overlay');
const playerNameInput = document.getElementById('player-name');

// Join button functionality - when clicked, show the overlay
const joinButton = document.getElementById('btn-join');
if (joinButton) {
    joinButton.addEventListener('click', () => {
        overlay.style.display = 'flex';  // Show the overlay
    });
}

// Join overlay button functionality - when clicked, take action
if (btnJoinOverlay) {
    btnJoinOverlay.addEventListener('click', async () => {
        const playerName = playerNameInput.value.trim();
        
        if(playerName.toLowerCase() === "hitler"){
          alert("You little fucker :)");
          return;
        }

        if (playerName) {
            // Fetch all matches from Firestore and find the current match by its Name, Court, and StartTime
            try {
                const matchesList = await getMatches();
                
                // Find the match that matches the current match details
                const currentMatch = matchesList.find(m => m.id === match.id);
                
                if (currentMatch) {
                    // Add the new player to the match's player list
                    currentMatch.Players.push(playerName);
                    console.log("the id: "+currentMatch.id);
                    // Update the match document in Firestore with the new list of players
                    await updateMatchPlayers(currentMatch, currentMatch.Players);

                    // Show the updated list of players in the UI
                    const contentDiv = document.querySelector('.content');
                    contentDiv.innerHTML = currentMatch.Players.map(player => `<p class="text-sub-header">${player}</p>`).join('');
                    
                    // Hide the overlay after joining
                    overlay.style.display = 'none';
                    playerNameInput.value = '';  // Optionally, clear the input
                } else {
                    alert("Match not found.");
                }
            } catch (error) {
                console.error("Error joining match:", error);
                alert("Error joining match.");
            }
        } else {
            alert("Please enter your name to join.");
        }
    });
}

// Function to update the match players list in Firestore
const updateMatchPlayers = async (match, players) => {
    try {
        // Locate the match document by matching fields (Court, Date, Name, etc.)
        console.log("the id: "+match.id);
        const matchRef = doc(db, "Matches", match.id);  // Here `match.id` should be the Firestore document ID.
        console.log("the matchRef: "+matchRef);
        // Update the match document with the new list of players
        await updateDoc(matchRef, {
            Players: players
        });
        console.log("Match players updated successfully.");
    } catch (error) {
        console.error("Error updating match players:", error);
    }
};

// Close the overlay if the user clicks outside the overlay content
overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        overlay.style.display = 'none';  // Hide the overlay
    }
});
