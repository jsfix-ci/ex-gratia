const GitRepo = require('../lib/git-repo');
const ContributorStats = require('../lib/stats');
const { GITLOG } = require('../fixtures/git');

describe('stats', () => {

	test('computes the expected statistics', () => {
		const repo = new GitRepo();
		const log = repo.parseLog({log: GITLOG});
		const stats = new ContributorStats({log});

		expect(stats.insertions).toEqual(122);
		expect(stats.deletions).toEqual(24);
		expect(stats.total).toEqual(146);

		expect(stats.contributors['iambipedal@gmail.com']).toEqual({
			author: 'iambipedal@gmail.com',
			insertions: 80,
			deletions: 3,
			total: 83,
			insertionsPct: 80/122,
			deletionsPct: 3/24,
			totalPct: 83/146
		});
	});

});
