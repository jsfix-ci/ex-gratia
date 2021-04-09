const request = require('./request.js');

const GH = function({getter = null} = {}) {
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
				&& err.headers['x-ratelimit-remaining'] == '0'
				&& err.headers['x-ratelimit-reset']
			) {
				let retryAt = new Date(err.headers['x-ratelimit-reset'] * 1000);
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

	this.get = async function({username}) {
		return request.getJSON({
			getter,
			url: `https://raw.githubusercontent.com/${username}/ex-gratia-profile/main/profile.json`
		}).then(profile => {
			if (typeof(profile) !== 'object') {
				return {error: "Profile was not of type `object`."};
			} else {
				return profile;
			}
		}).catch(err => {
			return {
				"error": "Could not find a parsable user profile.",
				"source": err.message,
				"bad_response": err.bad_response
			};
		});
	};
};

module.exports = GH;
