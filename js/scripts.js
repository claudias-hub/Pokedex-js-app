let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";

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
      console.log("Button clicked for:", pokemon); // Debugging log
      showDetails(pokemon);
    }, { once: true }); // Prevent multiple clicks triggering multiple API calls
  }

  function displayError(message) {
    let errorContainer = document.querySelector(".error-message");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.classList.add("error-message");
      document.body.appendChild(errorContainer);
    }
    errorContainer.innerText = message;
  }

  function showLoadingMessage() {
    let loadingContainer = document.querySelector(".loading-message");
    if (!loadingContainer) {
      loadingContainer = document.createElement("div");
      loadingContainer.classList.add("loading-message");
      document.body.appendChild(loadingContainer);
    }
    loadingContainer.innerText = "Loading data...";
  }

  function hideLoadingMessage() {
    let loadingContainer = document.querySelector(".loading-message");
    if (loadingContainer) {
      loadingContainer.remove();
    }
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
            detailsUrl: item.url
          };
          add(pokemon);
        });
        return pokemonList;
      })
      .catch((error) => {
        console.error("Error loading Pokémon list:", error);
        displayError("Failed to load Pokémon. Please check your internet connection.");
      });
  }

  function loadDetails(pokemon) {
    console.log(`Loading details for ${pokemon.name}...`);
    return fetchData(pokemon.detailsUrl)
      .then((details) => {
        if (!details.sprites || !details.sprites.front_default || !details.height) {
          throw new Error(`Incomplete data for ${pokemon.name}`);
        }
        pokemon.imgUrl = details.sprites.front_default;
        pokemon.height = details.height;
        console.log("Details loaded:", pokemon);
      })
      .catch((error) => {
        console.error(`Failed to load details for ${pokemon.name}:`, error);
        displayError(`Could not fetch details for ${pokemon.name}`);
      });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      console.log("Pokémon Details:", pokemon);
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach((pokemon) => {
    pokemonRepository.addListItem(pokemon);
  });
});
