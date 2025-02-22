document.addEventListener('DOMContentLoaded', function () {
  // Encapsulate the Pokémon repository functionality using an IIFE (Immediately Invoked Function Expression)
  const pokemonRepository = (function () {
    let pokemonList = []
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/'
    const heightThreshold = 10

    // Add a new Pokémon to the repository
    function add(pokemon) {
      if (isValidPokemon(pokemon)) {
        pokemonList.push(pokemon)
      } else {
        console.error('Invalid Pokémon data: Missing name or height')
      }
    }

    // Helper function to validate Pokémon data
    function isValidPokemon(pokemon) {
      return typeof pokemon === 'object' && pokemon !== null && pokemon.name && pokemon.height
    }

    // Get all Pokémon from the repository
    function getAll() {
      return pokemonList
    }

    // Show Pokémon details in the console
    function showDetails(pokemon) {
      loadDetails(pokemon)
        .then(function () {
          console.log(pokemon)
        })
        .catch(function (error) {
          console.error(`Failed to load details for ${pokemon.name}: ${error.message}`)
        })
    }

    // Load the Pokémon list from the API
    function loadList() {
      return fetch(apiUrl)
        .then(handleApiResponse)
        .then(json => loadPokemonsInBatches(json))
        .catch(handleError('Failed to load Pokémon list:'))
    }

    // Handle API response and check for errors
    function handleApiResponse(response) {
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status} - ${response.statusText}`)
      }
      return response.json()
    }

    // Load Pokémon details in batches for performance optimization
    function loadPokemonsInBatches(json) {
      const batchSize = 5
      let loadDetailsPromises = []

      for (let i = 0; i < json.results.length; i++) {
        let pokemon = {
          name: json.results[i].name,
          detailsUrl: json.results[i].url
        }

        loadDetailsPromises.push(loadDetails(pokemon).then(() => add(pokemon)))

        if (loadDetailsPromises.length === batchSize || i === json.results.length - 1) {
          // Wait for all promises in the current batch to resolve
          return Promise.all(loadDetailsPromises)
            .then(() => loadDetailsPromises = []) // Reset for next batch
            .catch(handleError('Error loading Pokémon batch:'))
        }
      }
    }

    // Load details of a specific Pokémon
    function loadDetails(pokemon) {
      return fetch(pokemon.detailsUrl)
        .then(handleApiResponse)
        .then(details => {
          if (!details.sprites || !details.sprites.front_default || !details.height || !details.types) {
            throw new Error(`Missing crucial details for Pokémon ${pokemon.name}.`)
          }

          pokemon.imageUrl = details.sprites.front_default
          pokemon.height = details.height
          pokemon.types = details.types
        })
        .catch(handleError(`Failed to load details for Pokémon ${pokemon.name}:`))
    }

    // Generic error handler function
    function handleError(message) {
      return function (error) {
        console.error(`${message} ${error.message || error}`)
      }
    }

    // Return the repository's public API
    return {
      add,
      getAll,
      loadList,
      loadDetails,
      heightThreshold,
      showDetails
    }

  })() // End of IIFE

  // Load the Pokémon list and display them
  pokemonRepository.loadList()
    .then(() => {
      displayPokemon()
    })
    .catch(handleError('Failed to load Pokémon data:'))

  // Display Pokémon data
  function displayPokemon() {
    const ulElement = document.querySelector('.pokemon-list');
    if (!ulElement) {
      console.error('UL element with class .pokemon-list not found!');
      return;
    }

    ulElement.innerHTML = ''; // Clear the existing list

    pokemonRepository.getAll().forEach(function (pokemon) {
      const listItem = document.createElement('li')

      const button = document.createElement('button')
      button.classList.add('pokemon-button')
      button.innerText = pokemon.name

      // Log for debugging button creation
      console.log('Button created for:', pokemon.name);

      // Attach the event listener to the button
      button.addEventListener('click', function () {
        console.log(`Button clicked for: ${pokemon.name}`);  // Log for debugging click
        pokemonRepository.showDetails(pokemon)
      })

      listItem.appendChild(button);

      const heightMessage = pokemon.height >= pokemonRepository.heightThreshold ? ' ----> Wow, that’s big!' : ''
      const heightElement = document.createElement('p')
      heightElement.innerText = `Height: ${pokemon.height}m${heightMessage}`
      listItem.appendChild(heightElement)

      ulElement.appendChild(listItem)
    })
  }

  // Generic error handler for logging
  function handleError(message) {
    return function (error) {
      console.error(`${message} ${error.message || error}`)
    }
  }

})