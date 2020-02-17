let cellStatus = {
    NORMAL: "peru",
    TREASURE: "gold",
    OBSTACLE: "black",
    START: "red"
}

let create = document.getElementById("work");
let grid = document.getElementById("map");
let rows = 4;
let cols = 4;
//The status we will set a clicked cell onto.
let cell_status = cellStatus.NORMAL;
createGrid(rows, cols);
setClickReveals();
//setCellEvents();


//Set the event handlers for all the cells in the Grid.
function setCellEvents() {
    cells = grid.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function() {
            setCellStatus(cells[i].child_index);
        });
    }
}

//Sets the status of the grid's child_index child.
function setCellStatus(child_index) {
    if (cell_status != "peru") {
        cell = grid.children[child_index].style.backgroundColor = cell_status;
        cell.status = cell_status;
    }
}

//Set certain text to reveal hidden text on click.
function setClickReveals() {
    let r = document.getElementById("reveal");
    let play = document.getElementById("play");
    let size = document.getElementById("size");
    let change = document.getElementById("change");
    let algorithm = document.getElementById("algorithm");
    let add_row = document.getElementById("add-row");
    let add_col = document.getElementById("add-column");
    let treasure = document.getElementById("treasure");
    let start = document.getElementById("start");
    let obstacle = document.getElementById("obstacle");
    r.addEventListener('click', reveal_text);
    play.addEventListener('click', reveal_play_children);
    size.addEventListener('click', reveal_size_children);
    change.addEventListener('click', reveal_change_children);  
    add_row.addEventListener('click', addRow);
    add_col.addEventListener('click', addCol);
    treasure.addEventListener('click', setTreasure);
    start.addEventListener('click', setStart);
    obstacle.addEventListener('click', setObstacle);
}

function setTreasure() {
    cell_status = cellStatus.TREASURE;
}

function setObstacle() {
    cell_status = cellStatus.OBSTACLE;
}
function setStart() {
    cell_status = cellStatus.START;
}

function addRow() {
    rows = rows + 1;
    createGrid(rows, cols);
}

function addCol() {
    cols = cols + 1;
    createGrid(rows, cols);
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
function createGrid(rows, cols) {
    let r = 0;
    let c = 0;
    let child_index = 0;
    let grid_size = grid.childElementCount;
    for (r=0; r < rows; r++) {
        for (c=0; c < cols; c++) {
            if (child_index >= grid_size) {
                addCell(child_index);
            }
            child_index++;
        }
    }
    document.documentElement.style.setProperty("--rowNum", rows.toString());
    document.documentElement.style.setProperty("--colNum", cols.toString());
}

//Eliminate every cell from the grid
function emptyGrid() {
    while (grid.hasChildNodes()) {
        grid.removeChild(grid.children[0]);
    }
}

//Add a cell to the grid
function addCell(child_index) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.status = cellStatus.NORMAL;
    cell.seen = false;
    cell.child_index = child_index;
    cell.addEventListener("click", function() {
        setCellStatus(cell.child_index);
    });
    addSearchedImage(cell);
    grid.appendChild(cell);
}

//Add a hidden image that will reveal itself when the given cell is searched.
function addSearchedImage(cell) {
    let image = document.createElement("div");
    image.classList.add("searched-image");
    cell.appendChild(image);
}

//Make a grid-item, to record the state of the grid
function makegridItem(type, visited) {
    this.type = type;
    this.visited = visited;
}