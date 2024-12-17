document.addEventListener('DOMContentLoaded', () => {
    
    // Variables to hold quotes and favorites
    let favorites = [];
    const apiBase = "https://api.gameofthronesquotes.xyz/v1";

    // DOM Elements
    const quoteBox = document.getElementById("quote-box");
    const favoriteSection = document.getElementById("favorite-quotes");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const randomQuoteButton = document.getElementById("random-quote-button");
    const suggestQuoteForm = document.getElementById("suggest-quote-form");

    // Function to fetch a random quote
    async function fetchRandomQuote() {
        try {
            const response = await fetch(`${apiBase}/random`);
            const quote = await response.json();
            displayQuote(quote.sentence, quote.character.name);
        } catch (error) {
            console.error("Error fetching random quote:", error);
            quoteBox.innerHTML = "<p>Failed to load quote. Try again later.</p>";
        }
    }

    // Display a quote in the main quote box
    function displayQuote(quoteText, character) {
        quoteBox.innerHTML = `
        <blockquote>"${quoteText}"</blockquote>
        <p>- ${character}</p>
        <button onclick="addToFavorites('${quoteText}', '${character}')">Add to Favorites</button>
    `;
    }

    // Add a quote to favorites
    function addToFavorites(quoteText, character) {
        const newFavorite = { text: quoteText, character };
        favorites.push(newFavorite);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
    }

    // Render favorite quotes from `favorites`
    function renderFavorites() {
        favoriteSection.innerHTML = ""; // Clear previous
        favorites.forEach((quote, index) => {
            const quoteDiv = document.createElement("div");
            quoteDiv.classList.add("favorite-quote");
            quoteDiv.innerHTML = `
            <p>"${quote.text}" - <strong>${quote.character}</strong></p>
            <button onclick="removeFavorite(${index})">Remove</button>
        `;
            favoriteSection.appendChild(quoteDiv);
        });
    }

    // Remove a favorite quote
    function removeFavorite(index) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
    }

    // Search quotes (using API based on character)
    async function searchQuotes() {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) {
            searchResults.innerHTML = "<p>Please enter a character name.</p>";
            return;
        }
        try {
            const response = await fetch(`${apiBase}/author/${searchTerm.toLowerCase()}/2`);
            const quotes = await response.json();
            displaySearchResults(quotes);
        } catch (error) {
            console.error("Error searching for quotes:", error);
            searchResults.innerHTML = "<p>No results found or an error occurred.</p>";
        }
    }

    // Display search results
    function displaySearchResults(quotes) {
        searchResults.innerHTML = ""; // Clear previous
        quotes.forEach((quote) => {
            const quoteDiv = document.createElement("div");
            quoteDiv.classList.add("search-quote");
            quoteDiv.innerHTML = `
            <p>"${quote.sentence}" - <strong>${quote.character.name}</strong></p>
            <button onclick="addToFavorites('${quote.sentence}', '${quote.character.name}')">Add to Favorites</button>
        `;
            searchResults.appendChild(quoteDiv);
        });
    }

    // Handle form submission to suggest a quote
    function handleFormSubmission(event) {
        event.preventDefault(); // Prevent form reload
        const quoteText = document.getElementById("quote-text").value;
        const characterName = document.getElementById("character-name").value;
        const animeName = document.getElementById("anime-name").value;

        alert(`Thank you for suggesting a quote from ${characterName} in ${animeName}!`);
        suggestQuoteForm.reset();
    }

    // Event Listeners
    randomQuoteButton.addEventListener("click", fetchRandomQuote);
    searchInput.addEventListener("input", searchQuotes);
    suggestQuoteForm.addEventListener("submit", handleFormSubmission);

    // Load favorites from localStorage on page load
    window.addEventListener("DOMContentLoaded", () => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
        if (savedFavorites) {
            favorites = savedFavorites;
            renderFavorites();
        }
    });
});

