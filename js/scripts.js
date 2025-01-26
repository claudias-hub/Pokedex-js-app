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
        height: 1.5, 
        types: ["Flying", "Normal"]
  }
      
];

const heightThreshold = 1.6;

for (let i = 0; i < pokemonList.length; i++) {
  let heightClass = "";
  let output = "";
  
  if (pokemonList[i].height >= heightThreshold) {
    heightClass = "----> Wow, that’s big!";
  } 

  let pokemonName = `<strong>Name:</strong> ${pokemonList[i].name}`;
  let pokemonHeight = `<strong>Height:</strong> ${pokemonList[i].height}`;
  let heightClassMessage = `<strong>${heightClass}</strong>`;

  output = `
    <div style="; padding: 5px; margin: 20px;">
      <h3 style="color: darkblue; text-decoration: underline; margin-bottom: 10px;">${pokemonList[i].name}</h3>
      ${pokemonHeight}
      ${heightClassMessage}
    </div>
`;

// Display the name, height, and classification
document.write(output);
}

