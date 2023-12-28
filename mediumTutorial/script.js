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

//random number generator
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const getData = (url) => {
  return fetch(url).then((res) => res.json());
};

const allPokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";

async function getRandomData() {
  const data = await getData(allPokeUrl);
  let randoPoke = getRandomInt(data.count);
  const pokeData = await getData(data.results[randoPoke].url).catch(() => null);

  let pokeObject = {
    name: pokeData.name.toUpperCase(),
    image: pokeData.sprites["other"]["official-artwork"]["front_default"],
    id: pokeData.id,
    type: pokeData.types.map((type) => type.type.name).join(" - "),
    alt: "image of the pokemon: " + pokeData.name,
  };

  //did you get the data you wanted?
  console.log("pokeObject: ", pokeObject);
  return pokeObject;
}

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
  $card.setAttribute(
    "style",
    `background: radial-gradient(circle at 50% 0%, ${themeColor} 36%, #ffffff 36%)`
  );
  $card.innerHTML = `
    <div id="${pokemonData.id}" class="poke-card" >
        <div class="card-body">
            <div>
                <div class="img-wrapper">
                    <img src=${pokemonData.image} />
                </div>
            <h2 class="poke-name">"${pokemonData.name}"</h2>
            
            </div>
            <h2 class="poke-name">- ${pokemonData.name}</h2>
            <div class="types">
                <span style="background: ${themeColor}">${pokemonData.type}</span>
            </div>
        </div>
    </div>
`;

  return $card;
};

const collectionsGrid = document.querySelector(".main-collection");

let makingData = () =>
  getRandomData().then((result) => {
    //you can use this to see what came back
    console.log("heres the result: ", result);
    //this will erase what is currently there
    collectionsGrid.innerHTML = "";
    let card = buildPokeCard(result);
    //this will put the data you created into the section
    collectionsGrid.append(card);
  });
makingData();

const fetchNewPokemonBtn = document.querySelector("#new-pokemon-btn");

//get new pokemon button
fetchNewPokemonBtn.addEventListener("click", () => {
  console.log("clicked for new pokemon");
  makingData();
});
