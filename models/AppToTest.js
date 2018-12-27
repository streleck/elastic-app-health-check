// Require mongoose
var mongoose = require('mongoose');
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var AppToTestSchema = new Schema({
  displayName: {
    type: String,
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  displayUrl: {
    type: String,
  },
  emails: [{
    type: String,
  }],
  getChecks: [{
    wasSuccessful: Boolean,
    timestamp: Number,
    errorObject: String
  }],
  postChecks: [{
    wasSuccessful: Boolean,
    timestamp: Number,
    errorObject: String
  }],
});

// Create the Article model with the ArticleSchema
var AppToTest = mongoose.model('AppToTest', AppToTestSchema);

// Export the model
module.exports = AppToTest;
