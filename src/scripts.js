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
      button.classList.add("btn", "btn-primary", "w-50"); // Agrega clases Bootstrap
      listPokemon.classList.add("list-group-item", "text-center"); // Agrega clases Bootstrap al <li>

      // Hacer que el botón abra el modal de Bootstrap
      button.setAttribute("data-toggle", "modal");
      button.setAttribute("data-target", "#pokemonModal");

      listPokemon.appendChild(button); // Inserta el botón dentro del <li>
      pokemonListElement.appendChild(listPokemon); // Inserta el <li> en la lista <ul>

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
        // Populate Bootstrap modal content
        $("#modal-title").text(updatedPokemon.name);
        $("#modal-image").attr("src", updatedPokemon.imgUrl);
        $("#modal-height").text(`Height: ${updatedPokemon.height} meters`);

        // Show the modal
        $("#pokemonModal").modal("show");
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

  // ✅ Load Pokémon list and display them
  pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach((pokemon) => {
      pokemonRepository.addListItem(pokemon);
    });
  });
});
