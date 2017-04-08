var player, computer;
var computerNumTurns = 0;
var computerWins = 0;
var numTurns = 0;
//var ttcGrid = ["O","X","X","","","O","","","",""];
var ttcGrid = ["","","","","","","","","",""];
//var ttcGrid = ["","","O","","X","","O","","",""];

// eight possible winning rows
var winningPositions = [[1, 2, 3],[4, 5, 6],[7, 8, 9],[1, 4, 7],[2, 5, 8],[3, 6, 9],[1, 5, 9],[3, 5, 7]];
var MIN_X = 0;
var MIN_Y = 0;
var MAX_X = 2;
var MAX_Y = 2;

$(document).ready(function() {
    initApp();
});

// compare arrays:
function isSameSet( arr1, arr2 ) {
    return  $( arr1 ).not( arr2 ).length === 0 && $( arr2 ).not( arr1 ).length === 0;
}

/*
 * @function
 * @name Object.prototype.inArray
 * @description Extend Object prototype within inArray function
 *
 * @param {mix}    needle       - Search-able needle
 * @param {bool}   searchInKey  - Search needle in keys?
 *
 */
Object.defineProperty(Object.prototype, 'inArray',{
    value: function(needle, searchInKey){

        var object = this;

        if( Object.prototype.toString.call(needle) === '[object Object]' ||
            Object.prototype.toString.call(needle) === '[object Array]'){
            needle = JSON.stringify(needle);
        }

        return Object.keys(object).some(function(key){

            var value = object[key];

            if( Object.prototype.toString.call(value) === '[object Object]' ||
                Object.prototype.toString.call(value) === '[object Array]'){
                value = JSON.stringify(value);
            }

            if(searchInKey){
                if(value === needle || key === needle){
                    return true;
                }
            }else{
                if(value === needle){
                    return true;
                }
            }
        });
    },
    writable: true,
    configurable: true,
    enumerable: false
});

// is element visible
function isVisible(el) {
    return (el.offsetWidth > 0 && el.offsetHeight > 0);
}

function chooseXorO(e) {
    setPlayer(e.target.value);
    changeBlackboardTitle();

    setView("displayGrid-template");

    initializeWinCounter();

    slideUpDown('playerTurn');

    var board = document.getElementById("board");
    board.onclick = displayXOInCell;
}

function initializeWinCounter() {
    var blackboard = $(".blackboard.grid").attr('data-attr');
    /*
     var str = window.getComputedStyle(blackboard, '::before').getPropertyValue('content');
     document.styleSheets[3].addRule('.blackboard.grid::before','content: "' + str + computerWins + '"');
     document.styleSheets[3].insertRule('.blackboard.grid::before { content: "' + str + computerWins + '" }', 0);
     */
    var winsCounter = blackboard + computerWins;
    $(".blackboard.grid").attr('data-attr', winsCounter);
}

function incrementWinCounter() {
    var blackboard = $(".blackboard.grid").attr('data-attr');
    var previousCountRemoved = blackboard.substring(0, --blackboard.length);

    var currWinsCount = previousCountRemoved + computerWins;
    $(".blackboard.grid").attr('data-attr', currWinsCount);
}

function initApp() {
    setView("displayXOrO-template");

    var xBtn = document.getElementById("xBtn");
    var oBtn = document.getElementById("oBtn");

    xBtn.onclick = chooseXorO;
    oBtn.onclick = chooseXorO;
}

function setView(htmlTemplate) {
    var blackboard = document.querySelector(".blackboard");

    var template = document.getElementById(htmlTemplate).innerHTML;
    var compiled = Handlebars.compile(template);

    blackboard.innerHTML = compiled();
    /*if (callback) {
        callback('playerTurn');
    }*/
}

function addView(htmlTemplate) {
    var blackboard = document.querySelector(".blackboard");

    var template = document.getElementById(htmlTemplate).innerHTML;
    var compiled = Handlebars.compile(template);

    //blackboard.innerHTML = compiled();
    $(".blackboard").append(compiled());
    /*if (callback) {
     callback('playerTurn');
     }*/
}

function setPlayer(xOrO) {
    player = xOrO;
    if (xOrO === 'X') {
        computer = 'O';
    }
    else {
        computer = 'X';
    }
}

function changeBlackboardTitle() {
    var blackboard = document.querySelector(".blackboard");

    if (blackboard.classList) {
        blackboard.classList.add('grid');
    } else {
        blackboard.className += ' ' + 'grid';
    }
}

