const contact = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactFormSchemas = {};

contactFormSchemas.contactFormTypeMeta = new Schema({
name: String,
email: String,
countryCode: Number,
areaCode: Number,
number: Number,
extension: Number,
message: String,
createdDate: Date,
currentUrl: String,
userAgent: String,
appName: String,
});


module.exports = contactFormSchemas;
