const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const TEMPDIR = '__test-artifacts-temp';

beforeAll(() => {
	execSync('yarn ex-gratia -o ' + TEMPDIR);
});

afterAll(done => {
	console.log('cleaning ' + TEMPDIR);
	rimraf(TEMPDIR, {}, done);
});

describe('ex-gratia cli', () => {
	test('we can run the cli with specified output', () => {
		const filesCreated = fs.readdirSync(TEMPDIR);
		expect(filesCreated.sort()).toEqual([
			'summary.json'
		].sort());

		// each file should be json
		filesCreated.forEach(file => {
			const fullpath = path.join('..', TEMPDIR, file);
			expect(require(fullpath)).toBeTruthy();
		});
	});
});
