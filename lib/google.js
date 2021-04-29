const data = require('../data/google_ads');
const Raffle = require('./raffle');

class GoogleAds {
	data = data;
	id = this.pickId();
	node = this.buildNode(this.id);

	pickId() {
		const raffle = new Raffle(data.contributors.map(
			c => ({ id: c.id, tickets: c.weight })
		));
		return raffle.draw().id;
	};

	buildNode(id) {
		if (typeof(document) === 'undefined') return null;
		const n = global.document.createElement('script');
		n.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`;
		n.crossorigin = 'anonymous';
		n.async = true;
		return n;
	};

	install() {
		document.head.appendChild(this.node);
	};
};

module.exports = GoogleAds;
