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
      console.log("Pokemon is not correct");
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
      showDetails(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl) // Perform the GET request
      .then(response => response.json()) // Convert response to JSON
      .then(json => {
        json.results.forEach(item => {
          let pokemon = {
            name: item.name, // Extract Pokémon name
            detailsUrl: item.url // Extract Pokémon details URL
          };
          add(pokemon); // Use add() to store Pokémon in pokemonList
        });
        return pokemonList; // Return the updated list
      })
      .catch(error => {
        console.error("Error loading Pokémon list:", error);
      });
  }
  
  

  function loadDetails(pokemon) {
    return fetch(pokemon.detailsUrl) // Fetch Pokémon details from its URL
      .then(response => response.json()) // Convert response to JSON
      .then(details => {
        // Assign additional details
        pokemon.imgUrl = details.sprites.front_default; // Pokémon image
        pokemon.height = details.height; // Pokémon height
      })
      .catch(error => {
        console.error(`Failed to load details for ${pokemon.name}:`, error);
      });
  }
  

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => { 
      console.log(pokemon); // ✅ Logs Pokémon details after loading from API
    });
  }
  
  

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList, // ✅ Returning loadList function
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

// Load Pokémon list and display them
pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach((pokemon) => {
    pokemonRepository.addListItem(pokemon);
  });
});

