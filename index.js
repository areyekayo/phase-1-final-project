//initialize character array to store character objects
const characters = []
//initialize Search State object to remember user's latest search & filter & result count
const searchState = {
    name: "",
    species: "",
    searchResults: 0
}

document.addEventListener("DOMContentLoaded", () => {
    //fetch characters from API
    fetch("https://rickandmortyapi.com/api/character")
        .then(res => res.json())
        .then(data => data["results"].forEach(character => addCharacter(character)))

    const searchForm = document.getElementById("search-form")
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        searchName(document.getElementById("name-to-search").value);
        searchForm.reset()
    })

    const filter = document.getElementById("species-filter")
    filter.addEventListener("change", () => filterBySpecies(filter.value))

    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", () => displayAllCharacters())
})

function addCharacter(char){
    /*
    Adds characters for initial fetch
    */
    const container = document.getElementById("character-container");

    const character = {
        "id": char.id.toString(),
        "Name": char.name,
        "Status": char.status,
        "Gender": char.gender,
        "Species": char.species,
        "Type": char.type,
        "image": char.image
    }
    //Save character object in Characters array
    characters.push(character)

    //create attributes for character card
    const keys = ["Name", "Status", "Gender", "Species", "Type"]
    const ul = document.createElement("ul")
    for (let key of keys){
        const li = document.createElement("li");
        li.textContent = `${key}: ${character[key]}`
        li.className = key;
        ul.append(li)
    }
    //add card, card properties, and image
    const card = document.createElement("div");
    const image = document.createElement("img");
    card.className = "character-card"
    card.id = character["id"];
    card.style.display = "block";

    image.src = character["image"];
    card.append(image, ul)
    container.append(card)

    //set search state
    setSearchState("","", characters.length)
}

function filterBySpecies(species) {
    /// Takes the input of selected species filter, gets ID matches, and displays matched character cards

    let ids;
    // check to see if a name has been searched for
    if (searchState.name !== ""){
        // get IDs for characters that match name and species
        ids = getMatchIds(searchState.name, species, true)
    }
    else {
        // otherwise get IDs for only species
        ids = getMatchIds(undefined, species, false)
    }
    // display matched cards and set search state
    displayMatches(ids)
    setSearchState(undefined, species, ids.length)
}

function searchName(name){
    // Takes the input of character name search and finds matches in the characters array

    let ids;
    if (searchState.species !== ""){
        //if species is in search state, get IDs for characters that match name and species
        ids = getMatchIds(name, searchState.species, true)
    }
    else {
        //otherwise get IDs for only species
        ids = getMatchIds(name, undefined, false)
    }
    //display matched cards and set search state
    displayMatches(ids)
    setSearchState(name, undefined, ids.length)
}

function getMatchIds(name, species, matchBoth) {
    //High level function to get the IDs for searched names and/or filtered species
    let matches;
    //if name & species need to both be matched, get IDs that meet both parameters
    if (matchBoth === true){
        let nameMatches = getNameIds(name);
        let speciesMatches = getSpeciesIds(species)
        let set = new Set(nameMatches)
        matches = speciesMatches.filter(element => set.has(element))
    }
    //get IDs for only species
    else if (name === undefined && matchBoth === false){
        matches = getSpeciesIds(species)
    }
    //get IDs for only names
    else if (species === undefined && matchBoth === false){
        matches = getNameIds(name)
    }
    //searchState.searchResults = matches.length
    return matches
}

function getSpeciesIds(species){
    //Processes species filter and returns character IDs that match
    
    let matches;
    //if All Species filter is selected, get all character IDs
    if (species === "All"){
       matches = characters.reduce((acc, character) => {
            acc.push(character["id"]);
            return acc
        }, [])
        return matches
    }
    //otherwise, get characters that match Human or Alien species
    else {
         matches = characters.filter(character => {
            return character["Species"] === species
         })
        return matches.map(match => match["id"])
    }   
}

function getNameIds(name){
    //Processes name search and returns character IDs that match the name
    const nameCase = name.toLowerCase();
    const matches = characters.filter(character => {
        //split character name into an array in case of irregular character name
        const nameParts = character["Name"].toLowerCase().split(" ");
        return nameParts.includes(nameCase) || character["Name"].toLowerCase().includes(nameCase)
    })
    return matches.map(match => match["id"])
}

function displayAllCharacters(){
    //Displays all character cards
    let cards = Array.from(document.getElementsByClassName("character-card"))
    cards.forEach(card => card.style.display = "block")
    
    //reset search state keys to empty
    setSearchState("", "", cards.length)
    //reset species filter to "All"
    document.getElementById("species-filter").value = "All"
}

function displayMatches(ids){
    // Displays the character cards of passed IDs

    const cards = Array.from(document.getElementsByClassName("character-card"))
    cards.forEach(card => {

        //display cards if the card ID is in the matched IDs
        if (ids.includes(card.id)){
            card.style.display = "block";
        }
        //if not, hide card
        else {
            card.style.display = "none";
        }
    })
}

function setSearchState(name, species, count){
    /*
    Display name/species parameters and count of search results below search bar. Pass 'undefined' for parameters that aren't being passed. If clearing all search parameters, pass "" for both name and species.
    */
    let nameP = document.getElementById("name-state");
    let speciesP = document.getElementById("species-state");
    let resultsCount = document.getElementById("results-count");

    if (name === undefined){
        //if name is not searched, species was passed
        searchState.species = species;
        speciesP.innerText = species;
        speciesP.style.display = "block";
    }
    else if (species === undefined){
        //if species is not selected, name was passed
        searchState.name = name
        nameP.innerText = name;
        nameP.style.display = "block";
    }
    else if (species === "" && name === ""){
        //if the search is being reset
        searchState.name = "";
        searchState.species = "";
        nameP.innerText = "";
        nameP.style.display = "none";
        speciesP.innerText = "";
        speciesP.style.display = "none";
    }
    searchState.searchResults = count;
    resultsCount.innerText = `${searchState.searchResults} Characters`
    resultsCount.style.display = "block";
}