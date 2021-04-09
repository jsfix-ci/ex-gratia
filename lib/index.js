const { exec } = require('child_process');
const GH = require('./github');

const gh = new GH();

exec('git log --shortstat', (err, stdout, stderr) => {
	if (err) {
		throw err;
	}

	const maxCommitsToCount = 500;
	let commitsCounted = [];

	const hashLine = /^commit (\w+)/;
	const authorLine = /^Author: [\w\s]+<(.+)>$/;
	const linesChanged = /^ (\d+) files? changed(, (\d+) insertions?\(\+\))?(, (\d+) deletions?\(-\))?$/;

	const contributors = {};
	let totalLinesChanged = 0;
	let currentAuthor = null;
	let currentHashLine = null;

	stdout.split(/\n/).some(line => {
		if (commitsCounted.length >= maxCommitsToCount) return true;
		let matches;
		if (matches = line.match(hashLine)) {
			currentHashLine = matches[1];
		} else if (matches = line.match(authorLine)) {
			currentAuthor = matches[1];
		} else if (matches = line.match(linesChanged)) {
			let linesChanged = 
				Number(matches[3] || 0) // insertions
				+ Number(matches[5] || 0) // deletions
			;
			contributors[currentAuthor] = (contributors[currentAuthor] || 0)
				+ linesChanged;
			totalLinesChanged += linesChanged;
			commitsCounted.push({
				author: currentAuthor,
				commit: currentHashLine,
				changes: line
			});
			currentAuthor = null;
		}
		return false;
	});

	let outputs = {};
	let defaultGithubUser = {
		login: 'svidgen',
		url: 'https://api.github.com/users/svidgen'
	};

	let waits = 0;
	async function setContributor(email, user) {
		outputs[email] = {
			linesChanged: contributors[email],
			percentContributed: contributors[email]/totalLinesChanged,
			githubUser: user || defaultGithubUser,
			profile: user.login ? (await gh.get({username: user.login})) : {}
		};
		return outputs[email];
	};

	// TODO: refactor into a linear queue processor to avoid slamming GH
	// and getting us blocked ... :( ... 
	Promise.all(Object.keys(contributors).map(
		email => gh.find({email}).then(user => setContributor(email, user))
	)).then(() => {
		console.log(JSON.stringify(outputs, null, 2));
	}).catch(err => {
		console.error(err);
	});

});
