import { getMatches } from './firebase.js';  // Import the function from firebase.js

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
  playersString.textContent = `Players`;
  card.appendChild(playersString);
  
  // Match Day (Spans across all 3 columns)
  const matchDay = document.createElement('p');
  matchDay.classList.add('match-day');
  const day = match.Date.split('/')[0];
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

  return card;
};

// Function to display all matches
const displayMatches = async () => {
  const scheduleContainer = document.querySelector('.schedule-container');
  scheduleContainer.innerHTML = '';  // Clear the container before adding new matches
  
  const matches = await getMatches();
  
  matches.forEach(match => {
    const matchCard = createMatchCard(match);
    scheduleContainer.appendChild(matchCard);
  });
};

// Call the function to display matches when the page loads
displayMatches();
