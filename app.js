let characters = JSON.parse(localStorage.getItem("characters")) || [];

let tags = JSON.parse(localStorage.getItem("tags")) || [];

let selectedTags = [];

let editingCharacterIndex = -1;

let editingTagIndex = -1;

let currentCharacterImage = null;

// ======================================================
// PAGE NAVIGATION
// ======================================================

function showPage(page){

    document.getElementById("home").style.display = "none";
    document.getElementById("create").style.display = "none";
    document.getElementById("tags").style.display = "none";

    document.getElementById(page).style.display = "block";

    if(page === "tags"){
        displayTags();
    }

}


// ======================================================
// CREATE / EDIT CHARACTER
// ======================================================

function createCharacter(){

    let name = document.getElementById("nameInput").value.trim();

    if(name === ""){

        alert("Please give your character a name.");

        return;

    }


    let character = {

    name: name,

    age: document.getElementById("ageInput").value,

    species: document.getElementById("speciesInput").value,

    image: currentCharacterImage,

    tags: [...selectedTags],

        personality: document.getElementById("personalityInput").value,

        abilities: document.getElementById("abilitiesInput").value,

        story: document.getElementById("storyInput").value

    };


    // EDITING AN EXISTING CHARACTER

    if(editingCharacterIndex !== -1){

        characters[editingCharacterIndex] = character;

        alert("Character updated!");

    }


    // CREATING A NEW CHARACTER

    else{

        characters.push(character);

    }


    localStorage.setItem(
        "characters",
        JSON.stringify(characters)
    );


    editingCharacterIndex = -1;

    selectedTags = [];


    displayCharacters();

    clearForm();

    resetCharacterForm();

    removeCharacterImage();

    showPage("home");

}


// ======================================================
// EDIT CHARACTER
// ======================================================

function editCharacter(index){

    let character = characters[index];


    editingCharacterIndex = index;


    document.getElementById("nameInput").value = character.name;

    document.getElementById("ageInput").value = character.age;

    document.getElementById("speciesInput").value = character.species;

    document.getElementById("personalityInput").value = character.personality;

    document.getElementById("abilitiesInput").value = character.abilities;

    document.getElementById("storyInput").value = character.story;


    selectedTags = [...(character.tags || [])];


    displaySelectedTags();

    currentCharacterImage = character.image || null;


if(currentCharacterImage){

    document.getElementById(
        "imagePreview"
    ).src = currentCharacterImage;


    document.getElementById(
        "imagePreviewContainer"
    ).style.display = "block";

}

else{

    document.getElementById(
        "imagePreview"
    ).src = "";


    document.getElementById(
        "imagePreviewContainer"
    ).style.display = "none";

}


    document.getElementById("characterFormButtons").innerHTML = `

        <button onclick="createCharacter()">
            Save Changes
        </button>

        <button onclick="cancelEdit()">
            Cancel
        </button>

    `;


    showPage("create");

}


// ======================================================
// CANCEL CHARACTER EDIT
// ======================================================

function cancelEdit(){

    editingCharacterIndex = -1;

    selectedTags = [];


    clearForm();

    resetCharacterForm();


    showPage("home");

}


// ======================================================
// RESET CHARACTER FORM BUTTONS
// ======================================================

function resetCharacterForm(){

    document.getElementById("characterFormButtons").innerHTML = `

        <button onclick="createCharacter()">
            Save Character
        </button>

    `;

}


// ======================================================
// CLEAR CHARACTER FORM
// ======================================================

function clearForm(){

    document.getElementById("nameInput").value = "";

    document.getElementById("ageInput").value = "";

    document.getElementById("speciesInput").value = "";

    document.getElementById("personalityInput").value = "";

    document.getElementById("abilitiesInput").value = "";

    document.getElementById("storyInput").value = "";


    displaySelectedTags();

}


// ======================================================
// DISPLAY CHARACTERS
// ======================================================

