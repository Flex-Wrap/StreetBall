function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function populateCourtPage() {
    // Get the court name from the query string
    const courtName = getQueryParam('court');

    if (!courtName) {
        console.error('Court name not found in URL.');
        return;
    }

    // Retrieve the courts data from localStorage
    const courtsData = JSON.parse(localStorage.getItem('courtsData'));

    if (!courtsData) {
        console.error('Courts data not found in localStorage.');
        return;
    }

    // Find the court by name
    const court = courtsData.find(court => court.name === courtName);

    if (!court) {
        console.error('Court not found.');
        return;
    }

    // Populate the page with court data
    document.getElementById('court-name').textContent = court.name;
    document.getElementById('court-address').textContent = court.location;
    document.getElementById('court-description').textContent = court.description;

    // Update facilities
    document.getElementById('court-number').textContent = `Courts: ${court.number}`;
    document.getElementById('court-type').textContent = `Type: ${court.type}`; // Update with dynamic data if available
    document.getElementById('court-caged').textContent = `Caged: ${court.caged}`; // Update with dynamic data if available
    document.getElementById('court-size').textContent = `Size: ${court.size}`; // Update with dynamic data if available
    document.getElementById('court-mini').textContent = `Mini Goals: ${court.miniGoals}`; // Update with dynamic data if available
    document.getElementById('court-lamps').textContent = `Lamps: ${court.lamps}`; // Update with dynamic data if available

    // Update hero image
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        heroImg.style.backgroundImage = `url('../resources/images/${court.gallery[2]}')`;
    }

    // Populate gallery
    const galleryContainer = document.querySelector('.gallery-container');
    court.gallery.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = `../resources/images/${image}`;
        imgElement.alt = court.name;
        galleryContainer.appendChild(imgElement);
    });
    
    const mapButton = document.getElementById('map-button');
    if (mapButton) {
        mapButton.addEventListener('click', () => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.location)}`;
            window.open(googleMapsUrl, '_blank');
        });
    }
    // Schedule button functionality
    const scheduleButton = document.getElementById('btn-schedule');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', () => {
            // Redirect to schedule page with the court name in the query parameter
            window.location.href = `schedule.html?court=${encodeURIComponent(court.name)}`;
        });
    }

    // Create match button functionality
    const createMatchButton = document.getElementById('btn-create-match');
    if (createMatchButton) {
        createMatchButton.addEventListener('click', () => {
            // Redirect to make match page with the court name in the query parameter
            window.location.href = `makematch.html?court=${encodeURIComponent(court.name)}`;
        });
    }
}

// Run the function on page load
window.onload = populateCourtPage;