// Wait for the DOM to fully load before running the code
document.addEventListener('DOMContentLoaded', function() {

  // Create an IIFE (Immediately Invoked Function Expression) to encapsulate the Pokemon repository functionality
  let pokemonRepository = (function() {

    // Define an array containing Pokémon data
    let pokemonList = [
      { name: "Arbok", height: 3.5, types: ["Poison"] },
      { name: "Pikachu", height: 0.4, types: ["Electric"] },
      { name: "Charmeleon", height: 1.1, types: ["Fire"] },
      { name: "Ninetales", height: 1.1, types: ["Fire"] },
      { name: "Clefable", height: 1.3, types: ["Fairy"] },
      { name: "Electrode", height: 1.2, types: ["Electric"] },
      { name: "Pidgeot", height: 1.7, types: ["Flying", "Normal"] }
    ];

    // Define a height threshold value for Pokémon
    const heightThreshold = 1.6;

    // Function to return all Pokémon in the repository
    function getAll() {
      return pokemonList;
    }

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

    // Function to create a new Pokémon object and add it to the repository
    function addListItem(name, height, types) {
      const newPokemon = { name: name, height: height, types: types };
      add(newPokemon); // Add the new Pokémon to the list
      // Create a new button for the Pokémon
      const button = document.createElement('button');
      button.classList.add('pokemon-button');
      button.innerText = newPokemon.name;
      // Add a click event listener to the button
      button.addEventListener('click', function () {
       showDetails(newPokemon);  // Call showDetails with the new Pokémon object
     });
      // Append the button to the list item
      listItem.appendChild(button);

      // Append the list item to the UL element
      const ulElement = document.querySelector('.pokemon-list');
      ulElement.appendChild(listItem);
    }

    // Function to show the details of a Pokémon by logging it to the console
    function showDetails(pokemon) {
     console.log(pokemon);  // Log the entire Pokémon object to the console
}

    // Return the functions that will be accessible from outside the IIFE
    return {
      getAll: getAll,
      add: add,
      heightThreshold: heightThreshold,
      addListItem: addListItem,
      showDetails: showDetails
    };

  })(); // End of IIFE

  // Function to display all Pokémon in the repository
  function displayPokemon() {

    // Get the container element where the Pokémon list will be displayed
    const container = document.getElementById('pokemon-container');
    if (!container) {
      console.error('Container element not found!');
      return; // Exit the function if the container element is not found
    }

    // Get the UL element where the Pokémon list items will be appended
    let ulElement = document.querySelector('.pokemon-list');
    if (!ulElement) {
      console.error('UL element with class .pokemon-list not found!');
      return; // Exit the function if the UL element is not found
    }

    // Clear any existing list items from the UL element
    ulElement.innerHTML = '';

    // Loop through all Pokémon in the repository and create a list item for each
    pokemonRepository.getAll().forEach(function (pokemon) {

      // Create a new list item (LI) element
      let listItem = document.createElement('li');

      // Create a new button for the Pokémon
      let button = document.createElement('button');
      button.classList.add('pokemon-button');
      button.innerText = pokemon.name;

      // Add a click event listener to the button
      button.addEventListener('click', function () {
        pokemonRepository.showDetails(pokemon);       // Call the showDetails function with the clicked Pokémon
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

  // Call the displayPokemon function to show the Pokémon when the page loads
  displayPokemon();

});