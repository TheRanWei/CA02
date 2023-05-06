
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var userSchema = Schema( {
  username:String,
  passphrase: String,
  age:Number,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
} );

module.exports = mongoose.model( 'User', userSchema );
