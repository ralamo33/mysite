let create = document.getElementById("work");
let map = document.getElementById("map");
let mapItems = [];
let rows = 10;
let cols = 10;
createGraph(rows, cols)
setClickReveals();

//Set certain text to reveal hidden text on click.
function setClickReveals() {
    let r = document.getElementById("reveal");
    let play = document.getElementById("play");
    let size = document.getElementById("size");
    let change = document.getElementById("change");
    let algorithm = document.getElementById("algorithm");
    r.addEventListener('click', reveal_text);
    play.addEventListener('click', reveal_play_children);
    size.addEventListener('click', reveal_size_children);
    change.addEventListener('click', reveal_change_children);    
}

//Reveal the hidden children of play
function reveal_play_children() {
    reveal_by_class("play", "block");
}

function reveal_size_children() {
    reveal_by_class("size", "block");
}

function reveal_change_children() {
    reveal_by_class("change", "block");
}

function reveal_algorithm_children() {
    reveal_by_class("algorithm", "block");
}

//Reveal the hidden text
function reveal_text() {
    reveal_by_class("hidden-text", "block");
}

function reveal_by_class(class_name, display_value) {
    let reveal = document.getElementsByClassName(class_name);
    for (let i = 0; i < reveal.length; i++) {
        if (reveal[i].style.display != display_value) {
            reveal[i].style.display = display_value;
        }
        else {
            reveal[i].style.display = "none";
        }
    }
    return this;
}





//Create a graph of the given row and col
//rows (int): The number of rows for the graph
//cols (int): The number of cols for the graph
function createGraph(rows, cols) {
    let r = 0;
    let c = 0;
    for (r=0; r < rows; r++) {
        for (c=0; c < cols; c++) {
            makeMapItem("standard", false);
            addCell();
        }
    }
    document.documentElement.style.setProperty("--rowNum", rows.toString());
    document.documentElement.style.setProperty("--colNum", cols.toString());
}

//Add a cell to the grid
function addCell() {
    let cell = document.createElement("div");
    cell.classList.add("working-cell");
    map.appendChild(cell);
}

//Make a map-item, to record the state of the grid
function makeMapItem(type, visited) {
    this.type = type;
    this.visited = visited;
}