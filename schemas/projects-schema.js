const port = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectsSchema = {};

projectsSchema.projectsTypeMeta = new Schema({
core : Object,
plus : Object,
marketing : Object,
app : Object,
createdDate: Date,
updatedDate: Date,
});

module.exports = projectsSchema;
