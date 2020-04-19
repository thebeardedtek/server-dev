const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
name : String,
code : String,
label : String,
url : String,
sequence : Number,
isEnabled : Boolean,
isSelected : Boolean,
hasChildren : Boolean,
isButton : Boolean,
isTopLevel : Boolean,
parentCode : String
});

module.exports = menuSchema;
