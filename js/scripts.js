document.addEventListener("DOMContentLoaded", function () {
  let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = "https://pokeapi.co/api/v2/pokemon/";
    let heightThreshold = 10;

    // Core functions
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
        console.log(`Button clicked for: ${pokemon.name}`);
        showDetails(pokemon);
      });
    }

    // Utility functions
    function displayError(message) {
      let errorContainer =
        document.querySelector(".error-message") ||
        document.createElement("div");
      errorContainer.classList.add("error-message");
      errorContainer.innerText = message;
      document.body.appendChild(errorContainer);

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

    // Data fetching functions
    function fetchData(url) {
      showLoadingMessage();

      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            switch (response.status) {
              case 404:
                throw new Error("Resource not found (404).");
              case 500:
                throw new Error("Server error (500). Please try again later.");
              default:
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
          }
          return response.json().catch(() => {
            throw new Error(
              "Data error: The server response was not valid JSON."
            );
          });
        })
        .then((data) => {
          hideLoadingMessage();
          return data;
        })
        .catch((error) => {
          hideLoadingMessage();
          displayError(`Error: ${error.message}`);
          console.error("Fetch error:", error);
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
          return [];
        })
        .finally(() => hideLoadingMessage());
    }

    function loadDetails(pokemon) {
      showLoadingMessage();

      return fetchData(pokemon.detailsUrl)
        .then((details) => {
          pokemon.imgUrl = details.sprites?.front_default || "placeholder.jpg";
          pokemon.height =
            typeof details.height === "number" ? details.height : "Unknown";
          pokemon.types = Array.isArray(details.types)
            ? details.types.map((typeInfo) => typeInfo.type.name).join(", ")
            : "Unknown";

          return pokemon;
        })
        .catch((error) => {
          displayError(`Could not fetch details for ${pokemon.name}.`);
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

    // UI display functions
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
    }

    function showDetails(pokemon) {
      let detailsContainer =
        document.querySelector(".pokemon-details") ||
        document.createElement("div");
      detailsContainer.classList.add("pokemon-details");
      document.body.appendChild(detailsContainer);

      detailsContainer.innerHTML = `<p>Loading details for ${pokemon.name}...</p>`;

      loadDetails(pokemon).then((updatedPokemon) => {
        if (updatedPokemon && updatedPokemon.imgUrl) {
          showModal(updatedPokemon);
        } else {
          detailsContainer.innerHTML = `<p>Could not load details for ${pokemon.name}.</p>`;
        }
      });
    }

    function showModal(pokemon) {
      let modalContainer = document.querySelector("#modal-container");
    
      // Clear previous modal content
      modalContainer.innerHTML = "";
    
      // Create modal content
      let modal = document.createElement("div");
      modal.classList.add("modal");
    
      // Add close button
      let closeButton = document.createElement("button");
      closeButton.classList.add("modal-close");
      closeButton.innerText = "X";
      closeButton.addEventListener("click", hideModal);
    
      // Add Pokémon details
      let title = document.createElement("h2");
      title.innerText = pokemon.name;
    
      let image = document.createElement("img");
      image.src = pokemon.imgUrl;
      image.alt = pokemon.name;
    
      let height = document.createElement("p");
      height.innerText = `Height: ${pokemon.height} meters`;
    
      // Append elements to modal
      modal.appendChild(closeButton);
      modal.appendChild(title);
      modal.appendChild(image);
      modal.appendChild(height);
      modalContainer.appendChild(modal);
    
      // Show modal
      modalContainer.classList.add("is-visible");
    }
    
    // ✅ Ensure the event listener is added **only once**
    document.querySelector("#modal-container").addEventListener("click", function (event) {
      let modal = document.querySelector(".modal");
    
      // If the user clicks outside the modal, close it
      if (event.target === this) {
        hideModal();
      }
    });
    
    // ✅ Global keydown event listener (added once)
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideModal();
      }
    });
    
    function hideModal() {
      let modalContainer = document.querySelector("#modal-container");
      modalContainer.classList.remove("is-visible");
    }
    
    

    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails,
      showModal: showModal,
      hideModal: hideModal,
    };
  })();

  pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach((pokemon) => {
      pokemonRepository.addListItem(pokemon);
    });
  });
});
