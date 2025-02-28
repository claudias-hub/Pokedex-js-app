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
        console.log(`Button clicked for: ${pokemon.name}`);
        showDetails(pokemon);
      });
    }

    function loadList() {
      return fetch(apiUrl)
        .then((response) => response.json())
        .then((json) => {
          json.results.forEach((item) => {
            add({ name: item.name, detailsUrl: item.url });
          });
        })
        .catch((error) => console.error("Error loading Pokémon list:", error));
    }

    function loadDetails(pokemon) {
      return fetch(pokemon.detailsUrl)
        .then((response) => response.json())
        .then((details) => {
          pokemon.imgUrl = details.sprites?.front_default || "placeholder.jpg";
          pokemon.height = details.height || "Unknown";
          return pokemon;
        });
    }

    function showDetails(pokemon) {
      loadDetails(pokemon).then((updatedPokemon) => {
        pokemonModal.show(updatedPokemon); // ✅ Using the modal module
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

  // ✅ Encapsulating the modal logic in a separate IIFE
  let pokemonModal = (function () {
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

    function hideModal() {
      let modalContainer = document.querySelector("#modal-container");
      modalContainer.classList.remove("is-visible");
    }

    // ✅ Close modal when clicking outside
    document.querySelector("#modal-container").addEventListener("click", function (event) {
      if (event.target === this) {
        hideModal();
      }
    });

    // ✅ Close modal on Escape key press
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideModal();
      }
    });

    return {
      show: showModal,
      hide: hideModal,
    };
  })();

  // ✅ Load Pokémon list and display them
  pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach((pokemon) => {
      pokemonRepository.addListItem(pokemon);
    });
  });
});