function displayXOInCell(e) {
    if (e.target !== e.currentTarget) {
        var clickedCell = e.target;
        numTurns++;

        if (!clickedCell.getAttribute('value')) {
            clickedCell.setAttribute('value', player);
            clickedCell.textContent = player;

            ttcGrid[mapGridSelectionToArrayElement(clickedCell.id)] = player;

            if (numTurns < 9) {
                $('#playerTurn').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", slideComputersTurn);
                $('#computerTurn').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", computersTurn);
                $('#computerTurn.slide').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", slidePlayersTurn);
                slideUpDown('playerTurn');
            }
            else if (numTurns >= 9) {
                console.log("It was a draw");
                $('#playerTurn').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", slideComputersTurn);
                $('#computerTurn').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", computersTurn);
                $('#computerTurn.slide').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", slidePlayersTurn);
                slideUpDown('playerTurn');
                $('#board').fadeTo(600, 0.2, displayLose);
            }
        }
    }
    e.stopPropagation();
}

function slideUpDown(slider, callback){
    /*if($("#" + slider).is(":hidden")){
        $("#" + slider).slideDown('slow');
    }
    else{
        $("#" + slider).slideUp('slow');
    }*/
    //$("#" + slider).slideToggle('slow');
    //$("#" + slider).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", computersTurn());
    var slide = document.getElementById(slider);
    if (!slide.classList.contains('slide')) {
        slide.classList.add('slide');
    } else {
        slide.classList.remove('slide');
    }

    if (callback) {
        callback();
    }
}

function slideComputersTurn() {
    var slide = document.getElementById('computerTurn');
    if (!slide.classList.contains('slide')) {
        slide.classList.add('slide');
    } else {
        slide.classList.remove('slide');
    }
}

function slidePlayersTurn() {
    var slide = document.getElementById('playerTurn');
    if (!slide.classList.contains('slide')) {
        slide.classList.add('slide');
    } else {
        slide.classList.remove('slide');
    }

}

function isEqual(element, index, array) {
    return ttcGrid[element] === computer;
}

function getThreeInARow(winningPosition) {

    var winningArray;
    for (var i = 0; i < winningPositions.length; i++) {
        if (winningPositions[i].inArray(winningPosition)) {
            if (winningPositions[i].every(isEqual)) {
                winningArray = winningPositions[i];
            }
        }
    }
    return winningArray;
}

function computersTurn() {
    var computerChosenCell;
    var winningPosition, blockPosition, forkingPosition, winningRow;

    if (getThirdCellIfAvailableWhenComputerHasTwoInARow()) {
        winningPosition = getThirdCellIfAvailableWhenComputerHasTwoInARow();
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(winningPosition));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[winningPosition] = computer;
        // TODO: end game
        winningRow = getThreeInARow(winningPosition);
        for (var i = 0; i < winningRow.length; i++) {
            computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(winningRow[i]));
            computerChosenCell.style.color = 'rgba(0, 200, 200, 0.98)';
            computerChosenCell.style.backgroundColor = 'white';
        }
        computerWins++;
        incrementWinCounter();
    }
    else if (getThirdCellIfAvailableWhenPlayerHasTwoInARow()) {
        blockPosition = getThirdCellIfAvailableWhenPlayerHasTwoInARow();
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(blockPosition));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[blockPosition] = computer;
    }
    else if (getCellToCreateAForkForComputer()) {
        forkingPosition = getCellToCreateAForkForComputer();
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(forkingPosition));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[forkingPosition] = computer;
    }
    else if (computerNumTurns === 1 && ((ttcGrid[1] && ttcGrid[9]) || (ttcGrid[3] && ttcGrid[7]))) {
        computerChosenCell = document.getElementById('two');
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[2] = computer;
    }    
    else if (getCellToPreventAForkForComputer()) {
        forkingPosition = getCellToPreventAForkForComputer();
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(forkingPosition));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[forkingPosition] = computer;
    }
    else if (!ttcGrid[5]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(5));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[5] = computer;
    }
    // play opposite corner of opponent
    else if (ttcGrid[1] === player && !ttcGrid[9]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(9));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[9] = computer;
    }
    else if (ttcGrid[3] === player && !ttcGrid[7]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(7));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[7] = computer;
    }
    else if (ttcGrid[7] === player && !ttcGrid[3]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(3));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[3] = computer;
    }
    else if (ttcGrid[9] === player && !ttcGrid[1]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(1));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[1] = computer;
    }
    else if (!ttcGrid[1]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(1));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[1] = computer;
    }
    else if (!ttcGrid[3]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(3));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[3] = computer;
    }
    else if (!ttcGrid[7]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(7));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[7] = computer;
    }
    else if (!ttcGrid[9]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(9));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[9] = computer;
    }
    else if (!ttcGrid[2]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(2));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[2] = computer;
    }
    else if (!ttcGrid[4]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(4));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[4] = computer;
    }
    else if (!ttcGrid[6]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(6));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[6] = computer;
    }
    else if (!ttcGrid[8]) {
        computerChosenCell = document.getElementById(mapArrayPosToHtmlGrid(8));
        computerChosenCell.setAttribute('value', computer);
        computerChosenCell.textContent = computer;
        ttcGrid[8] = computer;
    }
    computerNumTurns++;
    numTurns++;
    $('#playerTurn').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", slideComputersTurn);
    $('#computerTurn').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", computersTurn);
    if (winningPosition) {
        $('#computerTurn.slide').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", slidePlayersTurn);
        $('#board').fadeTo(600, 0.2, displayLose);
    }
    else {
        $('#computerTurn.slide').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", slidePlayersTurn);
    }

    slideComputersTurn();
}

