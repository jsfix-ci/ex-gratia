const GitRepo = require('../lib/git-repo.js');
const {
	GITLOG,
	EXPECTED_LOG,
	EXPECTED_LOG_LIMIT_2
} = require('../fixtures/git.js');

describe('git-repo', () => {

	test('can extract logs from CLI', async done => {
		const log = await (new GitRepo()).getLog();
		expect(log).toBeTruthy();
		done();
	});

	test('can parse logs', () => {
		const repo = new GitRepo();
		const stats = repo.parseLog({log: GITLOG});
		expect(stats).toBeTruthy();
		expect(stats).toEqual(EXPECTED_LOG);
	});

	test('can parse logs up to a defined limit', () => {
		const repo = new GitRepo();
		const stats = repo.parseLog({log: GITLOG, limit: 2});
		expect(stats).toBeTruthy();
		expect(stats).toEqual(EXPECTED_LOG_LIMIT_2);
	});

});
