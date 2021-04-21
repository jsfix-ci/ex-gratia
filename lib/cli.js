const fs = require('fs');
const path = require('path');
const process = require('process');

const ContributorStats = require('./stats');
const GH = require('./github');
const GitRepo = require('./git-repo')

const gh = new GH();
const repo = new GitRepo();

let config = {
	google_adsense: {
		id: "ca-pub-6115341109827821"
	}
};

try {
	config = require(path.join(process.cwd(), 'ex-gratia-config.json'));
} catch (err) {
	console.log('No config found. Proceeding with ex-gratia defaults.');
}

const index = {
	googleAds: ({contributors}) => {
		return {
			defaultId: config.google_adsense.id,
			contributors: Object.values(contributors).map(contributor => {
				const { profile: { google_adsense: {
					publisher_id, allowed_sites = []
				}}, totalPct} = contributor;

				if (publisher_id
					&& allowed_sites.includes(config.site_domain)
				) {
					return {
						id: publisher_id,
						weight: contributor.totalPct
					};
				} else {
					return {
						id: config.google_adsense.id,
						weight: c.totalPct
					};
				}
			})
		};
	},
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
		const google_ads = index.googleAds({contributors: stats.contributors});

		const outputs = { summary, google_ads };

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

module.exports = index;