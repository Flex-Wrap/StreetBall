import { addMatch, Match, getMatches } from "../javascript/firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    // Populate the court picker
    const courtsData = JSON.parse(localStorage.getItem('courtsData'));
    const courtPicker = document.getElementById('match-court');

    if (courtPicker && courtsData.length > 0) {
        courtsData.forEach(court => {
            const option = document.createElement('option');
            option.value = court.name;
            option.textContent = court.name;
            courtPicker.appendChild(option);
        });
    }

    // Extract the 'court' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourt = urlParams.get('court');

    // Auto-select the court in the picker if it's not 'ALL'
    if (selectedCourt && selectedCourt !== 'ALL') {
        const matchingOption = Array.from(courtPicker.options).find(option => option.value === selectedCourt);
        if (matchingOption) {
            courtPicker.value = selectedCourt;
        }
    }

    // Function to check if the input is valid
    function isValidDate(value) {
        return !isNaN(Date.parse(value)); // Check if the date is valid
    }

    function isValidTime(value) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm format
        return timeRegex.test(value);
    }

    // Add event listeners to the date and time inputs
    const dateInput = document.getElementById("match-date");
    const startTimeInput = document.getElementById("match-start");
    const endTimeInput = document.getElementById("match-end");

    // Add change and input listeners for validation
    [dateInput, startTimeInput, endTimeInput].forEach((input) => {
        input.style.color = "gray";
        input.addEventListener("input", () => {
            if (
                (input.type === "date" && isValidDate(input.value)) ||
                (input.type === "time" && isValidTime(input.value))
            ) {
                input.style.color = "white"; // Valid input
            } else {
                input.style.color = "gray"; // Invalid input
            }
        });
    });

    const createButton = document.getElementById('btn-create-match');

    if (createButton) {
        createButton.addEventListener('click', async () => {
            // Get form values
            const matchName = document.getElementById("match-name").value;
            const matchCourt = document.getElementById("match-court").value;
            const matchDate = document.getElementById("match-date").value;
            const matchStart = document.getElementById("match-start").value;
            const matchEnd = document.getElementById("match-end").value;
            const matchDescription = document.getElementById("match-description").value.trim();

            // Validation
            if (!matchName || !matchCourt || !matchDate || !matchStart || !matchEnd) {
                alert("Please fill in all required fields.");
                return;
            }

            if (new Date(`${matchDate}T${matchStart}`) >= new Date(`${matchDate}T${matchEnd}`)) {
                alert("End time must be after start time.");
                return;
            }

            // Validate against existing matches
            const isAvailable = await isValidMatch(matchDate, matchStart, matchEnd, matchCourt);

            if (!isAvailable) {
                alert("The selected time and court are already booked. Please choose a different time or court.");
                return;
            }

            // Create a new Match object
            const newMatch = new Match(
                matchCourt,
                matchDate,
                matchDescription,
                matchEnd,
                matchName,
                [], // Players array is initially empty
                matchStart
            );

            // Add match to Firestore
            try {
                matchId = await addMatch(newMatch);
                alert("Match created successfully!");
                const serializedMatch = encodeURIComponent(JSON.stringify({
                    ...newMatch,
                    id: matchId // Include the match ID in the serialized object
                }));

                // Redirect to match.html with the serialized match object in the query string
                window.location.href = `match.html?match=${serializedMatch}`;
            } catch (error) {
                console.error("Error creating match: ", error);
                alert("An error occurred while creating the match. Please try again.");
            }
        });
    }
});

const backButton = document.querySelector('.btn-back');

if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.back();  // Go back to the previous page in the browser history
  });
}

async function isValidMatch(date, startTime, endTime, court) {
    try {
        const matches = await getMatches(); // Fetch all matches

        // Convert input date to a Date object
        const startTimeObj = new Date(`${date}T${startTime}`);
        const endTimeObj = new Date(`${date}T${endTime}`);

        // Filter matches for the same day
        const matchesOnDay = matches.filter(match => match.Date === date);

        // Filter matches for the same court
        const matchesOnCourt = matchesOnDay.filter(match => match.Court === court);

        // Check for overlapping times
        const hasOverlap = matchesOnCourt.some(match => {
            
            // Create Date objects for the match's start and end time
            const matchStartTime = new Date(`${match.Date}T${match.StartTime}`);
            const matchEndTime = new Date(`${match.Date}T${match.EndTime}`);

            // Check for overlap: new match starts before an existing match ends 
            // and ends after an existing match starts
            return (
                startTimeObj < matchEndTime && 
                endTimeObj > matchStartTime
            );
        });

        return !hasOverlap; // Return true if no overlaps, false otherwise
    } catch (error) {
        console.error("Error validating match: ", error);
        return false; // Return false if an error occurs
    }
}
