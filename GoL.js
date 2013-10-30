/* (Global) Variables */

var solution = document.getElementById("Solution");
var output = document.getElementById("Output");

var canvas = document.getElementById("Universe");
var context = canvas.getContext("2d");

ModeEnum =   {
        RECT: 0,
        CIRCLE: 1
}

/* Website styles */
document.bgColor = "#C2C2A3";

/************************/
/* Solution of the task */
/************************/
// Objects, literal version based on http://www.phpied.com/3-ways-to-define-a-javascript-class/
// Get the coordinates of a mouse click on Canvas in Javascript, see http://miloq.blogspot.co.uk/2011/05/coordinates-mouse-click-canvas.html
// Some parts are taken from http://www.julianpulgarin.com/canvaslife/, https://github.com/jpulgarin/canvaslife
// Global objects: Graphics

var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

var Graphics =
{
    cellSize:   new Number(10),                     //pixels
    cellsX:     new Number(100),                    // no. of cells
    cellsY:     new Number(50),
    displayMode: ModeEnum.RECT,

    onColour:   'black',
    onColourCircle: 'blue',
    offColour:  'white',
    gridColour: 'rgb(50, 50, 50)',                  //dark grey
    message:    new String(),

    /* Member functions */
    /* Sets canvas backround, dimensions and event listeners. */
    init:       function ()
    {
        canvas.style.backgroundColor = Graphics.offColour;
        canvas.width = Graphics.cellsX * Graphics.cellSize;
        canvas.height = Graphics.cellsY * Graphics.cellSize;
        canvas.addEventListener("mousedown", Graphics.getCell, false);
    },

    /* Draws cell with selected mode. */
    drawCell:   function (x, y, alive)
    {
        switch(Graphics.displayMode)
        {
            case ModeEnum.RECT:
                context.beginPath();
                context.rect(x * Graphics.cellSize + 1, y * Graphics.cellSize + 1, Graphics.cellSize - 1, Graphics.cellSize - 1);
                context.fillStyle = (alive) ? Graphics.onColour : Graphics.offColour;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = Graphics.gridColour;
                context.stroke();
                break;
            case ModeEnum.CIRCLE:
                context.beginPath();
                context.rect(x * Graphics.cellSize + 1, y * Graphics.cellSize + 1, Graphics.cellSize - 1, Graphics.cellSize - 1);
                context.fillStyle = Graphics.offColour;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = Graphics.gridColour;
                context.stroke();
                if (alive) {
                    context.beginPath();
                    context.arc((x * Graphics.cellSize) + 5, (y * Graphics.cellSize) + 5, 4, 0, 2 * Math.PI);
                    context.fillStyle = (alive) ? Graphics.onColourCircle : Graphics.offColour;
                    context.fill();
                    context.stroke();
                }
                break;
        }
    },

    /* Returns cell co-ordinates, index starts from [0][0]. */
    getCell: function(event)
    {
        var x = new Number(),
            y = new Number(),
            state;

        if (event == undefined) {
            return new Point(x, y);
        }

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

        // Get cell coordinates
        x = Math.floor((x - canvas.offsetLeft) / Graphics.cellSize);
        y = Math.floor((y - canvas.offsetTop) / Graphics.cellSize);
        // If coordinates are outside the canvas
        if (x > Graphics.cellsX - 1 || y > Graphics.cellsY - 1 || x < 0 || y < 0) {
            return;
        }
        if (typeof state === 'undefined') {
            state = !Life.prevGen[x][y];
        }
        Life.prevGen[x][y] = state;
        //Graphics.drawCell(x, y, state);
        Graphics.drawCell(x, y, true);
    },

    /* Draws canvas matrix, sets display mode. */
    paint: function (displayMode)
    {
        var x,
            y;
        Graphics.displayMode = displayMode;

        for (x = 0; x < Graphics.cellsX; x++)
        {
            for (y = 0; y < Graphics.cellsY; y++)
            {
                Graphics.drawCell(x, y, Life.prevGen[x][y]);
            }
        }

        Graphics.message = "[Paint] Resolution: " + canvas.width.toString() + "x" + canvas.height.toString() + ", ";
        Graphics.message += "Cells: " + Graphics.cellsX + "x" + Graphics.cellsY;
        output.innerHTML = Graphics.message;
    },

    smartPaint:  function ()
    {
        var x,
            y;

        for (x = 0; x < Graphics.cellsX; x++) {
            for (y = 0; y < Graphics.cellsY; y++) {
                if (Life.prevGen[x][y] !== Life.nextGen[x][y]) {
                    Graphics.drawCell(x, y, Life.nextGen[x][y]);
                }
            }
        }

        Graphics.message = "[smartPaint] Resolution: " + canvas.width.toString() + "x" + canvas.height.toString() + ", ";
        Graphics.message += "Cells: " + Graphics.cellsX + "x" + Graphics.cellsY;
        output.innerHTML = Graphics.message;
    },

    random: function () {
        return Math.random() < 0.5 ? true : false;
    }
}

