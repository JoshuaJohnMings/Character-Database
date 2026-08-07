let characters = JSON.parse(localStorage.getItem("characters")) || [];

let tags = JSON.parse(localStorage.getItem("tags")) || [];

let selectedTags = [];


// Switch pages
function showPage(page){

    document.getElementById("home").style.display = "none";
    document.getElementById("create").style.display = "none";
    document.getElementById("tags").style.display = "none";


    document.getElementById(page).style.display = "block";


    if(page === "tags"){
        displayTags();
    }

}





// CREATE CHARACTER

function createCharacter(){

    let character = {

        name: document.getElementById("nameInput").value,

        age: document.getElementById("ageInput").value,

        species: document.getElementById("speciesInput").value,

        tags: selectedTags,

        personality: document.getElementById("personalityInput").value,

        abilities: document.getElementById("abilitiesInput").value,

        story: document.getElementById("storyInput").value

    };


    characters.push(character);


    localStorage.setItem(
        "characters",
        JSON.stringify(characters)
    );


    selectedTags = [];


    displayCharacters();


    clearForm();

}





// CLEAR FORM

function clearForm(){

    document.getElementById("nameInput").value = "";

    document.getElementById("ageInput").value = "";

    document.getElementById("speciesInput").value = "";

    document.getElementById("personalityInput").value = "";

    document.getElementById("abilitiesInput").value = "";

    document.getElementById("storyInput").value = "";


    displaySelectedTags();

}





// DISPLAY CHARACTERS

function displayCharacters(filteredCharacters = characters){

    let list = document.getElementById("characterList");

    list.innerHTML = "";


    if(filteredCharacters.length === 0){

        list.innerHTML = "No characters found.";

        return;

    }



    filteredCharacters.forEach(function(character){


        let firstColor = "#ffffff";


        if(character.tags.length > 0){

            let firstTag = tags.find(
                tag => tag.name === character.tags[0]
            );


            if(firstTag){

                firstColor = firstTag.color;

            }

        }



        list.innerHTML += `

        <div class="character-card"
        style="border-color:${firstColor}">


            <h3>${character.name}</h3>


            <button onclick="deleteCharacter('${character.name}')">
            Delete
            </button>



            <p>
            Tags:
            ${character.tags.map(tag => 
                "<span>" + tag + "</span>"
            ).join(" ")}
            </p>



            <p><b>Age:</b> ${character.age}</p>

            <p><b>Species:</b> ${character.species}</p>

            <p><b>Personality:</b> ${character.personality}</p>

            <p><b>Abilities:</b> ${character.abilities}</p>

            <p><b>Backstory:</b> ${character.story}</p>


        </div>

        `;


    });

}







// TAG CREATION

function createTag(){

    let name = document.getElementById("tagNameInput").value;

    let color = document.getElementById("tagColorInput").value;


    let tag = {

        name:name,

        color:color

    };


    tags.push(tag);


    localStorage.setItem(
        "tags",
        JSON.stringify(tags)
    );


    displayTags();


    document.getElementById("tagNameInput").value="";

}






// DISPLAY TAGS

function displayTags(){

    let list = document.getElementById("tagList");


    list.innerHTML="";



    tags.forEach(function(tag){


        list.innerHTML += `

        <p style="color:${tag.color}">
        ${tag.name}
        </p>

        `;


    });

}







// TAG PICKER

function openTagPicker(){

    let picker = document.getElementById("tagPicker");


    picker.style.display = "block";


    let list = document.getElementById("availableTags");


    list.innerHTML="";



    tags.forEach(function(tag){


        list.innerHTML += `


        <button onclick="addTag('${tag.name}')">

        ${tag.name}

        </button>


        `;


    });

}






function addTag(tagName){


    if(!selectedTags.includes(tagName)){


        selectedTags.push(tagName);


    }


    displaySelectedTags();


}







function displaySelectedTags(){


    let box = document.getElementById("selectedTags");


    box.innerHTML="";


    if(selectedTags.length === 0){

        box.innerHTML="No tags selected.";

        return;

    }



    selectedTags.forEach(function(tag){


        box.innerHTML += `

        <span>
        ${tag}
        </span>

        `;


    });


}








// SEARCH

function searchCharacters(){


    let search = document.getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();



    if(search === ""){

        displayCharacters();

        return;

    }



    let results = characters.filter(function(character){


        return character.tags.some(function(tag){


            return tag.toLowerCase().includes(search);


        });


    });



    displayCharacters(results);


}







// DELETE

function deleteCharacter(name){


    if(confirm("Delete " + name + "?")){


        characters = characters.filter(function(character){


            return character.name !== name;


        });



        localStorage.setItem(
            "characters",
            JSON.stringify(characters)
        );



        displayCharacters();


    }

}





// Load data

displayCharacters();

displayTags();