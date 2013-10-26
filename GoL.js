/* (Global) Variables */
var header = document.getElementById("Header");
var container = document.getElementById("Container");
var solution = document.getElementById("Solution");
var task =  document.getElementById("Task");

/* Website content */
// ElementId = element in which new element will be created
function Msg(ElementId, newElementTag, Message)
{
    if (typeof ElementId == 'string' || ElementId instanceof String)
        var Element = document.getElementById(ElementId);
    else if (typeof ElementId === 'object')
        var Element = ElementId;
    if (Element === undefined || Element == null || Element.length <= 0)
        return;

    if (newElementTag === undefined || newElementTag == null || newElementTag.length <= 0)
    {
        newElement = document.createElement("p");
    }
    else
    {
        newElement = document.createElement(newElementTag);
    }
    newElement.innerHTML = Message;
    Element.appendChild(newElement);
}

document.title = "Game of Life";

Msg("Header", "h1", "Game of Life");

Msg("Task", "h2", "Task");
Msg("Task", "h3", "Emergence: Cellular Automata");
Msg("Task", "", "Create an interactive implementation of the Game of Life grid, where a player can select starting points for a variety of blinkers. The system then sends gliders to destroy them, resulting in chaos. Alternatively, system randomly sets some blinkers and player sets starting point for gliders. Documentation should clearly explain algorithms used to generate the life-forms.");

Msg("Solution", "h2" , "Solution");

var canvas = document.createElement("canvas");
solution.appendChild(canvas);

/* Website styles */
document.bgColor = "#C2C2A3";

// Styles for "Header"
header.style.backgroundColor = "#D4C7A3";
header.style.padding = "0px 0px 0px 10px";

// Styles for main "Container"
container.style.width = "1000px";
container.style.margin = "0 auto";

// Styles for "Solution"
solution.style.backgroundColor = "#669999";
solution.style.cssFloat = "left";
solution.style.height = "300px";
solution.style.padding = "0px 0px 0px 10px";
solution.style.width = "56%";

// Styles for "Task"
task.style.backgroundColor = "#f3f3f3";
task.style.width = "40%";
task.style.height = "300px";
task.style.cssFloat = "right";
task.style.padding = "20px 15px 20px 10px";

// Styles for "Canvas"
canvas.style.backgroundColor = "White";
canvas.style.border = "1px solid #000000";
canvas.width = 500;
canvas.height = 300;

/*----------------------*/
/* Solution of the task */
var context=canvas.getContext("2d");
context.scale(0.5, 0.5);

var p = 10; // cell size ?
var CellsX = 100;
var CellsY = 50;

function drawBoard()
{
    // Vertical lines
    for (var x = 0; x <= canvas.width; x += 20) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, canvas.height + p);
    }

    // Horizontal lines
    for (var x = 0; x <= canvas.height; x += 20) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(canvas.width + p, 0.5 + x + p);
    }

    context.strokeStyle = "black";
    context.stroke();
}

drawBoard();
//var str = "";
//Msg("Solution", "output" , str.concat(canvas.width," x ", canvas.height));