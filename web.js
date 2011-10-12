var express = require('express');
var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOHQ_URL);
var app = express.createServer(express.logger());

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "jf93aj90daadt34sefj90feaj90aajd90sj9" }));

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    name      : String
  , text      : String
  , date      : {type:Date, default:Date.now}
});

var Message = mongoose.model('message', MessageSchema);

app.get('/', function(req, res) {
  req.session.name = "erik"
  if (!req.session.name) {
    res.redirect('/name');  
  } else {
    Message.find({}, function(err, messages) {
      if (err) {
        console.log(err);
      }
      res.render('room.jade', {locals: {messages: messages, name: req.session.name}});
    });
  }
});

app.get('/name', function(req,res) {
  res.render('name.jade');
})

app.post('/name', function(req,res) {
  req.session.name = req.body.name
  res.redirect('/');
});

app.post('/:room', function(request, response) {
  var msg = new Message(request.body);
  msg.save(function(err) {
    console.log(err);
  });
  response.json(msg);
});

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});