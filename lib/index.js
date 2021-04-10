const GitRepo = require('./git-repo')
const GH = require('./github');

const gh = new GH();
const repo = new GitRepo();

const defaultGithubUser = {
	login: 'svidgen',
	url: 'https://api.github.com/users/svidgen'
};

// final script output
const outputs = {};

async function buildContributorStats(stats, contributor, user) {
	outputs[contributor.author] = {
		linesChanged: contributor,
		percentContributed: contributor/stats.totalLinesChanged,
		githubUser: user || defaultGithubUser,
		profile: user.login ? (await gh.get({username: user.login})) : {}
	};
	return {email: outputs[email]};
};

repo.getLog().then(stats => {
	let contributors = Object.entries(stats.contributors);
	let contributorStats = contributors.map(async contributor => {
		let user = await gh.find({email: contributor.author});
		return await buildContributorStats(stats, contributor, user);
	});
	let summary = Object.assign({}, ...contributorStats);
	console.log(JSON.stringify(summary, null, 2));
	/*
	Promise.all(Object.values(stats.contributors).map(async contributor =>
		gh.find({email: contributor.author})
			.then(async user => setContributor(stats, contributor, user))
	)).then(outputs => {
		console.log(JSON.stringify(outputs, null, 2));
	}).catch(err => {
		console.error(err);
	})
	*/
});
