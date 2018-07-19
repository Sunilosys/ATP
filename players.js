//Run nodemon --harmony app.js
//Access http://localhost:3000/atpapi/players
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

router.get("/atpapi/players", function (req, res) {
    let scrappers = {
        players: {
            selector: "#rankingDetailAjaxContainer tr",
            valueFn: function ($element, cb) {
                var playerStats = $element.find(".player-cell").text() + "\n";

                cb(playerStats);
            }
        }
    };
    var url = "http://www.atpworldtour.com/en/rankings/singles?rankRange=1-500";
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