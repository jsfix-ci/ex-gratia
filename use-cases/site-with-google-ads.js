const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const { all: runAll } = require('../lib/index');

const TEMPDIR = '__test-artifacts-temp';

beforeAll(async done => {

	// TODO: do end-to-end (via CLI) testing here and create another
	// set of tests with `getter` injected for branch coverage.
	// execSync('yarn ex-gratia -o ' + TEMPDIR);
	await runAll({outputDir: TEMPDIR});

	done();
});

afterAll(done => {
	console.log('cleaning ' + TEMPDIR);
	rimraf(TEMPDIR, {}, done);
});

describe('ex-gratia cli', () => {

	test('can be run with specified output directory', () => {
		const filesCreated = fs.readdirSync(TEMPDIR);
		expect(filesCreated.sort()).toEqual([
			'google_ads.json',
			'summary.json'
		].sort());

		// each file should be json
		filesCreated.forEach(file => {
			const fullpath = path.join('..', TEMPDIR, file);
			expect(require(fullpath)).toBeTruthy();
		});
	});

	test('produces a google-ad-id rotation spec', () => {
		const exGratiaConfig = require('../ex-gratia-config.json');
		const rotation = require(path.join('..', TEMPDIR, 'google_ads.json'));

		expect(rotation.defaultId).toEqual(exGratiaConfig.google_adsense.id);
		expect(rotation.contributors).toBeTruthy();
		expect(rotation.contributors.length).toBeGreaterThan(0);
		rotation.contributors.forEach(contributor => {
			expect(contributor.weight).toBeGreaterThan(0);
			expect(contributor.id).toBeTruthy();
		});
	});
});
