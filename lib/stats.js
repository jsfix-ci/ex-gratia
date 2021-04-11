class ContributorStats {

	contributors = {};

	constructor({log}) {
		let logTotalLinesChanged = log.insertions + log.deletions;
		log.commits.forEach(commit => {
			let totalLinesChanged = commit.insertions + commit.deletions;
			if (this.contributors[commit.author]) {
				let c = this.contributors[commit.author];
				c.insertions += commit.insertions;
				c.deletions += commit.deletions;
				c.total += totalLinesChanged;
				c.insertionsPct = c.insertions/log.insertions;
				c.deletionsPct = c.deletions/log.deletions;
				c.totalPct = c.total/logTotalLinesChanged;
			} else {
				this.contributors[commit.author] = {
					author: commit.author,
					insertions: commit.insertions,
					deletions: commit.deletions,
					total: totalLinesChanged,
					insertionsPct: commit.insertions/log.insertions,
					deletionsPct: commit.deletions/log.deletions,
					totalPct: totalLinesChanged/logTotalLinesChanged
				};
			}
		});
	};

};

module.exports = ContributorStats;