function displayLose() {
    //setView("displayLose-template");

    // reset grid to empty values


    setView("displayGrid-template");
    ttcGrid = ["","","","","","","","","",""];
    computerNumTurns = 0;
    numTurns = 0;

    slideUpDown('playerTurn');

    var board = document.getElementById("board");
    board.onclick = displayXOInCell;
}

function mapGridSelectionToArrayElement(clickedCell) {
        var gridPosition;
        switch (clickedCell) {
            case 'one':
                gridPosition = 1;
                break;
            case 'two':
                gridPosition = 2;
                break;
            case 'three':
                gridPosition = 3;
                break;
            case 'four':
                gridPosition = 4;
                break;
            case 'five':
                gridPosition = 5;
                break;
            case 'six':
                gridPosition = 6;
                break;
            case 'seven':
                gridPosition = 7;
                break;
            case 'eight':
                gridPosition = 8;
                break;
            case 'nine':
                gridPosition = 9;
                break;
        }
        return gridPosition;
}

function mapArrayPosToHtmlGrid(pos) {
    var gridPosition;
    switch (pos) {
        case 1:
            gridPosition = 'one';
            break;
        case 2:
            gridPosition = 'two';
            break;
        case 3:
            gridPosition = 'three';
            break;
        case 4:
            gridPosition = 'four';
            break;
        case 5:
            gridPosition = 'five';
            break;
        case 6:
            gridPosition = 'six';
            break;
        case 7:
            gridPosition = 'seven';
            break;
        case 8:
            gridPosition = 'eight';
            break;
        case 9:
            gridPosition = 'nine';
            break;
    }
    return gridPosition;
    
}

function getThirdCellIfAvailableWhenComputerHasTwoInARow() {
    var thirdCell = 0;
    OUTER_LOOP: for (var x = 0; x <= MAX_X; x++) {
        for (var y = 0; y <= MAX_Y; y++) {
            thirdCell = checkNeighbouringCellsAndGetThirdSpaceIfAvailable(x, y, computer);
            // finish this strategy
            if (thirdCell) {
                break OUTER_LOOP;
            }
        }
    }

    return thirdCell;
}

function getThirdCellIfAvailableWhenPlayerHasTwoInARow() {
    var thirdCell = 0;
    OUTER_LOOP: for (var x = 0; x <= MAX_X; x++) {
        for (var y = 0; y <= MAX_Y; y++) {
            thirdCell = checkNeighbouringCellsAndGetThirdSpaceIfAvailable(x, y, player);
            // finish this strategy
            if (thirdCell) {
                break OUTER_LOOP;
            }
        }
    }

    return thirdCell;
}

function getCellToCreateAForkForComputer() {
    var thirdCell = 0;
    OUTER_LOOP: for (var x = 0; x <= MAX_X; x++) {
        for (var y = 0; y <= MAX_Y; y++) {
            thirdCell = checkNeighbouringCellsAndGetForkIfAvailable(x, y, computer);
            // finish this strategy
            if (thirdCell) {
                break OUTER_LOOP;
            }
        }
    }

    return thirdCell;
}

