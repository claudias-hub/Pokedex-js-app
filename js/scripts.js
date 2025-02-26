document.addEventListener("DOMContentLoaded", function () {
  let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = "https://pokeapi.co/api/v2/pokemon/";
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
      errorContainer.innerText = message;
      document.body.appendChild(errorContainer);

      // Remove the error message after 5 seconds
      setTimeout(() => {
        if (errorContainer) errorContainer.remove();
      }, 5000);
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
            if (response.status === 404) {
              throw new Error("Resource not found (404).");
            } else if (response.status === 500) {
              throw new Error("Server error (500). Please try again later.");
            } else {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
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
            displayError(
              "Network error: Unable to reach the server. Please check your internet connection."
            );
          } else if (error.message.includes("Unexpected token")) {
            displayError(
              "Data error: The server response was not in the expected format."
            );
          } else {
            displayError(`Error: ${error.message}`);
          }

          console.error("Fetch error:", error);
          throw error; // Ensure further handling if needed
        });
    }

    function loadList() {
      console.log("Fetching Pokémon list...");
      showLoadingMessage();

      return fetchData(apiUrl)
        .then((json) => {
          if (!json.results || !Array.isArray(json.results)) {
            throw new Error("Invalid data format received from API.");
          }

          if (json.results.length === 0) {
            throw new Error(
              "No Pokémon found. The API might be experiencing issues."
            );
          }

          json.results.forEach((item) => {
            add({ name: item.name, detailsUrl: item.url });
          });

          return pokemonList;
        })
        .catch((error) => {
          console.error("Error loading Pokémon list:", error);
          displayError("Failed to load Pokémon list. Please try again later.");
          return []; // Ensure an empty array is returned on failure
        })
        .finally(() => hideLoadingMessage());
    }

    function loadDetails(pokemon) {
      showLoadingMessage();

      return fetchData(pokemon.detailsUrl)
        .then((details) => {
          try {
            // Validate and assign the image URL
            pokemon.imgUrl =
              details.sprites?.front_default || "placeholder.jpg";

            // Validate and assign the height
            if (typeof details.height === "number") {
              pokemon.height = details.height;
            } else {
              console.warn(`Invalid height data for ${pokemon.name}.`);
              pokemon.height = "Unknown";
            }

            // Validate and assign Pokémon types
            if (Array.isArray(details.types) && details.types.length > 0) {
              pokemon.types = details.types
                .map((typeInfo) => typeInfo.type.name)
                .join(", ");
            } else {
              console.warn(`No types found for ${pokemon.name}.`);
              pokemon.types = "Unknown";
            }

            return pokemon;
          } catch (error) {
            console.error(
              `Error processing details for ${pokemon.name}:`,
              error
            );
            displayError(`Could not process details for ${pokemon.name}.`);

            return {
              name: pokemon.name,
              imgUrl: "placeholder.jpg",
              height: "Unknown",
              types: "Unknown",
            };
          }
        })
        .catch((error) => {
          displayError(
            `Could not fetch details for ${pokemon.name}. Please try again later.`
          );
          console.error(`Error fetching details for ${pokemon.name}:`, error);

          return {
            name: pokemon.name,
            imgUrl: "placeholder.jpg",
            height: "Unknown",
            types: "Unknown",
          };
        })
        .finally(() => hideLoadingMessage());
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
      let detailsContainer =
        document.querySelector(".pokemon-details") ||
        document.createElement("div");
      detailsContainer.classList.add("pokemon-details");
      document.body.appendChild(detailsContainer);

      // Show a temporary message while details are loading
      detailsContainer.innerHTML = `<p>Loading details for ${pokemon.name}...</p>`;

      loadDetails(pokemon).then((updatedPokemon) => {
        if (updatedPokemon && updatedPokemon.imgUrl) {
          displayDetails(updatedPokemon);
        } else {
          detailsContainer.innerHTML = `<p>Could not load details for ${pokemon.name}.</p>`;
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
