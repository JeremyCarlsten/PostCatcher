var express = require('express');
var bodyParser = require('body-parser');
var mailer   = require("mailer");
// var extend = require('util')._extend;
var app = express();
var postList = [];
// var fullRequest = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (request, response) {
    console.log("someone visited '/' ");
    response.sendFile(__dirname + '/views/homepage.html');
});

app.post('/post', function(request, response){
    if(request.headers['x-mandrill-signature'] === 'a0tVc9qrv9KpJZ0/YU43AunPkBc='){
        console.log("You've got mail!");
        // fullRequest = request;
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


// app.get('/fullRequest', function(request, response){
//   response.send(fullRequest.headers);
// });

app.get('/sendEmails', function(request, response){
    console.log("Sending Email..");
mailer.send(
  { host:           "smtp.mandrillapp.com"
  , port:           587
  , to:             "example.someone.abcdefg@exampleEmail.com"
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