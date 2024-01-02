const express = require('express');
const app = express();

const ejs = require('ejs');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('./functions/formatMessage');

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render('index', {
		name: req.query.name,
	});
});

app.get('/chat', (req, res) => {
	res.render('chat', {
		name: req.query.name,
		room: req.query.room,
	});
});

app.post('/chat', (req, res) => {
	const { chatName, room } = req.body;
	if (room.length === 0) res.redirect(`/?name=${chatName}&room=null`);
	else res.redirect(`/chat?name=${chatName}&room=${room}`);
});

const ADMIN = 'ADMIN';
io.on('connection', (socket) => {
	const { name, room } = socket.handshake.query; // get the name and room values from the query string set up on client
	socket.on('joinRoom', () => {
		const user = getActiveUser(socket.id, name, room);
		const joinMssg = formatMessage(ADMIN, `Welcome ${user.name} to the chat room`);
		socket.join(user.room);
		io.to(user.room).emit('message-recieved', { ...joinMssg, type: 'broadcast' });
		socket.on('send-message', (data) => {
			const formatedMssg = formatMessage(name, data);
			socket.broadcast
				.to(user.room)
				.emit('message-recieved', { ...formatedMssg, type: 'broadcast' });
			socket.emit('message-recieved', { ...formatedMssg, type: 'user' });
		});
	});
});

const userState = {
	users: [],
	setUsers: function (newUsers) {
		this.users = newUsers;
	},
};

const getActiveUser = (id, name, room) => {
	user = { id, name, room };
	userState.setUsers([...userState.users.filter((user) => user.id !== id), user]);
	return user;
};

PORT = 3000 || process.env.PORT;
httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