/************ L I F E *************/
var Life =
{
    prevGen:    new Array(), // previous generation
    nextGen:    new Array(), // next generation
    speed:      new Number(100),
    timeout:    new Number(),
    alive:      false,

    initUniverse: function ()
    {
        var x = new Number();
        var y = new Number();

        document.addEventListener("DOMContentLoaded", Graphics.init(), false);

        // Initialize states, previous gen. is dead (alive = false)
        for (x = 0; x < Graphics.cellsX; x++)
        {
            Life.prevGen[x] = [];
            Life.nextGen[x] = [];
            for (y = 0; y < Graphics.cellsY; y++)
            {
                Life.prevGen[x][y] = false;
            }
        }

        // Paint the Grid
        Graphics.paint(Graphics.displayMode);
    },

    toggleLife: function ()
    {
        if (Life.alive)
        {
            Life.alive = false;
            clearInterval(timeout);
        }
        else
        {
            Life.alive = true;
            timeout = setInterval(Life.nextGen, Life.speed);
        }
    },

    changeSpeed: function (faster)
    {
        if (faster) {
            if (Life.speed === 0) {
                return;
            }
            Life.speed -= 10;

        } else {
            if (Life.speed === 1000) {
                return;
            }
            Life.speed += 10;
        }

        if (Life.alive) {
            clearInterval(timeout);
            timeout = setInterval(Life.nextGen, Life.speed);
        }
    },

    neighbourCount: function (x, y)
    {
        var count = 0,
            i,
            neighbours = [
                Life.prevGen[x][(y - 1 + Graphics.cellsY) % Graphics.cellsY],
                Life.prevGen[(x + 1 + Graphics.cellsX) % Graphics.cellsX][(y - 1 + Graphics.cellsY) % Graphics.cellsY],
                Life.prevGen[(x + 1 + Graphics.cellsX) % Graphics.cellsX][y],
                Life.prevGen[(x + 1 + Graphics.cellsX) % Graphics.cellsX][(y + 1 + Graphics.cellsY) % Graphics.cellsY],
                Life.prevGen[x][(y + 1 + Graphics.cellsY) % Graphics.cellsY],
                Life.prevGen[(x - 1 + Graphics.cellsX) % Graphics.cellsX][(y + 1 + Graphics.cellsY) % Graphics.cellsY],
                Life.prevGen[(x - 1 + Graphics.cellsX) % Graphics.cellsX][y],
                Life.prevGen[(x - 1 + Graphics.cellsX) % Graphics.cellsX][(y - 1 + Graphics.cellsY) % Graphics.cellsY]
            ];

        for (i = 0; i < neighbours.length; i++) {
            if (neighbours[i]) {
                count++;
            }
        }

        return count;
    },

    nextGen: function ()
    {
        var x,
            y,
            count;

        for (x = 0; x < Graphics.cellsX; x++) {
            for (y = 0; y < Graphics.cellsY; y++) {
                Life.nextGen[x][y] = Life.prevGen[x][y];
            }
        }

        for (x = 0; x < Graphics.cellsX; x++) {
            for (y = 0; y < Graphics.cellsY; y++) {
                count = Life.neighbourCount(x, y);

                // Game of Life rules
                if (Life.prevGen[x][y]) {
                    if (count < 2 || count > 3) {
                        Life.nextGen[x][y] = false;
                    }
                } else if (count === 3) {
                    Life.nextGen[x][y] = true;
                }
            }
        }

        Graphics.paint(Graphics.displayMode);

        for (x = 0; x < Graphics.cellsX; x++) {
            for (y = 0; y < Graphics.cellsY; y++) {
                Life.prevGen[x][y] = Life.nextGen[x][y];
            }
        }
    },

    /* Clears Universe. */
    clearUniverse: function ()
    {
        var x,
            y;
       
        for (x = 0; x < Graphics.cellsX; x++) {
            for (y = 0; y < Graphics.cellsY; y++) {
                Life.nextGen[x][y] = false;
            }
        }

        Graphics.smartPaint();

        for (x = 0; x < Graphics.cellsX; x++) {
            for (y = 0; y < Graphics.cellsY; y++) {
                Life.prevGen[x][y] = false;
            }
        }

        Graphics.message = "[Paint] Resolution: " + canvas.width.toString() + "x" + canvas.height.toString() + ", ";
        Graphics.message += "Cells: " + Graphics.cellsX + "x" + Graphics.cellsY;
        output.innerHTML = Graphics.message;
    }

}
