document.addEventListener('DOMContentLoaded', function() {

  // Create an IIFE (Immediately Invoked Function Expression) to encapsulate the Pokemon repository functionality
  let pokemonRepository = (function() {

    // Define an array containing Pokémon data
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

    // Define a height threshold value for Pokémon
    const heightThreshold = 1.6;

    
    // Function to add a new Pokémon to the repository
    function add(pokemon) {
      if (typeof pokemon === 'object' && pokemon !== null) {
        if (pokemon.name && pokemon.height) {
          // Add the new Pokémon to the list if it has a valid name and height
          pokemonList.push(pokemon);
        } else {
          console.log('Invalid Pokémon data: Missing name or height');
        }
      } else {
        console.log('Invalid Pokémon data: Not an object');
      }
    }

    // Function to return all Pokémon in the repository
    function getAll() {
      return pokemonList;
    }

    // Function to show the details of a Pokémon by logging it to the console
    function showDetails(pokemon) {
      loadDetails(pokemon).then(function () {
        console.log(pokemon);
      });
    }

    function loadList() {
      return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        let loadDetailsPromises = [];  // Create an array to hold promises for each Pokémon's details

        // Loop through each Pokémon in the results and load their details
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };

          
         
          // Create a promise for loading the details of this Pokémon and push it to the promises array
          loadDetailsPromises.push(loadDetails(pokemon).then(function() {
            add(pokemon);  // After loading details, add the Pokémon to the list
          }).catch(function (e) {
            console.error(e);  // Handle any errors
          }));
        });

        // Return a promise that resolves when all the details have been loaded
        return Promise.all(loadDetailsPromises);
      }).catch(function (e) {
        console.error(e);  // Handle any error during fetching the list
      });
    }

    // Function to load the details of a Pokémon from its URL
    function loadDetails(pokemon) {
      let url = pokemon.detailsUrl;  // Use the detailsUrl from the passed-in Pokémon object
      return fetch(url).then(function (response) {
        return response.json();
      }).then(function (details) {
        // Add the details to the Pokémon object
        pokemon.imageUrl = details.sprites.front_default;  // Add the image URL
        pokemon.height = details.height;  // Add the height
        pokemon.types = details.types;  // Add the types
      }).catch(function (e) {
        console.error(e);  // Handle any error during the fetch
      });
    }


    // Return the functions that will be accessible from outside the IIFE
    return {
      add: add,
      getAll: getAll,
      loadList: loadList,
      loadDetails: loadDetails,
      heightThreshold: heightThreshold,
      showDetails: showDetails
    };

  })(); // End of IIFE

  // Load the Pokémon list and then display them
  pokemonRepository.loadList().then(function() {
    // Once data is loaded, display the Pokémon
    displayPokemon();
  }).catch(function(e) {
    console.error('Failed to load Pokémon data:', e);  // Handle any error that might occur
  });

  // Function to display all Pokémon in the repository
  function displayPokemon() {

    // Get the UL element where the Pokémon list items will be appended
    let ulElement = document.querySelector('.pokemon-list');
    if (!ulElement) {
      console.error('UL element with class .pokemon-list not found!');
      return; // Exit the function if the UL element is not found
    }

    // Clear any existing list items from the UL element
    ulElement.innerHTML = '';

    // Loop through all Pokémon in the repository and create a list item for each
    pokemonRepository.getAll().forEach(function(pokemon) {

      // Create a new list item (LI) element
      let listItem = document.createElement('li');

      // Create a new button for the Pokémon
      let button = document.createElement('button');
      button.classList.add('pokemon-button');
      button.innerText = pokemon.name;

      // Add a click event listener to the button
      button.addEventListener('click', function() {
        pokemonRepository.showDetails(pokemon);  // Call the showDetails function with the clicked Pokémon
      });

      // Append the button to the list item
      listItem.appendChild(button);

      // Add a message about the Pokémon's height if it is above the height threshold
      let heightMessage = pokemon.height >= pokemonRepository.heightThreshold ? " ----> Wow, that’s big!" : "";

      // Create a new paragraph element to display the height of the Pokémon
      let heightElement = document.createElement('p');
      heightElement.innerText = `Height: ${pokemon.height}m${heightMessage}`;

      // Append the height paragraph to the list item
      listItem.appendChild(heightElement);

      // Append the list item to the UL element
      ulElement.appendChild(listItem);

    });
  }

  

});
