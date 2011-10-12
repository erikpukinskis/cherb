var express = require('express');
var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOHQ_URL);
var dateFormat = require('dateformat');
var app = express.createServer(express.logger());

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "jf93aj90daadt34sefj90feaj90aajd90sj9" }));

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});


/* Schema */

var Schema   = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    name      : String
  , text      : String
  , date      : {type:Date, default:Date.now}
  , room      : ObjectId
});

var RoomSchema = new Schema({
    slug      : {type:String, unique:true, validate: /[a-z][a-z-]*/, set: slugify}
})

var Message = mongoose.model('message', MessageSchema);
var Room    = mongoose.model('room', RoomSchema);


/* Controllers */

app.get('/', function(req,res) {
  res.render('index.jade');  
});

app.get('/name', function(req,res) {
  res.render('name.jade');
})

app.post('/rooms', function(req,res) {
  var room = new Room({slug: req.body.slug});
  room.save();
  res.redirect("/" + room.slug);
});

app.post('/name', function(req,res) {
  req.session.name = req.body.name
  res.redirect("/" + req.session.room);
}); 

app.get('/:room', function(req, res) {
  if (!req.session.name) {
    req.session.room = req.params.room
    res.redirect('/name');  
  } else {
    Message.find({}, function(err, messages) {
      if (err) {
        console.log(err);
      }
      res.render('room.jade', {locals: {messages: messages, name: req.session.name, room: req.params.room}});
    });
  }
});

app.post('/messages', function(request, response) {
  var msg = new Message(request.body);
  msg.save(function(err) {
    console.log(err);
  });
  response.json(msg);
});



/* Helpers */

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z -]*/, '').replace(/[ -]*/, '-').replace(/^-/, '');
}

function humanTime(time) {
  return dateFormat(time, "h:MMTT");
}
app.helpers({humanTime: humanTime});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});