var express = require('express');
var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOHQ_URL);
var app = express.createServer(express.logger());
app.use(express.bodyParser());

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Message = new Schema({
    author    : String
  , text      : String
  , date      : Date
});

app.get('/', function(request, response) {
  response.render('room.jade');
});

app.post('/:room', function(request, response) {
//  var msg = new Message();
//  msg.my.text = request.params.message
  response.send("message: " + request.body.message);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});