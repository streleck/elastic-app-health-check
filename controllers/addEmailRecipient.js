module.exports = (req, res, next) => {

  const AppToTest = require('../models/AppToTest');

  AppToTest.findOneAndUpdate(
    { _id: req.body.appId }, 
    { $push: { emails: req.body.newEmailAddress }},
    function(err, doc){
      if(err){
        console.log(err)
        res.render('errorPage', {
          pageTitle: 'Database Error',
          pageName: 'errorPage',
          message: 'There was an error updating this record in the database.'
        });
      }
      else {
        res.redirect('/details/' + req.body.appId);
      };
    }
  )
}