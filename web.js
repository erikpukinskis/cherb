var express = require('express');
var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOHQ_URL);
var app = express.createServer(express.logger());

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Message = new Schema({
    author    : String
  , text      : String
  , date      : Date
});

app.get('/', function(request, response) {
  response.send('Cherb!');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});