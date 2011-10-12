var express = require('express');
var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOHQ_URL);
var app = express.createServer(express.logger());
app.use(express.bodyParser());

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    author    : String
  , text      : String
  , date      : {type:Date, default:Date.now}
});

var Message = mongoose.model('message', MessageSchema);

app.get('/', function(request, response) {
  Message.find({}, function(err, messages) {
    if (err) {
      console(err);
    }
    response.render('room.jade', {locals: {messages: messages}});
  });
});

app.post('/:room', function(request, response) {
  var text = request.body.text;
  var msg = new Message({text: text});
  msg.save(function(err) {
    console.log(err);
  });
  response.json(msg);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});