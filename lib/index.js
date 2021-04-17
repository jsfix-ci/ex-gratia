const fs = require('fs');

const ContributorStats = require('./stats');
const GH = require('./github');
const GitRepo = require('./git-repo')

const gh = new GH();
const repo = new GitRepo();

module.exports = {
	all: async ({outputDir, limit}) => {
		const stats = new ContributorStats({
			log: repo.parseLog({log: await repo.getLog(), limit})
		});
		await Promise.all(Object.values(stats.contributors).map(async c => {
			c.githubUser = await gh.find({email: c.author});
			c.profile = c.githubUser ? (
				(await gh.get({username: c.githubUser.login})) || {}
			) : {};
			return;
		}));
		const summary = { stats };
		const outputs = { summary }

		if (outputDir) {
			fs.mkdirSync(outputDir, { recursive: true });
			Object.entries(outputs).forEach(([k,v]) => {
				const filename = `${outputDir}/${k}.json`;
				console.log(`Writing ${filename} ...`);
				fs.writeFileSync(filename, JSON.stringify(v, null, 2));
			});
		} else {
			console.log(JSON.stringify(outputs, null, 2));
		}
	},
	'install-gh-action': async () => {
		// adds a script to .github/... to run post-push actions to run
		// ex-gratia.
	}
};
