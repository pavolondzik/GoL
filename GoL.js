/* (Global) Variables */
var solution = document.getElementById("Solution");
var output = document.getElementById("Output");

var canvas = document.createElement("canvas");
solution.appendChild(canvas);

/* Website styles */
document.bgColor = "#C2C2A3";

/************************/
/* Solution of the task */
/************************/

var context=canvas.getContext("2d");
//context.scale(0.5, 0.5);

var cellSize = 10; //pixels
var cellsX = 100;
var cellsY = 50;

// Styles for "Canvas"
canvas.style.backgroundColor = "White";
canvas.width = cellsX * cellSize;
canvas.height = cellsY * cellSize;

onColour = 'rgb(0, 0, 0)',
offColour = 'rgb(255, 255, 255)',
gridColour = 'rgb(50, 50, 50)';


function drawCell(x, y, alive)
{    
    context.beginPath();
    context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
    context.fillStyle = (alive) ? onColour : offColour;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
}

function paint() {
    var x,
        y;

    for (x = 0; x < cellsX; x++) {
        for (y = 0; y < cellsY; y++) {
            drawCell(x, y, random());
        }
    }
}

paint();

output.innerHTML = canvas.width.toString().concat(" x ", canvas.height);