function displayCharacters(filteredCharacters = characters){

    let list = document.getElementById("characterList");

    list.innerHTML = "";


    if(filteredCharacters.length === 0){

        list.innerHTML = "No characters found.";

        return;

    }


    filteredCharacters.forEach(function(character){

        let originalIndex = characters.indexOf(character);


        let firstColor = "#ffffff";


        if(character.tags && character.tags.length > 0){

            let firstTag = tags.find(
                tag => tag.name === character.tags[0]
            );


            if(firstTag){

                firstColor = firstTag.color;

            }

        }


        let tagHTML = "";


        (character.tags || []).forEach(function(tagName){

            let tag = tags.find(
                tag => tag.name === tagName
            );


            if(tag){

                tagHTML += `

                    <span style="
                        background:${tag.color};
                        color:#fff;
                    ">
                        ${tag.name}
                    </span>

                `;

            }

            else{

                tagHTML += `

                    <span>
                        ${tagName}
                    </span>

                `;

            }

        });


        list.innerHTML += `

    <div class="character-card"
     style="border-color:${firstColor}">

    ${character.image ? `

        <img
            src="${character.image}"
            class="character-image"
            alt="${character.name}"
        >

    ` : ""}

    <div>

        <h3>${character.name}</h3>

            <div>

                <h3>${character.name}</h3>

                <button onclick="editCharacter(${originalIndex})">
                    Edit
                </button>

                <button onclick="deleteCharacter(${originalIndex})">
                    Delete
                </button>

            </div>


            <p>

                <b>Tags:</b>

                ${tagHTML}

            </p>


            <p>
                <b>Age:</b> ${character.age}
            </p>


            <p>
                <b>Species:</b> ${character.species}
            </p>


            <p>
                <b>Personality:</b> ${character.personality}
            </p>


            <p>
                <b>Abilities:</b> ${character.abilities}
            </p>


            <p>
                <b>Backstory:</b> ${character.story}
            </p>

        </div>

        `;

    });

}


// ======================================================
// DELETE CHARACTER
// ======================================================

function deleteCharacter(index){

    let character = characters[index];


    if(!character){

        return;

    }


    let confirmDelete = confirm(
        "Are you sure you want to delete " +
        character.name +
        "?"
    );


    if(!confirmDelete){

        return;

    }


    characters.splice(index, 1);


    localStorage.setItem(
        "characters",
        JSON.stringify(characters)
    );


    displayCharacters();

}


// ======================================================
// TAG CREATION
// ======================================================

function createTag(){

    let name = document
        .getElementById("tagNameInput")
        .value
        .trim();


    let color = document
        .getElementById("tagColorInput")
        .value;


    if(name === ""){

        alert("Please give your tag a name.");

        return;

    }


    // EDITING TAG

    if(editingTagIndex !== -1){

        let oldName = tags[editingTagIndex].name;


        tags[editingTagIndex] = {

            name: name,

            color: color

        };


        // Update the tag name on characters

        characters.forEach(function(character){

            if(character.tags){

                character.tags =
                    character.tags.map(function(tag){

                        if(tag === oldName){

                            return name;

                        }

                        return tag;

                    });

            }

        });


        localStorage.setItem(
            "characters",
            JSON.stringify(characters)
        );


        editingTagIndex = -1;

    }


    // CREATING NEW TAG

    else{

        let alreadyExists = tags.some(function(tag){

            return tag.name.toLowerCase() === name.toLowerCase();

        });


        if(alreadyExists){

            alert("A tag with that name already exists.");

            return;

        }


        tags.push({

            name: name,

            color: color

        });

    }


    localStorage.setItem(
        "tags",
        JSON.stringify(tags)
    );


    document.getElementById("tagNameInput").value = "";


    displayTags();


    resetTagForm();


    displayCharacters();

}


// ======================================================
// EDIT TAG
// ======================================================

function editTag(index){

    let tag = tags[index];


    if(!tag){

        return;

    }


    editingTagIndex = index;


    document.getElementById("tagNameInput").value =
        tag.name;


    document.getElementById("tagColorInput").value =
        tag.color;


    document.getElementById("tagFormButton").innerHTML = `

        <button onclick="createTag()">
            Save Changes
        </button>

        <button onclick="cancelTagEdit()">
            Cancel
        </button>

    `;

}