function getCellToPreventAForkForComputer() {
    var thirdCell = 0;
    OUTER_LOOP: for (var x = 0; x <= MAX_X; x++) {
        for (var y = 0; y <= MAX_Y; y++) {
            thirdCell = checkNeighbouringCellsAndGetForkIfAvailable(x, y, player);
            // finish this strategy
            if (thirdCell) {
                break OUTER_LOOP;
            }
        }
    }

    return thirdCell;
}

function checkNeighbouringCellsAndGetThirdSpaceIfAvailable(currentX, currentY, compOrPlayer) {
    var twoInARowArray = [];
    var thirdPosition = 0;
    var opponent = compOrPlayer == computer ? player : computer;
    // map starting cooridinates to number betweeen 1 and 9 to denote position on board
    //      1 | 2 | 3
    //      4 | 5 | 6
    //      7 | 8 | 9
    currentCellPos = mapCoordinatesToPosition(currentX, currentY);

    var startX = (currentX - 1 < MIN_X) ? currentX : currentX - 1;
    var startY = (currentY - 1 < MIN_Y) ? currentY : currentY - 1;
    var endX = (currentX + 1 > MAX_X) ? currentX : currentX + 1;
    var endY = (currentY + 1 > MAX_Y) ? currentY : currentY + 1;

    var neighboursPosition = 0;
    OUTER_LOOP: for (var rowNum=startX; rowNum <= endX; rowNum++) {
        for (var colNum=startY; colNum <= endY; colNum++) {
            neighboursPosition = mapCoordinatesToPosition(rowNum, colNum);
            if ((neighboursPosition !== currentCellPos) && (ttcGrid[neighboursPosition] === compOrPlayer) && (ttcGrid[currentCellPos] === compOrPlayer)) {
                // map this x,y to position number
                neighboursPosition = mapCoordinatesToPosition(rowNum, colNum);

                twoInARowArray.push(currentCellPos, neighboursPosition);
                // check if third space is free
                // create array with two elements. first element is [currentX, currentY] and second el is [neighbouringX, neighbouringY]
                // √http://stackoverflow.com/questions/15912538/get-the-unique-values-from-two-arrays-and-put-them-in-another-array-jquery
                thirdPosition = getThirdSpaceIfFree(twoInARowArray);
                if (thirdPosition) {
                    break OUTER_LOOP;
                }
                twoInARowArray = [];
            }
            else if ((neighboursPosition !== currentCellPos) && (!ttcGrid[neighboursPosition]) && (ttcGrid[currentCellPos] === compOrPlayer)) {
                // check if third space is compOrPlayer
                twoInARowArray.push(currentCellPos);
                twoInARowArray.push(neighboursPosition);
                thirdPosition = getThirdSpaceIfNotFree(twoInARowArray, compOrPlayer);
                
                if (thirdPosition) {
                    twoInARowArray.pop();
                    twoInARowArray.push(thirdPosition);

                    thirdPosition = getThirdSpaceIfFree(twoInARowArray);
                    if (thirdPosition) {
                        break OUTER_LOOP;
                    }
                }
                twoInARowArray = [];
            }
        }
    }
    return thirdPosition;
}

