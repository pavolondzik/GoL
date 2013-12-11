// Check DOM state; if ready(complete), run initUniverse
var cellsX;
var cellsY;

$('document').ready(function () {
    
    // Creating tabs
    $("#tabs").tabs();
    
    // Setting Universe dimensions
    var spinnerX = $("#spinnerX").spinner();
    var spinnerY = $("#spinnerY").spinner();

    spinnerX.spinner({ min: 4, max: 100 }).val(21);
    spinnerY.spinner({ min: 4, max: 50 }).val(21);

    cellsX = spinnerX.spinner('value');
    cellsY = spinnerY.spinner('value');

    Life.initUniverse(cellsX, cellsY);

    $('#patterns').change(function () {
        $('#patterns option:selected').each(function () {
            url = $(this).val();
            if (url) {
                Life.loadPattern(url);
            }
        });
    });

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
var automaticRadioButton = document.getElementById("automaticRadioBtn");

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
        case 'TRAIL':
            mode = ModeEnum.TRAIL;
            break;
        case 'TRAILNOGRID':
            mode = ModeEnum.TRAIL_NO_GRID;
            break;
        default:
            mode = ModeEnum.RECT;
            break;
    }
    Graphics.changeMode(mode);
};

var previouslyChecked = false;
$(":radio").bind("change", function (event) {
    if (automaticRadioButton.checked) {
        Graphics.randomPaint();
        // Listen to user's click - changing drawing procedure
        canvas.removeEventListener("mousedown", Graphics.getCell, false);
        canvas.addEventListener("mousedown", Graphics.getStartingPoint, false);
        previouslyChecked = true;
    }
    else {
        if (previouslyChecked) {
            canvas.removeEventListener("mousedown", Graphics.getStartingPoint, false);
            canvas.addEventListener("mousedown", Graphics.getCell, false);
            previouslyChecked = false;
        }
    }
});
