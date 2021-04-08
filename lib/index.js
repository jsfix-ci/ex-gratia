const { exec } = require('child_process');
const GH = require('./github');

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

	let waits = 0;
	let outputs = {};
	let defaultProfile = {login: 'svidgen', url: 'https://api.github.com/users/svidgen'};
	function setContributor(profile) {
		waits--;
		outputs[email] = {
			linesChanged: contributors[email],
			percentContributed: contributors[email]/totalLinesChanged,
			profile: profile || defaultProfile
		};
		if (waits === 0) {
			console.log(JSON.stringify(outputs, null, 2));
		}
	}

	// TODO: refactor into a linear queue processor to avoid slamming GH
	// and getting us blocked ... :( ... 
	let gh = new GH();
	for (var email in contributors) {
		waits++;
		gh.find({email}).then(setContributor);
	}

});
