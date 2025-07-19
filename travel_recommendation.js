const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

let travelData = null;

// Load JSON data
fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    showAllRecommendations();
  })
  .catch(err => {
    resultsDiv.innerHTML = '<p style="color: red;">Failed to load recommendations data.</p>';
    console.error(err);
  });

// Show all places initially
function showAllRecommendations() {
  if (!travelData) return;

  const allPlaces = [];

  travelData.countries.forEach(country => {
    country.cities.forEach(city => {
      allPlaces.push({
        name: city.name,
        description: city.description,
        imageUrl: city.imageUrl
      });
    });
  });

  travelData.temples.forEach(temple => {
    allPlaces.push({
      name: temple.name,
      description: temple.description,
      imageUrl: temple.imageUrl
    });
  });

  travelData.beaches.forEach(beach => {
    allPlaces.push({
      name: beach.name,
      description: beach.description,
      imageUrl: beach.imageUrl
    });
  });

  displayRecommendations(allPlaces);
}

// Search recommendations
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    showAllRecommendations();
    return;
  }

  if (!travelData) return;

  const filtered = [];

  function matchPlace(place) {
    return place.name.toLowerCase().includes(query) || place.description.toLowerCase().includes(query);
  }

  travelData.countries.forEach(country => {
    country.cities.forEach(city => {
      if (matchPlace(city)) {
        filtered.push({
          name: city.name,
          description: city.description,
          imageUrl: city.imageUrl
        });
      }
    });
  });

  travelData.temples.forEach(temple => {
    if (matchPlace(temple)) {
      filtered.push({
        name: temple.name,
        description: temple.description,
        imageUrl: temple.imageUrl
      });
    }
  });

  travelData.beaches.forEach(beach => {
    if (matchPlace(beach)) {
      filtered.push({
        name: beach.name,
        description: beach.description,
        imageUrl: beach.imageUrl
      });
    }
  });

  if (filtered.length === 0) {
    resultsDiv.innerHTML = '<p>No recommendations found for your search.</p>';
  } else {
    displayRecommendations(filtered);
  }
});

// Clear search and show all
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  showAllRecommendations();
});

// Display recommendations helper
function displayRecommendations(places) {
  resultsDiv.innerHTML = '';

  places.forEach(place => {
    const div = document.createElement('div');
    div.classList.add('recommendation');

    const img = document.createElement('img');
    img.src = place.imageUrl;
    img.alt = place.name;

    const infoDiv = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = place.name;
    const desc = document.createElement('p');
    desc.textContent = place.description;

    infoDiv.appendChild(title);
    infoDiv.appendChild(desc);

    div.appendChild(img);
    div.appendChild(infoDiv);

    resultsDiv.appendChild(div);
  });
}
