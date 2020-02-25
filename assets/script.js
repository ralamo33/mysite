//I need to know the cell_index of each cell. So I know its bad code but I will use inner HTML to number them with their cell_index

let cellStatus = {
    NORMAL: "white",
    TREASURE: "gold",
    OBSTACLE: "black",
    START: "red"
}

let algorithm = {
    BFS: breadthFirstSearch,
    DFS: depthFirstSearch,
    DA: dijsktraAlgorithm,
    ASTAR: function() {
        return aStarAlgorithm(true);
    }
}


let grid = document.getElementById("map");
let rows = 10;
let cols = 10;
let start = 0;
let treasures = 0;
//The status we will set a clicked cell onto.
let cell_status = cellStatus.NORMAL;
let current_algorithm = algorithm.BFS;
let visit_counter = 0;
let visit_function;
const interval = 50;
//List of index for treasure spots
let treasure_spots = [];
createGrid(rows, cols);
setClickReveals();
let edges = makeEdges();

/*
Algorithm logic.
*/
function run() {
    path = current_algorithm();
    pathVisit(path, interval);
}


//Heuristics: Boolean, whether or not heuristics will be used. A lack of heuristics
//makes this Dijsktra's algorithm.
function aStarAlgorithm(heuristics) {
        //list of visited verticies
        let visited = []
        //List of Verticies not in visited
        let missing = getChildrenIndex()
        //(vertex, distance)
        let distances = {}
        let children = grid.children;
        let treasures_found = 0;
        distances[start] = 0;
        //If there is no treasure than this acts as dijkstra
        if (treasures == 0) {
            heuristics = false;
        }
        while (visited.length < children.length) {
            let current = getMin(distances);
            if (current == null) {
                return visited;
            }
            visited.push(children[current]);
            missing.splice(current, 1);
            //THe problem is children[current]
            if (children[current].style.backgroundColor == cellStatus.OBSTACLE) {
                continue;
            }
            if (children[current].style.backgroundColor == cellStatus.TREASURE) {
                treasures_found++;
                if (treasures_found >= treasures) {
                    return visited;
                }
            }
            //update distances with current's edges
            let neighbors = getNeighbors(current);
            for (let i = 0; i < neighbors.length; i++) {
                neighbor = neighbors[i];
                if (contains(visited, children[neighbor])) {continue;}
                let g = getWeight(current, neighbor);
                let h = 0;
                if (heuristics) {
                    let current_target = treasure_spots[treasures_found];
                    h = euclideanDistance(neighbor, current_target);
                }
                let weight = g + h;
                if (neighbor in distances) {
                    if (distances[neighbor] > weight) {
                        distances[neighbor] = weight;
                    }
                }
                else {
                    distances[neighbor] = weight;
                }
            }
        }    
        return visited;
}

//From and Goal are id integers
function euclideanDistance(from, goal) {
    let x1 = (from % cols);
    let x2 = (goal % cols);
    let y1 = Math.floor((from) / cols);
    let y2 = Math.floor((goal)/ cols);
    let xdis = Math.pow((x1 - x2), 2);
    let ydis = Math.pow((y1 - y2), 2);
    let distance = Math.sqrt(xdis + ydis);
    return distance;
}

function dijsktraAlgorithm() {
    //list of visited verticies
    let visited = []
    //List of Verticies not in visited
    let missing = getChildrenIndex()
    //(vertex, distance)
    let distances = {}
    let children = grid.children;
    let treasures_found = 0;
    distances[start] = 0;
    while (visited.length < children.length) {
        let current = getMin(distances);
        if (current == null) {
            return visited;
        }
        visited.push(children[current]);
        missing.splice(current, 1);
        //THe problem is children[current]
        if (children[current].style.backgroundColor == cellStatus.OBSTACLE) {
            continue;
        }
        if (children[current].style.backgroundColor == cellStatus.TREASURE) {
            treasures_found++;
            if (treasures_found >= treasures) {
                return visited;
            }
        }
        //update distances with current's edges
        let neighbors = getNeighbors(current);
        for (let i = 0; i < neighbors.length; i++) {
            neighbor = neighbors[i];
            if (contains(visited, children[neighbor])) {continue;}
            weight = getWeight(current, neighbor);
            if (neighbor in distances) {
                if (distances[neighbor] > weight) {
                    distances[neighbor] = weight;
                }
            }
            else {
                distances[neighbor] = weight;
            }
        }
    }    
    return visited;
}

function getWeight(to, from) {
    let index = edgeEncoding(from, to);
    let edge = edges[index];
    return edge.weight;
}

