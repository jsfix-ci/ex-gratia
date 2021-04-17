const EventEmitter = require('events');

module.exports = function Getter({response, error, wait, statusCode = 200}) {
	const _this = new EventEmitter();

	let initializedAt = new Date();
	let limitUntil = wait ?
		new Date(initializedAt.getTime() + (wait || 0) * 1000) :
		new Date(2012, 11, 20)
	;
	let limitUntilSec = wait ? Math.floor(limitUntil.getTime()/1000) : 0;

	_this.calls = [];

	_this.get = (url, options, callback) => {
		_this.calls.push({url, options, callback});

		let _response = response;
		if (typeof(response) === 'object') {
			_response = response[url];
		}

		setTimeout(() => {
			let responseOverride;
			let now = (new Date()).getTime();
			_this.statusCode = statusCode;
			if (limitUntil.getTime() >= now) {
				responseOverride = '{"message": "API Rate limit exceeded for ..."}';
				_this.statusCode = 403;
				_this.headers = {
					'x-ratelimit-limit': '10',
					'x-ratelimit-remaining': '0',
					'x-ratelimit-reset': String(limitUntilSec)
				};
			} else {
				responseOverride = null;
				_this.statusCode = statusCode;
				_this.headers = {};
			}

			if (error || !_response) {
				_this.emit('error', new Error(error));
			} else {
				callback(_this);
				_this.emit('data', responseOverride || _response);
				_this.emit('end');
			}
		}, 1);
		return _this;
	};

	return _this;
};
