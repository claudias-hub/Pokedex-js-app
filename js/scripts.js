document.addEventListener('DOMContentLoaded', () => {
  // Encapsulate the Pokémon repository functionality using an IIFE
  const pokemonRepository = (() => {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const heightThreshold = 10;

    // Add a new Pokémon to the repository
    const add = (pokemon) => {
      if (isValidPokemon(pokemon)) {
        pokemonList.push(pokemon);
      } else {
        console.error('Invalid Pokémon data: Missing name or height');
      }
    };

    // Helper function to validate Pokémon data
    const isValidPokemon = (pokemon) => (
      typeof pokemon === 'object' && pokemon !== null && pokemon.name && pokemon.height
    );

    // Get all Pokémon from the repository
    const getAll = () => pokemonList;

    // Show Pokémon details in the console
    const showDetails = (pokemon) => {
      loadDetails(pokemon)
        .then(() => console.log(pokemon))
        .catch((error) => console.error(`Failed to load details for ${pokemon.name}: ${error.message}`));
    };

    // Load the Pokémon list from the API
    const loadList = () => {
      showLoadingMessage(); // Show loading message before fetching
      return fetch(apiUrl)
        .then(handleApiResponse)
        .then(loadPokemonsInBatches)
        .catch((error) => {
          console.error('Failed to load Pokémon list:', error);
        })
        .finally(hideLoadingMessage);
    };

    // Handle API response and check for errors
    const handleApiResponse = (response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    };

    // Load Pokémon details in batches for performance optimization
    const loadPokemonsInBatches = (json) => {
      const batchSize = 5;
      const pokemonBatches = [];

      for (let i = 0; i < json.results.length; i += batchSize) {
        const batch = json.results.slice(i, i + batchSize).map((pokemonData) => {
          const pokemon = {
            name: pokemonData.name,
            detailsUrl: pokemonData.url
          };
          return loadDetails(pokemon)
        .then(() => add(pokemon))
        .catch((error) => {
          console.error(`Failed to load Pokémon: ${pokemon.name}`, error);
          // Continue processing other Pokémon even if one fails
        });
    });

    pokemonBatches.push(Promise.all(batch));
  }

  return Promise.all(pokemonBatches)
    .catch((error) => {
      console.error('Batch processing failed:', error);
    });
};

    // Load details of a specific Pokémon
    const loadDetails = (pokemon) => {
      showLoadingMessage(); // Show loading message before fetching details
      return fetch(pokemon.detailsUrl)
        .then(handleApiResponse)
        .then((details) => {
          if (!details.sprites?.front_default || !details.height || !details.types) {
            throw new Error(`Missing crucial details for Pokémon ${pokemon.name}.`);
          }

          pokemon.imageUrl = details.sprites.front_default;
          pokemon.height = details.height;
          pokemon.types = details.types;
        })
        .catch((error) => {
          console.error(`Error fetching details for ${pokemon.name}:`, error);
        })
        .finally(hideLoadingMessage); // Always hide loading message
    };

    // Generic error handler function
    const handleError = (message) => (error) => {
      console.error(`${message} ${error.message || error}`);
    };

    // Return the repository's public API
    return {
      add,
      getAll,
      loadList,
      loadDetails,
      heightThreshold,
      showDetails
    };
  })(); // End of IIFE

  // Load the Pokémon list and display them
  pokemonRepository.loadList()
    .then(displayPokemon)
    .catch(handleError('Failed to load Pokémon data:'));

  // Display Pokémon data
  function displayPokemon() {
    const ulElement = document.querySelector('.pokemon-list');
    if (!ulElement) {
      console.error('UL element with class .pokemon-list not found!');
      return;
    }

    ulElement.innerHTML = ''; // Clear the existing list

    pokemonRepository.getAll().forEach((pokemon) => {
      const listItem = document.createElement('li');

      const button = document.createElement('button');
      button.classList.add('pokemon-button');
      button.innerText = pokemon.name;

      // Log for debugging button creation
      console.log('Button created for:', pokemon.name);

      // Attach the event listener to the button
      button.addEventListener('click', () => {
        console.log(`Button clicked for: ${pokemon.name}`);  // Log for debugging click
        pokemonRepository.showDetails(pokemon);
      });

      listItem.appendChild(button);

      const heightMessage = pokemon.height >= pokemonRepository.heightThreshold ? ' ----> Wow, that’s big!' : '';
      const heightElement = document.createElement('p');
      heightElement.innerText = `Height: ${pokemon.height}m${heightMessage}`;
      listItem.appendChild(heightElement);

      ulElement.appendChild(listItem);
    });
  }

  // Show the loading message
  function showLoadingMessage() {
    if (!document.querySelector('.loading-message')) {
      const loadingMessage = document.createElement('div');
      loadingMessage.classList.add('loading-message');
      loadingMessage.innerText = 'Loading Pokémon data... Please wait!';
      document.body.appendChild(loadingMessage);
    }
  }

  // Hide the loading message
  function hideLoadingMessage() {
    const loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }
});