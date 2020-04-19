const port = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const portfolioSchemas = {};


portfolioSchemas.portfolioTypeMeta = new Schema({
type : String,
code : String,
name : String,
isEnabled : Boolean,
});

portfolioSchemas.webappTypeMeta = new Schema({
type : String,
code : String,
name : String,
isEnabled : Boolean,
isSearchable : Boolean,
});

portfolioSchemas.portfolioMeta = new Schema({
url : String,
tags : Array,
caption: String,
srcSmall: String,
srcMedium: String,
srcLarge: String,
isEnabled: Boolean,
linkToSite: String,
hoverColor: String,
color: String,
sequence: Number,
caseStudy: Boolean,
caseLink: String,
});

portfolioSchemas.mimeTypeMeta = new Schema({
name: String,
code: String,
mimetype: String
});

module.exports = portfolioSchemas;

