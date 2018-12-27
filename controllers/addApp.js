module.exports = (req, res, next) => {

  const AppToTest = require('../models/AppToTest');
  const monitorApp = require('../monitorApp');

  var newApp = new AppToTest({
    displayName: req.body.name,
    url: req.body.url,
    displayUrl: req.body.url.split('@')[1] ? req.body.url.split('@')[1] : req.body.url,
    emails: req.body.email.split(',')
  });
  newApp.save(function(err, doc) {
    if(err){
      console.log(err);
      res.render('errorPage', {
        pageTitle: 'Database Error',
        pageName: 'errorPage',
        message: 'There was an error saving record to database.'
      });
    }
    else {
      monitorApp(doc);
      res.redirect('/');
    }
  });
}