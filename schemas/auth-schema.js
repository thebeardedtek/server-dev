const auth = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authSchemas = {};

authSchemas.authSchema = new Schema({
  stripeId: String,
  clientEmail: String,
  clientPassword: String,
  clientType: String,
  clientAccountNum: Number,
  lastSignIn: Date,
  createdDate: Date,
  updatedDate: Date,
});

authSchemas.clientSchema = new Schema({
  stripeId: String,
  profileDocReference: String,
  profileFileName: String,
  clientEmail: String,
  clientPassword: String,
  clientType: String,
  clientAccountNum: Number,
  clientCode: String,
  isActive: Boolean,
  status: String,
  //  clientPrefix: String,
  clientFirstName: String,
  clientMiddleName: String,
  clientLastName: String,
  //  clientSuffix: String,
   clientAvatar: String,
  //  clientBio: String,
  //  clientGeo: Array,
   clientBilling: Array,
   clientShipping: Array,
  clientPhone1: String,
  clientPhone2: String,
  //  clientPreferences: Array,
  enableFacebook: Boolean,
  facebookHandle: String,
  enableTwitter: Boolean,
  twitterHandle: String,
  enableInstagram: Boolean,
  instagramHandle: String,
  enableLinkedin: Boolean,
  linkedinHandle: String,
  enableGithub: Boolean,
  githubHandle: String,
  enableGoogle: Boolean,
  googleHandle: String,
  enablePinterest: Boolean,
  pinterestHandle: String,
  enableSnapchat: Boolean,
  snapchatHandle: String,
  lastSignIn: Date,
  projects: Array,
  courses: Array,
  createdDate: Date,
  updatedDate: Date,
  active: Boolean,
});

authSchemas.personSchema = new Schema({
clientPrefixes : Array,
clientSuffixes : Array,
});

authSchemas.userSchema = new Schema({
token : String,
clientEmail : String,
});

module.exports = authSchemas;
