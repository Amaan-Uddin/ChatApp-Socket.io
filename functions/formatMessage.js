const moment = require('moment');

function formatMessage(name, data) {
	return {
		name,
		data,
		sendAt: moment().format('h:mm a'),
	};
}

module.exports = formatMessage;
