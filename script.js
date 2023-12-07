// fetching the data :

document.addEventListener("DOMContentLoaded", () => {
  // Fetch planets data from the API
  fetchPlanetsData();
});

async function fetchPlanetsData() {
  try {
    const apiKey = await getApiKey();
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        headers: { "x-zocom": apiKey },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error(error.message);
  }
}

async function getApiKey() {
  try {
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get API key");
    }

    const apiKeyData = await response.json();
    return apiKeyData.key;
  } catch (error) {
    console.error(error.message);
  }
}

// Add click event listeners to each planet div
const planetDivs = document.querySelectorAll(".planet");
planetDivs.forEach((planetDiv) => {
  planetDiv.addEventListener("click", () => {
    const planetId = planetDiv.id;
    fetchPlanetDetails(planetId);
  });
});

async function fetchPlanetDetails(planetId) {
  try {
    const apiKey = await getApiKey();
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        headers: {
          "x-zocom": apiKey,
          // If the API expects other headers, add them here
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch planet details");
    }

    const responseBody = await response.json();
    const allBodies = responseBody.bodies;

    // Find the planet by comparing the HTML ID with the name from the API
    const planetDetails = allBodies.find(
      (body) => body.name.toLowerCase() === planetId.toLowerCase()
    );

    if (!planetDetails) {
      throw new Error(`Planet with ID '${planetId}' not found`);
    }

    console.log("Planet Details:", planetDetails);

    // Display planet details in the overlay
    displayPlanetDetails(planetDetails);
  } catch (error) {
    console.error(error.message);
  }
}

function displayPlanetDetails(planetDetails) {
  const overlayContent = document.getElementById("overlay-content");
  overlayContent.innerHTML = `
    <div class="details-container">
      <h1 class="title">${planetDetails.name}</h1>
      <h3 class="subtitle">${planetDetails.latinName}</h3>
      <p>${planetDetails.desc}</p>
      <div class="line"></div>
      <div class="info-grid">
     
        <div class="info-item">
          <p class="info-label">Omkrets:</p>
          <p class="info-value">${planetDetails.circumference} km</p>
        </div>
        <div class="info-item">
          <p class="info-label">KM från solen:</p>
          <p class="info-value">${planetDetails.distance} km</p>
        </div>
        <div class="info-item">
          <p class="info-label">Min Temperature:</p>
          <p class="info-value">${
            planetDetails.temp ? `${planetDetails.temp.night}°C` : "N/A"
          }</p>
        </div>
        <div class="info-item">
          <p class="info-label">Max Temperature:</p>
          <p class="info-value">${
            planetDetails.temp ? `${planetDetails.temp.day}°C` : "N/A"
          }</p>
          
        </div>

      </div>
    
    </div>
    <div class="line"></div>
    <div class="info-item">
    <p class="info-label">Måner:</p>
    <p class="info-value">${
      planetDetails.moons.length > 0 ? planetDetails.moons.join(", ") : "None"
    }</p>
  </div>
  `;

  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";
}
function closeOverlay() {
  // Hide the overlay
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}
