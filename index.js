/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for  (const game of games) {

        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
            <img src="${game.img}" class="game-img" />
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <div class="game-details">
                <p>Pledged: $${game.pledged.toLocaleString()}</p>
                <p>Goal: $${game.goal.toLocaleString()}</p>
                <p>Backers: ${game.backers.toLocaleString()}</p>
                <p>Progress: ${Math.round((game.pledged/game.goal) * 100)}%</p>
            </div>`
;
        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

addGamesToPage(GAMES_JSON);

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

/*reduce takes two arguments: a callback and the initial value.
● Callback: a two-argument function that runs once for each element of the list, telling JavaScript what
  to do with that element to produce the final value. The two arguments are the accumulator variable,
  which stores the values of all previous calls together, and the list element itself.
● Initial value: the starting value for the accumulator variable.
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalBackers = GAMES_JSON.reduce((total, game) => total + game.backers, 0);


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = totalBackers.toLocaleString();

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalPledged = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalPledged.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // print out the number of unfunded games
    console.log("Number of unfunded games:", unfundedGames.length);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // print out the number of unfunded games
    console.log("Number of unfunded games:", fundedGames.length);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}
//print outs for filterUnfundedOnly() & filterFundedOnly()
console.log("Unfunded games count:", filterUnfundedOnly());
console.log("Funded games count:", filterFundedOnly());

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);
const description = `Our company has raised $${totalRaised.toLocaleString()} from ${GAMES_JSON.length}
                    games. We currently have ${unfundedGames} ${unfundedGames === 1 ? 'game' : 'games'}
                    that still need${unfundedGames === 1 ? 's' : ''} funding.`;


// create a new DOM element containing the template string and append it to the description container
const p = document.createElement('p');
p.textContent = description;
descriptionContainer.appendChild(p);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame] = [...sortedGames];

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstPlace = document.createElement('p');
firstPlace.innerHTML = firstGame.name;
firstGameContainer.appendChild(firstPlace);

// do the same for the runner up item
const secondPlace = document.createElement('p');
secondPlace.innerHTML = secondGame.name;
secondGameContainer.appendChild(secondPlace);


/* BONUS SEARCH BAR*/
// Add search functionality to filter games based on name or description
const searchInput = document.getElementById('search-input');

// Listen for changes in the search input
searchInput.addEventListener('input', (e) => {
 // Get lowercase search term
 const searchTerm = e.target.value.toLowerCase();
 
 // Filter games that match search term in name or description
 const filteredGames = GAMES_JSON.filter(game => 
   game.name.toLowerCase().includes(searchTerm) || 
   game.description.toLowerCase().includes(searchTerm)
 );
 
 // Clear current games and display filtered results
 deleteChildElements(gamesContainer);
 addGamesToPage(filteredGames);
});

// make sure to display all the games
showAllGames()