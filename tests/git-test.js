const GitRepo = require('../lib/git-repo.js');
const {
	GITLOG,
	EXPECTED_JSON,
	EXPECTED_JSON_LIMIT_2
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
		expect(JSON.stringify(stats, null, 2)).toEqual(EXPECTED_JSON);
	});

	test('can parse logs up to a defined limit', () => {
		const repo = new GitRepo();
		const stats = repo.parseLog({log: GITLOG, limit: 2});
		expect(stats).toBeTruthy();
		expect(JSON.stringify(stats, null, 2)).toEqual(EXPECTED_JSON_LIMIT_2);
	});

});