function edgeEncoding(to, from) {
    let w = (to + 1) * (from + 1);
    return w;
}

//Get the vertex with minimum distance.
//Distance is a list of tuples (int, int)
function getMin(distances) {
    let vertex = null;
    let min = -1;
    for (let key in distances) {
        let value = distances[key];
        if (min == -1) {
            min = value;
            vertex = key;
        }
        else if(min > value) {
            min = value;
            vertex = key;
        }
    }
    delete distances[vertex];
    return Number(vertex);
}

function getChildrenIndex() {
    children = grid.children;
    ans = []
    for (let i = 0; i < children.length; i++) {
        ans.push(i);
    }
    return ans;
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
    while (true) {
        if (littleSearch(queue, seen, found_treasure, is_bfs)) {
            return seen;
        }
        queue.push(nextUnvisited(seen))
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
        if (next.style.backgroundColor == cellStatus.OBSTACLE) {continue;}
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
        if (seen.length >= grid.childElementCount) {
            return true;
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

function nextUnvisited(seen) {
    children = grid.children;
    for(let i = 0; i < children.length; i++) {
        child = children[i];
        if (contains(seen, child)) {
            continue;
        }
        else if(child.status.backgroundColor == cellStatus.OBSTACLE) {
            seen.push(child);
        }
        else {
            return child;
        }
    }
    //ToDo: Throw an error if no cell is returned. There are more treasures than there are treasure tiles.
}

//Takes in an int index of the target cell, and returns the indicies of the target's neighbors
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

//Get the neighbors to the cell's bottom and right
function getHalfNeighbors(index) {
    index = Number(index);
    neighbors = []
    if (((index + 1) % cols) != 0) {
        neighbors.push(index + 1);
    }
    if (index < (rows - 1 ) * cols) {
        neighbors.push(index + cols);
    }
    return neighbors;
}

/*
Algorithm logic ends.
*/

function makeEdges() {
    let seen = []
    let list = []
    let edges_length = edgeEncoding(grid.childElementCount, grid.childElementCount);
    //Placeholders so that i can put edges in unique indecies with edgeEncoding
    for (let i = 0; i <= edges_length; i++) {
        list.push(0);
    }
    children = grid.children;
    for (let i = 0; i < children.length; i++) {
        child = children[i];
        neighbors = getHalfNeighbors(i)
        for (let j = 0; j < neighbors.length; j++) {
            to = neighbors[j];
            let list_index = edgeEncoding(i, to);
            if (list[list_index] === 0) {
                list.splice(list_index, 1, makeEdge(i, to, EdgeWeight()));
            }
        }
    }
    return list;
}

function EdgeWeight() {
        let rand = Math.random() * 10;
        let floor = Math.floor((rand) + 1);
        //return floor;
        return 1;
}

function makeEdge(from, to, weight) {
    return {
        from: from,
        to: to,
        weight: weight,         
     }
}

function reset() {
    clearInterval(visit_function)
    visit_counter = 0;
    children = grid.children;
    for (let i = 0; i < children.length; i++) {
        children[i].firstChild.style.visibility = "hidden";
    }
}

function resetAll() {
    reset();
    children = grid.children;
    for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = cellStatus.NORMAL;
    }
    children[0].style.backgroundColor = cellStatus.START;
}

//Return whether the cell of the given index has been visiited.
function isVisited(child_index) {
    cell = grid.children[child_index];
    search_image = cell.firstChild;
    return search_image.style.visibility == "visible";
}

//Visit each cell in the path with interval milliseconds inbetween
function pathVisit(path, interval) {
    visit_function = setInterval(function() {
        listVisit(path);
    }, interval);
}

function listVisit(path) {
    if (visit_counter < path.length) {
        set_visible(path[visit_counter]);
        visit_counter++;
    }
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
        let i = treasure_spots.indexOf(cell);
        if (i > -1) {
            treasure_spots.splice(i, 1);
        }
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
    treasure_spots.push(child_index);
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
    let resetButton = document.getElementById("reset");
    let resetAllButton = document.getElementById("reset-all");
    let dijsktra = document.getElementById("da");
    let aStar = document.getElementById("a-star");
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
    resetButton.addEventListener('click', reset);
    resetAllButton.addEventListener('click', resetAll);
    dijsktra.addEventListener('click', setDa);
    aStar.addEventListener('click', setAStar);
}

function setAStar() {
    current_algorithm = algorithm.ASTAR;
}

function setDa() {
    current_algorithm = algorithm.DA;
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