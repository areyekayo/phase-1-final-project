const characters = []
const container = document.getElementById("character-container");
let searchState = {
    name: "",
    species: "",
    searchResults: 0
}

document.addEventListener("DOMContentLoaded", () => {
    //fetch characters from API
    fetch("https://rickandmortyapi.com/api/character")
        .then(res => res.json())
        .then(data => {
            data["results"].forEach(character => addCharacter(character))
    })

    const searchForm = document.getElementById("search-form")
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const nameToSearch = document.getElementById("name-to-search").value;
        searchName(nameToSearch);
    })

    const filter = document.getElementById("species-filter")
    filter.addEventListener("change", () => {
        filterBySpecies(filter.value)
    })

    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", () => displayAllCharacters())
})

function getMatchIds(name, species, matchBoth) {
    let matches;
    if (matchBoth === true){
        let nameMatches = getNameMatches(name);
        let speciesMatches = getSpeciesMatches(species)
        let set = new Set(nameMatches)
        matches = speciesMatches.filter(element => set.has(element))
    }
    else if (name === undefined && matchBoth === false){
        matches = getSpeciesMatches(species)
    }
    else if (species === undefined && matchBoth === false){
        matches = getNameMatches(name)
    }
    searchState.searchResults = matches.length
    return matches
}

function getSpeciesMatches(species){
    //process species filter and returns a list of character IDs that match the species
    const matches = characters.filter(character => {
        return character["Species"] === species
    })

    return matches.map(match => match["id"].toString())
}

function getNameMatches(name){
    //processes name search and returns a list of character IDs that match the name
    const nameCase = name.toLowerCase();
    const matches = characters.filter(character => {
        
        //split character name into an array in case of irregular character name
        const nameParts = character["Name"].toLowerCase().split(" ");
        return nameParts.includes(nameCase) || character["Name"].toLowerCase().includes(nameCase)
    
    })
    return matches.map(match => match["id"].toString())

}

function displayAllCharacters(){

    let cards = Array.from(document.getElementsByClassName("character-card"))
    cards.forEach(card => {
        card.style.display = "block";
    })
    //reset search state keys to empty
    setSearchState("", "")
}

function filterBySpecies(species) {
    //get cards that are displayed
    //note: need to handle selecting "select a species"

    let ids;
    //check to see if a name has been searched for

    if (searchState.name !== ""){
        //get IDs for characters that match name and species
        ids = getMatchIds(searchState.name, species, true)
    }
    else {
        //otherwise get IDs for only species
        ids = getMatchIds(undefined, species, false)
    }

    const cards = Array.from(document.getElementsByClassName("character-card"))
    cards.forEach(card => {
        //display cards if the card ID is in the matched IDs
        const shouldDisplay = ids.includes(card.id)
        if (shouldDisplay){
            card.style.display = "block";
        }
        //if not, do not display the card
        else {
            card.style.display = "none";
        }
    })

    setSearchState(undefined, species)
}

function searchName(name){
    /*
    takes the input of character name search, finds matches in the characters array, and displays matched character cards
    */

    let ids;
    //check if a species filter is already selected
    if (searchState.species !== ""){
        //get IDs for characters that match name and species
        ids = getMatchIds(name, searchState.species, true)
    }
    else {
        //otherwise get IDs for only species
        ids = getMatchIds(name, undefined, false)
    }

    // get an array of character cards
    let cards = Array.from(document.getElementsByClassName("character-card"))
    cards.forEach(card => {
        //display cards if the card ID is in the matched IDs
        const shouldDisplay = ids.includes(card.id)
        if (shouldDisplay){
            card.style.display = "block";
        }
        //if not, do not display the card
        else {
            card.style.display = "none";
        }
    })

    //call setSearchState with name parameter, undefined species
    setSearchState(name, undefined)

}

function setSearchState(name, species){
    //function to display name/species parameters below search bar
    let nameP = document.getElementById("name-state");
    let speciesP = document.getElementById("species-state");

    if (name === undefined){
        //if name is not searched, species was passed
        searchState.species = species;
        speciesP.innerText = species;
        speciesP.style.display = "block";
        searchState.count++
    }
    else if (species === undefined){
        //if species is not selected, name was passed
        searchState.name = name
        nameP.innerText = name;
        nameP.style.display = "block";
        searchState.count++
    }
    else if (species === "" && name === ""){
        //if the search is being reset
        searchState.name = "";
        searchState.species = "";
        nameP.innerText = "";
        nameP.style.display = "none";
        speciesP.innerText = "";
        speciesP.style.display = "none";
        searchState.count++
    }

}

function addCharacter(char){
    /*
    improvements: set a keys array for the character data I want to display.
    instead of p elements, use UL and loop through keys to set li items for each attribute
    */
    const character = {
        "id": char.id,
        "Name": char.name,
        "Status": char.status,
        "Gender": char.gender,
        "Species": char.species,
        "Type": char.type,
        "image": char.image
    }

    characters.push(character)
    //create elements for character card
    const keys = ["Name", "Status", "Gender", "Species", "Type"]
    const ul = document.createElement("ul")
    for (let key of keys){
        const li = document.createElement("li");
        li.textContent = `${key}: ${character[key]}`
        li.className = key;
        ul.append(li)
    }

    const card = document.createElement("div");
    const image = document.createElement("img");
    card.className = "character-card"

    card.id = character["id"];
    card.style.display = "block";

    image.src = character["image"];

    card.append(image, ul)
    container.append(card)

}