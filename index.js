const characters = []
const container = document.getElementById("character-container");

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
})

function filterBySpecies(species) {
    //get cards that are displayed
    const matches = characters.filter(character => {
        return character["Species"] === species
    })
    console.log(matches)

    const ids = matches.map(match => match["id"].toString())
    console.log(ids)

    //note: this is too limiting...
    const cards = Array.from(document.querySelectorAll(`div[style*="display: block"] `))

    cards.forEach(card => {
        const shouldDisplay = ids.includes(card.id)
        if (!shouldDisplay){
            card.style.display = "none";
        }
    })

}

function searchName(name){
    /*
    takes the input of character name search, finds matches in the characters array, and displays matched character cards
    */
    const nameCase = name.toLowerCase();

    //filter the characters array for matches on the character's  name
    const matches = characters.filter(character => {
        
        //split character name into an array in case of irregular character name
        const nameParts = character["Name"].toLowerCase().split(" ");
        return nameParts.includes(nameCase) || character["Name"].toLowerCase().includes(nameCase)
    
    })
    // get the IDs of matched characters
    const ids = matches.map(match => match["id"].toString())

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