const request = require('./request.js');

const GH = function({getter}) {
	this.find = async function({email}) {
		return request.getJSON({
			getter,
			url: `https://api.github.com/search/users?q=${email}+in:email`
		}).then(results => {
			if (results.total_count === 1) {
				return results.items[0];
			} else {
				return null;
			}
		}).catch(err => {
			if (err.code == 403
				&& err.headers['X-RateLimit-Remaining'] == '0'
				&& err.headers['X-RateLimit-Reset']
			) {
				let retryAt = new Date(err.headers['X-RateLimit-Reset'] * 1000);
				let now = new Date();
				let wait = (retryAt.getTime() - now.getTime())
					+ 1000 + 100 * Math.random()
				;
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						this.find({email})
							.then(resolve)
							.catch(reject)
						;
					}, wait);
				});
				return p;
			} else {
				throw err;
			}
		});
	};
};

module.exports = GH;