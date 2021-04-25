# ex-gratia

> adj. As a favour; given as a gift. ([Wiktionary](https://en.wiktionary.org/wiki/ex_gratia))

Ex-gratia gives website and app owners a hands-off mechanism to share revenue with contributuors.

Ex-gratia currently support google ads as a revenue source. To facilitate revenue sharing, ex-gratia shares your ad space by "raffle" Google Publisher ID's, [per Google's own recommendation](https://adsense.googleblog.com/2008/07/sharing-your-ad-space.html). We're planning on adding others.

## Installation and Setup

#### 1. Install from NPM.

```
npm install ex-gratia
```

Or

```
yarn add ex-gratia
```

#### 2. Update your `package.json`.

Run the `ex-gratia` CLI prior to builds. This will scrapes your git log and write contributor data to the `ex-gratia` module.

```
"build": "npx ex-gratia && ..."
```

Or

```
"build": "yarn ex-gratia && ..."
```

#### 3. Include the Google Adsense tag in your app.

At build time, if you're generating any static pages, we suggest importing the main `ex-gratia` library and writing the Google tag:

```
const ExGratia = require('ex-gratia');
const eg = new ExGratia();
const tagHtml = eg.google.tag;
```

At runtime on the client, we provide a DOM node. In that case, we suggest importing the smaller `google` module.

```
const GoogleAds = require('ex-gratia/google');
const ga = new GoogleAds();
document.head.appendChild(ga.node);
```

#### 4. Let your contributors know.

Before contributors can benefit, they need to create an ex-gratia profile and add your site to their adsense account. (Otherwise, we can't find them and/or Google won't allow you to show ads on their behalf.)

You may direct contributors to the [Contributors Guide](contributors-guide.md).
