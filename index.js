//JS for Pokemon by Minna Nordlund
//Defined
const pokeDropdown1 = document.querySelector("#pokeDropdown1");
const pokeDropdown2 = document.querySelector("#pokeDropdown2");
const pokeSelect = document.querySelectorAll("select");
const pokemon1 = document.querySelector(".pokemon1Score");
const pokemon2 = document.querySelector(".pokemon2Score");
const compareButton = document.querySelector(".compareButton");

// Pokemon constructor
class Pokemon {
	constructor(imageUrl, name, type, weight, height, stats) {
		this.name = name;
		this.imageUrl = imageUrl;
		this.type = type;
		this.weight = weight;
		this.height = height;
		this.stats = stats;
	}
}

// Show pokemon info
const displayPokemon = (pokemon, pokemonArena) => {
	pokemonArena.dataset.pokemon = JSON.stringify(pokemon); // Set the data-pokemon attribute
	pokemonArena.innerHTML = `
    <div class="pokeBox p-1">
        <div class="pokeImg d-flex justify-content-center align-items-center">
            <img src="${pokemon.imageUrl}" alt="${pokemon.name}" img class="h-75 px-1 py-0"/>
        </div>
            <!--Pokemon details-->
            <div>
                <div class="pokemonDetails">
                    <h2 class=" text-uppercase">${pokemon.name}</h2>
                        <p>Type: ${pokemon.type.join(", ")}</p>
                        <p>Weight: ${pokemon.weight} kg</p>
                        <p>Height: ${pokemon.height} m</p>
                </div>
            <!--Pokemon Stats-->
        <div class="pokeStats">
                <h2 class="text-uppercase">Stats:</h2>
                    <ul class="statsClass list-unstyled">
                        <li>HP: ${pokemon.stats.hp}</li>
                        <li>Attack: ${pokemon.stats.attack}</li>
                        <li>Special attack: ${pokemon.stats["special-attack"]}</li>
                        <li>Defense: ${pokemon.stats.defense}</li>
                        <li>Special defense: ${pokemon.stats["special-defense"]}</li>
                        <li>Speed: ${pokemon.stats.speed}</li>
                    </ul>
            </div>
         </div>
    </div>
    `;
};

