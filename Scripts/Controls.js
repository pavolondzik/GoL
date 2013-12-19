$(document).ready(function () {
    var start_value = 'Start Life';
    var stop_value = 'Stop Life';
    
    // Creating tabs
    $("#tabs").tabs();
    
    // Setting Universe dimensions
    var spinnerX = $("#spinnerX").spinner({ min: 20, max: 100 }).val(80);
    var spinnerY = $("#spinnerY").spinner({ min: 20, max: 100 }).val(40);

    var SpinnerCellsX = parseInt(spinnerX.val(),10);
    var SpinnerCellsY = parseInt(spinnerY.val(),10);

    // Initializing universe with dimensions
    Life.initUniverse(SpinnerCellsY, SpinnerCellsX);

/* START GRAPHICS > SIZE > SPINNER */
    spinnerX.spinner({
        spin: function (event, ui) {
            SpinnerCellsX = parseInt(ui.value,10);
            Life.initUniverse(SpinnerCellsY, SpinnerCellsX);
        }
    });
    spinnerX.on("keypress", function (event, ui) {
        var code = event.keyCode || event.which;
        var val = parseInt($(this).spinner('value'),10);
        var min = parseInt($(this).spinner("option", "min"),10);
        var max = parseInt($(this).spinner("option", "max"),10);
        if (min <= val && max >= val) {
            SpinnerCellsX = val;
            if (code === 13) {
                $(this).spinner('value', SpinnerCellsX);
                Life.initUniverse(SpinnerCellsY, SpinnerCellsX);
            }
        }
    });

    spinnerY.spinner({
        spin: function (event, ui) {
            SpinnerCellsY = parseInt(ui.value,10);
            Life.initUniverse(SpinnerCellsY, SpinnerCellsX);
        }
    });
    spinnerY.on("keypress", function (event, ui) {
        var code = event.keyCode || event.which;
        var val = parseInt($(this).spinner('value'),10);
        var min = parseInt($(this).spinner("option", "min"),10);
        var max = parseInt($(this).spinner("option", "max"),10);
        if (min <= val && max >= val) {
            SpinnerCellsY = val;
            if (code === 13) {
                $(this).spinner('value', SpinnerCellsY);
                Life.initUniverse(SpinnerCellsY, SpinnerCellsX);
            }
        }
    });
/* STOP GRAPHICS > SIZE > SPINNER */

/* START HOME > CONTROLS */
    $('#start').click(function () {
        var text = $(this).text();
        if (text === start_value)
            $(this).text(stop_value);
        else $(this).text(start_value);
        Life.toggleLife();
    });

    $('#nextGen').click(function () {
        Life.nextGeneration()
    });

    $('#clear').click(function () {
        Life.clearUniverse();
    });
/* STOP HOME > CONTROLS */

/* START HOME > PATTERNS */
    // Loading pattern
    $('#patterns').change(function () {
        $('#patterns option:selected').each(function () {
            url = $(this).val();
            if (url) {
                Life.loadPattern(url);
            }
        });
    });
/* STOP HOME > PATTERNS */

/* START HOME > SPEED > SLIDER-SPEED */
    // Initializing slider
    $("#slider-speed").slider({
        range: "min",
        value: 90,
        min: 1,
        max: 100,
        slide: function (event, ui) {
            $("#input-speed").val(ui.value);
        },
        change: function (event, ui) {
            var val = $(this).slider("value");
            Life.changeSpeed(val);
        }
    });
    // Setting initial value for input "input-speed"
    $("#input-speed").val(
        function () {
            var val = $("#slider-speed").slider("value");
            Life.changeSpeed(val);
            return val;
    });
    // Updating slider from input "input-speed"
    $("#input-speed").keypress(
    	function (e) {
    	    var code = e.keyCode || e.which;
    	    var val = $("#input-speed").val();
    	    if (code === 13) {
    	        $("#slider-speed").slider('value', val);
    	        Life.changeSpeed(val);
    	    }
    	}
    );
    // Changing input background color
    $("#input-speed").css({ 'background-color': '#eeeeee' });
    $("#input-speed").focus(
    function () {
        $(this).css({ 'background-color': '#FFFFEEE' });
    });
    $("#input-speed").blur(
    function () {
        $(this).css({ 'background-color': '#eeeeee' });
    });
/* END HOME > SPEED > SLIDER-SPEED */

/* START HOME > GRAPHICS > DISPLAY MODE */
    $('#displayMode').change(function () {
        var textMode = $(this).find(':selected').val();
        var mode = ModeEnum.RECT;

        switch (textMode) {
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
    });
/* STOP HOME >  GRAPHICS > DISPLAY MODE */

/* START HOME > SELECTION MODE > CREATE GLIDER  */
    var automaticRadioButton = document.getElementById("automaticRadioBtn");// Simple JS :-)
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
/* STOP HOME > SELECTION MODE > CREATE GLIDER  */
});