'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ingredientSchema = Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  date: Date,
  category: String,
  amount: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);