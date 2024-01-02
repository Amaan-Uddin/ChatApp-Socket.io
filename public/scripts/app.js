const urlParams = new URLSearchParams(window.location.search); // searches for query string in URL

const socket = io('ws://localhost:3000', {
	query: {
		name: urlParams.get('name'),
		room: urlParams.get('room'),
	},
});
/*
 *These key-value pairs are used to pass parameters to the server during the handshake process when the WebSocket connection is being established.
 */

const messageBox = document.querySelector('.message-box');

function sendMessage(e) {
	e.preventDefault();
	const input = document.getElementById('message');
	if (input.value) {
		socket.emit('send-message', input.value);
		input.value = '';
		input.focus();
	}
}

function displayMessage({ name, data, sendAt, type }) {
	const div = document.createElement('div');
	div.innerHTML = `<span class="user-name">${name}</span><p class="mb-0 user-message">${data} <span class="send-date">${sendAt}</span></p>`;
	div.classList.add('message-tab');
	if (type === 'user') {
		div.classList.add('user-color');
	}
	messageBox.appendChild(div);
}

document.querySelector('form').addEventListener('submit', sendMessage);

socket.emit('joinRoom');
socket.on('message-recieved', (message) => {
	displayMessage(message);
	messageBox.scrollTop = messageBox.scrollHeight; // adjusts the scroll on the message box
});
