async function loadCourts() {
    try {
        // Fetch the JSON data
        const response = await fetch('../resources/courts.json');
        const courts = await response.json();
        localStorage.setItem('courtsData', JSON.stringify(courts));
        // Get the court-container element where cards will be inserted
        const courtContainer = document.querySelector('.court-container');

        // Loop through the courts and create cards
        courts.forEach(court => {
            // Create a new div for the card
            const courtCard = document.createElement('div');
            courtCard.classList.add('court-card');
            
            // Add the first image from the gallery
            const image = document.createElement('img');
            image.src = `../resources/images/${court.gallery[0]}`;
            image.alt = court.name;
            courtCard.appendChild(image);
            
            // Add a title with the court name
            const title = document.createElement('div');
            title.classList.add('court-title');
            title.innerHTML = `<p class="text-sub-header">${court.name}</p>`;
            courtCard.appendChild(title);

            // Add a click event listener to the court card to redirect to courtPage.html
            courtCard.addEventListener('click', () => {
                // Redirect to courtPage.html and pass the court name as a query parameter
                window.location.href = `court.html?court=${encodeURIComponent(court.name)}`;
            });

            // Append the court card to the court container
            courtContainer.appendChild(courtCard);
        });
    } catch (error) {
        console.error('Error loading court data:', error);
    }
}

document.getElementById('btn-schedule').addEventListener('click', () => {
    window.location.href = 'schedule.html?court=ALL';
});

window.onload = loadCourts;
