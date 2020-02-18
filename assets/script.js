//I need to know the cell_index of each cell. So I know its bad code but I will use inner HTML to number them with their cell_index

let cellStatus = {
    NORMAL: "peru",
    TREASURE: "gold",
    OBSTACLE: "black",
    START: "red"
}

let algorithm = {
    BFS: breadthFirstSearch,
    DFS: depthFirstSearch,
}


let grid = document.getElementById("map");
let rows = 4;
let cols = 4;
let start = 0;
let treasures = 0;
//The status we will set a clicked cell onto.
let cell_status = cellStatus.NORMAL;
let current_algorithm = algorithm.BFS;
let visit_counter = 0;
createGrid(rows, cols);
setClickReveals();

/*
Algorithm logic.
*/
function run() {
    path = current_algorithm();
    pathVisit(path, 500);
}

function breadthFirstSearch() {
    return search(true);
}

function depthFirstSearch() {
    return search(false);
}

function search(is_bfs) {
    found_treasure = 0;
    queue = [];
    seen = [];
    path = [];
    queue.push(grid.children[start]);
    while (found_treasure < treasures) {
        if (littleSearch(queue, seen, found_treasure, is_bfs)) {
            return seen;
        }
        queue.push(nextUnvisited())
    }
    return seen;
}

function littleSearch(queue, seen, found_treasure, is_bfs) {
    while (queue.length > 0) {
        if (is_bfs) {
            next = queue.shift();
        }
        else {
            next = queue.pop();
        }
        if (contains(seen, next)) {continue;}
        seen.push(next);
        if (next.style.backgroundColor == cellStatus.TREASURE) {
            found_treasure++;
            if (found_treasure == treasures) {
                return true;
            }
        }
        neighbors = getNeighbors(next.id);
        for (let i=0; i < neighbors.length; i++) {
            queue.push(grid.children[neighbors[i]]);
        }
    }
    return false;
}

function contains(list, item) {
    answer = false;
    for (let i = 0; i < list.length; i++){
        if (list[i] == item) {
            answer = true;
        }
    }
    return answer;
}

function nextUnvisited() {
    children = grid.children;
    for(let i = 0; i < children.length; i++) {
        if (!isVisited(i)) {
            return children[i];
        }
    }
    //ToDo: Throw an error if no cell is returned. There are more treasures than there are treasure tiles.
}

function dfs() {

}

function getNeighbors(index) {
    index = Number(index);
    neighbors = []
    if ((index % cols) != 0) {
        neighbors.push(index - 1);
    }
    if (((index + 1) % cols) != 0) {
        neighbors.push(index + 1);
    }
    if (index > cols) {
        neighbors.push(index - cols);
    }
    if (index < (rows - 1 ) * cols) {
        neighbors.push(index + cols);
    }
    return neighbors;
}
/*
Algorithm logic ends.
*/

//Return whether the cell of the given index has been visiited.
function isVisited(child_index) {
    cell = grid.children[child_index];
    search_image = cell.firstChild;
    return search_image.style.visibility == "visible";
}

//Visit each cell in the path with interval milliseconds inbetween
function pathVisit(path, interval) {
    setInterval(function() {
        listVisit(path)
    }, interval);
}

function listVisit(path) {
    set_visible(path[visit_counter]);
    visit_counter++;
}

//Set the cell's searched image visible after a certain numbe of miliseconds
function set_visible(cell) {
    search_image = cell.firstChild;
    search_image.style.visibility = "visible";
}

//Sets the status of the grid's child_index child.
function setCellStatus(child_index) {
    let cell = grid.children[child_index];
    //If the cell 0 is start and it is changed it will revert back to start. There must be a start.
    if (cell.style.backgroundColor == cellStatus.TREASURE) {
        treasures--;
    }
    else if(cell.style.backgroundColor == cellStatus.START & cell_status != cellStatus.START) {
        if (child_index == 0) {
            return;
        }
        setStart(0);
    }
    if (cell_status == cell_status.NORMAL) {}
    else if (cell_status == cellStatus.TREASURE) {
        setTreasure(child_index);
    }
    else if (cell_status == cellStatus.START) {
        setStart(child_index);
    }
    else if (cell_status == cellStatus.OBSTACLE) {
        cell.style.backgroundColor = cell_status;
        cell.status = cell_status;      
    }
}


function setTreasure(child_index) {
    let cell = grid.children[child_index];
    cell = cell.style.backgroundColor = cellStatus.TREASURE;
    cell.status = cellStatus.TREASURE;
    treasures++;
}

function setStart(child_index) {
    removeStart();
    let cell = grid.children[child_index];
    cell = cell.style.backgroundColor = cellStatus.START;
    cell.status = cellStatus.START;
    start = child_index;
}

function removeStart() {
    cell = grid.children[start];
    cell.style.backgroundColor = cellStatus.NORMAL;
    cell.status = cellStatus.NORMAL;
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
    let begin = document.getElementById("run");
    let breadthFirst = document.getElementById("bfs");
    let depthFirst = document.getElementById("dfs");
    r.addEventListener('click', reveal_text);
    play.addEventListener('click', reveal_play_children);
    size.addEventListener('click', reveal_size_children);
    algorithm.addEventListener('click', reveal_algorithm_children);
    change.addEventListener('click', reveal_change_children);  
    add_row.addEventListener('click', addRow);
    add_col.addEventListener('click', addCol);
    treasure.addEventListener('click', setChangeTreasure);
    start.addEventListener('click', setChangeStart);
    obstacle.addEventListener('click', setChangeObstacle);
    begin.addEventListener('click', run);
    breadthFirst.addEventListener('click', setBfs);
    depthFirst.addEventListener('click', setDfs);
}

function setBfs() {
    current_algorithm = algorithm.BFS;
}

function setDfs() {
    current_algorithm = algorithm.DFS;
}

function setChangeTreasure() {
    cell_status = cellStatus.TREASURE;
}

function setChangeStart() {
    cell_status = cellStatus.START;
}

function setChangeObstacle() {
    cell_status = cellStatus.OBSTACLE;
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
    if (start == 0) {
        setStart(0);
    }
    if (treasures == 0) {
        setTreasure(grid.childElementCount - 1);
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
    cell.id = child_index;
    cell.addEventListener("click", function() {
        setCellStatus(cell.id);
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