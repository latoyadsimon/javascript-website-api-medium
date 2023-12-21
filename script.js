const allPokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const pokeUrl = "https://pokeapi.co/api/v2/pokemon/";

// type colors from ref
const typeColor = {
  bug: "#26de81",
  dark: "#736c75",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  steel: "#89A1B0",
  water: "#0190FF",
};

let quotedDisney = "";
// we want a random pokemon to show up each time, so we know we will need a random number generator
//random number generator
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const getData = (url) => {
  return fetch(url).then((res) => res.json());
};

const getQuote = () => {
  let disneyQuote = getRandomInt(quoteChar.length);
  quotedDisney = quoteChar[disneyQuote];
  return quotedDisney;
};

async function getRandomData() {
  const data = await getData(allPokeUrl);
  console.log("count:", data.count);
  let randoPoke = getRandomInt(data.count);
  console.log("randoPoke: ", randoPoke);
  const pokeData = await getData(pokeUrl + `${randoPoke}`).catch(() => null);

  //   console.log("disney stuff: ", quoteChar);

  //   console.log("disney quote: ", quoteChar[disneyQuote]);
  // console.log(Object.values(data.results).flat());

  //   console.log("listen for: ", data.results.flat().includes[pokeData.name]);

  //   console.log(
  //     "data.results.includes[pokeData.name]: ",
  //     data.results.includes[pokeData.name]
  //   );
  //   if (data.results.includes[pokeData.name] ) {
  //     getRandomData();
  //   }
  //   console.log("pokeData === false", pokeData === "false");

  if (pokeData === null) {
    getRandomData().then((result) => {
      console.log("heres the result: ", result);
      let card = buildPokeCard(result);
      collectionsGrid.append(card);
    });
  } else {
    console.log("pokeData: ", pokeData);
    console.log("pokeData.name: ", pokeData.name);
    console.log("data.results", data.results);
    if (pokeData.name.includes("-")) {
      let one = pokeData.name.split("-");
      pokeData.name = one[0];
    }
    console.log("pokeData.name: ", pokeData.name);
    //this will get our disney quote
    let disQuoted = getQuote();

    // let imgResult = "";
    let imposterImg = "./images/images/crewmate-among-us-big-keychains.jpg";

    let pokeObject = {
      name: pokeData.name.toUpperCase(),
      image: pokeData.sprites["other"]["official-artwork"]["front_default"],
      id: pokeData.id,
      type: pokeData.types.map((type) => type.type.name).join(" - "),
      alt: "image of the pokemon: " + pokeData.name,
      disQuote: disQuoted,
    };

    if (
      pokeData.sprites["other"]["official-artwork"]["front_default"] === null
    ) {
      pokeObject = {
        name: pokeData.name.toUpperCase() + "IMPOSTER",
        image: imposterImg,
        id: pokeData.id,
        type: pokeData.types.map((type) => type.type.name).join(" - "),
        alt:
          "No image of the pokemon: " +
          pokeData.name +
          " so here is an imposter/crewmate",
        disQuote: disQuoted,
      };
    }

    console.log(
      pokeData.name.toUpperCase(),
      pokeData.sprites["other"]["official-artwork"]["front_default"],
      pokeData.id,
      pokeData.types.map((type) => type.type.name).join(" - "),
      "image of the pokemon: ",
      pokeData.name,
      disQuoted
    );

    // return {
    //   name: pokeData.name.toUpperCase(),
    //   image: pokeData.sprites["other"]["official-artwork"]["front_default"],
    //   id: pokeData.id,
    //   type: pokeData.types.map((type) => type.type.name).join(" - "),
    //   alt: "image of the pokemon: " + pokeData.name,
    //   disQuote: disQuoted,
    // };
    return pokeObject;
  }
}

const collectionsGrid = document.querySelector(".main-collection");
console.log("collectionsGrid: ", collectionsGrid);
const fetchNewPokemonBtn = document.querySelector("#new-pokemon-btn");
const translateBtn = document.querySelector("#translate-btn");
const modalBody = document.querySelector(".modal-body");
const translatedBody = document.querySelector(".poke-name #translated");

getRandomData().then((result) => {
  console.log("heres the result: ", result);
  let card = buildPokeCard(result);
  collectionsGrid.append(card);
  //   innerQuote(result.name);
});

const buildPokeCard = (pokemonData) => {
  let pokeType;
  let oneType;
  if (pokemonData.type.includes("-")) {
    oneType = pokemonData.type.split(" - ");
    pokeType = oneType[0];
  } else {
    pokeType = pokemonData.type;
  }
  const themeColor = typeColor[pokeType];

  const $card = document.createElement("div");
  $card.classList.add("card");
  $card.setAttribute("id", `${pokemonData.name}`);
  $card.setAttribute("style", `background-color:${themeColor}`);
  $card.setAttribute(
    "style",
    `background: radial-gradient(circle at 50% 0%, ${themeColor} 36%, #ffffff 36%)`
  );
  //   $card.setAttribute(
  //     "style",
  //     `background: radial-gradient(circle at 30% 0%, ${themeColor} 36%, #ffffff 36%)`
  //   );

  $card.innerHTML = `
  
    <div id="${pokemonData.id}" class="poke-card" >
        <div class="card-body" 
       
        >
            
            <div>
            <div class=img-wrapper>
                <img src=${pokemonData.image} />
            </div>
            <h2 class="poke-name" id="translated">"${pokemonData.name}"</h2>
            
            </div>
            <h2 class="poke-name">- ${pokemonData.name}</h2>
            <div class="types">
                <span style="background: ${themeColor}">${pokemonData.type}</span>
         
            </div>
          
        </div>
    </div>
`;

  //   modalBody.innerHTML = $card.innerHTML;
  modalBody.innerHTML = pokemonData.disQuote;

  console.log("modalBody inner should be: ", modalBody.innerHTML);

  return $card;
};
// translatedBody.innerHTML = quotedDisney;
// console.log("translatedBody inner should be: ", translatedBody.innerHTML);
//get new pokemon button
fetchNewPokemonBtn.addEventListener("click", () => {
  console.log("clicked for new pokemon");
  collectionsGrid.innerHTML = "";
  modalBody.innerHTML = "";
  //   translatedBody.innerHTML = "";

  //   quoteText.innerHTML = "";
  //   data = "";
  //   pokeData = "";
  getRandomData().then((result) => {
    console.log("heres the result: ", result);
    let card = buildPokeCard(result);
    collectionsGrid.append(card);
    // innerQuote(result.name);
  });
});

//   let innerQuote = "";
// let innerQuote = (result) => {
//   translateBtn.addEventListener("click", () => {
//     const quoteText = document.querySelector("#translated");
//     console.log("quoteText", quoteText);

//     console.log("translating now");
//     console.log("the disney quote: ", quotedDisney);
//     console.log("pokemon Quote: ", quoteText.innerHTML);
//     // result = `"${result}"`;
//     console.log("result", result);
//     //   console.log(innerQuote);
//     console.log(quoteText.innerHTML === quotedDisney[0]);
//     console.log(quoteText.innerHTML === result);
//     if (quoteText.innerHTML === quotedDisney[0]) {
//       quoteText.innerHTML = result;
//     } else if (quoteText.innerHTML === result) {
//       quoteText.innerHTML = quotedDisney;
//     }
//     return quoteText;
//   });
// };
