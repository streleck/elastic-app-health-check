module.exports = function(appRecord){
  
  const axios = require('axios');
  const https = require('https');
  const sgMail = require('@sendgrid/mail');
  var AppToTest = require('./models/AppToTest');

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  // To allow http requests
  const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  function sendEmails(subjectText, bodyText){ 
    for(let address of appRecord.emails){
      let msg = {
        to: address,
        from: 'streleck@gmail.com',
        subject: 'Your Vizion.ai ELK app, ' + (appRecord.displayName ? appRecord.displayName : appRecord.displayUrl) + ', ' + subjectText,
        text: 'App url: ' + appRecord.url + '\n \n' + bodyText,
      };
      sgMail.send(msg);
    }
  };

  function logPostCheck(status, errorObject){
    console.log('trying to update post checks');
    AppToTest.findOneAndUpdate(
      { _id: appRecord._id }, 
      { $push: { postChecks: 
        { 
          wasSuccessful: status,
          timestamp: Date.now(),
          errorObject: errorObject
        }
      }},
      function(err, doc){
        if(err){
          console.log(err)
        }
        else {
          //console.log(doc)
        };
      }
    )
  };

  function logGetCheck(status, errorObject){
    console.log('trying to update get checks');
    AppToTest.findOneAndUpdate(
      { _id: appRecord._id }, 
      { $push: { getChecks: 
        { 
          wasSuccessful: status,
          timestamp: Date.now(),
          errorObject: errorObject
        }
      }},
      function(err, doc){
        if(err){
          console.log(err)
        }
        else {
          //console.log(doc)
        };
      }
    )
  };

  // Set up an initial 'put' to test later for data fidelity
  axios({
    method:'put',
    url: appRecord.url + '/tests/_doc/1',
    data: {"fidelityTest": "ChesapeakeScooter"},
    headers: {'Content-Type':'application/json'},
    httpsAgent: agent 
  })
  .then(function(response) {
    // If successful, start a testing interval on that url
    let monitor = setInterval(function(){
      // Get most recent status of app
      AppToTest.findOne({_id: appRecord._id}, function(err, doc){
        // If record isn't in DB, cancel the monitor
        if(err) {
          clearInterval(monitor);
          return;
        }
        else {
          let getStatus = doc.getChecks.length > 0 ? doc.getChecks[doc.getChecks.length -1].wasSuccessful : true;
          let postStatus = doc.postChecks.length > 0 ? doc.postChecks[doc.postChecks.length -1].wasSuccessful : true;
          // Post test
          axios({
            method:'post',
            url: appRecord.url + '/tests/_doc',
            data: {"datapoint": "test"},
            headers: {'Content-Type':'application/json'},
            httpsAgent: agent 
          })
          .then(function(response) {
            console.log('POST Success');
            if(!postStatus){
              sendEmails(
                'is functioning for POST',
                'After having previously failed a POST attempt, this app has now successfully accepted a POST.'
              );
            }
            logPostCheck(true, {});
          })
          .catch(function(error) {
            //console.log('POST fail!!!!! \n', error);
            console.log('POST fail!');
            logPostCheck(false, error);
            sendEmails(
              'has failed a POST attempt',
              error
            );
          });

          // GET test
          axios({
            method:'get',
            url: appRecord.url + '/tests/_doc/1',
            headers: {'Content-Type':'application/json'},
            httpsAgent: agent 
          })
          .then(function(response) {
            // Read data to see if it has maintained fidelity
            console.log('get success. get status: ', getStatus);
            if(response.data._source.fidelityTest !== "ChesapeakeScooter") {
              sendEmails(
                'has failed a data fidelity check',
                'This app was successfully able to return data from a GET request, but that data did not match what was expected.'
              );
              logGetCheck(false, {});
            }
            else{
              if(getStatus === false){
                sendEmails(
                  'is functioning for GET',
                  'After having previously failed a GET attempt, this app has now successfully accepted a GET and returned the expected data.'
                );
              }
              logGetCheck(true, {});
            }
          })
          .catch(function(error) {
            //console.log('get fail!!!! ', error);
            console.log('GET fail');
            sendEmails(
              'has failed a GET attempt',
              error
            );
            logGetCheck(false, error);
          })
        }
      });
    }, (1000 * 60 * 5));
  })
  // Initial put has failed, email about the failure
  .catch(function(error) {
    //console.log('initial fail ', error);
    console.log('initial fail');
    sendEmails(
      'app is not functioning',
      'This app was not successful in an initial PUT test and will not continue to be tested.'
      + '\n\n' //+ error
    );
  });
}

