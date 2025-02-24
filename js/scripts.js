document.addEventListener('DOMContentLoaded', () => {
  // Encapsulate the Pokémon repository functionality using an IIFE
  const pokemonRepository = (() => {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10'; // Load 10 Pokémon
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
      typeof pokemon === 'object' && 
      pokemon !== null && 
      pokemon.name && 
      pokemon.height && 
      pokemon.imageUrl && // Added check for imageUrl
      pokemon.types && pokemon.types.length > 0 // Check that types exist
    );
    

    // Get all Pokémon from the repository
    const getAll = () => pokemonList;

    // Show Pokémon details in the console
    const showDetails = async (pokemon) => {
      try {
        const updatedPokemon = await loadDetails(pokemon);
    
        console.log('Loaded details:', updatedPokemon);
    
        if (!updatedPokemon || !updatedPokemon.name || !updatedPokemon.imageUrl || !updatedPokemon.height || !updatedPokemon.types) {
          throw new Error(`Invalid data for ${updatedPokemon?.name || 'unknown Pokémon'}`);
        }
    
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('pokemon-details');
        detailsContainer.innerHTML = `
          <h2>${updatedPokemon.name}</h2>
          <img src="${updatedPokemon.imageUrl}" alt="${updatedPokemon.name}">
          <p>Height: ${updatedPokemon.height}m</p>
          <p>Types: ${updatedPokemon.types.join(', ')}</p>
        `;
    
        document.body.appendChild(detailsContainer);
      } catch (error) {
        console.error(`Failed to load details for ${pokemon.name}:`, error);
        handleError(`Failed to load details for ${pokemon.name}`)(error);
      }
    };
    
    

    // Load the Pokémon list from the API
    const loadList = async () => {
      console.log(`Fetching Pokémon from: ${apiUrl}`);
      showLoadingMessage();
    
      try {
        const response = await fetch(apiUrl);
        const json = await handleApiResponse(response);
        
        console.log('Received Pokémon List:', json.results);
        await loadPokemonsInBatches(json);
      } catch (error) {
        handleError('Failed to load Pokémon list')(error);
      } finally {
        hideLoadingMessage();
      }
    };

    // Handle API response and check for errors
    const handleApiResponse = (response) => {
      if (!response.ok) {
        // Handle different HTTP status codes
        switch (response.status) {
          case 404:
            throw new Error('Pokemon not found');
          case 429:
            throw new Error('Too many requests. Please try again later');
          case 500:
            throw new Error('Server error. Please try again later');
          default:
            throw new Error(`Network error: ${response.status} - ${response.statusText}`);
        }
      }
      return response.json();
    };

    // Load Pokémon details in batches for performance optimization
    const loadPokemonsInBatches = async (json) => {
      if (!json?.results || !Array.isArray(json.results)) {
        return Promise.reject(new Error('Invalid API response format'));
      }
    
      const batchSize = 5;
      const pokemonBatches = [];
    
      for (let i = 0; i < json.results.length; i += batchSize) {
        const batch = json.results.slice(i, i + batchSize);
    
        // Load each Pokémon sequentially
        for (const pokemonData of batch) {
          if (!pokemonData.name || !pokemonData.url) {
            console.warn('Invalid pokemon data:', pokemonData);
            continue; // Skip invalid pokemon
          }
    
          const pokemon = {
            name: pokemonData.name,
            detailsUrl: pokemonData.url
          };
    
          try {
            await loadDetails(pokemon);
            add(pokemon);
          } catch (error) {
            console.error(`Failed to load Pokemon: ${pokemon.name}`, error);
            // Continue to next Pokémon even if current fails
          }
        }
    
        // Optional: Add a delay between batches to reduce load on the server
        // await delay(1000); // 1 second delay between batches
      }
    
      // Handle case where no Pokémon were successfully loaded
      if (pokemonList.length === 0) {
        throw new Error('No Pokemon could be loaded');
      }
    };

    // Load details of a specific Pokémon
    const loadDetails = async (pokemon) => {
      console.log(`Loading details for: ${pokemon.name}`);
    
      if (!pokemon.detailsUrl) {
        throw new Error('No details URL provided');
      }
    
      showLoadingMessage();
    
      try {
        const response = await fetch(pokemon.detailsUrl);
        const details = await handleApiResponse(response);
    
        if (!details?.sprites?.front_default || !details.height || !details.types) {
          throw new Error(`Incomplete or invalid data for ${pokemon.name}`);
        }
    
        // Update Pokémon details
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.types = details.types.map((type) => type.type.name);
    
        return pokemon;
      } catch (error) {
        handleError(`Failed to load details for ${pokemon.name}`)(error);
        pokemonList = pokemonList.filter((p) => p.name !== pokemon.name); // Remove incomplete Pokémon
        throw error; // Rethrow for further handling if needed
      } finally {
        hideLoadingMessage();
      }
    };
    
    

    // Generic error handler function
const handleError = (message) => (error) => {
  console.error(`${message}:`, error);

  // Determine a user-friendly error message
  let userMessage;
  if (error instanceof TypeError) {
    userMessage = 'There was a problem processing the data.';
  } else if (error instanceof SyntaxError) {
    userMessage = 'Unexpected data format received.';
  } else if (error instanceof ReferenceError) {
    userMessage = 'Something went wrong internally. Please try again.';
  } else {
    userMessage = 'An unexpected error occurred. Please try again later.';
  }

  // Show user-friendly error message in UI
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('error-message');
  errorContainer.innerHTML = ` 
    <p>${userMessage}</p>
    <button onclick="this.parentElement.remove()">Close</button>
  `;
  document.body.appendChild(errorContainer);

  // Rethrow error for promise chain handling
  throw error;
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
    .catch((error) => handleError('Failed to load Pokémon list:')(error));

  // Display Pokémon data
  function displayPokemon() {
    try {
      const ulElement = document.querySelector('.pokemon-list');
      if (!ulElement) {
        throw new Error('Pokemon list element not found');
      }
  
      const pokemonData = pokemonRepository.getAll();
      if (pokemonData.length === 0) {
        ulElement.innerHTML = '<li class="error-message">No Pokemon available to display</li>';
        return;
      }
  
      ulElement.innerHTML = '';
  
      pokemonData.forEach((pokemon) => {
        try {
          const listItem = document.createElement('li');
          const button = document.createElement('button');
          
          button.classList.add('pokemon-button');
          button.innerText = pokemon.name;
          button.addEventListener('click', () => {
            console.log(`Button clicked for ${pokemon.name}`); // <-- Debugging
            pokemonRepository.showDetails(pokemon)
              .catch(error => console.error('Failed to show details:', error));
          });
  
          const heightMessage = pokemon.height >= pokemonRepository.heightThreshold 
            ? ' ----> Wow, is a big Pokemon!' 
            : '';
          
          const heightElement = document.createElement('p');
          heightElement.innerText = `Height: ${pokemon.height}m${heightMessage}`;
          
          listItem.append(button, heightElement);
          ulElement.appendChild(listItem);
        } catch (error) {
          console.error(`Failed to display Pokemon: ${pokemon.name}`, error);
          // Continue with next Pokemon
        }
      });
    } catch (error) {
      handleError('Failed to display Pokemon list')(error);
    }
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
