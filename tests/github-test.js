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

const EMPTY_SEARCH_RESULT = `{
	"total_count": 0,
	"incomplete_results": false,
	"items": []
}`;

const PROFILE_URL = "https://raw.githubusercontent.com/svidgen/ex-gratia-profile/main/profile.json";
const PROFILE_RESULT = `{
	"display_name": "Bob Jones",
	"google_adsense": {
		"publisher_id": "ca-pub-6115341109827821",
		"allowed_sites": [
			"https://www.thepointless.com",
			"https://mtg.deckanalyzer.com"
		]
	}
}`;

const NON_OBJECT_PROFILE_RESULT = `123`;
const MALFORMED_PROFILE_RESULT = 'this is not a JSON file at all!'

describe('GitHub client', () => {
	test('can find users by email address', done => {
		let getter = new Getter({response: SEARCH_RESULT});
		let client = new GH({getter});
		client.find({email: 'svidgen@example.com'}).then(data => {
			expect(data.login).toEqual('svidgen');
			done();
		}).catch(err => {
			done(err);
		});
	});
	
	test('returns `null` when not found by email', done => {
		let getter = new Getter({response: EMPTY_SEARCH_RESULT});
		let client = new GH({getter});
		client.find({email: 'svidgen@example.com'}).then(data => {
			expect(data).toBe(null);
			done();
		}).catch(err => {
			done(err);
		});
	});

	test('retries after rate limit reset as needed', done => {
		let getter = new Getter({
			response: SEARCH_RESULT,
			wait: 1
		});
		let client = new GH({getter});
		client.find({email: 'svidgen@example.com'}).then(data => {
			expect(data.login).toEqual('svidgen');
			expect(getter.calls.length).toEqual(2);
			done();
		}).catch(err => {
			done(err);
		});
	});

	test('can find user profile', done => {
		let getter = new Getter({response: { [PROFILE_URL]: PROFILE_RESULT }});
		let client = new GH({getter});
		client.get({username: 'svidgen'}).then(user => {
			expect(user.display_name).toEqual("Bob Jones");
			expect(user.google_adsense.publisher_id).toEqual(
				'ca-pub-6115341109827821'
			);
			done();
		}).catch(err => {
			done(err);
		});
	});

	test('does not mistakenly find some default profile', done => {
		let getter = new Getter({response: { [PROFILE_URL]: PROFILE_RESULT }});
		let client = new GH({getter});
		client.get({username: 'NOT-svidgen'}).then(user => {
			expect(user.error).toEqual(
				"Could not find a parsable user profile."
			);
			done();
		}).catch(err => {
			done(err);
		});
	});

	test('returns null when profile does not exist', done => {
		let getter = new Getter({response: '', statusCode: 404});
		let client = new GH({getter});
		client.get({username: 'whatever'}).then(user => {
			expect(user.error).toEqual(
				"Could not find a parsable user profile."
			);
			done();
		}).catch(err => {
			done(err);
		});
	});

	test('returns null when profile is malformed', done => {
		let getter = new Getter({response: MALFORMED_PROFILE_RESULT});
		let client = new GH({getter});
		client.get({username: 'whatever'}).then(user => {
			expect(user.error).toEqual(
				"Could not find a parsable user profile."
			);
			done();
		}).catch(err => {
			done(err);
		});
	});

	test('returns null for non-object JSON profile', done => {
		let getter = new Getter({response: NON_OBJECT_PROFILE_RESULT});
		let client = new GH({getter});
		client.get({username: 'whatever'}).then(user => {
			expect(user.error).toEqual(
				"Profile was not of type `object`."
			);
			done();
		}).catch(err => {
			done(err);
		});
	});
});