function checkNeighbouringCellsAndGetForkIfAvailable(currentX, currentY, compOrPlayer) {
    var twoPlacesCreateFork = [];
    var twoInARowArray = [];
    var thirdPosition = 0;
    var opponent = compOrPlayer == computer ? player : computer;
    // map starting cooridinates to number betweeen 1 and 9 to denote position on board
    //      1 | 2 | 3
    //      4 | 5 | 6
    //      7 | 8 | 9
    currentCellPos = mapCoordinatesToPosition(currentX, currentY);

    var startX = (currentX - 1 < MIN_X) ? currentX : currentX - 1;
    var startY = (currentY - 1 < MIN_Y) ? currentY : currentY - 1;
    var endX = (currentX + 1 > MAX_X) ? currentX : currentX + 1;
    var endY = (currentY + 1 > MAX_Y) ? currentY : currentY + 1;

    var neighboursPosition = 0;
    OUTER_LOOP: for (var rowNum=startX; rowNum <= endX; rowNum++) {
        for (var colNum=startY; colNum <= endY; colNum++) {
            neighboursPosition = mapCoordinatesToPosition(rowNum, colNum);
            if ((neighboursPosition !== currentCellPos) && ((!ttcGrid[neighboursPosition]) && (ttcGrid[currentCellPos] === compOrPlayer)) || ((ttcGrid[neighboursPosition] === compOrPlayer) && (!ttcGrid[currentCellPos]))) {
                // map this x,y to position number
                neighboursPosition = mapCoordinatesToPosition(rowNum, colNum);

                twoInARowArray.push(currentCellPos, neighboursPosition);
                // check if third space is free
                // create array with two elements. first element is [currentX, currentY] and second el is [neighbouringX, neighbouringY]
                // √http://stackoverflow.com/questions/15912538/get-the-unique-values-from-two-arrays-and-put-them-in-another-array-jquery
                thirdPosition = getThirdSpaceIfFree(twoInARowArray);

                if (thirdPosition) {
                    twoInARowArray.push(thirdPosition);
                    twoPlacesCreateFork.push(twoInARowArray);
                }
                if (twoPlacesCreateFork.length > 1 && !isSameSet(twoPlacesCreateFork[0], twoPlacesCreateFork[1])) {
                    break OUTER_LOOP;
                }
                else if (twoPlacesCreateFork.length > 1 && isSameSet(twoPlacesCreateFork[0], twoPlacesCreateFork[1])) {
                    twoPlacesCreateFork.pop();
                }
                twoInARowArray = [];
            }
            else if ((neighboursPosition !== currentCellPos) && (!ttcGrid[neighboursPosition]) && (!ttcGrid[currentCellPos])) {
                // check if third space is compOrPlayer
                twoInARowArray.push(currentCellPos);
                twoInARowArray.push(neighboursPosition);
                thirdPosition = getThirdSpaceIfNotFree(twoInARowArray, compOrPlayer);
                //thirdPosition = getThirdSpaceIfOpponentTaken(twoInARowArray, compOrPlayer);

                if (thirdPosition) {
                    twoInARowArray.push(thirdPosition);
                    twoPlacesCreateFork.push(twoInARowArray);
                }
                if (twoPlacesCreateFork.length > 1 && !isSameSet(twoPlacesCreateFork[0], twoPlacesCreateFork[1])) {
                    break OUTER_LOOP;
                }
                else if (twoPlacesCreateFork.length > 1 && isSameSet(twoPlacesCreateFork[0], twoPlacesCreateFork[1])) {
                    twoPlacesCreateFork.pop();
                }
                twoInARowArray = [];
            }
        }
    }

    if (thirdPosition && twoPlacesCreateFork.length > 1) {
        thirdPosition = twoPlacesCreateFork[0].filter(function(elem) {
            return twoPlacesCreateFork[1].indexOf(elem) !== -1;
        })[0];
        if (ttcGrid[thirdPosition]) {
            thirdPosition = 0;
        }
    }
    else {
        thirdPosition = 0;
    }

    return thirdPosition;
}

function checkNeighbouringCellsAndPreventForkIfAvailable(currentX, currentY, compOrPlayer) {
    var twoPlacesCreateFork = [];
    var twoInARowArray = [];
    var thirdPosition = 0;
    var opponent = compOrPlayer == computer ? player : computer;
    // map starting cooridinates to number betweeen 1 and 9 to denote position on board
    //      1 | 2 | 3
    //      4 | 5 | 6
    //      7 | 8 | 9
    currentCellPos = mapCoordinatesToPosition(currentX, currentY);
    console.log("starting position is " + currentCellPos);

    var startX = (currentX - 1 < MIN_X) ? currentX : currentX - 1;
    var startY = (currentY - 1 < MIN_Y) ? currentY : currentY - 1;
    var endX = (currentX + 1 > MAX_X) ? currentX : currentX + 1;
    var endY = (currentY + 1 > MAX_Y) ? currentY : currentY + 1;

    var neighboursPosition = 0;
    OUTER_LOOP: for (var rowNum=startX; rowNum <= endX; rowNum++) {
        for (var colNum=startY; colNum <= endY; colNum++) {
            neighboursPosition = mapCoordinatesToPosition(rowNum, colNum);
            if ((neighboursPosition !== currentCellPos) && ((!ttcGrid[neighboursPosition]) && (ttcGrid[currentCellPos] === compOrPlayer)) || ((ttcGrid[neighboursPosition] === compOrPlayer) && (!ttcGrid[currentCellPos]))) {
                // map this x,y to position number
                neighboursPosition = mapCoordinatesToPosition(rowNum, colNum);

                twoInARowArray.push(currentCellPos, neighboursPosition);
                // check if third space is free
                // create array with two elements. first element is [currentX, currentY] and second el is [neighbouringX, neighbouringY]
                // √http://stackoverflow.com/questions/15912538/get-the-unique-values-from-two-arrays-and-put-them-in-another-array-jquery
                thirdPosition = getThirdSpaceIfFree(twoInARowArray);

                if (thirdPosition) {
                    twoInARowArray.push(thirdPosition);
                    twoPlacesCreateFork.push(twoInARowArray);
                }
                if (twoPlacesCreateFork.length > 1 && !isSameSet(twoPlacesCreateFork[0], twoPlacesCreateFork[1])) {
                    break OUTER_LOOP;
                }
                else if (twoPlacesCreateFork.length > 1 && !isSameSet(twoPlacesCreateFork[0], twoPlacesCreateFork[1])) {
                    twoPlacesCreateFork.pop();
                }
                twoInARowArray = [];
            }
            else if ((neighboursPosition !== currentCellPos) && (!ttcGrid[neighboursPosition]) && (!ttcGrid[currentCellPos])) {
                // check if third space is compOrPlayer
                twoInARowArray.push(currentCellPos);
                twoInARowArray.push(neighboursPosition);
                //thirdPosition = getThirdSpaceIfNotFree(twoInARowArray, compOrPlayer);
                thirdPosition = getThirdSpaceIfOpponentTaken(twoInARowArray, compOrPlayer);

                if (thirdPosition) {
                    twoInARowArray.push(thirdPosition);
                    twoPlacesCreateFork.push(twoInARowArray);
                }
                if (twoPlacesCreateFork.length > 1 && !isSameSet(twoPlacesCreateFork[0], twoPlacesCreateFork[1])) {
                    break OUTER_LOOP;
                }
                twoInARowArray = [];
            }
        }
    }

    if (thirdPosition && twoPlacesCreateFork.length > 1) {
        thirdPosition = twoPlacesCreateFork[0].filter(function(elem) {
            return twoPlacesCreateFork[1].indexOf(elem) !== -1;
        })[0];
        if (ttcGrid[thirdPosition]) {
            thirdPosition = 0;
        }
    }
    else {
        thirdPosition = 0;
    }

    return thirdPosition;
}

