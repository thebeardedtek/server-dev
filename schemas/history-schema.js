const port = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const historySchema = {};

historySchema.historyMeta = new Schema({
    action: String,
    device: Object,
    navigator: Object,
    location: Object,
    createdDate: Date,
    updatedDate: Date,
    environment: String,
});

module.exports = historySchema;