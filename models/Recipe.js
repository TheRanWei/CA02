const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var resSchema = Schema({
    prompt: String,
    answer: String,
    createId: Number,
});

module.exports = mongoose.model('Recipe', resSchema);