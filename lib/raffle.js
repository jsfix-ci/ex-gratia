class Raffle {
	constructor(entries) {
		this.entries = entries;
	}

	shuffle() {
		this.entries.sort((a,b) => Math.random > 0.5);
	}

	countTickets() {
		return this.entries.reduce((sum, entry) => {
			return sum + entry.tickets;
		}, 0);
	}

	draw(andRemove) {
		let winner;
		let ticketsSeen = 0;

		// no flooring ... we support fractional tickets :) 
		const winningTicket = Math.random() * this.countTickets();

		for (winner of this.entries) {
			ticketsSeen += winner.tickets;
			if (ticketsSeen >= winningTicket) {
				break;
			}
		}
		if (andRemove) {
			this.entries = this.entries.filter(entry => entry != winner);
		}
		return winner;
	}
}

module.exports = Raffle;
