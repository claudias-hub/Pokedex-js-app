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
      let errorContainer =
        document.querySelector(".error-message") ||
        document.createElement("div");
      errorContainer.classList.add("error-message");
      document.body.appendChild(errorContainer);
      errorContainer.innerText = message;
    }

    function showLoadingMessage() {
      let loadingContainer =
        document.querySelector(".loading-message") ||
        document.createElement("div");
      loadingContainer.classList.add("loading-message");
      document.body.appendChild(loadingContainer);
      loadingContainer.innerText = "Loading data...";
    }

    function hideLoadingMessage() {
      let loadingContainer = document.querySelector(".loading-message");
      if (loadingContainer) loadingContainer.remove();
    }

    function fetchData(url) {
      showLoadingMessage(); // Show loading before fetching

      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          hideLoadingMessage(); // Hide it only after data is fully processed
          return data;
        })
        .catch((error) => {
          hideLoadingMessage(); // Also hide it if an error occurs
          if (error.message.includes("Failed to fetch")) {
            displayError("Network error: Unable to reach the server.");
          } else if (error.message.includes("Unexpected token")) {
            displayError("Data error: Received unexpected response format.");
          } else {
            displayError(`Error: ${error.message}`);
          }
          throw error; // Ensure further handling if needed
        });
    }

    function loadList() {
      console.log("Fetching Pokémon list...");
      showLoadingMessage(); // Ensure message shows immediately
    
      return fetchData(apiUrl)
        .then((json) => {
          if (!json.results || !Array.isArray(json.results)) {
            throw new Error("Invalid data format received");
          }
          json.results.forEach((item) => {
            add({ name: item.name, detailsUrl: item.url });
          });
    
          return pokemonList; // Ensure function returns updated list
        })
        .finally(() => hideLoadingMessage()); // Always hide loading message
    }
    

    function loadDetails(pokemon) {
      showLoadingMessage(); // Show loading when fetching Pokémon details
    
      return fetchData(pokemon.detailsUrl)
        .then((details) => {
          pokemon.imgUrl = details.sprites.front_default;
          pokemon.height = details.height;
          return pokemon;
        })
        .catch((error) => {
          displayError(`Could not fetch details for ${pokemon.name}`);
          return {};
        })
        .finally(() => hideLoadingMessage()); // Always hide loading message
    }

    function displayDetails(pokemon) {
      let detailsContainer =
        document.querySelector(".pokemon-details") ||
        document.createElement("div");
      detailsContainer.classList.add("pokemon-details");
      document.body.appendChild(detailsContainer);

      let heightMessage =
        pokemon.height >= heightThreshold ? "Wow, that's big!" : "";

      detailsContainer.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.imgUrl || "placeholder.jpg"}" alt="${pokemon.name}">
        <p>Height: ${
          pokemon.height ? pokemon.height + " meters" : "Unknown"
        }</p>
        <p>${heightMessage}</p>
      `;
      console.log("Displayed details:", pokemon);
    }

    function showDetails(pokemon) {
      loadDetails(pokemon).then((updatedPokemon) => {
        if (updatedPokemon && updatedPokemon.imgUrl) {
          displayDetails(updatedPokemon);
        } else {
          console.error("Invalid Pokémon data received:", updatedPokemon);
        }
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
