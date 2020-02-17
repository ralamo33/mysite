let create = document.getElementById("work");
let map = document.getElementById("map");
let mapItems = [];
createGraph(10, 10)
setClickReveals();

//Set certain text to reveal hidden text on click.
function setClickReveals() {
    let hidden = document.getElementById("hidden-text");
    let revealers = document.getElementById("reveal");
    reveal.addEventListener("click", function(){ 
        hidden.visibility = "visible";
        alert(hidden.visibility);
    });
}

//Reveal the hidden text
function reveal() {
    let hidden = document.getElementById("hidden-text");
    if (hidden.style.display == "none") {
        hidden.style.display = "block";
    }
    else {
        hidden.style.display = "none"
    }
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