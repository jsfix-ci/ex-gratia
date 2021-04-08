const EventEmitter = require('events');

module.exports = function Getter({response, error, wait, statusCode = 200}) {
	const _this = new EventEmitter();

	let initializedAt = new Date();
	let limitUntil = new Date(initializedAt.getTime() + (wait || 0) * 1000);
	let limitUntilSec = Math.floor(limitUntil.getTime()/1000);

	_this.calls = [];

	_this.get = (url, options, callback) => {
		_this.calls.push({url, options, callback});

		setTimeout(() => {
			let responseOverride;
			let now = (new Date()).getTime();
			_this.statusCode = statusCode;
			if (limitUntil.getTime() >= now) {
				responseOverride = '{"message": "API Rate limit exceeded for ..."}';
				_this.statusCode = 403;
				_this.headers = [
					'X-RateLimit-Limit: 10',
					'X-RateLimit-Remaining: 0',
					`X-RateLimit-Reset: ${limitUntilSec}`
				].join("\n");
			} else {
				responseOverride = null;
				_this.statusCode = statusCode;
				_this.headers = '';
			}

			if (error || !response) {
				_this.emit('error', new Error(error));
			} else {
				callback(_this);
				_this.emit('data', responseOverride || response);
				_this.emit('end');
			}
		}, 1);
		return _this;
	};

	return _this;
};