function mapCoordinatesToPosition(x, y) {
    // map starting cooridinates to number betweeen 1 and 9 to denote position on board
    //      1 | 2 | 3
    //      4 | 5 | 6
    //      7 | 8 | 9
    var position = 0;
    OUTER_LOOP: for (var i = 0; i <= MAX_X; i++) {
        for (var j = 0; j <= MAX_Y; j++) {
            position++;
            if ((i === x) && (j === y)) {
                break OUTER_LOOP;
            }
        }
    }
    return position;
}

function getThirdSpaceIfFree(array) {
    var isCurrentRow;
    var thirdSpace = 0;
    for (var i = 0; i < winningPositions.length; i++) {
        isCurrentRow = winningPositions[i].filter(function (elem) {
            return array.indexOf(elem) > -1;
        }).length == array.length;
        
        if (isCurrentRow) {
            thirdSpace = winningPositions[i].filter(function(elem) {
                return array.indexOf(elem) == -1;
            })[0];
            if (!isSpaceFree(thirdSpace)) {
                thirdSpace = 0;
            }
            else {
                break;
            }
        }
    }
    return thirdSpace;
}

function getThirdSpaceIfNotFree(array, player) {
    var isCurrentRow;
    var thirdSpace = 0;
    for (var i = 0; i < winningPositions.length; i++) {
        isCurrentRow = winningPositions[i].filter(function (elem) {
                return array.indexOf(elem) > -1;
            }).length == array.length;

        if (isCurrentRow) {
            thirdSpace = winningPositions[i].filter(function(elem) {
                return array.indexOf(elem) == -1;
            })[0];
            if (!isSpaceTaken(thirdSpace)) {
                thirdSpace = 0;
            }
            else if (isSpaceTaken(thirdSpace) && (ttcGrid[thirdSpace] !== player)) {
                thirdSpace = 0;
            }
            else if (isSpaceTaken(thirdSpace) && (ttcGrid[thirdSpace] === player)) {
                break;
            }
        }
    }
    return thirdSpace;
}

function isSpaceFree(position) {
    var thirdSpaceHTMLEl = document.getElementById(mapArrayPosToHtmlGrid(position));
    var val = thirdSpaceHTMLEl.getAttribute('value');
    if (!val) {
        return true;
    }
    else {
        return false;
    }
}

function isSpaceTaken(position) {
    var thirdSpaceHTMLEl = document.getElementById(mapArrayPosToHtmlGrid(position));
    var val = thirdSpaceHTMLEl.getAttribute('value');
    if (val) {
        return true;
    }
    else {
        return false;
    }
}

