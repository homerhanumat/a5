/*************************************************************
 *
 * Homer White
 * Assignment 5 Script
 * a5.js
 *
 *
 ************************************************************/

// main handler function:
function mainHandler() {

    /*************************************************
     * Set up house
     *************************************************/

    function formatNumber(x) {
        if ( x === Math.round(x) ) {
            return x;
        } else {
            return x.toFixed(2);
        }
    }

    // we can set canvas dimensions here:
    var boardWidth = 300;
    var boardHeight = 300;

    // initialize canvas:
    var canvas = document.querySelector("canvas");
    //canvas.offsetWidth = boardWidth;
    //canvas.offsetHeight = boardHeight;
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";

    // need to know location of canvas in window:
    var board = canvas.getBoundingClientRect();

    // set up fields and set maxima for input fields:
    var widthField = document.getElementById("width");
    widthField.max = boardWidth;
    var heightField = document.getElementById("height");
    heightField.max = boardHeight;
    var areaField = document.getElementById("area");
    var perimeterField = document.getElementById("perimeter");

    // populate the warning element:
    var warning = document.getElementById("warning");
    warning.innerHTML = "<em>Width bounds:  0 to " + boardWidth +
        ".  Height bounds:  0 to " + boardHeight + ".</em>";

    // track whether or not user is drawing a rectangle
    // in the canvas:
    var dragging = false;

    // coordinates of "anchor" point (where user begins drawing):
    var anchorX;
    var anchorY;

    // track the first two arguments of the fillRect method:
    var leftX;
    var topY;

    // record the final two arguments of fillRect:
    var width = 0;
    var height = 0;

    // reset in case user resizes screen:
    window.addEventListener("resize",
        function() {
            board = canvas.getBoundingClientRect();
        });


    /***************************************************
     * User draws
     ***************************************************/

    // find whether mouse is inside the canvas:
    function inBoard(x, y) {
        var horizontalOK = (x >= board.left && x <= board.right);
        var verticalOK = (y >= board.top && x <= board.bottom);
        return horizontalOK && verticalOK;
    }


    canvas.addEventListener("mousedown", function(e) {

        dragging = true;
        document.querySelector("html").style.cursor = "crosshair";

        // prevent janky initial draw behavior stemming from
        // previous user input in fields
        width = 0;
        height = 0;

        // remove any leftover warning:
        warning.classList = "";

        var x= e.pageX;
        var y = e.pageY;
        if ( inBoard(x, y) ) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            leftX = x - board.left;
            anchorX = x;
            topY = y - board.top;
            anchorY = y;
            dragging = true;
            widthField.value = "";
            heightField.value = "";
            areaField.innerHTML = "";
            perimeterField.innerHTML = "";
        }

    });

    // refresh when user is not drawing:
    function clearVariables() {
        dragging = false;
        document.querySelector("html").style.cursor = "default";
        leftX = undefined;
        topY = undefined;
        anchorX = undefined;
        anchorY = undefined;
    }

    // stop drawing:
    window.addEventListener("mouseup", function() {
        if ( dragging ) {
            clearVariables();
        }
    });


    function updateCornerAndDims(x, y, ax, ay) {
        // anchor point relative to the canvas:
        var acx = ax - board.left;
        var acy = ay - board.top;
        // dragged point relative to canvas:
        var dcx = x - board.left;
        var dcy = y - board.top;
        // southeast of anchor:
        if ( x > ax && y > ay ) {
            leftX = acx;
            topY = acy;
            width = Math.min(x, board.right) - ax;
            height = Math.min(y, board.bottom) - ay;
        }
        // southwest of anchor:
        if ( x < ax && y > ay ) {
            leftX = Math.max(0, dcx);
            topY = acy;
            width = ax - Math.max(x, board.left);
            height = Math.min(y, board.bottom) - ay;
        }
        // northeast of anchor:
        if ( x > ax && y < ay ) {
            leftX = acx;
            topY =  Math.max(0, dcy);
            width = Math.min(x, board.right) - ax;
            height = ay - Math.max(y, board.top);
        }
        // northwest of anchor:
        if ( x < ax && y < ay ) {
            leftX = Math.max(0, dcx);
            topY =  Math.max(0, dcy);
            width = ax - Math.max(x, board.left);
            height = ay - Math.max(y, board.top);
        }
    }

    // update rectangle and computed area, as user drags:
    window.addEventListener("mousemove", function(e) {
        var x= e.pageX;
        var y = e.pageY;
        if ( dragging ) {
            updateCornerAndDims(x, y, anchorX, anchorY);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(leftX, topY, width, height);
            widthField.value = width.toFixed(2);
            heightField.value = height.toFixed(2);
            areaField.innerHTML = formatNumber(width * height);
            perimeterField.innerHTML = formatNumber(2*width + 2*height);
        }
    });

    /************************************************
     * User inputs the dimensions
     ************************************************/

    function inBounds(input, dim ) {
        return input >= 0 && input <= dim;
    }

    function widthAttemptCompute() {
        clearVariables();
        var inputWidth = this.value;
        var warning = document.getElementById("warning");
        if ( inBounds(inputWidth, boardWidth) ) {
            width = inputWidth;
            warning.classList = "";
        } else {
            warning.classList.add("active");
            width = undefined;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            areaField.innerHTML = "";
            perimeterField.innerHTML = "";
        }
        if ( width && height) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(0, 0, width, height);
            areaField.innerHTML = formatNumber(width * height);
            perimeterField.innerHTML = formatNumber(2*width + 2*height);
        }
    }

    widthField.addEventListener("input", widthAttemptCompute);


    function heightAttemptCompute() {
        clearVariables();
        var inputHeight = this.value;
        if ( inBounds(inputHeight, boardHeight) ) {
            height = inputHeight;
            warning.classList = "";
        } else {
            warning.classList.add("active");
            height = undefined;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            areaField.innerHTML = "";
            perimeterField.innerHTML = "";
        }
        if ( width && height) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(0, 0, width, height);
            areaField.innerHTML = formatNumber(width * height);
            perimeterField.innerHTML = formatNumber(2*width + 2*height);
        }
    }

    heightField.addEventListener("input", heightAttemptCompute);

}

/************************************************
 *
 * Register Main Handler
 *
 ***********************************************/

window.addEventListener("load", mainHandler);