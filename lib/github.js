const request = require('./request.js');

const GH = function({getter}) {
	this.find = ({email}) => {
		return request.getJSON({
			getter,
			url: `https://api.github.com/search/users?q=${email}+in:email`
		}).then(results => {
			if (results.total_count === 1) {
				return results.items[0];
			} else {
				return null;
			}
		});
	};
};

module.exports = GH;
