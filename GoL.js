/* (Global) Variables */

var solution = document.getElementById("Solution");
var output = document.getElementById("Output");

var canvas = document.getElementById("Universe");
var context = canvas.getContext("2d");

/* Website styles */
document.bgColor = "#C2C2A3";

/************************/
/* Solution of the task */
/************************/
// Objects, literal version based on http://www.phpied.com/3-ways-to-define-a-javascript-class/
// Get the coordinates of a mouse click on Canvas in Javascript, see http://miloq.blogspot.co.uk/2011/05/coordinates-mouse-click-canvas.html
// Global objects: Graphics

var Graphics =
{
    cellSize:   10,                                 //pixels
    cellsX:     100,                                // no. of cells
    cellsY:     50,
    ModeEnum:   {
                RECT: 0,
                CIRCLE: 1
    },

    onColour:   'black',
    onColourCircle: 'blue',
    offColour:  'white',
    gridColour: 'rgb(50, 50, 50)',                  //dark grey
    message:    new String(),

    /* Member functions */

    init:       function ()
    {
        canvas.style.backgroundColor = this.offColour;
        canvas.width = this.cellsX * this.cellSize;
        canvas.height = this.cellsY * this.cellSize;
        canvas.addEventListener("mousedown", this.getPosition, false);
    },

    getPosition: function (event) {
        var x = new Number();
        var y = new Number();

        if (event.x != undefined && event.y != undefined) {
            x = event.x;
            y = event.y;
        }
        else // Firefox method to get the position
        {
            x = event.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        alert("x: " + x + "  y: " + y);
    },

    drawCell:   function (x, y, alive, displayMode)
    {
        switch(displayMode)
        {
            case this.ModeEnum.RECT:
                context.beginPath();
                context.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                context.fillStyle = (alive) ? this.onColour : this.offColour;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = this.gridColour;
                context.stroke();
                break;
            case this.ModeEnum.CIRCLE:
                context.beginPath();
                context.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                context.fillStyle = this.offColour;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = this.gridColour;
                context.stroke();
                if (alive) {
                    context.beginPath();
                    context.arc((x * this.cellSize) + 5, (y * this.cellSize) + 5, 3, 0, 2 * Math.PI);
                    context.fillStyle = (alive) ? this.onColourCircle : this.offColour;
                    context.fill();
                    context.stroke();
                }
                break;
        }
    },

    paint: function ()
    {
        var x,
            y;

        for (x = 0; x < this.cellsX; x++)
        {
            for (y = 0; y < this.cellsY; y++)
            {
                this.drawCell(x, y, random(), this.ModeEnum.RECT);
            }
        }

        this.message = "Resolution: " + canvas.width.toString() + "x" + canvas.height.toString() + ", ";
        this.message += "Cells: " + this.cellsX + "x" + this.cellsY;
        output.innerHTML = this.message;
    }

}

// Use the singleton object
document.addEventListener("DOMContentLoaded", Graphics.init(), false);
Graphics.paint();