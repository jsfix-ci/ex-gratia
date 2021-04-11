class ContributorStats {

	contributors = {};
	insertions = 0;
	deletions = 0;

	constructor({log}) {
		this.insertions = log.insertions;
		this.deletions = log.deletions;
		this.total = log.insertions + log.deletions;

		log.commits.forEach(commit => {
			let totalLinesChanged = commit.insertions + commit.deletions;
			if (this.contributors[commit.author]) {
				let c = this.contributors[commit.author];
				c.insertions += commit.insertions;
				c.deletions += commit.deletions;
				c.total += totalLinesChanged;
				c.insertionsPct = c.insertions/this.insertions;
				c.deletionsPct = c.deletions/this.deletions;
				c.totalPct = c.total/this.total;
			} else {
				this.contributors[commit.author] = {
					author: commit.author,
					insertions: commit.insertions,
					deletions: commit.deletions,
					total: totalLinesChanged,
					insertionsPct: commit.insertions/this.insertions,
					deletionsPct: commit.deletions/this.deletions,
					totalPct: totalLinesChanged/this.total
				};
			}
		});
	};

};

module.exports = ContributorStats;
