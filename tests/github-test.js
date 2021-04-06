const GH = require('../lib/github.js');
const Getter = require('../fakes/fake-getter.js');

const SEARCH_RESULT = `{
  "total_count": 1,
  "incomplete_results": false,
  "items": [
    {
      "login": "svidgen",
      "id": 8375502,
      "node_id": "MDQ6VXNlcjgzNzU1MDI=",
      "avatar_url": "https://avatars.githubusercontent.com/u/8375502?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/svidgen",
      "html_url": "https://github.com/svidgen",
      "followers_url": "https://api.github.com/users/svidgen/followers",
      "following_url": "https://api.github.com/users/svidgen/following{/other_user}",
      "gists_url": "https://api.github.com/users/svidgen/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/svidgen/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/svidgen/subscriptions",
      "organizations_url": "https://api.github.com/users/svidgen/orgs",
      "repos_url": "https://api.github.com/users/svidgen/repos",
      "events_url": "https://api.github.com/users/svidgen/events{/privacy}",
      "received_events_url": "https://api.github.com/users/svidgen/received_events",
      "type": "User",
      "site_admin": false,
      "score": 1.0
    }
  ]
}`;

describe('GitHub client', () => {
	test('can find users', done => {
		let getter = new Getter({response: SEARCH_RESULT});
		let client = new GH({getter});
		client.find({email: 'svidgen@example.com'}).then(data => {
			expect(data.login).toEqual('svidgen');
			done();
		}).catch(err => {
			done(err);
		});
	});
});
