const Input = document.getElementById("input-user");
const imgPokemon = document.getElementById("img-pokemon");
const namePokemon = document.getElementById("name-pokemon");
const grid = document.getElementById("grid");

let pokemonList = [];

Input.addEventListener("keydown", function(event){
    if(event.key == "Enter"){
        getPokemon();
    }
})

async function getPokemon(){
    const pokemonName = Input.value.toLowerCase().trim();
    let exists = checkPokemon(pokemonName);

    if(exists == true){
        return;
    }

    try{
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon/" + pokemonName,
        );

        if (!response.ok) {
            throw new Error("Pokémon não encontrado");
        }

        const data = await response.json();
        console.log(data);
        savePokemon(data);
        show();
    }catch (error){
        console.log(error);
    }
}

function checkPokemon(pokemonName){
    for (let pokemon of pokemonList){
        if(pokemonName == pokemon.id || pokemonName == pokemon.name.toLowerCase()){
            return true;
        }
    }

    return false;
}

function savePokemon(data){
    let newPokemon = {
        id: data.id,
        name: data.name,
        img_front: data.sprites.front_default,
        img_back: data.sprites.back_default,
        stats: data.stats,
        atk: 0,
        hp: 0,
        def: 0,
        type1: data.types[0] ? data.types[0].type.name : "",
        type2: data.types[1] ? data.types[1].type.name : "Não possui"
    }

    for (let status of data.stats) {
        if (status.stat.name == "hp"){
            newPokemon.hp = status.base_stat;
        } else if (status.stat.name == "attack"){
            newPokemon.atk = status.base_stat;
        } else if (status.stat.name == "defense"){
            newPokemon.def = status.base_stat;
        } 
    }

    pokemonList.push(newPokemon);
    console.log(pokemonList);
}

function show(){
    createCard(pokemonList[pokemonList.length-1]);
}

function createCard(pokemon){
    const newDiv = document.createElement("div");
    const newText = document.createElement("h3");
    const newImg = document.createElement("img");
    const newType1 = document.createElement("p");
    const newType2 = document.createElement("p");
    const newAttack = document.createElement("p");
    const newHp = document.createElement("p");
    const newDefense = document.createElement("p");

    newText.textContent = pokemon.name.toUpperCase();
    newImg.src = pokemon.img_front;
    newType1.textContent = "Tipo: " + pokemon.type1;
    newType2.textContent = "Tipo: " + pokemon.type2;
    newAttack.textContent = "Atk: " + pokemon.atk;
    newHp.textContent = "HP: " + pokemon.hp;
    newDefense.textContent = "Defense: " + pokemon.def;

    newDiv.appendChild(newImg);
    newDiv.appendChild(newText);
    newDiv.appendChild(newType1);
    newDiv.appendChild(newType2)
    newDiv.appendChild(newAttack);
    newDiv.appendChild(newHp);
    newDiv.appendChild(newDefense);

    newDiv.classList.add("card-pokemon");
    grid.appendChild(newDiv);
}