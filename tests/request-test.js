const request = require('../lib/request.js');
const Getter = require('../fakes/fake-getter.js');

let example_url = 'https://example.com';

function expectSuccess({
	exec = request.get,
	url = example_url,
	getter,
	done,
	data
}) {
	exec({url, getter}).then(d => {
		expect(d).toEqual(data);
		done();
	}).catch(err => {
		done(err);
	});
};

function expectFailure({
	exec = request.get,
	url = example_url,
	getter,
	done,
	error
}) {
	exec({url, getter}).then(d => {
		done('Should not have received success data');
	}).catch(err => {
		for (var k in error) {
			expect(err[k]).toEqual(error[k]);
		}
		done();
	});
};

describe('request.get', () => {

	test('can perform simple GET request', done => {
		let getter = new Getter({response: 'Hello world'});
		expectSuccess({getter, data: 'Hello world', done}); 
	});

	test('calls catch when errors occur', done => {
		let getter = new Getter({error: 'ahhh'});
		expectFailure({getter, error: new Error('ahhh'), done});
	});

	test('calls with non-200 response codes fail', done => {
		let getter = new Getter({response: 'ahhh', statusCode: 500});
		let error = {
			message: 'ahhh',
			code: 500
		};
		expectFailure({getter, error, done});
	});

});

describe('request.getJSON', () => {
	test('parses JSON results', done => {
		let data = {a: 'b'};
		let getter = new Getter({response: JSON.stringify(data)});
		expectSuccess({exec: request.getJSON, getter, data, done});
	});
	
	test('rejects non-JSON results', done => {
		let data = 'abc';
		let getter = new Getter({response: 'abc'});
		let error = {
			message: "Unexpected token a in JSON at position 0"
		};
		expectFailure({exec: request.getJSON, getter, error, done});
	});

	test('provides a response code for non-200s', done => {
		let response = 'bad stuff';
		let error = {
			message: response,
			code: 400
		};
		let getter = new Getter({response, statusCode: error.code});
		expectFailure({exec: request.getJSON, getter, error, done});
	});
});
