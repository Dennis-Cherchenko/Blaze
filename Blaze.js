$(function () {
    $("#slider").slider({
        value: 100,
        min: 1,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#amount").val(ui.value);
        }
    });
    $("input[type=submit], a, button")
        .button()
        .click(function (event) {
        initialize();
        event.preventDefault();
    });
    $("#amount").val($("#slider").slider("value"));
    $("#radio").buttonset().click(function (event) {
    	console.log(event.target);
    	if($(event.target).attr("id") === "radio5"){
    		$( "#effect" ).show( "scale", {}, 500);
    	}else{
    		$( "#effect" ).hide( "fade", {}, 500);
    	}

        return false;
    });
    //JqueryUI stuff above***********

    var canvasWidth = 600;
    var canvasHeight = 600;
    var cellWidth = 15;
    var waterCount = 0;
    var waterCountLimit;
    var canvas = document.getElementById("canvasX");
    var trees_array = [];
    var fire_array = [];
    var water_array = [];
    var fireCellProgressCount = 0;
    var treeCount = 0;
    var treesBurned = 0;

    function initialize() {
    	drawEarthAndGrid
        waterCountLimit = $("#slider").slider("option", "value");
        trees_array = [];
        fire_array = [];
        water_array = [];
        drawEarthAndGrid();
        createTreesAndStartTheFire();
        //Runs the Blaze function every second
        setInterval(Blaze, 500);
    }

    function drawEarthAndGrid() {
        var c = document.getElementById("canvasX").getContext("2d");
        c.fillStyle = "#5C3D1F";
        c.fillRect(0, 0, canvasX.height, canvasX.width);
        
    }

    canvas.addEventListener("mousedown", function (evt) {
        if (waterCount < waterCountLimit) {
            var c = document.getElementById("canvasX").getContext("2d");
            var mousePos = getMousePos(canvas, evt);
            var x = (mousePos.x - (mousePos.x % cellWidth)) / cellWidth;
            var y = (mousePos.y - (mousePos.y % cellWidth)) / cellWidth;
            water_array.push({
                x: x,
                y: y
            });
            for(i = 0; i < trees_array.length; i++){
            	if(trees_array[i].x === x && trees_array[i].y === y){
            		trees_array[i].x = 0;
            		trees_array[i].y = 0;
            	}
            }
            paintCell("blue", cellWidth * x, cellWidth * y  );
            waterCount++;
            $("#waterRemaining").text("Water Remaining: " + Math.round(((1 - (waterCount / waterCountLimit)) * 100)) + "%");        }
    }, false);

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function createTreesAndStartTheFire() {
        var c = document.getElementById("canvasX").getContext("2d");
        for (i = 0; i < 50 * cellWidth; i += cellWidth) {
            for (z = 0; z < 50 * cellWidth; z += cellWidth) {
                var x = Math.floor((Math.random() * 100) + 1);
                if (x % 2 === 0) {
                	if (i === 0) {
                    	paintCell("red", i,z);
                        fire_array.push({
                            x: i,
                            y: z
                        });
                    } else {
                    	paintCell("green", i, z);
                        trees_array.push({
                            x: i,
                            y: z
                        });
                        treeCount++;
                    }
                }
            }
        }
    }

    function drawTreesAndFire() {
        for (i = 0; i < trees_array.length; i++) {
            paintCell("green", trees_array[i].x, trees_array[i].y);
        }
        for (i = 0; i < fire_array.length; i++) {
        	paintCell("red", fire_array[i].x, fire_array[i].y);
        }
    }
    function neighbors(){
    	new_array = [];
    }

    function Blaze() {
        for (i = 0; i < fire_array.length; i++) {
            for (z = 0; z < trees_array.length; z++) {
                //Fire goes up
                if ((fire_array[i].x === trees_array[z].x) && (fire_array[i].y - cellWidth === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
                //Fire goes down
                if ((fire_array[i].x === trees_array[z].x) && (fire_array[i].y + cellWidth === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
                //Fire goes left
                if ((fire_array[i].x - cellWidth === trees_array[z].x) && (fire_array[i].y === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
                //Fire goes right
                if ((fire_array[i].x + cellWidth === trees_array[z].x) && (fire_array[i].y === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
                //Fire goes diagonal up left
                if ((fire_array[i].x - cellWidth === trees_array[z].x) && (fire_array[i].y - cellWidth === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
                //Fire goes diagonal up right
                if ((fire_array[i].x + cellWidth === trees_array[z].x) && (fire_array[i].y - cellWidth === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
                //Fire goes diagonal down left
                if ((fire_array[i].x - cellWidth === trees_array[z].x) && (fire_array[i].y + cellWidth === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
                //Fire goes diagonal down right
                if ((fire_array[i].x + cellWidth === trees_array[z].x) && (fire_array[i].y + cellWidth === trees_array[z].y) && fire_array[i].x < fireCellProgressCount) {
					treeIsBurned(z);
                }
            }
        }
        $("#treesBurned").text("Forest burned: " + Math.round( ((fire_array.length / treeCount) * 100) + "%" ));
        fireCellProgressCount += cellWidth;
    }
	function treeIsBurned(z){
        var c = document.getElementById("canvasX").getContext("2d");
		fire_array.push({
		    x: trees_array[z].x,
		    y: trees_array[z].y
		});
		trees_array[z] = {
		    x: 0,
		    y: 0
		};
		treesBurned++;
		paintCell("red", fire_array[i].x, fire_array[i].y);
	}
    function paintCell(color, x, y){
    	var c = document.getElementById("canvasX").getContext("2d");
    	c.beginPath();
        c.rect(x, y, cellWidth, cellWidth);
        c.fillStyle = color;
        c.fill();
        c.lineWidth = 0;
        c.strokeStyle = "black";
        c.stroke();
    }
});