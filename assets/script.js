let create = document.getElementById("work");
let map = document.getElementById("map");
let mapItems = [];
createGraph(1, 1)

function createGraph(rows, cols) {
    let r = 0;
    let c = 0;
    for (r=0; r < rows; r++) {
        for (c=0; c < cols; c++) {
            makeMapItem("standard", false);
            addCell();
        }
    }
}

function addCell() {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    map.appendChild(cell);
}

function makeMapItem(type, visited) {
    this.type = type;
    this.visited = visited;
}