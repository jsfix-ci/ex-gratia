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
		return request.get({url, headers, authToken, getter}).then(r => {
			return JSON.parse(r);
		})
	}
};

module.exports = request;