// ======================================================
// CANCEL TAG EDIT
// ======================================================

function cancelTagEdit(){

    editingTagIndex = -1;

    document.getElementById("tagNameInput").value = "";

    resetTagForm();

}


// ======================================================
// RESET TAG FORM
// ======================================================

function resetTagForm(){

    document.getElementById("tagFormButton").innerHTML = `

        <button onclick="createTag()">
            Create Tag
        </button>

    `;

}


// ======================================================
// DELETE TAG
// ======================================================

function deleteTag(index){

    let tag = tags[index];


    if(!tag){

        return;

    }


    let confirmDelete = confirm(

        "Delete the tag \"" +
        tag.name +
        "\"?"

    );


    if(!confirmDelete){

        return;

    }


    let tagName = tag.name;


    // Remove the tag from the tag database

    tags.splice(index, 1);


    // Remove the tag from every character using it

    characters.forEach(function(character){

        if(character.tags){

            character.tags =
                character.tags.filter(function(characterTag){

                    return characterTag !== tagName;

                });

        }

    });


    localStorage.setItem(
        "tags",
        JSON.stringify(tags)
    );


    localStorage.setItem(
        "characters",
        JSON.stringify(characters)
    );


    displayTags();

    displayCharacters();

}


// ======================================================
// DISPLAY TAGS
// ======================================================

function displayTags(){

    let list = document.getElementById("tagList");


    list.innerHTML = "";


    if(tags.length === 0){

        list.innerHTML = "No tags created.";

        return;

    }


    tags.forEach(function(tag, index){

        list.innerHTML += `

            <div class="tag-manager-item">

                <span
                    class="tag-preview"
                    style="
                        background:${tag.color};
                        color:white;
                    "
                >
                    ${tag.name}
                </span>


                <button onclick="editTag(${index})">
                    Edit
                </button>


                <button onclick="deleteTag(${index})">
                    Delete
                </button>

            </div>

        `;

    });

}


// ======================================================
// TAG PICKER
// ======================================================

function openTagPicker(){

    let picker =
        document.getElementById("tagPicker");


    if(picker.style.display === "block"){

        picker.style.display = "none";

        return;

    }


    picker.style.display = "block";


    displayAvailableTags();

}


// ======================================================
// DISPLAY AVAILABLE TAGS
// ======================================================

function displayAvailableTags(){

    let list =
        document.getElementById("availableTags");


    list.innerHTML = "";


    if(tags.length === 0){

        list.innerHTML =
            "No tags exist yet. Create some in the Tags tab.";

        return;

    }


    tags.forEach(function(tag){

        let selected =
            selectedTags.includes(tag.name);


        list.innerHTML += `

            <button
                onclick="addTag('${tag.name.replace(/'/g, "\\'")}')"
                style="
                    background:${tag.color};
                    color:white;
                "
            >

                ${selected ? "✓ " : ""}
                ${tag.name}

            </button>

        `;

    });

}


// ======================================================
// ADD TAG TO CHARACTER
// ======================================================

function addTag(tagName){

    if(!selectedTags.includes(tagName)){

        selectedTags.push(tagName);

    }

    else{

        selectedTags =
            selectedTags.filter(function(tag){

                return tag !== tagName;

            });

    }


    displaySelectedTags();

    displayAvailableTags();

}


// ======================================================
// DISPLAY SELECTED TAGS
// ======================================================

function displaySelectedTags(){

    let box =
        document.getElementById("selectedTags");


    box.innerHTML = "";


    if(selectedTags.length === 0){

        box.innerHTML = "No tags selected.";

        return;

    }


    selectedTags.forEach(function(tagName){

        let tag = tags.find(
            tag => tag.name === tagName
        );


        let color = tag ? tag.color : "#777";


        box.innerHTML += `

            <span
                style="
                    background:${color};
                    color:white;
                "
            >
                ${tagName}
            </span>

        `;

    });

}


