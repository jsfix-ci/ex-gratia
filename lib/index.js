const summary = require('../data/summary');
const Google = require('./google');

class ExGratia {
	summary = summary;
	google = new Google();
};

module.exports = ExGratia;
