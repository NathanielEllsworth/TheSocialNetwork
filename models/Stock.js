var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StockSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Stock = mongoose.model("Stock", StockSchema);
module.exports = Stock;




