document.addEventListener('DOMContentLoaded', () => {

    // Variables to hold quotes and favorites
    let favorites = [];
    const apiBase = "https://api.gameofthronesquotes.xyz/v1";
    // const xterBase = "https://api.gameofthronesquotes.xyz/v1/author"


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

    function displayQuote(quoteText, character) {
        quoteBox.innerHTML = `
            <blockquote>"${quoteText}"</blockquote>
            <p>- ${character}</p>
            <button id="add-to-favorites">Add to Favorites</button>
        `;

        // Attach event listener for adding to favorites
        const addToFavoritesButton = document.getElementById('add-to-favorites');
        addToFavoritesButton.addEventListener('click', () => {
            addToFavorites(quoteText, character);
        });
    }

    // Add a quote to favorites
    function addToFavorites(quoteText, character) {
        const newFavorite = { text: quoteText, character };
        favorites.push(newFavorite);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
    }

    // // Render favorite quotes from favorites
    // function renderFavorites() {
    //     favoriteSection.innerHTML = ""; // Clear previous
    //     favorites.forEach((quote, index) => {
    //         const quoteDiv = document.createElement("div");
    //         quoteDiv.classList.add("favorite-quote");
    //         quoteDiv.innerHTML =
    //             `<p>"${quote.text}" - <strong>${quote.character}</strong></p>
    //         <button class="remove-favorite" data-index="${index}">Remove</button>`;
    //         favoriteSection.appendChild(quoteDiv);
    //     });
    // }

    function renderFavorites() {
        favoriteSection.innerHTML = ""; // Clear previous
    
        // Create an ordered list for the favorite quotes
        const ol = document.createElement('ol');
        
        favorites.forEach((quote, index) => {
            const li = document.createElement('li');
            li.classList.add("favorite-quote");
            
            li.innerHTML = `
                "<em>${quote.text}</em>" - <strong>${quote.character}</strong>
                <button class="remove-favorite" data-index="${index}">Remove</button>
            `;
            
            ol.appendChild(li);
        });
    
        // Append the ordered list to the favorite section
        favoriteSection.appendChild(ol);
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
            if (quotes.length === 0) {
                searchResults.innerHTML = "<p>No results found.</p>";
            } else {
                displaySearchResults(quotes);
            }
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
            quoteDiv.innerHTML =
                `<p>"${quote.sentence}" - <strong>${quote.character.name}</strong></p>
            <button class="add-to-favorites" data-text="${quote.sentence}" data-character="${quote.character.name}">Add to Favorites</button>`;
            searchResults.appendChild(quoteDiv);
        });
    }

    document.body.addEventListener("click", (event) => {
        // Handle 'Add to Favorites'
        if (event.target.classList.contains("add-to-favorites")) {
            const quoteText = event.target.dataset.text;
            const character = event.target.dataset.character;
            addToFavorites(quoteText, character);
        }

        // Handle 'Remove Favorite'
        if (event.target.classList.contains("remove-favorite")) {
            const index = event.target.dataset.index;
            removeFavorite(index);
        }
    });

    // Handle form submission to suggest a quote
    suggestQuoteForm.addEventListener("submit", handleFormSubmission);

    function handleFormSubmission(event) {
        event.preventDefault(); // Prevent form reload
        const quoteText = document.getElementById("quote-text").value;
        const characterName = document.getElementById("character-name").value;

        alert(`Thank you for suggesting a quote from ${characterName} in ${quoteText}!`);
        suggestQuoteForm.reset();
    }

    // Event Listeners
    randomQuoteButton.addEventListener("click", fetchRandomQuote);
    searchInput.addEventListener("input", searchQuotes);

    // Load favorites from localStorage on page load
    window.addEventListener("DOMContentLoaded", () => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
        if (savedFavorites) {
            favorites = savedFavorites;
            renderFavorites();
        }
    });
});
