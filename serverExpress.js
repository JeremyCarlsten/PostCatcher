var express = require('express');
var bodyParser = require('body-parser');
var mailer   = require("mailer");
var validator = require('mandrill-webhook-validator');
 
// var extend = require('util')._extend;
var WEBHOOK_URL = 'http://jeremycarlsten.koding.io/post'
var app = express();
var postList = [];
var fullRequest = {};

app.use(bodyParser());
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (request, response) {
    console.log("someone visited '/' ");
    response.sendFile(__dirname + '/views/homepage.html');
});

app.get('/poster', function (request, response) {
    console.log("someone visited '/poster' ");
    response.sendFile(__dirname + '/views/poster.html');
});

app.post('/post', function(request, response){
        fullRequest = request.body;
        // console.log(request);
    // if(checkSignature(request.headers['x-mandrill-signature'], request.headers)){
    var result = validator.makeSignature("Um2XU9D8BAHaFj9YWl9oLg", WEBHOOK_URL, request.body);
    console.log(result);
    console.log(request.get('X-Mandrill-Signature'));
    if(request.get('X-Mandrill-Signature') === result){
        console.log("You've got mail!");
        console.log("posting: " + request.body);
        // var combined = extend(request.body, request.headers);
        postList.push(request.body);
        console.log("new list: " + postList );
        
        response.redirect(200, "/");
    }else{
        console.log("Bad Signature!")
        response.redirect(402, "/");
    }
});

app.get('/postList', function(request, response){
    response.type('JSON');
   response.json(postList);
});


function checkSignature(mandrillSignature, params){
    console.log(params)
    var calculatedSignature = WEBHOOK_URL  
    for(var param in params){
     calculatedSignature += param
     console.log(calculatedSignature);
    }
    
    mandrillSignature === calculatedSignature
}
app.get('/fullRequest', function(request, response){
  response.send(fullRequest);
});

app.get('/sendEmails', function(request, response){
    console.log("Sending Email..");
mailer.send(
  { host:           "smtp.mandrillapp.com"
  , port:           587
  , to:             "jeremyNotReallyHere@exampleEmail.com"
  , from:           "you@yourdomain.com"
  , subject:        "Mandrill knows Javascript!"
  , body:           "Hello from NodeJS!"
  , authentication: "login"
  , username:       'jeremy@jeremycarlsten.com'
  , password:       'fzV9ZwmZJGCqFp8X97ryTQ'
  }, function(err, result){
    if(err){
      console.log(err);
    }
  }
);

response.type('JSON');
response.json(postList);
});

app.get('/clearPostList', function(request, response){
    console.log('Clearing Posts...');
    postList = [];
    response.type('JSON');
   response.json(postList);
});

var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Post Catcher listening at http://%s:%s', host, port);

});