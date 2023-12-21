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
  let quotedDisney = quoteChar[disneyQuote];
  return quotedDisney;
};

async function getRandomData() {
  const data = await getData(allPokeUrl);
  //   console.log("count:", data.count);
  let randoPoke = getRandomInt(data.count);
  //   console.log("randoPoke: ", randoPoke);
  //   const pokeData = await getData(pokeUrl + `${randoPoke}`).catch(() => null);

  //   console.log("data.results[randoPoke][url]: ", data.results[randoPoke].url);
  const pokeData = await getData(data.results[randoPoke].url).catch(() => null);

  if (pokeData === null) {
    makingData();
  } else {
    //     console.log("pokeData: ", pokeData);
    //     console.log("pokeData.name: ", pokeData.name);
    //     console.log("data.results", data.results);
    if (pokeData.name.includes("-")) {
      let one = pokeData.name.split("-");
      pokeData.name = one[0];
    }
    // console.log("pokeData.name: ", pokeData.name);
    //this will get our disney quote
    let disQuoted = getQuote();

    // let imgResult = "";
    let imposterImg = "./images/crewmate-among-us-big-keychains.jpg";

    let pokeObject = {
      name: pokeData.name.toUpperCase(),
      image: pokeData.sprites["other"]["official-artwork"]["front_default"],
      id: pokeData.id,
      type: pokeData.types.map((type) => type.type.name).join(" - "),
      alt: "image of the pokemon: " + pokeData.name,
      disQuote: disQuoted,
      imgWrapper: "img-wrapper",
    };

    if (
      pokeData.sprites["other"]["official-artwork"]["front_default"] === null
    ) {
      pokeObject = {
        name: pokeData.name.toUpperCase() + " - IMPOSTER",
        image: imposterImg,
        id: pokeData.id,
        type: pokeData.types.map((type) => type.type.name).join(" - "),
        alt:
          "No image of the pokemon: " +
          pokeData.name +
          " so here is an imposter/crewmate",
        disQuote: disQuoted,
        imgWrapper: "noImg",
      };
    }

    console.log("pokeObject: ", pokeObject);
    return pokeObject;
  }
}

const collectionsGrid = document.querySelector(".main-collection");
console.log("collectionsGrid: ", collectionsGrid);
const fetchNewPokemonBtn = document.querySelector("#new-pokemon-btn");
const translateBtn = document.querySelector("#translate-btn");
const modalBody = document.querySelector(".modal-body");
const translatedBody = document.querySelector(".poke-name #translated");

let makingData = () =>
  getRandomData().then((result) => {
    collectionsGrid.innerHTML = "";
    modalBody.innerHTML = "";
    console.log("heres the result: ", result);
    let card = buildPokeCard(result);
    collectionsGrid.append(card);
  });
makingData();

const buildPokeCard = (pokemonData) => {
  let pokeType;
  let oneType;
  //   getType(pokemonData);
  //trying to move this outside my function makes the layout funky
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

  $card.innerHTML = `
  
    <div id="${pokemonData.id}" class="poke-card" >
        <div class="card-body">
            <div>
                <div class=${pokemonData.imgWrapper}>
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

  modalBody.innerHTML = pokemonData.disQuote;

  console.log("modalBody inner should be: ", modalBody.innerHTML);

  return $card;
};

//get new pokemon button
fetchNewPokemonBtn.addEventListener("click", () => {
  console.log("clicked for new pokemon");
  makingData();
});
