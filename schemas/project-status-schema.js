const port = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectStatusSchema = {};

projectStatusSchema.projectStatusMeta = new Schema({
statusId : Number,
statusDesc : String,
statusCode : String,
icon : String,
});

module.exports = projectStatusSchema;
