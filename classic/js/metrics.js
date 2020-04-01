/*jslint
    browser: true
*/
/*global document,data*/

var metrics = {
    timeTaken: 0,
    pairs: 0,
    possiblePairs: data.maxColumns * data.maxRows / 2 
};

var resultsBoard = document.getElementById("results-board");

metrics.refreshBoard = function() {
    var time = document.getElementById("time");
    var pairs = document.getElementById("pairs");
    time.innerHTML = metrics.timeTaken;
    pairs.innerHTML = metrics.pairs;
}

metrics.setTime = function(time) {
    metrics.timeTaken = time;
}

metrics.setPairs = function(pairs) {
    metrics.pairs = pairs;
}

metrics.updateResults = function (time, pairs) {
    metrics.setTime(time);
    metrics.setPairs(pairs);
    metrics.refreshBoard();
}