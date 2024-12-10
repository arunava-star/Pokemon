const apiUrl = 'https://pokeapi.co/api/v2/pokemon';

const pokemonList = document.getElementById('pokemonList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const errorMessage = document.getElementById('errorMessage');

async function fetchPokemons() {
    try {
        const response = await fetch(`${apiUrl}?limit=50`);
        if (!response.ok) throw new Error('Failed to load Pokémon data.');
        const data = await response.json();
        displayPokemons(data.results);
    } catch (error) {
        displayError(error.message);
    }
}

function displayPokemons(pokemons) {
    pokemonList.innerHTML = '';
    errorMessage.textContent = '';
    pokemons.forEach(async (pokemon) => {
        try {
            const res = await fetch(pokemon.url);
            if (!res.ok) throw new Error('Failed to load Pokémon details.');
            const details = await res.json();
            const card = `
                <div class="pokemon-card">
                    <img src="${details.sprites.front_default}" alt="${details.name}">
                    <h3>${details.name}</h3>
                </div>`;
            pokemonList.innerHTML += card;
        } catch (error) {
            displayError(error.message);
        }
    });
}

async function searchPokemon() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
        displayError('Please enter a Pokémon name.');
        return;
    }
    try {
        const response = await fetch(`${apiUrl}/${searchTerm}`);
        if (!response.ok) throw new Error('Pokémon not found.');
        const pokemon = await response.json();
        pokemonList.innerHTML = `
            <div class="pokemon-card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
            </div>`;
        errorMessage.textContent = '';
    } catch (error) {
        displayError(error.message);
    }
}

function displayError(message) {
    errorMessage.textContent = message;
}

searchButton.addEventListener('click', searchPokemon);

fetchPokemons();
