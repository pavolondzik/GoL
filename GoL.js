/* (Global) Variables */
var message = "";
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

var cellSize = 10; //pixels
var cellsX = 100;
var cellsY = 50;

// Styles for "Canvas"
canvas.style.backgroundColor = "White";
canvas.width = cellsX * cellSize;
canvas.height = cellsY * cellSize;

onColour = 'black',
onColourCircle = 'blue',
offColour = 'white',
gridColour = 'rgb(50, 50, 50)'; //dark grey

ModeEnum = {
    RECT: 0,
    CIRCLE: 1
}


function drawCell(x, y, alive, displayMode)
{
    switch(displayMode)
    {
        case ModeEnum.RECT:
            context.beginPath();
            context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
            context.fillStyle = (alive) ? onColour : offColour;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = gridColour;
            context.stroke();
            break;
        case ModeEnum.CIRCLE:
            context.beginPath();
            context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
            context.fillStyle = offColour;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = gridColour;
            context.stroke();
            if (alive) {
                context.beginPath();
                context.arc((x * cellSize) + 5, (y * cellSize) + 5, 3, 0, 2 * Math.PI);
                context.fillStyle = (alive) ? onColourCircle : offColour;
                context.fill();
                context.stroke();
            }
            break;
    }
}

function paint() {
    var x,
        y;

    for (x = 0; x < cellsX; x++)
    {
        for (y = 0; y < cellsY; y++)
        {
            drawCell(x, y, random(), ModeEnum.RECT);
        }
    }
}
paint();
message = "Resolution: " + canvas.width.toString() + "x" + canvas.height.toString() + ", ";
message += "Cells: " + cellsX + "x" + cellsY;
output.innerHTML = message;
