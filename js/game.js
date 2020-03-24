/*jslint
    browser: true
*/
/*global window,console,document,hex,map,move,nation,build,expansion,phase*/
var game = {
    ids: [[]],
    isFlippedArray: [[]],
    NO_EFFECT_ONCLICK: 1,
    ONCLICK_WORKS: 2,
    status: 2,
    timeForCheckStart: 0,
    nowTime: 0,
    emojini: [],
    emojiOne: "",
    emojiTwo: "",
    pimpomList: []
}

game.data = {
    listOfEmoji: ["😯","😲",
    "🤪","🤩",
    "😌","😁",
    "😃","😃",
    "️️☺","😉",
    "😌","😍",
    "😪","😴",
    "😇","🤗",
    "😐","😑"],
    doubleListOfEmoji: [
        "😯","😲",
    "🤪","🤩",
    "😌","😁",
    "😃","😆",
    "️️☺","😉",
    "🤣","😍",
    "😪","😴",
    "😇","🤗",
    "😐","😑",

    "😯","😲",
    "🤪","🤩",
    "😌","😁",
    "😃","😆",
    "️️☺","😉",
    "🤣","😍",
    "😪","😴",
    "😇","🤗",
    "😐","😑"],
    totalColumns: 6,
    totalRows: 6

}

game.onload = function () {
    game.emojini = game.shuffle(game.data.doubleListOfEmoji);
    console.log(game.emojini);

    game.createIsFlippedArray();
    game.createTable();
};

game.createTable = function () {
    var table = document.getElementById("table");
    table.innerHTML = game.createDIVs();
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

game.createDIVs = function () {
    var divs = "";
    var columnBegin = "<div class=\"column\" id";
    var columnEnd = "</div>";
    var onclick = "onclick=\"game.flip(event);\"";
    game.DIVids();
    var cardIndex = 0;
    var totalColumns = 6;
    var totalRows = 6;
    for (let x = 0; x < game.data.totalColumns; x++) {
        divs = divs + columnBegin + "=\"c" + x + "\">";
        for (let y = 0; y < game.data.totalRows; y++) {
            divs = divs +
                "<div class=\"card\" id=" +
                "\"" +
                game.ids[x][y] +
                "\" " +
                onclick +
                ">" +
                "</div>";
            cardIndex++;
        }
        divs = divs + columnEnd;
    }
    return divs;
};

game.DIVids = function () {
    game.ids = game.twoDArray();
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            game.ids[x][y] = "x" + x + "y" + y;
        }
    }
};

game.twoDArray = function () {
    var arr = [];
    while (arr.length < 6) {
        arr.push([]);
    }
    return arr;
};

game.flip = async function (e) {
    var x = 0;
    var y = 0;
    x = (e.target.id).substring(1, 2);
    y = (e.target.id).substring(3, 4);
    if (!game.isFlippedArray[x][y]) {
        if (game.countFlipped() === 0) {
            console.log("first click" + game.emojini[game.cardIndex(x,y)]);
            game.turnDownAll();
            game.createIsFlippedArray();
            game.showFlipped();
            game.timeForCheckStart = new Date().getTime();
            game.isFlippedArray[x][y] = true;
            game.showEmoji(x,y);
            game.emojiOne = game.emojini[game.cardIndex(x,y)];
            game.showFlipped();
            game.showPIMPOMS();
            return;
        }
        if (game.countFlipped() === 1) {
            console.log("second click" + game.emojini[game.cardIndex(x,y)]);
            game.isFlippedArray[x][y] = true;
            console.log(game.isFlippedArray);
            game.showEmoji(x,y);
            var n = document.getElementById("x" + x + "y" + y);
            n.style = "background: aqua";
            var duration = (new Date().getTime()) - game.timeForCheckStart;
            console.log("found in " + duration);
            game.emojiTwo = game.emojini[game.cardIndex(x,y)];
            if(!game.isSame()) {
                await sleep(3800);
            }
            game.checkBoth();
            game.hideAllEmoji();
            game.resetTable();
            game.showFlipped();
            game.showPIMPOMS();
        }
        return;
    }
    if (game.isFlippedArray[x][y]) {
        e.target.style = "background: black";
        game.isFlippedArray[x][y] = false;
    }
};

game.isSame = function(){
    return game.emojiOne === game.emojiTwo;
}

game.isOneofPIMPOM =  function (emo) {
    for(let i = 0; i < game.pimpomList.length; i++) {
        if(emo === game.pimpomList[i]){
            return true;
        };
    }
    return false;
}

game.showPIMPOMS = function(){
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            var currentEmo = game.emojini[game.cardIndex(x,y)];
            console.log("currentemo:" + currentEmo);
            if(game.isOneofPIMPOM(currentEmo)) {
                document.getElementById("x" + x + "y" +y).innerHTML =
                currentEmo;
            }
        }
    }
}

game.checkBoth = function () {
    console.log("checked:");
    if(game.isSame()) {
        game.pimpomList.push(game.emojiOne);
        console.log("PIMPOM");
    }
}

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
}

game.showEmoji = function (x, y) {
    var cardIndex = game.cardIndex(x,y);
    console.log(cardIndex+" "+ x + " " + y);
    document.getElementById("x" + x + "y" +y).innerHTML =
    game.emojini[cardIndex];
}

game.showAllEmoji = function () {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            game.showEmoji(x,y);
        }
    }
}

game.hideAllEmoji = function() {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            document.getElementById("x" + x + "y" +y).innerHTML = "";
        }
    }
}

game.flipIt = function (x, y) {
    if (game.isFlippedArray[x][y] &&
        x < 6 &&
        y < 6) {
        document.getElementById("x" + x + "y" + y).style = "background: aqua";
        return;
    }
    document.getElementById(id).style = "background: black";
};

game.unflipIt = function (x, y) {
    if (!game.isFlippedArray[x][y] &&
        x < 6 &&
        y < 6) {
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
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            var id = "x" + x + "y" + y;
            document.getElementById(id).style = "background: black";
        }
    }
}

game.showFlipped = function () {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            if(game.isFlippedArray[x][y]){
                var id = "x" + x + "y" + y;
                document.getElementById(id).style = "background: aqua";
            }
        }
    }
};

game.countFlipped = function () {
    var count = 0;
    var all = game.joinArray();
    var flippedOnes = all.filter(x => {
        if (x === true) { return "flipped" };
    });
    count = flippedOnes.length;
    return count;
}

game.checkFlips = function () {
    var count = game.countFlipped();
    console.log("checking flips" + count);
    game.createIsFlippedArray();
    game.unflipAll();
    game.status = game.ONCLICK_WORKS;
};

game.joinArray = function () {
    var allFlips = [];
    this.isFlippedArray.forEach(function (flip) {
        allFlips = allFlips.concat(flip);
    });
    console.log(allFlips);
    return allFlips;
}

game.createIsFlippedArray = function () {
    game.isFlippedArray = game.twoDArray();
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            game.isFlippedArray[x][y] = false;
        }
    }
};

var sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
