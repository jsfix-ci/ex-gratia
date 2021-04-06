const EventEmitter = require('events');

module.exports = function Getter({response, error, statusCode = 200}) {
	const _this = new EventEmitter();

	_this.calls = [];

	_this.get = (url, options, callback) => {
		_this.calls.push({url, options, callback});
		setTimeout(() => {
			if (error || !response) {
				_this.emit('error', new Error(error));
			} else {
				_this.statusCode = statusCode;
				callback(_this);
				_this.emit('data', response);
				_this.emit('end');
			}
		}, 1);
		return _this;
	};

	return _this;
};
