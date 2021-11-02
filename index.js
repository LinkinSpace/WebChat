const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var users = [];
var username;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('login', function(tempUsername){
    username = tempUsername + socket.id.substring(0,4);
    socket.userIndex = users.length;
    socket.nickname = username;
    users.push(username);
    io.emit('login', socket.nickname, users.length);
  });

  socket.on('chat message', function (msg) {
    var tempDate = new Date();
    var time = tempDate.getHours() + ":" + tempDate.getMinutes();
    io.emit('chat message', socket.nickname, time, msg);
  });

  socket.on('disconnect', function(){
    users.splice(socket.userIndex, 1);
    socket.broadcast.emit('logout', socket.nickname, users.length);
  });

  socket.on('sendImg', function(_imgBase64){
    var tempDate = new Date();
    var time = tempDate.getHours() + ":" + tempDate.getMinutes();
    io.emit('receiveImg', socket.nickname, time, _imgBase64);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
