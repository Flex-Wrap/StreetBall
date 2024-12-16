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
    document.getElementById('court-number').textContent = `Courts: ${court.gallery.length}`;
    document.getElementById('court-type').textContent = `Type: Asphalt`; // Update with dynamic data if available
    document.getElementById('court-caged').textContent = `Caged: Entirely`; // Update with dynamic data if available
    document.getElementById('court-size').textContent = `Size: 4 on 4`; // Update with dynamic data if available
    document.getElementById('court-mini').textContent = `Mini Goals: Yes`; // Update with dynamic data if available
    document.getElementById('court-lamps').textContent = `Lamps: Yes`; // Update with dynamic data if available

    // Update hero image
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        heroImg.style.backgroundImage = `url('../resources/images/${court.gallery[2]}')`;
    }

    // Populate gallery (optional)
    const galleryContainer = document.querySelector('.gallery-container');
    court.gallery.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = `../resources/images/${image}`;
        imgElement.alt = court.name;
        galleryContainer.appendChild(imgElement);
    });
}

// Run the function on page load
window.onload = populateCourtPage;