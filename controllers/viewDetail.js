module.exports = (req, res, next) => {

  const AppToTest = require('../models/AppToTest');
  const moment = require('moment');

  AppToTest.findOne({_id: req.params.id}, function(err, doc){
    if(err){
      console.log(err);
      res.render('errorPage', {
        pageTitle: 'Database Error',
        pageName: 'errorPage',
        message: 'There was an error retrieving database records.'
      });
    }
    else{
      let formattedGetChecks = [];
      doc.getChecks.forEach((check) => {
        let formattedCheck = {
          id: check._id,
          wasSuccessful: check.wasSuccessful,
          time: moment(check.timestamp).format('YYYY-MM-DD-HH:mm:ss'),
          error: check.errorObject
        }
        formattedGetChecks.unshift(formattedCheck);
      });
      let formattedPostChecks = [];
      doc.postChecks.forEach((check) => {
        let formattedCheck = {
          id: check._id,
          wasSuccessful: check.wasSuccessful,
          time: moment(check.timestamp).format('YYYY-MM-DD-HH:mm:ss'),
          error: check.errorObject
        }
        formattedPostChecks.unshift(formattedCheck);
      });
      res.render('detail', {
        pageTitle: 'App Records',
        pageName: 'detail',
        appId: doc._id,
        displayName: doc.displayName,
        url: doc.url,
        emails: doc.emails,
        getChecks: formattedGetChecks,
        postChecks: formattedPostChecks
      })
    }
  });
};