const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//blueprint for each new entry in the db
var schema = new Schema({
    imagePath: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});
//model.exports = mongoose.model('Product',schema);
module.exports = mongoose.model('Product', schema)