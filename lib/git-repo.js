const { exec } = require('child_process');

function GitRepo() {
	this.getLog = async () => {
		let log = await new Promise((resolve, reject) => {
			exec('git log --shortstat --no-color', (err, stdout, stderr) => {
				if (err) {
					reject(err);
				}
				resolve(stdout);
			});
		});
		return log;
	};

	this.parseLog = ({log, limit = 500}) => {
		const hashLine = /^commit (\w+)/;
		const authorLine = /^Author: [\w\s]+<(.+)>$/;
		const linesChanged = /^ (\d+) files? changed(, (\d+) insertions?\(\+\))?(, (\d+) deletions?\(-\))?$/;

		let commits = [];
		let totalInsertions = 0;
		let totalDeletions = 0;

		let currentAuthor = null;
		let currentHashLine = null;
		let insertions = 0;
		let deletions = 0;

		log.split(/\n/).some(line => {
			if (commits.length >= limit) return true;

			let matches;
			if (matches = line.match(hashLine)) {
				currentHashLine = matches[1];
			} else if (matches = line.match(authorLine)) {
				currentAuthor = matches[1];
			} else if (matches = line.match(linesChanged)) {
				insertions = Number(matches[3] || 0);
				totalInsertions += insertions;

				deletions = Number(matches[5] || 0);
				totalDeletions += deletions;

				commits.push({
					author: currentAuthor,
					commit: currentHashLine,
					insertions, deletions,
				});

				currentAuthor = null;
			}
			return false;
		});

		return { commits, totalInsertions, totalDeletions };
	};
}

module.exports = GitRepo;
