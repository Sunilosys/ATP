//https://www.youtube.com/watch?v=4TuH3xbXFbI
//npm init
//npm install express --save
//npm install @mrharel/scrappy --save
//npm install nodemon -g
//nodemon --harmony app.js
//https://codebeautify.org/jsonviewer
////Access http://localhost:3000//wta/rankings/singles
'use strict';
var express = require('express');
var app = express();
var scrappy = require('@mrharel/scrappy');
var router = express.Router();

String.prototype.escapeSpecialChars = function () {
    return this.replace(/\\n/g, "")
        .replace(/\\r/g, "")
        .replace(/\\t/g, "");
};

router.get("/wta/rankings/singles", function (req, res) {
    let scrappers = {
        singlesRanking: {
            selector: "#atpRanking tr",
            valueFn: function ($element, cb) {
                var playerStats = {
                    ranking: $element.find(".current-rank").text(),
                    playerName: $element.find(".player-name").text(),
                    playerCountry:$element.find(".player-country").text(),
                    playerPoints:$element.find(".player-points").text()
                };
                cb(playerStats);
            }
        }
    };
    var url = "http://www.tennis.com/rankings/WTA/";
    scrappy.get({
        url: url,
        scrappers: scrappers
    }, (response, error) => {
        if (error) {
            console.log("error: ", error);
        }
        var myJSONString = JSON.stringify(response);
        var myEscapedJSONString = myJSONString.escapeSpecialChars();
        res.json(JSON.parse(myEscapedJSONString));

        res.end();
    });
});

app.use(router);
app.listen(3000, function () {
    console.log('listening on port 3000');
})