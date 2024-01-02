const moment = require('moment');

function formatMessage(name, data) {
	return {
		name,
		data,
		sendAt: moment().format('h:mm a'),
	};
}

// maintain all users info/state
const userState = {
	users: [],
	setUsers: function (newUsers) {
		this.users = newUsers;
	},
};

const getActiveUser = (id, name, room) => {
	user = { id, name, room };
	userState.setUsers([...userState.users.filter((user) => user.name !== name), user]);
	return user;
};

const getUsersInRoom = (room) => {
	return userState.users.filter((user) => user.room === room);
};
const userLeave = (name) => {
	const index = userState.users.findIndex((user) => user.name === name);
	if (index !== -1) return userState.users.splice(index, 1)[0];
};

module.exports = { formatMessage, getActiveUser, getUsersInRoom, userLeave };
