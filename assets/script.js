let create = document.getElementById("work");
let map = document.getElementById("map");

function addCell() {
    alert("Hey");
    let cell = document.createElement("div");
    cell.classList.add("map-item");
    map.appendChild(cell);
}


create.addEventListeners("click", function(){
    alert("Hello");
    let cell = document.createElement("button");
    cell.classList.add("map-item");
    create.appendChild(cell);
/*
    let para = document.createElement("li");
    let t = document.createTextNode("this is a paragraph");
    para.appendChild(t);
    document.getElementsById("run").appendChild(para);*/
});