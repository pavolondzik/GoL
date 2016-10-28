$(document).ready(function () {
    $("#Container.hidden").removeClass("hidden");

    var startLife = 'Start Life';
    var stopLife = 'Stop Life';

    // Initial canvas size
    var initHeight = Math.floor(window.innerHeight / 10);
    var initWidth = Math.floor(window.innerWidth / 10);
    
    // Creating tabs
    $("#tabs").tabs();
    
    // Setting Universe dimensions
    var spinnerX = $("#spinnerX").spinner({ min: 20, max: 200 }).val(initWidth);
    var spinnerY = $("#spinnerY").spinner({ min: 20, max: 200 }).val(initHeight);

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
        if (text === startLife)
            $(this).text(stopLife);
        else $(this).text(startLife);
        Life.cgolOn = true;
        Life.toggleLife();
    });

    $('#nextGen').click(function () {
        Life.cgolOn = true;
        Life.nextGeneration();
    });

    $('#clear').click(function () {
        Life.clearUniverse();
    });
/* STOP HOME > CONTROLS */

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

/* START PATTERNS > PATTERNS */
    // Loading pattern
    $('#patterns').change(function () {
        $('#patterns option:selected').each(function () {
            url = $(this).val();
            if (url) {
                Life.loadPattern(url);
            }
        }
    }));
/* STOP PATTERNS > PATTERNS */

    // Creating dialog window "Conway's game of life"
    /* https://github.com/ROMB/jquery-dialogextend */
    $(function () {
        $("#cgol")
        .dialog({
            "title": "Conway's game of life",
            "maxWidth": 1010,
            "maxHeight": 190,
            "width": 1010,
            "height": 190,
            "minWidth": 300,
            "minHeight": 190,
            "position": ['middle', 'bottom']
        })
        .dialogExtend({
            "closable": false,
            "collapsable": true,
            "minimizable": true,
            "dblclick": "minimize",
            "icons": {
                "collapse": "ui-icon-triangle-1-s",
                "minimize": "ui-icon-circle-minus"
            },
            "load": function (evt, dlg) { },
            "collapse": function (evt, dlg) {
                var rule30State = $("#rule30").dialogExtend("state");
                if (rule30State === 'normal' || rule30State === 'collapsed')
                    $("#cgol").dialogExtend("minimize");
            },
            "restore": function (evt, dlg) {
                var rule30State = $("#rule30").dialogExtend("state");
                if (rule30State === 'normal' || rule30State === 'collapsed')
                    $("#rule30").dialogExtend("minimize");
                // Updating speed from control, because rule 30 has changed speed
                var val = $("#slider-speed").slider("value");
                Life.changeSpeed(val);
                $(this).parents(".ui-dialog:first").removeClass("darkHive");
            },
            "minimize": function (evt, dlg) {
                if (Life.alive && Life.cgolOn)
                    $(this).parents(".ui-dialog:first").addClass("darkHive");
            }
        });
    });

});