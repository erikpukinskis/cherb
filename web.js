var express = require('express');
var app = express.createServer(express.logger());
var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOHQ_URL);
var dateFormat = require('dateformat');
var io = require('socket.io').listen(app);

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "jf93aj90daadt34sefj90feaj90aajd90sj9" }));

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});


/* Helpers */

function slugify(str) {
  return str;
}

/* Schema */

var Schema   = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    name      : String
  , text      : String
  , date      : {type:Date, default:Date.now}
  , room      : String
});

var RoomSchema = new Schema({
    slug      : {type:String, unique:true, validate: /[a-z][a-z-]*/, set: slugify}
})

var Message = mongoose.model('message', MessageSchema);
var Room    = mongoose.model('room', RoomSchema);



/* Sockets */

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


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

app.post('/messages', function(request, response) {
  var msg = new Message(request.body);
  msg.save(function(err) {
    console.log(err);
  });
  response.json(msg);
}); 

app.get('/:room/messages.json', function(req,res) {
  Message.find({room: req.params.room}, function(err, messages) {
    if (err) {
      console.log(err);
    }
    res.json(messages);
  });
});

app.get('/:room', function(req, res) {
  var room = req.params.room;
  var name = req.session.name;
  if (!name) {
    req.session.room = room;
    res.redirect('/name');  
  } else {
    res.render('room.jade', {locals: {name: name, room: room}});
  }
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});