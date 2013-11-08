/************************/
/* Solution of the task */
/************************/
// Objects, literal version based on http://www.phpied.com/3-ways-to-define-a-javascript-class/
// Get the coordinates of a mouse click on Canvas in Javascript, see http://miloq.blogspot.co.uk/2011/05/coordinates-mouse-click-canvas.html
// Some parts are taken from http://www.julianpulgarin.com/canvaslife/, https://github.com/jpulgarin/canvaslife
// Global objects: Graphics

/* (Global) Variables */

var output = document.getElementById("Output");

var canvas = document.getElementById("Universe");
var context = canvas.getContext("2d");

/* Enumerations have to be in the same order as select list options. */
ModeEnum = {
    RECT: 0,
    CIRCLE: 1
}

/************ G R A P H I C S *************/

var Graphics =
{
    cellSize:    new Number(10),                     //pixels
    displayMode: ModeEnum.RECT,

    onColour:       'black',
    onColourCircle: 'blue',
    offColour:      'white',
    trailColour:    'rgb(50, 50, 50)',              //dark grey

    /* Sets canvas backround, dimensions and event listeners. */
    init:       function ()
    {
        canvas.style.backgroundColor = Graphics.offColour;
        canvas.width = Life.cellsX * Graphics.cellSize;
        canvas.height = Life.cellsY * Graphics.cellSize;
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
                context.strokeStyle = Graphics.onColour;
                context.stroke();
                break;
            case ModeEnum.CIRCLE:
                context.beginPath();
                context.rect(x * Graphics.cellSize + 1, y * Graphics.cellSize + 1, Graphics.cellSize - 1, Graphics.cellSize - 1);
                context.fillStyle = Graphics.offColour;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = Graphics.onColour;
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
            return;
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
        if (x > Life.cellsX - 1 || y > Life.cellsY - 1 || x < 0 || y < 0) {
            return;
        }

        // Save cell's changed state
        Life.prevGen[x][y] = !Life.prevGen[x][y];
        // Draw cell
        Graphics.drawCell(x, y, Life.prevGen[x][y]);
    },

    /* Draws canvas matrix. */
    paint: function ()
    {
        var x,
            y;

        for (x = 0; x < Life.cellsX; x++)
        {
            for (y = 0; y < Life.cellsY; y++)
            {
                Graphics.drawCell(x, y, Life.prevGen[x][y]);
            }
        }
    },

    /* Draws canvas matrix. */
    smartPaint: function ()
    {
        var x,
            y;

        for (x = 0; x < Life.cellsX; x++) {
            for (y = 0; y < Life.cellsY; y++) {
                if (Life.prevGen[x][y] !== Life.nextGen[x][y]) {
                    Graphics.drawCell(x, y, Life.nextGen[x][y]);
                }
            }
        }
    },

    /* Changes display mode of the cell. */
    changeMode: function(displayMode)
    {
        Graphics.displayMode = displayMode;

        // Re-draw canvas
        Graphics.paint();
    },

    /* Generates random number. */
    random: function () {
        return Math.random() < 0.5 ? true : false;
    }
}

