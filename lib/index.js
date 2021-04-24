const summary = require('../data/summary');
const googleAds = require('../data/google_ads');
const Raffle = require('./raffle');

class ExGratia {
	summary = summary;
	googleAds = googleAds;

	googleAdId = this.pickGoogleAdId();
	googleAdsAutoTag = this.buildGoogleAdAutoTag(this.googleAdId);

	constructor(path) {
	};

	pickGoogleAdId() {
		const raffle = new Raffle(googleAds.contributors.map(
			c => ({ id: c.id, tickets: c.weight })
		));
		return raffle.draw().id;
	};

	buildGoogleAdAutoTag(id) {
		return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}" crossorigin="anonymous"></script>`;
	};
};

module.exports = ExGratia;
