/************************/
/* Solution of the task */
/************************/
// Objects, literal version based on http://www.phpied.com/3-ways-to-define-a-javascript-class/
// Get the coordinates of a mouse click on Canvas in Javascript, see http://miloq.blogspot.co.uk/2011/05/coordinates-mouse-click-canvas.html
// Some parts are taken from http://www.julianpulgarin.com/canvaslife/, https://github.com/jpulgarin/canvaslife
// Global objects: Graphics

/* (Global) Variables */

var stats = document.getElementById("stats");
var message = document.getElementById('message');

var canvas = document.getElementById("Universe");
var context = canvas.getContext("2d");

/**************  C E L L  ***************/

var Cell = function (y, x, alive) {
    this.y = y;
    this.x = x;
    this.alive = alive;
};

function cmpCells(cell1, cell2) {
    if (cell1.y == cell2.y && cell1.x == cell2.x) //&& cell1.alive == cell2.alive
        return true;
    else return false;
}

/************ G R A P H I C S *************/

/* Enumerations have to be in the same order as select list options. */
ModeEnum = {
    RECT: 0,
    CIRCLE: 1,
    TRAIL: 2,
    TRAIL_NO_GRID: 3
}

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
        canvas.style.backgroundColor = Graphics.offColour;
        canvas.width = Life.cellsX * Graphics.cellSize;
        canvas.height = Life.cellsY * Graphics.cellSize;
        canvas.style.zIndex = "0";
        canvas.addEventListener("mousedown", Graphics.getCell, false); 
    },

    /* Returns true if coordinates x,y are
       coordinates of middle cells.
    */
    findMiddleCells:    function(y,x)
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
    drawCell:   function (y, x, alive, trail)
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
                if (Graphics.findMiddleCells(y,x)) context.strokeStyle = Graphics.middleCellColour;
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
                if (Graphics.findMiddleCells(y, x)) context.strokeStyle = Graphics.middleCellColour;
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
                if (Graphics.findMiddleCells(y, x)) context.strokeStyle = Graphics.middleCellColour;

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
                if (Graphics.findMiddleCells(y, x)) context.strokeStyle = Graphics.middleCellColour;

                context.stroke();
                break;
        }
    },

    drawCentrePoint:   function (y, x, alive)
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
        if (Graphics.findMiddleCells(y,x)) context.strokeStyle = Graphics.middleCellColour;
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

        if (event.pageX != undefined && event.pageY != undefined) {
            x = event.pageX;
            y = event.pageY;
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
        return new Array(y,x);
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
        var y = cellCoordinates[0];
        var x = cellCoordinates[1];

        // Save cell's changed state
        Life.prevGen[y][x] = !Life.prevGen[y][x];
        // Draw cell
        Graphics.drawCell(y, x, Life.prevGen[y][x], false);
    },

    /* Returns cell co-ordinates of starting point for gliders. */
    getStartingPoint: function (event) {
        var cellCoordinates = new Array();
        cellCoordinates = Graphics.getCoordinates(event);

        // Save coordinates to Life.startPoints array of arrays
        if (cellCoordinates.length != 2) return;
        var y = cellCoordinates[0];
        var x = cellCoordinates[1];
        
        // Finds coordinates matching startpoint coordinates
        Life.startPoints.find = function find(y, x) {
            var i;
            for (i = 0; i < this.length; i++) {
                if ((this[i][0] == y) && (this[i][1] == x))
                    return i;
            }
            return -1;
        }
        var position = Life.startPoints.find(y,x);
        if(position == -1) // Starting point has not been found, add it
            Life.startPoints.push([y, x]);
        else Life.startPoints.splice(position, 1);

        // Add cell's changed state to previous generation
        Life.prevGen[y][x] = !Life.prevGen[y][x];

        // Draw cell in trailing mode
        Graphics.drawCentrePoint(y, x, Life.prevGen[y][x]);
    },

    /* Draws canvas matrix. */
    paint: function ()
    {
        var x,
            y;

        for (y = 0; y < Life.cellsY; y++)
        {
            for (x = 0; x < Life.cellsX; x++) {
                Graphics.drawCell(y, x, Life.nextGen[y][x], false);
            }
        }
    },

    /* Draws canvas matrix. */
    smartPaint: function ()
    {
        var x,
            y;

        for (y = 0; y < Life.cellsY; y++) {
            for (x = 0; x < Life.cellsX; x++) {
                if (Life.prevGen[y][x] !== Life.nextGen[y][x]) {
                    Graphics.drawCell(y, x, Life.nextGen[y][x], true);
                }
            }
        }
    },

    paintNextLine: function (y)
    {
        var x;
            
        for (x = 0; x < Life.cellsX; x++) {
                Graphics.drawCell(y, x, Life.prevGen[y][x], false);
        }
        
    },

    printMessage: function (y, x, text, color) {
        // Visibility
        message.style.backgroundColor = "lightGrey";
        message.style.opacity = "0.9";
        message.style.zIndex = "1"; // Show message

        // Text - construct and format text before retrieving its width
        message.innerHTML = text;

        // Format
        message.style.color = color;
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
        message.innerHTML = "";
        message.style.zIndex = "-1";
    },

    randomPaint: function () {
        var i = 0,
            count = 0,
            kx = 0,
            ky = 0,
            neighbours = new Array();

        // Returns Moore neighbourhood of the cell plus the centre cell
        function MooreAreaCentreCell(y, x) {
            var i,
                j,
                array = new Array();

            for (j = y - 1; j < y + 2; j++) {
                for (i = x - 1; i < x + 2; i++) {
                    if ((i > -1) && (j > -1) && (i <= Life.cellsX) && (j <= Life.cellsY))
                        array.push(new Array(j, i));
                }
            }
            return array;
        }

        // Seed universe with random blinkers 
        for (count = 1; count < 16; count++) {
            ky = Math.floor(Math.random() * (Life.cellsY - 4)) + 2;
            kx = Math.floor(Math.random() * (Life.cellsX - 4)) + 2;
            neighbours = new MooreAreaCentreCell(ky, kx);
            for (i = 0; i < neighbours.length; i++) {
                Life.prevGen[neighbours[i][0]][neighbours[i][1]] = Graphics.getRandomBool();
                Graphics.drawCell(neighbours[i][0], neighbours[i][1], Life.prevGen[neighbours[i][0]][neighbours[i][1]], false);
            }
        }

        // Display div to invite user to select
        // starting point for gliders
        Graphics.printMessage(Math.floor(window.innerHeight / 2), Math.floor(window.innerWidth / 2),
                              "Set starting point for gliders please.", "#008b8b");// Dark cyan
    },

    /* Changes display mode of the cell. */
    changeMode: function(displayMode)
    {
        Graphics.displayMode = displayMode;

        // Re-draw canvas
        Graphics.paint();
    },

    /* Generates random number. */
    getRandomBool: function () {
        return Math.random() < 0.5 ? true : false;
    },

    /**
     * Returns a random integer between min and max
     * Using Math.round() will give a non-uniform distribution!
     */
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
    cgolOn:     true,          // Conway's game of life is on or off
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
    startPoints: new Array(), // Starting Points For Gliders
    radios:     document.getElementsByName('selectionMode'),

    /* Sets matrix(universe) states and draws canvas matrix. */
    initUniverse: function (cellsY, cellsX)
    {
        Life.cellsY = cellsY;
        Life.cellsX = cellsX;

        // Set values for function Life.userSelection()
        Life.xUpperLeft = 0;
        Life.yUpperLeft = 0;
        Life.xLowerRight = Life.cellsX - Life.gliderSize;
        Life.yLowerRight = Life.cellsY - Life.gliderSize;

        var x = new Number();
        var y = new Number();

        document.addEventListener("DOMContentLoaded", Graphics.init(), false);

        // Initialize states
        
        for (y = 0; y < Life.cellsY; y++)
        {
            Life.prevGen[y] = [];
            Life.nextGen[y] = [];
            for (x = 0; x < Life.cellsX; x++)
            {
                Life.prevGen[y][x] = false;
                Life.nextGen[y][x] = false;
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
            if (Life.cgolOn) Life.timeout = setInterval(Life.nextGeneration, Life.speed);
            else Life.timeout = setInterval(Life.nextGenerationRule30, Life.speed);
        }
    },

    changeSpeed: function (speedMeasure)
    {
        if ((speedMeasure < 1) || (speedMeasure > 100)) return;
        Life.speed = 1000 - 10 * speedMeasure;

        if (Life.alive) {
            clearInterval(Life.timeout);
            if (Life.cgolOn) Life.timeout = setInterval(Life.nextGeneration, Life.speed);
            else Life.timeout = setInterval(Life.nextGenerationRule30, Life.speed);
        }
    },

    /* Counts number of alive adjacent cells. */
    neighbourCount: function (y, x)
    {
        var count = 0,
            i,
            neighbourCells = new Array();
            neighbourCells = [ // Clockwise direction
                Life.prevGen[y][(x - 1 + Life.cellsX) % Life.cellsX],
                Life.prevGen[(y + 1 + Life.cellsY) % Life.cellsY][(x - 1 + Life.cellsX) % Life.cellsX],
                Life.prevGen[(y + 1 + Life.cellsY) % Life.cellsY][x],
                Life.prevGen[(y + 1 + Life.cellsY) % Life.cellsY][(x + 1 + Life.cellsX) % Life.cellsX],
                Life.prevGen[y][(x + 1 + Life.cellsX) % Life.cellsX],
                Life.prevGen[(y - 1 + Life.cellsY) % Life.cellsY][(x + 1 + Life.cellsX) % Life.cellsX],
                Life.prevGen[(y - 1 + Life.cellsY) % Life.cellsY][x],
                Life.prevGen[(y - 1 + Life.cellsY) % Life.cellsY][(x - 1 + Life.cellsX) % Life.cellsX]
            ];

        // If neighbour alive (true), add him up
        for (i = 0; i < neighbourCells.length; i++) {
            if (neighbourCells[i]) {
                count++;
            }
        }

        return count;
    },

    
    /* DESC: Returns Neighbourhood of the cell as array of cells.
       IN:   Integers as coordinates y,x.
       OUT:  Array of objects "Cell".
    */
    neighbours: function (y, x) {
        var i,
            j,
            array = new Array();

        for (j = y - 1; j < y + 2; j++) {
            for (i = x - 1; i < x + 2; i++) {
                if ((i > -1) && (j > -1) && (i < Life.cellsX) && (j < Life.cellsY))
                    if ((i == x) && (j == y)) continue;
                    else if (Life.nextGen[j][i]) array.push(new Cell(j,i,Life.nextGen[j][i]));
            }
        }
        return array;
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
                for (y = 0; y < Life.cellsY; y++) {
                    for (x = 0; x < Life.cellsX; x++) {
                        if (Life.prevGen[y][x]) {
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
            Life.nextGen[Life.yUpperLeft][Life.xUpperLeft + 1] = true;
            Life.nextGen[Life.yUpperLeft + 1][Life.xUpperLeft + 2] = true;
            Life.nextGen[Life.yUpperLeft + 2][Life.xUpperLeft] = true;
            Life.nextGen[Life.yUpperLeft + 2][Life.xUpperLeft + 1] = true;
            Life.nextGen[Life.yUpperLeft + 2][Life.xUpperLeft + 2] = true;

            //Lower right corner
            Life.nextGen[Life.yLowerRight][Life.xLowerRight] = true;
            Life.nextGen[Life.yLowerRight][Life.xLowerRight + 1] = true;
            Life.nextGen[Life.yLowerRight][Life.xLowerRight + 2] = true;
            Life.nextGen[Life.yLowerRight + 1][Life.xLowerRight] = true;
            Life.nextGen[Life.yLowerRight + 2][Life.xLowerRight + 1] = true;
        }

        Life.lifeExists = false;
        return;
    },

    getOrganisms: function () {
        var i,j,k,
            organism = new Object(),    // Stores cells
            visited = new Array(),      // "visited" is vector with live cells
            allOrganisms = new Array(); // Array with all organisms

        /* Organism object */
        organism.cells = new Array();
        organism.add = function(cell) {
            var found = false;
            for(var i = 0; i < this.cells.length; i++) {
                if(cmpCells(this.cells[i],cell)) {
                    found = true;
                }
            }
            if(!found) {
                this.cells.push(cell);
                return true;
            }
            else return false;
        }
        organism.clone = function () {
            var copy = this.constructor();
            for (var attr in this) {
                if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
            }
            return copy;
        }

        // Input: coordinates [y,x]
        // Output: Array of coordinates [y,x]
        organism.getClosestCell = function (y,x) {
            var distX,
                distY,
                distances = new Array(),
                minDistance,
                closestCells = new Array();
            for (var i = 0; i < this.cells.length; i++) {
                // Distance for every cell in organism from starting point
                distY =  y - this.cells[i].y;
                distX =  x - this.cells[i].x;
            
                // Find smallest distance (every cell has one distance)
                // Array "distances" preserves order of cells
                distances.push(Math.sqrt(Math.pow(distY,2) + Math.pow(distX,2)));
            }
            minDistance = Math.min.apply(null, distances);
            for (var i = 0; i < distances.length; i++) {
                if (minDistance === distances[i])
                    closestCells.push([this.cells[i].y,this.cells[i].x]);
            }

            // Choosing randomly one closest from all closest cells
            return closestCells[Graphics.getRandomInt(0, closestCells.length-1)];
        }

        // Initialising "visited" array
        for (j = 0; j < Life.cellsY; j++) {
            for (i = 0; i < Life.cellsX; i++) {
                if(Life.nextGen[j][i]) visited.push(new Cell(j,i,false));
            }
        }

        function addCellToOrganism(k) {
            var m,
                l = 0,
                nbs = new Array();          // Neighbours

            if (k < visited.length) {
                // If cell has not been visited and is alive 
                if (!visited[k].alive) { // reusing "alive" property to indicate if cell was visited (all cells are alive)
                    organism.add(new Cell(visited[k].y, visited[k].x, Life.nextGen[visited[k].y][visited[k].x])); // add cell to organism

                    // Cell has been processed (visited)
                    visited[k].alive = true;

                    // Finding live neighbours of the cell
                    nbs = Life.neighbours(visited[k].y, visited[k].x);

                    // Walking through neighbours
                    for (l = 0; l < nbs.length; l++) {
                        for (m = 0; m < visited.length; m++)
                            if (cmpCells(nbs[l], visited[m])) addCellToOrganism(m);
                    }
                }
            }
        }

        // Find organisms - walk through "visited"
        for (k = 0; k < visited.length; k++) {
            if(!visited[k].alive) addCellToOrganism(k);
            if (organism.cells.length > 0) {
                allOrganisms.push(organism.clone());
                organism.cells = new Array();
            }
        }

        return allOrganisms;
    },

    automaticSelection: function()
    {
    /**/// VARIABLE DECLARATION
        var i,
            j,
            x,
            y,
            count = 0,                          // Count of neighbours of the starting point
            coordinates = new Array(),          // Coordinates of starting point
            allOrganisms = new Array(),
            organismDistances = new Array(),
            closestOrganisms = new Array(),
            distY = 0,
            distX = 0,
            dist,
            minDist,
            cellCoordinates,
            endPoint;

        // Pattern definition
        var glider = [[0, 0], [0, 1], [0, 2], [1, 0], [2, 1]]; // North-West direction
        var smallFish = [[0, 1], [0, 4], [1, 0], [2, 0], [2, 4], [3, 0], [3, 1], [3, 2], [3, 3]]; // West direction
        var pattern; // New Pattern after rotation
        // Rotation matrix
        var R90 = [[0, -1], [1, 0]]; // 90 Degrees counterclockwise rotation

        // Clock-wise rotation
        //newGlider = R * glider; R is rotation matrix
        function rotate(R, pattern, repeat) {
            var i, j, y, x,
                newPattern = pattern;

            if (!repeat > 0) return pattern;

            for (j = 0; j < repeat; j++) {
                for (i = 0; i < newPattern.length; i++) { // [y,x]
                    y = newPattern[i][0];
                    x = newPattern[i][1];
                    newPattern[i][0] = R[1][0] * x + R[1][1] * y;
                    newPattern[i][1] = R[0][0] * x + R[0][1] * y;
                }
            }
            return newPattern;
        }
        function addToNextGen(pattern) {
            if(pattern.length > 0)
                for (i = 0; i < pattern.length; i++)
                    Life.nextGen[y + pattern[i][0]][x + pattern[i][1]] = true;
        }

    /**/// CODE
        // Update generation count
        stats.innerHTML = Life.generation;

        // Get starting point
        if (Life.startPoints.length == 0) return;
        while (Life.startPoints.length != 0) {
            coordinates = Life.startPoints.pop();

            y = coordinates[0];
            x = coordinates[1];
            // Exit if coordinates are out of canvas boundaries
            if ((x > (Life.cellsX - 3)) || (y > (Life.cellsY - 3)) || (x < 3) || (y < 3))
                continue;

            // Detect alive neigbours of starting point, OR count = Life.neighbourCount(x, y);
            for (j = y - 1; j < y + 2; j++) {
                for (i = x - 1; i < x + 2; i++) {
                    if ((i > -1) && (j > -1) && (i < Life.cellsX) && (j < Life.cellsY)) {
                        if (i == x && j == y) continue;
                        if (Life.nextGen[j][i])
                            count++
                    }
                }
            }
            
            // If all neighbours are dead, we can draw pattern
            if (count != 0) continue;

        /**/// GET CLOSEST ORGANISM TO STARTING POINT
            // Get all organisms
            allOrganisms = Life.getOrganisms();

            // Preventing the Pattern creation when Universe is dead
            if (!(allOrganisms.length > 0)) continue;

            // Extracting organism distances (distance between starting point and closest organism cell)
            for (i = 0; i < allOrganisms.length; i++) {
                cellCoordinates = allOrganisms[i].getClosestCell(y, x);
                distY = y - cellCoordinates[0];
                distX = x - cellCoordinates[1];
                dist = Math.sqrt(Math.pow(distY, 2) + Math.pow(distX, 2));
                organismDistances.push(dist);
            }
            // Finding minimal distance
            minDist = Math.min.apply(null, organismDistances);
            // Selecting organisms with minimal distance to starting point
            // (Possible optimisation: get coordinates of the closest cell from organism and save them in array)
            for (i = 0; i < organismDistances.length; i++) {
                if (minDist === organismDistances[i])
                    closestOrganisms.push(allOrganisms[i]);
            }

            // Choosing randomly one closest organism
            endPoint = closestOrganisms[Graphics.getRandomInt(0, closestOrganisms.length - 1)].getClosestCell(y, x);

            // Determine the direction, dp stands for directionPoint (vector), [y,x]
            // and rotate patterns
            var dp = [endPoint[0] - y, endPoint[1] - x];

            if (dp[0] < 0 && dp[1] < 0) pattern = glider;               // North-West
            if (dp[0] < 0 && dp[1] > 0) pattern = rotate(R90, glider, 1); // North-East
            if (dp[0] > 0 && dp[1] > 0) pattern = rotate(R90, glider, 2); // South-East
            if (dp[0] > 0 && dp[1] < 0) pattern = rotate(R90, glider, 3); // South-West

            if (dp[0] === 0 && dp[1] < 0) pattern = smallFish;               // West
            if (dp[0] < 0 && dp[1] === 0) pattern = rotate(R90, smallFish, 1); // North
            if (dp[0] === 0 && dp[1] > 0) pattern = rotate(R90, smallFish, 2); // East
            if (dp[0] > 0 && dp[1] === 0) pattern = rotate(R90, smallFish, 3); // South

        /**/// SEND GLIDER OR LIGHTWEIGHT SPACESHIP WITH THE RIGHT ROTATION TOWARDS THE CLOSEST ORGANISM

            // Redraw the starting point to make it the same color as other live cells in given mode
            Graphics.drawCell(y, x, true, false);
            Life.nextGen[y][x] = false;

            addToNextGen(pattern);
        }

        // All starting points have been drawn, removing starting points
        Life.startPoints = new Array();
    },

    /* Produces next state. */
    nextGeneration: function ()
    {
        var x,
            y,
            count;

        Life.generation++;

        // Next generation is the same as previous
        for (y = 0; y < Life.cellsY; y++) 
        {
            for (x = 0; x < Life.cellsX; x++)
            {
                Life.nextGen[y][x] = Life.prevGen[y][x];
            }
        }

        // Computing Conway's GoL next generation
        for (y = 0; y < Life.cellsY; y++) 
        {
            for (x = 0; x < Life.cellsX; x++)
            {
                count = Life.neighbourCount(y, x);

                // Game of Life rules
                if (Life.prevGen[y][x])                 // A live cell with two or three live neighbors stays alive (survival)
                {
                    if (count < 2 || count > 3)         // (live cell dies if no. of neighbours is not 2 or 3)
                    {
                        Life.nextGen[y][x] = false;
                    }
                } else if (count === 3) {               // A dead cell with exactly three live neighbors becomes a live cell (birth).
                    Life.nextGen[y][x] = true;          // (otherwise dead cell stays dead cell)
                }
            }
        }

        // Adding life forms to next generation
        if (Life.radios[1].checked) //'userRadioBtn'
            Life.userSelection();
        else if (Life.radios[2].checked) // 'automaticRadioBtn'
            Life.automaticSelection();
        else stats.innerHTML = Life.generation;

        Graphics.smartPaint();

        // Forgetting previous generation (previous gen becomes current)
        for (y = 0; y < Life.cellsY; y++) 
        {
            for (x = 0; x < Life.cellsX; x++)
            {
                Life.prevGen[y][x] = Life.nextGen[y][x];
            }
        }
    },

    nextGenerationRule30: function () {
        var x,
            y = Life.generation,
            intval;
		
		// Stopping drawing after reaching end of canvas
        if ((y + 1) >= Life.cellsY) {
            Life.alive = false;
            clearInterval(Life.timeout);
            $('#startRule30').text('Start rule 30');
            Life.generation = 0;
            $('#statsRule30').text(Life.generation + 1);
            return;
        }

        for (x = 1; x < Life.cellsX - 1; x++) {
            intval = Life.prevGen[y][x - 1] << 2 | Life.prevGen[y][x] << 1 | Life.prevGen[y][x + 1];
            switch (intval) {
                // Birth
                case 1: // 001
                case 4: // 100
                    // Survival
                case 2: // 010
                case 3: // 011
                    Life.prevGen[y + 1][x] = true;
                    break;
                default:
                    Life.prevGen[y + 1][x] = false;
            }
        }

        // Advance generation
        Life.generation++;
        Graphics.paintNextLine(Life.generation);
        $('#statsRule30').text(Life.generation + 1);
    },

    // Parses files in Run Length Encoded Format
    // http://www.conwaylife.com/wiki/RLE
    loadPattern:   function (url) {
        var g = Graphics,
            l = Life;

        $.ajax({
            url: url,
            success: function (data) {
                var rpattern = RegExp(/x\s=\s(\d*).*?y\s=\s(\d*).*[\r\n]([^]*)!/),
                    match =  data.match(rpattern),
                    x,
                    y,
                    xPattern,      // Pattern dimensions
                    yPattern,
                    pattern,       // Remove whitespace
                    lines,
                    i,
                    j,
                    line,
                    length,
                    cellsX,        // Canvas dimensions
                    cellsY,
                    spinnerX = $("#spinnerX").spinner(),
                    spinnerY = $("#spinnerY").spinner();

                if (match === null) {
                    Graphics.printMessage(Math.floor(window.innerHeight / 2),
                                          Math.floor(window.innerWidth / 2),
                                          "Error loading pattern.", "red");
                    return;
                }

                xPattern = parseInt(match[1], 10);      // Pattern dimensions
                yPattern = parseInt(match[2], 10);
                pattern = match[3].replace(/\s+/g, ""); // Remove whitespace
                lines = pattern.split('$');
                
                // Setting size of the canvas
                if (parseInt(spinnerX.spinner('value'),10) > xPattern)
                    cellsX = parseInt(spinnerX.spinner('value'),10);
                else
                    cellsX = xPattern;
                if (parseInt(spinnerY.spinner('value'),10) > yPattern)
                    cellsY = parseInt(spinnerY.spinner('value'),10);
                else
                    cellsY = yPattern;

                // Updating spinner controls
                $("#spinnerX").spinner('value', cellsX);
                $("#spinnerY").spinner('value', cellsY);

                Life.initUniverse(cellsY, cellsX);

                // For too big canvas size, the canvas will become scrollable
                if ((cellsX > screen.availWidth) || (cellsY > screen.availWidth))
                    canvas.style.overflow = 'scroll';

                // Move pattern to the middle of the screen (subtracting pattern dimension)
                // minus one, because array index starts from 0
                x = Math.floor(Life.cellsX / 2) - Math.floor(xPattern / 2) -1;
                y = Math.floor(Life.cellsY / 2) - Math.floor(yPattern / 2) -1;

                for (i = 0; i < lines.length; i++) {
                    y++;
                    x = Math.floor(Life.cellsX / 2) - Math.floor(xPattern/2) -1;
                    line = lines[i];
                    while (line) {
                        if (line.charAt(0) === 'o' || line.charAt(0) === 'b') {
                            if (line.charAt(0) === 'o') {
                                Life.prevGen[y][x] = true;
                                Graphics.drawCell(y, x, true, false);
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
                                    Life.prevGen[y][x + j] = true;
                                    Graphics.drawCell(y, x + j, true, false);
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
       
        // Setting both generations to dead state
        for (y = 0; y < Life.cellsY; y++) 
        {
            for (x = 0; x < Life.cellsX; x++)
            {
                Life.nextGen[y][x] = false;
                Life.prevGen[y][x] = false;
                Graphics.drawCell(y, x, Life.nextGen[y][x], false);
            }
        }
        Life.generation = 0;

        if (Life.cgolOn) {
            stats.innerHTML = Life.generation;
        }
        else {
            $('#statsRule30').text(Life.generation + 1);
        }

        // Set values for function "Life.userSelection"
        Life.xUpperLeft = 0;
        Life.yUpperLeft = 0;
        Life.xLowerRight = Life.cellsX - Life.gliderSize;
        Life.yLowerRight = Life.cellsY - Life.gliderSize;

        Life.lifeExists = false;
    }

}
