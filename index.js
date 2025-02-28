const characters = []

document.addEventListener("DOMContentLoaded", () => {
    //fetch characters from API
    fetch("https://rickandmortyapi.com/api/character")
        .then(res => res.json())
        .then(data => {
            data["results"].forEach(character => addCharacter(character))
    })
})


function addCharacter(character){
    characters.push(character)
    //create elements for character card
    const card = document.createElement("div");
    const name = document.createElement("h3");
    const status = document.createElement("p");
    const species = document.createElement("p");
    const type = document.createElement("p");
    const image = document.createElement("img");
    const gender = document.createElement("p");

    //set element content with character data
    card.id = character["id"]
    name.textContent = `Name: ${character["name"]}`;
    status.textContent = `Status: ${character["status"]}`;
    image.src = character["image"];
    species.textContent = `Species: ${character["species"]}`;
    gender.textContent = `Gender: ${character["gender"]}`;
    type.textContent = `Type: ${character["type"]}`;

    card.append(image, name, status, gender, species, type)

    let container = document.getElementById("character-container");
    container.append(card)

}