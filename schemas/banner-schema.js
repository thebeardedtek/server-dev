const banner = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bannerSchema = {};

bannerSchema.bannerTypeMeta = new Schema({
id: Number,
interval: Number,
transitions: Array,
imgs: Array
});

module.exports = bannerSchema;
