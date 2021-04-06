const { exec } = require('child_process');

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
			profile: profile
		};
		if (waits === 0) {
			console.log(JSON.stringify(outputs, null, 2));
			// console.log(JSON.stringify(commitsCounted, null, 2));
		}
	}

	for (var email in contributors) {
		waits++;
		try {
			let searchUrl = `https://api.github.com/search/users?q=${email}+in:email`;
							let matches = JSON.parse(data);
							if (matches.total_count === 1) {
								setContributor(matches.items[0]);
							} else {
								setContributor(defaultProfile);
		} catch (err) {
			console.log('err', err);
			setContributor(defaultProfile);
		}
	}

});