// ======================================================
// SEARCH BY TAG
// ======================================================

function searchCharacters(){

    let search =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    if(search === ""){

        displayCharacters();

        return;

    }


    let results =
        characters.filter(function(character){

            return (character.tags || [])
                .some(function(tag){

                    return tag
                        .toLowerCase()
                        .includes(search);

                });

        });


    displayCharacters(results);

}


// ======================================================
// EXPORT BACKUP
// ======================================================

function exportData(){

    let backup = {

        characters: characters,

        tags: tags

    };


    let data = JSON.stringify(
        backup,
        null,
        2
    );


    let blob = new Blob(
        [data],
        {type:"application/json"}
    );


    let link = document.createElement("a");


    link.href =
        URL.createObjectURL(blob);


    link.download =
        "CharacterDatabase_Backup.json";


    link.click();

}


// ======================================================
// IMPORT BACKUP
// ======================================================

function importData(event){

    let file =
        event.target.files[0];


    if(!file){

        return;

    }


    let reader =
        new FileReader();


    reader.onload = function(e){

        try{

            let backup =
                JSON.parse(e.target.result);


            characters =
                backup.characters || [];


            tags =
                backup.tags || [];


            localStorage.setItem(
                "characters",
                JSON.stringify(characters)
            );


            localStorage.setItem(
                "tags",
                JSON.stringify(tags)
            );


            displayCharacters();

            displayTags();


            alert(
                "Backup imported successfully!"
            );

        }

        catch(error){

            alert(
                "That file is not a valid Character Database backup."
            );

        }

    };


    reader.readAsText(file);

}


// ======================================================
// INITIAL LOAD
// ======================================================

displayCharacters();

displayTags();

// ======================================================
// CHARACTER IMAGE UPLOAD
// ======================================================

function handleImageUpload(event){

    let file = event.target.files[0];

    if(!file){
        return;
    }


    // Make sure the file is an accepted image type

    let allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if(!allowedTypes.includes(file.type)){

        alert(
            "Please choose a JPG, PNG, or WEBP image."
        );

        event.target.value = "";

        return;

    }


    // Maximum original file size: 10 MB

    let maxSize = 10 * 1024 * 1024;


    if(file.size > maxSize){

        alert(
            "That image is too large. " +
            "Please choose an image smaller than 10 MB."
        );

        event.target.value = "";

        return;

    }


    let reader = new FileReader();


    reader.onload = function(e){

        let image = new Image();


        image.onload = function(){

            let maxDimension = 1600;

            let width = image.width;

            let height = image.height;


            // Resize while keeping the original aspect ratio

            if(width > maxDimension || height > maxDimension){

                if(width > height){

                    height =
                        Math.round(
                            height *
                            (maxDimension / width)
                        );

                    width = maxDimension;

                }

                else{

                    width =
                        Math.round(
                            width *
                            (maxDimension / height)
                        );

                    height = maxDimension;

                }

            }


            // Create a canvas for resizing

            let canvas =
                document.createElement("canvas");


            canvas.width = width;

            canvas.height = height;


            let context =
                canvas.getContext("2d");


            context.drawImage(
                image,
                0,
                0,
                width,
                height
            );


            // Convert to compressed WEBP

            currentCharacterImage =
                canvas.toDataURL(
                    "image/webp",
                    0.8
                );


            // Show preview

            document.getElementById(
                "imagePreview"
            ).src = currentCharacterImage;


            document.getElementById(
                "imagePreviewContainer"
            ).style.display = "block";

        };


        image.src = e.target.result;

    };


    reader.readAsDataURL(file);

}


// ======================================================
// REMOVE CHARACTER IMAGE
// ======================================================

function removeCharacterImage(){

    currentCharacterImage = null;


    document.getElementById(
        "imageInput"
    ).value = "";


    document.getElementById(
        "imagePreview"
    ).src = "";


    document.getElementById(
        "imagePreviewContainer"
    ).style.display = "none";

}
