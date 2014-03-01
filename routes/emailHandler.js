// include our dependencies
var jadeCompiler = require('../lib/jadeCompiler');
var mailer = require('../lib/mailer');


exports.sendMail = function(req, res){
  // you probably won't need this exactly how it is but its always good to do server side validation before using the data.
  if(!req.body.toEmail || !req.body.firstName || !req.body.lastName){
    return res.send(422, 'Missing fields! Please be sure to fill out all form data.');
  }

  //fromAddress, toAddress, subject, content, next
  var FROM_ADDRESS = 'accounts@test.com';
  var TO_ADDRESS = req.body.toEmail;
  var SUBJECT = req.body.firstName + ', check out this test email from my cool node.js app.';

  // relative to views/ directory - don't include extension!
  var RELATIVE_TEMPLATE_PATH = 'emails/confirmation';

  // get data from db, request, or whatever... For this example we just grab it from data submitted in the form and add a placeholder title and list
  var data = {
    title: 'Test Email Title Goes Here',
    email: req.body.toEmail,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    rightColumnList: ['item #1', 'item #2', 'item #3', 'item #4']
  };

  // get compiled template first
  jadeCompiler.compile(RELATIVE_TEMPLATE_PATH, data, function(err, html){
    if(err){
      throw new Error('Problem compiling template(double check relative path): ' + RELATIVE_TEMPLATE_PATH);
    }
    // now we have the html populated with our data so lets send an email!
    mailer.sendMail(FROM_ADDRESS, TO_ADDRESS, SUBJECT, html, function(err, success){
      if(err){
        throw new Error('Problem sending email to: ' + req.body.toEmail);
      }
      // Yay! Email was sent, now either do some more stuff or send a response back to the client
      res.send('Email sent: ' + success);
    });
  });
};