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
})

function searchName(name){
    /*
    takes the input of character name search, finds matches in the characters array, and displays matched character cards
    */
    const nameCase = name.toLowerCase();

    //filter the characters array for matches on the character full name, first name, or last name
    const matches = characters.filter(character => {
        //split character name into different variables to match potential inputs
        let [firstName, lastName] = character["Name"].toLowerCase().split(" ")
        let fullName = character["Name"].toLowerCase()
        
        if (firstName === nameCase || lastName === nameCase || fullName === nameCase){
            return character
        }
    })
    // get the IDs of matched characters
    const ids = [];
    for (let match of matches){
        let id = match["id"].toString();
        ids.push(id)
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

    card.id = character["id"]

    image.src = character["image"];

    card.append(image, ul)
    container.append(card)

}