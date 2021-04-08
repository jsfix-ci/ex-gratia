const http = require('http');
const https = require('https');

const request = {
	get: ({url, headers, authToken, getter}) => {
		return new Promise((resolve, reject) => {
			getter = getter || (url.match(/^https/) ? https : http);
			let data = '';
			if (authToken) {
				headers.Authorization = `Basic ${authToken}`;
			}
			getter.get(
				url,
				{ headers: {
					'User-Agent': 'ex-gratia',
					...headers,
				} },
				r => {
					r.on('data', d => {
						data += d
					});
					r.on('end', () => {
						if (r.statusCode !== 200) {
							let err = new Error(data);
							err.code = r.statusCode;
							err.headers = (r.headers || '')
								.split(/\n/)
								.reduce((o, line) => {
									let [k, v] = line.split(/: /);
									o[k] = v;
									return o;
								}, {})
							;
							reject(err);
						} else {
							resolve(data);
						}
					});
				}
			).on('error', (err) => {
				reject(err);
			});
		});
	},
	getJSON: ({url, headers, authToken, getter}) => {
		return request.get({url, headers, authToken, getter}).then(body => {
				return JSON.parse(body)
		});
	}
};

module.exports = request;
