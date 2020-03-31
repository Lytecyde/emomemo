/*jslint
    browser: true
*/
/*global window,console,document,data*/

var game = {
    ids: [[]],
    isFlippedArray: [[]],
    NO_EFFECT_ONCLICK: 1,
    ONCLICK: 2,
    status: 2,
    timeForCheckStart: 0,
    nowTime: 0,
    emojiArray: [],
    firstEmojiCard: "",
    secondEmojiCard: "",
    matchedCardsList: []
}

game.twoDimensionalArray = function () {
    var arr = [];
    while (arr.length < 6) {
        arr.push([]);
    }
    return arr;
};

game.createIsFlippedArray = function () {
    game.isFlippedArray = game.twoDimensionalArray();
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            game.isFlippedArray[x][y] = false;
        }
    }
};

game.createTable = function () {
    var table = document.getElementById("table");
    table.innerHTML = game.createDIVs();
};

game.onload = function () {
    game.emojiArray = game.shuffle(data.doubleListOfEmoji);
    console.log(game.emojiArray);

    game.createIsFlippedArray();
    game.createTable();
};

game.shuffle = function(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

game.HTMLcodeDIV = function (x, y) {
    return "<div class=\"card\" id=" +
    "\"" +
    game.ids[x][y] +
    "\" " +
   "onclick=\"game.flip(event);\"" +
    ">" +
    "</div>";
};

game.createDIVs = function () {
    var divs = "";
    var columnBegin = "<div class=\"column\" id";
    var columnEnd = "</div>";
    game.makeIDsForGameTable();
    var cardIndex = 0;
    for (let x = 0; x < data.maxColumns; x++) {
        divs = divs + columnBegin + "=\"c" + x + "\">";
        for (let y = 0; y < data.maxRows; y++) {
            divs = divs + game.HTMLcodeDIV(x, y);    
            cardIndex++;
        }
        divs = divs + columnEnd;
    }
    return divs;
};

game.makeIDsForGameTable = function () {
    game.ids = game.twoDimensionalArray();
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            game.ids[x][y] = "x" + x + "y" + y;
        }
    }
};

game.flip = function (e) {
    var x = 0;
    var y = 0;
    x = (e.target.id).substring(1, 2);
    y = (e.target.id).substring(3, 4);
    if (!game.isFlippedArray[x][y]) {
        if(game.onFirstFlip(x, y)) { 
            return;
        }
        game.onSecondFlip(x, y);
        return;
    }
    
    e.target.style = "background: black";
    game.isFlippedArray[x][y] = false;
    
};

game.onFirstFlip = function (x, y) {
    if (game.countFlipped() === 0) {
        console.log("first click" + game.emojiArray[game.cardIndex(x, y)]);
        game.turnDownAll();
        game.createIsFlippedArray();
        game.showFlipped();
        game.timeForCheckStart = new Date().getTime();
        game.isFlippedArray[x][y] = true;
        game.showEmoji(x,y);
        game.firstEmojiCard = game.emojiArray[game.cardIndex(x,y)];
        game.showFlipped();
        game.showMatches();
        return true;
    }
    return false;
};

game.onSecondFlip = async function (x, y) {
    if (game.countFlipped() === 1) {
        console.log("second click" + game.emojiArray[game.cardIndex(x,y)]);
        game.isFlippedArray[x][y] = true;
        console.log(game.isFlippedArray);
        game.showEmoji(x,y);

        var n = document.getElementById("x" + x + "y" + y);
        n.style = "background: aqua";
        var duration = (new Date().getTime()) - game.timeForCheckStart;
        console.log("found in " + duration);
        game.secondEmojiCard = game.emojiArray[game.cardIndex(x,y)];
        if(!game.isBothCardsMatch()) {
            await sleep(3800);
        }

        game.checkBoth();
        game.hideAllEmoji();
        game.resetTable();
        game.showFlipped();
        game.showMatches();  
    }
}

game.isBothCardsMatch = function(){
    return game.firstEmojiCard === game.secondEmojiCard;
}

game.isOneofPIMPOM =  function (emo) {
    const statement = (element) => element === emo;
    if(game.matchedCardsList.some(statement)){
        return true;
    };
   
    return false;
};

game.showMatches = function(){
    for (let x = 0; x < data.maxColumns; x++) {
        for (let y = 0; y < data.maxRows; y++) {
            var currentEmo = game.emojiArray[game.cardIndex(x, y)];
            console.log("currentemo:" + currentEmo);
            if(game.isOneofPIMPOM(currentEmo)) {
                document.getElementById("x" + x + "y" + y).innerHTML =
                currentEmo;
            }
        }
    }
}

game.checkBoth = function () {
    console.log("checked:");
    if(game.isBothCardsMatch()) {
        game.matchedCardsList.push(game.firstEmojiCard);
        console.log("PIMPOM you got two matching cards!");
    }
};

game.cardIndex = function (x0, y0) {
    var n = 0;
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            if(x == x0 && y == y0){
                return n;
            }
            n++;
        }
    }
    return 0;
};

game.showEmoji = function (x, y) {
    var cardIndex = game.cardIndex(x, y);
    console.log(cardIndex+" "+ x + " " + y);
    document.getElementById("x" + x + "y" +y).innerHTML =
    game.emojiArray[cardIndex];
}

game.showAllEmoji = function () {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            game.showEmoji(x,y);
        }
    }
};

game.hideAllEmoji = function() {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            document.getElementById("x" + x + "y" +y).innerHTML = "";
        }
    }
};

game.flipCheck = function (x, y) {
    return game.isFlippedArray[x][y] &&
    x < data.maxColumns &&
    y < data.maxRows;
};

game.flipIt = function (x, y) {
    if (game.flipCheck(x, y)) {
        document.getElementById("x" + x + "y" + y).style = "background: aqua";
        return;
    }
    document.getElementById(id).style = "background: black";
};

game.unflipIt = function (x, y) {
    if (! game.flipCheck(x, y)) {
        var id = "x" + x + "y" + y;
        document.getElementById(id).style = "background: black";
        return;
    }
    document.getElementById("x" + x + "y" + y).style = "background: aqua";
};

game.resetTable = function () {
    game.createIsFlippedArray();
    game.unflipAll();
};

game.unflipAll = function () {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            game.unflipIt(x, y);
        }
    }
};

game.turnDownAll = function () {
    for (let x = 0; x < data.maxColumns; x++) {
        for (let y = 0; y < data.maxRows; y++) {
            var id = "x" + x + "y" + y;
            document.getElementById(id).style = "background: black";
        }
    }
};

game.setAquaWhenFlipped = function (x, y) {
    console.log(x);
    if(game.isFlippedArray[x][y]) {
        var id = "x" + x + "y" + y;
        document.getElementById(id).style = "background: aqua";
    }
};

game.showFlipped = function () {
    for (let x = 0; x < data.maxColumns; x++) {
        for (let y = 0; y < data.maxRows; y++) {
            game.setAquaWhenFlipped();
        }
    }
};

game.countFlipped = function () {
    var count = 0;
    var all = game.joinArray();
    var flipped = all.filter(f => {
        if (f === true) { return "flipped" };
    });
    count = flipped.length;
    return count;
}

game.checkFlips = function () {
    game.createIsFlippedArray();
    game.unflipAll();
    game.status = game.ONCLICK;
};

game.joinArray = function () {
    var allFlips = [];
    this.isFlippedArray.forEach(function (flip) {
        allFlips = allFlips.concat(flip);
    });
    console.log(allFlips);
    return allFlips;
}



var sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
