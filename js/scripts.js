document.addEventListener('DOMContentLoaded', function() {

      // Define the IIFE to manage the pokemon repository
  let pokemonRepository = (function() { 
    let pokemonList = [
      { name: "Arbok", height: 3.5, types: ["Poison"] },
      { name: "Pikachu", height: 0.4, types: ["Electric"] },
      { name: "Charmeleon", height: 1.1, types: ["Fire"] },
      { name: "Ninetales", height: 1.1, types: ["Fire"] },
      { name: "Clefable", height: 1.3, types: ["Fairy"] },
      { name: "Electrode", height: 1.2, types: ["Electric"] },
      { name: "Pidgeot", height: 1.7, types: ["Flying", "Normal"] }
    ];
    
    const heightThreshold = 1.6;  // heightThreshold should be inside the IIFE
    
        // Public functions inside the IIFE
    function getAll() {
      return pokemonList;
    }
    
    function add(pokemon) {
      if (pokemon && pokemon.name && pokemon.height) {
        pokemonList.push(pokemon);
      } else {
        console.log('Invalid Pokémon data');
      }
    }
    
    // Return the public methods as keys
    return {
      getAll: getAll,
      add: add,
      heightThreshold: heightThreshold  // Make heightThreshold accessible outside
    };

  })();
    
      // Function to display the Pokémon
  function displayPokemon() { 
    let output = "";
    const container = document.getElementById('pokemon-container'); // Get the container

    // Check if the container exists
    if (!container) {
      console.error('Container element not found!');
      return;
    }
    
    pokemonRepository.getAll().forEach(function(pokemon) {
      let heightClass = "";
      let pokemonName = `<strong>Name:</strong>${pokemon.name}`;
      let pokemonHeight = `<strong>Height:</strong> ${pokemon.height} meters`;
      let heightClassMessage = `<strong>${heightClass}</strong>`;

      // If the Pokémon height is above the threshold, update the message
      if (pokemon.height >= pokemonRepository.heightThreshold) {
        heightClass = "----> Wow, that’s big!";
      }

      // Build the output string for each Pokémon
      output += `
        <div class="pokemon-card">
          <h3 class="pokemon-name">${pokemon.name}</h3>
          ${pokemonHeight} 
          ${heightClassMessage} 
        </div>
      `;
    });
  
    container.innerHTML = output; // Insert the generated HTML into the container
    }
    
      // Call the function to display the Pokémon
    displayPokemon();
    
    });  
      // Display the name, height, and classification
      // document.write(output);
      //   });
      
  
  