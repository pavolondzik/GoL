// Check DOM state; if ready(complete), run initUniverse
var cellsX;
var cellsY;

$('document').ready(function () {

    var spinnerX = $("#spinnerX").spinner();
    var spinnerY = $("#spinnerY").spinner();

    spinnerX.spinner({ min: 4, max: 100 }).val(80);
    spinnerY.spinner({ min: 4, max: 50 }).val(40);

    cellsX = spinnerX.spinner('value');
    cellsY = spinnerY.spinner('value');

    Life.initUniverse(cellsX, cellsY);
});

$("#spinnerX").spinner({
    spin: function (event, ui) {
        cellsX = $(this).spinner('value');
        Life.initUniverse(cellsX, cellsY);
    }
});

$("#spinnerY").spinner({
    spin: function (event, ui) {
        cellsY = $(this).spinner('value');
        Life.initUniverse(cellsX, cellsY);
    }
});

var start_value = 'Start Life';
var stop_value = 'Stop Life';
var startButton = document.getElementById('start');
var minusButton = document.getElementById('minus');
var plusButton = document.getElementById('plus');
var nextGenButton = document.getElementById('nextGen');
var clearUniverseButton = document.getElementById('clear');
var displayModeSelect = document.getElementById('displayMode');

startButton.onclick = function () {
    if (startButton.innerHTML === start_value) {
        startButton.innerHTML = stop_value;
    } else {
        startButton.innerHTML = start_value;
    }
    Life.toggleLife();
};

minusButton.onclick = function () {
    Life.changeSpeed(false);
    document.getElementById('speed').innerHTML = 100 - (Life.speed / 10);
};

plusButton.onclick = function () {
    Life.changeSpeed(true);
    document.getElementById('speed').innerHTML = 100 - (Life.speed / 10);
};

nextGenButton.onclick = function () {
    Life.nextGen();
};

clearUniverseButton.onclick = function () {
    Life.clearUniverse();
};

displayModeSelect.onchange = function () {
    var index = displayModeSelect.selectedIndex;
    var options = displayModeSelect.options;
    var mode = ModeEnum.RECT;
    switch (options[index].value) {
        case 'RECT':
            mode = ModeEnum.RECT;
            break;
        case 'CIRCLE':
            mode = ModeEnum.CIRCLE;
            break;
        default:
            mode = ModeEnum.RECT;
            break;
    }
    Graphics.changeMode(mode);
};
