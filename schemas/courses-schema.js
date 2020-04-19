const port = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const coursesSchema = {};

coursesSchema.coursesMeta = new Schema({
courseId : Number,
courseName : String,
courseCode : String,
courseNumber : Number,
isActive : Boolean,
isEnabled : Boolean,
suggested : Boolean,
recommended : Boolean,
featured : Boolean,
youTube : String,
vimeo : String,
description : String,
tags : Array,
courseExerciseFiles : String,
courseLink : String,
metaTitle : String,
metaAlt : String,
parent : Number,
category : String,
poster : String,
isPublic : Boolean,
level : String,
created : Date,
updated : Date,
createdUser : Number,
likeOnLinkedIn : String,
likeOnInstagram : String,
likeOnFacebook : String,
likeonYoutube : String,
likeonVimeo : String,
promo30 : String,
promo60 : String,
promo90 : String,
endDate : Date,
startDate : Date,
});

module.exports = coursesSchema;
