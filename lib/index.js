const ContributorStats = require('./stats');
const GH = require('./github');
const GitRepo = require('./git-repo')

const gh = new GH();
const repo = new GitRepo();

(async () => {
	const stats = new ContributorStats({
		log: repo.parseLog({log: await repo.getLog(), limit: 200})
	});
	await Promise.all(Object.values(stats.contributors).map(async c => {
		c.githubUser = await gh.find({email: c.author});
		c.profile = c.githubUser ? (
			(await gh.get({username: c.githubUser.login})) || {}
		) : {};
		return;
	}));
	let summary = { stats };
	console.log(JSON.stringify(summary, null, 2));
})();
