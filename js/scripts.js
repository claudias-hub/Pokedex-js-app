let pokemonList = [
  {
        name: "Arbok",
        height: 3.5,
        types: ["Poison"]
  },
  {
        name: "Pikachu",
        height: 0.4, 
        types: ["Electric"]
  },
  {
        name: "Charmeleon",
        height: 1.1, 
        types: ["Fire"]
  },
  {
        name: "Ninetales",
        height: 1.1, 
        types: ["Fire"]
  },
  {
        name: "Clefable",
        height: 1.3, 
        types: ["Fairy"]
  },
  {
        name: "Electrode",
        height: 1.2, 
        types: ["Electric"]
  },
  {
        name: "Pidgeot",
        height: 1.7, 
        types: ["Flying", "Normal"]
  }
      
];

const heightThreshold = 1.6;

pokemonList.forEach(function(pokemon) {
  let heightClass = "";
  let output = "";
  
  if (pokemon.height >= heightThreshold) {
    heightClass = "----> Wow, that’s big!";
  } 

  let pokemonName = `<strong>Name:</strong> ${pokemon.name}`;
  let pokemonHeight = `<strong>Height:</strong> ${pokemon.height} meters`;
  let heightClassMessage = `<strong>${heightClass}</strong>`;

  output = `
    <div class="pokemon-card">
      <h3 class="pokemon-name">${pokemon.name}</h3>
      ${pokemonHeight} 
      ${heightClassMessage} 
    </div>
`;

// Display the name, height, and classification
document.write(output);
}
)
