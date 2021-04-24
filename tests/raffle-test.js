const Raffle = require('../lib/raffle');

describe('Raffle', () => {
	test('can pick a winner from a list of one', () => {
		const raffle = new Raffle([{name: 'bob', tickets: 100}]);
		expect(raffle.draw()).toEqual({name: 'bob', tickets: 100});
	});

	test('can pick a winner from a list', () => {
		const raffle = new Raffle([
			{name: 'bob', tickets: 100},
			{name: 'sally', tickets: 100},
			{name: 'barb', tickets: 100},
			{name: 'brutus', tickets: 100},
		]);
		expect(raffle.draw().name).toBeTruthy();
	});

	test('picks the expected winners', () => {
		const raffle = new Raffle([
			{name: 'winner', tickets: 1000},
			{name: 'loser', tickets: 1}
		]);
		let countOfWinner = 0;
		for (var i = 0; i < 100; i++) {
			countOfWinner += raffle.draw().name === 'winner' ? 1 : 0;
		}
		expect(countOfWinner).toBeGreaterThan(90);
	});
	
	test('picks the expected winners with fractional tickets', () => {
		const raffle = new Raffle([
			{name: 'winner', tickets: .999},
			{name: 'loser', tickets: .001}
		]);
		let countOfWinner = 0;
		for (var i = 0; i < 100; i++) {
			countOfWinner += raffle.draw().name === 'winner' ? 1 : 0;
		}
		expect(countOfWinner).toBeGreaterThan(90);
	});
});
