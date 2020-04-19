const documents = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const documentsSchemas = {};

documentsSchemas.documentsSchema = new Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  mimeCode: String,
  docReference: String,
  createdDate: Date,
});

module.exports = documentsSchemas;
