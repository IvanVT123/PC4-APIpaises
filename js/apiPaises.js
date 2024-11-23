const API_URL = "https://restcountries.com/v3.1/all";
const countriesContainer = document.getElementById("countries");
const searchInput = document.getElementById("search");
const errorMessage = document.getElementById("error-message");

async function fetchCountries() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error en la API");
    const data = await response.json();
    displayCountries(data);
    errorMessage.classList.add("d-none");
  } catch (error) {
    countriesContainer.innerHTML = "";
    errorMessage.classList.remove("d-none");
  }
}

function displayCountries(countries) {
  countriesContainer.innerHTML = countries
    .map(country => `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${country.flags.svg}" class="card-img-top" alt="${country.name.common}">
          <div class="card-body">
            <h5 class="card-title">${country.name.common}</h5>
            <p class="card-text">Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
            <p class="card-text">Región: ${country.region}</p>
            <button class="btn btn-primary" onclick="showDetails('${country.cca3}')">Ver Detalles</button>
          </div>
        </div>
      </div>
    `).join("");
}

async function showDetails(code) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!response.ok) throw new Error("Error en la API");
    const country = await response.json();
    const details = country[0];
    alert(`
      Nombre: ${details.name.common}
      Capital: ${details.capital ? details.capital[0] : "N/A"}
      Región: ${details.region}
      Subregión: ${details.subregion}
      Población: ${details.population.toLocaleString()}
      Área: ${details.area.toLocaleString()} km²
      Idiomas: ${details.languages ? Object.values(details.languages).join(", ") : "N/A"}
      Moneda: ${details.currencies ? Object.values(details.currencies)[0].name : "N/A"}
    `);
  } catch (error) {
    alert("Error al obtener los detalles del país");
  }
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  const countryCards = document.querySelectorAll(".card");
  countryCards.forEach(card => {
    const countryName = card.querySelector(".card-title").textContent.toLowerCase();
    if (countryName.includes(query)) {
      card.parentElement.classList.remove("d-none");
    } else {
      card.parentElement.classList.add("d-none");
    }
  });
});

// Search functionality
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const countryCards = document.querySelectorAll(".card");
    let matches = 0; // Contador de coincidencias
  
    countryCards.forEach(card => {
      const countryName = card.querySelector(".card-title").textContent.toLowerCase();
      if (countryName.includes(query)) {
        card.parentElement.classList.remove("d-none");
        matches++; // Incrementa el contador si hay coincidencia
      } else {
        card.parentElement.classList.add("d-none");
      }
    });
  
    // Mostrar u ocultar el mensaje de error
    if (matches === 0) {
      errorMessage.classList.remove("d-none");
    } else {
      errorMessage.classList.add("d-none");
    }
});
  
fetchCountries();