/************ L I F E *************/
var Life =
{
    prevGen:    new Array(),    // previous generation, holds status (live/dead) for each cell in the grid
    nextGen:    new Array(),    // next generation
    speed:      new Number(100),
    timeout:    new Number(),
    alive:      false,
    cellsX:     new Number(20), // no. of cells
    cellsY:     new Number(20),

    /* Sets matrix(universe) states and draws canvas matrix. */
    initUniverse: function (cellsX, cellsY)
    {
        Life.cellsX = cellsX;
        Life.cellsY = cellsY;

        var x = new Number();
        var y = new Number();

        document.addEventListener("DOMContentLoaded", Graphics.init(), false);

        // Initialize states
        for (x = 0; x < Life.cellsX; x++)
        {
            Life.prevGen[x] = [];
            Life.nextGen[x] = [];
            for (y = 0; y < Life.cellsY; y++)
            {
                Life.prevGen[x][y] = false;
                Life.nextGen[x][y] = false;
            }
        }

        // Paint the Grid
        Graphics.paint();
    },

    /* Turns on / off the game. */
    toggleLife: function ()
    {
        if (Life.alive)
        {
            Life.alive = false;
            clearInterval(Life.timeout);
        }
        else
        {
            Life.alive = true;
            Life.timeout = setInterval(Life.nextGen, Life.speed);
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
            clearInterval(Life.timeout);
            Life.timeout = setInterval(Life.nextGen, Life.speed);
        }
    },

    /* Counts number of alive adjacent cells. */
    neighbourCount: function (x, y)
    {
        var count = 0,
            i,
            neighbours = [
                Life.prevGen[x][(y - 1 + Life.cellsY) % Life.cellsY],
                Life.prevGen[(x + 1 + Life.cellsX) % Life.cellsX][(y - 1 + Life.cellsY) % Life.cellsY],
                Life.prevGen[(x + 1 + Life.cellsX) % Life.cellsX][y],
                Life.prevGen[(x + 1 + Life.cellsX) % Life.cellsX][(y + 1 + Life.cellsY) % Life.cellsY],
                Life.prevGen[x][(y + 1 + Life.cellsY) % Life.cellsY],
                Life.prevGen[(x - 1 + Life.cellsX) % Life.cellsX][(y + 1 + Life.cellsY) % Life.cellsY],
                Life.prevGen[(x - 1 + Life.cellsX) % Life.cellsX][y],
                Life.prevGen[(x - 1 + Life.cellsX) % Life.cellsX][(y - 1 + Life.cellsY) % Life.cellsY]
            ];

        // If neighbour alive (true), add him up
        for (i = 0; i < neighbours.length; i++) {
            if (neighbours[i]) {
                count++;
            }
        }

        return count;
    },

    /* Produces next state. */
    nextGen: function ()
    {
        var x,
            y,
            count;

        for (x = 0; x < Life.cellsX; x++)
        {
            for (y = 0; y < Life.cellsY; y++)
            {
                Life.nextGen[x][y] = Life.prevGen[x][y];
            }
        }

        for (x = 0; x < Life.cellsX; x++)
        {
            for (y = 0; y < Life.cellsY; y++)
            {
                count = Life.neighbourCount(x, y);

                // Game of Life rules
                if (Life.prevGen[x][y])                // A live cell with two or three live neighbors stays alive (survival)
                {
                    if (count < 2 || count > 3)         // (live cell dies if no. of neighbours is not 2 or 3)
                    {
                        Life.nextGen[x][y] = false;
                    }
                } else if (count === 3) {               // A dead cell with exactly three live neighbors becomes a live cell (birth).
                    Life.nextGen[x][y] = true;          // (dead cell stays dead cell)
                }
            }
        }

        Graphics.smartPaint();

        for (x = 0; x < Life.cellsX; x++)
        {
            for (y = 0; y < Life.cellsY; y++)
            {
                Life.prevGen[x][y] = Life.nextGen[x][y];
            }
        }
    },

    // Parses files in Run Length Encoded Format
    // http://www.conwaylife.com/wiki/RLE
    loadPattern:   function (url) {
        var padding = 30;

        $.ajax({
            url: url,
            success: function (data) {
                var match = data.match(/x\s=\s(\d*).*?y\s=\s(\d*).*\r([^]*)!/),
                    x = parseInt(match[1], 10),
                    pattern = match[3].replace(/\s+/g, ""), // remove whitespace
                    lines = pattern.split('$'),
                    offset = 0,
                    i,
                    line,
                    length,
                    j,
                    y = padding - 1;

                $(canvas).attr('height', Graphics.cellSize * (y + 1 + (padding * 2)));
                $(canvas).attr('width', Graphics.cellSize * (x + 1 + (padding * 2)));
                $(canvas).unbind('mousedown');
                Life.initUniverse();

                for (i = 0; i < lines.length; i++) {
                    y++;
                    x = padding;
                    line = lines[i];
                    while (line) {
                        if (line.charAt(0) === 'o' || line.charAt(0) === 'b') {
                            if (line.charAt(0) === 'o') {
                                Life.prev[x][y] = true;
                                Graphics.drawCell(x, y, true);
                            }
                            x++;
                            line = line.substring(1);
                        } else {
                            length = line.match(/(\d*)/)[1];
                            line = line.substring(length.length);
                            length = parseInt(length, 10);
                            if (!line) {
                                y += length - 1;
                                break;
                            }
                            if (line.charAt(0) === 'o') {
                                for (j = 0; j < length; j++) {
                                    Life.prevGen[x + j][y] = true;
                                    Graphics.drawCell(x + j, y, true);
                                }
                            }
                            x += length;
                            line = line.substring(1);
                        }
                    }
                }
            }
        });
        },

    /* Clears Universe. */
    clearUniverse: function ()
    {
        var x,
            y;
       
        for (x = 0; x < Life.cellsX; x++)
        {
            for (y = 0; y < Life.cellsY; y++)
            {
                Life.nextGen[x][y] = false;
                if (Life.prevGen[x][y] !== Life.nextGen[x][y])
                {
                    Graphics.drawCell(x, y, Life.nextGen[x][y]);
                }
                Life.prevGen[x][y] = false;
            }
        }
    }

}
