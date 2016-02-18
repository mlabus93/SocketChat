var express = require('express')
	, http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', function (req, res, next) {
	res.sendFile(__dirname + '/index.html');
});

var userCount = 0;

io.on('connection', function(socket) {
	
	var currentUser = false;

	socket.on('new message', function(message) {

		io.emit('chat message', {
			username: socket.username,
			message: message
		});
	});

	socket.on('user login', function(username) {
		if (currentUser)
			return;
		socket.username = username;
		userCount++;
		currentUser = true;

		socket.broadcast.emit('newUser', {
			username: socket.username,
			userTotal: userCount
		});
	});

	socket.on('disconnect', function() {
		if (currentUser) {
			userCount--;

			socket.broadcast.emit('userLogout', {
				username: socket.username,
				userTotal: userCount
			});
		}
	});
});

server.listen(3000, function() {
	console.log('Listening on port 3000');
});