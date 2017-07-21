var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Comment = require("./models/Comment.js");
var Stock = require("./models/Stock.js");
var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/stockScraper");
var db = mongoose.connection;
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});

app.get("/scrape", function (req, res) {
    request("https://ycharts.com/stocks", function (error, response, html) {
        var $ = cheerio.load(html);
        $("td").each(function (i, element) {

            var result = {};
            result.title = $(this).text();
            result.link = $(this).children("a").attr("href")

            // jQuery("td").children("span.valPos").text()
            // jQuery("td").text()
            if (result.link !== undefined) {
                console.log(result);

            }


            var entry = new Stock(result);
            entry.save(function (err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                }
            });

        });
    });
    res.send("doc");
});

app.get("/stocks", function (req, res) {
    Stock.find({})
        .populate("comment")
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(doc);
            }
        });
});

app.get("/stocks/:id", function (req, res) {
    Stock.findOne({"_id": req.params.id})
        .populate("comment")
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(doc);
            }
        });
});

app.post("/stocks/:id", function (req, res) {
    var newComment = new Comment(req.body);

    newComment.save(function (error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            Stock.findOneAndUpdate({"_id": req.params.id}, {"comment": doc._id})
                .exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send(doc);
                    }
                });
        }
    });
});


app.listen(3000, function () {
    console.log("App running on port 3000!");
});
