document.addEventListener("DOMContentLoaded", function () {
  let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";
    let heightThreshold = 10;

    function add(pokemon) {
      if (
        typeof pokemon === "object" &&
        "name" in pokemon &&
        "detailsUrl" in pokemon
      ) {
        pokemonList.push(pokemon);
      } else {
        console.error("Invalid Pokémon object:", pokemon);
      }
    }

    function getAll() {
      return pokemonList;
    }

    function addListItem(pokemon) {
      let pokemonListElement = document.querySelector(".pokemon-list");
      let listPokemon = document.createElement("li");
      let button = document.createElement("button");

      button.innerText = pokemon.name;
      button.classList.add("button-class");
      listPokemon.appendChild(button);
      pokemonListElement.appendChild(listPokemon);

      button.addEventListener("click", function () {
        console.log(`Button clicked for: ${pokemon.name}`); // Logs name on click
        showDetails(pokemon);
      });
    }

    function displayError(message) {
      let errorContainer = document.querySelector(".error-message") || document.createElement("div");
      errorContainer.classList.add("error-message");
      document.body.appendChild(errorContainer);
      errorContainer.innerText = message;
    }

    function showLoadingMessage() {
      let loadingContainer = document.querySelector(".loading-message") || document.createElement("div");
      loadingContainer.classList.add("loading-message");
      document.body.appendChild(loadingContainer);
      loadingContainer.innerText = "Loading data...";
    }

    function hideLoadingMessage() {
      let loadingContainer = document.querySelector(".loading-message");
      if (loadingContainer) loadingContainer.remove();
    }

    function fetchData(url) {
      showLoadingMessage();
      return fetch(url)
        .then((response) => {
          hideLoadingMessage();
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          hideLoadingMessage();
          displayError("Failed to load Pokémon. Please check your internet connection.");
          throw error;
        });
    }

    function loadList() {
      console.log("Fetching Pokémon list...");
      return fetchData(apiUrl)
        .then((json) => {
          console.log("Pokémon data received:", json);
          if (!json.results || !Array.isArray(json.results)) {
            throw new Error("Invalid data format received");
          }
          json.results.forEach((item) => {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url,
            };
            add(pokemon);
          });
          return pokemonList;
        })
        .catch((error) => {
          console.error("Error loading Pokémon list:", error);
          displayError(
            "Failed to load Pokémon. Please check your internet connection."
          );
        });
    }

    function loadDetails(pokemon) {
      return fetchData(pokemon.detailsUrl)
        .then((details) => {
          pokemon.imgUrl = details.sprites.front_default;
          pokemon.height = details.height;
        })
        .catch((error) => {
          displayError(`Could not fetch details for ${pokemon.name}`);
        });
    }

    function displayDetails(pokemon) {
      let detailsContainer = document.querySelector(".pokemon-details") || document.createElement("div");
      detailsContainer.classList.add("pokemon-details");
      document.body.appendChild(detailsContainer);
      let heightMessage = pokemon.height >= heightThreshold ? "Wow, that's big!" : "";
      detailsContainer.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.imgUrl}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height} meters</p>
        <p>${heightMessage}</p>
      `;
      console.log("Displayed details:", pokemon); // Logs details when displayed
    }


    function showDetails(pokemon) {
      loadDetails(pokemon).then(() => {
        displayDetails(pokemon);
      });
    }

    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails,
    };
  })();

  pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach((pokemon) => {
      pokemonRepository.addListItem(pokemon);
    });
  });
});
