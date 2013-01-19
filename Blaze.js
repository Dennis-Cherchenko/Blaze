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
        if ($(event.target).attr("id") === "radio5") {
            $("#effect").show("scale", {}, 500);
        } else {
            $("#effect").hide("fade", {}, 500);
        }

        return false;
    });

    var c = document.getElementById("canvasX").getContext("2d");

    canvas = {
        height: 600,
        width: 600,
        cellSize: 15,
    }
    earth = {
        color: "#5C3D1F",
    }
    fire = {
        color: "red",
        columnCount: 0,
    }
    water = {
        color: "blue",
        count: 0,
        limit: null,
    }
    trees = {
        burned: 0,
        burnedColor: "red",
        color: "green",
        count: 0,
    }
    var trees_array = new Array();
    var fire_array = new Array();
    var water_array = new Array();

    function initialize() {
        createEarthTreesFire();
        water.limit = $("#slider").slider("option", "value");
        setInterval(Blaze, 500);
    }

    function createEarthTreesFire() {
        c.fillStyle = earth.color;
        c.fillRect(0, 0, canvasX.height, canvasX.width);
        c.stroke();
        for (i = 0; i < 50; i++) {
            for (z = 0; z < 50; z++) {
                var x = Math.floor((Math.random() * 100) + 1);
                if (x % 2 === 0) {
                    if (i === 0) {
                        paintCell(i, z, fire.color);
                        fire_array.push({
                            x: i,
                            y: z,
                        });
                    } else {
                        paintCell(i, z, trees.color);
                        trees_array.push({
                            x: i,
                            y: z,
                        });
                        trees.count++;
                    }
                }
            }
        }
    }

    function paintCell(x, y, color) {
        c.fillStyle = color;
        c.fillRect(x * canvas.cellSize + 1, y * canvas.cellSize + 1, canvas.cellSize - 2, canvas.cellSize - 2);
        c.stroke();
    }

    c.addEventListener("mousedown", function (evt) {
        if (waterCount < waterCountLimit) {
            var c = document.getElementById("canvasX").getContext("2d");
            var mousePos = getMousePos(canvas, evt);
            var x = (mousePos.x - (mousePos.x % canvas.cellSize)) / canvas.cellSize;
            var y = (mousePos.y - (mousePos.y % canvas.cellSize)) / canvas.cellSize;
            water_array.push({
                x: x,
                y: y
            });
            for (i = 0; i < trees_array.length; i++) {
                if (trees_array[i].x === x && trees_array[i].y === y) {
                    trees_array[i].x = 0;
                    trees_array[i].y = 0;
                }
            }
            paintCell("blue", canvas.cellSize * x, canvas.cellSize * y);
            waterCount++;
            $("#waterRemaining").text("Water Remaining: " + Math.round(((1 - (waterCount / waterCountLimit)) * 100)) + "%");
        }
    }, false);

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }


    function Blaze() {
    	for (i = 0; i < trees_array.length; i++) {
            paintCell(trees_array[i].x, trees_array[i].y, trees.color);
        }
        for (i = 0; i < fire_array.length; i++) {
            paintCell(fire_array[i].x, fire_array[i].y, fire.color);
        }
        for (i = 0; i < fire_array.length; i++) {
            for (z = 0; z < trees_array.length; z++) {
                //Fire goes up
                if ((fire_array[i].x === trees_array[z].x) && (fire_array[i].y - 1 === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
                //Fire goes down
                if ((fire_array[i].x === trees_array[z].x) && (fire_array[i].y + 1 === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
                //Fire goes left
                if ((fire_array[i].x - 1 === trees_array[z].x) && (fire_array[i].y === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
                //Fire goes right
                if ((fire_array[i].x + 1 === trees_array[z].x) && (fire_array[i].y === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
                //Fire goes diagonal up left
                if ((fire_array[i].x - 1 === trees_array[z].x) && (fire_array[i].y - 1 === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
                //Fire goes diagonal up right
                if ((fire_array[i].x + 1 === trees_array[z].x) && (fire_array[i].y - 1 === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
                //Fire goes diagonal down left
                if ((fire_array[i].x - 1 === trees_array[z].x) && (fire_array[i].y + 1 === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
                //Fire goes diagonal down right
                if ((fire_array[i].x + 1 === trees_array[z].x) && (fire_array[i].y + 1 === trees_array[z].y) && fire_array[i].x < fire.columnCount) {
                    burned(z);
                }
            }
        }
        $("#treesBurned").text("Forest burned: " + Math.round(((fire_array.length / trees.count) * 100) + "%"));
        fire.columnCount ++;
    }

    function burned(z) {
        fire_array.push({
            x: trees_array[z].x,
            y: trees_array[z].y
        });
        trees_array[z] = {
            x: 0,
            y: 0
        };
        treesBurned++;
    }
});