// Fetches pokemon data from API
let getPokeData = async (pokemonName) => {
	try {
		let response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${pokemonName}`
		);
		if (!response.ok) {
			throw new Error("Failed to fetch Pokémon data");
		}
		let data = await response.json();
		console.log(data);
		let stats = {};
		data.stats.forEach((stat) => {
			stats[stat.stat.name] = stat.base_stat;
		});
		return new Pokemon(
			data.sprites.other.dream_world.front_default,
			data.name,
			data.types.map((type) => type.type.name),
			data.weight,
			data.height,
			stats,
			data.stats[0].base_stat
		);
	} catch (error) {
		console.log(error);
	}
};

// Pokeselect
pokeSelect.forEach((dropdown) => {
	dropdown.addEventListener("change", async () => {
		const winnerpokemonArena = document.querySelector(".winner");
		winnerpokemonArena.innerHTML = "";
		let selectedPokemon = dropdown.value;
		if (!selectedPokemon) return;
		let pokemonData = await getPokeData(selectedPokemon);

		displayPokemon(pokemonData, dropdown.parentElement.nextElementSibling);
	});
});

// Add pokemons to dropdown
let fillDropdown = async (dropdown) => {
	let url = "https://pokeapi.co/api/v2/pokemon?limit=151";
	let response = await fetch(url);
	let { results } = await response.json();
	results.forEach((pokemon) => {
		let option = document.createElement("option");
		option.value = pokemon.name;
		option.text = pokemon.name;
		dropdown.appendChild(option);
	});
};

// Function for comparing the pokemons stats
let comparePokemon = (pokemon1, pokemon2) => {
	const Traits1 = Object.values(pokemon1.stats);
	const Traits2 = Object.values(pokemon2.stats);

	let winner = null;

	Traits1.forEach((statValue1, index) => {
		const statValue2 = Traits2[index];

		let statElement1 = document.querySelector(
			`.pokemon1Score .pokeStats ul li:nth-child(${index + 1})`
		);
		let statElement2 = document.querySelector(
			`.pokemon2Score .pokeStats ul li:nth-child(${index + 1})`
		);

		compareTraits(statValue1, statValue2, statElement1, statElement2);
	});

	// Height and Weight comparison
	let height1 = document.querySelector(
		".pokemon1Score .pokemonDetails p:nth-child(4)"
	);
	let height2 = document.querySelector(
		".pokemon2Score .pokemonDetails p:nth-child(4)"
	);
	compareTraits(pokemon1.height, pokemon2.height, height1, height2);

	let weight1 = document.querySelector(
		".pokemon1Score .pokemonDetails p:nth-child(3)"
	);
	let weight2 = document.querySelector(
		".pokemon2Score .pokemonDetails p:nth-child(3)"
	);
	compareTraits(pokemon1.weight, pokemon2.weight, weight1, weight2);

	const pokemon1Total = Traits1.reduce((acc, val) => acc + val, 0);
	const pokemon2Total = Traits2.reduce((acc, val) => acc + val, 0);

	if (pokemon1Total > pokemon2Total) {
		winner = pokemon1;
	} else if (pokemon1Total < pokemon2Total) {
		winner = pokemon2;
	}

	const winnerpokemonArena = document.querySelector(".winner");
	winnerpokemonArena.innerHTML = "";

	if (winner) {
		showWinner(winner, winnerpokemonArena);
	} else {
		winnerpokemonArena.textContent = "They are equals!";
	}
};

// EventListnerer for compareButton
compareButton.addEventListener("click", async () => {
	// Get pokemon data
	let pokedex1 = document.querySelector("#pokemon1Details").dataset.pokemon;
	let pokedex2 = document.querySelector("#pokemon2Details").dataset.pokemon;

	if (!pokedex1 || !pokedex2) {
		alert("Choose two pokemons");
		return;
	}

	// Parse pokemon data from dataset
	let pokemon1 = JSON.parse(pokedex1);
	let pokemon2 = JSON.parse(pokedex2);

	if (pokemon1.name === pokemon2.name) {
		alert("A pokemon can not be compared to itself!");
		return;
	}

	// Compare and update
	comparePokemon(pokemon1, pokemon2);
});

// Fill dropdowns with pokemon
fillDropdown(pokeDropdown1);
fillDropdown(pokeDropdown2);

const compareTraits = (value1, value2, element1, element2) => {
	if (value1 > value2) {
		element1.style.color = "#37BF8E"; // Secondary Green
		element2.style.color = "#eb4055"; // Secondary Red
	} else if (value1 < value2) {
		element1.style.color = "#37BF8E"; // Secondary Green
		element2.style.color = "#eb4055"; // Secondary Red
	} else {
		element1.style.color = "#ec8a49"; // Primary Orange
		element2.style.color = "#ec8a49"; // Primary Orange
	}
};

// const typeColors = {
// 	normal: "#A8A878",
// 	fire: "#F08030",
// 	water: "#6890F0",
// 	electric: "#F8D030",
// 	grass: "#78C850",
// 	ice: "#98D8D8",
// 	fighting: "#C03028",
// 	poison: "#A040A0",
// 	ground: "#E0C068",
// 	flying: "#A890F0",
// 	psychic: "#F85888",
// 	bug: "#A8B820",
// 	rock: "#B8A038",
// 	ghost: "#705898",
// 	dragon: "#7038F8",
// 	dark: "#705848",
// 	steel: "#B8B8D0",
// 	dark: "#EE99AC",
// };

//Show the winner
const showWinner = (winner, pokemonArena) => {
	pokemonArena.innerHTML = "";

	const winnerText = `The winner is ${winner.name}!`;

	const winnerInfo = document.createElement("div");
	winnerInfo.classList.add("winner-info");
	winnerInfo.textContent = winnerText;
	pokemonArena.appendChild(winnerInfo);
};