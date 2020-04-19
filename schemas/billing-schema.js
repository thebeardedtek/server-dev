const port = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const billingSchema = {};

billingSchema.billingTypeMeta = new Schema({
core : Object,
plus : Object,
marketing : Object,
app : Object,
});

module.exports = billingSchema;
