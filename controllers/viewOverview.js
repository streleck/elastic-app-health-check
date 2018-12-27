module.exports = (req, res, next) => {

  const AppToTest = require('../models/AppToTest');
  const moment = require('moment');


  AppToTest.find({}, function(err, docs){
    if(err){
      console.log(err);
      res.render('errorPage', {
        pageTitle: 'Database Error',
        pageName: 'errorPage',
        message: 'There was an error retrieving database records.'
      });
    }
    else{
      let appList = [];
      for(let doc of docs){
        appList.push({
          name: doc.displayName ? doc.displayName : '',
          version: (doc.displayUrl.split('.')[1] === 'es3') ? 'app3' : (doc.displayUrl.split('.')[1] === 'es') ? 'app' : 'other',
          url: doc.displayUrl,
          get: doc.getChecks.length === 0 ? 'no tests completed' : doc.getChecks[doc.getChecks.length -1].wasSuccessful ? 'success' : 'error',
          post: doc.postChecks.length === 0 ? 'no tests completed' : doc.postChecks[doc.postChecks.length -1].wasSuccessful ? 'success' : 'error',
          lastTest: doc.getChecks.length === 0 ? '' : moment(doc.postChecks[doc.postChecks.length -1].timestamp).format('lll'),
          id: doc._id
        });
      }
      res.render('overview', {
        pageTitle: 'Apps Overview',
        pageName: 'overview',
        apps: appList
      });
    }
  });
};