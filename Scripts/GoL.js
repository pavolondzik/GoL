/************************/
/* Solution of the task */
/************************/
// Objects, literal version based on http://www.phpied.com/3-ways-to-define-a-javascript-class/
// Get the coordinates of a mouse click on Canvas in Javascript, see http://miloq.blogspot.co.uk/2011/05/coordinates-mouse-click-canvas.html
// Some parts are taken from http://www.julianpulgarin.com/canvaslife/, https://github.com/jpulgarin/canvaslife
// Global objects: Graphics

/* (Global) Variables */

var stats = document.getElementById("stats");
var radios = document.getElementsByName('selectionMode');
var message = document.getElementById('message');

var canvas = document.getElementById("Universe");
var context = canvas.getContext("2d");

/* Enumerations have to be in the same order as select list options. */
ModeEnum = {
    RECT:   0,
    CIRCLE: 1,
    TRAIL:   2,
    TRAIL_NO_GRID: 3
}

/************ G R A P H I C S *************/

var Graphics =
{
    cellSize:    new Number(10),            // Pixels
    displayMode: ModeEnum.RECT,

    /* Naming convenction 
         [state][mode][object]Colour
        state:
         alive, dead
        object:
         cell, middleCell, centrePoint
        mode:
         rect, circle, trail, trailNoGrid
    */
    aliveCellColour:        'black',
    aliveCircleCellColour:  'blue',
    aliveTrailCellCoulour:  'rgb(9, 68, 178)',      // Dark blue
    deadCellColour:         'rgb(248,248,255)',     // Ghost white
    middleCellColour:       'rgb(0, 255, 255)',     // Cyan
    trailColour:            'rgb(255, 191, 18)',    // Orange
    aliveCentrePointCoulour:'rgb(209, 93, 36)',

    /* Sets canvas backround, dimensions and event listeners. */
    init:       function ()
    {
        //canvas.style.position = "absolute";
        canvas.style.backgroundColor = Graphics.offColour;
        canvas.width = Life.cellsX * Graphics.cellSize;
        canvas.height = Life.cellsY * Graphics.cellSize;
        canvas.style.zIndex = "0";
        canvas.addEventListener("mousedown", Graphics.getCell, false); 
    },

    /* Returns true if coordinates x,y are
       coordinates of middle cells.
    */
    findMiddleCells:    function(x,y)
    {
        var isMiddleX = false;
        var isMiddleY = false;

        // Find middle coordinates
        if ((Life.cellsX % 2) === 0) { // even number
            if ((x === (Life.cellsX / 2)) || (x === ((Life.cellsX / 2) - 1)))
                isMiddleX = true;
            else isMiddleX = false;
        }
        else { // odd number
            if (x === Math.floor(Life.cellsX / 2)) isMiddleX = true;
            else isMiddleX = false;
        }
        if ((Life.cellsY % 2) === 0) {
            if ((y === (Life.cellsY / 2)) || (y === ((Life.cellsY / 2) - 1)))
                isMiddleY = true;
            else isMiddleY = false;
        }
        else {
            if (y === Math.floor(Life.cellsY / 2)) isMiddleY = true;
            else isMiddleY = false;
        }
        // Final check if both x and y are middle coordinates
        if (isMiddleX && isMiddleY) return true;
        else return false;
    },

    /* Draws cell with selected mode. */
    drawCell:   function (x, y, alive, trail)
    {
        switch(Graphics.displayMode)
        {
            case ModeEnum.RECT:
                context.beginPath();
                context.rect(x * Graphics.cellSize + 1, y * Graphics.cellSize + 1, Graphics.cellSize - 1, Graphics.cellSize - 1);
                context.fillStyle = (alive) ? Graphics.aliveCellColour : Graphics.deadCellColour;
                context.fill();
                context.lineWidth = 1;
                // Find middle coordinates
                if (Graphics.findMiddleCells(x,y)) context.strokeStyle = Graphics.middleCellColour;
                else context.strokeStyle = Graphics.aliveCellColour;
                context.stroke();
                break;
            case ModeEnum.CIRCLE:
                context.beginPath();
                context.rect(x * Graphics.cellSize + 1, y * Graphics.cellSize + 1, Graphics.cellSize - 1, Graphics.cellSize - 1);
                context.fillStyle = Graphics.deadCellColour;
                context.fill();
                context.lineWidth = 1;
                // Find middle coordinates
                if (Graphics.findMiddleCells(x, y)) context.strokeStyle = Graphics.middleCellColour;
                else context.strokeStyle = Graphics.aliveCellColour;
                context.stroke();
                if (alive) {
                    context.beginPath();
                    context.arc((x * Graphics.cellSize) + 5, (y * Graphics.cellSize) + 5, 4, 0, 2 * Math.PI);
                    context.fillStyle = (alive) ? Graphics.aliveCircleCellColour : Graphics.deadCellColour;
                    context.fill();
                    context.stroke();
                }
                break;
            case ModeEnum.TRAIL:
                context.beginPath();
                context.rect(x * Graphics.cellSize + 1, y * Graphics.cellSize + 1, Graphics.cellSize - 1, Graphics.cellSize - 1);
                context.fillStyle = (alive) ? Graphics.aliveTrailCellCoulour : Graphics.deadCellColour;
                context.fill();
                context.lineWidth = 1;
                
                context.strokeStyle = Graphics.aliveTrailCellCoulour;
                if (trail) context.strokeStyle = Graphics.trailColour;

                // Find middle coordinates
                if (Graphics.findMiddleCells(x, y)) context.strokeStyle = Graphics.middleCellColour;

                context.stroke();
                break;
            case ModeEnum.TRAIL_NO_GRID:
                context.beginPath();
                context.rect(x * Graphics.cellSize , y * Graphics.cellSize , Graphics.cellSize , Graphics.cellSize );
                context.fillStyle = (alive) ? Graphics.aliveTrailCellCoulour : Graphics.deadCellColour;
                context.fill();
                context.lineWidth = 1;

                context.strokeStyle = Graphics.deadCellColour;
                if (trail) context.strokeStyle = Graphics.trailColour;

                // Find middle coordinates
                if (Graphics.findMiddleCells(x, y)) context.strokeStyle = Graphics.middleCellColour;

                context.stroke();
                break;
        }
    },

    drawCentrePoint:   function (x, y, alive)
    {
        context.beginPath();
        context.rect(x * Graphics.cellSize + 1, y * Graphics.cellSize + 1, Graphics.cellSize - 1, Graphics.cellSize - 1);
        if (alive) {
            context.fillStyle = Graphics.aliveCentrePointCoulour;
        }
        else context.fillStyle = Graphics.deadCellColour;
        context.fill();
        context.lineWidth = 1;
        // Find middle coordinates
        if (Graphics.findMiddleCells(x,y)) context.strokeStyle = Graphics.middleCellColour;
        else context.strokeStyle = Graphics.aliveCellColour;
        context.stroke();
    },

    /* Returns cell co-ordinates, index starts from [0][0]. */
    /* Returns empty array if coordinates are from outside of canvas. */
    getCoordinates: function(event)
    {
        var x = new Number(),
            y = new Number();

        if (event == undefined) {
            return new Array();
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
            return new Array();
        }
        return new Array(x,y);
    },

    /* 
       Saves cell's co-ordinates to previous generetation and
       brings that cell to live. Draws the live cell on canvas.
    */
    getCell: function(event)
    {
        var cellCoordinates = new Array();
        cellCoordinates = Graphics.getCoordinates(event);

        if (cellCoordinates.length != 2) return;
        var x = cellCoordinates[0];
        var y = cellCoordinates[1];

        // Save cell's changed state
        Life.prevGen[x][y] = !Life.prevGen[x][y];
        // Draw cell
        Graphics.drawCell(x, y, Life.prevGen[x][y], false);
    },

    /* Returns cell co-ordinates of starting point for gliders. */
    getStartingPoint: function (event) {
        var cellCoordinates = new Array();
        cellCoordinates = Graphics.getCoordinates(event);

        // Save coordinates to Life.startingPointForGliders
        if (cellCoordinates.length != 2) return;
        var x = cellCoordinates[0];
        var y = cellCoordinates[1];
        Life.startingPointForGliders[0] = x;
        Life.startingPointForGliders[1] = y;

        // Add cell's changed state to previous generation
        Life.prevGen[x][y] = !Life.prevGen[x][y];

        // Draw cell in trailing mode
        Graphics.drawCentrePoint(x, y, Life.prevGen[x][y]);
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
                Graphics.drawCell(x, y, Life.nextGen[x][y], false);
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
                    Graphics.drawCell(x, y, Life.nextGen[x][y], true);
                }
            }
        }
    },

    printMessage: function (x, y, text) {
        // Visibility
        message.style.backgroundColor = "lightGrey";
        message.style.opacity = "0.9";
        message.style.zIndex = "1"; // Show message

        // Text - construct and format text before retrieving its width
        message.innerHTML = text;

        // Format
        message.style.color = "#008b8b";    // Dark cyan
        message.style.fontFamily = "Times New Roman";
        message.style.fontSize = "32px";

        // Position
        x = x - Math.floor(message.offsetWidth / 2);
        y = y - Math.floor(message.offsetHeight / 2);
        message.style.position = "absolute";
        message.style.top = y.toString() + 'px';
        message.style.left = x.toString() + 'px';
        message.style.marginLeft = "auto";
        message.style.marginRight = "auto";
        message.style.paddingRight = "15px";
        message.style.paddingLeft = "15px";
        
        // Clear Screen
        setTimeout(Graphics.clearMessage, 2000);
    },

    clearMessage: function () {
        //message.innerHTML = "";
        message.style.zIndex = "-1";
    },

    randomPaint: function () {
        var i = 0,
            count = 0,
            kx = 0,
            ky = 0,
            neighbours = new Array();

        // Returns Neighbourhood of the cell plus the cell
        function Neighbourhood(x, y) {
            var i,
                j,
                array = new Array();

            for (i = x - 1; i < x + 2; i++) {
                for (j = y - 1; j < y + 2; j++) {
                    if((i <= Life.cellsX) && (j <= Life.cellsY))
                        array.push(new Array(i, j));
                }
            }
            return array;
        }

        // Print random blinkers 
        for (count = 1; count < 16; count++) {
            kx = Math.floor(Math.random() * (Life.cellsX - 4)) + 2;
            ky = Math.floor(Math.random() * (Life.cellsY - 4)) + 2;
            neighbours = new Neighbourhood(kx, ky);
            for (i = 0; i < neighbours.length; i++) {
                Life.prevGen[neighbours[i][0]][neighbours[i][1]] = Graphics.random();
                Graphics.drawCell(neighbours[i][0], neighbours[i][1], Life.prevGen[neighbours[i][0]][neighbours[i][1]], false);
            }
        }

        // Display div to invite user to select
        // starting point for gliders
        Graphics.printMessage(canvas.offsetLeft + Math.floor(canvas.width / 2),
                              canvas.offsetTop + Math.floor(canvas.height / 2),
                              "Set starting point for gliders please.");
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
    generation: new Number(0),
    //Algorithm variables
    gliderSize: new Number(3),
    xUpperLeft: new Number(0),
    yUpperLeft: new Number(0),
    xLowerRight: new Number(0),
    yLowerRight: new Number(0),
    lifeExists: false,
    startingPointForGliders: new Array(),

    /* Sets matrix(universe) states and draws canvas matrix. */
    initUniverse: function (cellsX, cellsY)
    {
        Life.cellsX = cellsX;
        Life.cellsY = cellsY;

        // Set values for algorithm
        Life.xUpperLeft = 0;
        Life.yUpperLeft = 0;
        Life.xLowerRight = Life.cellsX - Life.gliderSize;
        Life.yLowerRight = Life.cellsY - Life.gliderSize;

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

        // Output initial value of generation count
        stats.innerHTML = Life.generation;
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
            neighbours = [ // Clockwise direction
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

    /*
        If previous genereation contains live cell
        send correctly rotated glider(s) in next generation.
    */
    userSelection: function ()
    {
        // Update generation count
        stats.innerHTML = Life.generation;

        // Check if Universe has at least one alive cell
        loop:
            {
                for (x = 0; x < Life.cellsX; x++) {
                    for (y = 0; y < Life.cellsY; y++) {
                        if (Life.prevGen[x][y]) {
                            Life.lifeExists = true;
                            break loop;
                        }
                    }
                }
            }

        // If no alive cells found, exit
        if (!Life.lifeExists) return;

        // Every 14th generation send glider on different position
        // Resetting position or advancing
        if (Life.generation % 14 == 0) {
            if (Life.xUpperLeft > Life.cellsX) Life.xUpperLeft = 0;
            else Life.xUpperLeft += 7;

            if (Life.xLowerRight < 0) Life.xLowerRight = Life.cellsX - Life.gliderSize;
            else Life.xLowerRight -= 7;

        }
        // Saving corectly rotated two gliders to next generation
        // (-1 means starting from generation 1)
        if ((Life.generation - 1) % 14 == 0) {
            // Upper left corner
            Life.nextGen[Life.xUpperLeft + 1][Life.yUpperLeft] = true;
            Life.nextGen[Life.xUpperLeft + 2][Life.yUpperLeft + 1] = true;
            Life.nextGen[Life.xUpperLeft][Life.yUpperLeft + 2] = true;
            Life.nextGen[Life.xUpperLeft + 1][Life.yUpperLeft + 2] = true;
            Life.nextGen[Life.xUpperLeft + 2][Life.yUpperLeft + 2] = true;

            //Lower right corner
            Life.nextGen[Life.xLowerRight][Life.yLowerRight] = true;
            Life.nextGen[Life.xLowerRight + 1][Life.yLowerRight] = true;
            Life.nextGen[Life.xLowerRight + 2][Life.yLowerRight] = true;
            Life.nextGen[Life.xLowerRight][Life.yLowerRight + 1] = true;
            Life.nextGen[Life.xLowerRight + 1][Life.yLowerRight + 2] = true;
        }

        Life.lifeExists = false;
        return;
    },

    automaticSelection: function()
    {
        var i,
            j,
            count = 0,
            countFlag = false;

        // Update generation count
        stats.innerHTML = Life.generation;

        // Get starting point
        if (Life.startingPointForGliders.length != 2) return;
        var x = Life.startingPointForGliders[0];
        var y = Life.startingPointForGliders[1];

        // Detect alive neigbours
        for (i = x - 1; i < 3; i++) {
            for (j = y - 1; j < 3; j++) {
                if (i == x && j == y) continue;
                if(!nextGen[i][j])
                    count++
            }
        }
        // if all neighbours are dead, we can draw glider
        if (count == 0)
            countFlag = true;

        // Find (detect) live clusters //
        // count number of vertices in cyclic graph

        // Find the biggest cluster

        // Send gliders with the right rotation towards the cluster
        var glider = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 2]];
        // Redraw the starting point
        Graphics.drawCell(x,y, true, false);
        //Life.nextGen[x][y] = false;
        //Drawing the glider
        for (i = 0; i < glider.length; i++)
                Life.nextGen[x + glider[i][0]][y + glider[i][1]] = true;

        // All starting points have been drawn, removing starting points
        Life.startingPointForGliders = new Array();
    },

    /* Produces next state. */
    nextGen: function ()
    {
        var x,
            y,
            count;

        Life.generation++;

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

        // Adding life forms to next generation
        if (radios['userRadioBtn'].checked)
            Life.userSelection();
        else if (radios['automaticRadioBtn'].checked)
            Life.automaticSelection();
        else stats.innerHTML = Life.generation;

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
        var g = Graphics,
            l = Life;

        $.ajax({
            url: url,
            success: function (data) {
                var match = data.match(/x\s=\s(\d*).*?y\s=\s(\d*).*\r([^]*)!/),
                    x,
                    y,
                    xPattern = parseInt(match[1], 10),      // Pattern dimensions
                    yPattern = parseInt(match[2], 10),
                    pattern = match[3].replace(/\s+/g, ""), // Remove whitespace
                    lines = pattern.split('$'),
                    i,
                    j,
                    line,
                    length,
                    cellsX,                                 // Canvas dimensions
                    cellsY,
                    spinnerX = $("#spinnerX").spinner(),
                    spinnerY = $("#spinnerY").spinner();
                
                // Setting size of the canvas
                if (spinnerX.spinner('value') > xPattern)
                    cellsX = spinnerX.spinner('value');
                else
                    cellsX = xPattern;
                if (spinnerY.spinner('value') > yPattern)
                    cellsY = spinnerY.spinner('value');
                else
                    cellsY = yPattern;

                Life.initUniverse(cellsX, cellsY);

                // For too big canvas size, the canvas will become scrollable
                if ((cellsX > screen.availWidth) || (cellsY > screen.availWidth))
                    canvas.style.overflow = 'scroll';

                // Move pattern to the middle of the screen (subtracting pattern dimension)
                // minus one because array index starts from 0
                x = Math.floor(Life.cellsX / 2) - Math.floor(xPattern / 2) -1;
                y = Math.floor(Life.cellsY / 2) - Math.floor(yPattern / 2) -1;

                for (i = 0; i < lines.length; i++) {
                    y++;
                    x = Math.floor(Life.cellsX / 2) - Math.floor(xPattern/2) -1;
                    line = lines[i];
                    while (line) {
                        if (line.charAt(0) === 'o' || line.charAt(0) === 'b') {
                            if (line.charAt(0) === 'o') {
                                Life.prevGen[x][y] = true;
                                Graphics.drawCell(x, y, true, false);
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
                                    Graphics.drawCell(x + j, y, true, false);
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
                Life.prevGen[x][y] = false;
                Graphics.drawCell(x, y, Life.nextGen[x][y], false);
            }
        }

        Life.generation = 0;
        stats.innerHTML = Life.generation;

        // Set values for algorithm
        Life.xUpperLeft = 0;
        Life.yUpperLeft = 0;
        Life.xLowerRight = Life.cellsX - Life.gliderSize;
        Life.yLowerRight = Life.cellsY - Life.gliderSize;

        Life.lifeExists = false;
    }

}
