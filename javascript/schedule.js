import { getMatches } from './firebase.js'; // Import the function from firebase.js

const getMonthName = (monthNumber) => {
  const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1]; // Adjust for 0-based index
};

// Function to create a day element
const createMonth = (month) => {
  const monthNumber = parseInt(month, 10); // Get the month number (0-based)
  const monthName = getMonthName(monthNumber); // Get the month name from the array
  const dayTitle = document.createElement('p');
  dayTitle.classList.add('month-header');
  dayTitle.classList.add('text-sub-header');
  dayTitle.textContent = monthName; // Display the full month name
  return dayTitle;
};

// Function to create and render a match card
const createMatchCard = (match) => {
    const card = document.createElement('div');
    card.classList.add('match-card');

    // Match Time (Third Column)
    const matchTime = document.createElement('p');
    matchTime.classList.add('match-time');
    matchTime.textContent = `${match.StartTime} - ${match.EndTime}`;
    card.appendChild(matchTime);

    // Match Name (Spans across all 3 columns)
    const matchName = document.createElement('p');
    matchName.classList.add('match-name');
    matchName.textContent = `${match.Name}`;
    card.appendChild(matchName);
  
    // Players String (Spans across all 3 columns)
    const playersString = document.createElement('p');
    playersString.classList.add('players-string');
    playersString.textContent = 'Players';
    card.appendChild(playersString);
  
    // Match Day (Spans across all 3 columns)
    const matchDay = document.createElement('p');
    matchDay.classList.add('match-day');
    const day = match.Date.split('-')[2];
    matchDay.textContent = `${day}`;
    card.appendChild(matchDay);
  
    // Court Name (First Column)
    const court = document.createElement('p');
    court.classList.add('match-court');
    court.textContent = `${match.Court}`;
    card.appendChild(court);
  
    // Number of Players (Second Column)
    const numPlayers = document.createElement('p');
    numPlayers.classList.add('match-num-players');
    numPlayers.textContent = `${match.Players.length}/8`;
    card.appendChild(numPlayers);
    card.addEventListener('click', function() {
      const matchJSON = JSON.stringify(match);
      const encodedMatch = encodeURIComponent(matchJSON);
      window.location.href = `match.html?match=${encodedMatch}`;
  });
    return card;
};

// Function to display matches grouped and sorted by date and time
const displayMatches = async () => {
  const scheduleContainer = document.querySelector('.schedule-container');
  scheduleContainer.innerHTML = ''; // Clear the container before adding new matches

  const matches = await getMatches();
  let courtMatches;
  
  if (courtName !== "ALL") {
      courtMatches = matches.filter(match => match.Court === courtName);
  } else {
      courtMatches = matches;
  }
  

  // Step 1: Sort all the matches by date and time
  const sortedMatches = courtMatches.sort((a, b) => {
    const dateA = new Date(`${a.Date}T${a.StartTime}`);
    const dateB = new Date(`${b.Date}T${b.StartTime}`);
    return dateA - dateB; // Ascending order
  });

  // Step 2: Group the matches by month and year (month + year as numeric key)
  const matchesByMonth = {};

  sortedMatches.forEach(match => {
    const [year, month, day] = match.Date.split('-').map(Number);
    const key = month + year*100; // Numeric key (month + year)
    
    if (!matchesByMonth[key]) {
      matchesByMonth[key] = [];
    }

    matchesByMonth[key].push(match); // Add match to the corresponding month-year key
  });

  // Step 3: Loop through each month and render matches
  Object.keys(matchesByMonth).forEach(key => {
    // Create and append the month header using the first match of that month
    const firstMatch = matchesByMonth[key][0];
    const monthElement = createMonth(firstMatch.Date.split('-')[1]); // Get the month from the first match
    scheduleContainer.appendChild(monthElement);

    // Render the matches for this month
    matchesByMonth[key].forEach(match => {
      const matchCard = createMatchCard(match);
      scheduleContainer.appendChild(matchCard);
    });
  });
};

const backButton = document.querySelector('.btn-back');

if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.back();  // Go back to the previous page in the browser history
  });
}
// Create match button functionality
const createMatchButton = document.getElementById('btn-create-match');
if (createMatchButton) {
    createMatchButton.addEventListener('click', () => {
        // Redirect to make match page with the court name in the query parameter
        window.location.href = `makematch.html?court=${encodeURIComponent(courtName)}`;
    });
}

//Get Court
const urlParams = new URLSearchParams(window.location.search);
const courtName = urlParams.get('court');
console.log(courtName);

if (!courtName) {
  console.error('Court name not found in URL.');
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log("Page loaded from cache. Reloading matches.");
  } else {
    console.log("Page loaded normally. Reloading matches.");
  }
  displayMatches(); // Refresh the schedule
});