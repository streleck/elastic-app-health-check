const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const path = require('path');

const app = express();

const monitorApp = require('./monitorApp');

//mongoose.connect("mongodb://localhost/es-app-health-check");
mongoose.connect(MONGODB_URI);
//mongoose.connect("mongodb://heroku_spscw08h:5k2lr31jtfhrv86kpn9kdh1eum@ds021701.mlab.com:21701/heroku_spscw08h");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

const routes = require('./routes');

app.set('view engine', 'ejs');
app.set('views', 'public/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

var PORT = process.env.PORT || 3000;

var AppToTest = require('./models/AppToTest');

AppToTest.find({}, function(err, docs){
  if(err){
    console.log(err);
  }
  else {
    for(let doc of docs){
      monitorApp(doc);
    }
  }
});

// var newApp = new AppToTest({
//   displayName: 'Actual',
//   url: 'https://e33d2ea501994214:b4b699b082a2f685@cjpoeiifd000101m3i4tz8dm5.es.vizion.ai',
//   displayUrl: 'cjpoeiifd000101m3i4tz8dm5.es.vizion.ai',
//   emails: ['markstrelecky@yandex.com'],
//   getChecks: [{wasSuccessful: false, timestamp: 6876876}],
//   postChecks: [{wasSuccessful: true, timestamp: 683276}]
// }).save();

// AppToTest.find({}, function(err, docs){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log('###############################');
//     monitorApp(docs[1]);
//   }
// });




app.listen(PORT);