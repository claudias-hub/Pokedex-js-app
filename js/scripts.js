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

for (let i = 0; i < pokemonList.length; i++) {
  let heightClass = "";
  
  if (pokemonList[i].height > 1.5) {
    heightClass = "- - - Wow, that’s big!";
  } 


// Display the name, height, and classification
document.write(
  `<strong>Name:</strong> ${pokemonList[i].name} 
   <strong>Height:</strong> ${pokemonList[i].height}  
   <strong>${heightClass}</strong><br>`
  );
}

