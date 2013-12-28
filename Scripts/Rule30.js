$(document).ready(function () {
    var startValue = 'Start rule 30';
    var stopValue = 'Stop rule 30';

    // Creating tabs
    $("#rule30tabs").tabs();

    /* START HOME > CONTROLS */
    $('#startRule30').click(function () {
        var text = $(this).text();
        if (text === startValue)
            $(this).text(stopValue);
        else $(this).text(startValue);
        Life.cgolOn = false;
        Life.toggleLife();
    });

    $('#nextGenRule30').click(function () {
        Life.cgolOn = false;
        if (Life.generation >= Life.cellsY) return;
        // Compute next generation
        Life.nextGenerationRule30();
    });

    $('#clearRule30').click(function () {
        Life.clearUniverse();
    });
    /* STOP HOME > CONTROLS */

    /* START HOME > SPEED > SLIDER-SPEED */
    // Initializing slider
    $("#sliderSpeedRule30").slider({
        range: "min",
        value: 90,
        min: 1,
        max: 100,
        slide: function (event, ui) {
            $("#inputSpeedRule30").val(ui.value);
        },
        change: function (event, ui) {
            var val = $(this).slider("value");
            Life.changeSpeed(val);
        }
    });
    // Setting initial value for input speed control
    $("#inputSpeedRule30").val(
        function () {
            var val = $("#sliderSpeedRule30").slider("value");
            Life.changeSpeed(val);
            return val;
        });
    // Updating slider from input speed control
    $("#inputSpeedRule30").keypress(
    	function (e) {
    	    var code = e.keyCode || e.which;
    	    var val = $("#inputSpeedRule30").val();
    	    if (code === 13) {
    	        $("#sliderSpeedRule30").slider('value', val);
    	        Life.changeSpeed(val);
    	    }
    	}
    );
    // Changing input background color
    $("#inputSpeedRule30").css({ 'background-color': '#eeeeee' });
    $("#inputSpeedRule30").focus(
    function () {
        $(this).css({ 'background-color': '#FFFFEEE' });
    });
    $("#inputSpeedRule30").blur(
    function () {
        $(this).css({ 'background-color': '#eeeeee' });
    });
    /* END HOME > SPEED > SLIDER-SPEED */

    // Creating dialog window "Conway's game of life"
    /* https://github.com/ROMB/jquery-dialogextend */
    $(function () {
        $("#rule30")
        .dialog({
            "title": "Wolfram's Rule 30",
            "maxWidth": 750,
            "maxHeight": 190,
            "width": 750,
            "height": 190,
            "minWidth": 300,
            "minHeight": 190,
            "position": ['middle', 10]
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
            "load": function (evt, dlg) {
                $("#rule30").dialogExtend("minimize");
            },
            "collapse": function (evt, dlg) {
                var rule30State = $("#cgol").dialogExtend("state");
                if (rule30State === 'normal' || rule30State === 'collapsed')
                    $("#rule30").dialogExtend("minimize");
            },
            "restore": function (evt, dlg) {
                // Minimize window if Conway's game of life window is open
                var rule30State = $("#cgol").dialogExtend("state");
                if (rule30State === 'normal' || rule30State === 'collapsed')
                    $("#rule30").dialogExtend("minimize");
                // Window restored, execute code below:
                // Set generation to one
                Life.generation = 0;
                $('#statsRule30').text(Life.generation + 1);
                // Set speed from control, because Conway's game of life control could change it
                var val = $("#sliderSpeedRule30").slider("value");
                Life.changeSpeed(val);
                // Remove dark coloring
                $(this).parents(".ui-dialog:first").removeClass("darkHive");
            },
            "minimize": function (evt, dlg) {
                if (Life.alive && !Life.cgolOn)
                    $(this).parents(".ui-dialog:first").addClass("darkHive");
            }
        });
    });
});