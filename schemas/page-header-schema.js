const port = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pageHeaderSchemas = {};

pageHeaderSchemas.pageHeaderTypeMeta = new Schema({
subtitle : String,
title : String,
blurb : String,
buttonText : String,
buttonLink : String,
headerImgWebp : String,
headerImgJpg : String,
currentUrl: String
});

module.exports = pageHeaderSchemas;
