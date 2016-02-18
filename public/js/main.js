$(function() {

	var socket = io();

	var loginPage = $('#userPage');
	var chatPage = $('#chatPage');
	var messageForm = $('#messageForm');
	var userForm = $('#userForm');
	var messages = $('#messages');

	var username;
	var userColor;

	// JQuery DOM Manipulation
	$(document).ready(function() {
		$('input').focus();
		chatPage.hide();
		loginPage.show();
	});

	messageForm.submit(function() {
		message = $('#m').val();
		socket.emit('new message', message);
		$('#m').val('');
		return false;
	});

	userForm.submit(function() {
		if ($('#user').val() == '')
		{
			$('#setNameBtn').css({'color': '#CF040C', 'border-style': 'solid', 'border-color': '#CF040C'});
			$('#setNameBtn').text('Enter a username!');
			return false;
		}
		
		$('#setNameBtn').text('Loading...');
		$('#setNameBtn').css({'color': '#DDAF0D', 'background-color': '#848484'});
		setUsername();
		$('#user').val('');
		return false;
	});

	// General functions

	// Prevents input from having injected markup
	function cleanInput (input) {
		return $('<div/>').text(input).text();
	}

	// set user
	function setUsername() {
		username = cleanInput($('#user').val().trim());
		attemptLogin(username);
	}

	// set display color of user
	function setUserColor(username) {
		var colorHash = new ColorHash();
		var colorHex = colorHash.hex(username);
		return colorHex;
	}

	// login
	function attemptLogin(username) {
		if (username) {
			loginPage.fadeOut(800);
			chatPage.show();
			$('#m').focus();

			socket.emit('user login', username);
		}
	}

	// concatenate message
	function createMessage(data) {
		var user = $('<span class="userDisplay"/>').text(data.username + ': ').css('color', setUserColor(data.username));
		var msg = $('<span class="messageText"/>').text(data.message);
		var fullMessage = $('<li/>').append(user, msg);
		return fullMessage;
	}

	// jQuery Events
	$('#user').focus(function() {
		$('#setNameBtn').css({'color': '#2F394B', 'background-color': '#A1A1A1', 'border-style': 'none'});
		$('#setNameBtn').text('Set Name');
	});


	// Socket Events
	socket.on('chat message', function(data) {
		var fullMessage = createMessage(data);
		messages.append(fullMessage[0]);
		messages[0].scrollTop = messages[0].scrollHeight;
	});

	socket.on('newUser', function(data) {
		var userCountStr = data.userTotal > 1 ? 'There are currently ' + data.userTotal + ' users.' :
							'There is currently ' + data.userTotal + ' user.';
		messages.append($('<li>').addClass('log').text(data.username + ' joined the chat. ' + userCountStr));
	});

	socket.on('userLogout', function(data) {
		var userCountStr = data.userTotal > 1 ? 'There are currently ' + data.userTotal + ' users.' :
							"It's just you left...";
		messages.append($('<li>').addClass('log').text(data.username + ' left the chat. ' + userCountStr));
	});

});


